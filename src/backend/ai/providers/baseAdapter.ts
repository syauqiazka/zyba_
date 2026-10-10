// src/backend/ai/providers/baseAdapter.ts
// Shared utilities for provider adapters

import { ChatMessage } from "../types";

export interface ProviderCallParams {
  modelName: string;
  systemPrompt: string;
  message: string;
  history?: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ProviderCallResult {
  reply: string;
  rawUsage?: { promptTokens?: number; completionTokens?: number };
}

export interface HealthCheckResult {
  provider: string;
  configured: boolean;
  authenticated: boolean;
  latencyMs?: number;
  activeModels?: string[];
  error?: string;
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 2;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithTransientRetry(
  url: string,
  init: RequestInit,
  timeoutMs = 8000,
  providerTag = "Provider"
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!RETRYABLE_STATUS.has(response.status) || attempt === MAX_ATTEMPTS) {
        return response;
      }

      const retryAfter = Number(response.headers.get("retry-after"));
      const retryDelayMs = Number.isFinite(retryAfter)
        ? Math.min(Math.max(retryAfter * 1000, 250), 2000)
        : attempt * 500;

      console.warn(`[${providerTag}] Status ${response.status}; retrying in ${retryDelayMs}ms (attempt ${attempt}/${MAX_ATTEMPTS})`);
      await sleep(retryDelayMs);
    } catch (error: any) {
      lastError = error;
      const isTransient = error?.name === "AbortError" || error?.name === "TimeoutError" || error?.name === "TypeError";
      if (!isTransient || attempt === MAX_ATTEMPTS) {
        throw error;
      }
      const retryDelayMs = attempt * 500;
      console.warn(`[${providerTag}] Transient error: ${error?.message}; retrying in ${retryDelayMs}ms`);
      await sleep(retryDelayMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`${providerTag}_REQUEST_FAILED`);
}

/**
 * Batasi riwayat pesan agar tidak melebihi konteks maksimum
 */
export function sanitizeHistory(history?: ChatMessage[], maxTurns = 12): ChatMessage[] {
  if (!Array.isArray(history) || history.length === 0) return [];
  // Ambil N turn terakhir
  const sliced = history.slice(-maxTurns);
  return sliced.map((item) => ({
    role: item.role === "USER" ? "USER" : item.role === "SYSTEM" ? "SYSTEM" : "ASSISTANT",
    content: (item.content || "").slice(0, 3000), // Batas karakter per pesan
  }));
}
