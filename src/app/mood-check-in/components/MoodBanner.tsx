"use client";

import React from "react";
import { CloudRain, Cloud, Minus, Smile, Sparkles, CheckCircle2, Clock, Flame } from "lucide-react";

function getMoodIcon(val: string) {
  switch (val?.toUpperCase()) {
    case "DEPRESSED":
      return <CloudRain size={32} className="text-white" strokeWidth={1.8} />;
    case "SAD":
      return <Cloud size={32} className="text-white" strokeWidth={1.8} />;
    case "NEUTRAL":
      return <Minus size={32} className="text-white" strokeWidth={2} />;
    case "HAPPY":
      return <Smile size={32} className="text-white" strokeWidth={1.8} />;
    case "OVERJOYED":
      return <Sparkles size={32} className="text-white" strokeWidth={1.8} />;
    default:
      return <Sparkles size={32} className="text-white" strokeWidth={1.8} />;
  }
}

interface MoodBannerProps {
  selectedMood: {
    value: string;
    label: string;
    emoji?: string;
    bg: string;
    text: string;
  };
  streak?: number;
  dateStr?: string;
  badgeLabel?: string;
  title?: string;
  description?: string;
  /** undefined = badge status disembunyikan (mis. saat loading) */
  status?: { done: boolean };
}

export default function MoodBanner({
  selectedMood,
  streak = 1,
  dateStr,
  badgeLabel = "Assessment Harian",
  title = "Evaluasi Kondisiku Hari Ini",
  description = "Rekam kondisi harianmu secara komprehensif — profil, mood, gejala, kualitas tidur, tingkat stres & refleksi AI.",
  status,
}: MoodBannerProps) {
  const displayDate =
    dateStr ||
    new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

  return (
    <div
      style={{ backgroundColor: selectedMood.bg }}
      className="rounded-3xl p-8 text-white transition-colors duration-500 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
          {getMoodIcon(selectedMood.value)}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              {badgeLabel}
            </span>
            <span className="text-xs opacity-80">{displayDate}</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm font-bold mt-1">Kondisimu: {selectedMood.label}</p>
          <p className="text-xs opacity-90 mt-1 max-w-lg">{description}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
        {status && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white/20 border border-white/20 text-sm font-bold">
            {status.done ? (
              <>
                <CheckCircle2 size={16} className="text-white shrink-0" strokeWidth={2} />
                <span>Selesai hari ini</span>
              </>
            ) : (
              <>
                <Clock size={16} className="text-white/80 shrink-0" strokeWidth={2} />
                <span>Belum diisi</span>
              </>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider">Konsistensi Jurnal</span>
            <span className="text-xl font-display font-extrabold">{streak} / 365 Hari</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-orange-200 shrink-0">
            <Flame size={20} strokeWidth={2} className="text-orange-300" />
          </div>
        </div>
      </div>
    </div>
  );
}