// src/backend/ai/providers/geminiAdapter.ts
// Google Gemini Provider Adapter (Official REST API v1beta)

import {
  ProviderCallParams,
  ProviderCallResult,
  HealthCheckResult,
  fetchWithTransientRetry,
  sanitizeHistory,
} from "./baseAdapter";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export const GeminiAdapter = {
  id: "gemini" as const,

  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY?.trim();
  },

  async call(params: ProviderCallParams): Promise<ProviderCallResult> {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) throw new Error("GEMINI_KEY_NOT_CONFIGURED");

    const modelName = params.modelName || DEFAULT_GEMINI_MODEL;
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

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

    const res = await fetchWithTransientRetry(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      8000,
      "Gemini"
    );

    if (res.status === 429) {
      throw new Error("RATE_LIMIT");
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
          error: `HTTP ${res.status} (${res.statusText})`,
        };
      }

      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name?.replace("models/", "")).slice(0, 5);

      return {
        provider: "gemini",
        configured: true,
        authenticated: true,
        latencyMs,
        activeModels: models,
      };
    } catch (e: any) {
      return {
        provider: "gemini",
        configured: true,
        authenticated: false,
        latencyMs: Date.now() - start,
        error: e?.message || "Connection timeout",
      };
    }
  },
};
