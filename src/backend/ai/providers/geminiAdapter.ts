// src/backend/ai/providers/geminiAdapter.ts
// Google Gemini Provider Adapter (Official REST API v1beta)

import {
  ProviderCallParams,
  ProviderCallResult,
  HealthCheckResult,
  fetchWithTransientRetry,
  sanitizeHistory,
} from "./baseAdapter";

const DEFAULT_GEMINI_MODEL = "gemini-flash-lite-latest";

// Daftar model Gemini yang terverifikasi aktif & kompatibel dengan v1beta generateContent
const STABLE_GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
];

export const GeminiAdapter = {
  id: "gemini" as const,

  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY?.trim();
  },

  async call(params: ProviderCallParams): Promise<ProviderCallResult> {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) throw new Error("GEMINI_KEY_NOT_CONFIGURED");

    // Normalisasi: jika model berakhiran flash fiktif/legacy, map ke model aktif
    let modelName = params.modelName || DEFAULT_GEMINI_MODEL;
    if (
      modelName === "gemini-2.5-flash" ||
      modelName === "gemini-1.5-flash" ||
      modelName === "gemini-3.8-flash" ||
      modelName === "gemini-3.7-flash" ||
      modelName === "gemini-1.5-pro" ||
      modelName === "gemini-2.0-flash"
    ) {
      modelName = "gemini-flash-lite-latest";
    }

    const history = sanitizeHistory(params.history);

    const contents = [
      ...history.map((h) => ({
        role: h.role === "USER" ? "user" : "model",
        parts: [{ text: h.content }],
      })),
      { role: "user", parts: [{ text: params.message }] },
    ];

    const body: Record<string, any> = {
      contents,
      generationConfig: {
        maxOutputTokens: params.maxTokens || 800,
        temperature: params.temperature ?? 0.7,
      },
    };

    if (params.systemPrompt) {
      body.system_instruction = { parts: [{ text: params.systemPrompt }] };
    }

    // Coba model kandidat terverifikasi jika ada 404
    const candidateModels = [modelName, ...STABLE_GEMINI_MODELS.filter((m) => m !== modelName)];
    let lastError: Error | null = null;

    for (const mName of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${key}`;

      try {
        const res = await fetchWithTransientRetry(
          endpoint,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
          10000,
          "Gemini"
        );

        if (res.status === 429) {
          throw new Error("RATE_LIMIT");
        }

        if (res.status === 401 || res.status === 403) {
          const errText = await res.text().catch(() => "");
          console.warn(`[GeminiAdapter] HTTP ${res.status}:`, errText.slice(0, 300));
          throw new Error(`GEMINI_API_ERROR_401: Invalid API Key`);
        }

        if (res.status === 404) {
          console.warn(`[GeminiAdapter] Model ${mName} not found (404), trying next model...`);
          continue;
        }

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.warn(`[GeminiAdapter] HTTP ${res.status}:`, errText.slice(0, 300));
          throw new Error(`GEMINI_API_ERROR_${res.status}`);
        }

        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply || typeof reply !== "string") {
          throw new Error("GEMINI_EMPTY_RESPONSE");
        }

        const usage = data?.usageMetadata;
        return {
          reply: reply.trim(),
          rawUsage: usage
            ? {
                promptTokens: usage.promptTokenCount,
                completionTokens: usage.candidatesTokenCount,
              }
            : undefined,
        };
      } catch (err: any) {
        if (err?.message?.includes("401") || err?.message === "RATE_LIMIT") {
          throw err;
        }
        lastError = err;
      }
    }

    throw lastError || new Error("GEMINI_API_REQUEST_FAILED");
  },

  async healthCheck(): Promise<HealthCheckResult> {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) {
      return { provider: "gemini", configured: false, authenticated: false, error: "API Key not configured" };
    }

    const start = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, {
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          provider: "gemini",
          configured: true,
          authenticated: false,
          latencyMs,
          error: `HTTP ${res.status}`,
        };
      }

      return {
        provider: "gemini",
        configured: true,
        authenticated: true,
        latencyMs,
      };
    } catch (err: any) {
      return {
        provider: "gemini",
        configured: true,
        authenticated: false,
        error: err?.message || "Health check timed out",
      };
    }
  },
};
