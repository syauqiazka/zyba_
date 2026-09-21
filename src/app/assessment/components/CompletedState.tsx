"use client";

import React from "react";

interface CompletedStateProps {
  score?: number;
  condition?: string;
}

export default function CompletedState({ score = 80, condition = "Kondisi Baik" }: CompletedStateProps) {
  const scoreBg =
    score >= 80
      ? "bg-green-500 text-white shadow-green-500/20"
      : score >= 60
      ? "bg-orange-500 text-white shadow-orange-500/20"
      : "bg-brown-900 text-white shadow-brown-900/20";

  const handleGoToDashboard = () => {
    // Hard redirect agar cookie baru (dari API assessment) dibaca ulang oleh browser
    // dan middleware punya JWT dengan onboardingCompleted = true
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto text-center gap-6 py-8 animate-in fade-in zoom-in duration-300">
      {/* Celebration banner */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl animate-bounce">🎉</div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 border border-green-500/30">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-green-600">
            Asesmen Selesai!
          </span>
        </div>
      </div>

      {/* Skor card */}
      <div
        className={`w-28 h-28 rounded-3xl font-display font-extrabold flex flex-col items-center justify-center shadow-xl transition-all ${scoreBg}`}
      >
        <span className="text-4xl leading-none">{score}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">/ 100</span>
      </div>

      <div className="max-w-md">
        <h2 className="font-display font-extrabold text-3xl text-brown-900 mt-1">
          Skor ZYBA Awal: {score} / 100
        </h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-brown-900/10 mt-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-brown-900">
            {condition}
          </span>
        </div>
        <p className="text-xs text-brown-700 leading-relaxed">
          {score >= 80
            ? "Kondisi fisik dan mentalmu dalam kondisi prima! ZYBA siap membantumu menjaga konsistensi dan produktivitas harian."
            : score >= 60
            ? "Kondisimu cukup stabil, namun ada beberapa pemicu stres yang perlu diperhatikan. Mari rancang rutinitas relaksasi bersama ZYBA."
            : "Tingkat beban pikiran atau fisikmu sedang cukup tinggi. ZYBA akan memprioritaskan latihan pernapasan, pendampingan curhat, dan istirahat untukmu."}
        </p>
      </div>

      {/* CTA utama */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleGoToDashboard}
          className="px-10 py-4 rounded-full bg-orange-500 hover:bg-brown-900 text-white font-bold text-sm shadow-lg transition-colors flex items-center gap-2 group"
        >
          <span>Mulai Gunakan ZYBA</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <p className="text-[11px] text-brown-700/70">
          Semua fitur ZYBA kini terbuka untukmu 🚀
        </p>
      </div>
    </div>
  );
}
