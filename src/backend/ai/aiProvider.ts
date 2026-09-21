/**
 * AI Provider Service for ZYBA Companion
 * Mendukung pemanggilan ke AI Models (Google Gemini / OpenAI / Groq)
 * dengan fallback cerdas berbasis konteks persona ZYBA.
 */

interface GenerateParams {
  message: string;
  communicationStyle?: "CASUAL" | "FORMAL" | "FUN";
  emotionTag?: string;
  history?: { role: "USER" | "ASSISTANT"; content: string }[];
}

export async function generateCompanionResponse({
  message,
  communicationStyle = "CASUAL",
  emotionTag = "Calming",
  history = [],
}: GenerateParams): Promise<{ reply: string; emotionTag: string }> {
  // Jika API Key dikonfigurasi di server environment, panggil Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemPrompt = `Kamu adalah Zyba Companion, pendamping kesehatan mental, fisik, dan sosial berbasis AI untuk Gen Z.
Gaya komunikasi kamu saat ini: ${communicationStyle}.
Berikan respon yang hangat, tidak menghakimi, empati, dan berorientasi pada solusi praktis (latihan napas, jurnal, atau rehat).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { reply: text.trim(), emotionTag: "Empathetic" };
        }
      }
    } catch (err) {
      console.error("[aiProvider] Error calling Gemini API:", err);
    }
  }

  // Fallback Kontekstual Berdasarkan Persona ZYBA & Gaya Bahasa
  let reply = "";
  let detectedEmotion = emotionTag;

  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("tidur") || lowerMsg.includes("insomnia") || lowerMsg.includes("lelah")) {
    detectedEmotion = "Rest Seeking";
    reply =
      communicationStyle === "CASUAL"
        ? `Istirahat itu penting banget, Alex. Coba deh matikan layar gadget 30 menit sebelum tidur dan ikuti sesi audio di menu Resources ya.`
        : communicationStyle === "FUN"
        ? `Waktunya recharge baterai tubuhmu! 🔋 Jauhkan HP dan mari dengarkan audio relaksasi tidur dari ZYBA.`
        : `Kualitas tidur berdampak langsung pada kestabilan emosi. Kami menyarankan Anda mencoba latihan pernapasan sebelum tidur.`;
  } else if (lowerMsg.includes("tugas") || lowerMsg.includes("kuliah") || lowerMsg.includes("ujian") || lowerMsg.includes("stres")) {
    detectedEmotion = "Focused Coping";
    reply =
      communicationStyle === "CASUAL"
        ? `Paham banget, beban tugas memang suka bikin kewalahan. Mari pecah tugasmu jadi bagian-bagian kecil. Ambil 5 menit untuk tarik napas dulu yuk!`
        : communicationStyle === "FUN"
        ? `Slow down, champion! 🌟 Kamu hebat sudah bertahan sejauh ini. Mari rehat 5 menit sebelum lanjut gempur tugas!`
        : `Tekanan akademik merupakan hal yang umum dialami. Cobalah menerapkan teknik Pomodoro 25 menit fokus dan 5 menit istirahat.`;
  } else {
    reply =
      communicationStyle === "CASUAL"
        ? `Terima kasih sudah curhat ke Zyba. Aku di sini mendengarkanmu. Mau kita coba latihan pernapasan bersama atau mau cerita lebih banyak?`
        : communicationStyle === "FUN"
        ? `Aku siap mendengarkan semua cerita serumu! 🚀 Ceritakan apa saja yang ada di pikiranmu hari ini!`
        : `Terima kasih telah berbagi. Zyba Companion selalu siap memfasilitasi ruang refleksi kesehatan mental Anda.`;
  }

  return { reply, emotionTag: detectedEmotion };
}
