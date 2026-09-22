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
    const { text, voice = "id-ID-ArdiNeural", useElevenLabs = false } = body as { 
      text: string; 
      voice?: string; 
      useElevenLabs?: boolean;
    };

    if (!text) return NextResponse.json({ error: "Text wajib diisi." }, { status: 400 });

    // Try ElevenLabs first if requested (premium, limit 10k chars/month)
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    if (useElevenLabs && elevenLabsKey) {
      try {
        const response = await fetch(
          "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", // Rachel voice
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": elevenLabsKey,
            },
            body: JSON.stringify({
              text: text.substring(0, 500), // limit per request (save quota)
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(Buffer.from(audioBuffer), {
            headers: {
              "Content-Type": "audio/mpeg",
              "X-TTS-Provider": "elevenlabs",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
        console.warn("[TTS] ElevenLabs failed:", response.status);
      } catch (elevenErr) {
        console.warn("[TTS] ElevenLabs error:", elevenErr);
      }
    }

    // Fallback: try edge-tts CLI
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
          "X-TTS-Provider": "edge-tts",
          "Cache-Control": "public, max-age=3600",
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
