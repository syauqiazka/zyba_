"use client";

import React from "react";
import {
  CheckCircle2,
  Smile,
  Sparkles,
  Minus,
  Cloud,
  CloudRain,
  ShieldCheck,
  Activity,
  AlertCircle,
  Flame,
  Moon,
  Bed,
  BedDouble,
  MoonStar,
  Sunrise,
  Tag,
  Quote,
} from "lucide-react";
import { DailyRecord, MOODS, SLEEP_OPTIONS } from "./DailyAssessmentForm";

interface SummaryProps {
  record: DailyRecord;
  onEdit?: () => void;
}

const MOOD_META: Record<
  string,
  { label: string; icon: React.ElementType; tint: string }
> = {
  DEPRESSED: { label: "Depressed", icon: CloudRain, tint: "#A99BE0" },
  SAD: { label: "Sedih", icon: Cloud, tint: "#EE8A5E" },
  NEUTRAL: { label: "Netral", icon: Minus, tint: "#6B5645" },
  HAPPY: { label: "Bahagia", icon: Smile, tint: "#E8C24A" },
  OVERJOYED: { label: "Berenergi", icon: Sparkles, tint: "#8FAE5D" },
};

const STRESS_LABELS = ["", "Tenang", "Rendah", "Sedang", "Tinggi", "Intens"];

export default function DailyAssessmentSummary({ record }: SummaryProps) {
  const moodData = MOOD_META[record.mood] || {
    label: record.mood,
    icon: Smile,
    tint: "#6B5645",
  };
  const MoodIcon = moodData.icon;

  const sleepOption = SLEEP_OPTIONS.find((o) => o.rating === record.sleepRating);
  const sleepText = record.sleepHours || sleepOption?.label || "6-7 jam";

  const getSleepIcon = (rating: number | null) => {
    switch (rating) {
      case 1:
        return Moon;
      case 2:
        return Bed;
      case 3:
        return BedDouble;
      case 4:
        return MoonStar;
      case 5:
        return Sunrise;
      default:
        return BedDouble;
    }
  };
  const SleepIcon = getSleepIcon(record.sleepRating);

  const getStressIcon = (lvl: number | null) => {
    if (!lvl || lvl <= 1) return ShieldCheck;
    if (lvl === 2) return Smile;
    if (lvl === 3) return Activity;
    if (lvl === 4) return AlertCircle;
    return Flame;
  };
  const StressIcon = getStressIcon(record.stressLevel);

  const updatedTime = new Date(record.updatedAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-3 sm:gap-4 select-none">
      {/* ── 1. Compact Completion Notice ───────────────────────────── */}
      <div className="flex items-center justify-between p-3 sm:p-3.5 bg-green-100/60 rounded-2xl border border-green-500/25">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-brown-900 leading-tight">
              Assessment Harian Selesai
            </p>
            <p className="text-[10px] sm:text-xs text-brown-700/80 truncate">
              Tercatat pukul {updatedTime} WIB · 1 evaluasi per hari
            </p>
          </div>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-green-700 bg-white/70 border border-green-500/20 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
          Tersimpan
        </span>
      </div>

      {/* ── 2. Compact Horizontal Condition Row (Mood | Stress | Sleep) ─ */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-brown-900/10 shadow-2xs">
        <div className="grid grid-cols-3 divide-x divide-brown-900/10 text-center">
          {/* Item 1: Mood */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brown-700/60 mb-1">
              Mood
            </span>
            <div className="flex items-center gap-1.5">
              <MoodIcon
                size={18}
                className="shrink-0"
                style={{ color: moodData.tint }}
              />
              <span className="font-display font-bold text-xs sm:text-sm text-brown-900 truncate">
                {moodData.label}
              </span>
            </div>
          </div>

          {/* Item 2: Stress */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brown-700/60 mb-1">
              Level Stres
            </span>
            <div className="flex items-center gap-1.5">
              <StressIcon size={16} className="text-orange-600 shrink-0" />
              <span className="font-display font-bold text-xs sm:text-sm text-brown-900">
                {record.stressLevel ?? 2}
                <span className="text-[10px] font-normal text-brown-700/60">/5</span>
              </span>
              <span className="text-[10px] text-brown-700/70 hidden sm:inline truncate">
                ({STRESS_LABELS[record.stressLevel ?? 2] || "Terkontrol"})
              </span>
            </div>
          </div>

          {/* Item 3: Sleep */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brown-700/60 mb-1">
              Tidur
            </span>
            <div className="flex items-center gap-1.5">
              <SleepIcon size={16} className="text-indigo-600 shrink-0" />
              <span className="font-display font-bold text-xs sm:text-sm text-brown-900 truncate">
                {sleepText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Energy Tags (Compact Horizontal) ────────────────────── */}
      {record.energyTags && record.energyTags.length > 0 && (
        <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-brown-900/10 shadow-2xs flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-bold text-brown-700/70 mr-1 shrink-0">
            <Tag size={13} />
            <span>Kondisi:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {record.energyTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-cream/80 border border-brown-900/10 rounded-full text-[11px] font-semibold text-brown-900"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Reflection (Compact quote box) ──────────────────────── */}
      {record.reflection && (
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-brown-900/10 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-brown-700">
            <Quote size={13} className="text-orange-500" />
            <span>Refleksi Hari Ini</span>
          </div>
          <p className="text-xs sm:text-sm text-brown-900/90 leading-relaxed italic pl-2 border-l-2 border-orange-400">
            &ldquo;{record.reflection}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
