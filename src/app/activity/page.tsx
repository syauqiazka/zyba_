"use client";

import { useState, useEffect } from "react";
import ActivityBanner from "./components/ActivityBanner";
import ActivityTracker from "./components/ActivityTracker";
import AddActivityModal, {
  type NewActivity,
} from "./components/AddActivityModal";
import BreathingExercise from "./components/BreathingExercise";
import CompletionModal from "./components/CompletionModal";
import DailyConditionCard from "./components/DailyConditionCard";
import DailyPlan, {
  type PlannedActivity,
} from "./components/DailyPlan";
import ZybaRecommendations, {
  type Recommendation,
} from "./components/ZybaRecommendations";

const PLAN_STORAGE_KEY = "zyba_daily_plan_v2";

const INITIAL_PLAN: PlannedActivity[] = [
  {
    id: "walk-08",
    time: "08:00",
    title: "Jalan Santai",
    duration: "15 min",
    icon: "🚶",
    category: "Aktivitas Ringan",
    points: 60,
    completed: true,
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
  const [activeTab, setActiveTab] = useState<
    "WALKING" | "RUNNING" | "WORKOUT"
  >("WALKING");

  const [activityProgress, setActivityProgress] = useState(850);

  const targetProgress = 1200;

  const [isCompleted, setIsCompleted] = useState(false);
  const [conditionData, setConditionData] = useState<any>(null);
  const [activityToast, setActivityToast] = useState<string | null>(null);

  // =========================
  // Daily Planner State & Persistence
  // =========================
  const [plan, setPlan] = useState<PlannedActivity[]>(INITIAL_PLAN);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch real condition & activity logs from DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/activity");
        if (res.ok) {
          const data = await res.json();
          if (data.condition) {
            setConditionData(data.condition);
          }
          if (typeof data.totalPointsEarned === "number" && data.totalPointsEarned > 0) {
            setActivityProgress((prev) => Math.max(prev, data.totalPointsEarned));
          }
        }
      } catch (err) {
        console.warn("[ActivityPage] Failed to fetch activity data:", err);
      }
    }
    loadData();
  }, []);

  // Load plan from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
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
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(newPlan));
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

      setActivityProgress((prev) => Math.min(prev + 30, targetProgress));
      setActivityToast("🎉 Sesi Zyba Hours selesai! +30 Zyba Points tersimpan!");
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
  // Activity Progress & DB Persistence
  // =========================
  const handleAddProgress = async () => {
    const nextProgress = Math.min(
      activityProgress + 150,
      targetProgress,
    );

    setActivityProgress(nextProgress);

    // Save to real database
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          durationMin: activeTab === "RUNNING" ? 20 : 15,
          distanceMeter: activeTab === "RUNNING" ? 2500 : 1000,
          points: 150,
          completed: true,
          title: `Sesi ${activeTab.toLowerCase()}`,
        }),
      });
      setActivityToast(`✓ Sesi ${activeTab.toLowerCase()} tersimpan ke database & terhubung ke Wellness Journey!`);
      setTimeout(() => setActivityToast(null), 3500);
    } catch (e) {
      console.warn("Save progress error:", e);
    }

    if (
      activityProgress < targetProgress &&
      nextProgress >= targetProgress
    ) {
      setIsCompleted(true);
    }
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

    setActivityProgress((current) =>
      Math.min(
        Math.max(
          current +
            (nextCompleted
              ? selectedActivity.points
              : -selectedActivity.points),
          0,
        ),
        targetProgress,
      ),
    );

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
        setTimeout(() => setActivityToast(null), 3000);
      } catch (e) {
        console.warn("Save toggle activity error:", e);
      }
    }

    if (
      nextCompleted &&
      activityProgress + selectedActivity.points >= targetProgress
    ) {
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
    const activityToRemove = plan.find((a) => a.id === id);
    if (!activityToRemove) return;

    if (activityToRemove.completed) {
      setActivityProgress((current) =>
        Math.max(current - activityToRemove.points, 0)
      );
    }

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
          ACTIVITY TRACKER
      ========================== */}
      <ActivityTracker
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activityProgress={activityProgress}
        targetProgress={targetProgress}
        onAddProgress={handleAddProgress}
      />

      {/* =========================
          BREATHING + SUMMARY
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

        <div className="xl:col-span-4 glass-card rounded-3xl p-6 border border-brown-900/10 bg-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-500">
              Ringkasan Hari Ini
            </span>

            <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-2">
              {completedActivities}/{plan.length}
            </h2>

            <p className="text-xs font-bold text-brown-700 mt-1">
              aktivitas selesai
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brown-700">
                  Zyba Points
                </span>

                <span className="text-xs font-bold text-orange-500">
                  {activityProgress} / {targetProgress}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (activityProgress / targetProgress) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-brown-700 mt-5 leading-relaxed">
              Selesaikan aktivitas kecil sepanjang hari agar target
              terasa lebih ringan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 w-full rounded-full bg-brown-900 text-white py-3 text-xs font-bold hover:bg-green-500 transition-colors"
          >
            + Tambah Aktivitas
          </button>
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