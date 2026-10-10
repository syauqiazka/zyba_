"use client";

import React from "react";
import { TrendingUp, Target, Calendar, CheckCircle2, ShieldAlert, Award } from "lucide-react";
import { FreeWellnessInsights } from "@/lib/wellness/insightsService";

interface FreeWeeklyInsightProps {
  weekly: FreeWellnessInsights["weekly"];
  dataQuality: FreeWellnessInsights["dataQuality"];
}

export default function FreeWeeklyInsight({ weekly, dataQuality }: FreeWeeklyInsightProps) {
  const metric = (value: number | null, suffix = "") => (value === null ? "—" : `${value}${suffix}`);

  const formatDayDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const d = new Date(`${dateStr}T12:00:00Z`);
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brown-900/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-brown-900 tracking-tight">
              Weekly Insight
            </h3>
            <p className="text-xs text-brown-700/70">
              Evaluasi ritme kesehatan 7 hari terakhir dari check-in aktualmu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              dataQuality.level === "high"
                ? "bg-green-50 border-green-200 text-green-700"
                : dataQuality.level === "medium"
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-cream border-brown-900/10 text-brown-700"
            }`}
            title={dataQuality.hint}
          >
            <CheckCircle2 size={12} />
            <span>{dataQuality.label} ({dataQuality.checkIns} check-in)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Score 7 Hari */}
        <div className="rounded-2xl bg-cream/70 border border-brown-900/5 p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60">
              Skor ZYBA (7 Hari)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl font-extrabold text-brown-900">
                {metric(weekly.score)}
              </span>
              {weekly.scoreDelta !== null && (
                <span
                  className={`text-xs font-bold ${
                    weekly.scoreDelta >= 0 ? "text-green-700" : "text-orange-600"
                  }`}
                >
                  {weekly.scoreDelta >= 0 ? `+${weekly.scoreDelta}` : weekly.scoreDelta} vs minggu lalu
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-brown-700/60 mt-2">
            {weekly.scoreDelta === null
              ? "Perlu data 7 hari sebelumnya untuk perbandingan."
              : weekly.scoreDelta >= 0
                ? "Performa emosional dan fisikmu meningkat stabil."
                : "Sedikit fluktuasi skor; beri jeda untuk pemulihan."}
          </p>
        </div>

        {/* Stres 7 Hari */}
        <div className="rounded-2xl bg-cream/70 border border-brown-900/5 p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60">
              Rata-rata Stres (7 Hari)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl font-extrabold text-brown-900">
                {metric(weekly.stress, " / 5")}
              </span>
              {weekly.stressDelta !== null && (
                <span
                  className={`text-xs font-bold ${
                    weekly.stressDelta <= 0 ? "text-green-700" : "text-orange-600"
                  }`}
                >
                  {weekly.stressDelta > 0 ? `+${weekly.stressDelta}` : weekly.stressDelta} vs minggu lalu
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-brown-700/60 mt-2">
            {weekly.stressDelta === null
              ? "Tingkat stres dipantau dari skala 1–5."
              : weekly.stressDelta <= 0
                ? "Tingkat stresmu terkontrol lebih tenang minggu ini."
                : "Tensi meningkat; luangkan waktu untuk relaksasi napas."}
          </p>
        </div>
      </div>

      {/* Fokus & Hari Terkuat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/50">
          <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Target size={14} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
              Fokus Utama Minggu Ini
            </span>
            <p className="text-xs font-bold text-brown-900 mt-0.5">
              {weekly.focus}
            </p>
            <p className="text-[11px] text-brown-700/70 mt-0.5">
              Diarahkan dari area wellness yang paling memerlukan perhatianmu saat ini.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-2xl bg-green-50/70 border border-green-200/50">
          <div className="w-7 h-7 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Award size={14} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
              Hari Performa Terbaik
            </span>
            <p className="text-xs font-bold text-brown-900 mt-0.5">
              {weekly.strongestDay ? formatDayDate(weekly.strongestDay) : "Belum teridentifikasi"}
            </p>
            <p className="text-[11px] text-brown-700/70 mt-0.5">
              Hari di mana kombinasi mood, tidur, dan energimu berada pada puncak optimal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
