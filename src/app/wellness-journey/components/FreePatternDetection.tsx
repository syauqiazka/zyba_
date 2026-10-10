"use client";

import React from "react";
import { Sparkles, Activity, Lightbulb, Info, CheckCircle2 } from "lucide-react";
import { FreeWellnessInsights } from "@/lib/wellness/insightsService";

interface FreePatternDetectionProps {
  patterns: FreeWellnessInsights["patterns"];
  recommendations: FreeWellnessInsights["recommendations"];
}

export default function FreePatternDetection({
  patterns,
  recommendations,
}: FreePatternDetectionProps) {
  const hasPatterns = patterns.hasEnoughData && patterns.items.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kartu Pattern Detection */}
      <div className="rounded-3xl border border-brown-900/10 bg-white/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-brown-900/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-brown-900 tracking-tight">
                  Pattern Detection
                </h3>
                <p className="text-xs text-brown-700/70">
                  Korelasi nyata antara kebiasaan, tidur, dan suasana hatimu.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream border border-brown-900/10 text-brown-700">
              Gratis
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {!hasPatterns ? (
              <div className="py-7 px-4 text-center flex flex-col items-center justify-center gap-2.5 bg-cream/40 rounded-2xl border border-dashed border-brown-900/15">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Info size={18} />
                </div>
                <h4 className="text-xs font-bold text-brown-900">
                  Belum Cukup Data untuk Mengenali Pola
                </h4>
                <p className="text-xs text-brown-700/75 max-w-sm leading-relaxed">
                  {patterns.emptyMessage}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  <span>Progres: {patterns.dataPoints} / {patterns.minRequired} check-in</span>
                </div>
              </div>
            ) : (
              patterns.items.map((pattern, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/50 text-xs leading-relaxed text-brown-800 transition-all hover:bg-orange-50"
                >
                  <Sparkles size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>{pattern}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-[10px] leading-4 text-brown-700/50 pt-2 border-t border-brown-900/5">
          Pola dihitung dari riwayat pribadimu untuk membantumu mengenali kebiasaan, bukan merupakan diagnosis medis.
        </p>
      </div>

      {/* Kartu Rekomendasi Terarah */}
      <div className="rounded-3xl border border-brown-900/10 bg-white/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-brown-900/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <Lightbulb size={18} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-brown-900 tracking-tight">
                  Rekomendasi Berbasis Data
                </h3>
                <p className="text-xs text-brown-700/70">
                  Langkah praktis yang disesuaikan dengan kondisi terkini.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700">
              Aksi Nyata
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-green-50/60 border border-green-200/50 text-xs leading-relaxed text-brown-800 transition-all hover:bg-green-50"
                >
                  <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))
            ) : (
              <p className="p-4 rounded-2xl bg-cream/50 text-xs text-brown-700/70 text-center">
                Lakukan check-in harian untuk memunculkan rekomendasi yang tepat.
              </p>
            )}
          </div>
        </div>

        <p className="text-[10px] leading-4 text-brown-700/50 pt-2 border-t border-brown-900/5">
          Rekomendasi sederhana yang dapat langsung diterapkan untuk menjaga stabilitas harian.
        </p>
      </div>
    </div>
  );
}
