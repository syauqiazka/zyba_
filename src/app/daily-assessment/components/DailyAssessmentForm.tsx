"use client";

import React, { useState, useEffect } from "react";

// ---------- Types ----------

export interface DailyRecord {
  id: string;
  date: string;
  mood: string;
  stressLevel: number | null;
  sleepRating: number | null;
  energyTags: string[];
  reflection: string | null;
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

export const MOODS = [
  { value: "DEPRESSED", label: "Depressed", emoji: "😞", bg: "#A99BE0", text: "text-white" },
  { value: "SAD", label: "Sad", emoji: "🙁", bg: "#EE8A5E", text: "text-white" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", bg: "#6B5645", text: "text-white" },
  { value: "HAPPY", label: "Happy", emoji: "🙂", bg: "#E8C24A", text: "text-brown-900" },
  { value: "OVERJOYED", label: "Overjoyed", emoji: "😄", bg: "#8FAE5D", text: "text-white" },
] as const;

export const SLEEP_OPTIONS = [
  { rating: 1, label: "< 4 jam", desc: "Insomnia", icon: "😴" },
  { rating: 2, label: "4-5 jam", desc: "Kurang Nyenyak", icon: "🥱" },
  { rating: 3, label: "6-7 jam", desc: "Cukup", icon: "🛌" },
  { rating: 4, label: "7-8 jam", desc: "Pulas", icon: "🌙" },
  { rating: 5, label: "> 8 jam", desc: "Sangat Segar", icon: "🌟" },
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
];

// ---------- DailyAssessmentForm ----------

interface FormProps {
  isEdit?: boolean;
  initialValues?: Partial<DailyRecord>;
  onSubmit: (data: {
    mood: string;
    stressLevel: number;
    sleepRating: number | null;
    energyTags: string[];
    reflection: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function DailyAssessmentForm({ isEdit, initialValues, onSubmit, isSubmitting }: FormProps) {
  const initMood = MOODS.find((m) => m.value === initialValues?.mood) || MOODS[2];
  const [selectedMood, setSelectedMood] = useState(initMood);
  const [stressLevel, setStressLevel] = useState(initialValues?.stressLevel ?? 2);
  const [sleepRating, setSleepRating] = useState<number | null>(initialValues?.sleepRating ?? null);
  const [energyTags, setEnergyTags] = useState<string[]>(initialValues?.energyTags ?? []);
  const [reflection, setReflection] = useState(initialValues?.reflection ?? "");
  const [step, setStep] = useState(0);

  const toggleTag = (tag: string) => {
    setEnergyTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async () => {
    await onSubmit({ mood: selectedMood.value, stressLevel, sleepRating, energyTags, reflection });
  };

  const STEPS = ["Mood", "Stres & Tidur", "Kondisi & Refleksi"];

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                i <= step ? "text-brown-900" : "text-brown-700/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold border-2 transition-all ${
                  i < step
                    ? "bg-green-500 border-green-500 text-white"
                    : i === step
                    ? "bg-brown-900 border-brown-900 text-white"
                    : "bg-cream border-brown-900/20 text-brown-700/50"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full ${i < step ? "bg-green-500" : "bg-brown-900/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Mood */}
      {step === 0 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-lg font-bold text-brown-900 mb-1">Bagaimana perasaanmu hari ini?</h2>
            <p className="text-xs text-brown-700">Pilih 1 dari 5 skala emosi yang paling menggambarkan kondisimu saat ini.</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {MOODS.map((m) => {
              const isSelected = selectedMood.value === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setSelectedMood(m)}
                  style={{ backgroundColor: isSelected ? m.bg : undefined }}
                  className={`rounded-2xl py-5 flex flex-col items-center gap-2.5 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? `${m.text} border-brown-900 shadow-lg scale-105 font-bold`
                      : "bg-cream/70 border-transparent text-brown-900 hover:border-brown-900/20 hover:shadow-sm"
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[11px] font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-brown-900 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Stress & Sleep */}
      {step === 1 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Stress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-brown-900">Level Stres</h2>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-100 text-orange-500">
                Level {stressLevel}: {["Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"][stressLevel - 1]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-brown-700 font-bold mt-1">
              <span>1 - Tenang</span>
              <span>3 - Sedang</span>
              <span>5 - Kewalahan</span>
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* Sleep */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-bold text-brown-900">Kualitas Tidur Semalam</h2>
              {sleepRating !== null && (
                <button
                  type="button"
                  onClick={() => setSleepRating(null)}
                  className="text-[11px] text-brown-700 hover:text-orange-500 underline cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>
            <p className="text-xs text-brown-700 mb-3">Berapa jam kamu tidur dan bagaimana rasanya saat bangun?</p>
            <div className="grid grid-cols-5 gap-2">
              {SLEEP_OPTIONS.map((opt) => {
                const isSel = sleepRating === opt.rating;
                return (
                  <button
                    key={opt.rating}
                    type="button"
                    onClick={() => setSleepRating(isSel ? null : opt.rating)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSel
                        ? "border-green-500 bg-green-100/70 shadow-sm scale-105"
                        : "border-brown-900/10 bg-cream/40 hover:bg-white"
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="text-center">
                      <div className="text-[11px] font-bold text-brown-900">{opt.label}</div>
                      <div className="text-[10px] text-brown-700">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-brown-700 font-semibold text-sm px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-brown-900 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Energy Tags & Reflection */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Energy Tags */}
          <div>
            <h2 className="font-display text-lg font-bold text-brown-900 mb-1">Kondisi Energi & Pikiran</h2>
            <p className="text-xs text-brown-700 mb-3">Pilih satu atau lebih yang menggambarkan kondisimu hari ini.</p>
            <div className="flex flex-wrap gap-2">
              {ENERGY_TAGS.map((tag) => {
                const isSel = energyTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSel
                        ? "bg-brown-900 text-white border-brown-900 shadow-sm"
                        : "bg-cream/60 border-brown-900/15 text-brown-700 hover:bg-white"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* Reflection */}
          <div>
            <h2 className="font-display text-lg font-bold text-brown-900 mb-1">Refleksi Harian (Opsional)</h2>
            <p className="text-xs text-brown-700 mb-3">
              Ceritakan peristiwa, perasaan, atau hal yang ingin kamu ingat dari hari ini.
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Tulis refleksimu di sini..."
              rows={5}
              className="w-full rounded-2xl border border-brown-900/10 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-brown-900 bg-cream/30 resize-none"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-brown-700 font-semibold text-sm px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-brown-900 text-white font-bold text-sm px-8 py-3 rounded-full transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : isEdit ? "Update Assessment →" : "Simpan Assessment →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
