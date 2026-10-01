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
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
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

// ── Lucide Icon Mapping for Calm Ritual ─────────────────────────────
const RITUAL_MOODS = [
  { value: "DEPRESSED", label: "Depressed", sub: "Terpuruk", icon: CloudRain, tint: "#A99BE0" },
  { value: "SAD", label: "Sedih", sub: "Kurang Baik", icon: Cloud, tint: "#EE8A5E" },
  { value: "NEUTRAL", label: "Netral", sub: "Biasa Saja", icon: Minus, tint: "#6B5645" },
  { value: "HAPPY", label: "Bahagia", sub: "Cukup Baik", icon: Smile, tint: "#E8C24A" },
  { value: "OVERJOYED", label: "Berenergi", sub: "Sangat Baik", icon: Sparkles, tint: "#8FAE5D" },
];

const RITUAL_STRESS = [
  { value: 1, label: "Tenang", sub: "Sangat Rendah", icon: ShieldCheck },
  { value: 2, label: "Rendah", sub: "Terkontrol", icon: Smile },
  { value: 3, label: "Sedang", sub: "Mulai Terasa", icon: Activity },
  { value: 4, label: "Tinggi", sub: "Berat", icon: AlertCircle },
  { value: 5, label: "Intens", sub: "Sangat Tinggi", icon: Flame },
];

const RITUAL_SLEEP = [
  { rating: 1, label: "< 4 jam", sub: "Insomnia", icon: Moon },
  { rating: 2, label: "4-5 jam", sub: "Kurang", icon: Bed },
  { rating: 3, label: "6-7 jam", sub: "Cukup", icon: BedDouble },
  { rating: 4, label: "7-8 jam", sub: "Optimal", icon: MoonStar },
  { rating: 5, label: "> 8 jam", sub: "Segar", icon: Sunrise },
];

export function DailyAssessmentForm({
  onSubmit,
  isSubmitting = false,
  onMoodChange,
  initialValues,
}: FormProps) {
  // Form values
  const [mood, setMood] = useState<string>(initialValues?.mood || "HAPPY");
  const [stressLevel, setStressLevel] = useState<number>(initialValues?.stressLevel ?? 2);
  const [sleepRating, setSleepRating] = useState<number>(initialValues?.sleepRating ?? 3);
  const [sleepHours, setSleepHours] = useState<string>(
    String(initialValues?.sleepHours || "6-7 jam")
  );
  const [energyTags, setEnergyTags] = useState<string[]>(
    Array.isArray(initialValues?.energyTags) ? initialValues.energyTags : ["Tenang & Fokus"]
  );
  const [reflection, setReflection] = useState<string>(initialValues?.reflection || "");

  // Progressive flow: Active question (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);

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

  const toggleTag = (tag: string) => {
    setEnergyTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const data: DailyAssessmentSubmitData = {
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
    };

    await onSubmit(data);
  };

  // Helper for answered badges
  const currentMoodObj = RITUAL_MOODS.find((m) => m.value === mood);
  const currentStressObj = RITUAL_STRESS.find((s) => s.value === stressLevel);
  const currentSleepObj = RITUAL_SLEEP.find((sl) => sl.rating === sleepRating);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 select-none">
      {/* ── QUESTION 1: Mood Selector ─────────────────────────────────── */}
      <section
        onClick={() => setActiveStep(1)}
        className={`rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-200 border cursor-pointer ${
          activeStep === 1
            ? "bg-white border-brown-900/15 shadow-xs ring-1 ring-orange-500/15"
            : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-brown-900/10 opacity-75"
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
              Pertanyaan 1 dari 5
            </span>
          </div>
          {activeStep !== 1 && currentMoodObj && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />
              {currentMoodObj.label}
            </span>
          )}
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-3">
          Bagaimana perasaanmu hari ini?
        </h3>

        {activeStep === 1 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
              {RITUAL_MOODS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = mood === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMood(item.value);
                    }}
                    className={`p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${
                      isSelected
                        ? "bg-brown-900 text-cream border-brown-900 shadow-xs scale-[1.02]"
                        : "bg-white/80 hover:bg-white text-brown-700 border-brown-900/10 hover:border-brown-900/20"
                    }`}
                  >
                    <IconComponent
                      size={20}
                      strokeWidth={isSelected ? 2.5 : 2}
                      className={isSelected ? "text-cream" : "text-brown-700"}
                      style={!isSelected ? { color: item.tint } : undefined}
                    />
                    <span className="text-[11px] sm:text-xs font-bold truncate max-w-full">
                      {item.label}
                    </span>
                    <span
                      className={`text-[9px] hidden sm:block truncate ${
                        isSelected ? "text-cream/80" : "text-brown-700/60"
                      }`}
                    >
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(2);
                }}
                className="text-xs font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1"
              >
                Lanjut ke Pertanyaan 2 →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── QUESTION 2: Stress Scale ───────────────────────────────────── */}
      <section
        onClick={() => setActiveStep(2)}
        className={`rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-200 border cursor-pointer ${
          activeStep === 2
            ? "bg-white border-brown-900/15 shadow-xs ring-1 ring-orange-500/15"
            : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-brown-900/10 opacity-75"
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
              Pertanyaan 2 dari 5
            </span>
          </div>
          {activeStep !== 2 && currentStressObj && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />
              Tingkat {stressLevel}/5 ({currentStressObj.label})
            </span>
          )}
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-3">
          Seberapa besar tingkat stres yang kamu rasakan?
        </h3>

        {activeStep === 2 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {RITUAL_STRESS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = stressLevel === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStress(item.value);
                    }}
                    className={`p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${
                      isSelected
                        ? "bg-brown-900 text-cream border-brown-900 shadow-xs scale-[1.02]"
                        : "bg-white/80 hover:bg-white text-brown-700 border-brown-900/10 hover:border-brown-900/20"
                    }`}
                  >
                    <IconComponent
                      size={18}
                      strokeWidth={isSelected ? 2.5 : 2}
                      className={isSelected ? "text-cream" : "text-brown-700"}
                    />
                    <span className="font-display text-xs sm:text-sm font-black">
                      {item.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-1 text-xs text-brown-700">
              <span className="text-[11px] text-brown-700/70">
                1 = Paling tenang, 5 = Paling berat
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(3);
                }}
                className="font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1"
              >
                Lanjut ke Pertanyaan 3 →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── QUESTION 3: Sleep Selection ───────────────────────────────── */}
      <section
        onClick={() => setActiveStep(3)}
        className={`rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-200 border cursor-pointer ${
          activeStep === 3
            ? "bg-white border-brown-900/15 shadow-xs ring-1 ring-orange-500/15"
            : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-brown-900/10 opacity-75"
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
              Pertanyaan 3 dari 5
            </span>
          </div>
          {activeStep !== 3 && currentSleepObj && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />
              {currentSleepObj.label} ({currentSleepObj.sub})
            </span>
          )}
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-3">
          Bagaimana kualitas tidurmu semalam?
        </h3>

        {activeStep === 3 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {RITUAL_SLEEP.map((item) => {
                const IconComponent = item.icon;
                const isSelected = sleepRating === item.rating;
                return (
                  <button
                    key={item.rating}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSleep(item.rating, item.label);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "bg-brown-900 text-cream border-brown-900 shadow-xs scale-[1.02]"
                        : "bg-white/80 hover:bg-white text-brown-700 border-brown-900/10 hover:border-brown-900/20"
                    }`}
                  >
                    <IconComponent
                      size={18}
                      strokeWidth={isSelected ? 2.5 : 2}
                      className={isSelected ? "text-cream" : "text-brown-700"}
                    />
                    <span className="text-xs font-bold">{item.label}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-cream/80" : "text-brown-700/60"
                      }`}
                    >
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(4);
                }}
                className="text-xs font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1"
              >
                Lanjut ke Pertanyaan 4 →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── QUESTION 4: Energy Tags Selection ─────────────────────────── */}
      <section
        onClick={() => setActiveStep(4)}
        className={`rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-200 border cursor-pointer ${
          activeStep === 4
            ? "bg-white border-brown-900/15 shadow-xs ring-1 ring-orange-500/15"
            : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-brown-900/10 opacity-75"
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
              Pertanyaan 4 dari 5
            </span>
          </div>
          {activeStep !== 4 && energyTags.length > 0 && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />
              {energyTags.length} tag terpilih
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
                const isSelected = energyTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(tag);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-brown-900 text-white border-brown-900 shadow-2xs font-bold"
                        : "bg-white/80 hover:bg-white text-brown-700 border-brown-900/12 hover:border-brown-900/25"
                    }`}
                  >
                    {isSelected && <Check size={11} className="text-white" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(5);
                }}
                className="text-xs font-bold text-orange-600 hover:text-brown-900 flex items-center gap-1 transition-colors px-2 py-1"
              >
                Lanjut ke Refleksi (Terakhir) →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── QUESTION 5: Textarea Reflection ───────────────────────────── */}
      <section
        onClick={() => setActiveStep(5)}
        className={`rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-200 border cursor-pointer ${
          activeStep === 5
            ? "bg-white border-brown-900/15 shadow-xs ring-1 ring-orange-500/15"
            : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-brown-900/10 opacity-75"
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700/70">
              Pertanyaan 5 dari 5
            </span>
          </div>
          {activeStep !== 5 && reflection && (
            <span className="text-xs font-bold text-brown-900 flex items-center gap-1 bg-white/80 border border-brown-900/10 px-2 py-0.5 rounded-full">
              <Check size={12} className="text-green-600" />
              Tercatat
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

      {/* ── ACTION ROW: Finish / Submit Button ───────────────────────── */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <div className="text-[11px] text-brown-700/70">
          Semua jawaban tersimpan aman & privat.
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
