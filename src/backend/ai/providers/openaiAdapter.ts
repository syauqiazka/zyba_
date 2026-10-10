// src/backend/ai/providers/openaiAdapter.ts
// OpenAI Provider Adapter (Modular / Ready when enabled)

import {
  ProviderCallParams,
  ProviderCallResult,
  HealthCheckResult,
  fetchWithTransientRetry,
  sanitizeHistory,
} from "./baseAdapter";

const DEFAULT_OPENAI_MODEL = process.env.OPENAI_PREMIUM_MODEL || "gpt-4o-mini";

export const OpenAIAdapter = {
  id: "openai" as const,

  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY?.trim();
  },

  async call(params: ProviderCallParams): Promise<ProviderCallResult> {
    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) throw new Error("OPENAI_KEY_NOT_CONFIGURED");

    const modelName = params.modelName || DEFAULT_OPENAI_MODEL;
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
      model: modelName,
      messages,
      max_tokens: params.maxTokens || 800,
      temperature: params.temperature ?? 0.7,
    };

    const res = await fetchWithTransientRetry(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
      },
      9000,
      "OpenAI"
    );

    if (res.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[OpenAIAdapter] HTTP ${res.status}:`, errText.slice(0, 300));
      throw new Error(`OPENAI_API_ERROR_${res.status}`);
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply || typeof reply !== "string") {
      throw new Error("OPENAI_EMPTY_RESPONSE");
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
    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) {
      return { provider: "openai", configured: false, authenticated: false, error: "API Key not configured" };
    }

    const start = Date.now();
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          provider: "openai",
          configured: true,
          authenticated: false,
          latencyMs,
          error: `HTTP ${res.status} (${res.statusText})`,
        };
      }

      return {
        provider: "openai",
        configured: true,
        authenticated: true,
        latencyMs,
      };
    } catch (e: any) {
      return {
        provider: "openai",
        configured: true,
        authenticated: false,
        latencyMs: Date.now() - start,
        error: e?.message || "Connection timeout",
      };
    }
  },
};
