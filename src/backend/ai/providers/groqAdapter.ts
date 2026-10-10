// src/backend/ai/providers/groqAdapter.ts
// Groq LPU Provider Adapter (OpenAI-compatible REST API)

import {
  ProviderCallParams,
  ProviderCallResult,
  HealthCheckResult,
  fetchWithTransientRetry,
  sanitizeHistory,
} from "./baseAdapter";

const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";
const STABLE_GROQ_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
];

export const GroqAdapter = {
  id: "groq" as const,

  isConfigured(): boolean {
    return !!process.env.GROQ_API_KEY?.trim();
  },

  async call(params: ProviderCallParams): Promise<ProviderCallResult> {
    const key = process.env.GROQ_API_KEY?.trim();
    if (!key) throw new Error("GROQ_KEY_NOT_CONFIGURED");

    let modelName = params.modelName || DEFAULT_GROQ_MODEL;
    if (modelName === "llama-3.3-70b-versatile" || modelName === "llama-3.3-70b") {
      modelName = "openai/gpt-oss-20b";
    }

    const history = sanitizeHistory(params.history);

    const messages = [
      ...(params.systemPrompt ? [{ role: "system", content: params.systemPrompt }] : []),
      ...history.map((h) => ({
        role: h.role === "USER" ? "user" : "assistant",
        content: h.content,
      })),
      { role: "user", content: params.message },
    ];

    const candidateModels = [modelName, ...STABLE_GROQ_MODELS.filter((m) => m !== modelName)];
    let lastError: Error | null = null;

    for (const mName of candidateModels) {
      const body = {
        model: mName,
        messages,
        max_tokens: params.maxTokens || 800,
        temperature: params.temperature ?? 0.6,
      };

      try {
        const res = await fetchWithTransientRetry(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify(body),
          },
          7000,
          "Groq"
        );

        if (res.status === 429) {
          throw new Error("RATE_LIMIT");
        }

        if (res.status === 404) {
          console.warn(`[GroqAdapter] Model ${mName} not found (404), trying next...`);
          continue;
        }

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.warn(`[GroqAdapter] HTTP ${res.status}:`, errText.slice(0, 300));
          throw new Error(`GROQ_API_ERROR_${res.status}`);
        }

        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply || typeof reply !== "string") {
          throw new Error("GROQ_EMPTY_RESPONSE");
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
      } catch (err: any) {
        if (err?.message === "RATE_LIMIT" || err?.message?.includes("401")) {
          throw err;
        }
        lastError = err;
      }
    }

    throw lastError || new Error("GROQ_API_REQUEST_FAILED");
  },

  async healthCheck(): Promise<HealthCheckResult> {
    const key = process.env.GROQ_API_KEY?.trim();
    if (!key) {
      return { provider: "groq", configured: false, authenticated: false, error: "API Key not configured" };
    }

    const start = Date.now();
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          provider: "groq",
          configured: true,
          authenticated: false,
          latencyMs,
          error: `HTTP ${res.status} (${res.statusText})`,
        };
      }

      const data = await res.json();
      const models = (data.data || []).map((m: any) => m.id).slice(0, 5);

      return {
        provider: "groq",
        configured: true,
        authenticated: true,
        latencyMs,
        activeModels: models,
      };
    } catch (e: any) {
      return {
        provider: "groq",
        configured: true,
        authenticated: false,
        latencyMs: Date.now() - start,
        error: e?.message || "Connection timeout",
      };
    }
  },
};
