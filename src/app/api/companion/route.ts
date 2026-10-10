import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { processMultiModelAIResponse, AIModelType } from "@/backend/ai/aiModelManager";
import { PersonaId } from "@/backend/ai/personas";
import { AIMode } from "@/backend/ai/types";
import { resolveModelDescriptor, getDefaultModelForMode } from "@/backend/ai/modelRegistry";
import { verifySessionToken } from "@/lib/auth";
import { consumeMessageQuota, releaseMessageQuota } from "@/backend/billing/entitlements";
import { companionDb } from "@/backend/db/companionClient";
import { checkAndUnlock } from "@/lib/achievements/engine";
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const chatLimit = await checkRateLimit(`chat:${session.userId}`, 20, 60);
    if (!chatLimit.allowed) {
      return rateLimitResponse(chatLimit.retryAfterSec, "Kamu mengirim pesan terlalu cepat.");
    }

    const body = await req.json();
    const {
      message,
      model,
      mode = "companion",
      persona = "KINA",
      communicationStyle,
      history = [],
      conversationId,
    } = body as {
      message: string;
      model?: AIModelType;
      mode?: AIMode;
      persona?: PersonaId;
      communicationStyle?: string;
      history?: { role: "USER" | "ASSISTANT"; content: string }[];
      conversationId?: string;
    };

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Konten pesan wajib diisi." }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 4000) {
      return NextResponse.json({ error: "Pesan terlalu panjang. Maksimal 4.000 karakter." }, { status: 400 });
    }

    if (!Array.isArray(history) || history.length > 30) {
      return NextResponse.json({ error: "Riwayat percakapan tidak valid." }, { status: 400 });
    }

    const safeHistory = history.map((item) => ({
      role: item?.role,
      content: item?.content,
    }));
    if (safeHistory.some((item) =>
      (item.role !== "USER" && item.role !== "ASSISTANT") ||
      typeof item.content !== "string" ||
      item.content.length > 4000
    )) {
      return NextResponse.json({ error: "Riwayat percakapan tidak valid." }, { status: 400 });
    }

    if (conversationId && !conversationId.startsWith("conv-")) {
      const conversation = await companionDb.conversation.findUnique({
        where: { id: conversationId },
        select: { userId: true },
      });

      if (!conversation || conversation.userId !== session.userId) {
        return NextResponse.json(
          { error: "Percakapan tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    // Safety: crisis check SEBELUM persona — tidak ada persona yang bypass ini (AGENTS.md 10.5, 21)
    const isRisk = detectRisk(trimmedMessage);
    if (isRisk) {
      return NextResponse.json({
        reply: "Zyba memprioritaskan keselamatanmu. Nomor hotline pendampingan darurat resmi tersedia di bawah — bisa dihubungi kapan saja secara gratis.",
        isRisk: true,
        crisisResources: CRISIS_RESOURCES,
        emotionTag: "Crisis Support Needed",
        modelUsed: "zyba-default",
      });
    }

    // Reserve one slot only after payload validation and crisis handling.
    // Safety responses and malformed requests never consume the daily quota.
    const quotaCheck = await consumeMessageQuota(session.userId);

    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message:
            quotaCheck.plan === "FREE"
              ? "Kamu sudah mencapai batas 20 chat hari ini. Upgrade ke Zyba Plus untuk mendapatkan 60 chat/hari."
              : "Kamu sudah mencapai batas 60 chat Premium hari ini. Kuota akan reset besok.",
          remaining: quotaCheck.remaining,
          limit: quotaCheck.limit,
          plan: quotaCheck.plan,
        },
        { status: 403 }
      );
    }

    // Jika model openai-premium diminta oleh user Free, tolak
    if (model === "openai-premium" && quotaCheck.plan !== "PLUS") {
      await releaseMessageQuota(session.userId).catch(() => undefined);
      return NextResponse.json(
        { error: "Model Premium hanya tersedia untuk pelanggan Premium." },
        { status: 403 }
      );
    }

    // Resolusi model yang fleksibel & optimal
    let effectiveModel: AIModelType;
    if (model) {
      const resolved = resolveModelDescriptor(model);
      effectiveModel = (resolved ? resolved.id : model) as AIModelType;
    } else {
      // Default model sesuai mode & plan pengguna
      const defaultDesc = getDefaultModelForMode(mode, quotaCheck.plan);
      effectiveModel = defaultDesc.id;
    }

    // Otomatis tarik riwayat percakapan dari DB jika history dari client kosong
    let finalHistory = safeHistory;
    if (finalHistory.length === 0 && conversationId && !conversationId.startsWith("conv-")) {
      try {
        const recentMessages = await companionDb.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: "desc" },
          take: 12,
          select: { role: true, content: true },
        });
        finalHistory = recentMessages
          .reverse()
          .filter((m) => !!m.content)
          .map((m) => ({
            role: m.role as "USER" | "ASSISTANT",
            content: m.content as string,
          }));
      } catch (historyErr) {
        console.warn("[Companion] Failed to fetch context history from DB:", historyErr);
      }
    }

    let aiResult;
    try {
      aiResult = await processMultiModelAIResponse({
        message: trimmedMessage,
        model: effectiveModel,
        mode,
        persona,
        communicationStyle: communicationStyle as any,
        history: finalHistory,
        userPlan: quotaCheck.plan,
        userId: session.userId,
      });
    } catch (aiErr: any) {
      // AI failure must not burn the user's daily slot.
      try {
        await releaseMessageQuota(session.userId);
      } catch (releaseErr) {
        console.error("[Companion] Failed to release AI quota:", releaseErr);
      }

      if (aiErr?.message === "RATE_LIMIT") {
        return NextResponse.json(
          {
            error: "AI_TEMPORARILY_UNAVAILABLE",
            message: "Layanan AI sedang padat. Silakan coba lagi sebentar.",
          },
          { status: 503 }
        );
      }

      if (aiErr?.message?.includes("Kredensial API Key untuk model")) {
        return NextResponse.json(
          {
            error: "PROVIDER_AUTH_ERROR",
            message: aiErr.message,
          },
          { status: 400 }
        );
      }
      throw aiErr;
    }

    // Save user message + AI reply to DB (skip if temporary conversationId)
    if (conversationId && !conversationId.startsWith("conv-")) {
      try {
        await companionDb.message.createMany({
          data: [
            {
              conversationId,
              role: "USER",
              content: message,
            },
            {
              conversationId,
              role: "ASSISTANT",
              content: aiResult.reply,
              modelUsed: aiResult.modelUsed,
            },
          ],
        });

        // Update conversation timestamp
        await companionDb.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // Achievement & Badge check (fire-and-forget, no await to keep response fast)
        void (async () => {
          try {
            const convCount = await companionDb.conversation.count({
              where: { userId: session.userId },
            });

            await checkAndUnlock(session.userId, {
              type: "companion_message",
              conversationCount: convCount,
            });
          } catch (err) {
            console.warn("[Companion Achievement] Check error:", err);
          }

          try {
            const { triggerBadgeCheck } = await import("@/lib/badges/badgeService");
            await triggerBadgeCheck(session.userId, "companion_message");
          } catch (err) {
            console.warn("[Companion Badge] Check error:", err);
          }
        })();
      } catch (dbErr) {
        console.error("[Companion] Message save failed:", dbErr);
        // Continue — AI reply tetap dikembalikan meski save gagal
      }
    }

    return NextResponse.json({
      reply: aiResult.reply,
      isRisk: false,
      crisisResources: null,
      emotionTag: aiResult.emotionTag,
      modelUsed: aiResult.modelUsed,
      isFallback: aiResult.isFallback || false,
      requestedModel: aiResult.requestedModel,
      fallbackReason: aiResult.fallbackReason,
      latencyMs: aiResult.latencyMs,
      providerStatus: aiResult.providerStatus,
      quotaRemaining: Math.max(0, quotaCheck.remaining - 1),
      quotaLimit: quotaCheck.limit,
      plan: quotaCheck.plan,
    });
  } catch (err: any) {
    console.error("[API Companion Error]:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}