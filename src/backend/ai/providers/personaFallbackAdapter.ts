// src/backend/ai/providers/personaFallbackAdapter.ts
// Offline & Resilient fallback adapter based on active ZYBA persona

import { PersonaDef } from "../personas";
import { AIMode } from "../types";

export function generatePersonaFallback(
  persona: PersonaDef,
  message: string,
  mode: AIMode = "companion"
): { reply: string; emotionTag: string } {
  const l = message.toLowerCase();

  // Mode non-companion fallback
  if (mode === "coding") {
    return {
      reply:
        "Mohon maaf, layanan pemrosesan AI sedang mengalami gangguan konektivitas atau antrean padat. " +
        "Untuk pertanyaan coding ini, silakan periksa sintaks atau dokumentasi resmi, lalu coba kirimkan kembali pertanyaanmu dalam beberapa saat.",
      emotionTag: "Fallback (System)",
    };
  }

  if (mode === "learning" || mode === "analysis") {
    return {
      reply:
        "Layanan AI ZYBA sedang mengalami lonjakan trafik sementara. " +
        "Pertanyaanmu sudah kami catat. Silakan coba kembali dalam 1-2 menit untuk mendapatkan analisis lengkap.",
      emotionTag: "Fallback (System)",
    };
  }

  // Mode Companion — sesuaikan dengan persona
  let reply = "";
  if (l.includes("tidur") || l.includes("insomnia") || l.includes("lelah") || l.includes("capek")) {
    reply =
      persona.id === "RUBI"
        ? "Wah, badan kamu udah ngasih kode buat istirahat nih! Coba matiin layar 30 menit sebelum tidur, terus dengerin audio relaksasi di menu Resources ya."
        : persona.id === "BRUNO"
        ? "Tarik napas pelan... tahan 4 hitungan... hembuskan perlahan. Istirahat itu kebutuhan, bukan kelemahan. Rehat sejenak ya."
        : persona.id === "OLLIE"
        ? "Kualitas tidur yang terganggu seringkali jadi cerminan beban pikiran. Apa yang biasanya paling sering muncul di kepalamu saat mau terlelap?"
        : "Istirahat itu penting banget. Coba matikan layar 30 menit sebelum tidur dan ikuti sesi audio relaksasi di menu Resources ZYBA.";
  } else if (l.includes("stres") || l.includes("tugas") || l.includes("cemas") || l.includes("kuliah") || l.includes("ujian")) {
    reply =
      persona.id === "RUBI"
        ? "Santai dulu sejenak! Coba pecah tugasmu jadi bagian-bagian kecil. Mulai dari yang paling enteng dulu biar nggak overwhelming!"
        : persona.id === "BRUNO"
        ? "Yuk kita grounding dulu. Tarik napas... satu... dua... tiga... hembuskan. Sekarang ceritain satu hal yang terasa paling berat saat ini."
        : persona.id === "OLLIE"
        ? "Tekanan ini bersumber dari ekspektasi lingkungan, target pribadi, atau ada hal lain yang belum sempat kamu urai? Mari kita telaah pelan-pelan."
        : "Paham banget, rasanya pasti berat. Yuk ambil 5 menit jeda napas dulu sebelum kita pecah masalahnya bersama.";
  } else {
    reply =
      persona.id === "RUBI"
        ? "Heyy, makasih udah cerita! Aku di sini nemenin kamu kok. Cerita lagi dong, apa yang lagi bikin kamu kepikiran hari ini?"
        : persona.id === "BRUNO"
        ? "Aku di sini mendengarkanmu dengan tenang. Ceritakan pelan-pelan, nggak perlu terburu-buru."
        : persona.id === "OLLIE"
        ? "Terima kasih sudah membagikan ceritamu. Menurutmu, bagian mana dari situasi ini yang paling ingin kamu temukan kejelasannya?"
        : "Makasih sudah cerita ke ZYBA. Aku di sini untuk mendengarkan tanpa menghakimi. Mau lanjut cerita atau mau coba latihan pernapasan?";
  }

  return {
    reply,
    emotionTag: `Empathetic (${persona.name} Fallback)`,
  };
}
