"use client";

import React from "react";
import {
  Sparkles,
  Shield,
  Bell,
  Heart,
  Bot,
  Zap,
  Moon,
  Smile,
  CloudRain,
  Cloud,
  Minus,
  Check,
  Lock,
} from "lucide-react";
import TagInput from "@/components/ui/TagInput";

const AVATAR_PRESETS = [
  { key: "fox", label: "Rubah Tenang", emoji: "🦊", color: "bg-orange-100 border-orange-500/30 text-orange-600" },
  { key: "panda", label: "Panda Damai", emoji: "🐼", color: "bg-green-100 border-green-500/30 text-green-700" },
  { key: "rabbit", label: "Kelinci Ceria", emoji: "🐰", color: "bg-mood-sad/20 border-mood-sad/30 text-brown-900" },
  { key: "koala", label: "Koala Rileks", emoji: "🐨", color: "bg-mood-neutral/20 border-mood-neutral/30 text-brown-900" },
  { key: "leaf", label: "Daun Sehat", emoji: "🌿", color: "bg-green-100 border-green-500/30 text-green-700" },
  { key: "flower", label: "Bunga ZYBA", emoji: "🌸", color: "bg-orange-100 border-orange-500/30 text-orange-600" },
];

const MOOD_OPTIONS = [
  { value: "DEPRESSED", label: "Tertekan", sub: "Sangat lelah & berat", icon: CloudRain, color: "#A99BE0", bg: "bg-mood-depressed/15 border-mood-depressed/40" },
  { value: "SAD", label: "Sedih", sub: "Murung atau resah", icon: Cloud, color: "#EE8A5E", bg: "bg-mood-sad/15 border-mood-sad/40" },
  { value: "NEUTRAL", label: "Biasa", sub: "Tenang & datar", icon: Minus, color: "#6B5645", bg: "bg-mood-neutral/15 border-mood-neutral/40" },
  { value: "HAPPY", label: "Senang", sub: "Nyaman & bersemangat", icon: Smile, color: "#E8C24A", bg: "bg-mood-happy/15 border-mood-happy/40" },
  { value: "OVERJOYED", label: "Berenergi", sub: "Sangat antusias", icon: Sparkles, color: "#8FAE5D", bg: "bg-green-100 border-green-500/40" },
];

interface QuestionStepProps {
  currentStep: number;
  // Step 0: Profile
  name: string;
  setName: (v: string) => void;
  avatarKey: string;
  setAvatarKey: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  // Step 1: Security PIN
  pin: string;
  setPin: (v: string) => void;
  // Step 2: Notifications
  companionNotif: boolean;
  setCompanionNotif: (v: boolean) => void;
  wellnessNotif: boolean;
  setWellnessNotif: (v: boolean) => void;
  communityNotif: boolean;
  setCommunityNotif: (v: boolean) => void;
  // Step 3: Goal
  goal: string;
  setGoal: (v: string) => void;
  // Step 4: Demographics
  gender: string;
  setGender: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  ageError?: string;
  weight: string;
  setWeight: (v: string) => void;
  // Step 5: Mood & Sleep
  mood: string;
  setMood: (v: string) => void;
  sleepRating: number;
  setSleepRating: (v: number) => void;
  // Step 6: Stress & Symptoms
  stressRating: number;
  setStressRating: (v: number) => void;
  physicalSymptoms: string[];
  setPhysicalSymptoms: (v: string[]) => void;
  customPhysicalSymptom: string;
  setCustomPhysicalSymptom: (v: string) => void;
  mentalSymptoms: string[];
  setMentalSymptoms: (v: string[]) => void;
  customMentalSymptom: string;
  setCustomMentalSymptom: (v: string) => void;
  medications: string[];
  setMedications: (v: string[]) => void;
  soughtHelp: boolean | null;
  setSoughtHelp: (v: boolean | null) => void;
  // Step 7: Expression
  expressionText: string;
  setExpressionText: (v: string) => void;
  toggleSymptom: (list: string[], setList: (l: string[]) => void, item: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
}

export default function QuestionStep({
  currentStep,
  name,
  setName,
  avatarKey,
  setAvatarKey,
  bio,
  setBio,
  pin,
  setPin,
  companionNotif,
  setCompanionNotif,
  wellnessNotif,
  setWellnessNotif,
  communityNotif,
  setCommunityNotif,
  goal,
  setGoal,
  gender,
  setGender,
  age,
  setAge,
  ageError,
  weight,
  setWeight,
  mood,
  setMood,
  sleepRating,
  setSleepRating,
  stressRating,
  setStressRating,
  physicalSymptoms,
  setPhysicalSymptoms,
  customPhysicalSymptom,
  setCustomPhysicalSymptom,
  mentalSymptoms,
  setMentalSymptoms,
  customMentalSymptom,
  setCustomMentalSymptom,
  medications,
  setMedications,
  soughtHelp,
  setSoughtHelp,
  expressionText,
  setExpressionText,
  toggleSymptom,
  handleNext,
  handlePrev,
}: QuestionStepProps) {
  const choiceClass = (isSelected: boolean) =>
    `relative flex items-center justify-between gap-2 p-3.5 rounded-2xl text-xs font-bold text-left border-2 transition-all duration-200 cursor-pointer ${
      isSelected
        ? "border-orange-500 bg-orange-100 text-brown-900 shadow-xs"
        : "border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40 hover:bg-orange-500/5"
    }`;

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* =========================================================================
            STEP 0: AVATAR & PROFIL SETUP
        ========================================================================= */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Pilih Avatar & Nama Panggilanmu
              </h2>
              <p className="text-xs text-brown-700/80 mt-1">
                Karakter ini akan menjadi representasi pribadimu di ZYBA secara aman dan privat.
              </p>
            </div>

            {/* Avatar Selector Grid */}
            <div>
              <label className="text-xs font-bold text-brown-900 block mb-2.5">
                Pilih Karakter Pendamping:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {AVATAR_PRESETS.map((p) => {
                  const isSelected = avatarKey === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setAvatarKey(p.key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-100/70 shadow-xs scale-105"
                          : "border-brown-900/10 bg-white hover:border-orange-500/30"
                      }`}
                    >
                      <div className="text-3xl leading-none">{p.emoji}</div>
                      <span className="text-[11px] font-bold text-brown-900 truncate">
                        {p.label.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Bio Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1.5">
                  Nama Panggilan:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mis. Alex"
                  className="w-full rounded-xl border border-brown-900/12 bg-white px-3.5 py-2.5 text-xs font-semibold text-brown-900 placeholder:text-brown-700/40 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1.5">
                  Bio / Aspirasi Ketenangan:
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mis. Ingin menjaga ritme hidup seimbang..."
                  className="w-full rounded-xl border border-brown-900/12 bg-white px-3.5 py-2.5 text-xs font-semibold text-brown-900 placeholder:text-brown-700/40 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1: 4-DIGIT SECURITY PIN
        ========================================================================= */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={18} className="text-orange-500" />
                <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                  PIN Keamanan 4 Digit
                </h2>
              </div>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Atur 4 digit angka rahasia untuk mengunci jurnal dan catatan refleksi pribadimu agar tidak dapat dibaca orang lain.
              </p>
            </div>

            {/* 4 Digit PIN Input */}
            <div className="flex flex-col items-center justify-center py-6 bg-white/70 rounded-2xl border border-brown-900/10">
              <div className="flex items-center gap-3 mb-4">
                {[0, 1, 2, 3].map((idx) => {
                  const digit = pin[idx] || "";
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center font-display text-xl font-extrabold ${
                        digit
                          ? "border-orange-500 bg-orange-100/60 text-brown-900 shadow-xs"
                          : "border-brown-900/15 bg-cream/50 text-brown-700/40"
                      }`}
                    >
                      {digit ? "•" : ""}
                    </div>
                  );
                })}
              </div>

              {/* Number pad for PIN */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      if (val === "C") {
                        setPin("");
                      } else if (val === "←") {
                        setPin(pin.slice(0, -1));
                      } else if (pin.length < 4) {
                        setPin(pin + val);
                      }
                    }}
                    className="h-11 rounded-xl bg-white border border-brown-900/10 hover:bg-cream text-brown-900 font-bold text-sm shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    {val}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPin("0000");
                  handleNext();
                }}
                className="mt-4 text-[11px] font-semibold text-brown-700/70 hover:text-brown-900 transition-colors"
              >
                Lewati langkah ini (gunakan default) →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: NOTIFICATION PREFERENCES
        ========================================================================= */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell size={18} className="text-orange-500" />
                <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                  Preferensi Notifikasi Sanctuary
                </h2>
              </div>
              <p className="text-xs text-brown-700/80">
                Pilih jenis pengingat yang ingin kamu terima. Kamu memegang kendali penuh atas ketenangan perangkatmu.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Toggle 1: Companion */}
              <div
                onClick={() => setCompanionNotif(!companionNotif)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  companionNotif
                    ? "border-green-500/50 bg-green-100/50"
                    : "border-brown-900/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-brown-900 shrink-0">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brown-900">
                      Zyba Companion Check-In
                    </h4>
                    <p className="text-[11px] text-brown-700/80 mt-0.5">
                      Sapaan hangat di waktu luangmu untuk menanyakan kabar dan emosi hari ini.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    companionNotif ? "bg-green-500 justify-end" : "bg-brown-900/20 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Toggle 2: Wellness */}
              <div
                onClick={() => setWellnessNotif(!wellnessNotif)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  wellnessNotif
                    ? "border-green-500/50 bg-green-100/50"
                    : "border-brown-900/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-brown-900 shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brown-900">
                      Ritme Sehat & Hidrasi
                    </h4>
                    <p className="text-[11px] text-brown-700/80 mt-0.5">
                      Ajakan berkala untuk minum air putih dan latihan pernapasan santai 4-7-8.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    wellnessNotif ? "bg-green-500 justify-end" : "bg-brown-900/20 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Toggle 3: Community */}
              <div
                onClick={() => setCommunityNotif(!communityNotif)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  communityNotif
                    ? "border-green-500/50 bg-green-100/50"
                    : "border-brown-900/10 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-brown-900 shrink-0">
                    <Heart size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brown-900">
                      Pelukan Komunitas Hangat
                    </h4>
                    <p className="text-[11px] text-brown-700/80 mt-0.5">
                      Pemberitahuan saat ceritamu mendapatkan apresiasi dan penguatan dari sesama.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    communityNotif ? "bg-green-500 justify-end" : "bg-brown-900/20 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: GOAL KESEHATAN
        ========================================================================= */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Apa goal kesehatan utama yang ingin kamu capai di ZYBA?
              </h2>
              <p className="text-xs text-brown-700/80 mt-1">
                Pilih tujuan utamamu agar ZYBA dapat menyesuaikan ritme pendampingan.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Stress Relief & Relaxation",
                "Memperbaiki Kualitas Tidur",
                "Meningkatkan Fokus & Produktivitas",
                "Curhat & Konseling AI 24/7",
              ].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={choiceClass(goal === g)}
                >
                  <span className="flex-1">{g}</span>
                  {goal === g && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: PROFIL FISIK & DEMOGRAFI
        ========================================================================= */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Informasi Profil Fisik
              </h2>
              <p className="text-xs text-brown-700/80 mt-1">
                Membantu kalkulasi metrik kebugaran holistik ZYBA.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-brown-900 mb-2 block">Gender:</label>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">Usia (Tahun):</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Contoh: 21"
                  className={`w-full rounded-2xl border bg-white p-3 text-xs font-bold text-brown-900 outline-none transition-all ${
                    ageError ? "border-danger ring-2 ring-danger/20" : "border-brown-900/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  }`}
                />
                {ageError && <span className="text-[10px] text-danger font-bold mt-1 block">{ageError}</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">Berat Badan (Kg):</label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Contoh: 65"
                  className="w-full rounded-2xl border border-brown-900/10 bg-white p-3 text-xs font-bold text-brown-900 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: SUASANA HATI & KUALITAS TIDUR
        ========================================================================= */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Suasana Hati & Kualitas Tidur
              </h2>
              <p className="text-xs text-brown-700/80 mt-1">
                Bagaimana perasaanmu secara umum dan bagaimana kualitas istirahatmu semalam?
              </p>
            </div>

            {/* 5 Tactile Mood Pebbles */}
            <div>
              <label className="text-xs font-bold text-brown-900 mb-2 block">
                Suasana Hati Utama:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = mood === m.value;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(m.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${m.bg} shadow-xs scale-102 font-bold`
                          : "border-brown-900/10 bg-white hover:border-orange-500/30"
                      }`}
                    >
                      <Icon size={24} style={{ color: m.color }} strokeWidth={2} />
                      <span className="text-xs text-brown-900 font-bold">{m.label}</span>
                      <span className="text-[10px] text-brown-700/60 truncate">{m.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sleep Rating (1-5) */}
            <div className="pt-2 border-t border-brown-900/10">
              <label className="text-xs font-bold text-brown-900 mb-2 block flex items-center gap-1.5">
                <Moon size={14} className="text-orange-500" />
                Rating Kualitas Tidur (1 - 5):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { r: 1, label: "< 4 Jam", sub: "Buruk" },
                  { r: 2, label: "4-5 Jam", sub: "Kurang" },
                  { r: 3, label: "6-7 Jam", sub: "Cukup" },
                  { r: 4, label: "7-8 Jam", sub: "Nyenyak" },
                  { r: 5, label: "> 8 Jam", sub: "Optimal" },
                ].map((s) => (
                  <button
                    key={s.r}
                    type="button"
                    onClick={() => setSleepRating(s.r)}
                    className={`flex flex-col items-center py-2.5 px-1.5 rounded-xl border-2 text-center transition-all ${
                      sleepRating === s.r
                        ? "border-orange-500 bg-orange-100 text-brown-900 font-bold shadow-xs"
                        : "border-brown-900/10 bg-white text-brown-700 hover:bg-cream"
                    }`}
                  >
                    <span className="text-xs font-extrabold">{s.r}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: BEBAN STRES & GEJALA TERKAIT
        ========================================================================= */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Tingkat Stres & Gejala Terkait
              </h2>
              <p className="text-xs text-brown-700/80 mt-1">
                Kenali apa yang sedang dialami tubuh dan pikiranmu.
              </p>
            </div>

            {/* Stress Rating Stepper */}
            <div>
              <label className="text-xs font-bold text-brown-900 mb-2 block">
                Level Beban Stres Saat Ini:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { val: 1, label: "Tenang" },
                  { val: 2, label: "Terkendali" },
                  { val: 3, label: "Sedang" },
                  { val: 4, label: "Tinggi" },
                  { val: 5, label: "Kewalahan" },
                ].map((st) => (
                  <button
                    key={st.val}
                    type="button"
                    onClick={() => setStressRating(st.val)}
                    className={`py-2 px-1 rounded-xl border-2 text-center transition-all ${
                      stressRating === st.val
                        ? "border-orange-500 bg-orange-100 text-brown-900 font-bold shadow-xs"
                        : "border-brown-900/10 bg-white text-brown-700 hover:bg-cream"
                    }`}
                  >
                    <span className="text-xs font-bold block">{st.val}</span>
                    <span className="text-[10px] opacity-75">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Symptoms */}
            <div className="pt-2 border-t border-brown-900/10">
              <label className="text-xs font-bold text-brown-900 mb-2 block">
                Gejala Fisik yang Sering Terasa:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Pusing / Sakit Kepala",
                  "Nyeri Leher / Pundak",
                  "Jantung Berdebar",
                  "Asam Lambung / Mual",
                  "Kelelahan Kronis",
                  "Sulit Bernapas Lega",
                ].map((sym) => {
                  const isChecked = physicalSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(physicalSymptoms, setPhysicalSymptoms, sym)}
                      className={choiceClass(isChecked)}
                    >
                      <span className="truncate">{sym}</span>
                      {isChecked && <Check size={13} className="text-orange-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mental Symptoms */}
            <div className="pt-2 border-t border-brown-900/10">
              <label className="text-xs font-bold text-brown-900 mb-2 block">
                Gejala Mental / Emosional:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Overthinking Berlebih",
                  "Kecemasan Tiba-tiba",
                  "Susah Konsentrasi",
                  "Kehilangan Minat",
                  "Mudah Tersulut Emosi",
                  "Rasa Hampa / Kesepian",
                ].map((mSym) => {
                  const isChecked = mentalSymptoms.includes(mSym);
                  return (
                    <button
                      key={mSym}
                      type="button"
                      onClick={() => toggleSymptom(mentalSymptoms, setMentalSymptoms, mSym)}
                      className={choiceClass(isChecked)}
                    >
                      <span className="truncate">{mSym}</span>
                      {isChecked && <Check size={13} className="text-orange-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7: SKRINING REFLEKSI & EKSPRESI AI
        ========================================================================= */}
        {currentStep === 7 && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} className="text-orange-500" />
                <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                  Skrining Refleksi & Ekspresi AI
                </h2>
              </div>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Tuliskan secara bebas apa yang sedang melintas di benakmu saat ini. AI ZYBA akan membaca pola emosional secara santun dan privat tanpa penghakiman.
              </p>
            </div>

            <textarea
              value={expressionText}
              onChange={(e) => setExpressionText(e.target.value)}
              rows={4}
              placeholder="Contoh: Akhir-akhir ini saya merasa sedikit lelah karena beban kuliah dan deadline menumpuk, tetapi saya ingin belajar mengatur waktu dan bernapas lebih tenang..."
              className="w-full rounded-2xl border border-brown-900/12 bg-cream/50 p-4 text-xs font-medium text-brown-900 placeholder:text-brown-700/40 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 leading-relaxed resize-none"
            />

            <div className="p-3 rounded-xl bg-white border border-brown-900/10 text-[11px] text-brown-700/80 flex items-center gap-2">
              <Shield size={14} className="text-green-600 shrink-0" />
              <span>
                Catatanmu dienkripsi penuh dan dijaga keamanannya oleh ZYBA Crisis Guardian Engine.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          BOTTOM NAVIGATION BUTTONS
      ========================================================================= */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-brown-900/10">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="text-xs font-bold text-brown-700 hover:text-brown-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          ← Kembali
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span>{currentStep === 7 ? "Selesaikan & Hitung Skor ZYBA →" : "Lanjut →"}</span>
        </button>
      </div>
    </>
  );
}
