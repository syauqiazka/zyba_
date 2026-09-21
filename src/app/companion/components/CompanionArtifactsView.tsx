"use client";

import React from "react";
import { useCompanion } from "../context/CompanionContext";

export default function CompanionArtifactsView() {
  const { setActiveSection, handleSendMessage } = useCompanion();

  const artifacts = [
    {
      id: "art-1",
      title: "Rencana Aksi: Mengurangi Beban Cemas Tugas",
      type: "Markdown Protocol",
      date: "Hari ini, 10:45",
      summary: "3 langkah grounding 5-4-3-2-1 saat serangan panik, dan pemecahan waktu belajar metode 25 menit.",
      icon: "📑",
    },
    {
      id: "art-2",
      title: "Mindfulness Breathing 4-4-4 Routine",
      type: "Audio Exercise",
      date: "Kemarin, 22:15",
      summary: "Siklus pernapasan terarah untuk menurunkan detak jantung dan meredakan ketegangan otot leher/bahu.",
      icon: "🧘",
    },
    {
      id: "art-3",
      title: "Gen Z Sleep Hygiene Checklist",
      type: "Action Checklist",
      date: "18 Sep 2026",
      summary: "Panduan mematikan blue-light gadget, pencahayaan redup kamar, dan teh chamomile relaksasi.",
      icon: "🌙",
    },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      <div className="pb-6 border-b border-brown-900/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📑</span>
          <h1 className="font-serif font-bold text-2xl text-brown-900">
            Artifacts
          </h1>
        </div>
        <p className="text-xs text-brown-700/70">
          Galeri artefak, rangkuman solusi terstruktur, dan panduan latihan yang diekstrak dari sesi percakapanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {artifacts.map((art) => (
          <div
            key={art.id}
            className="p-5 rounded-2xl bg-white border border-brown-900/8 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{art.icon}</span>
                <span className="text-[10px] font-bold text-brown-700/50 uppercase tracking-wide">
                  {art.type} · {art.date}
                </span>
              </div>
              <h3 className="font-serif font-bold text-sm text-brown-900 mb-1.5">
                {art.title}
              </h3>
              <p className="text-xs text-brown-700/70 leading-relaxed mb-4">
                {art.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-brown-900/5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  alert(`Membuka artefak: ${art.title}`);
                }}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Pratinjau Dokumen ↗
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSection("chat");
                  handleSendMessage(`Bahas lebih lanjut seputar artefak "${art.title}"`);
                }}
                className="text-xs font-bold text-brown-900 hover:text-orange-600"
              >
                Kirim ke Chat →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
