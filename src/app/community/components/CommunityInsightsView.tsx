"use client";

import React from "react";

export default function CommunityInsightsView() {
  const STATS = [
    { label: "Total Percakapan Komunitas", value: "2,541", change: "+14% minggu ini", positive: true },
    { label: "Tingkat Responsif Teman Sebaya", value: "98.4%", change: "< 5 menit rata-rata", positive: true },
    { label: "Streak Bernapas Terpanjang", value: "24 hari", change: "Sarah J. memimpin", positive: true },
    { label: "Sentimen Emosi Positif", value: "82%", change: "+6% peningkatan", positive: true },
  ];

  const TOP_DISCUSSIONS = [
    { topic: "Cara mengatasi insomnia sebelum ujian", participants: 142, mood: "Relaxed" },
    { topic: "Berbagi teknik grounding 5-4-3-2-1", participants: 98, mood: "Calm" },
    { topic: "Rutinitas minum air putih & stretching", participants: 76, mood: "Overjoyed" },
  ];

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-brown-900/10 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📊</span>
          <h1 className="font-bold text-lg text-brown-900">Community Insights</h1>
        </div>
        <p className="text-xs text-brown-700/60 leading-relaxed">
          Statistik kesehatan mental & denyut aktivitas kolektif sesama Gen Z di ZYBA Community.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {STATS.map((s, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-brown-900/6">
              <p className="text-[11px] text-brown-700/70">{s.label}</p>
              <p className="font-bold text-xl text-brown-900 mt-1">{s.value}</p>
              <p className="text-[10px] font-semibold text-green-600 mt-0.5">{s.change}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-brown-900/10 p-5 shadow-xs">
        <h3 className="font-bold text-xs text-brown-900 uppercase tracking-wider mb-3">
          Diskusi Terhangat Minggu Ini
        </h3>
        <div className="space-y-2.5">
          {TOP_DISCUSSIONS.map((td, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-brown-900/6 hover:border-orange-500/40 transition-colors flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-brown-900">{td.topic}</p>
                <p className="text-[10px] text-brown-700/60 mt-0.5">{td.participants} anggota berpartisipasi</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                {td.mood}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
