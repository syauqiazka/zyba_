// FASE 2+4: Multi-provider AI + persona (AGENTS.md 19.1, 21.2)
// Priority: Gemini -> Groq -> Mistral -> OpenRouter -> persona fallback

import { getPersonaById, PersonaDef, PersonaId } from "./personas";

export type AIModelType = "gemini-3.8-flash" | "gemini-3.5-flash-lite" | "llama-3.3-70b" | "qwen-3.8-27b" | "mistral-small" | "openrouter-free" | "nemotron-3-ultra" | "gemma-4-31b" | "zyba-default";

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

async function callGemini(mn: string, sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.GEMINI_API_KEY; if (!key) return null;
  const contents = [...(hist ?? []).map(h => ({ role: h.role === "USER" ? "user" : "model", parts: [{ text: h.content }] })), { role: "user", parts: [{ text: msg }] }];
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${mn}:generateContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sp }] }, contents }) });
  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? { reply: text.trim(), emotionTag: "Empathetic (Gemini)" } : null;
}

async function callGroq(gm: string, sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.GROQ_API_KEY; if (!key) return null;
  const messages = [{ role: "system", content: sp }, ...(hist ?? []).map(h => ({ role: h.role === "USER" ? "user" : "assistant", content: h.content })), { role: "user", content: msg }];
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key }, body: JSON.stringify({ model: gm, messages, max_tokens: 800 }) });
  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? { reply: text.trim(), emotionTag: "Insightful (Groq)" } : null;
}

async function callMistral(sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.MISTRAL_API_KEY; if (!key) return null;
  const messages = [{ role: "system", content: sp }, ...(hist ?? []).map(h => ({ role: h.role === "USER" ? "user" : "assistant", content: h.content })), { role: "user", content: msg }];
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key }, body: JSON.stringify({ model: "mistral-small-latest", messages, max_tokens: 800 }) });
  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? { reply: text.trim(), emotionTag: "Reflective (Mistral)" } : null;
}

async function callOpenRouter(sp: string, msg: string, hist: AIRequestParams["history"]): Promise<PR | null> {
  const key = process.env.OPENROUTER_API_KEY; if (!key) return null;
  const messages = [{ role: "system", content: sp }, ...(hist ?? []).map(h => ({ role: h.role === "USER" ? "user" : "assistant", content: h.content })), { role: "user", content: msg }];
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key, "HTTP-Referer": "https://zyba.app", "X-Title": "Zyba Companion" }, body: JSON.stringify({ models: ["nvidia/nemotron-3-ultra:free", "google/gemma-4-31b:free", "nvidia/nemotron-3-super:free", "cohere/north-mini-code:free"], route: "fallback", messages, max_tokens: 800 }) });
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
  const { message, persona: personaId = "KINA", history = [] } = params;
  const persona = getPersonaById(personaId);
  const sp = persona.systemPrompt;

  type E = { fn: () => Promise<PR | null>; name: AIModelType };
  const chain: E[] = [
    { fn: () => callGemini("gemini-3.8-flash", sp, message, history), name: "gemini-3.8-flash" },
    { fn: () => callGroq("llama-3.3-70b-versatile", sp, message, history), name: "llama-3.3-70b" },
    { fn: () => callMistral(sp, message, history), name: "mistral-small" },
    { fn: () => callOpenRouter(sp, message, history), name: "openrouter-free" },
  ];

  for (const { fn, name } of chain) {
    try {
      const result = await fn();
      if (result) return { reply: result.reply, modelUsed: name, emotionTag: result.emotionTag, providerStatus: "API_LIVE" };
    } catch (err: any) {
      console.warn("[aiModelManager] " + name + " skipped:", err?.message);
    }
  }

  const fallback = personaFallback(persona, message);
  return { reply: fallback.reply, modelUsed: "zyba-default", emotionTag: fallback.emotionTag, providerStatus: "PERSONA_FALLBACK" };
}
