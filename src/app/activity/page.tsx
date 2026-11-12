"use client";

// Smart Activity Planner & Taman Bernapas — Redesign v2
// Sumber acuan tunggal: design-system/zyba/MASTER.md & design-system/zyba/pages/activity.md

import { useState, useEffect, useCallback } from "react";
import ActivityBanner from "./components/ActivityBanner";
import AddActivityModal, {
  type NewActivity,
} from "./components/AddActivityModal";
import BreathingExercise from "./components/BreathingExercise";
import CompletionModal from "./components/CompletionModal";
import DailyConditionCard from "./components/DailyConditionCard";
import DailyPlan, {
  type PlannedActivity,
} from "./components/DailyPlan";
import { notifyZybaDataChanged } from "@/hooks/useFreshData";
import ZybaRecommendations, {
  type Recommendation,
} from "./components/ZybaRecommendations";
import { CheckCircle2, Sparkles } from "lucide-react";

const PLAN_STORAGE_VERSION = "zyba_daily_plan_v4";

function getJakartaDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getPlanStorageKey(date = new Date()) {
  return `${PLAN_STORAGE_VERSION}_${getJakartaDateKey(date)}`;
}

const INITIAL_PLAN: PlannedActivity[] = [
  {
    id: "walk-08",
    time: "08:00",
    title: "Jalan Santai Pagi",
    duration: "15 min",
    icon: "walk",
    category: "Aktivitas Ringan",
    points: 60,
    completed: false,
  },
  {
    id: "walk-13",
    time: "13:30",
    title: "Jalan Rehat Siang",
    duration: "10 min",
    icon: "walk",
    category: "Recovery",
    points: 40,
    completed: false,
  },
  {
    id: "stretch-16",
    time: "16:30",
    title: "Stretching Ringan",
    duration: "8 min",
    icon: "stretch",
    category: "Mobility",
    points: 40,
    completed: false,
  },
  {
    id: "workout-18",
    time: "18:30",
    title: "Workout Sederhana",
    duration: "20 min",
    icon: "workout",
    category: "Latihan",
    points: 100,
    completed: false,
  },
  {
    id: "breath-20",
    time: "20:00",
    title: "Zyba Hours (Pernapasan 4-7-8)",
    duration: "3 min",
    icon: "breathe",
    category: "Relaksasi",
    points: 30,
    completed: false,
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-walk",
    icon: "walk",
    title: "Jalan Santai",
    duration: "15 menit",
    points: 60,
    description:
      "Aktivitas ringan untuk menjaga tubuh tetap aktif tanpa menambah beban fisik berlebih.",
  },
  {
    id: "rec-stretch",
    icon: "stretch",
    title: "Stretching Mandiri",
    duration: "8 menit",
    points: 40,
    description:
      "Gerakan sederhana untuk merilekskan otot leher dan pundak setelah seharian duduk.",
  },
  {
    id: "rec-breath",
    icon: "breathe",
    title: "Zyba Hours 4-7-8",
    duration: "3 menit",
    points: 30,
    description:
      "Latihan pernapasan ritmis yang cepat mengembalikan ketenangan sistem sarafmu.",
  },
];

export default function SmartActivityPlannerPage() {
  const targetProgress = 1200;

  const [isCompleted, setIsCompleted] = useState(false);
  const [conditionData, setConditionData] = useState<any>(null);
  const [activityToast, setActivityToast] = useState<string | null>(null);

  // Daily Planner State & Persistence
  const [plan, setPlan] = useState<PlannedActivity[]>(INITIAL_PLAN);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load plan from localStorage on mount (checks v4, falls back to legacy v3)
  useEffect(() => {
    try {
      const savedV4 = localStorage.getItem(getPlanStorageKey());
      if (savedV4) {
        const parsed = JSON.parse(savedV4);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlan(parsed);
          return;
        }
      }

      // Check legacy v3 fallback
      const legacyKey = `zyba_daily_plan_v3_${getJakartaDateKey()}`;
      const legacySaved = localStorage.getItem(legacyKey);
      if (legacySaved) {
        const parsedLegacy = JSON.parse(legacySaved);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          setPlan(parsedLegacy);
        }
      }
    } catch (e) {
      console.error("Failed to load saved activity plan:", e);
    }
  }, []);

  const updateAndSavePlan = (newPlan: PlannedActivity[]) => {
    setPlan(newPlan);
    try {
      localStorage.setItem(getPlanStorageKey(), JSON.stringify(newPlan));
    } catch (e) {
      console.error("Failed to save activity plan:", e);
    }
  };

  // Breathing Completion Handler
  const handleCompleteBreathing = async () => {
    try {
      const response = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BREATHING",
          durationMin: 3,
          points: 30,
          completed: true,
          title: "Zyba Hours (Breathing)",
        }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan sesi pernapasan.");

      // Update dashboard tracker cache
      const dateKey = getJakartaDateKey();
      const trackerKey = `zyba_trackers_${dateKey}`;
      try {
        const current = JSON.parse(localStorage.getItem(trackerKey) || "{}");
        current["Zyba Hours (Breathing)"] = true;
        localStorage.setItem(trackerKey, JSON.stringify(current));
      } catch {}

      setPlan((prev) => {
        const updated = prev.map((activity) =>
          activity.title.toLowerCase().includes("zyba hours") ||
          activity.title.toLowerCase().includes("pernapasan")
            ? { ...activity, completed: true }
            : activity
        );
        try {
          localStorage.setItem(getPlanStorageKey(), JSON.stringify(updated));
        } catch {}
        return updated;
      });

      notifyZybaDataChanged();
      setActivityToast("Sesi pernapasan 4-7-8 selesai! +30 Zyba Points tersimpan!");
      setTimeout(() => setActivityToast(null), 4000);
    } catch (err) {
      console.warn("Save breathing error:", err);
    }
  };

  // Toggle Daily Plan & DB Persistence
  const togglePlanActivity = async (id: string) => {
    const selectedActivity = plan.find((activity) => activity.id === id);
    if (!selectedActivity) return;

    const nextCompleted = !selectedActivity.completed;

    const updated = plan.map((activity) =>
      activity.id === id
        ? {
            ...activity,
            completed: nextCompleted,
          }
        : activity
    );

    updateAndSavePlan(updated);

    // Save to database when checked
    if (nextCompleted) {
      try {
        let actType = "WALKING";
        const lower = selectedActivity.title.toLowerCase();
        if (lower.includes("lari") || lower.includes("run")) actType = "RUNNING";
        if (lower.includes("napas") || lower.includes("hours") || lower.includes("breath")) actType = "BREATHING";
        if (lower.includes("stretch") || lower.includes("workout")) actType = "WORKOUT";

        const response = await fetch("/api/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: actType,
            durationMin: 15,
            points: selectedActivity.points,
            completed: true,
            title: selectedActivity.title,
          }),
        });

        if (!response.ok) throw new Error("Gagal menyimpan aktivitas.");
        notifyZybaDataChanged();
        setActivityToast(`Aktivitas "${selectedActivity.title}" selesai & tersimpan!`);
        setTimeout(() => setActivityToast(null), 3500);
      } catch (e) {
        console.warn("Save toggle activity error:", e);
      }
    }

    const nextPlanPoints = updated
      .filter((activity) => activity.completed)
      .reduce((total, activity) => total + activity.points, 0);

    if (nextCompleted && nextPlanPoints >= targetProgress) {
      setIsCompleted(true);
    }
  };

  // Add Custom Activity
  const addPlanActivity = (activity: NewActivity) => {
    const newActivity: PlannedActivity = {
      ...activity,
      id: `custom-${Date.now()}`,
      completed: false,
    };

    const updated = [...plan, newActivity].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    updateAndSavePlan(updated);
    setIsAddModalOpen(false);
  };

  // Delete Activity
  const deletePlanActivity = (id: string) => {
    const updated = plan.filter((a) => a.id !== id);
    updateAndSavePlan(updated);
  };

  // Reset To Default
  const resetToDefaultPlan = () => {
    updateAndSavePlan(INITIAL_PLAN);
  };

  // Add Recommendation
  const addRecommendation = (recommendation: Recommendation) => {
    const alreadyExists = plan.some(
      (activity) =>
        activity.title.toLowerCase() === recommendation.title.toLowerCase()
    );

    if (alreadyExists) return;

    const newActivity: PlannedActivity = {
      id: `recommendation-${recommendation.id}-${Date.now()}`,
      time: "20:30",
      title: recommendation.title,
      duration: recommendation.duration,
      icon: recommendation.icon,
      category: "Rekomendasi Pemulihan",
      points: recommendation.points,
      completed: false,
    };

    const updated = [...plan, newActivity].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    updateAndSavePlan(updated);
  };

  const completedActivities = plan.filter((activity) => activity.completed).length;
  const totalActivities = plan.length;
  const remainingActivities = Math.max(totalActivities - completedActivities, 0);
  const planCompletionPercent =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;
  const completedPlanPoints = plan
    .filter((activity) => activity.completed)
    .reduce((total, activity) => total + activity.points, 0);

  const activityProgress = completedPlanPoints;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {activityToast && (
        <div className="bg-green-100 border border-green-500/25 text-green-900 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-green-700 shrink-0" />
          <span>{activityToast}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <ActivityBanner
        activityProgress={activityProgress}
        targetProgress={targetProgress}
      />

      {/* CONDITION + RECOMMENDATIONS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <DailyConditionCard initialCondition={conditionData} />

        <ZybaRecommendations
          recommendations={RECOMMENDATIONS}
          onAdd={addRecommendation}
        />
      </div>

      {/* DAILY PLAN SECTION */}
      <DailyPlan
        activities={plan}
        completedCount={completedActivities}
        onToggle={togglePlanActivity}
        onDelete={deletePlanActivity}
        onAdd={() => setIsAddModalOpen(true)}
        onResetDefault={resetToDefaultPlan}
      />

      {/* BREATHING PAVILION + DAILY PROGRESS SUMMARY */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <BreathingExercise onComplete={handleCompleteBreathing} />
        </div>

        <div className="xl:col-span-4 rounded-[24px] p-6 sm:p-7 border border-brown-900/10 bg-white/95 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  Ringkasan Ritme
                </span>
                <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-2.5">
                  {completedActivities} dari {totalActivities} selesai
                </h2>
              </div>
              <span className="font-display text-2xl font-extrabold text-brown-900">
                {planCompletionPercent}%
              </span>
            </div>

            <div
              className="mt-5 h-3 rounded-full bg-cream overflow-hidden border border-brown-900/10"
              role="progressbar"
              aria-valuenow={planCompletionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress aktivitas hari ini"
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${planCompletionPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-cream/40 border border-brown-900/10 p-3.5">
                <span className="text-[11px] text-brown-700/80 font-medium block">
                  Poin Tercapai
                </span>
                <p className="text-xl font-extrabold text-brown-900 mt-1">
                  {completedPlanPoints}
                </p>
                <p className="text-[10px] text-brown-700/60 font-semibold mt-0.5">
                  Zyba Points
                </p>
              </div>

              <div className="rounded-2xl bg-cream/40 border border-brown-900/10 p-3.5">
                <span className="text-[11px] text-brown-700/80 font-medium block">
                  Aktivitas Tersisa
                </span>
                <p className="text-xl font-extrabold text-brown-900 mt-1">
                  {remainingActivities}
                </p>
                <p className="text-[10px] text-brown-700/60 font-semibold mt-0.5">
                  Langkah mikro
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brown-900/10">
            <p className="text-xs text-brown-700/80 leading-relaxed">
              <strong className="text-brown-900 font-bold">Catatan Pendamping: </strong>
              Setiap langkah yang kamu centang hari ini memperkuat kestabilan fokusmu. Tidak perlu terburu-buru, nikmati prosesnya.
            </p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addPlanActivity}
      />

      <CompletionModal
        isOpen={isCompleted}
        onClose={() => setIsCompleted(false)}
      />
    </div>
  );
}
