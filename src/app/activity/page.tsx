"use client";

import { useState, useEffect } from "react";
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

const PLAN_STORAGE_VERSION = "zyba_daily_plan_v3";

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
    title: "Jalan Santai",
    duration: "15 min",
    icon: "🚶",
    category: "Aktivitas Ringan",
    points: 60,
    completed: false,
  },
  {
    id: "walk-13",
    time: "13:30",
    title: "Jalan 10 Menit",
    duration: "10 min",
    icon: "🚶",
    category: "Recovery",
    points: 40,
    completed: false,
  },
  {
    id: "stretch-16",
    time: "16:30",
    title: "Stretching Ringan",
    duration: "8 min",
    icon: "🤸",
    category: "Mobility",
    points: 40,
    completed: false,
  },
  {
    id: "workout-18",
    time: "18:30",
    title: "Workout Ringan",
    duration: "20 min",
    icon: "🏋️",
    category: "Latihan",
    points: 100,
    completed: false,
  },
  {
    id: "breath-20",
    time: "20:00",
    title: "Zyba Hours",
    duration: "3 min",
    icon: "🫁",
    category: "Relaksasi",
    points: 30,
    completed: false,
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-walk",
    icon: "🚶",
    title: "Jalan Santai",
    duration: "15 menit",
    points: 60,
    description:
      "Aktivitas ringan untuk menjaga tubuh tetap aktif tanpa menambah beban terlalu banyak.",
  },
  {
    id: "rec-stretch",
    icon: "🤸",
    title: "Stretching",
    duration: "8 menit",
    points: 40,
    description:
      "Gerakan sederhana untuk membantu tubuh tetap rileks setelah banyak duduk atau belajar.",
  },
  {
    id: "rec-breath",
    icon: "🫁",
    title: "Zyba Hours",
    duration: "3 menit",
    points: 30,
    description:
      "Latihan pernapasan singkat yang bisa dilakukan saat ingin mengambil jeda.",
  },
];

export default function SmartActivityPlannerPage() {
  // =========================
  // Breathing
  // =========================
  const [breathingActive, setBreathingActive] = useState(false);

  const [breathingPhase, setBreathingPhase] = useState<
    "Tarik Napas" | "Tahan Napas" | "Hembuskan"
  >("Tarik Napas");

  const [breathTimer, setBreathTimer] = useState(180);

  // =========================
  // Activity
  // =========================
  const targetProgress = 1200;

  const [isCompleted, setIsCompleted] = useState(false);
  const [conditionData, setConditionData] = useState<any>(null);
  const [activityToast, setActivityToast] = useState<string | null>(null);

  // =========================
  // Daily Planner State & Persistence
  // =========================
  const [plan, setPlan] = useState<PlannedActivity[]>(INITIAL_PLAN);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load plan from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getPlanStorageKey());
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPlan(parsed);
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

  // =========================
  // Breathing Timer Interval & Persistence
  // =========================
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathingActive(false);
            handleCompleteBreathing();
            return 180;
          }
          const elapsed = 180 - prev;
          const cycle = elapsed % 12;
          if (cycle < 4) setBreathingPhase("Tarik Napas");
          else if (cycle < 8) setBreathingPhase("Tahan Napas");
          else setBreathingPhase("Hembuskan");
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive]);

  const handleCompleteBreathing = async () => {
    try {
      await fetch("/api/activity", {
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

      // Update dashboard tracker cache
      const dateKey = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const trackerKey = `zyba_trackers_${dateKey}`;
      try {
        const current = JSON.parse(localStorage.getItem(trackerKey) || "{}");
        current["Zyba Hours (Breathing)"] = true;
        localStorage.setItem(trackerKey, JSON.stringify(current));
      } catch {}

      setPlan((prev) => {
        const updated = prev.map((activity) =>
          activity.title.toLowerCase().includes("zyba hours")
            ? { ...activity, completed: true }
            : activity
        );
        try {
          localStorage.setItem(getPlanStorageKey(), JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setActivityToast("Sesi Zyba Hours selesai! +30 Zyba Points tersimpan!");
      setTimeout(() => setActivityToast(null), 4000);
    } catch (err) {
      console.warn("Save breathing error:", err);
    }
  };

  // =========================
  // Helpers
  // =========================
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;

    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  // =========================
  // Toggle Daily Plan & DB Persistence
  // =========================
  const togglePlanActivity = async (id: string) => {
    const selectedActivity = plan.find(
      (activity) => activity.id === id,
    );

    if (!selectedActivity) return;

    const nextCompleted = !selectedActivity.completed;

    const updated = plan.map((activity) =>
      activity.id === id
        ? {
            ...activity,
            completed: nextCompleted,
          }
        : activity,
    );

    updateAndSavePlan(updated);

    // Target progress is derived from the plan itself, so UI and refresh state
    // stay consistent with the user's chosen schedule.

    // Save to database when checked
    if (nextCompleted) {
      try {
        let actType = "WALKING";
        const lower = selectedActivity.title.toLowerCase();
        if (lower.includes("lari") || lower.includes("run")) actType = "RUNNING";
        if (lower.includes("napas") || lower.includes("hours") || lower.includes("breath")) actType = "BREATHING";
        if (lower.includes("stretch") || lower.includes("workout")) actType = "WORKOUT";

        await fetch("/api/activity", {
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
        setActivityToast(`✓ Aktivitas "${selectedActivity.title}" selesai & tersimpan!`);
        notifyZybaDataChanged();
        setTimeout(() => setActivityToast(null), 3000);
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

  // =========================
  // Add Custom Activity
  // =========================
  const addPlanActivity = (activity: NewActivity) => {
    const newActivity: PlannedActivity = {
      ...activity,
      id: `custom-${Date.now()}`,
      completed: false,
    };

    const updated = [...plan, newActivity].sort((a, b) =>
      a.time.localeCompare(b.time),
    );

    updateAndSavePlan(updated);
    setIsAddModalOpen(false);
  };

  // =========================
  // Delete Activity
  // =========================
  const deletePlanActivity = (id: string) => {
    const updated = plan.filter((a) => a.id !== id);
    updateAndSavePlan(updated);
  };

  // =========================
  // Reset To Default
  // =========================
  const resetToDefaultPlan = () => {
    updateAndSavePlan(INITIAL_PLAN);
  };

  // =========================
  // Add Recommendation
  // =========================
  const addRecommendation = (
    recommendation: Recommendation,
  ) => {
    const alreadyExists = plan.some(
      (activity) =>
        activity.title.toLowerCase() ===
        recommendation.title.toLowerCase(),
    );

    if (alreadyExists) return;

    const newActivity: PlannedActivity = {
      id: `recommendation-${recommendation.id}-${Date.now()}`,
      time: "20:30",
      title: recommendation.title,
      duration: recommendation.duration,
      icon: recommendation.icon,
      category: "Rekomendasi Zyba",
      points: recommendation.points,
      completed: false,
    };

    const updated = [...plan, newActivity].sort((a, b) =>
      a.time.localeCompare(b.time),
    );

    updateAndSavePlan(updated);
  };

  const completedActivities = plan.filter(
    (activity) => activity.completed,
  ).length;

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
        <div className="bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          {activityToast}
        </div>
      )}

      {/* =========================
          HEADER
      ========================== */}
      <ActivityBanner
        activityProgress={activityProgress}
        targetProgress={targetProgress}
      />

      {/* =========================
          CONDITION + RECOMMENDATION
      ========================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <DailyConditionCard initialCondition={conditionData} />

        <ZybaRecommendations
          recommendations={RECOMMENDATIONS}
          onAdd={addRecommendation}
        />
      </div>

      {/* =========================
          DAILY PLAN
      ========================== */}
      <DailyPlan
        activities={plan}
        completedCount={completedActivities}
        onToggle={togglePlanActivity}
        onDelete={deletePlanActivity}
        onAdd={() => setIsAddModalOpen(true)}
        onResetDefault={resetToDefaultPlan}
      />

      {/* =========================
          BREATHING + DAILY PROGRESS
      ========================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <BreathingExercise
            breathingActive={breathingActive}
            setBreathingActive={setBreathingActive}
            breathingPhase={breathingPhase}
            breathTimer={breathTimer}
            setBreathTimer={(timer) => {
              setBreathTimer(timer);

              if (timer === 180) {
                setBreathingPhase("Tarik Napas");
              }
            }}
            formatTime={formatTime}
          />
        </div>

        <div className="xl:col-span-4 glass-card rounded-3xl p-6 border border-brown-900/10 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-green-500">
                Progress Hari Ini
              </span>
              <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-2">
                {completedActivities} / {totalActivities} aktivitas
              </h2>
            </div>
            <span className="text-lg font-extrabold text-brown-900">
              {planCompletionPercent}%
            </span>
          </div>

          <div
            className="mt-5 h-3 rounded-full bg-cream overflow-hidden"
            role="progressbar"
            aria-valuenow={planCompletionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress aktivitas hari ini"
          >
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${planCompletionPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-cream/60 p-3">
              <p className="text-[11px] text-brown-700/60">Selesai</p>
              <p className="text-lg font-extrabold text-brown-900 mt-1">
                {completedPlanPoints}
              </p>
              <p className="text-[10px] text-brown-700/60">Zyba Points</p>
            </div>
            <div className="rounded-2xl bg-cream/60 p-3">
              <p className="text-[11px] text-brown-700/60">Tersisa</p>
              <p className="text-lg font-extrabold text-brown-900 mt-1">
                {remainingActivities}
              </p>
              <p className="text-[10px] text-brown-700/60">aktivitas</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          MODAL
      ========================== */}
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