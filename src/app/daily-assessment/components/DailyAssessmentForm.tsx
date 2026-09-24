"use client";

import React, { useState } from "react";

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
];

export const GOALS_LIST = [
  "Stress Relief & Relaxation",
  "Memperbaiki Kualitas Tidur",
  "Meningkatkan Fokus & Produktivitas",
  "Curhat & Konseling AI 24/7",
];

// ---------- DailyAssessmentForm ----------

export interface DailyAssessmentSubmitData {
  goal: string;
  gender: string;
  age: string;
  weight: string;
  mood: string;
  soughtHelp: boolean | null;
  physicalSymptoms: string[];
  sleepRating: number | null;
  stressLevel: number;
  medications: string;
  mentalSymptoms: string[];
  energyTags: string[];
  reflection: string;
}

interface FormProps {
  isEdit?: boolean;
  initialValues?: Partial<DailyRecord>;
  onSubmit: (data: DailyAssessmentSubmitData) => Promise<void>;
  isSubmitting: boolean;
}

export function DailyAssessmentForm({ onSubmit, isSubmitting }: FormProps) {
  const [step, setStep] = useState(0);

  // Form states initialized without leading zeroes (Lampiran C.4)
  const [goal, setGoal] = useState("Stress Relief & Relaxation");
  const [gender, setGender] = useState("Pria");
  const [age, setAge] = useState("21");
  const [weight, setWeight] = useState("65");
  const [mood, setMood] = useState("HAPPY");
  const [soughtHelp, setSoughtHelp] = useState<boolean | null>(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [sleepRating, setSleepRating] = useState<number | null>(3);
  const [stressLevel, setStressLevel] = useState(2);
  const [medications, setMedications] = useState("Tidak ada");
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>([]);
  const [energyTags, setEnergyTags] = useState<string[]>(["Tenang & Fokus"]);
  const [reflection, setReflection] = useState("");

  // Helper toggle multi-select
  const toggleItem = (list: string[], setFn: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setFn((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  // D.1 Standard 3-state CSS
  const choiceClass = (isSelected: boolean) =>
    `relative flex items-center justify-between gap-2 p-3.5 rounded-2xl text-xs font-bold text-left border-2 transition-all duration-200 cursor-pointer ${
      isSelected
        ? "border-orange-500 bg-orange-100 text-brown-900"
        : "border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40 hover:bg-orange-500/5"
    }`;

  const STEPS = [
    { title: "Goal & Fisik", desc: "Profil umum hari ini" },
    { title: "Mood & Medis", desc: "Suasana hati & obat" },
    { title: "Gejala", desc: "Fisik & kesehatan mental" },
    { title: "Tidur, Stres & Refleksi", desc: "Evaluasi & AI Screening" },
  ];

  const handleSubmit = async () => {
    await onSubmit({
      goal,
      gender,
      age,
      weight,
      mood,
      soughtHelp,
      physicalSymptoms,
      sleepRating,
      stressLevel,
      medications,
      mentalSymptoms,
      energyTags,
      reflection,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.title}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors whitespace-nowrap ${
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
              <span className="hidden md:inline">{s.title}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 min-w-4 h-0.5 rounded-full ${i < step ? "bg-green-500" : "bg-brown-900/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Goal & Profil Fisik */}
      {step === 0 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-1">
              Apa goal kesehatan utama yang ingin kamu pantau hari ini?
            </h2>
            <p className="text-xs text-brown-700 mb-3">Pilih fokus utamamu untuk panduan rekomendasi personal.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS_LIST.map((g) => (
                <button key={g} type="button" onClick={() => setGoal(g)} className={choiceClass(goal === g)}>
                  <span className="flex-1">{g}</span>
                  {goal === g && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          <div>
            <h2 className="font-display text-base font-bold text-brown-900 mb-3">Informasi Profil Fisik</h2>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-brown-900">Gender:</label>
              <div className="flex gap-2 sm:gap-3">
                {["Pria", "Wanita", "Lainnya"].map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => setGender(gen)}
                    className={`flex-1 justify-center ${choiceClass(gender === gen)}`}
                  >
                    <span className="flex-1 text-center">{gen}</span>
                    {gender === gen && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-xs font-bold text-brown-900">Usia (Tahun):</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="21"
                    className="w-full mt-1 bg-cream rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-[10px] text-brown-700/60 mt-1 block">
                    Ketik langsung usiamu (misal: 20, 22)
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-brown-900">Berat Badan (kg):</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="65"
                    className="w-full mt-1 bg-cream rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-[10px] text-brown-700/60 mt-1 block">
                    Estimasi berat badan dalam kilogram
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Lanjut ke Mood &amp; Medis →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Mood & Medis */}
      {step === 1 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-1">
              Bagaimana kondisi suasana hatimu hari ini?
            </h2>
            <p className="text-xs text-brown-700 mb-3">Pilih skala ekspresi emosi yang paling mewakili hari ini.</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MOODS.map((m) => {
                const isSelected = mood === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={`justify-center ${choiceClass(isSelected)}`}
                  >
                    <span className="text-xl sm:text-2xl mr-1">{m.emoji}</span>
                    <span className="text-center">{m.label}</span>
                    {isSelected && <span className="text-orange-500 font-extrabold ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          <div>
            <h2 className="font-display text-base font-bold text-brown-900 mb-2">
              Pernah mencari bantuan profesional (Psikolog / Psikiater)?
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { label: "Ya, Pernah Konsultasi", val: true },
                { label: "Belum Pernah", val: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSoughtHelp(opt.val)}
                  className={`flex-1 ${choiceClass(soughtHelp === opt.val)}`}
                >
                  <span className="flex-1">{opt.label}</span>
                  {soughtHelp === opt.val && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-brown-900 mb-2">
              Obat atau Suplemen yang Sedang Dikonsumsi:
            </h2>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Misal: Suplemen Vitamin D, atau 'Tidak ada'"
              className="w-full bg-cream rounded-2xl border border-brown-900/10 p-3.5 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-brown-700 font-bold text-xs px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Lanjut ke Gejala →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Gejala Fisik & Mental */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-1">
              Gejala fisik yang dirasakan saat cemas atau tertekan:
            </h2>
            <p className="text-xs text-brown-700 mb-3">Pilih semua yang kamu rasakan hari ini (bisa lebih dari satu).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PHYSICAL_SYMPTOMS_LIST.map((sym) => {
                const isSel = physicalSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleItem(physicalSymptoms, setPhysicalSymptoms, sym)}
                    className={choiceClass(isSel)}
                  >
                    <span className="flex-1">{sym}</span>
                    {isSel && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-brown-900 mb-1">
              Gejala kesehatan mental yang paling dominan:
            </h2>
            <p className="text-xs text-brown-700 mb-3">Pilih gejala yang kamu alami akhir-akhir ini.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MENTAL_SYMPTOMS_LIST.map((sym) => {
                const isSel = mentalSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleItem(mentalSymptoms, setMentalSymptoms, sym)}
                    className={choiceClass(isSel)}
                  >
                    <span className="flex-1">{sym}</span>
                    {isSel && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-brown-700 font-bold text-xs px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Lanjut ke Evaluasi Akhir →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tidur, Stres & Refleksi AI */}
      {step === 3 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Tidur */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-base font-bold text-brown-900">Rating Kualitas Tidur (1 - 5)</h2>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Rating: {sleepRating ?? 3} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={sleepRating ?? 3}
              onChange={(e) => setSleepRating(Number(e.target.value))}
              className="w-full accent-green-500 cursor-pointer h-2 bg-cream rounded-lg my-2"
            />
            <div className="flex justify-between text-[11px] font-bold text-brown-700">
              <span>1 - Sangat Buruk (&lt; 4 jam)</span>
              <span>3 - Cukup (6-7 jam)</span>
              <span>5 - Nyenyak (&gt; 8 jam)</span>
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* Stres */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-base font-bold text-brown-900">Rating Level Stres Harian (1 - 5)</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Level: {stressLevel} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-cream rounded-lg my-2"
            />
            <div className="flex justify-between text-[11px] font-bold text-brown-700">
              <span>1 - Sangat Santai</span>
              <span>3 - Sedang</span>
              <span>5 - Kewalahan / Sangat Tertekan</span>
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* Energy Tags */}
          <div>
            <h2 className="font-display text-base font-bold text-brown-900 mb-1">Tag Kondisi &amp; Energi Hari Ini</h2>
            <p className="text-xs text-brown-700 mb-2.5">Pilih kata kunci yang menggambarkan energi tubuhmu saat ini:</p>
            <div className="flex flex-wrap gap-2">
              {ENERGY_TAGS.map((tag) => {
                const isSel = energyTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleItem(energyTags, setEnergyTags, tag)}
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

          {/* Refleksi & Ekspresi AI */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-base font-bold text-brown-900">
                AI Expression &amp; Reflection Screening
              </h2>
              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                Privat &amp; Aman
              </span>
            </div>
            <p className="text-xs text-brown-700 mb-2">
              Tuliskan refleksi atau hal yang sedang membebani pikiranmu hari ini untuk analisis Zyba AI:
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Ceritakan harimu atau apa yang sedang kamu rasakan..."
              rows={4}
              className="w-full rounded-2xl border border-brown-900/10 p-3.5 text-xs font-medium text-brown-900 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-brown-700 font-bold text-xs px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-brown-900 text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-full transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menganalisis & Menyimpan..." : "Selesaikan Assessment Harian →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
