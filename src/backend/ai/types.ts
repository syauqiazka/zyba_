// src/backend/ai/types.ts
// ZYBA Central AI Architecture & Types (SPEC AGENTS.md 19, 21)

import { PersonaId } from "./personas";

export type AIProviderId = "gemini" | "groq" | "mistral" | "openrouter" | "openai" | "fallback";

export type AIMode =
  | "companion"     // Wellness & empatik dengan persona (KINA/OLLIE/RUBI/BRUNO)
  | "general_chat"  // Obrolan umum
  | "coding"        // Coding, bug fixing, penjelasan kode
  | "learning"      // Belajar & bimbingan materi terstruktur
  | "analysis";     // Analisis kritis mendalam

export type AIModelType =
  // Google Gemini (Model Resmi Google Generative AI)
  | "gemini-flash-lite-latest"
  | "gemini-2.5-flash"
  | "gemini-2.0-flash"
  | "gemini-1.5-flash"
  // Groq (LPU Ultra-fast Inference)
  | "openai/gpt-oss-20b"
  | "qwen/qwen3.8-27b"
  | "llama-3.3-70b-versatile"
  | "llama-3.1-8b-instant"
  | "qwen-2.5-32b"
  // Mistral AI
  | "ministral-8b-latest"
  | "mistral-small-latest"
  // OpenRouter Free Models
  | "gemma-4-31b-free"
  | "nemotron-3-ultra-free"
  | "north-mini-code-free"
  // OpenAI (Modular Future-ready)
  | "openai-gpt4o-mini"
  | "openai-premium"
  // Internal Fallback
  | "zyba-default"
  // Legacy aliases for backward compatibility with saved settings
  | "gemini-3.8-flash"
  | "gemini-3.7-flash"
  | "gemini-3.5-flash-lite"
  | "llama-3.3-70b"
  | "qwen-3.8-27b"
  | "ministral-8b"
  | "openrouter-free"
  | "nemotron-3-ultra"
  | "gemma-4-31b";

export interface ChatMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
}

export interface AIRequestContext {
  message: string;
  mode?: AIMode;
  model?: AIModelType;
  persona?: PersonaId;
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
  history?: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  userPlan?: "FREE" | "PLUS";
  userId?: string;
}

export interface AIExecutionResult {
  reply: string;
  provider: AIProviderId;
  modelUsed: AIModelType;
  emotionTag?: string;
  latencyMs: number;
  isFallback: boolean;
  requestedModel?: AIModelType;
  fallbackReason?: string;
  providerStatus: "API_LIVE" | "PERSONA_FALLBACK";
}

export interface ModelDescriptor {
  id: AIModelType;
  canonicalId: string; // The exact model string sent to the provider's API
  provider: AIProviderId;
  label: string;
  description: string;
  badge?: string;
  icon: string;
  requiresApiKey: string;
  recommendedModes: AIMode[];
  tier: "FREE" | "PLUS" | "ALL";
  maxContextTokens: number;
  defaultTemperature: number;
}
