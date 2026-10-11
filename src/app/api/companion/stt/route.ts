import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";
import { verifySessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("auth-token")?.value ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Sesi login diperlukan." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid atau telah berakhir." }, { status: 401 });
    }

    const key = process.env.GROQ_API_KEY;
    if (!key) return NextResponse.json({ error: "Layanan transkripsi suara belum dikonfigurasi." }, { status: 503 });

    const formData = await req.formData();
    const file = formData.get("audio") as File | null;
    if (!file) return NextResponse.json({ error: "File audio wajib dikirim." }, { status: 400 });

    // Maksimal 15MB untuk audio
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file audio maksimal 15MB." }, { status: 400 });
    }

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
      const errText = await res.text().catch(() => "");
      console.warn("[Groq STT upstream error]:", res.status, errText);
      return NextResponse.json({ error: "Gagal memproses transkripsi suara di server." }, { status: 502 });
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
    return NextResponse.json({ error: "Gagal memproses audio input." }, { status: 500 });
  }
}
