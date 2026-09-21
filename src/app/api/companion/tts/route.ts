import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { mkdtemp, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

const execAsync = promisify(exec);

// Edge TTS via edge-tts CLI (npm i -g edge-tts or local install)
// Fallback: return null and client uses Web Speech API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice = "id-ID-ArdiNeural" } = body as { text: string; voice?: string };

    if (!text) return NextResponse.json({ error: "Text wajib diisi." }, { status: 400 });

    // Try edge-tts CLI
    const tmpDir = await mkdtemp(path.join(tmpdir(), "zyba-tts-"));
    const outFile = path.join(tmpDir, "speech.mp3");

    try {
      // edge-tts must be installed: pip install edge-tts OR npx edge-tts
      await execAsync(`edge-tts --voice ${voice} --text "${text.replace(/"/g, "'")}" --write-media "${outFile}"`, { timeout: 15000 });
      const audioBuffer = await readFile(outFile);
      await unlink(outFile).catch(() => {});

      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audioBuffer.length),
          "Cache-Control": "no-store",
        },
      });
    } catch (cliErr) {
      // Edge TTS not available — client falls back to Web Speech API
      console.warn("[TTS] edge-tts unavailable, client should use Web Speech API:", cliErr);
      return NextResponse.json({ fallback: true, message: "Edge TTS tidak tersedia, gunakan Web Speech API." }, { status: 200 });
    }
  } catch (err: any) {
    console.error("[TTS Error]:", err);
    return NextResponse.json({ error: err.message || "TTS error" }, { status: 500 });
  }
}
