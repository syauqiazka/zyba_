"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Heart,
  Feather,
  Wind,
  Footprints,
  Dumbbell,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import ProgressOverview, { ProgressMetricData } from "./components/ProgressOverview";
import WellnessTrendChart, { TrendPoint } from "./components/WellnessTrendChart";
import WellnessAreas, { WellnessDomain } from "./components/WellnessAreas";
import WhatChanged, { ChangeObservation } from "./components/WhatChanged";
import HabitsHistory, { HabitCountItem } from "./components/HabitsHistory";
import JourneyEmptyState from "./components/JourneyEmptyState";
import {
  OverviewSkeleton,
  TrendSkeleton,
  AreasSkeleton,
  HabitsSkeleton,
} from "./components/JourneySkeleton";

import { calculateDailyZybaScore } from "@/lib/assessmentMetrics";
import { useFreshData } from "@/hooks/useFreshData";

type TimeRangeDays = 7 | 30 | 90;

const TIME_RANGES: { days: TimeRangeDays; label: string }[] = [
  { days: 7, label: "7 Hari" },
  { days: 30, label: "30 Hari" },
  { days: 90, label: "90 Hari" },
];

const MOOD_SCORES: Record<string, number> = {
  OVERJOYED: 95,
  HAPPY: 80,
  NEUTRAL: 60,
  SAD: 40,
  DEPRESSED: 20,
};

function parseRecordDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(`${dateStr}T12:00:00Z`);
  }
  const d = new Date(dateStr);
  return Number.isFinite(d.getTime()) ? d : null;
}

function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function WellnessJourneyPage() {
  const [timeRange, setTimeRange] = useState<TimeRangeDays>(7);

  // Raw API data
  const [userData, setUserData] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any>(null);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchJourneyData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const [userRes, assessmentRes, activityRes, journalRes] = await Promise.all([
        fetch("/api/user/me", { cache: "no-store" }).catch(() => null),
        fetch("/api/daily-assessment?limit=90&page=1&includeTotal=false", { cache: "no-store", credentials: "include" }).catch(() => null),
        fetch("/api/activity?days=90", { cache: "no-store", credentials: "include" }).catch(() => null),
        fetch("/api/journal", { cache: "no-store", credentials: "include" }).catch(() => null),
      ]);

      if (userRes && userRes.ok) {
        const u = await userRes.json();
        setUserData(u);
      }

      if (assessmentRes && assessmentRes.ok) {
        const a = await assessmentRes.json();
        setAssessmentHistory(Array.isArray(a.history) ? a.history : []);
      }

      if (activityRes && activityRes.ok) {
        const act = await activityRes.json();
        setActivityData(act);
      }

      if (journalRes && journalRes.ok) {
        const j = await journalRes.json();
        setJournalEntries(Array.isArray(j.entries) ? j.entries : []);
      }
    } catch (err) {
      console.error("[WellnessJourney] Error fetching data:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchJourneyData();
  }, [fetchJourneyData]);

  useFreshData(fetchJourneyData);

  // =========================================================================
  // PERIOD PROCESSING: Current period vs Previous period
  // =========================================================================
  const {
    currentRecords,
    previousRecords,
    hasAnyData,
    trendPoints,
    progressData,
    domains,
    observations,
    habits,
  } = useMemo(() => {
    const now = new Date();
    const currentCutoff = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);
    const previousCutoff = new Date(now.getTime() - timeRange * 2 * 24 * 60 * 60 * 1000);

    // Filter by timestamp/date
    const current: any[] = [];
    const previous: any[] = [];

    assessmentHistory.forEach((item) => {
      const date = parseRecordDate(item.date || item.createdAt);
      if (!date) return;

      if (date >= currentCutoff) {
        current.push(item);
      } else if (date >= previousCutoff && date < currentCutoff) {
        previous.push(item);
      }
    });

    // Helper: calculate average score of a list
    const calcAvgScore = (list: any[]) => {
      const valid = list
        .map((r) => r.calculatedScore ?? calculateDailyZybaScore(r))
        .filter((s): s is number => s !== null && s !== undefined);
      if (valid.length === 0) return null;
      return valid.reduce((acc, v) => acc + v, 0) / valid.length;
    };

    // Helper: calculate average stress (1-5)
    const calcAvgStress = (list: any[]) => {
      const valid = list
        .map((r) => r.stressLevel)
        .filter((s): s is number => s !== null && s !== undefined);
      if (valid.length === 0) return null;
      return valid.reduce((acc, v) => acc + v, 0) / valid.length;
    };

    // Helper: calculate average sleep rating (1-5)
    const calcAvgSleep = (list: any[]) => {
      const valid = list
        .map((r) => r.sleepRating)
        .filter((s): s is number => s !== null && s !== undefined);
      if (valid.length === 0) return null;
      return valid.reduce((acc, v) => acc + v, 0) / valid.length;
    };

    // Helper: calculate average mood score (0-100)
    const calcAvgMood = (list: any[]) => {
      const valid = list
        .map((r) => (r.mood ? MOOD_SCORES[String(r.mood).toUpperCase()] : null))
        .filter((s): s is number => s !== null && s !== undefined);
      if (valid.length === 0) return null;
      return valid.reduce((acc, v) => acc + v, 0) / valid.length;
    };

    const currentAvgScore = calcAvgScore(current) ?? (userData?.stats?.zybaScore ?? null);
    const prevAvgScore = calcAvgScore(previous);
    const scoreDiff =
      currentAvgScore !== null && prevAvgScore !== null
        ? currentAvgScore - prevAvgScore
        : null;

    const currentAvgStress = calcAvgStress(current) ?? (userData?.stats?.stressLevel ?? null);
    const prevAvgStress = calcAvgStress(previous);
    const stressDiff =
      currentAvgStress !== null && prevAvgStress !== null
        ? currentAvgStress - prevAvgStress
        : null;

    const currentAvgSleep = calcAvgSleep(current);
    const prevAvgSleep = calcAvgSleep(previous);
    const sleepDiff =
      currentAvgSleep !== null && prevAvgSleep !== null
        ? currentAvgSleep - prevAvgSleep
        : null;

    // Condition label based on score
    const getCondition = (s: number | null) => {
      if (s === null) return "Belum Dinilai";
      if (s >= 80) return "Kondisi Prima";
      if (s >= 65) return "Kondisi Stabil";
      if (s >= 50) return "Cukup Baik";
      return "Perlu Perhatian";
    };

    const getStressLabel = (st: number | null) => {
      if (st === null) return "Belum Ada Data";
      if (st <= 1.8) return "Sangat Rendah (Tenang)";
      if (st <= 2.8) return "Rendah Terkendali";
      if (st <= 3.8) return "Tingkat Sedang";
      return "Perlu Relaksasi";
    };

    const getRecoveryLabel = (sl: number | null) => {
      if (sl === null) return "Belum Ada Data";
      if (sl >= 4.2) return "Sangat Nyenyak & Bugar";
      if (sl >= 3.2) return "Cukup Terjaga";
      return "Perlu Istirahat Ekstra";
    };

    const timeRangeLabel = `${timeRange} Hari`;

    const progress: ProgressMetricData = {
      zybaScore: {
        current: currentAvgScore,
        previous: prevAvgScore,
        diff: scoreDiff,
        condition: getCondition(currentAvgScore),
      },
      stress: {
        current: currentAvgStress,
        previous: prevAvgStress,
        diff: stressDiff,
        label: getStressLabel(currentAvgStress),
      },
      recovery: {
        current: currentAvgSleep,
        previous: prevAvgSleep,
        diff: sleepDiff,
        label: getRecoveryLabel(currentAvgSleep),
      },
      streak: userData?.stats?.streak ?? (userData?.user?.streakDays ?? 0),
      timeRangeLabel,
    };

    // -----------------------------------------------------------------------
    // Trend points: chronological for current period
    // -----------------------------------------------------------------------
    const sortedCurrent = [...current].sort((a, b) => {
      const da = parseRecordDate(a.date || a.createdAt)?.getTime() || 0;
      const db = parseRecordDate(b.date || b.createdAt)?.getTime() || 0;
      return da - db;
    });

    const points: TrendPoint[] = sortedCurrent.map((r) => {
      const dateStr = r.date || r.createdAt?.slice(0, 10) || "";
      const rawScore = r.calculatedScore ?? calculateDailyZybaScore(r);
      return {
        date: dateStr,
        label: formatShortDate(dateStr),
        score: rawScore !== null ? Math.round(rawScore) : null,
        stress: r.stressLevel !== null && r.stressLevel !== undefined ? Number(r.stressLevel) : null,
        sleep: r.sleepRating !== null && r.sleepRating !== undefined ? Number(r.sleepRating) : null,
        mood: r.mood || null,
      };
    });

    // -----------------------------------------------------------------------
    // Wellness Areas (Mental Reset 360) based purely on real data
    // -----------------------------------------------------------------------
    const currentMoodScore = calcAvgMood(current);
    const prevMoodScore = calcAvgMood(previous);

    // Stress regulation: Level 1 = 100%, Level 5 = 20%
    const currentStressReg = currentAvgStress !== null ? Math.round(((5 - (currentAvgStress - 1)) / 4) * 100) : null;
    const prevStressReg = prevAvgStress !== null ? Math.round(((5 - (prevAvgStress - 1)) / 4) * 100) : null;

    // Recovery score: Level 1 = 20%, Level 5 = 100%
    const currentRecovScore = currentAvgSleep !== null ? Math.round(((currentAvgSleep - 1) / 4) * 100) : null;
    const prevRecovScore = prevAvgSleep !== null ? Math.round(((prevAvgSleep - 1) / 4) * 100) : null;

    // Self understanding: percentage of check-ins with reflection text
    const currentReflectionCount = current.filter((r) => r.reflection && r.reflection.trim().length > 0).length;
    const prevReflectionCount = previous.filter((r) => r.reflection && r.reflection.trim().length > 0).length;

    const currentSelfScore = current.length > 0 ? Math.round((currentReflectionCount / current.length) * 100) : null;
    const prevSelfScore = previous.length > 0 ? Math.round((prevReflectionCount / previous.length) * 100) : null;

    const domainList: WellnessDomain[] = [
      {
        id: "mental-wellbeing",
        name: "Mental Wellbeing",
        description: "Keseimbangan emosi & suasana hati harian",
        score: currentMoodScore,
        previousScore: prevMoodScore,
        icon: Heart,
        barColor: "bg-[#8FAE5D]",
      },
      {
        id: "stress-regulation",
        name: "Stress Regulation",
        description: "Resiliensi dan pengelolaan tekanan harian",
        score: currentStressReg,
        previousScore: prevStressReg,
        icon: ShieldCheck,
        barColor: "bg-[#456882]",
      },
      {
        id: "recovery-balance",
        name: "Life Balance & Recovery",
        description: "Kualitas istirahat malam dan ritme pemulihan",
        score: currentRecovScore,
        previousScore: prevRecovScore,
        icon: Sparkles,
        barColor: "bg-[#F2884B]",
      },
      {
        id: "self-understanding",
        name: "Self-Understanding",
        description: "Konsistensi mencatat refleksi dan kesadaran diri",
        score: currentSelfScore,
        previousScore: prevSelfScore,
        icon: Feather,
        barColor: "bg-[#8B5CF6]",
      },
    ];

    // -----------------------------------------------------------------------
    // What Changed: Non-clinical observational observations
    // -----------------------------------------------------------------------
    const obsList: ChangeObservation[] = [];

    // Observation 1: Mood
    if (currentMoodScore !== null && prevMoodScore !== null) {
      const moodDelta = currentMoodScore - prevMoodScore;
      if (moodDelta >= 5) {
        obsList.push({
          category: "Mood",
          direction: "up",
          isPositive: true,
          title: "Mood Lebih Positif",
          description: `Rata-rata suasana hatimu meningkat ${Math.round(moodDelta)} poin dibanding ${timeRangeLabel} sebelumnya.`,
        });
      } else if (moodDelta <= -5) {
        obsList.push({
          category: "Mood",
          direction: "down",
          isPositive: false,
          title: "Fluktuasi Suasana Hati",
          description: `Rata-rata suasana hati tercatat lebih rendah dibanding periode lalu. Ambil jeda sejenak untuk memulihkan energi emosional.`,
        });
      } else {
        obsList.push({
          category: "Mood",
          direction: "neutral",
          isPositive: true,
          title: "Keseimbangan Mood Terjaga",
          description: `Suasana hatimu berada dalam rentang yang stabil dan seimbang di ${timeRangeLabel} terakhir.`,
        });
      }
    }

    // Observation 2: Stress
    if (currentAvgStress !== null && prevAvgStress !== null) {
      const stDiff = currentAvgStress - prevAvgStress;
      if (stDiff <= -0.25) {
        obsList.push({
          category: "Stres",
          direction: "down",
          isPositive: true,
          title: "Tingkat Stres Mereda",
          description: `Rata-rata level stres menurun sebesar ${Math.abs(stDiff).toFixed(1)} poin dibanding periode sebelumnya.`,
        });
      } else if (stDiff >= 0.25) {
        obsList.push({
          category: "Stres",
          direction: "up",
          isPositive: false,
          title: "Tekanan Sedikit Meningkat",
          description: `Level stres terpantau lebih tinggi ${stDiff.toFixed(1)} poin. Pertimbangkan sesi pernapasan Zyba Hours untuk meredakan ketegangan.`,
        });
      } else {
        obsList.push({
          category: "Stres",
          direction: "neutral",
          isPositive: true,
          title: "Tingkat Stres Terkendali",
          description: `Pengelolaan stresmu stabil tanpa lonjakan signifikan sepanjang ${timeRangeLabel} terakhir.`,
        });
      }
    }

    // Observation 3: Sleep & Recovery
    if (currentAvgSleep !== null && prevAvgSleep !== null) {
      const slDiff = currentAvgSleep - prevAvgSleep;
      if (slDiff >= 0.3) {
        obsList.push({
          category: "Istirahat",
          direction: "up",
          isPositive: true,
          title: "Peningkatan Kualitas Istirahat",
          description: `Rating tidur malammu rata-rata naik ${slDiff.toFixed(1)} poin. Pola tidur teratur membawa dampak baik pada energimu.`,
        });
      } else if (slDiff <= -0.3) {
        obsList.push({
          category: "Istirahat",
          direction: "down",
          isPositive: false,
          title: "Kualitas Istirahat Berkurang",
          description: `Kualitas tidur tercatat turun ${Math.abs(slDiff).toFixed(1)} poin. Mengurangi waktu layar sebelum tidur dapat membantu tidur lebih lelap.`,
        });
      } else {
        obsList.push({
          category: "Istirahat",
          direction: "neutral",
          isPositive: true,
          title: "Ritme Istirahat Konsisten",
          description: `Kualitas tidur malammu terpantau stabil pada level ${currentAvgSleep.toFixed(1)} / 5.0.`,
        });
      }
    }

    // Observation 4: Consistency
    if (current.length > 0) {
      obsList.push({
        category: "Konsistensi",
        direction: "neutral",
        isPositive: true,
        title: "Komitmen Check-In",
        description: `Kamu telah menyelesaikan ${current.length} kali Check-In Harian dalam ${timeRangeLabel} terakhir.`,
      });
    }

    // -----------------------------------------------------------------------
    // Habits / Activity History from DB
    // -----------------------------------------------------------------------
    const habitStats = activityData?.habitStats;

    // Filter journal entries within current period
    const currentJournalCount = journalEntries.filter((j) => {
      const d = parseRecordDate(j.createdAt);
      return d && d >= currentCutoff;
    }).length;

    const habitList: HabitCountItem[] = [
      {
        id: "checkins",
        label: "Check-In Harian",
        count: current.length,
        unit: "sesi tercatat",
        icon: CheckCircle2,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
      {
        id: "breathing",
        label: "Sesi Relaksasi",
        count: habitStats?.breathingCount ?? 0,
        unit: "latihan pernapasan",
        icon: Wind,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        id: "walking",
        label: "Jalan Santai",
        count: habitStats?.walkingCount ?? 0,
        unit: "sesi berjalan",
        icon: Footprints,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        id: "workout",
        label: "Latihan Fisik",
        count: (habitStats?.workoutCount ?? 0) + (habitStats?.runningCount ?? 0),
        unit: "latihan gerak",
        icon: Dumbbell,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },
      {
        id: "reflections",
        label: "Refleksi & Jurnal",
        count: currentReflectionCount + currentJournalCount,
        unit: "catatan refleksi",
        icon: BookOpen,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
    ];

    return {
      currentRecords: current,
      previousRecords: previous,
      hasAnyData:
        current.length > 0 ||
        previous.length > 0 ||
        Boolean(
          activityData?.habitStats?.totalCompleted > 0 ||
          currentJournalCount > 0
        ) ||
        Boolean(userData?.stats?.hasAssessment),
      trendPoints: points,
      progressData: progress,
      domains: domainList,
      observations: obsList,
      habits: habitList,
    };
  }, [assessmentHistory, timeRange, userData, activityData, journalEntries]);

  return (
    <div className="flex flex-col gap-6 max-w-[1240px] mx-auto pb-16">
      {/* 1. COMPACT EDITORIAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brown-900/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-500/20">
              Evaluasi Perkembangan
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight">
            Wellness Journey
          </h1>
          <p className="text-xs sm:text-sm text-brown-700 mt-1 max-w-xl">
            Lihat bagaimana kondisi, kestabilan emosi, dan kebiasaanmu berkembang dari waktu ke waktu.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 bg-cream/80 rounded-2xl border border-brown-900/10 self-start sm:self-auto shadow-2xs">
          {TIME_RANGES.map((r) => {
            const isSelected = timeRange === r.days;
            return (
              <button
                key={r.days}
                type="button"
                onClick={() => setTimeRange(r.days)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brown-900 text-white shadow-xs"
                    : "text-brown-700 hover:text-brown-900"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ERROR STATE */}
      {hasError && (
        <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 flex items-center justify-between gap-3 text-red-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>Terjadi kendala saat memuat sebagian data riwayat.</span>
          </div>
          <button
            type="button"
            onClick={fetchJourneyData}
            className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <OverviewSkeleton />
          <TrendSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <AreasSkeleton />
            </div>
            <div className="lg:col-span-5">
              <HabitsSkeleton />
            </div>
          </div>
        </div>
      ) : !hasAnyData ? (
        /* EMPTY STATE: 0 check-ins ever */
        <JourneyEmptyState />
      ) : (
        /* CONTENT: STRICT MOBILE & DESKTOP SEQUENCE */
        <div className="flex flex-col gap-6">
          {/* 2. PROGRESS OVERVIEW */}
          {progressData && <ProgressOverview data={progressData} />}

          {/* 3. WELLNESS TREND CHART */}
          <WellnessTrendChart points={trendPoints} />

          {/* 4. WELLNESS AREAS & WHAT CHANGED (2-column on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <WellnessAreas domains={domains} timeRangeLabel={`${timeRange} Hari`} />
            </div>
            <div className="lg:col-span-5">
              <WhatChanged
                observations={observations}
                hasEnoughData={currentRecords.length >= 1}
                timeRangeLabel={`${timeRange} Hari`}
              />
            </div>
          </div>

          {/* 5. HABITS / ACTIVITY HISTORY */}
          <HabitsHistory habits={habits} timeRangeLabel={`${timeRange} Hari`} />
        </div>
      )}
    </div>
  );
}
