import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { processMultiModelAIResponse, AIModelType } from "@/backend/ai/aiModelManager";
import { PersonaId } from "@/backend/ai/personas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      model,
      persona = "KINA",
      communicationStyle,
      history = [],
    } = body as {
      message: string;
      model?: AIModelType;
      persona?: PersonaId;
      communicationStyle?: string;
      history?: { role: "USER" | "ASSISTANT"; content: string }[];
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

    return NextResponse.json({
      reply: aiResult.reply,
      isRisk: false,
      crisisResources: null,
      emotionTag: aiResult.emotionTag,
      modelUsed: aiResult.modelUsed,
      providerStatus: aiResult.providerStatus,
    });
  } catch (err: any) {
    console.error("[API Companion Error]:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
