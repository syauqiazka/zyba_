"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, Flame, HeartPulse, Brain, Moon } from "lucide-react";

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
            ? "text-green-700 bg-green-100/70"
            : "text-orange-700 bg-orange-100/70"
        }`}
      >
        {diff > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {sign}
        {formatted}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-brown-900 tracking-tight flex items-center gap-2">
          <span>Ringkasan Perkembangan</span>
          <span className="text-[11px] font-normal text-brown-700/70">
            (vs {timeRangeLabel} sebelumnya)
          </span>
        </h2>

        {streak > 0 && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-brown-900/10 text-[11px] font-bold text-brown-900">
            <Flame size={13} className="text-orange-500" />
            <span>{streak} Hari Konsisten</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. ZYBA SCORE */}
        <div className="rounded-2xl border border-brown-900/10 bg-white/80 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:border-brown-900/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-brown-700">
              <span className="p-1 rounded-lg bg-orange-100/70 text-orange-600">
                <Brain size={14} />
              </span>
              <span>ZYBA Score</span>
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
        <div className="rounded-2xl border border-brown-900/10 bg-white/80 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:border-brown-900/20 transition-colors">
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
        <div className="rounded-2xl border border-brown-900/10 bg-white/80 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:border-brown-900/20 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-brown-700">
              <span className="p-1 rounded-lg bg-mood-depressed/20 text-[#6B5645]">
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
