"use client";

export default function AIRecommendations() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
      <h3 className="font-display text-base font-bold text-brown-900">
        💡 Rekomendasi Personal Zyba AI
      </h3>

      <div className="flex flex-col gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-brown-900/10 flex flex-col gap-1">
          <span className="text-xs font-bold text-brown-900">1. Tingkatkan Durasi Tidur</span>
          <p className="text-xs text-brown-700 leading-relaxed">
            Tidur di bawah 6 jam dapat meningkatkan kecenderungan stres sebesar 30%. Cobalah tidur 45 menit lebih awal malam ini.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-brown-900/10 flex flex-col gap-1">
          <span className="text-xs font-bold text-brown-900">2. Lakukan Sesi Breathing 5 Menit</span>
          <p className="text-xs text-brown-700 leading-relaxed">
            Latihan relaksasi di menu Smart Activity Planner terbukti membantu memulihkan energi emosional di sela jam belajar.
          </p>
        </div>
      </div>
    </div>
  );
}
