"use client";

import React, { useState } from "react";
import {
  CloudRain,
  Cloud,
  Minus,
  Smile,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Moon,
  Bed,
  BedDouble,
  MoonStar,
  Sunrise,
  Sparkle,
  Heart,
  MessageCircle,
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

export interface DailyAssessmentSubmitData {
  mood: string;
  stressLevel: number;
  anxietyLevel: number;
  satisfactionLevel: number;
  productivityLevel: number;
  meTimeLevel: number;
  sleepRating: number;
  sleepHours: string;
  energyLevel: number;
  eatingHabit: number;
  physicalActivity: number;
  socialConnection: number;
  socialSupport: number;
  communityInteraction: number;
  gratitude?: string;
  reflection?: string;
  goal?: string;
  gender?: string;
  age?: string;
  weight?: string;
  soughtHelp?: boolean;
  physicalSymptoms?: string[];
  mentalSymptoms?: string[];
  medications?: string;
  energyTags?: string[];
}

interface FormProps {
  onSubmit: (data: DailyAssessmentSubmitData) => Promise<void>;
  isSubmitting?: boolean;
  onMoodChange?: (mood: string) => void;
  initialValues?: Partial<DailyAssessmentSubmitData>;
}

export const SLEEP_OPTIONS = [
  { rating: 1, label: "< 4 jam", desc: "Insomnia", icon: "😴" },
  { rating: 2, label: "4-5 jam", desc: "Kurang Nyenyak", icon: "🥱" },
  { rating: 3, label: "6-7 jam", desc: "Cukup", icon: "🛌" },
  { rating: 4, label: "7-8 jam", desc: "Pulas & Optimal", icon: "🌙" },
  { rating: 5, label: "> 8 jam", desc: "Sangat Segar", icon: "🌟" },
];

export const ENERGY_TAGS = [
  "Berenergi",
  "Tenang & Fokus",
  "Butuh Kafein",
  "Mengantuk",
  "Overthinking",
  "Santai",
  "Termotivasi",
  "Kewalahan",
  "Lemas",
  "Produktif",
];

// ---------- Mood Ritual Options ----------
const RITUAL_MOODS = [
  {
    value: "DEPRESSED",
    label: "Tertekan",
    sub: "Sangat lelah & berat",
    icon: CloudRain,
    color: "#8B5CF6", // purple
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-700",
  },
  {
    value: "SAD",
    label: "Sedih",
    sub: "Murung atau resah",
    icon: Cloud,
    color: "#F97316", // orange
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-700",
  },
  {
    value: "NEUTRAL",
    label: "Biasa",
    sub: "Tenang & datar",
    icon: Minus,
    color: "#6B5645", // brown/amber
    bg: "bg-amber-50/60",
    border: "border-amber-300",
    text: "text-amber-800",
  },
  {
    value: "HAPPY",
    label: "Senang",
    sub: "Nyaman & bersemangat",
    icon: Smile,
    color: "#EAB308", // warm yellow
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
  },
  {
    value: "OVERJOYED",
    label: "Berenergi",
    sub: "Sangat antusias",
    icon: Sparkles,
    color: "#8FAE5D", // zyba green
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
  },
];

// ---------- Sleep Options with Icons ----------
const RITUAL_SLEEP_OPTIONS = [
  { rating: 1, label: "< 4 jam", sub: "Kurang lelap / insomnia", icon: Moon },
  { rating: 2, label: "4-5 jam", sub: "Kurang nyenyak", icon: Bed },
  { rating: 3, label: "6-7 jam", sub: "Cukup terlelap", icon: BedDouble },
  { rating: 4, label: "7-8 jam", sub: "Pulas & optimal", icon: MoonStar },
  { rating: 5, label: "> 8 jam", sub: "Sangat segar", icon: Sunrise },
];

export function DailyAssessmentForm({
  onSubmit,
  isSubmitting = false,
  onMoodChange,
  initialValues,
}: FormProps) {
  // Step tracker: 1 to 10 + step 11 (Reflection optional before finish)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [mood, setMood] = useState<string>(initialValues?.mood || "HAPPY");
  const [stressLevel, setStressLevel] = useState<number>(initialValues?.stressLevel ?? 2);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(initialValues?.anxietyLevel ?? 2);
  const [satisfactionLevel, setSatisfactionLevel] = useState<number>(initialValues?.satisfactionLevel ?? 4);
  const [productivityLevel, setProductivityLevel] = useState<number>(initialValues?.productivityLevel ?? 3);
  const [sleepRating, setSleepRating] = useState<number>(initialValues?.sleepRating ?? 3);
  const [sleepHours, setSleepHours] = useState<string>(String(initialValues?.sleepHours || "6-7 jam"));
  const [energyLevel, setEnergyLevel] = useState<number>(initialValues?.energyLevel ?? 3);
  const [meTimeLevel, setMeTimeLevel] = useState<number>(initialValues?.meTimeLevel ?? 3);
  const [socialConnection, setSocialConnection] = useState<number>(initialValues?.socialConnection ?? 4);
  const [communityInteraction, setCommunityInteraction] = useState<number>(initialValues?.communityInteraction ?? 3);
  const [reflection, setReflection] = useState<string>(initialValues?.reflection || "");

  const handleNext = () => {
    if (currentStep < 11) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSelectMood = (val: string) => {
    setMood(val);
    if (onMoodChange) onMoodChange(val);
  };

  const handleSelectSleep = (rating: number, label: string) => {
    setSleepRating(rating);
    setSleepHours(label);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // Determine derived energy tag based on answers
    const derivedTags: string[] = [];
    if (energyLevel >= 4) derivedTags.push("Berenergi");
    if (stressLevel <= 2) derivedTags.push("Tenang & Fokus");
    if (stressLevel >= 4) derivedTags.push("Kewalahan");
    if (productivityLevel >= 4) derivedTags.push("Produktif");
    if (sleepRating <= 2) derivedTags.push("Mengantuk");
    if (derivedTags.length === 0) derivedTags.push("Tenang & Fokus");

    await onSubmit({
      mood,
      stressLevel,
      anxietyLevel,
      satisfactionLevel,
      productivityLevel,
      meTimeLevel,
      sleepRating,
      sleepHours,
      energyLevel,
      eatingHabit: 3,
      physicalActivity: 3,
      socialConnection,
      socialSupport: socialConnection,
      communityInteraction,
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
      energyTags: derivedTags,
    });
  };

  // Render Likert 1-5 Component with 40-44px touch targets
  const renderLikertScale = (
    currentValue: number,
    onChange: (val: number) => void,
    lowLabel: string,
    highLabel: string
  ) => {
    return (
      <div className="flex flex-col gap-3 w-full max-w-[420px] mx-auto">
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {[1, 2, 3, 4, 5].map((val) => {
            const isSelected = currentValue === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => onChange(val)}
                className={`h-11 sm:h-12 rounded-xl flex items-center justify-center font-display text-sm sm:text-base font-bold transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-[#1B3C53] text-white border-[#1B3C53] shadow-sm scale-102"
                    : "bg-white text-brown-900/80 border-brown-900/15 hover:border-brown-900/30 hover:bg-cream/40"
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-brown-700/70 font-medium px-1">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[680px] mx-auto bg-white rounded-2xl border border-brown-900/10 p-4 sm:p-6 md:p-8 shadow-xs select-none">
      {/* ── 1. Ritual Header & Progress ─────────────────────────────── */}
      <div className="flex flex-col gap-3 pb-4 mb-5 border-b border-brown-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#1B3C53] bg-[#1B3C53]/10 px-2.5 py-0.5 rounded-full">
              Ritual Harian
            </span>
            <span className="text-xs text-brown-700/70">
              Hari ini · 1–2 menit
            </span>
          </div>
          <span className="text-xs font-bold text-[#1B3C53]">
            {currentStep <= 10 ? `${currentStep} dari 10` : "Refleksi"}
          </span>
        </div>

        {/* Small Dot Progress Indicators */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            return (
              <div
                key={step}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? "w-5 h-2 bg-[#1B3C53]"
                    : isCompleted
                    ? "w-2 h-2 bg-[#8FAE5D]"
                    : "w-2 h-2 bg-brown-900/15"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ── 2. Single Question Per Screen ──────────────────────────── */}
      <div className="min-h-[260px] sm:min-h-[290px] flex flex-col justify-center py-2 sm:py-4">
        {/* QUESTION 1: Mood */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                MENTAL WELLBEING
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Bagaimana perasaanmu hari ini?
              </h2>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 w-full max-w-[480px]">
              {RITUAL_MOODS.map((m) => {
                const Icon = m.icon;
                const isSelected = mood === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => handleSelectMood(m.value)}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#1B3C53] text-white border-[#1B3C53] shadow-xs scale-103"
                        : "bg-white text-brown-900/80 border-brown-900/15 hover:border-brown-900/30 hover:bg-cream/40"
                    }`}
                  >
                    <Icon
                      size={24}
                      className="mb-1 shrink-0"
                      style={{ color: isSelected ? "#FFFFFF" : m.color }}
                    />
                    <span className="text-[11px] sm:text-xs font-bold leading-tight">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-brown-700/70 italic">
              Pilih satu yang paling menggambarkan keadaan hatimu hari ini
            </p>
          </div>
        )}

        {/* QUESTION 2: Stress Level */}
        {currentStep === 2 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                STRESS REGULATION
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Hari ini saya merasa banyak hal yang harus saya pikirkan secara bersamaan.
              </h2>
            </div>

            {renderLikertScale(
              stressLevel,
              setStressLevel,
              "Sangat tidak sesuai",
              "Sangat sesuai"
            )}
          </div>
        )}

        {/* QUESTION 3: Anxiety Level */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                STRESS REGULATION
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa sulit kamu menenangkan rasa cemas atau gelisah hari ini?
              </h2>
            </div>

            {renderLikertScale(
              anxietyLevel,
              setAnxietyLevel,
              "Sangat mudah ditenangkan",
              "Sangat sulit ditenangkan"
            )}
          </div>
        )}

        {/* QUESTION 4: Satisfaction Level */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                MEANING & PURPOSE
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa puas kamu dengan apa yang berhasil kamu jalani hari ini?
              </h2>
            </div>

            {renderLikertScale(
              satisfactionLevel,
              setSatisfactionLevel,
              "Sangat tidak puas",
              "Sangat puas"
            )}
          </div>
        )}

        {/* QUESTION 5: Productivity & Focus */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                FUTURE READINESS
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa fokus dan produktif kamu menjalani aktivitas hari ini?
              </h2>
            </div>

            {renderLikertScale(
              productivityLevel,
              setProductivityLevel,
              "Sulit fokus",
              "Sangat fokus & produktif"
            )}
          </div>
        )}

        {/* QUESTION 6: Sleep Quality & Hours */}
        {currentStep === 6 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                LIFE BALANCE & RECOVERY
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Bagaimana kualitas dan durasi tidurmu semalam?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 w-full max-w-[520px]">
              {RITUAL_SLEEP_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = sleepRating === item.rating;
                return (
                  <button
                    key={item.rating}
                    type="button"
                    onClick={() => handleSelectSleep(item.rating, item.label)}
                    className={`flex sm:flex-col items-center justify-between sm:justify-center p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#1B3C53] text-white border-[#1B3C53] shadow-xs"
                        : "bg-white text-brown-900 border-brown-900/15 hover:bg-cream/40"
                    }`}
                  >
                    <div className="flex items-center sm:flex-col gap-2 sm:gap-1">
                      <Icon size={18} className="shrink-0" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-brown-700/70 sm:mt-1 truncate">
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 7: Energy Level */}
        {currentStep === 7 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                LIFE BALANCE & RECOVERY
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa berenergi dan bertenaga tubuhmu hari ini?
              </h2>
            </div>

            {renderLikertScale(
              energyLevel,
              setEnergyLevel,
              "Sangat lemas",
              "Sangat berenergi"
            )}
          </div>
        )}

        {/* QUESTION 8: Me Time Level */}
        {currentStep === 8 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                SELF-UNDERSTANDING
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa cukup waktu yang kamu berikan untuk dirimu sendiri hari ini?
              </h2>
            </div>

            {renderLikertScale(
              meTimeLevel,
              setMeTimeLevel,
              "Sangat kurang",
              "Sangat cukup & tenang"
            )}
          </div>
        )}

        {/* QUESTION 9: Social Connection */}
        {currentStep === 9 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                SOCIAL CONNECTION
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa terhubung dan didukung kamu oleh orang-orang di sekitarmu hari ini?
              </h2>
            </div>

            {renderLikertScale(
              socialConnection,
              setSocialConnection,
              "Merasa terisolasi",
              "Sangat terhubung & didukung"
            )}
          </div>
        )}

        {/* QUESTION 10: Community Interaction */}
        {currentStep === 10 && (
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#456882]">
                COMMUNITY INTERACTION
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Seberapa aktif kamu berinteraksi secara positif dengan lingkungan atau komunitasmu?
              </h2>
            </div>

            {renderLikertScale(
              communityInteraction,
              setCommunityInteraction,
              "Tidak berinteraksi",
              "Sangat aktif berinteraksi"
            )}
          </div>
        )}

        {/* STEP 11: Reflection (Optional compact step before finish) */}
        {currentStep === 11 && (
          <div className="flex flex-col items-center text-center gap-3 sm:gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#D4AF37]">
                REFLEKSI SINGKAT
              </span>
              <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mt-1 max-w-[480px]">
                Bagaimana harimu hari ini?
              </h2>
              <p className="text-xs text-brown-700/70 mt-1">
                Opsional · Tuliskan sepatah dua patah kata untuk catatan harianmu
              </p>
            </div>

            <div className="w-full max-w-[480px]">
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                placeholder="Tuliskan apa yang kamu syukuri atau hal yang ingin kamu luapkan hari ini..."
                className="w-full rounded-xl border border-brown-900/15 p-3 text-xs sm:text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-hidden focus:ring-1 focus:ring-[#1B3C53] resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Bottom Navigation (Easy tap 40-44px, no overflow on 360px) ─ */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-brown-900/10">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-brown-900/20 text-xs sm:text-sm font-semibold text-brown-900 hover:bg-cream/50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={14} />
            <span>Kembali</span>
          </button>
        ) : (
          <div className="w-16" />
        )}

        {currentStep < 11 ? (
          <button
            type="button"
            onClick={handleNext}
            className="h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-[#1B3C53] text-white text-xs sm:text-sm font-semibold hover:bg-[#1B3C53]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{currentStep === 10 ? "Lanjut ke Refleksi" : "Lanjut"}</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="h-10 sm:h-11 px-6 sm:px-7 rounded-full bg-[#1B3C53] text-white text-xs sm:text-sm font-semibold hover:bg-[#1B3C53]/90 transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </span>
            ) : (
              <>
                <Check size={15} />
                <span>Simpan Assessment</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
