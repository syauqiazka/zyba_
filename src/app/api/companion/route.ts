import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { processMultiModelAIResponse, AIModelType } from "@/backend/ai/aiModelManager";
import { PersonaId } from "@/backend/ai/personas";
import { verifySessionToken } from "@/lib/auth";
import { checkMessageQuota } from "@/backend/billing/entitlements";
import { companionDb } from "@/backend/db/companionClient";

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

    // Quota check (Bagian 27.4)
    const quotaCheck = await checkMessageQuota(session.userId);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: "Kamu sudah mencapai batas 20 pesan hari ini. Upgrade ke Zyba Plus untuk chat unlimited.",
          remaining: quotaCheck.remaining,
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

    const aiResult = await processMultiModelAIResponse({ message, model, persona, history });

    // Save user message + AI reply to DB
    if (conversationId) {
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
    }

    return NextResponse.json({
      reply: aiResult.reply,
      isRisk: false,
      crisisResources: null,
      emotionTag: aiResult.emotionTag,
      modelUsed: aiResult.modelUsed,
      providerStatus: aiResult.providerStatus,
      quotaRemaining: quotaCheck.remaining - 1, // after this message
    });
  } catch (err: any) {
    console.error("[API Companion Error]:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
