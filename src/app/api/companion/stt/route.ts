import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GROQ_API_KEY;
    if (!key) return NextResponse.json({ error: "GROQ_API_KEY tidak dikonfigurasi." }, { status: 503 });

    const formData = await req.formData();
    const file = formData.get("audio") as File | null;
    if (!file) return NextResponse.json({ error: "File audio wajib dikirim." }, { status: 400 });

    // Forward ke Groq Whisper Large v3
    const groqForm = new FormData();
    groqForm.append("file", file, file.name || "audio.webm");
    groqForm.append("model", "whisper-large-v3");
    groqForm.append("language", "id");
    groqForm.append("response_format", "json");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: "Bearer " + key },
      body: groqForm,
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Groq STT error: " + err }, { status: res.status });
    }

    const data = await res.json();
    const transcript = data?.text ?? "";

    // Safety: pesan suara WAJIB dicek risk sebelum diproses (AGENTS.md 20.5, 10.5)
    const isRisk = transcript ? detectRisk(transcript) : false;

    return NextResponse.json({
      transcript,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
    });
  } catch (err: any) {
    console.error("[STT Error]:", err);
    return NextResponse.json({ error: err.message || "STT error" }, { status: 500 });
  }
}
