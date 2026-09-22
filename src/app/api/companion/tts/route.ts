import { NextRequest, NextResponse } from "next/server";
import { generateElevenLabsAudio, ELEVENLABS_CONFIG } from "@/backend/ai/elevenlabs";
import { companionDb } from "@/backend/db/companionClient";

/**
 * POST /api/companion/tts
 * Generate TTS audio untuk message Companion
 * 
 * SPEC: AGENTS.md 19.2 — ElevenLabs sebagai PRIMARY provider
 * Fallback: browser SpeechSynthesis (Edge TTS REMOVED as default)
 * Cache: ttsAudioUrl di Message schema
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, text } = body as { messageId?: string; text: string };

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text wajib diisi" }, { status: 400 });
    }

    // If messageId provided, check cache first
    if (messageId) {
      try {
        const message = await companionDb.message.findUnique({
          where: { id: messageId },
          select: { ttsAudioUrl: true, ttsProvider: true, ttsGeneratedAt: true },
        });

        // Return cached audio if exists and not expired (24h)
        if (message?.ttsAudioUrl && message.ttsGeneratedAt) {
          const age = Date.now() - message.ttsGeneratedAt.getTime();
          if (age < 24 * 60 * 60 * 1000) {
            console.log(`[TTS] Cache hit for message ${messageId}`);
            return NextResponse.redirect(message.ttsAudioUrl);
          }
        }
      } catch (dbErr) {
        console.warn("[TTS] Cache check failed:", dbErr);
        // Continue to generation
      }
    }

    // PRIMARY: Try ElevenLabs
    const elevenLabsAudio = await generateElevenLabsAudio({ text });

    if (elevenLabsAudio) {
      const audioBuffer = Buffer.from(elevenLabsAudio);

      // TODO: Upload to Vercel Blob for persistent cache
      // For now, return directly
      // If messageId exists, save cache metadata
      if (messageId) {
        try {
          await companionDb.message.update({
            where: { id: messageId },
            data: {
              ttsProvider: "elevenlabs",
              ttsModel: ELEVENLABS_CONFIG.defaultModel,
              ttsGeneratedAt: new Date(),
              // ttsAudioUrl: blobUrl, // TODO: after Blob upload
            },
          });
        } catch (updateErr) {
          console.warn("[TTS] Cache save failed:", updateErr);
        }
      }

      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audioBuffer.length),
          "X-TTS-Provider": "elevenlabs",
          "X-TTS-Model": ELEVENLABS_CONFIG.defaultModel,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // FALLBACK: Tell client to use browser SpeechSynthesis
    console.log("[TTS] ElevenLabs unavailable, instructing client to use browser fallback");
    return NextResponse.json(
      {
        fallback: true,
        provider: "browser",
        message: "Audio tidak tersedia dari server. Gunakan browser TTS.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[TTS Error]:", err);
    return NextResponse.json(
      { error: "TTS generation failed", fallback: true },
      { status: 500 }
    );
  }
}
