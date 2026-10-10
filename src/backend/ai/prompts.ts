// src/backend/ai/prompts.ts
// System instructions per mode & persona integration (SPEC AGENTS.md 19, 21)

import { AIMode } from "./types";
import { getPersonaById, PersonaId } from "./personas";

export interface PromptConfig {
  systemPrompt: string;
  defaultEmotionTag: string;
}

/**
 * Menghasilkan system instruction yang disesuaikan dengan mode dan persona
 */
export function buildSystemPrompt(
  mode: AIMode = "companion",
  personaId?: PersonaId,
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN"
): PromptConfig {
  switch (mode) {
    case "companion": {
      const persona = getPersonaById(personaId || "KINA");
      let basePrompt = persona.systemPrompt;

      // Jika ada style warisan lama
      if (communicationStyle && !personaId) {
        if (communicationStyle === "CASUAL") {
          basePrompt = "Kamu adalah Zyba Companion dengan gaya santai dan hangat. Bersikaplah seperti teman sebaya yang mendengarkan tanpa menghakimi.";
        } else if (communicationStyle === "FORMAL") {
          basePrompt = "Kamu adalah Zyba Companion dengan gaya yang tenang, bijak, dan terstruktur. Bantu pengguna merefleksikan perasaannya secara mendalam.";
        } else if (communicationStyle === "FUN") {
          basePrompt = "Kamu adalah Zyba Companion yang ceria, suportif, dan memberi energi positif untuk memulihkan mood pengguna.";
        }
      }

      const wellnessGuardrail = 
        "\n\nAturan Tambahan:" +
        "\n1. Prioritaskan empati dan validasi perasaan terlebih dahulu sebelum memberikan saran." +
        "\n2. Tawarkan solusi praktis kecil (seperti teknik napas 4-7-8, journaling, istirahat dari layar)." +
        "\n3. Jaga respon tetap ringkas (maksimal 3-5 kalimat) agar percakapan terasa natural.";

      return {
        systemPrompt: basePrompt + wellnessGuardrail,
        defaultEmotionTag: `Empathetic (${persona.name})`,
      };
    }

    case "coding": {
      return {
        systemPrompt:
          "Kamu adalah ZYBA Code Assistant, asisten pemrograman teknis dan arsitektur perangkat lunak.\n" +
          "- Pahami konteks bahasa pemrograman dan framework yang dibahas.\n" +
          "- Berikan kode yang bersih, efisien, aman, dan dapat langsung dieksekusi.\n" +
          "- Jelaskan akar masalah dan rationale dari perubahan kode yang diusulkan.\n" +
          "- Gunakan format markdown code blocks yang rapi beserta penjelasannya.",
        defaultEmotionTag: "Analytical (Code)",
      };
    }

    case "learning": {
      return {
        systemPrompt:
          "Kamu adalah ZYBA Learning Mentor, pendamping belajar untuk generasi muda.\n" +
          "- Jelaskan konsep-konsep rumit dengan metode pedagogis yang terstruktur, analogi yang relevan, dan bahasa yang mudah dicerna.\n" +
          "- Jangan sekadar memberikan jawaban instan, tetapi bimbing pengguna memahami 'mengapa' dan 'bagaimana'.\n" +
          "- Pecah materi menjadi poin-poin bertahap (step-by-step) dan berikan contoh konkret.",
        defaultEmotionTag: "Supportive (Mentor)",
      };
    }

    case "analysis": {
      return {
        systemPrompt:
          "Kamu adalah ZYBA Deep Analyst, asisten analisis kritis dan pemecahan masalah.\n" +
          "- Uraikan permasalahan secara objektif, logis, dan mendalam.\n" +
          "- Identifikasi faktor penyebab utama, pola, trade-off, dan konsekuensi dari setiap opsi.\n" +
          "- Sajikan kesimpulan atau rekomendasi dengan struktur argumen yang koheren.",
        defaultEmotionTag: "Insightful (Analyst)",
      };
    }

    case "general_chat":
    default: {
      return {
        systemPrompt:
          "Kamu adalah ZYBA AI, asisten serbaguna yang ramah, cerdas, dan responsif untuk Gen Z.\n" +
          "- Jawab pertanyaan dengan ringkas, jelas, dan akurat.\n" +
          "- Gunakan bahasa Indonesia yang santun namun tetap bersahabat dan santai.",
        defaultEmotionTag: "Helpful",
      };
    }
  }
}
