"use client";

// Onboarding & Asesmen Awal 8-Step — Redesign v2
// Sumber acuan tunggal: design-system/zyba/MASTER.md & design-system/zyba/pages/onboarding-assessment.md

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { detectRisk } from "@/lib/crisisDetection";
import { useFreshDataSignal } from "@/hooks/useFreshData";
import AssessmentNav from "./components/AssessmentNav";
import QuestionStep from "./components/QuestionStep";
import CompilingState from "./components/CompilingState";
import CompletedState from "./components/CompletedState";
import CrisisModal from "./components/CrisisModal";

// 8 Unified Steps (Profile Setup + Mental Health Assessment) — AGENTS.md 4.B & 4.C
const STEPS = [
  { title: "Profil & Avatar", desc: "Pilih avatar & nama panggilan" },
  { title: "PIN Keamanan", desc: "4 digit proteksi privasi sesi" },
  { title: "Preferensi Notifikasi", desc: "Atur pengingat kebugaran" },
  { title: "Goal Kesehatan", desc: "Tujuan utama penggunaan ZYBA" },
  { title: "Profil Fisik", desc: "Gender, usia, & berat badan" },
  { title: "Ritme Batin & Tidur", desc: "Mood pebble & kualitas tidur" },
  { title: "Beban Stres & Gejala", desc: "Level stres & keluhan tubuh" },
  { title: "Analisis Ekspresi", desc: "Skrining refleksi batin AI" },
];

export default function AssessmentPage() {
  const dataRefreshSignal = useFreshDataSignal();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll otomatis ke atas konten asesmen saat berpindah step
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Profile & Security State ──────────────────────────────────────────────
  const [name, setName] = useState("");
  const [avatarKey, setAvatarKey] = useState("fox");
  const [bio, setBio] = useState("");
  const [pin, setPin] = useState("");

  // ── Notification Preferences ──────────────────────────────────────────────
  const [companionNotif, setCompanionNotif] = useState(true);
  const [wellnessNotif, setWellnessNotif] = useState(true);
  const [communityNotif, setCommunityNotif] = useState(false);

  // ── Mental Health & Lifestyle State ───────────────────────────────────────
  const [goal, setGoal] = useState("Stress Relief & Relaxation");
  const [gender, setGender] = useState("Pria");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [mood, setMood] = useState("HAPPY");
  const [soughtHelp, setSoughtHelp] = useState<boolean | null>(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [customPhysicalSymptom, setCustomPhysicalSymptom] = useState("");
  const [sleepRating, setSleepRating] = useState(3);
  const [stressRating, setStressRating] = useState(2);
  const [medications, setMedications] = useState<string[]>([]);
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>([]);
  const [customMentalSymptom, setCustomMentalSymptom] = useState("");
  const [expressionText, setExpressionText] = useState("");

  // ── Execution State ───────────────────────────────────────────────────────
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(80);
  const [calculatedCondition, setCalculatedCondition] = useState<string>("Kondisi Baik");
  const [ageError, setAgeError] = useState("");

  // Jika sudah menyelesaikan onboarding, lempar langsung ke dashboard
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.onboardingCompleted) {
            router.replace("/dashboard");
            return;
          }
          if (data.user?.name) {
            setName(data.user.name);
          }
          if (data.user?.avatarUrl) {
            setAvatarKey(data.user.avatarUrl);
          }
          if (data.user?.gender) {
            setGender(data.user.gender);
          }
        }
      } catch (e) {
        // silent
      }
    }
    loadUser();
  }, [router, dataRefreshSignal]);

  const handleNext = async () => {
    // ── Validasi Step 4: Usia wajib diisi ────────────────────────────
    if (currentStep === 4) {
      const ageNum = parseInt(age, 10);
      if (!age.trim() || isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
        setAgeError("Umur wajib diisi (5–120 tahun).");
        return;
      }
      setAgeError("");
    }

    // ── Final Step (Step 7: Analisis Ekspresi) ──────────────────────
    if (currentStep === 7) {
      if (expressionText.trim()) {
        const isRisk = detectRisk(expressionText);
        if (isRisk) {
          setCrisisAlert(true);
          return;
        }
      }

      setIsCompiling(true);

      const finalPhysical = [...physicalSymptoms];
      if (customPhysicalSymptom.trim() && !finalPhysical.includes(customPhysicalSymptom.trim())) {
        finalPhysical.push(customPhysicalSymptom.trim());
      }

      const finalMental = [...mentalSymptoms];
      if (customMentalSymptom.trim() && !finalMental.includes(customMentalSymptom.trim())) {
        finalMental.push(customMentalSymptom.trim());
      }

      const finalMedications = medications.length > 0 ? medications.join("; ") : "Tidak ada";
      const finalExpression = expressionText.trim() || "Tidak ada catatan tambahan.";

      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || undefined,
            avatarUrl: avatarKey || "fox",
            bio: bio.trim() || undefined,
            notificationPref: {
              companionNotif,
              wellnessNotif,
              communityNotif,
            },
            goal,
            gender,
            age: parseInt(age, 10) || 21,
            weight: parseInt(weight, 10) || 65,
            mood,
            soughtHelp,
            physicalSymptoms: finalPhysical,
            sleepRating,
            stressRating,
            medications: finalMedications,
            mentalSymptoms: finalMental,
            expressionText: finalExpression,
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
      setTimeout(scrollToTop, 50);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setTimeout(scrollToTop, 50);
    }
  };

  const toggleSymptom = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* ===== Top Header Bar ===== */}
      <header className="w-full bg-white border-b border-brown-900/10 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-cream border border-orange-500/20 shadow-xs">
            <span className="font-display font-black text-xs text-orange-500">ZY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-brown-900">ZYBA</span>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Setup Profil & Asesmen Awal
            </span>
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <div
        ref={contentRef}
        className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-6 sm:px-6 md:px-10 md:py-10 flex flex-col justify-center"
      >
        {/* Page Title */}
        {!isCompleted && !isCompiling && (
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-brown-900">
                Langkah Awal Menuju Ketenangan
              </h1>
              <p className="text-xs text-brown-700 mt-0.5">
                Setup profil pribadimu dan rekam kondisi awal untuk menyusun sanctuary yang personal.
              </p>
            </div>
          </div>
        )}

        {/* Multi-step responsive container: flex stack on mobile, 12-col grid on lg */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 items-start">
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
                name={name}
                setName={setName}
                avatarKey={avatarKey}
                setAvatarKey={setAvatarKey}
                bio={bio}
                setBio={setBio}
                pin={pin}
                setPin={setPin}
                companionNotif={companionNotif}
                setCompanionNotif={setCompanionNotif}
                wellnessNotif={wellnessNotif}
                setWellnessNotif={setWellnessNotif}
                communityNotif={communityNotif}
                setCommunityNotif={setCommunityNotif}
                goal={goal}
                setGoal={setGoal}
                gender={gender}
                setGender={setGender}
                age={age}
                setAge={(v) => {
                  setAge(v);
                  setAgeError("");
                }}
                ageError={ageError}
                weight={weight}
                setWeight={setWeight}
                mood={mood}
                setMood={setMood}
                sleepRating={sleepRating}
                setSleepRating={setSleepRating}
                stressRating={stressRating}
                setStressRating={setStressRating}
                physicalSymptoms={physicalSymptoms}
                setPhysicalSymptoms={setPhysicalSymptoms}
                customPhysicalSymptom={customPhysicalSymptom}
                setCustomPhysicalSymptom={setCustomPhysicalSymptom}
                mentalSymptoms={mentalSymptoms}
                setMentalSymptoms={setMentalSymptoms}
                customMentalSymptom={customMentalSymptom}
                setCustomMentalSymptom={setCustomMentalSymptom}
                medications={medications}
                setMedications={setMedications}
                soughtHelp={soughtHelp}
                setSoughtHelp={setSoughtHelp}
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
