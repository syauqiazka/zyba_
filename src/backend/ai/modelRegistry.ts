// Centralized AI Model Registry (AGENTS.md 19.4)
// Single source of truth untuk models yang tersedia

import { AIModelType } from "./aiModelManager";

export interface ModelDefinition {
  id: AIModelType;
  provider: "gemini" | "groq" | "mistral" | "openrouter";
  label: string;
  description: string;
  enabled: boolean;
  requiresApiKey: string; // env var name
}

export const MODEL_REGISTRY: ModelDefinition[] = [
  {
    id: "gemini-3.8-flash",
    provider: "gemini",
    label: "Gemini 3.8 Flash",
    description: "Model terbaru Google, tercepat untuk coding & wellness conversation",
    enabled: true,
    requiresApiKey: "GEMINI_API_KEY",
  },
  {
    id: "gemini-3.7-flash",
    provider: "gemini",
    label: "Gemini 3.7 Flash",
    description: "High-speed model untuk everyday tasks",
    enabled: true,
    requiresApiKey: "GEMINI_API_KEY",
  },
  {
    id: "gemini-3.5-flash-lite",
    provider: "gemini",
    label: "Gemini 3.5 Flash Lite",
    description: "Hemat, cocok untuk high-throughput",
    enabled: true,
    requiresApiKey: "GEMINI_API_KEY",
  },
  {
    id: "llama-3.3-70b",
    provider: "groq",
    label: "Llama 3.3 70B",
    description: "Open model dengan inference tercepat (Groq LPU)",
    enabled: true,
    requiresApiKey: "GROQ_API_KEY",
  },
  {
    id: "ministral-8b",
    provider: "mistral",
    label: "Ministral 8B",
    description: "Model compact Mistral, efficient untuk chat",
    enabled: true,
    requiresApiKey: "MISTRAL_API_KEY",
  },
  {
    id: "nemotron-3-ultra",
    provider: "openrouter",
    label: "Nemotron 3 Ultra",
    description: "NVIDIA model via OpenRouter (free tier)",
    enabled: true,
    requiresApiKey: "OPENROUTER_API_KEY",
  },
  {
    id: "gemma-4-31b",
    provider: "openrouter",
    label: "Gemma 4 31B",
    description: "Google open model via OpenRouter (free tier)",
    enabled: true,
    requiresApiKey: "OPENROUTER_API_KEY",
  },
];

/**
 * Get models yang benar-benar tersedia (API key configured)
 * Hanya model ini yang boleh muncul di UI selector
 */
export function getAvailableModels(): ModelDefinition[] {
  return MODEL_REGISTRY.filter((model) => {
    if (!model.enabled) return false;
    
    // Check if API key exists in environment
    const apiKey = process.env[model.requiresApiKey];
    return !!apiKey;
  });
}

/**
 * Validate apakah model ID valid dan available
 */
export function isModelAvailable(modelId: AIModelType): boolean {
  const available = getAvailableModels();
  return available.some((m) => m.id === modelId);
}
