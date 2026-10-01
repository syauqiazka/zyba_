"use client";

import React, { useState } from "react";
import {
  CloudRain,
  Cloud,
  Minus,
  Smile,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertCircle,
  Flame,
  Moon,
  Bed,
  BedDouble,
  MoonStar,
  Sunrise,
  Check,
  ArrowRight,
} from "lucide-react";
import { MOODS } from "@/lib/moods";

export { MOODS };

// ---------- Types (Preserved for compatibility) ----------
export interface DailyRecord {
  id: string;
  date: string;
  mood: string;

  stressLevel: number | null;
  anxietyLevel?: number | null;
  satisfactionLevel?: number | null;
  productivityLevel?: number | null;
  meTimeLevel?: number | null;

  sleepRating: number | null;
  sleepHours?: number | string | null;

  energyLevel?: number | null;
  eatingHabit?: number | null;
  physicalActivity?: number | null;

  socialConnection?: number | null;
  socialSupport?: number | null;
  communityInteraction?: number | null;

  energyTags: string[];
  gratitude?: string | null;
  reflection: string | null;

  calculatedScore?: number | null;
  zybaScore?: number | null;
  score?: number | null;

  condition?: string | null;
  flaggedForRisk: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const SLEEP_OPTIONS = [
  { rating: 1, label: "< 4 jam", desc: "Insomnia", icon: "😴" },
  { rating: 2, label: "4-5 jam", desc: "Kurang Nyenyak", icon: "🥱" },
  { rating: 3, label: "6-7 jam", desc: "Cukup", icon: "🛌" },
  { rating: 4, label: "7-8 jam", desc: "Pulas & Optimal", icon: "🌙" },
  { rating: 5, label: "> 8 jam", desc: "Sangat Segar", icon: "🌟" },
];

export const PHYSICAL_SYMPTOMS_LIST = [
  "Pusing / Sakit Kepala",
  "Sulit Tidur / Insomnia",
  "Jantung Berdebar Kencang",
  "Sesak Napas Ringan",
  "Tubuh Terasa Lemah",
  "Nyeri Otot / Leher Kaku",
];

export const MENTAL_SYMPTOMS_LIST = [
  "Kecemasan Berlebih (Anxiety)",
  "Perubahan Mood Mendadak",
  "Sulit Berfokus saat Belajar/Kerja",
  "Rasa Lelah Mental Berkelanjutan",
];

export const ENERGY_TAGS = [
  "Berenergi",
  "Tenang & Fokus",
  "Butuh Kafein",
  "Mengantuk",
  "Overthinking",
  "Termotivasi",
  "Sehat & Bugar",
  "Butuh Me-Time",
  "Bersosialisasi",
  "Jalan Santai",
];

export const GOALS_LIST = [
  "Stress Relief & Relaxation",
  "Memperbaiki Kualitas Tidur",
  "Meningkatkan Fokus & Produktivitas",
  "Curhat & Konseling AI 24/7",
];

export interface DailyAssessmentSubmitData {
  mood: string;
  stressLevel: number;
  anxietyLevel: number;
  satisfactionLevel: number;
  productivityLevel: number;
  meTimeLevel: number;
  sleepRating: number;
  sleepHours: number | string;
  energyLevel: number;
  eatingHabit: number;
  physicalActivity: number;
  socialConnection: number;
  socialSupport: number;
  communityInteraction: number;
  gratitude: string;
  reflection: string;
  goal: string;
  gender: string;
  age: string;
  weight: string;
  soughtHelp: boolean | null;
  physicalSymptoms: string[];
  mentalSymptoms: string[];
  medications: string;
  energyTags: string[];
  calculatedScore?: number;
}

interface FormProps {
  isEdit?: boolean;
  initialValues?: Partial<DailyRecord>;
  onSubmit: (formData: any) => Promise<void> | void;
  isSubmitting?: boolean;
  onMoodChange?: (mood: string) => void;
}

// ── Progressive Color System ──────────────────────────────────────────────
// Rule: negative/stressful/depriving states → cool/purple/red
//       neutral states → amber/brown
//       positive/restful/energised states → green

// Mood: DEPRESSED(purple) → SAD(orange) → NEUTRAL(brown) → HAPPY(yellow) → OVERJOYED(green)
const MOOD_COLORS: Record<string, {
  selBg: string;
  selRing: string;
  iconHex: string;
  badgeCls: string;
}> = {
  DEPRESSED: {
    selBg:   "bg-[#A99BE0] border-[#A99BE0]",
    selRing: "ring-[#A99BE0]/40",
    iconHex: "#A99BE0",
    badgeCls:"bg-[#EDE9FB] text-[#6B55C4] border-[#A99BE0]/30",
  },
  SAD: {
    selBg:   "bg-[#EE8A5E] border-[#EE8A5E]",
    selRing: "ring-[#EE8A5E]/40",
    iconHex: "#EE8A5E",
    badgeCls:"bg-[#FDE8DE] text-[#B85A2A] border-[#EE8A5E]/30",
  },
  NEUTRAL: {
    selBg:   "bg-[#8C7565] border-[#8C7565]",
    selRing: "ring-[#8C7565]/40",
    iconHex: "#8C7565",
    badgeCls:"bg-[#EDE5DD] text-[#5A4636] border-[#8C7565]/30",
  },
  HAPPY: {
    selBg:   "bg-[#E8C24A] border-[#E8C24A]",
    selRing: "ring-[#E8C24A]/40",
    iconHex: "#D4A800",
    badgeCls:"bg-[#FDF5CC] text-[#8A6A00] border-[#E8C24A]/30",
  },
  OVERJOYED: {
    selBg:   "bg-[#8FAE5D] border-[#8FAE5D]",
    selRing: "ring-[#8FAE5D]/40",
    iconHex: "#8FAE5D",
    badgeCls:"bg-[#E4EED2] text-[#4D6B1E] border-[#8FAE5D]/30",
  },
};

// Stress: 1(green/calm) → 5(red/intense)
const STRESS_COLORS: Record<number, {
  selBg: string;
  selRing: string;
  iconHex: string;
  badgeCls: string;
}> = {
  1: { selBg: "bg-[#8FAE5D] border-[#8FAE5D]", selRing: "ring-[#8FAE5D]/40", iconHex: "#8FAE5D", badgeCls: "bg-[#E4EED2] text-[#4D6B1E] border-[#8FAE5D]/30" },
  2: { selBg: "bg-[#E8C24A] border-[#E8C24A]", selRing: "ring-[#E8C24A]/40", iconHex: "#D4A800", badgeCls: "bg-[#FDF5CC] text-[#8A6A00] border-[#E8C24A]/30" },
  3: { selBg: "bg-[#F2A55A] border-[#F2A55A]", selRing: "ring-[#F2A55A]/40", iconHex: "#E07020", badgeCls: "bg-[#FDE8CC] text-[#954A00] border-[#F2A55A]/30" },
  4: { selBg: "bg-[#E8714A] border-[#E8714A]", selRing: "ring-[#E8714A]/40", iconHex: "#C44A20", badgeCls: "bg-[#FDD8CC] text-[#8A2A00] border-[#E8714A]/30" },
  5: { selBg: "bg-[#C0392B] border-[#C0392B]", selRing: "ring-[#C0392B]/40", iconHex: "#8B0000", badgeCls: "bg-[#FADBD8] text-[#7B241C] border-[#C0392B]/30" },
};

// Sleep: 1(purple/insomnia) → 5(teal-green/refreshed)
const SLEEP_COLORS: Record<number, {
  selBg: string;
  selRing: string;
  iconHex: string;
  badgeCls: string;
}> = {
  1: { selBg: "bg-[#9B59B6] border-[#9B59B6]", selRing: "ring-[#9B59B6]/40", iconHex: "#9B59B6", badgeCls: "bg-[#EADAF5] text-[#5B2C7E] border-[#9B59B6]/30" },
  2: { selBg: "bg-[#A99BE0] border-[#A99BE0]", selRing: "ring-[#A99BE0]/40", iconHex: "#A99BE0", badgeCls: "bg-[#EDE9FB] text-[#6B55C4] border-[#A99BE0]/30" },
  3: { selBg: "bg-[#E8C24A] border-[#E8C24A]", selRing: "ring-[#E8C24A]/40", iconHex: "#D4A800", badgeCls: "bg-[#FDF5CC] text-[#8A6A00] border-[#E8C24A]/30" },
  4: { selBg: "bg-[#8FAE5D] border-[#8FAE5D]", selRing: "ring-[#8FAE5D]/40", iconHex: "#8FAE5D", badgeCls: "bg-[#E4EED2] text-[#4D6B1E] border-[#8FAE5D]/30" },
  5: { selBg: "bg-[#5DAE8F] border-[#5DAE8F]", selRing: "ring-[#5DAE8F]/40", iconHex: "#1E6B4D", badgeCls: "bg-[#D2EEE4] text-[#1E6B4D] border-[#5DAE8F]/30" },
};

// Energy tags: each has individual semantic color
const ENERGY_TAG_COLORS: Record<string, { sel: string; unsel: string }> = {
  "Berenergi":      { sel: "bg-[#8FAE5D] border-[#8FAE5D] text-white",           unsel: "bg-white/80 text-[#4D6B1E] border-[#8FAE5D]/40 hover:bg-[#E4EED2]" },
  "Tenang & Fokus": { sel: "bg-[#5DAE8F] border-[#5DAE8F] text-white",           unsel: "bg-white/80 text-[#1E6B4D] border-[#5DAE8F]/40 hover:bg-[#D2EEE4]" },
  "Termotivasi":    { sel: "bg-[#E8C24A] border-[#E8C24A] text-[#5A3A00]",       unsel: "bg-white/80 text-[#8A6A00] border-[#E8C24A]/40 hover:bg-[#FDF5CC]" },
  "Sehat & Bugar":  { sel: "bg-[#8FAE5D] border-[#8FAE5D] text-white",           unsel: "bg-white/80 text-[#4D6B1E] border-[#8FAE5D]/40 hover:bg-[#E4EED2]" },
  "Bersosialisasi": { sel: "bg-[#5DAE8F] border-[#5DAE8F] text-white",           unsel: "bg-white/80 text-[#1E6B4D] border-[#5DAE8F]/40 hover:bg-[#D2EEE4]" },
  "Jalan Santai":   { sel: "bg-[#A99BE0] border-[#A99BE0] text-white",           unsel: "bg-white/80 text-[#6B55C4] border-[#A99BE0]/40 hover:bg-[#EDE9FB]" },
  "Butuh Kafein":   { sel: "bg-[#F2A55A] border-[#F2A55A] text-white",           unsel: "bg-white/80 text-[#954A00] border-[#F2A55A]/40 hover:bg-[#FDE8CC]" },
  "Mengantuk":      { sel: "bg-[#9B59B6] border-[#9B59B6] text-white",           unsel: "bg-white/80 text-[#5B2C7E] border-[#9B59B6]/40 hover:bg-[#EADAF5]" },
  "Overthinking":   { sel: "bg-[#E8714A] border-[#E8714A] text-white",           unsel: "bg-white/80 text-[#8A2A00] border-[#E8714A]/40 hover:bg-[#FDD8CC]" },
  "Butuh Me-Time":  { sel: "bg-[#EE8A5E] border-[#EE8A5E] text-white",           unsel: "bg-white/80 text-[#B85A2A] border-[#EE8A5E]/40 hover:bg-[#FDE8DE]" },
};

const FALLBACK_TAG = {
  sel: "bg-brown-900 border-brown-900 text-white",
  unsel: "bg-white/80 text-brown-700 border-brown-900/12 hover:border-brown-900/25 hover:bg-white",
};

// ── Icon & data definitions ─────────────────────────────────────────────────
const RITUAL_MOODS = [
  { value: "DEPRESSED", label: "Depressed",  sub: "Terpuruk",    icon: CloudRain },
  { value: "SAD",       label: "Sedih",      sub: "Kurang Baik", icon: Cloud },
  { value: "NEUTRAL",   label: "Netral",     sub: "Biasa Saja",  icon: Minus },
  { value: "HAPPY",     label: "Bahagia",    sub: "Cukup Baik",  icon: Smile },
  { value: "OVERJOYED", label: "Berenergi",  sub: "Sangat Baik", icon: Sparkles },
];

const RITUAL_STRESS = [
  { value: 1, label: "Tenang",  sub: "Sangat Rendah", icon: ShieldCheck },
  { value: 2, label: "Rendah",  sub: "Terkontrol",    icon: Smile },
  { value: 3, label: "Sedang",  sub: "Mulai Terasa",  icon: Activity },
  { value: 4, label: "Tinggi",  sub: "Berat",         icon: AlertCircle },
  { value: 5, label: "Intens",  sub: "Sangat Tinggi", icon: Flame },
];

const RITUAL_SLEEP = [
  { rating: 1, label: "< 4 jam", sub: "Insomnia", icon: Moon },
  { rating: 2, label: "4-5 jam", sub: "Kurang",   icon: Bed },
  { rating: 3, label: "6-7 jam", sub: "Cukup",    icon: BedDouble },
  { rating: 4, label: "7-8 jam", sub: "Optimal",  icon: MoonStar },
  { rating: 5, label: "> 8 jam", sub: "Segar",    icon: Sunrise },
];

// ── Shared section shell ──────────────────────────────────────────────────
const sectionCls = (active: boolean) =>
  `rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-200 border cursor-pointer ${
    active
      ? "bg-white border-brown-900/15 shadow-xs ring-1 ring-orange-500/15"
      : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-brown-900/10 opacity-75"
  }`;

// ── Main component ────────────────────────────────────────────────────────
export function DailyAssessmentForm({
  onSubmit,
  isSubmitting = false,
  onMoodChange,
  initialValues,
}: FormProps) {
  const [mood,        setMood]        = useState<string>(initialValues?.mood || "HAPPY");
  const [stressLevel, setStressLevel] = useState<number>(initialValues?.stressLevel ?? 2);
  const [sleepRating, setSleepRating] = useState<number>(initialValues?.sleepRating ?? 3);
  const [sleepHours,  setSleepHours]  = useState<string>(String(initialValues?.sleepHours || "6-7 jam"));
  const [energyTags,  setEnergyTags]  = useState<string[]>(
    Array.isArray(initialValues?.energyTags) ? initialValues.energyTags : ["Tenang & Fokus"]
  );
  const [reflection, setReflection]   = useState<string>(initialValues?.reflection || "");
  const [activeStep, setActiveStep]   = useState<number>(1);

  const handleSelectMood = (val: string) => {
    setMood(val);
    if (onMoodChange) onMoodChange(val);
    if (activeStep === 1) setActiveStep(2);
  };

  const handleSelectStress = (val: number) => {
    setStressLevel(val);
    if (activeStep === 2) setActiveStep(3);
  };

  const handleSelectSleep = (rating: number, hours: string) => {
    setSleepRating(rating);
    setSleepHours(hours);
    if (activeStep === 3) setActiveStep(4);
  };

  const toggleTag = (tag: string) =>
    setEnergyTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    await onSubmit({
      mood,
      stressLevel,
      anxietyLevel: stressLevel,
      satisfactionLevel: mood === "OVERJOYED" ? 5 : mood === "HAPPY" ? 4 : mood === "NEUTRAL" ? 3 : 2,
      productivityLevel: 3,
      meTimeLevel: 3,
      sleepRating,
      sleepHours,
      energyLevel: mood === "OVERJOYED" ? 5 : mood === "HAPPY" ? 4 : mood === "NEUTRAL" ? 3 : 2,
      eatingHabit: 3,
      physicalActivity: 3,
      socialConnection: 3,
      socialSupport: 3,
      communityInteraction: 3,
      gratitude: "",
      reflection: reflection.trim(),
      goal: "Daily Wellness Check",
      gender: "",
      age: "",
      weight: "",
      soughtHelp: false,
      physicalSymptoms: [],
      mentalSymptoms: [],
      medications: "",
      energyTags,
    } satisfies DailyAssessmentSubmitData);
  };

  const moodObj    = RITUAL_MOODS.find((m) => m.value === mood);
  const stressObj  = RITUAL_STRESS.find((s) => s.value === stressLevel);
  const sleepObj   = RITUAL_SLEEP.find((sl) => sl.rating === sleepRating);
  const moodCol    = MOOD_COLORS[mood];
  const stressCol  = STRESS_COLORS[stressLevel];
  const sleepCol   = SLEEP_COLORS[sleepRating];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 select-none">

      {/* ── Q1: Mood ─────────────────────────────────────────────────── */}
      <section onClick={() => setActiveStep(1)} className={sectionCls(activeStep === 1)}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
            Pertanyaan 1 dari 5
          </span>
          {activeStep !== 1 && moodObj && moodCol && (
            <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${moodCol.badgeCls}`}>
              <Check size={12} />{moodObj.label}
            </span>
          )}
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-3">
          Bagaimana perasaanmu hari ini?
        </h3>
        {activeStep === 1 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
              {RITUAL_MOODS.map(({ value, label, sub, icon: Icon }) => {
                const isSel = mood === value;
                const col = MOOD_COLORS[value];
                return (
                  <button
                    key={value} type="button"
                    onClick={(e) => { e.stopPropagation(); handleSelectMood(value); }}
                    className={`p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${
                      isSel
                        ? `${col.selBg} text-white shadow-sm scale-[1.04] ring-2 ${col.selRing}`
                        : "bg-white/80 hover:bg-white border-brown-900/10 hover:border-brown-900/20 hover:scale-[1.02]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={isSel ? 2.5 : 2}
                      style={{ color: isSel ? "white" : col.iconHex }} />
                    <span className="text-[11px] sm:text-xs font-bold truncate max-w-full"
                      style={{ color: isSel ? "white" : undefined }}>
                      {label}
                    </span>
                    <span className="text-[9px] hidden sm:block truncate"
                      style={{ color: isSel ? "rgba(255,255,255,0.75)" : col.iconHex + "99" }}>
                      {sub}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-1">
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveStep(2); }}
                className="text-xs font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1">
                Lanjut ke Pertanyaan 2 →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Q2: Stress ───────────────────────────────────────────────── */}
      <section onClick={() => setActiveStep(2)} className={sectionCls(activeStep === 2)}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
            Pertanyaan 2 dari 5
          </span>
          {activeStep !== 2 && stressObj && stressCol && (
            <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${stressCol.badgeCls}`}>
              <Check size={12} />Tingkat {stressLevel}/5 ({stressObj.label})
            </span>
          )}
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-3">
          Seberapa besar tingkat stres yang kamu rasakan?
        </h3>
        {activeStep === 2 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {RITUAL_STRESS.map(({ value, label, sub, icon: Icon }) => {
                const isSel = stressLevel === value;
                const col = STRESS_COLORS[value];
                return (
                  <button
                    key={value} type="button"
                    onClick={(e) => { e.stopPropagation(); handleSelectStress(value); }}
                    className={`p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${
                      isSel
                        ? `${col.selBg} text-white shadow-sm scale-[1.04] ring-2 ${col.selRing}`
                        : "bg-white/80 hover:bg-white border-brown-900/10 hover:border-brown-900/20 hover:scale-[1.02]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isSel ? 2.5 : 2}
                      style={{ color: isSel ? "white" : col.iconHex }} />
                    <span className="font-display text-xs sm:text-sm font-black"
                      style={{ color: isSel ? "white" : undefined }}>{value}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold truncate"
                      style={{ color: isSel ? "rgba(255,255,255,0.85)" : col.iconHex + "BB" }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Gradient legend */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-brown-700/60 shrink-0">Tenang</span>
              <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-[#8FAE5D] via-[#F2A55A] to-[#C0392B] opacity-60" />
              <span className="text-[10px] text-brown-700/60 shrink-0">Intens</span>
            </div>
            <div className="flex justify-between items-center text-xs text-brown-700">
              <span className="text-[11px] text-brown-700/70">1 = Paling tenang, 5 = Paling berat</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveStep(3); }}
                className="font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1">
                Lanjut ke Pertanyaan 3 →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Q3: Sleep ────────────────────────────────────────────────── */}
      <section onClick={() => setActiveStep(3)} className={sectionCls(activeStep === 3)}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
            Pertanyaan 3 dari 5
          </span>
          {activeStep !== 3 && sleepObj && sleepCol && (
            <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${sleepCol.badgeCls}`}>
              <Check size={12} />{sleepObj.label} ({sleepObj.sub})
            </span>
          )}
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-3">
          Bagaimana kualitas tidurmu semalam?
        </h3>
        {activeStep === 3 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {RITUAL_SLEEP.map(({ rating, label, sub, icon: Icon }) => {
                const isSel = sleepRating === rating;
                const col = SLEEP_COLORS[rating];
                return (
                  <button
                    key={rating} type="button"
                    onClick={(e) => { e.stopPropagation(); handleSelectSleep(rating, label); }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSel
                        ? `${col.selBg} text-white shadow-sm scale-[1.04] ring-2 ${col.selRing}`
                        : "bg-white/80 hover:bg-white border-brown-900/10 hover:border-brown-900/20 hover:scale-[1.02]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isSel ? 2.5 : 2}
                      style={{ color: isSel ? "white" : col.iconHex }} />
                    <span className="text-xs font-bold"
                      style={{ color: isSel ? "white" : undefined }}>{label}</span>
                    <span className="text-[10px]"
                      style={{ color: isSel ? "rgba(255,255,255,0.75)" : col.iconHex + "99" }}>
                      {sub}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Gradient legend */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-brown-700/60 shrink-0">Insomnia</span>
              <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-[#9B59B6] via-[#E8C24A] to-[#5DAE8F] opacity-60" />
              <span className="text-[10px] text-brown-700/60 shrink-0">Segar</span>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveStep(4); }}
                className="text-xs font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1">
                Lanjut ke Pertanyaan 4 →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Q4: Energy Tags ──────────────────────────────────────────── */}
      <section onClick={() => setActiveStep(4)} className={sectionCls(activeStep === 4)}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
            Pertanyaan 4 dari 5
          </span>
          {activeStep !== 4 && energyTags.length > 0 && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />{energyTags.length} tag terpilih
            </span>
          )}
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-2">
          Apa yang memberikan atau mempengaruhi energimu hari ini?
        </h3>
        <p className="text-xs text-brown-700/80 mb-3">
          Pilih satu atau beberapa kondisi yang paling menggambarkan dirimu.
        </p>
        {activeStep === 4 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {ENERGY_TAGS.map((tag) => {
                const isSel = energyTags.includes(tag);
                const col = ENERGY_TAG_COLORS[tag] ?? FALLBACK_TAG;
                return (
                  <button key={tag} type="button"
                    onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      isSel ? `${col.sel} shadow-2xs font-bold scale-[1.03]` : col.unsel
                    }`}
                  >
                    {isSel && <Check size={11} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-1">
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveStep(5); }}
                className="text-xs font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1">
                Lanjut ke Refleksi (Terakhir) →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Q5: Reflection ───────────────────────────────────────────── */}
      <section onClick={() => setActiveStep(5)} className={sectionCls(activeStep === 5)}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
            Pertanyaan 5 dari 5
          </span>
          {activeStep !== 5 && reflection && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />Tercatat
            </span>
          )}
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-1.5">
          Ada yang ingin kamu refleksikan hari ini?
        </h3>
        <p className="text-xs text-brown-700/80 mb-3">
          Tuliskan apa pun yang mengganjal atau kamu syukuri. Privat dan aman. (Opsional)
        </p>
        {activeStep === 5 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              rows={3}
              placeholder="Ceritakan pikiran atau perasaanmu dengan jujur..."
              className="w-full bg-[#FAF7F2]/60 focus:bg-white rounded-xl border border-brown-900/15 p-3 text-xs sm:text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors resize-none leading-relaxed"
            />
          </div>
        )}
      </section>

      {/* ── Submit ───────────────────────────────────────────────────── */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <div className="text-[11px] text-brown-700/70">
          Semua jawaban tersimpan aman &amp; privat.
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !mood}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-orange-500 hover:bg-brown-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          {isSubmitting ? (
            <span>Menyimpan...</span>
          ) : (
            <>
              <span>Selesaikan Assessment</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default DailyAssessmentForm;
