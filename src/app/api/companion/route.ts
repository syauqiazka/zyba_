import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { processMultiModelAIResponse, AIModelType } from "@/backend/ai/aiModelManager";
import { PersonaId } from "@/backend/ai/personas";
import { verifySessionToken } from "@/lib/auth";
import { checkMessageQuota } from "@/backend/billing/entitlements";
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

    const chatLimit = checkRateLimit(`chat:${session.userId}`, 20, 60);
    if (!chatLimit.allowed) {
      return rateLimitResponse(chatLimit.retryAfterSec, "Kamu mengirim pesan terlalu cepat.");
    }

    // Quota check (Bagian 27.4)
    const quotaCheck = await checkMessageQuota(session.userId);

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

    const body = await req.json();
    const {
      message,
      model,
      persona = "KINA",
      communicationStyle,
      history = [],
      conversationId,
    } = body as {
      message: string;
      model?: AIModelType;
      persona?: PersonaId;
      communicationStyle?: string;
      history?: { role: "USER" | "ASSISTANT"; content: string }[];
      conversationId?: string;
    };

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Konten pesan wajib diisi." }, { status: 400 });
    }

    // Safety: crisis check SEBELUM persona — tidak ada persona yang bypass ini (AGENTS.md 10.5, 21)
    const isRisk = detectRisk(message);
    if (isRisk) {
      return NextResponse.json({
        reply: "Zyba memprioritaskan keselamatanmu. Nomor hotline pendampingan darurat resmi tersedia di bawah — bisa dihubungi kapan saja secara gratis.",
        isRisk: true,
        crisisResources: CRISIS_RESOURCES,
        emotionTag: "Crisis Support Needed",
        modelUsed: "zyba-default",
      });
    }

    // Free users can use the existing provider pool. Premium is pinned to
    // the paid OpenAI model so the 60-chat entitlement actually unlocks
    // paid inference instead of merely changing the quota number.
    const effectiveModel: AIModelType =
      quotaCheck.plan === "PLUS"
        ? "openai-premium"
        : (model || "gemini-3.8-flash");

    let aiResult;
    try {
      aiResult = await processMultiModelAIResponse({
        message,
        model: effectiveModel,
        persona,
        history,
      });
    } catch (aiErr: any) {
      if (
        aiErr?.message === "PREMIUM_AI_NOT_CONFIGURED" ||
        aiErr?.message === "PREMIUM_AI_UNAVAILABLE" ||
        aiErr?.message === "PREMIUM_AI_EMPTY_RESPONSE"
      ) {
        return NextResponse.json(
          {
            error: "PREMIUM_AI_UNAVAILABLE",
            message:
              "AI Premium sedang tidak tersedia. Silakan coba lagi beberapa saat lagi.",
          },
          { status: 503 }
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
    const { triggerBadgeCheck } = await import(
      "@/lib/badges/badgeService"
    );

    await triggerBadgeCheck(
      session.userId,
      "companion_message"
    );
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