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
  Heart,
  Compass,
  Lightbulb,
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
  DEPRESSED: { label: "Depressed", icon: CloudRain, tint: "#8B5CF6" },
  SAD: { label: "Sedih", icon: Cloud, tint: "#F97316" },
  NEUTRAL: { label: "Netral", icon: Minus, tint: "#6B5645" },
  HAPPY: { label: "Bahagia", icon: Smile, tint: "#EAB308" },
  OVERJOYED: { label: "Berenergi", icon: Sparkles, tint: "#8FAE5D" },
};

export default function DailyAssessmentSummary({ record }: SummaryProps) {
  const moodKey = String(record?.mood || "HAPPY").toUpperCase();
  const moodData = MOOD_META[moodKey] || {
    label: record?.mood || "Senang",
    icon: Smile,
    tint: "#6B5645",
  };
  const MoodIcon = moodData.icon;

  const finalZybaScore =
    record.zybaScore ?? record.calculatedScore ?? record.score ?? 78;

  // Calculate 6 domain indicators (0 to 100%) for presentation
  const moodScoreMap: Record<string, number> = {
    DEPRESSED: 25,
    SAD: 45,
    NEUTRAL: 65,
    HAPPY: 85,
    OVERJOYED: 98,
  };
  const mentalScore = moodScoreMap[record.mood] || 75;

  const stressVal = record.stressLevel ?? 2;
  const anxietyVal = record.anxietyLevel ?? stressVal;
  // Lower stress/anxiety means better regulation
  const stressRegulationScore = Math.round(
    (((6 - stressVal) + (6 - anxietyVal)) / 10) * 100
  );

  const satisfactionVal = record.satisfactionLevel ?? 4;
  const meaningScore = Math.round((satisfactionVal / 5) * 100);

  const sleepVal = record.sleepRating ?? 3;
  const energyVal = record.energyLevel ?? 3;
  const recoveryScore = Math.round(((sleepVal + energyVal) / 10) * 100);

  const meTimeVal = record.meTimeLevel ?? 3;
  const selfUnderstandingScore = Math.round((meTimeVal / 5) * 100);

  const productivityVal = record.productivityLevel ?? 3;
  const futureReadinessScore = Math.round((productivityVal / 5) * 100);

  const indicators = [
    { label: "Mental Wellbeing", val: mentalScore, color: "bg-[#8FAE5D]" },
    { label: "Stress Regulation", val: stressRegulationScore, color: "bg-[#456882]" },
    { label: "Meaning & Purpose", val: meaningScore, color: "bg-[#D4AF37]" },
    { label: "Life Balance & Recovery", val: recoveryScore, color: "bg-[#1B3C53]" },
    { label: "Self-Understanding", val: selfUnderstandingScore, color: "bg-[#8B5CF6]" },
    { label: "Future Readiness", val: futureReadinessScore, color: "bg-[#F97316]" },
  ];

  // Warm, supportive, non-clinical insight generator
  const getInsightText = () => {
    if (finalZybaScore >= 80) {
      return "Keseimbangan harimu terjaga dengan baik. Energi dan fokusmu berada di titik yang positif. Nikmati pencapaian kecil ini dan pertahankan ritme yang nyaman untuk dirimu.";
    }
    if (stressVal >= 4 || anxietyVal >= 4) {
      return "Pikiranmu sedang memikul banyak hal hari ini. Ingat bahwa kamu tidak harus menyelesaikan semuanya sekaligus. Luangkan beberapa menit untuk rehat sejenak dan bernapas perlahan.";
    }
    if (sleepVal <= 2 || energyVal <= 2) {
      return "Tubuhmu sedang memberi isyarat perlunya pemulihan. Luangkan waktu malam ini untuk beristirahat lebih awal tanpa distraksi gawai agar energimu pulih.";
    }
    return "Kamu berhasil melalui hari ini dengan cukup seimbang. Terus beri apresiasi pada diri sendiri atas setiap langkah kecil yang kamu jalani.";
  };

  const updatedDate = record?.updatedAt
    ? new Date(record.updatedAt)
    : record?.createdAt
    ? new Date(record.createdAt)
    : new Date();
  const validDate = isNaN(updatedDate.getTime()) ? new Date() : updatedDate;
  const updatedTime = validDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col gap-4 select-none animate-in fade-in duration-200">
      {/* ── 1. Header Card: Today's Check-in & Overall Score ────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-brown-900/10 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-brown-900/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#1B3C53] bg-[#1B3C53]/10 px-2.5 py-0.5 rounded-full">
              Assessment Selesai
            </span>
            <span className="text-xs text-brown-700/70">
              Pukul {updatedTime} WIB
            </span>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
            Tercatat
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-brown-900">
              Today&apos;s Check-in
            </h2>
            <p className="text-xs sm:text-sm text-brown-700/80 mt-0.5">
              Gambaran keseimbangan mental, fisik, dan sosialmu hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-brown-900/10 self-start sm:self-center shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60 block">
                Zyba Score
              </span>
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#1B3C53] leading-none">
                {finalZybaScore}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#1B3C53] text-white flex items-center justify-center shrink-0">
              <MoodIcon size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Compact Horizontal Bars: 6 Domains ──────────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brown-900/10 shadow-xs">
        <h3 className="font-display text-xs sm:text-sm font-bold text-brown-900 mb-3 flex items-center gap-1.5">
          <Compass size={14} className="text-[#456882]" />
          <span>Indikator Kesejahteraan Harian</span>
        </h3>

        <div className="flex flex-col gap-2.5">
          {indicators.map((ind) => (
            <div key={ind.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="font-medium text-brown-900/90">{ind.label}</span>
                <span className="font-bold text-brown-700">{ind.val}%</span>
              </div>
              <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${ind.color}`}
                  style={{ width: `${ind.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Today's Insight (Warm, Human, Supportive) ────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brown-900/10 shadow-xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 text-[#927318] flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xs sm:text-sm font-bold text-brown-900 mb-1">
            Today&apos;s Insight
          </h3>
          <p className="text-xs sm:text-sm text-brown-700/90 leading-relaxed">
            {getInsightText()}
          </p>
        </div>
      </div>

      {/* ── 4. Reflection Quote Box ─────────────────────────────────── */}
      {record.reflection && (
        <div className="bg-white rounded-2xl p-4 border border-brown-900/10 shadow-xs flex items-start gap-3">
          <Quote size={16} className="text-[#1B3C53] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brown-700/60 block mb-1">
              Refleksi Hari Ini
            </span>
            <p className="text-xs sm:text-sm text-brown-900 italic leading-relaxed">
              &ldquo;{record.reflection}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
