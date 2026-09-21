"use client";

import { useState } from "react";
import ScoreBreakdown from "./components/ScoreBreakdown";
import StreakCard from "./components/StreakCard";
import AIRecommendations from "./components/AIRecommendations";

export default function WellnessJourneyPage() {
  const [selectedRange, setSelectedRange] = useState<"Minggu Ini" | "Bulan Ini">("Minggu Ini");

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
              Wellness Journey
            </span>
            <span className="text-xs text-brown-700">Analisis Holistik Kesehatan Mental & Fisik</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Perjalanan Kesehatan Mentalmu
          </h1>
          <p className="text-xs text-brown-700 mt-1 max-w-xl">
            Lacak perkembangan kestabilan emosi, riwayat stres, dan pencapaian jurnal mingguanmu dalam satu dashboard terpadu.
          </p>
        </div>

        {/* Range Filter */}
        <div className="flex items-center gap-2 bg-cream p-1.5 rounded-2xl border border-brown-900/10">
          {(["Minggu Ini", "Bulan Ini"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRange(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRange === r
                  ? "bg-brown-900 text-white shadow-sm"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Overview: Zyba Score Breakdown & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ScoreBreakdown />

        {/* Streak & Recommendations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <StreakCard />
          <AIRecommendations />
        </div>
      </div>
    </div>
  );
}
