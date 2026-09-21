import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { processMultiModelAIResponse, AIModelType } from "@/backend/ai/aiModelManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      model = "gemini-1.5-flash",
      communicationStyle = "CASUAL",
      history = [],
    } = body as {
      message: string;
      model?: AIModelType;
      communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
      history?: { role: "USER" | "ASSISTANT"; content: string }[];
    };

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Konten pesan wajib diisi." }, { status: 400 });
    }

    // 1. Safety Crisis Keyword Check
    const isRisk = detectRisk(message);
    if (isRisk) {
      return NextResponse.json({
        reply:
          "Zyba memprioritaskan keselamatanmu. Kami telah mengaktifkan nomor hotline pendampingan darurat resmi di bawah yang bisa kamu hubungi kapan saja secara gratis.",
        isRisk: true,
        crisisResources: CRISIS_RESOURCES,
        emotionTag: "Crisis Support Needed",
        modelUsed: model,
      });
    }

    // 2. Multi-Model AI Engine Routing (Gemini 1.5 Flash/Pro, GPT-4o, Llama 3, Claude 3.5, Fallback)
    const aiResult = await processMultiModelAIResponse({
      message,
      model,
      communicationStyle,
      history,
    });

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
