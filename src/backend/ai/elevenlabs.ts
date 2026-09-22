// ElevenLabs TTS Configuration (AGENTS.md 19.2.2)
// ElevenLabs is PRIMARY TTS provider, Edge TTS removed as default

export const ELEVENLABS_CONFIG = {
  defaultModel: "eleven_flash_v2_5" as const,
  fallbackModel: "eleven_multilingual_v2" as const,
  defaultVoiceId: process.env.ELEVENLABS_DEFAULT_VOICE_ID || "21m00Tcm4TlvDq8ikWAM", // Rachel
  language: "id" as const,
  maxCharsPerRequest: 2500,
} as const;

export interface ElevenLabsGenerateParams {
  text: string;
  voiceId?: string;
  model?: string;
}

/**
 * Generate TTS audio using ElevenLabs API
 * Server-side only — never expose API key to client
 */
export async function generateElevenLabsAudio(
  params: ElevenLabsGenerateParams
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn("[ElevenLabs] API key not configured");
    return null;
  }

  const { text, voiceId = ELEVENLABS_CONFIG.defaultVoiceId, model = ELEVENLABS_CONFIG.defaultModel } = params;

  if (!text || text.trim().length === 0) return null;

  // Truncate to limit
  const truncatedText = text.substring(0, ELEVENLABS_CONFIG.maxCharsPerRequest);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: truncatedText,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
        signal: AbortSignal.timeout(15000), // 15s timeout
      }
    );

    if (!response.ok) {
      console.error(`[ElevenLabs] API error: ${response.status}`);
      
      // Try fallback model if primary failed
      if (model === ELEVENLABS_CONFIG.defaultModel && response.status !== 401) {
        console.log(`[ElevenLabs] Retrying with fallback model: ${ELEVENLABS_CONFIG.fallbackModel}`);
        return generateElevenLabsAudio({ 
          text: truncatedText, 
          voiceId, 
          model: ELEVENLABS_CONFIG.fallbackModel 
        });
      }
      
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("[ElevenLabs] Generation error:", error);
    return null;
  }
}
