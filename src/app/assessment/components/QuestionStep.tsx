"use client";

import React from "react";

interface QuestionStepProps {
  currentStep: number;
  goal: string;
  setGoal: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  age: string;
  setAge: React.Dispatch<React.SetStateAction<string>>;
  weight: string;
  setWeight: React.Dispatch<React.SetStateAction<string>>;
  mood: string;
  setMood: React.Dispatch<React.SetStateAction<string>>;
  soughtHelp: boolean | null;
  setSoughtHelp: React.Dispatch<React.SetStateAction<boolean | null>>;
  physicalSymptoms: string[];
  setPhysicalSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
  sleepRating: number;
  setSleepRating: React.Dispatch<React.SetStateAction<number>>;
  stressRating: number;
  setStressRating: React.Dispatch<React.SetStateAction<number>>;
  medications: string;
  setMedications: React.Dispatch<React.SetStateAction<string>>;
  mentalSymptoms: string[];
  setMentalSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
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
  weight,
  setWeight,
  mood,
  setMood,
  soughtHelp,
  setSoughtHelp,
  physicalSymptoms,
  setPhysicalSymptoms,
  sleepRating,
  setSleepRating,
  stressRating,
  setStressRating,
  medications,
  setMedications,
  mentalSymptoms,
  setMentalSymptoms,
  expressionText,
  setExpressionText,
  toggleSymptom,
  handleNext,
  handlePrev,
}: QuestionStepProps) {
  // ─── D.1 Standardized choice button class ─────────────────────────────────
  // 3 states: default → hover → selected
  const choiceClass = (isSelected: boolean) =>
    `relative flex items-center justify-between gap-2 p-3.5 rounded-2xl text-xs font-bold text-left border-2 transition-all duration-200 cursor-pointer
    ${
      isSelected
        ? "border-orange-500 bg-orange-100 text-brown-900"
        : "border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40 hover:bg-orange-500/5"
    }`;

  return (
    <>
      {/* Question Contents by Step */}
      <div className="flex flex-col gap-6">
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

        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Informasi Profil Fisik
            </h2>
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

              {/* Usia & Berat Badan — Fixed to pattern BENAR in Lampiran C.4 */}
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
                    Ketik langsung usiamu (misal: 17, 21, 25)
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
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Bagaimana kondisi suasana hatimu secara umum?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { val: "DEPRESSED", label: "Depressed 😞" },
                { val: "SAD", label: "Sad 🙁" },
                { val: "NEUTRAL", label: "Neutral 😐" },
                { val: "HAPPY", label: "Happy 🙂" },
                { val: "OVERJOYED", label: "Overjoyed 😄" },
              ].map((m) => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => setMood(m.val)}
                  className={`justify-center ${choiceClass(mood === m.val)}`}
                >
                  <span className="flex-1 text-center">{m.label}</span>
                  {mood === m.val && <span className="text-orange-500 font-extrabold shrink-0">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

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

        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Gejala fisik yang sering kamu alami saat cemas/stres:
            </h2>
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
          </div>
        )}

        {currentStep === 5 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Rating Kualitas Tidur (1 - 5)
            </h2>
            <input
              type="range"
              min="1"
              max="5"
              value={sleepRating}
              onChange={(e) => setSleepRating(Number(e.target.value))}
              className="w-full accent-green-500 cursor-pointer h-2 bg-cream rounded-lg my-4"
            />
            <div className="flex justify-between text-xs font-bold text-brown-900">
              <span>1 - Sangat Buruk</span>
              <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full font-extrabold">
                Rating: {sleepRating} / 5
              </span>
              <span>5 - Nyenyak Sekali</span>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Rating Level Stres Harian (1 - 5)
            </h2>
            <input
              type="range"
              min="1"
              max="5"
              value={stressRating}
              onChange={(e) => setStressRating(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-cream rounded-lg my-4"
            />
            <div className="flex justify-between text-xs font-bold text-brown-900">
              <span>1 - Sangat Santai</span>
              <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-extrabold">
                Rating: {stressRating} / 5
              </span>
              <span>5 - Sangat Tertekan</span>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Obat atau Suplemen yang Sedang Dikonsumsi:
            </h2>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Misal: Suplemen Vitamin D, obat tidur, dll (atau 'Tidak Ada')"
              className="w-full bg-cream rounded-2xl border border-brown-900/10 p-4 text-xs font-bold text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}

        {currentStep === 8 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brown-900 leading-snug">
              Gejala kesehatan mental yang paling sering dirasakan:
            </h2>
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
          </div>
        )}

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
              Tuliskan ekspresi bebas mengenai apa yang sedang membebani pikiranmu saat ini:
            </p>

            <textarea
              value={expressionText}
              onChange={(e) => setExpressionText(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-brown-900/10 p-4 text-xs font-medium text-brown-900 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-[10px] text-brown-700/70">
              *Teks ini diproses secara rahasia oleh sistem Zyba AI untuk menghasilkan evaluasi skor awal.
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
