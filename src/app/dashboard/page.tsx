"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";

export default function DashboardPage() {
  const [userData, setUserData] = useState<{
    name: string;
    avatarUrl?: string;
    zybaScore: number | null;
    condition: string;
    stressLevel: number | null;
    stressLabel: string;
    streak: number;
    hasAssessment: boolean;
    conversationCount: number;
  }>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          return {
            name: parsed.name || "Pengguna ZYBA",
            avatarUrl: parsed.avatarUrl || "🦊",
            zybaScore: parsed.stats?.zybaScore ?? null,
            condition: parsed.stats?.condition || "Belum Dinilai",
            stressLevel: parsed.stats?.stressLevel ?? null,
            stressLabel: parsed.stats?.stressLabel || "Belum Ada Data",
            streak: parsed.stats?.hasAssessment ? Math.max(1, parsed.stats?.streak || 1) : 0,
            hasAssessment: Boolean(parsed.stats?.hasAssessment),
            conversationCount: parsed.stats?.conversationCount ?? 0,
          };
        }
      } catch {}
    }
    return {
      name: "Pengguna ZYBA",
      avatarUrl: "🦊",
      zybaScore: null,
      condition: "Belum Dinilai",
      stressLevel: null,
      stressLabel: "Belum Ada Data",
      streak: 0,
      hasAssessment: false,
      conversationCount: 0,
    };
  });

  const [trackerState, setTrackerState] = useState<{ [key: string]: boolean }>({
    "Zyba Hours (Breathing)": false,
    "Mood Quality Check": false,
    "Health Journal Entry": false,
    "Daily Resource Reading": false,
    "Mental Journal Reflection": false,
    "Community Activity": false,
  });

  // Load tracker state from localStorage if exists
  useEffect(() => {
    try {
      const todayKey = `zyba_trackers_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        setTrackerState(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.stats) {
            const nextData = {
              name: data.user.name || "Pengguna ZYBA",
              avatarUrl: data.user.avatarUrl || "🦊",
              zybaScore: data.stats.zybaScore ?? null,
              condition: data.stats.condition || "Belum Dinilai",
              stressLevel: data.stats.stressLevel ?? null,
              stressLabel: data.stats.stressLabel || "Belum Ada Data",
              streak: data.stats.hasAssessment ? Math.max(1, data.stats.streak || 1) : 0,
              hasAssessment: Boolean(data.stats.hasAssessment),
              conversationCount: data.stats.conversationCount ?? 0,
            };
            setUserData(nextData);
            try {
              localStorage.setItem("zyba_user_cache", JSON.stringify({
                name: data.user.name,
                email: data.user.email,
                avatarUrl: data.user.avatarUrl,
                stats: data.stats,
              }));
            } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    }

    fetchUserProfile();
  }, []);

  const completedCount = Object.values(trackerState).filter(Boolean).length;
  const totalTrackers = Object.keys(trackerState).length;

  const toggleTracker = (key: string) => {
    setTrackerState((prev) => {
      const nextState = { ...prev, [key]: !prev[key] };
      try {
        const todayKey = `zyba_trackers_${new Date().toISOString().slice(0, 10)}`;
        localStorage.setItem(todayKey, JSON.stringify(nextState));
      } catch {
        // Ignore localStorage write error
      }
      return nextState;
    });
  };

  // Format tanggal saat ini secara dinamis dalam Bahasa Indonesia
  const [todayFormatted, setTodayFormatted] = useState("");

  useEffect(() => {
    setTodayFormatted(new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date()));
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12 min-h-0">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                userData.hasAssessment
                  ? "bg-orange-100 text-orange-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {userData.hasAssessment ? "Welcome back" : "Selamat Datang"}
            </span>
            <span className="text-xs text-brown-700" suppressHydrationWarning>| {todayFormatted}</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Hi, {userData.name}! 👋
          </h1>
          <p className="text-brown-700 text-sm mt-1 max-w-xl">
            {userData.hasAssessment
              ? `Kondisi mentalmu berada di level ${userData.condition.toLowerCase()}. Luangkan 5 menit untuk relaksasi dan check-in mood hari ini.`
              : "Selamat datang di ZYBA! Kamu belum mengisi asesmen awal. Luangkan 3 menit untuk mengetahui Zyba Score dan program wellness personalmu."}
          </p>
          {!userData.hasAssessment && (
            <div className="mt-3">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 hover:bg-brown-900 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <span>Mulai Asesmen Awal</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity" title="Pengaturan akun">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-brown-900">
              {userData.hasAssessment ? "Daily Streak" : "Status Pengguna"}
            </span>
            <span className="text-xs text-brown-700">
              {userData.hasAssessment
                ? `${userData.streak}/365 Hari Aktif`
                : "Baru Bergabung"}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl text-white font-display font-extrabold flex items-center justify-center text-xl shadow-lg ${
              userData.hasAssessment
                ? "bg-orange-500 shadow-orange-500/20"
                : "bg-green-500 shadow-green-500/20"
            }`}
          >
            {userData.hasAssessment ? `🔥 ${userData.streak}` : "🌱"}
          </div>
        </Link>
      </div>

      {/* Grid Overview Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricScoreCard
          score={userData.zybaScore}
          condition={userData.condition}
          hasAssessment={userData.hasAssessment}
        />
        <StressLevelChart
          stressLevel={userData.stressLevel}
          stressLabel={userData.stressLabel}
        />
        <CompanionWidget conversationCount={userData.conversationCount} />
      </section>

      <TrackerChecklist
        trackerState={trackerState}
        completedCount={completedCount}
        totalTrackers={totalTrackers}
        toggleTracker={toggleTracker}
      />

      <QuickAccessCards />
    </div>
  );
}
