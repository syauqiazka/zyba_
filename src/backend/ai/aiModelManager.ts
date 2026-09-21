/**
 * Multi-Model AI Engine & Keys Manager for ZYBA Companion
 * Supporting multiple AI API Keys:
 * - Gemini 1.5 Flash (GEMINI_API_KEY / GEMINI_FLASH_API_KEY)
 * - Gemini 1.5 Pro (GEMINI_PRO_API_KEY)
 * - OpenAI GPT-4o (OPENAI_API_KEY)
 * - Groq Llama 3.3 70B (GROQ_API_KEY)
 * - Anthropic Claude 3.5 Sonnet (ANTHROPIC_API_KEY)
 */

export type AIModelType =
  | "gemini-1.5-flash"
  | "gemini-1.5-pro"
  | "gpt-4o"
  | "llama-3.3-70b"
  | "claude-3-5-sonnet"
  | "zyba-default";

export interface AIRequestParams {
  message: string;
  model?: AIModelType;
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
  emotionTag?: string;
  history?: { role: "USER" | "ASSISTANT"; content: string }[];
}

export interface AIResponseResult {
  reply: string;
  modelUsed: AIModelType;
  emotionTag: string;
  providerStatus: "API_LIVE" | "PERSONA_FALLBACK";
}

export async function processMultiModelAIResponse({
  message,
  model = "gemini-1.5-flash",
  communicationStyle = "CASUAL",
  emotionTag = "Calming",
  history = [],
}: AIRequestParams): Promise<AIResponseResult> {
  const systemPrompt = `Kamu adalah Zyba Companion, pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.
Gaya komunikasi kamu saat ini: ${communicationStyle}.
Berikan respon yang hangat, empati, bebas dari stigma, dan berorientasi pada latihan mindfulness praktis.`;

  // 1. Google Gemini 1.5 Flash / Pro
  if (model.startsWith("gemini")) {
    const key =
      model === "gemini-1.5-pro"
        ? process.env.GEMINI_PRO_API_KEY || process.env.GEMINI_API_KEY
        : process.env.GEMINI_FLASH_API_KEY || process.env.GEMINI_API_KEY;

    if (key) {
      try {
        const modelName = model === "gemini-1.5-pro" ? "gemini-1.5-pro" : "gemini-1.5-flash";
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] },
              ],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return {
              reply: replyText.trim(),
              modelUsed: model,
              emotionTag: "Empathetic (Gemini)",
              providerStatus: "API_LIVE",
            };
          }
        }
      } catch (err) {
        console.error(`[aiModelManager] Error calling Gemini API (${model}):`, err);
      }
    }
  }

  // 2. OpenAI GPT-4o
  if (model === "gpt-4o" && process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            ...history.map((h) => ({
              role: h.role === "USER" ? "user" : "assistant",
              content: h.content,
            })),
            { role: "user", content: message },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data?.choices?.[0]?.message?.content;
        if (replyText) {
          return {
            reply: replyText.trim(),
            modelUsed: "gpt-4o",
            emotionTag: "Supportive (GPT-4o)",
            providerStatus: "API_LIVE",
          };
        }
      }
    } catch (err) {
      console.error("[aiModelManager] Error calling OpenAI GPT-4o:", err);
    }
  }

  // 3. Groq Llama 3.3 70B
  if (model === "llama-3.3-70b" && process.env.GROQ_API_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data?.choices?.[0]?.message?.content;
        if (replyText) {
          return {
            reply: replyText.trim(),
            modelUsed: "llama-3.3-70b",
            emotionTag: "Insightful (Llama 3)",
            providerStatus: "API_LIVE",
          };
        }
      }
    } catch (err) {
      console.error("[aiModelManager] Error calling Groq Llama 3:", err);
    }
  }

  // 4. Anthropic Claude 3.5 Sonnet
  if (model === "claude-3-5-sonnet" && process.env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: message }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data?.content?.[0]?.text;
        if (replyText) {
          return {
            reply: replyText.trim(),
            modelUsed: "claude-3-5-sonnet",
            emotionTag: "Reflective (Claude)",
            providerStatus: "API_LIVE",
          };
        }
      }
    } catch (err) {
      console.error("[aiModelManager] Error calling Anthropic Claude:", err);
    }
  }

  // 5. Intelligent Zyba Persona Contextual Fallback Response
  const lowerMsg = message.toLowerCase();
  let replyText = "";
  let detectedEmotion = emotionTag;

  if (lowerMsg.includes("tidur") || lowerMsg.includes("insomnia") || lowerMsg.includes("lelah")) {
    detectedEmotion = "Rest Seeking";
    replyText =
      communicationStyle === "CASUAL"
        ? `Istirahat itu penting banget, Alex. Coba matikan layar gadget 30 menit sebelum tidur dan ikuti sesi audio relaksasi tidur ZYBA di menu Resources.`
        : communicationStyle === "FUN"
        ? `Waktunya isi ulang baterai tubuhmu! 🔋 Jauhkan HP dan mari ikuti sesi audio relaksasi tidur dari ZYBA.`
        : `Kualitas tidur berdampak langsung pada kestabilan emosi dan stamina fisik. Kami menyarankan Anda mengikuti sesi relaksasi pernapasan.`;
  } else if (lowerMsg.includes("tugas") || lowerMsg.includes("kuliah") || lowerMsg.includes("ujian") || lowerMsg.includes("stres")) {
    detectedEmotion = "Focused Coping";
    replyText =
      communicationStyle === "CASUAL"
        ? `Paham banget, beban tugas memang suka bikin kewalahan. Mari pecah tugasmu jadi bagian-bagian kecil. Ambil 5 menit untuk tarik napas di menu Smart Activity Planner yuk!`
        : communicationStyle === "FUN"
        ? `Slow down, champion! 🌟 Kamu hebat sudah bertahan sejauh ini. Mari rehat 5 menit sebelum lanjut gempur tugas!`
        : `Tekanan akademik merupakan hal yang umum dialami. Cobalah menerapkan teknik Pomodoro 25 menit fokus dan 5 menit istirahat.`;
  } else {
    replyText =
      communicationStyle === "CASUAL"
        ? `Terima kasih sudah berbagi dengan Zyba (${model}). Aku di sini mendengarkanmu. Mau kita coba latihan pernapasan bersama atau mau cerita lebih banyak?`
        : communicationStyle === "FUN"
        ? `Aku siap mendengarkan semua cerita serumu via ${model}! 🚀 Ceritakan apa saja yang ada di pikiranmu hari ini!`
        : `Terima kasih telah berbagi. Zyba Companion (${model}) selalu siap memfasilitasi ruang refleksi kesehatan mental Anda.`;
  }

  return {
    reply: replyText,
    modelUsed: model,
    emotionTag: detectedEmotion,
    providerStatus: "PERSONA_FALLBACK",
  };
}
