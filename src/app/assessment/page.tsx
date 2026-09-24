"use client";

import { useState, useEffect } from "react";
import { detectRisk } from "@/lib/crisisDetection";
import AssessmentNav from "./components/AssessmentNav";
import QuestionStep from "./components/QuestionStep";
import CompilingState from "./components/CompilingState";
import CompletedState from "./components/CompletedState";
import CrisisModal from "./components/CrisisModal";

const STEPS = [
  { title: "Goal Kesehatan", desc: "Tujuan utama pengunaan ZYBA" },
  { title: "Profil Fisik", desc: "Gender, usia, & berat badan" },
  { title: "Mood Saat Ini", desc: "Skala ekspresi emosional" },
  { title: "Riwayat Konsultasi", desc: "Bantuan profesional medis" },
  { title: "Gejala Fisik", desc: "Indikasi fisik terkait stres" },
  { title: "Kualitas Tidur", desc: "Rating 1 - 5" },
  { title: "Level Stres", desc: "Rating 1 - 5" },
  { title: "Obat & Suplemen", desc: "Konsumsi medis saat ini" },
  { title: "Gejala Mental", desc: "Keluhan kecemasan/fokus" },
  { title: "Expression Analysis", desc: "Skrining ekspresi & teks" },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Form State — age & weight as strings initialized to default without leading zeroes (Lampiran C.4)
  const [goal, setGoal] = useState("Stress Relief & Relaxation");
  const [gender, setGender] = useState("Pria");
  const [age, setAge] = useState("21");
  const [weight, setWeight] = useState("65");
  const [mood, setMood] = useState("NEUTRAL");
  const [soughtHelp, setSoughtHelp] = useState<boolean | null>(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>(["Pusing ringan", "Sulit tidur"]);
  const [sleepRating, setSleepRating] = useState(3);
  const [stressRating, setStressRating] = useState(2);
  const [medications, setMedications] = useState("Tidak ada");
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>(["Mudah lelah", "Kadang overthinking"]);
  const [expressionText, setExpressionText] = useState(
    "Akhir-akhir ini saya merasa sedikit lelah karena beban tugas kuliah menumpuk dan jam tidur berkurang. Saya ingin melatih pikiran agar lebih tenang dan bisa mengelola waktu belajar dengan baik."
  );

  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const [calculatedScore, setCalculatedScore] = useState<number>(80);
  const [calculatedCondition, setCalculatedCondition] = useState<string>("Kondisi Baik");

  // Optional: check user gender / profile on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.gender) {
            setGender(data.user.gender);
          }
        }
      } catch (e) {
        // silent
      }
    }
    loadUser();
  }, []);

  const handleNext = async () => {
    if (currentStep === 9) {
      const isRisk = detectRisk(expressionText);
      if (isRisk) {
        setCrisisAlert(true);
        return;
      }

      setIsCompiling(true);

      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal,
            gender,
            age: parseInt(age, 10) || 21,
            weight: parseInt(weight, 10) || 65,
            mood,
            soughtHelp,
            physicalSymptoms,
            sleepRating,
            stressRating,
            medications,
            mentalSymptoms,
            expressionText,
          }),
        });

        const data = await res.json();
        if (data.success && data.zybaScore) {
          setCalculatedScore(data.zybaScore);
          setCalculatedCondition(data.condition || "Kondisi Baik");
        }
      } catch (err) {
        console.error("Assessment submit error:", err);
      } finally {
        setTimeout(() => {
          setIsCompiling(false);
          setIsCompleted(true);
        }, 1500);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const toggleSymptom = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    /* Full-screen layout — tidak ada sidebar. ClientLayout sudah exclude /assessment dari sidebar. */
    <div className="min-h-screen bg-cream flex flex-col">
      {/* ===== Top Header Bar — locked, menunjukkan ini onboarding-gated ===== */}
      <header className="w-full bg-white border-b border-brown-900/10 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Logo ZYBA mini */}
          <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-cream border border-orange-500/20 shadow-sm">
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -top-0.5 left-1/2 -translate-x-1/2" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -bottom-0.5 left-1/2 -translate-x-1/2" />
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 -left-0.5 top-1/2 -translate-y-1/2" />
            <div className="absolute w-3 h-3 rounded-full bg-green-500 -right-0.5 top-1/2 -translate-y-1/2" />
            <div className="w-2 h-2 rounded-full bg-brown-900 z-10" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-brown-900">ZYBA</span>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Asesmen Awal
            </span>
          </div>
        </div>

        {/* Progress global */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 md:w-40 h-2 rounded-full bg-cream border border-brown-900/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-500"
                style={{ width: `${((currentStep + (isCompleted ? 1 : 0)) / 10) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-brown-700">
              {isCompleted ? "100" : Math.round(((currentStep + 1) / 10) * 100)}%
            </span>
          </div>

          {/* Lock badge */}
          {!isCompleted && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-cream border border-brown-900/15 text-[10px] sm:text-[11px] font-bold text-brown-700">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Wajib Selesai</span>
            </div>
          )}
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-6 sm:px-6 md:px-10 md:py-10 flex flex-col justify-center">
        {/* Page title */}
        {!isCompleted && !isCompiling && (
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-brown-900">
                Mental Health Assessment
              </h1>
              <p className="text-xs text-brown-700 mt-0.5">
                Kuisioner awal untuk menyusun rencana kesehatan mental terpersonalisasi.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-500 self-start sm:self-auto">
              Langkah {currentStep + 1} dari 10
            </span>
          </div>
        )}

        {/* Multi-step responsive container: flex stack on mobile, 12-col grid on lg */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* Left panel / Mobile top bar: Stepper */}
          {!isCompleted && !isCompiling && (
            <AssessmentNav currentStep={currentStep} setCurrentStep={setCurrentStep} steps={STEPS} />
          )}

          {/* Right panel: Active Question / State */}
          <div
            className={`w-full ${
              isCompleted || isCompiling ? "lg:col-span-12" : "lg:col-span-8"
            } glass-card rounded-3xl p-5 sm:p-8 border border-brown-900/10 flex flex-col justify-between min-h-[460px] bg-white shadow-sm`}
          >
            {!isCompiling && !isCompleted && (
              <QuestionStep
                currentStep={currentStep}
                goal={goal}
                setGoal={setGoal}
                gender={gender}
                setGender={setGender}
                age={age}
                setAge={setAge}
                weight={weight}
                setWeight={setWeight}
                mood={mood}
                setMood={setMood}
                soughtHelp={soughtHelp}
                setSoughtHelp={setSoughtHelp}
                physicalSymptoms={physicalSymptoms}
                setPhysicalSymptoms={setPhysicalSymptoms}
                sleepRating={sleepRating}
                setSleepRating={setSleepRating}
                stressRating={stressRating}
                setStressRating={setStressRating}
                medications={medications}
                setMedications={setMedications}
                mentalSymptoms={mentalSymptoms}
                setMentalSymptoms={setMentalSymptoms}
                expressionText={expressionText}
                setExpressionText={setExpressionText}
                toggleSymptom={toggleSymptom}
                handleNext={handleNext}
                handlePrev={handlePrev}
              />
            )}

            {isCompiling && <CompilingState />}

            {isCompleted && (
              <CompletedState score={calculatedScore} condition={calculatedCondition} />
            )}
          </div>
        </div>
      </div>

      {/* Crisis modal */}
      {crisisAlert && (
        <CrisisModal setCrisisAlert={setCrisisAlert} setExpressionText={setExpressionText} />
      )}
    </div>
  );
}
