"use client";

import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Flame,
  HeartPulse,
  Brain,
  Moon,
  Sparkles,
  Compass,
} from "lucide-react";

export interface ProgressMetricData {
  zybaScore: {
    current: number | null;
    previous: number | null;
    diff: number | null;
    condition: string;
  };
  stress: {
    current: number | null;
    previous: number | null;
    diff: number | null;
    label: string;
  };
  recovery: {
    current: number | null;
    previous: number | null;
    diff: number | null;
    label: string;
  };
  streak: number;
  timeRangeLabel: string;
}

export default function ProgressOverview({ data }: { data: ProgressMetricData }) {
  const { zybaScore, stress, recovery, streak, timeRangeLabel } = data;

  const renderDelta = (diff: number | null, invertGood: boolean = false) => {
    if (diff === null || diff === undefined) {
      return (
        <span className="text-[11px] font-semibold text-brown-700/60 bg-cream/70 px-2 py-0.5 rounded-md">
          Periode awal
        </span>
      );
    }

    if (diff === 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brown-700 bg-cream px-2 py-0.5 rounded-md">
          <Minus size={12} /> 0
        </span>
      );
    }

    // For stress, diff < 0 is GOOD. For score/recovery, diff > 0 is GOOD.
    const isGood = invertGood ? diff < 0 : diff > 0;
    const formatted = Math.abs(diff) % 1 === 0 ? Math.abs(diff) : Math.abs(diff).toFixed(1);
    const sign = diff > 0 ? "+" : "-";

    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md ${
          isGood
            ? "text-green-800 bg-green-100/70"
            : "text-orange-700 bg-orange-100/70"
        }`}
      >
        {diff > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {sign}
        {formatted}
      </span>
    );
  };

  const currentScoreVal = zybaScore.current !== null ? Math.round(zybaScore.current) : 75;
  const strokeDashoffset = 251.2 - (251.2 * currentScoreVal) / 100;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Sanctuary Progress Overview Banner (Mockdoc 4A) ── */}
      <div className="bg-orange-100/40 rounded-[24px] border border-orange-500/15 p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shadow-2xs">
              <Compass size={12} />
              Ikhtisar {timeRangeLabel} Terakhir
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-orange-500/20 text-[11px] font-bold text-brown-900 shadow-2xs">
                <Flame size={13} className="text-orange-500" />
                <span>{streak} Hari Refleksi Rutin</span>
              </span>
            )}
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 leading-tight">
            Setiap riak perasaan adalah bagian dari perjalanan tumbuhmu.
          </h2>

          <p className="text-xs sm:text-sm text-brown-700/80 mt-1.5 max-w-xl leading-relaxed font-body">
            Kesejahteraan batin bukanlah garis lurus sempurna, melainkan gelombang yang belajar kita arungi bersama. Amati pola emosimu tanpa rasa bersalah.
          </p>
        </div>

        {/* Ring Skor Hening (pbakaus/impeccable) */}
        <div className="shrink-0 flex items-center gap-4 bg-white/90 p-4 sm:p-5 rounded-[20px] border border-brown-900/10 shadow-2xs">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-cream"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-green-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-xl font-extrabold text-brown-900 leading-none">
                {currentScoreVal}
              </span>
              <span className="text-[9px] font-bold text-brown-700/60 uppercase mt-0.5">
                Skor
              </span>
            </div>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-800">
              Kondisi Dominan
            </span>
            <span className="font-display text-base font-bold text-brown-900 mt-0.5">
              {zybaScore.condition}
            </span>
            <span className="text-[11px] text-brown-700/70 mt-0.5">
              Rerata {timeRangeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3 Metric Cards Row (rounded-[20px] per Anti-Slop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. ZYBA SCORE */}
        <div className="rounded-[20px] border border-brown-900/10 bg-white/95 p-5 sm:p-6 flex flex-col justify-between gap-3 shadow-xs hover:border-brown-900/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-brown-700">
              <span className="p-1 rounded-lg bg-orange-100/70 text-orange-600">
                <Brain size={14} />
              </span>
              <span>Skor Zyba</span>
            </div>
            {renderDelta(zybaScore.diff, false)}
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900 tracking-tight">
                {zybaScore.current !== null ? Math.round(zybaScore.current) : "—"}
              </span>
              <span className="text-xs text-brown-700/60 font-semibold">/100</span>
            </div>

            {zybaScore.previous !== null && (
              <span className="text-xs text-brown-700/70 font-medium">
                sebelumnya <span className="font-bold text-brown-900">{Math.round(zybaScore.previous)}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5 border-t border-brown-900/5 flex items-center justify-between text-[11px]">
            <span className="text-brown-700/70">Kondisi saat ini</span>
            <span className="font-bold text-brown-900">{zybaScore.condition}</span>
          </div>
        </div>

        {/* 2. STRESS LEVEL */}
        <div className="rounded-[20px] border border-brown-900/10 bg-white/95 p-5 sm:p-6 flex flex-col justify-between gap-3 shadow-xs hover:border-brown-900/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-brown-700">
              <span className="p-1 rounded-lg bg-green-100/70 text-green-700">
                <HeartPulse size={14} />
              </span>
              <span>Tingkat Stres</span>
            </div>
            {renderDelta(stress.diff, true)}
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900 tracking-tight">
                {stress.current !== null ? stress.current.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-brown-700/60 font-semibold">/5.0</span>
            </div>

            {stress.previous !== null && (
              <span className="text-xs text-brown-700/70 font-medium">
                sebelumnya <span className="font-bold text-brown-900">{stress.previous.toFixed(1)}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5 border-t border-brown-900/5 flex items-center justify-between text-[11px]">
            <span className="text-brown-700/70">Tingkat rata-rata</span>
            <span className="font-bold text-brown-900">{stress.label}</span>
          </div>
        </div>

        {/* 3. RECOVERY & SLEEP QUALITY */}
        <div className="rounded-[20px] border border-brown-900/10 bg-white/95 p-5 sm:p-6 flex flex-col justify-between gap-3 shadow-xs hover:border-brown-900/20 transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-brown-700">
              <span className="p-1 rounded-lg bg-mood-depressed/20 text-mood-neutral">
                <Moon size={14} />
              </span>
              <span>Kualitas Istirahat</span>
            </div>
            {renderDelta(recovery.diff, false)}
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900 tracking-tight">
                {recovery.current !== null ? recovery.current.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-brown-700/60 font-semibold">/5.0</span>
            </div>

            {recovery.previous !== null && (
              <span className="text-xs text-brown-700/70 font-medium">
                sebelumnya <span className="font-bold text-brown-900">{recovery.previous.toFixed(1)}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5 border-t border-brown-900/5 flex items-center justify-between text-[11px]">
            <span className="text-brown-700/70">Status pemulihan</span>
            <span className="font-bold text-brown-900">{recovery.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
