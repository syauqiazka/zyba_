// FASE 2+4: Multi-provider AI + persona (AGENTS.md 19.1, 21.2)
// Priority: Gemini -> Groq -> Mistral -> OpenRouter -> persona fallback

import { getPersonaById, PersonaDef, PersonaId } from "./personas";

export type AIModelType = "openai-premium" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.5-flash-lite" | "llama-3.3-70b" | "qwen-3.8-27b" | "ministral-8b" | "openrouter-free" | "nemotron-3-ultra" | "gemma-4-31b" | "zyba-default";

export interface AIRequestParams {
  message: string;
  model?: AIModelType;
  persona?: PersonaId;
  /** @deprecated use persona */
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
  history?: { role: "USER" | "ASSISTANT"; content: string }[];
}

export interface AIResponseResult {
  reply: string;
  modelUsed: AIModelType;
  emotionTag: string;
  providerStatus: "API_LIVE" | "PERSONA_FALLBACK";
}

type PR = { reply: string; emotionTag: string };

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const AI_MAX_ATTEMPTS = 2;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientFetchError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String((error as { name?: unknown }).name) : "";
  return name === "AbortError" || name === "TimeoutError" || name === "TypeError";
}

async function fetchWithTransientRetry(
  input: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= AI_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(input, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!RETRYABLE_STATUS.has(response.status) || attempt === AI_MAX_ATTEMPTS) {
        return response;
      }

      const retryAfter = Number(response.headers.get("retry-after"));
      const retryDelayMs = Number.isFinite(retryAfter)
        ? Math.min(Math.max(retryAfter * 1000, 250), 2000)
        : attempt * 500;

      console.warn(
        `[aiModelManager] transient provider status ${response.status}; retrying in ${retryDelayMs}ms`,
      );
      await sleep(retryDelayMs);
    } catch (error) {
      lastError = error;

      if (!isTransientFetchError(error) || attempt === AI_MAX_ATTEMPTS) {
        throw error;
      }

      const retryDelayMs = attempt * 500;
      console.warn(
        `[aiModelManager] transient provider error; retrying in ${retryDelayMs}ms`,
      );
      await sleep(retryDelayMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("AI_PROVIDER_REQUEST_FAILED");
}


async function callGemini(mn: string, sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const contents = [
    ...(hist ?? []).map((h) => ({
      role: h.role === "USER" ? "user" : "model",
      parts: [{ text: h.content }],
    })),
    { role: "user", parts: [{ text: msg }] },
  ];

  const res = await fetchWithTransientRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${mn}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sp }] },
        contents,
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      }),
    },
    6000,
  );

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? { reply: text.trim(), emotionTag: "Empathetic (Gemini)" } : null;
}

async function callGroq(gm: string, sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  const messages = [
    { role: "system", content: sp },
    ...(hist ?? []).map((h) => ({
      role: h.role === "USER" ? "user" : "assistant",
      content: h.content,
    })),
    { role: "user", content: msg },
  ];

  const res = await fetchWithTransientRetry(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({ model: gm, messages, max_tokens: 500, temperature: 0.7 }),
    },
    6000,
  );

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? { reply: text.trim(), emotionTag: "Insightful (Groq)" } : null;
}

async function callMistral(sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return null;

  const messages = [
    { role: "system", content: sp },
    ...(hist ?? []).map((h) => ({
      role: h.role === "USER" ? "user" : "assistant",
      content: h.content,
    })),
    { role: "user", content: msg },
  ];

  const res = await fetchWithTransientRetry(
    "https://api.mistral.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({ model: "ministral-8b-latest", messages, max_tokens: 500, temperature: 0.7 }),
    },
    6000,
  );

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? { reply: text.trim(), emotionTag: "Reflective (Mistral)" } : null;
}

async function callOpenAIPremium(sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("PREMIUM_AI_NOT_CONFIGURED");
  }

  const model = process.env.OPENAI_PREMIUM_MODEL || "gpt-6.1-sol";
  const input = [
    ...(hist ?? []).map((h) => ({
      role: h.role === "USER" ? "user" : "assistant",
      content: h.content,
    })),
    { role: "user", content: msg },
  ];

  let res: Response;
  try {
    res = await fetchWithTransientRetry(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          instructions: sp,
          input,
          max_output_tokens: 500,
        }),
      },
      9000,
    );
  } catch (error) {
    console.error("[aiModelManager] OpenAI premium request failed:", error);
    throw new Error("PREMIUM_AI_UNAVAILABLE");
  }

  if (res.status === 429) throw new Error("RATE_LIMIT");

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error("[aiModelManager] OpenAI premium error:", res.status, errorText.slice(0, 500));
    throw new Error("PREMIUM_AI_UNAVAILABLE");
  }

  const data = await res.json();
  const text = data?.output_text;

  if (!text || typeof text !== "string") {
    throw new Error("PREMIUM_AI_EMPTY_RESPONSE");
  }

  return {
    reply: text.trim(),
    emotionTag: "Insightful (ZYBA Premium AI)",
  };
}

async function callOpenRouter(sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const messages = [
    { role: "system", content: sp },
    ...(hist ?? []).map((h) => ({
      role: h.role === "USER" ? "user" : "assistant",
      content: h.content,
    })),
    { role: "user", content: msg },
  ];

  const res = await fetchWithTransientRetry(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
        "HTTP-Referer": "https://zyba.app",
        "X-Title": "Zyba Companion",
      },
      body: JSON.stringify({
        models: [
          "nvidia/nemotron-3-ultra:free",
          "google/gemma-4-31b:free",
          "nvidia/nemotron-3-super:free",
          "cohere/north-mini-code:free",
        ],
        route: "fallback",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    },
    8000,
  );

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? { reply: text.trim(), emotionTag: "Supportive (OpenRouter)" } : null;
}

function personaFallback(persona: PersonaDef, message: string): PR {
  const l = message.toLowerCase();
  let reply = "";
  if (l.includes("tidur") || l.includes("insomnia") || l.includes("lelah")) {
    reply = persona.id === "RUBI" ? "Wah, badan udah minta rehat! Matiin layar 30 mnt sebelum tidur, terus dengerin audio relaksasi di Resources."
      : persona.id === "BRUNO" ? "Tarik napas pelan... tahan 4 hitungan... hembuskan. Istirahat bukan tanda lemah."
      : persona.id === "OLLIE" ? "Tidurmu terganggu, itu sinyal penting. Apa yang biasanya ada di pikiranmu saat mau tidur?"
      : "Istirahat itu penting banget. Coba matikan layar 30 menit sebelum tidur dan ikuti sesi audio relaksasi di Resources.";
  } else if (l.includes("stres") || l.includes("tugas") || l.includes("cemas")) {
    reply = persona.id === "RUBI" ? "Santai dulu! Pecah tugasnya jadi bagian kecil-kecil. Mulai dari yang paling gampang!"
      : persona.id === "BRUNO" ? "Yuk tarik napas bareng dulu. Satu... dua... tiga... Sekarang ceritain yang paling bikin berat."
      : persona.id === "OLLIE" ? "Stres ini datang dari mana? Dari ekspektasi luar, atau ada sesuatu yang lebih dalam?"
      : "Paham banget. Yuk pecah tugasmu jadi bagian kecil dan ambil 5 menit napas dulu.";
  } else {
    reply = persona.id === "RUBI" ? "Heyy, cerita dong lebih! Aku di sini nemenin kok."
      : persona.id === "BRUNO" ? "Aku di sini bersamamu. Ceritakan pelan-pelan, tidak apa."
      : persona.id === "OLLIE" ? "Terima kasih sudah berbagi. Apa yang paling ingin kamu eksplorasi dari cerita ini?"
      : "Makasih sudah cerita ke Zyba. Aku di sini mendengarkan. Mau lanjut cerita atau coba latihan pernapasan?";
  }
  return { reply, emotionTag: "Empathetic (Fallback)" };
}

export async function processMultiModelAIResponse(params: AIRequestParams): Promise<AIResponseResult> {
  const { message, model, persona: personaId = "KINA", history = [] } = params;
  const persona = getPersonaById(personaId);
  const sp = persona.systemPrompt;

  // Map model to provider function
  const modelMap: Record<AIModelType, () => Promise<PR | null>> = {
    "openai-premium": () => callOpenAIPremium(sp, message, history),
    "gemini-3.8-flash": () => callGemini("gemini-3.8-flash", sp, message, history),
    "gemini-3.7-flash": () => callGemini("gemini-3.7-flash", sp, message, history),
    "gemini-3.5-flash-lite": () => callGemini("gemini-3.5-flash-lite", sp, message, history),
    "llama-3.3-70b": () => callGroq("llama-3.3-70b-versatile", sp, message, history),
    "qwen-3.8-27b": () => callGroq("qwen2.5-72b-instruct", sp, message, history),
    "ministral-8b": () => callMistral(sp, message, history),
    "openrouter-free": () => callOpenRouter(sp, message, history),
    "nemotron-3-ultra": () => callOpenRouter(sp, message, history),
    "gemma-4-31b": () => callOpenRouter(sp, message, history),
    "zyba-default": async () => null, // skip to fallback
  };

  // Premium is intentionally pinned to the paid OpenAI model.
  // It must never silently downgrade to the free-provider fallback chain.
  if (model === "openai-premium") {
    const result = await callOpenAIPremium(sp, message, history);
    return {
      reply: result.reply,
      modelUsed: "openai-premium",
      emotionTag: result.emotionTag,
      providerStatus: "API_LIVE",
    };
  }

  // If user specified a model, try it first
  if (model && modelMap[model]) {
    console.log(`[aiModelManager] Trying user-selected model: ${model}`);
    try {
      const result = await modelMap[model]();
      if (result) {
        console.log(`[aiModelManager] ✓ ${model} success`);
        return { reply: result.reply, modelUsed: model, emotionTag: result.emotionTag, providerStatus: "API_LIVE" };
      }
    } catch (err: any) {
      console.warn(`[aiModelManager] ✗ ${model} failed:`, err?.message);
    }
  }

  console.log(`[aiModelManager] Starting fallback chain (selected model ${model || 'none'} unavailable)...`);

  // Fallback chain: Gemini -> Groq -> Mistral -> OpenRouter
  type E = { fn: () => Promise<PR | null>; name: AIModelType };
  const chain: E[] = [
    { fn: () => callGemini("gemini-3.8-flash", sp, message, history), name: "gemini-3.8-flash" },
    { fn: () => callGroq("llama-3.3-70b-versatile", sp, message, history), name: "llama-3.3-70b" },
    { fn: () => callMistral(sp, message, history), name: "ministral-8b" },
    { fn: () => callOpenRouter(sp, message, history), name: "openrouter-free" },
  ];

  for (const { fn, name } of chain) {
    console.log(`[aiModelManager] Trying fallback: ${name}...`);
    try {
      const result = await fn();
      if (result) {
        console.log(`[aiModelManager] ✓ Fallback ${name} success`);
        return { reply: result.reply, modelUsed: name, emotionTag: result.emotionTag, providerStatus: "API_LIVE" };
      }
    } catch (err: any) {
      console.warn(`[aiModelManager] ✗ ${name} failed:`, err?.message);
    }
  }

  console.log(`[aiModelManager] All providers failed, using persona fallback`);

  const fallback = personaFallback(persona, message);
  return { reply: fallback.reply, modelUsed: "zyba-default", emotionTag: fallback.emotionTag, providerStatus: "PERSONA_FALLBACK" };
}
