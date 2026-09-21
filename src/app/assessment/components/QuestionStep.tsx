"use client";

import React from "react";

interface QuestionStepProps {
  currentStep: number;
  goal: string;
  setGoal: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  age: number;
  setAge: React.Dispatch<React.SetStateAction<number>>;
  weight: number;
  setWeight: React.Dispatch<React.SetStateAction<number>>;
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
  currentStep, goal, setGoal, gender, setGender, age, setAge, weight, setWeight,
  mood, setMood, soughtHelp, setSoughtHelp, physicalSymptoms, setPhysicalSymptoms,
  sleepRating, setSleepRating, stressRating, setStressRating, medications, setMedications,
  mentalSymptoms, setMentalSymptoms, expressionText, setExpressionText,
  toggleSymptom, handleNext, handlePrev,
}: QuestionStepProps) {
  return (
    <>
      {/* Question Contents by Step */}
      <div className="flex flex-col gap-6">
        {currentStep === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Apa goal kesehatan utama yang ingin kamu capai di ZYBA?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Stress Relief & Relaxation",
                "Memperbaiki Kualitas Tidur",
                "Meningkatkan Fokus & Produktivitas",
                "Curhat & Konseling AI 24/7",
              ].map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`p-4 rounded-2xl text-xs font-bold border-2 transition-all text-left ${
                    goal === g
                      ? "border-orange-500 bg-orange-100 text-brown-900 shadow-sm"
                      : "border-brown-900/10 bg-cream/40 hover:border-brown-900/20 text-brown-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Informasi Profil Fisik
            </h2>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-brown-900">Gender:</label>
              <div className="flex gap-3">
                {["Pria", "Wanita", "Lainnya"].map((gen) => (
                  <button
                    key={gen}
                    onClick={() => setGender(gen)}
                    className={`flex-1 p-3 rounded-2xl text-xs font-bold border-2 ${
                      gender === gen ? "bg-brown-900 text-white border-brown-900" : "bg-cream border-brown-900/10 text-brown-700"
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-xs font-bold text-brown-900">Usia (Tahun):</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full mt-1 bg-cream rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brown-900">Berat Badan (kg):</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full mt-1 bg-cream rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Bagaimana kondisi suasana hatimu secara umum?
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {[
                { val: "DEPRESSED", label: "Depressed 😞" },
                { val: "SAD", label: "Sad 🙁" },
                { val: "NEUTRAL", label: "Neutral 😐" },
                { val: "HAPPY", label: "Happy 🙂" },
                { val: "OVERJOYED", label: "Overjoyed 😄" },
              ].map((m) => (
                <button
                  key={m.val}
                  onClick={() => setMood(m.val)}
                  className={`p-4 rounded-2xl text-xs font-bold border-2 ${
                    mood === m.val ? "bg-brown-900 text-white border-brown-900" : "bg-cream border-brown-900/10 text-brown-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Pernah mencari bantuan profesional (Psikolog / Psikiater)?
            </h2>
            <div className="flex gap-4">
              {[
                { label: "Ya, Pernah Konsultasi", val: true },
                { label: "Belum Pernah", val: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSoughtHelp(opt.val)}
                  className={`flex-1 p-5 rounded-2xl text-xs font-bold border-2 ${
                    soughtHelp === opt.val ? "bg-brown-900 text-white border-brown-900" : "bg-cream border-brown-900/10 text-brown-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Gejala fisik yang sering kamu alami saat cemas/stres:
            </h2>
            <div className="grid grid-cols-2 gap-3">
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
                    onClick={() => toggleSymptom(physicalSymptoms, setPhysicalSymptoms, sym)}
                    className={`p-3.5 rounded-2xl text-xs font-bold border-2 text-left transition-all ${
                      isSel ? "bg-green-500 text-white border-green-500" : "bg-cream border-brown-900/10 text-brown-700"
                    }`}
                  >
                    {isSel ? "✓ " : "+ "}{sym}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
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
              <span className="text-green-500">Rating: {sleepRating} / 5</span>
              <span>5 - Nyenyak Sekali</span>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
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
              <span className="text-orange-500">Rating: {stressRating} / 5</span>
              <span>5 - Sangat Tertekan</span>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Obat atau Suplemen yang Sedang Dikonsumsi:
            </h2>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Misal: Suplemen Vitamin D, obat tidur, dll (atau 'Tidak Ada')"
              className="w-full bg-cream rounded-2xl border border-brown-900/10 p-4 text-xs font-bold text-brown-900 focus:outline-none"
            />
          </div>
        )}

        {currentStep === 8 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-brown-900">
              Gejala kesehatan mental yang paling sering dirasakan:
            </h2>
            <div className="grid grid-cols-2 gap-3">
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
                    onClick={() => toggleSymptom(mentalSymptoms, setMentalSymptoms, sym)}
                    className={`p-3.5 rounded-2xl text-xs font-bold border-2 text-left transition-all ${
                      isSel ? "bg-orange-500 text-white border-orange-500" : "bg-cream border-brown-900/10 text-brown-700"
                    }`}
                  >
                    {isSel ? "✓ " : "+ "}{sym}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-brown-900">
                AI Expression & Reflection Screening
              </h2>
              <span className="text-[10px] bg-green-100 text-green-500 font-bold px-2 py-0.5 rounded-full">
                Keamanan Konten Terverifikasi
              </span>
            </div>

            <p className="text-xs text-brown-700">
              Tuliskan ekspresi bebas mengenai apa yang sedang membebani pikiranmu saat ini:
            </p>

            <textarea
              value={expressionText}
              onChange={(e) => setExpressionText(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-brown-900/10 p-4 text-xs font-medium text-brown-900 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-[10px] text-brown-700">
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
          className="px-6 py-3 rounded-full border border-brown-900/10 text-xs font-bold text-brown-700 hover:bg-cream disabled:opacity-30"
        >
          ← Sebelumnya
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-brown-900 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-md"
        >
          {currentStep === 9 ? "Selesaikan & Hitung Skor →" : "Lanjut →"}
        </button>
      </div>
    </>
  );
}
