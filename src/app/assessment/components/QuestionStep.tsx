"use client";

import React from "react";
import ScoreSlider, {
  scoreText,
  scoreTint,
} from "@/components/ScoreSlider";
import { MOODS } from "@/lib/moods";
import TagInput from "@/components/ui/TagInput";

interface QuestionStepProps {
  currentStep: number;
  goal: string;
  setGoal: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  age: string;
  setAge: React.Dispatch<React.SetStateAction<string>>;
  ageError?: string;
  weight: string;
  setWeight: React.Dispatch<React.SetStateAction<string>>;
  mood: string;
  setMood: React.Dispatch<React.SetStateAction<string>>;
  soughtHelp: boolean | null;
  setSoughtHelp: React.Dispatch<React.SetStateAction<boolean | null>>;
  physicalSymptoms: string[];
  setPhysicalSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
  customPhysicalSymptom: string;
  setCustomPhysicalSymptom: React.Dispatch<React.SetStateAction<string>>;
  sleepRating: number;
  setSleepRating: React.Dispatch<React.SetStateAction<number>>;
  stressRating: number;
  setStressRating: React.Dispatch<React.SetStateAction<number>>;
  medications: string[];
  setMedications: React.Dispatch<React.SetStateAction<string[]>>;
  mentalSymptoms: string[];
  setMentalSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
  customMentalSymptom: string;
  setCustomMentalSymptom: React.Dispatch<React.SetStateAction<string>>;
  expressionText: string;
  setExpressionText: React.Dispatch<React.SetStateAction<string>>;
  toggleSymptom: (list: string[], setList: (l: string[]) => void, item: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
}

export default function QuestionStep({
  currentStep,
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
  soughtHelp,
  setSoughtHelp,
  physicalSymptoms,
  setPhysicalSymptoms,
  customPhysicalSymptom,
  setCustomPhysicalSymptom,
  sleepRating,
  setSleepRating,
  stressRating,
  setStressRating,
  medications,
  setMedications,
  mentalSymptoms,
  setMentalSymptoms,
  customMentalSymptom,
  setCustomMentalSymptom,
  expressionText,
  setExpressionText,
  toggleSymptom,
  handleNext,
  handlePrev,
}: QuestionStepProps) {
  // ─── Choice button styling (standard 3 states: default -> hover -> selected) ───
  const choiceClass = (isSelected: boolean) =>
    `relative flex items-center justify-between gap-2 p-3.5 rounded-2xl text-xs font-bold text-left border-2 transition-all duration-200 cursor-pointer
    ${
      isSelected
        ? "border-orange-500 bg-orange-100 text-brown-900 shadow-xs"
        : "border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40 hover:bg-orange-500/5"
    }`;

  return (
    <>
      {/* Question Contents by Step */}
      <div className="flex flex-col gap-6">
        {/* Step 0: Goal Kesehatan */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Apa goal kesehatan utama yang ingin kamu capai di ZYBA?
            </h2>
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

        {/* Step 1: Profil Fisik */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Informasi Profil Fisik
            </h2>
            <div className="flex flex-col gap-4">
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

              {/* Usia & Berat Badan — input bersih seperti email, tanpa teks default */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="text-xs font-bold text-brown-900 block">Usia (Tahun):</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 21"
                    className="w-full mt-1.5 rounded-2xl border border-brown-900/12 bg-[#fbf9f5] px-4 py-3.5 text-xs text-brown-900 font-medium placeholder:text-brown-700/35 outline-none transition-all focus:border-orange-500/60 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                  {ageError ? (
                    <span className="text-[11px] font-semibold text-red-500 mt-1 block">
                      ⚠ {ageError}
                    </span>
                  ) : (
                    <span className="text-[10px] text-brown-700/60 mt-1 block">
                      Masukkan umurmu saat ini (dalam tahun)
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-brown-900 block">Berat Badan (kg):</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 65"
                    className="w-full mt-1.5 rounded-2xl border border-brown-900/12 bg-[#fbf9f5] px-4 py-3.5 text-xs text-brown-900 font-medium placeholder:text-brown-700/35 outline-none transition-all focus:border-orange-500/60 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                  <span className="text-[10px] text-brown-700/60 mt-1 block">
                    Estimasi berat badan dalam kilogram
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Mood Saat Ini — Warna khas seperti di Asesmen Harian */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Bagaimana kondisi suasana hatimu secara umum?
              </h2>
              <p className="text-xs text-brown-700 mt-1">
                Pilih ekspresi emosional yang paling mewakili keadaanmu sekarang:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {MOODS.map((m) => {
                const isSelected = mood === m.value;
                const isHappy = m.value === "HAPPY";
                const isOverjoyed = m.value === "OVERJOYED";
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    style={isSelected ? { backgroundColor: m.bg } : undefined}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      isOverjoyed ? "col-span-2 sm:col-span-1" : ""
                    } ${
                      isSelected
                        ? `${isHappy ? "text-brown-900" : "text-white"} border-transparent shadow-md scale-[1.03]`
                        : "bg-white border-brown-900/10 text-brown-700 hover:border-brown-900/25 hover:bg-cream/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="text-3xl select-none">{m.emoji}</span>
                    <span className="text-xs font-bold">{m.label}</span>
                    {isSelected && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-0.5 ${
                          isHappy ? "bg-brown-900/15 text-brown-900" : "bg-white/25 text-white"
                        }`}
                      >
                        ✓ Dipilih
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Riwayat Konsultasi */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
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
        )}

        {/* Step 4: Gejala Fisik — Pilihan cepat + Opsi lainnya yang bisa diketik user */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Gejala fisik yang sering kamu alami saat cemas/stres:
              </h2>
              <p className="text-xs text-brown-700 mt-1">
                Pilih satu atau beberapa gejala di bawah, atau ketik sendiri jika ada keluhan lainnya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Pusing / Sakit Kepala",
                "Sulit Tidur / Insomnia",
                "Jantung Berdebar Kencang",
                "Sesak Napas Ringan",
                "Tubuh Terasa Lemah",
                "Nyeri Otot / Leher Kaku",
              ].map((sym) => {
                const isSel = physicalSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(physicalSymptoms, setPhysicalSymptoms, sym)}
                    className={choiceClass(isSel)}
                  >
                    <span className="flex-1">{sym}</span>
                    {isSel && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Input ketik manual untuk gejala fisik lainnya */}
            <div className="mt-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900">
                Gejala fisik lainnya (opsional):
              </label>
              <input
                type="text"
                value={customPhysicalSymptom}
                onChange={(e) => setCustomPhysicalSymptom(e.target.value)}
                placeholder="Ketik gejala fisik lain jika ada (misal: asam lambung, tremor, mual)..."
                className="w-full rounded-2xl border border-brown-900/12 bg-[#fbf9f5] px-4 py-3.5 text-xs text-brown-900 font-medium placeholder:text-brown-700/35 outline-none transition-all focus:border-orange-500/60 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
              <span className="text-[10px] text-brown-700/60">
                💡 Kosongkan dan langsung klik Lanjut jika pilihan di atas sudah mencukupi.
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Rating Kualitas Tidur — ScoreSlider dinamis (Makin tinggi makin positif/hijau, makin rendah negatif/merah) */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Rating Kualitas Tidur (1 - 5)
              </h2>
              <span
                className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors duration-300 shadow-xs"
                style={{
                  color: scoreText(sleepRating, 1, 5, false),
                  backgroundColor: scoreTint(sleepRating, 1, 5, false),
                }}
              >
                Rating {sleepRating} / 5:{" "}
                {
                  [
                    "Sangat Buruk",
                    "Kurang Nyenyak",
                    "Cukup",
                    "Nyenyak",
                    "Nyenyak Sekali",
                  ][sleepRating - 1]
                }
              </span>
            </div>

            <p className="text-xs text-brown-700">
              Geser slider sesuai kualitas tidurmu. Semakin nyenyak dan bugar, indikator akan berubah menjadi hijau.
            </p>

            <div className="py-3 px-1">
              <ScoreSlider
                value={sleepRating}
                onChange={setSleepRating}
                inverted={false}
                ariaLabel="Rating Kualitas Tidur"
              />
            </div>

            <div className="flex justify-between text-[11px] font-bold mt-1">
              <span className="text-red-500">1 - Sangat Buruk (Negatif)</span>
              <span className="text-amber-600">3 - Cukup</span>
              <span className="text-green-600">5 - Nyenyak Sekali (Positif)</span>
            </div>
          </div>
        )}

        {/* Step 6: Rating Level Stres Harian — ScoreSlider inverted (Makin tinggi makin negatif/merah, makin santai positif/hijau) */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Rating Level Stres Harian (1 - 5)
              </h2>
              <span
                className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors duration-300 shadow-xs"
                style={{
                  color: scoreText(stressRating, 1, 5, true),
                  backgroundColor: scoreTint(stressRating, 1, 5, true),
                }}
              >
                Level {stressRating} / 5:{" "}
                {
                  [
                    "Sangat Santai",
                    "Rileks",
                    "Sedang",
                    "Tinggi",
                    "Sangat Tertekan",
                  ][stressRating - 1]
                }
              </span>
            </div>

            <p className="text-xs text-brown-700">
              Seberapa berat tekanan mental atau stres yang kamu rasakan? Semakin santai akan berwarna hijau, dan semakin tertekan akan berwarna merah.
            </p>

            <div className="py-3 px-1">
              <ScoreSlider
                value={stressRating}
                onChange={setStressRating}
                inverted={true}
                ariaLabel="Rating Level Stres Harian"
              />
            </div>

            <div className="flex justify-between text-[11px] font-bold mt-1">
              <span className="text-green-600">1 - Sangat Santai (Positif)</span>
              <span className="text-amber-600">3 - Normal / Sedang</span>
              <span className="text-red-500">5 - Sangat Tertekan (Negatif)</span>
            </div>
          </div>
        )}

        {/* Step 7: Obat & Suplemen — Chip/tag input seperti email, bisa di-skip */}
        {currentStep === 7 && (
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Obat atau Suplemen yang Sedang Dikonsumsi:
              </h2>
              <p className="text-xs text-brown-700 mt-1">
                Informasikan bila kamu sedang rutin mengonsumsi vitamin, suplemen, atau obat resep dokter.
              </p>
            </div>

            <TagInput
              tags={medications}
              onChange={setMedications}
              placeholder="Ketik nama obat/suplemen, tekan Enter untuk tambah..."
              hint="💊 Contoh: Vitamin D · Suplemen Magnesium · Obat Lambung — Tekan Enter/Tab setiap item. Kosongkan dan langsung klik Lanjut jika tidak ada."
            />

            <div className="rounded-2xl bg-orange-500/8 border border-orange-500/20 p-3.5 text-xs text-brown-800 flex items-start gap-2.5">
              <span className="text-base select-none">💡</span>
              <div className="flex-1 leading-relaxed text-[11px]">
                <strong>Bisa langsung dilewati (skip):</strong> Jika tidak sedang mengonsumsi obat atau suplemen apa pun, kamu tidak perlu mengetik apa pun dan bisa langsung klik tombol <strong>Lanjut →</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Gejala Mental — Pilihan cepat + Opsi lainnya yang bisa diketik user */}
        {currentStep === 8 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                Gejala kesehatan mental yang paling sering dirasakan:
              </h2>
              <p className="text-xs text-brown-700 mt-1">
                Pilih keluhan mental yang sering muncul, atau ketik sendiri di bawah jika ada gejala spesifik lainnya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Kecemasan Berlebih (Anxiety)",
                "Perubahan Mood Mendadak",
                "Sulit Berfokus saat Belajar/Kerja",
                "Rasa Lelah Mental Berkelanjutan",
              ].map((sym) => {
                const isSel = mentalSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(mentalSymptoms, setMentalSymptoms, sym)}
                    className={choiceClass(isSel)}
                  >
                    <span className="flex-1">{sym}</span>
                    {isSel && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Input ketik manual untuk gejala mental lainnya */}
            <div className="mt-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900">
                Gejala mental lainnya (opsional):
              </label>
              <input
                type="text"
                value={customMentalSymptom}
                onChange={(e) => setCustomMentalSymptom(e.target.value)}
                placeholder="Ketik gejala mental lain jika ada (misal: overthinking larut malam, panik, mudah sensitif)..."
                className="w-full rounded-2xl border border-brown-900/12 bg-[#fbf9f5] px-4 py-3.5 text-xs text-brown-900 font-medium placeholder:text-brown-700/35 outline-none transition-all focus:border-orange-500/60 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
              <span className="text-[10px] text-brown-700/60">
                💡 Kosongkan dan langsung klik Lanjut jika pilihan di atas sudah mencukupi.
              </span>
            </div>
          </div>
        )}

        {/* Step 9: Expression Analysis */}
        {currentStep === 9 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
                AI Expression & Reflection Screening
              </h2>
              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full self-start sm:self-auto">
                Keamanan Konten Terverifikasi
              </span>
            </div>

            <p className="text-xs text-brown-700">
              Tuliskan ekspresi bebas mengenai apa yang sedang membebani pikiranmu saat ini (opsional):
            </p>

            <textarea
              value={expressionText}
              onChange={(e) => setExpressionText(e.target.value)}
              rows={4}
              placeholder="Contoh: Akhir-akhir ini saya merasa sedikit lelah karena beban tugas kuliah/kerja menumpuk dan jam tidur berkurang..."
              className="w-full rounded-2xl border border-brown-900/12 bg-[#fbf9f5] p-4 text-xs font-medium text-brown-900 placeholder:text-brown-700/35 outline-none transition-all focus:border-green-500/60 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
            <span className="text-[10px] text-brown-700/70">
              *Teks ini diproses secara rahasia oleh sistem Zyba AI untuk melengkapi evaluasi skor awalmu.
            </span>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-brown-900/10 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700 hover:bg-cream disabled:opacity-30 transition-colors"
        >
          ← Sebelumnya
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-brown-900 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-md active:scale-98"
        >
          {currentStep === 9 ? "Selesaikan & Hitung Skor →" : "Lanjut →"}
        </button>
      </div>
    </>
  );
}
