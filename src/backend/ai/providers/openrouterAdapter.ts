// src/backend/ai/providers/openrouterAdapter.ts
// OpenRouter Provider Adapter (Open Source Models & Free Tier)

import {
  ProviderCallParams,
  ProviderCallResult,
  HealthCheckResult,
  fetchWithTransientRetry,
  sanitizeHistory,
} from "./baseAdapter";

const DEFAULT_OPENROUTER_MODEL = "google/gemma-4-31b-it:free";

const VERIFIED_FALLBACK_MODELS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "cohere/north-mini-code:free",
  "nvidia/nemotron-3.5-lightning:free",
];

export const OpenRouterAdapter = {
  id: "openrouter" as const,

  isConfigured(): boolean {
    return !!process.env.OPENROUTER_API_KEY?.trim();
  },

  async call(params: ProviderCallParams): Promise<ProviderCallResult> {
    const key = process.env.OPENROUTER_API_KEY?.trim();
    if (!key) throw new Error("OPENROUTER_KEY_NOT_CONFIGURED");

    const requestedModel = params.modelName || DEFAULT_OPENROUTER_MODEL;
    // Buat urutan fallback model OpenRouter agar jika 1 model free sedang overload, ada model lain yang menjawab
    const models = [requestedModel, ...VERIFIED_FALLBACK_MODELS.filter((m) => m !== requestedModel)];

    const history = sanitizeHistory(params.history);

    const messages = [
      ...(params.systemPrompt ? [{ role: "system", content: params.systemPrompt }] : []),
      ...history.map((h) => ({
        role: h.role === "USER" ? "user" : "assistant",
        content: h.content,
      })),
      { role: "user", content: params.message },
    ];

    const body = {
      models,
      route: "fallback",
      messages,
      max_tokens: params.maxTokens || 800,
      temperature: params.temperature ?? 0.7,
    };

    const res = await fetchWithTransientRetry(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "HTTP-Referer": "https://zyba.app",
          "X-Title": "ZYBA Companion",
        },
        body: JSON.stringify(body),
      },
      9000,
      "OpenRouter"
    );

    if (res.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[OpenRouterAdapter] HTTP ${res.status}:`, errText.slice(0, 300));
      throw new Error(`OPENROUTER_API_ERROR_${res.status}`);
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply || typeof reply !== "string") {
      throw new Error("OPENROUTER_EMPTY_RESPONSE");
    }

    const usage = data?.usage;
    return {
      reply: reply.trim(),
      rawUsage: usage
        ? {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
          }
        : undefined,
    };
  },

  async healthCheck(): Promise<HealthCheckResult> {
    const key = process.env.OPENROUTER_API_KEY?.trim();
    if (!key) {
      return { provider: "openrouter", configured: false, authenticated: false, error: "API Key not configured" };
    }

    const start = Date.now();
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          provider: "openrouter",
          configured: true,
          authenticated: false,
          latencyMs,
          error: `HTTP ${res.status} (${res.statusText})`,
        };
      }

      const data = await res.json();
      const freeModels = (data.data || [])
        .filter((m: any) => typeof m.id === "string" && m.id.endsWith(":free"))
        .map((m: any) => m.id)
        .slice(0, 5);

      return {
        provider: "openrouter",
        configured: true,
        authenticated: true,
        latencyMs,
        activeModels: freeModels,
      };
    } catch (e: any) {
      return {
        provider: "openrouter",
        configured: true,
        authenticated: false,
        latencyMs: Date.now() - start,
        error: e?.message || "Connection timeout",
      };
    }
  },
};
