// src/backend/ai/aiModelManager.ts
// ZYBA AI Model Manager — Refactored to leverage CentralAIRouter (AGENTS.md 19, 21)

import { CentralAIRouter } from "./router";
import { AIModelType, AIMode, ChatMessage, AIExecutionResult } from "./types";
import { PersonaId } from "./personas";

export type { AIModelType };

export interface AIRequestParams {
  message: string;
  model?: AIModelType;
  persona?: PersonaId;
  mode?: AIMode;
  /** @deprecated use persona */
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
  history?: ChatMessage[];
  userPlan?: "FREE" | "PLUS";
  userId?: string;
}

export interface AIResponseResult {
  reply: string;
  modelUsed: AIModelType;
  emotionTag: string;
  providerStatus: "API_LIVE" | "PERSONA_FALLBACK";
  isFallback?: boolean;
  requestedModel?: AIModelType;
  fallbackReason?: string;
  latencyMs?: number;
}

/**
 * Endpoint eksekusi utama yang kompatibel dengan seluruh komponen ZYBA
 */
export async function processMultiModelAIResponse(params: AIRequestParams): Promise<AIResponseResult> {
  const result: AIExecutionResult = await CentralAIRouter.execute({
    message: params.message,
    model: params.model,
    mode: params.mode || "companion",
    persona: params.persona || "KINA",
    communicationStyle: params.communicationStyle,
    history: params.history,
    userPlan: params.userPlan || "FREE",
    userId: params.userId,
  });

  return {
    reply: result.reply,
    modelUsed: result.modelUsed,
    emotionTag: result.emotionTag || "Empathetic",
    providerStatus: result.providerStatus,
    isFallback: result.isFallback,
    requestedModel: result.requestedModel,
    fallbackReason: result.fallbackReason,
    latencyMs: result.latencyMs,
  };
}
