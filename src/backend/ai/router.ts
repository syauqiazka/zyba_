// src/backend/ai/router.ts
// ZYBA Central AI Router & Orchestrator (SPEC TAHAP KEDUA — AGENTS.md 19, 21)

import {
  AIRequestContext,
  AIExecutionResult,
  ModelDescriptor,
  AIMode,
  AIProviderId,
  AIModelType,
} from "./types";
import {
  resolveModelDescriptor,
  getDefaultModelForMode,
  getAvailableModels,
  MODEL_REGISTRY,
} from "./modelRegistry";
import { buildSystemPrompt } from "./prompts";
import { getPersonaById } from "./personas";
import { GeminiAdapter } from "./providers/geminiAdapter";
import { GroqAdapter } from "./providers/groqAdapter";
import { MistralAdapter } from "./providers/mistralAdapter";
import { OpenRouterAdapter } from "./providers/openrouterAdapter";
import { OpenAIAdapter } from "./providers/openaiAdapter";
import { generatePersonaFallback } from "./providers/personaFallbackAdapter";

export interface RouteCandidate {
  descriptor: ModelDescriptor;
  reason: string;
}

export class CentralAIRouter {
  /**
   * Mengeksekusi permintaan AI melalui provider yang sesuai dengan mode,
   * preferensi pengguna, dan kebijakan fallback bertingkat yang transparan.
   */
  public static async execute(context: AIRequestContext): Promise<AIExecutionResult> {
    const startTime = Date.now();
    const mode: AIMode = context.mode || "companion";
    const userPlan = context.userPlan || "FREE";
    const persona = getPersonaById(context.persona || "KINA");

    // 1. Bangun system prompt sesuai mode dan persona
    const promptConfig = buildSystemPrompt(mode, context.persona, context.communicationStyle);
    const systemPrompt = promptConfig.systemPrompt;

    // 2. Tentukan target model yang diminta pengguna (jika ada)
    const requestedDescriptor = context.model ? resolveModelDescriptor(context.model) : undefined;

    // 3. Susun daftar kandidat eksekusi (Urutan: Pilihan User -> Rekomendasi Mode -> Rantai Fallback Terverifikasi)
    const executionPlan = CentralAIRouter.buildExecutionPlan(
      mode,
      userPlan,
      requestedDescriptor
    );

    let lastError: string | undefined;
    let attemptedCount = 0;

    // 4. Coba setiap kandidat dalam urutan
    for (const candidate of executionPlan) {
      attemptedCount++;
      const { descriptor, reason } = candidate;

      console.log(`[AIRouter] Attempt ${attemptedCount}: Trying ${descriptor.id} (${descriptor.provider}) for mode '${mode}'. Reason: ${reason}`);

      const callParams = {
        modelName: descriptor.canonicalId,
        systemPrompt,
        message: context.message,
        history: context.history,
        maxTokens: context.maxTokens || 800,
        temperature: context.temperature ?? descriptor.defaultTemperature,
      };

      try {
        const result = await CentralAIRouter.dispatchToProvider(descriptor.provider, callParams);
        const latencyMs = Date.now() - startTime;

        const isFallback = !!(requestedDescriptor && requestedDescriptor.id !== descriptor.id);

        console.log(`[AIRouter] ✓ Succeeded via ${descriptor.id} in ${latencyMs}ms. Fallback: ${isFallback}`);

        return {
          reply: result.reply,
          provider: descriptor.provider,
          modelUsed: descriptor.id,
          emotionTag: promptConfig.defaultEmotionTag,
          latencyMs,
          isFallback,
          requestedModel: requestedDescriptor?.id,
          fallbackReason: isFallback ? `Model ${requestedDescriptor.label} sedang padat/tidak tersedia; dialihkan ke ${descriptor.label}.` : undefined,
          providerStatus: "API_LIVE",
        };
      } catch (err: any) {
        lastError = err?.message || "Unknown error";
        console.warn(`[AIRouter] ✗ Failed ${descriptor.id} (${descriptor.provider}): ${lastError}`);
      }
    }

    // 5. Jika semua provider gagal, gunakan persona fallback internal (zero downtime)
    const latencyMs = Date.now() - startTime;
    console.warn(`[AIRouter] All ${attemptedCount} provider candidates failed. Activating persona fallback.`);

    const fallbackResult = generatePersonaFallback(persona, context.message, mode);

    return {
      reply: fallbackResult.reply,
      provider: "fallback",
      modelUsed: "zyba-default",
      emotionTag: fallbackResult.emotionTag,
      latencyMs,
      isFallback: true,
      requestedModel: requestedDescriptor?.id,
      fallbackReason: `Layanan AI luar sedang tidak merespons (${lastError || "timeout"}). Menggunakan respon internal ZYBA.`,
      providerStatus: "PERSONA_FALLBACK",
    };
  }

  /**
   * Menyusun rencana urutan kandidat provider & model yang aman dan teruji
   */
  private static buildExecutionPlan(
    mode: AIMode,
    userPlan: "FREE" | "PLUS",
    requestedDescriptor?: ModelDescriptor
  ): RouteCandidate[] {
    const candidates: RouteCandidate[] = [];
    const addedModelIds = new Set<string>();

    const addCandidate = (descriptor: ModelDescriptor, reason: string) => {
      if (!addedModelIds.has(descriptor.id)) {
        candidates.push({ descriptor, reason });
        addedModelIds.add(descriptor.id);
      }
    };

    // A. Prioritas 1: Model pilihan eksplisit pengguna (jika API key-nya terkonfigurasi)
    if (requestedDescriptor) {
      const isConfigured = !!process.env[requestedDescriptor.requiresApiKey]?.trim();
      if (isConfigured) {
        addCandidate(requestedDescriptor, "User explicitly selected this model");
      } else {
        console.warn(`[AIRouter] Requested model ${requestedDescriptor.id} has unconfigured key (${requestedDescriptor.requiresApiKey}). Skipping to defaults.`);
      }
    }

    // B. Prioritas 2: Model default optimal untuk mode tersebut
    const modeDefault = getDefaultModelForMode(mode, userPlan);
    addCandidate(modeDefault, `Default recommended model for mode '${mode}'`);

    // C. Prioritas 3: Rantai Fallback Berjenjang sesuai kemampuan mode
    // (Bukan universal Mistral! Urutan bervariasi sesuai kecocokan mode)
    const availableModels = getAvailableModels(userPlan);

    // Filter model yang direkomendasikan untuk mode ini terlebih dahulu
    const modeSpecificFallbacks = availableModels.filter(
      (m) => m.recommendedModes.includes(mode) && !addedModelIds.has(m.id)
    );
    for (const m of modeSpecificFallbacks) {
      addCandidate(m, `Alternative model matching mode '${mode}'`);
    }

    // Sisa model tersedia lainnya dari provider yang berbeda
    const remainingModels = availableModels.filter((m) => !addedModelIds.has(m.id));
    for (const m of remainingModels) {
      addCandidate(m, `General fallback provider`);
    }

    return candidates;
  }

  /**
   * Mengirim panggilan ke adapter yang sesuai
   */
  private static async dispatchToProvider(
    provider: AIProviderId,
    params: any
  ): Promise<{ reply: string }> {
    switch (provider) {
      case "gemini":
        return await GeminiAdapter.call(params);
      case "groq":
        return await GroqAdapter.call(params);
      case "mistral":
        return await MistralAdapter.call(params);
      case "openrouter":
        return await OpenRouterAdapter.call(params);
      case "openai":
        return await OpenAIAdapter.call(params);
      default:
        throw new Error(`UNKNOWN_PROVIDER_${provider}`);
    }
  }

  /**
   * Diagnostic: Cek kesehatan seluruh provider secara paralel
   */
  public static async runDiagnostics() {
    const checks = await Promise.allSettled([
      GeminiAdapter.healthCheck(),
      GroqAdapter.healthCheck(),
      MistralAdapter.healthCheck(),
      OpenRouterAdapter.healthCheck(),
      OpenAIAdapter.healthCheck(),
    ]);

    return checks.map((c, idx) => {
      if (c.status === "fulfilled") return c.value;
      const providers: AIProviderId[] = ["gemini", "groq", "mistral", "openrouter", "openai"];
      return {
        provider: providers[idx],
        configured: false,
        authenticated: false,
        error: "Diagnostic execution failed",
      };
    });
  }
}
