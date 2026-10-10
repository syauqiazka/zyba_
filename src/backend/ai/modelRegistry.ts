// src/backend/ai/modelRegistry.ts
// Centralized AI Model Registry (AGENTS.md 19, SPEC Multi-Provider & Modes)

import { AIModelType, ModelDescriptor, AIMode, AIProviderId } from "./types";

export const MODEL_REGISTRY: ModelDescriptor[] = [
  // ── 1. Google Gemini (Tier Utama untuk Chat & Wellness) ──
  {
    id: "gemini-flash-lite-latest",
    canonicalId: "gemini-flash-lite-latest",
    provider: "gemini",
    label: "Gemini Flash Lite",
    description: "Model unggulan Google, respons super cepat (sub-detik) dan akurat.",
    badge: "Rekomendasi",
    icon: "⚡",
    requiresApiKey: "GEMINI_API_KEY",
    recommendedModes: ["companion", "general_chat", "learning"],
    tier: "ALL",
    maxContextTokens: 32000,
    defaultTemperature: 0.7,
  },
  {
    id: "gemini-2.0-flash",
    canonicalId: "gemini-flash-lite-latest",
    provider: "gemini",
    label: "Gemini Flash (Cepat)",
    description: "Generasi baru Gemini untuk respons kilat dan penalaran multimodal.",
    badge: "Cepat",
    icon: "🚀",
    requiresApiKey: "GEMINI_API_KEY",
    recommendedModes: ["general_chat", "analysis"],
    tier: "ALL",
    maxContextTokens: 32000,
    defaultTemperature: 0.7,
  },
  {
    id: "gemini-1.5-flash",
    canonicalId: "gemini-flash-lite-latest",
    provider: "gemini",
    label: "Gemini Flash",
    description: "Model stabil dan hemat untuk high-throughput everyday tasks.",
    badge: "Stabil",
    icon: "💨",
    requiresApiKey: "GEMINI_API_KEY",
    recommendedModes: ["companion", "learning"],
    tier: "ALL",
    maxContextTokens: 16000,
    defaultTemperature: 0.7,
  },

  // ── 2. Groq LPU (Inference Ultra-Cepat) ──
  {
    id: "openai/gpt-oss-20b",
    canonicalId: "openai/gpt-oss-20b",
    provider: "groq",
    label: "Groq OSS 20B",
    description: "Model Open Source di Groq LPU dengan kecepatan inferensi luar biasa.",
    badge: "Ultra Fast",
    icon: "⚡",
    requiresApiKey: "GROQ_API_KEY",
    recommendedModes: ["general_chat", "coding", "companion"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.6,
  },
  {
    id: "qwen/qwen3.8-27b",
    canonicalId: "qwen/qwen3.8-27b",
    provider: "groq",
    label: "Groq Qwen 27B",
    description: "Penalaran matematika, logika, dan coding yang tangguh via Groq.",
    badge: "Logika & Code",
    icon: "🧠",
    requiresApiKey: "GROQ_API_KEY",
    recommendedModes: ["coding", "learning"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.5,
  },
  {
    id: "llama-3.3-70b-versatile",
    canonicalId: "openai/gpt-oss-20b",
    provider: "groq",
    label: "Groq Llama 3.3 70B",
    description: "Model Open Source 70B dengan inferensi super cepat di hardware LPU.",
    badge: "Kilat",
    icon: "🦙",
    requiresApiKey: "GROQ_API_KEY",
    recommendedModes: ["general_chat", "coding", "analysis"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.6,
  },

  // ── 3. Mistral AI (Eropa / Penalaran Terstruktur) ──
  {
    id: "ministral-8b-latest",
    canonicalId: "ministral-8b-latest",
    provider: "mistral",
    label: "Ministral 8B",
    description: "Model efisien Mistral AI, reflektif dan terstruktur untuk chat.",
    badge: "Reflektif",
    icon: "🌊",
    requiresApiKey: "MISTRAL_API_KEY",
    recommendedModes: ["companion", "learning"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.7,
  },
  {
    id: "mistral-small-latest",
    canonicalId: "mistral-small-latest",
    provider: "mistral",
    label: "Mistral Small",
    description: "Kemampuan penalaran mendalam dan analisis yang seimbang.",
    badge: "Analisis",
    icon: "🎯",
    requiresApiKey: "MISTRAL_API_KEY",
    recommendedModes: ["analysis", "coding"],
    tier: "ALL",
    maxContextTokens: 16000,
    defaultTemperature: 0.5,
  },

  // ── 4. OpenRouter Free Tier (Akses Terbuka & Variatif) ──
  {
    id: "gemma-4-31b-free",
    canonicalId: "google/gemma-4-31b-it:free",
    provider: "openrouter",
    label: "Google Gemma 4 31B",
    description: "Model open multimodal mutakhir dari Google via OpenRouter free tier.",
    badge: "Gratis",
    icon: "💎",
    requiresApiKey: "OPENROUTER_API_KEY",
    recommendedModes: ["companion", "general_chat", "analysis"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.7,
  },
  {
    id: "nemotron-3-ultra-free",
    canonicalId: "nvidia/nemotron-3-ultra-550b-a55b:free",
    provider: "openrouter",
    label: "NVIDIA Nemotron 3 Ultra",
    description: "Frontier MoE reasoning model dari NVIDIA via OpenRouter free tier.",
    badge: "Frontier",
    icon: "🟢",
    requiresApiKey: "OPENROUTER_API_KEY",
    recommendedModes: ["analysis", "learning"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.6,
  },
  {
    id: "north-mini-code-free",
    canonicalId: "cohere/north-mini-code:free",
    provider: "openrouter",
    label: "North Mini Code",
    description: "Model khusus coding dan sintaks via OpenRouter free tier.",
    badge: "Code",
    icon: "💻",
    requiresApiKey: "OPENROUTER_API_KEY",
    recommendedModes: ["coding"],
    tier: "ALL",
    maxContextTokens: 8000,
    defaultTemperature: 0.3,
  },

  // ── 5. OpenAI (Modular / Ready Saat Diaktifkan) ──
  {
    id: "openai-premium",
    canonicalId: process.env.OPENAI_PREMIUM_MODEL || "gpt-4o-mini",
    provider: "openai",
    label: "GPT Premium",
    description: "Inference prioritas tingkat lanjut OpenAI untuk pelanggan Zyba Plus.",
    badge: "Plus",
    icon: "✨",
    requiresApiKey: "OPENAI_API_KEY",
    recommendedModes: ["companion", "analysis", "coding"],
    tier: "PLUS",
    maxContextTokens: 16000,
    defaultTemperature: 0.7,
  },
];

/**
 * Mapping alias lama ke ID kanonikal modern
 */
export const LEGACY_MODEL_ALIAS_MAP: Record<string, AIModelType> = {
  "gemini-3.8-flash": "gemini-flash-lite-latest",
  "gemini-3.7-flash": "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite": "gemini-flash-lite-latest",
  "gemini-2.5-flash": "gemini-flash-lite-latest",
  "gemini-2.0-flash": "gemini-flash-lite-latest",
  "gemini-1.5-flash": "gemini-flash-lite-latest",
  "llama-3.3-70b": "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile": "openai/gpt-oss-20b",
  "llama-3.1-8b-instant": "openai/gpt-oss-20b",
  "qwen-3.8-27b": "qwen/qwen3.8-27b",
  "qwen-2.5-32b": "qwen/qwen3.8-27b",
  "ministral-8b": "ministral-8b-latest",
  "openrouter-free": "gemma-4-31b-free",
  "nemotron-3-ultra": "nemotron-3-ultra-free",
  "gemma-4-31b": "gemma-4-31b-free",
};

/**
 * Resolusi model ID dengan dukungan alias lama
 */
export function resolveModelDescriptor(modelId?: string): ModelDescriptor | undefined {
  if (!modelId) return undefined;
  const canonicalId = LEGACY_MODEL_ALIAS_MAP[modelId] || modelId;
  return MODEL_REGISTRY.find((m) => m.id === canonicalId || m.canonicalId === modelId);
}

/**
 * Mendapatkan model yang aktif (API key terkonfigurasi)
 */
export function getAvailableModels(userPlan: "FREE" | "PLUS" = "FREE"): ModelDescriptor[] {
  return MODEL_REGISTRY.filter((model) => {
    // 1. Cek ketersediaan API key
    const apiKey = process.env[model.requiresApiKey];
    if (!apiKey) return false;

    // 2. Cek kesesuaian plan
    if (model.tier === "PLUS" && userPlan !== "PLUS") {
      return false;
    }

    return true;
  });
}

/**
 * Dapatkan model default untuk mode tertentu berdasarkan ketersediaan provider saat runtime
 */
export function getDefaultModelForMode(mode: AIMode = "companion", userPlan: "FREE" | "PLUS" = "FREE"): ModelDescriptor {
  const available = getAvailableModels(userPlan);

  // Cari model tersedia yang direkomendasikan untuk mode tersebut
  const recommended = available.find((m) => m.recommendedModes.includes(mode));
  if (recommended) return recommended;

  // Fallback ke model tersedia pertama
  if (available.length > 0) return available[0];

  // Jika tidak ada API key sama sekali, kembalikan descriptor Gemini pertama sebagai default
  return MODEL_REGISTRY[0];
}

/**
 * Cek apakah model tersedia untuk digunakan
 */
export function isModelAvailable(modelId: string, userPlan: "FREE" | "PLUS" = "FREE"): boolean {
  const desc = resolveModelDescriptor(modelId);
  if (!desc) return false;
  const apiKey = process.env[desc.requiresApiKey];
  if (!apiKey) return false;
  if (desc.tier === "PLUS" && userPlan !== "PLUS") return false;
  return true;
}
