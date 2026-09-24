"use client";

import React, { useState, useMemo } from "react";
import { MOODS } from "@/lib/moods";
import ScoreSlider, { scoreText, scoreTint } from "@/components/ScoreSlider";

// MOODS sekarang satu sumber di @/lib/moods; tetap diekspor dari sini
// supaya import lama (mis. di DailyAssessmentSummary) tidak putus.
export { MOODS };

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
];

export const GOALS_LIST = [
  "Stress Relief & Relaxation",
  "Memperbaiki Kualitas Tidur",
  "Meningkatkan Fokus & Produktivitas",
  "Curhat & Konseling AI 24/7",
];

export interface DailyAssessmentSubmitData {
  // Mental (6)
  mood: string;
  stressLevel: number;
  anxietyLevel: number;
  satisfactionLevel: number;
  productivityLevel: number;
  meTimeLevel: number;

  // Fisik (5)
  sleepRating: number;
  sleepHours: number | string;
  energyLevel: number;
  eatingHabit: number;
  physicalActivity: number;

  // Sosial (3)
  socialConnection: number;
  socialSupport: number;
  communityInteraction: number;

  // Gratitude & Refleksi
  gratitude: string;
  reflection: string;

  // Konteks baseline & profil
  goal: string;
  gender: string;
  age: string;
  weight: string;
  soughtHelp: boolean | null;
  physicalSymptoms: string[];
  mentalSymptoms: string[];
  medications: string;
  energyTags: string[];
}

interface FormProps {
  isEdit?: boolean;
  initialValues?: Partial<DailyRecord>;
  onSubmit: (data: DailyAssessmentSubmitData) => Promise<void>;
  isSubmitting: boolean;
  /** Dipanggil setiap mood diganti, supaya banner di atas ikut berubah warna */
  onMoodChange?: (mood: string) => void;
}

// ---------- Satu pertanyaan slider: judul, badge berwarna, slider, label ----------

interface ScoreQuestionProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  /** true kalau skor tinggi = negatif (stres, kecemasan): warnanya dibalik */
  inverted?: boolean;
  badge?: string;
  labels: [string, string, string];
}

function ScoreQuestion({ title, value, onChange, inverted = false, badge, labels }: ScoreQuestionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm font-bold text-brown-900">{title}</h3>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full transition-colors duration-300"
          style={{
            color: scoreText(value, 1, 5, inverted),
            backgroundColor: scoreTint(value, 1, 5, inverted),
          }}
        >
          {badge ?? `Rating ${value} / 5`}
        </span>
      </div>

      <ScoreSlider value={value} onChange={onChange} inverted={inverted} ariaLabel={title} />

      <div className="flex justify-between text-[10px] text-brown-700 font-bold mt-1">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  );
}

export function DailyAssessmentForm({ onSubmit, isSubmitting, onMoodChange }: FormProps) {
  const [step, setStep] = useState(0);

  // 1. Aspek Mental (6 Pertanyaan)
  const [mood, setMood] = useState("HAPPY");
  const [stressLevel, setStressLevel] = useState(2); // 1: tenang, 5: tertekan
  const [anxietyLevel, setAnxietyLevel] = useState(2); // 1: sangat rileks, 5: sangat cemas
  const [satisfactionLevel, setSatisfactionLevel] = useState(4); // 1: tidak puas, 5: puas
  const [productivityLevel, setProductivityLevel] = useState(3); // 1: terdistraksi, 5: sangat fokus
  const [meTimeLevel, setMeTimeLevel] = useState(3); // 1: kurang sekali, 5: cukup

  // 2. Aspek Fisik (5 Pertanyaan)
  const [sleepRating, setSleepRating] = useState<number>(4); // 1-5
  const [sleepHours, setSleepHours] = useState<number>(4); // 1-5 (pilihan SLEEP_OPTIONS)
  const [energyLevel, setEnergyLevel] = useState(3); // 1: drop/lelah, 5: bugar
  const [eatingHabit, setEatingHabit] = useState(4); // 1: tidak teratur, 5: sangat teratur
  const [physicalActivity, setPhysicalActivity] = useState(3); // 1: sedentari, 5: aktif olahraga

  // 3. Aspek Sosial (3 Pertanyaan)
  const [socialConnection, setSocialConnection] = useState(4); // 1: terisolasi, 5: terhubung
  const [socialSupport, setSocialSupport] = useState(4); // 1: tidak didukung, 5: didengar & didukung
  const [communityInteraction, setCommunityInteraction] = useState(3); // 1: minim, 5: aktif berinteraksi

  // 4. Gratitude & Refleksi Bebas
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");

  // Profil & Gejala Tambahan
  const [goal, setGoal] = useState("Stress Relief & Relaxation");
  const [gender, setGender] = useState("Pria");
  const [age, setAge] = useState("21");
  const [weight, setWeight] = useState("65");
  const [soughtHelp, setSoughtHelp] = useState<boolean | null>(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>([]);
  const [medications, setMedications] = useState("Tidak ada");
  const [energyTags, setEnergyTags] = useState<string[]>(["Tenang & Fokus"]);

  const toggleItem = (list: string[], setFn: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setFn((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  // D.1 Standardized 3-state styling
  const choiceClass = (isSelected: boolean) =>
    `relative flex items-center justify-between gap-2 p-3.5 rounded-2xl text-xs font-bold text-left border-2 transition-all duration-200 cursor-pointer ${isSelected
      ? "border-orange-500 bg-orange-100 text-brown-900 shadow-sm"
      : "border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40 hover:bg-orange-500/5"
    }`;

  // Estimasi Skor Realtime
  const estimatedScores = useMemo(() => {
    const moodMap: Record<string, number> = { DEPRESSED: 1, SAD: 2, NEUTRAL: 3, HAPPY: 4, OVERJOYED: 5 };
    const moodVal = moodMap[mood] ?? 3;
    const moodScore = ((moodVal - 1) / 4) * 100;
    const stressScore = ((5 - stressLevel) / 4) * 100;
    const anxietyScore = ((5 - anxietyLevel) / 4) * 100;
    const satisfactionScore = ((satisfactionLevel - 1) / 4) * 100;
    const productivityScore = ((productivityLevel - 1) / 4) * 100;
    const meTimeScore = ((meTimeLevel - 1) / 4) * 100;
    const mental = Math.round((moodScore + stressScore + anxietyScore + satisfactionScore + productivityScore + meTimeScore) / 6);

    const sleepScore = ((sleepRating - 1) / 4) * 100;
    const sleepHoursScore = sleepHours === 4 ? 100 : sleepHours === 3 ? 85 : sleepHours === 5 ? 80 : sleepHours === 2 ? 55 : 30;
    const energyScore = ((energyLevel - 1) / 4) * 100;
    const eatingScore = ((eatingHabit - 1) / 4) * 100;
    const activityScore = ((physicalActivity - 1) / 4) * 100;
    const fisik = Math.round((sleepScore + sleepHoursScore + energyScore + eatingScore + activityScore) / 5);

    const connScore = ((socialConnection - 1) / 4) * 100;
    const suppScore = ((socialSupport - 1) / 4) * 100;
    const commScore = ((communityInteraction - 1) / 4) * 100;
    const sosial = Math.round((connScore + suppScore + commScore) / 3);

    const zyba = Math.round(mental * 0.5 + fisik * 0.25 + sosial * 0.25);
    return { mental, fisik, sosial, zyba };
  }, [mood, stressLevel, anxietyLevel, satisfactionLevel, productivityLevel, meTimeLevel, sleepRating, sleepHours, energyLevel, eatingHabit, physicalActivity, socialConnection, socialSupport, communityInteraction]);

  const STEPS = [
    { title: "Aspek Mental", icon: "🧠", subtitle: "6 Pertanyaan Emosi & Fokus" },
    { title: "Aspek Fisik", icon: "⚡", subtitle: "5 Pertanyaan Tidur & Tubuh" },
    { title: "Aspek Sosial", icon: "🤝", subtitle: "3 Pertanyaan Koneksi & Dukungan" },
    { title: "Gratitude & Refleksi", icon: "💛", subtitle: "Hal Positif & AI Screening" },
  ];

  const handleSubmit = async () => {
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
      eatingHabit,
      physicalActivity,
      socialConnection,
      socialSupport,
      communityInteraction,
      gratitude,
      reflection,
      goal,
      gender,
      age,
      weight,
      soughtHelp,
      physicalSymptoms,
      mentalSymptoms,
      medications,
      energyTags,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-brown-900/10 pb-4">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setStep(i)}
            className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${i === step
              ? "bg-brown-900 text-white border-brown-900 shadow-md"
              : i < step
                ? "bg-green-100/60 border-green-500/30 text-green-800"
                : "bg-cream/40 border-brown-900/10 text-brown-700/60 hover:bg-cream"
              }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
              <span>{s.icon}</span>
              <span>{s.title}</span>
              {i < step && <span className="ml-auto text-[10px] text-green-600 font-extrabold">✓</span>}
            </div>
            <span className={`text-[10px] truncate ${i === step ? "text-cream/80" : "text-brown-700/70"}`}>
              {s.subtitle}
            </span>
          </button>
        ))}
      </div>

      {/* STEP 0: Aspek Mental (6 Pertanyaan) */}
      {step === 0 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-3 bg-orange-100/50 rounded-2xl border border-orange-500/20 text-xs text-brown-800">
            <span className="text-base">🧠</span>
            <span className="font-semibold">
              Aspek Mental berkontribusi <strong>50%</strong> pada kalkulasi Zyba Score harianmu.
            </span>
          </div>

          {/* 1. Mood */}
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-brown-900 mb-1">
              1. Bagaimana kondisi suasana hatimu hari ini?
            </h3>
            <p className="text-xs text-brown-700 mb-3">Pilih skala ekspresi emosi yang paling mewakili:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MOODS.map((m) => {
                const isSelected = mood === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setMood(m.value);
                      onMoodChange?.(m.value);
                    }}
                    className={`justify-center ${choiceClass(isSelected)}`}
                  >
                    <span className="text-xl sm:text-2xl mr-1">{m.emoji}</span>
                    <span>{m.label}</span>
                    {isSelected && <span className="text-orange-500 font-extrabold ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* 2. Stres (skor tinggi = negatif) */}
          <ScoreQuestion
            title="2. Tingkat Stres Harian (1 - 5)"
            value={stressLevel}
            onChange={setStressLevel}
            inverted
            badge={`Level ${stressLevel} / 5: ${["Sangat Santai", "Rileks", "Sedang", "Tinggi", "Kewalahan"][stressLevel - 1]}`}
            labels={["1 - Sangat Tenang", "3 - Normal / Sedang", "5 - Kewalahan"]}
          />

          <hr className="border-brown-900/10" />

          {/* 3. Kecemasan (skor tinggi = negatif) */}
          <ScoreQuestion
            title="3. Tingkat Kecemasan / Overthinking (1 - 5)"
            value={anxietyLevel}
            onChange={setAnxietyLevel}
            inverted
            badge={`Level ${anxietyLevel} / 5`}
            labels={["1 - Pikiran Sangat Tenang", "3 - Kadang Khawatir", "5 - Gelisah & Overthinking Akut"]}
          />

          <hr className="border-brown-900/10" />

          {/* 4. Kepuasan Diri */}
          <ScoreQuestion
            title="4. Kepuasan terhadap Diri & Hari Ini (1 - 5)"
            value={satisfactionLevel}
            onChange={setSatisfactionLevel}
            labels={["1 - Sangat Tidak Puas", "3 - Cukup Baik", "5 - Sangat Bersyukur & Puas"]}
          />

          <hr className="border-brown-900/10" />

          {/* 5. Fokus & Produktivitas */}
          <ScoreQuestion
            title="5. Kemampuan Fokus & Produktivitas (1 - 5)"
            value={productivityLevel}
            onChange={setProductivityLevel}
            labels={["1 - Sangat Terdistraksi / Sulit Fokus", "3 - Cukup Selesai", "5 - Sangat Produktif & Flow"]}
          />

          <hr className="border-brown-900/10" />

          {/* 6. Me-Time */}
          <ScoreQuestion
            title="6. Waktu Istirahat untuk Diri Sendiri (Me-Time) (1 - 5)"
            value={meTimeLevel}
            onChange={setMeTimeLevel}
            labels={["1 - Nol Me-time (Non-stop)", "3 - Cukup untuk Bernapas", "5 - Sangat Cukup & Pulih"]}
          />

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Lanjut ke Aspek Fisik (5 Soal) →
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Aspek Fisik (5 Pertanyaan) */}
      {step === 1 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-3 bg-green-100/50 rounded-2xl border border-green-500/20 text-xs text-brown-800">
            <span className="text-base">⚡</span>
            <span className="font-semibold">
              Aspek Fisik berkontribusi <strong>25%</strong> pada kalkulasi Zyba Score harianmu.
            </span>
          </div>

          {/* 7. Kualitas Tidur */}
          <ScoreQuestion
            title="7. Kualitas Tidur Semalam (1 - 5)"
            value={sleepRating}
            onChange={setSleepRating}
            labels={["1 - Sering Terbangun / Buruk", "3 - Cukup Nyenyak", "5 - Pulas & Sangat Segar"]}
          />

          <hr className="border-brown-900/10" />

          {/* 8. Durasi Jam Tidur */}
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900 mb-2">
              8. Durasi Jam Tidur Semalam:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SLEEP_OPTIONS.map((opt) => {
                const isSel = sleepHours === opt.rating;
                return (
                  <button
                    key={opt.rating}
                    type="button"
                    onClick={() => setSleepHours(opt.rating)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${isSel
                      ? "border-green-500 bg-green-100/70 shadow-sm scale-102"
                      : "border-brown-900/10 bg-white hover:bg-cream/40"
                      }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs font-bold text-brown-900">{opt.label}</span>
                    <span className="text-[10px] text-brown-700">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* 9. Level Energi Tubuh */}
          <ScoreQuestion
            title="9. Level Energi Tubuh Hari Ini (1 - 5)"
            value={energyLevel}
            onChange={setEnergyLevel}
            badge={`Level ${energyLevel} / 5`}
            labels={["1 - Lesu / Kehabisan Daya", "3 - Cukup Berenergi", "5 - Sangat Bugar & Aktif"]}
          />

          <hr className="border-brown-900/10" />

          {/* 10. Pola Makan Teratur */}
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900 mb-2">
              10. Keteraturan Pola Makan Hari Ini:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { rating: 5, label: "Teratur 3x Sehat & Cukup Air", sub: "Pola makan optimal" },
                { rating: 3, label: "Kurang Teratur (1-2x Makan)", sub: "Jadwal makan bergeser" },
                { rating: 1, label: "Telat / Tidak Nafsu Makan", sub: "Melewatkan makanan utama" },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setEatingHabit(m.rating)}
                  className={choiceClass(eatingHabit === m.rating)}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">{m.label}</span>
                    <span className="text-[10px] text-brown-700">{m.sub}</span>
                  </div>
                  {eatingHabit === m.rating && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-brown-900/10" />

          {/* 11. Aktivitas Fisik */}
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900 mb-2">
              11. Aktivitas Fisik &amp; Gerak Tubuh Hari Ini:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { rating: 5, label: "Olahraga / Workout Aktif", sub: "> 30 menit (Gym/Lari/Cardio)" },
                { rating: 3, label: "Jalan Santai / Peregangan Ringan", sub: "Aktivitas ringan harian" },
                { rating: 1, label: "Sedentari (Duduk Seharian)", sub: "Minim gerak fisik" },
              ].map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setPhysicalActivity(a.rating)}
                  className={choiceClass(physicalActivity === a.rating)}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">{a.label}</span>
                    <span className="text-[10px] text-brown-700">{a.sub}</span>
                  </div>
                  {physicalActivity === a.rating && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-brown-700 font-bold text-xs px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali ke Mental
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Lanjut ke Aspek Sosial (3 Soal) →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Aspek Sosial (3 Pertanyaan) */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-3 bg-cream/70 rounded-2xl border border-brown-900/10 text-xs text-brown-800">
            <span className="text-base">🤝</span>
            <span className="font-semibold">
              Aspek Sosial berkontribusi <strong>25%</strong> pada kalkulasi Zyba Score harianmu.
            </span>
          </div>

          {/* 12. Keterhubungan Sosial */}
          <ScoreQuestion
            title="12. Rasa Keterhubungan dengan Lingkungan Sekitar (1 - 5)"
            value={socialConnection}
            onChange={setSocialConnection}
            labels={["1 - Merasa Terasing / Sendiri", "3 - Cukup Terhubung", "5 - Sangat Dekat & Terkoneksi"]}
          />

          <hr className="border-brown-900/10" />

          {/* 13. Dukungan Emosional */}
          <ScoreQuestion
            title="13. Dukungan Emosional & Rasa Didengar Hari Ini (1 - 5)"
            value={socialSupport}
            onChange={setSocialSupport}
            labels={["1 - Merasa Tidak Ada yang Peduli", "3 - Cukup Didengar", "5 - Didukung Penuh & Diterima"]}
          />

          <hr className="border-brown-900/10" />

          {/* 14. Interaksi Komunitas */}
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900 mb-2">
              14. Interaksi Sosial &amp; Komunitas Hari Ini:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { rating: 5, label: "Aktif Berbincang & Berkomunitas", sub: "Sharing cerita / ngobrol hangat" },
                { rating: 3, label: "Interaksi Seperlunya", sub: "Tugas kuliah/kerja atau pesan singkat" },
                { rating: 1, label: "Isolasi Mandiri / Minim Interaksi", sub: "Tidak berkomunikasi dengan siapa pun" },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCommunityInteraction(c.rating)}
                  className={choiceClass(communityInteraction === c.rating)}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">{c.label}</span>
                    <span className="text-[10px] text-brown-700">{c.sub}</span>
                  </div>
                  {communityInteraction === c.rating && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-brown-700 font-bold text-xs px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali ke Fisik
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Lanjut ke Gratitude &amp; Refleksi →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Gratitude, Refleksi & Estimasi Skor */}
      {step === 3 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Live Skor Estimate Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cream via-white to-orange-50 border border-orange-500/20 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  Estimasi Realtime
                </span>
                <h4 className="font-display text-base font-extrabold text-brown-900 mt-1">
                  Zyba Score Hari Ini: {estimatedScores.zyba}/100
                </h4>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-display font-extrabold flex items-center justify-center text-lg shadow-md">
                {estimatedScores.zyba}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-brown-900/10">
              <div className="p-2.5 rounded-xl bg-white border border-brown-900/5">
                <span className="text-[10px] text-brown-700 font-semibold block">Mental (50%)</span>
                <span className="font-display font-bold text-sm text-brown-900">{estimatedScores.mental}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-brown-900/5">
                <span className="text-[10px] text-brown-700 font-semibold block">Fisik (25%)</span>
                <span className="font-display font-bold text-sm text-brown-900">{estimatedScores.fisik}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-brown-900/5">
                <span className="text-[10px] text-brown-700 font-semibold block">Sosial (25%)</span>
                <span className="font-display font-bold text-sm text-brown-900">{estimatedScores.sosial}</span>
              </div>
            </div>
          </div>

          {/* 15. Gratitude */}
          <div>
            <h3 className="font-display text-sm font-bold text-brown-900 mb-1">
              15. Hal Positif / Gratitude Hari Ini (Opsional) 🌟
            </h3>
            <p className="text-xs text-brown-700 mb-2">
              Satu hal kecil atau pencapaian yang membuatmu bersyukur hari ini:
            </p>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Misal: 'Berhasil bangun pagi dan minum teh hangat dengan tenang...'"
              className="w-full bg-cream rounded-2xl border border-brown-900/10 p-3.5 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <hr className="border-brown-900/10" />

          {/* 16. Refleksi Bebas & Screening */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-sm font-bold text-brown-900">
                16. Refleksi Bebas &amp; AI Screening
              </h3>
              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                Privat &amp; Terproteksi
              </span>
            </div>
            <p className="text-xs text-brown-700 mb-2">
              Tuliskan secara bebas apa yang sedang ada di pikiran atau perasaanmu saat ini:
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Ceritakan apa saja yang ingin kamu luapkan hari ini..."
              rows={4}
              className="w-full rounded-2xl border border-brown-900/10 p-3.5 text-xs font-medium text-brown-900 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-brown-700 font-bold text-xs px-5 py-2.5 rounded-full border border-brown-900/15 hover:bg-cream transition-colors cursor-pointer"
            >
              ← Kembali ke Sosial
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-brown-900 text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-full transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan & Menghitung..." : "Simpan Assessment 15 Soal →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}