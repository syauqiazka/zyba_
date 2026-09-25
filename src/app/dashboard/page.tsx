"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";

interface UserData {
  name: string;
  avatarUrl?: string;

  zybaScore: number | null;
  condition: string;

  stressLevel: number | null;
  stressLabel: string;

  streak: number;
  hasAssessment: boolean;

  conversationCount: number;
}

const EMPTY_USER: UserData = {
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

export default function DashboardPage() {
  const [userData, setUserData] =
    useState<UserData>(EMPTY_USER);

  const [trackerState, setTrackerState] = useState<{
    [key: string]: boolean;
  }>({
    "Zyba Hours (Breathing)": false,
    "Health Journal Entry": false,
    "Daily Resource Reading": false,
    "Mental Journal Reflection": false,
    "Community Activity": false,
  });

  const [todayFormatted, setTodayFormatted] =
    useState("");

  /* =====================================================
     LOAD USER DATA
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/user/me", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(
            `Request gagal: ${res.status}`,
          );
        }

        const data = await res.json();

        if (!data.success) {
          throw new Error(
            data.error ||
            "Gagal mengambil data user",
          );
        }

        if (cancelled) return;

        const stats = data.stats ?? {};

        /*
         * API /api/user/me sekarang menjadi sumber
         * data profil + status assessment terbaru.
         */
        const hasAssessment =
          Boolean(stats.hasAssessment);

        const nextUserData: UserData = {
          name:
            data.user?.name ||
            "Pengguna ZYBA",

          avatarUrl:
            data.user?.avatarUrl ||
            "🦊",

          zybaScore:
            stats.zybaScore ??
            null,

          condition:
            stats.condition ||
            "Belum Dinilai",

          stressLevel:
            stats.stressLevel ??
            null,

          stressLabel:
            stats.stressLabel ||
            "Belum Ada Data",

          streak:
            hasAssessment
              ? Math.max(
                1,
                Number(stats.streak || 1),
              )
              : 0,

          hasAssessment,

          conversationCount:
            Number(
              stats.conversationCount || 0,
            ),
        };

        setUserData(nextUserData);

        /*
         * Cache untuk render cepat saat user kembali
         * membuka Dashboard.
         */
        try {
          localStorage.setItem(
            "zyba_user_cache",
            JSON.stringify({
              name:
                data.user?.name ||
                "Pengguna ZYBA",

              email:
                data.user?.email,

              avatarUrl:
                data.user?.avatarUrl ||
                "🦊",

              stats,
            }),
          );
        } catch {
          // Abaikan error localStorage
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error,
        );
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     LOAD TRACKER
  ===================================================== */

  useEffect(() => {
    try {
      const todayKey =
        `zyba_trackers_${getDateKey(
          new Date(),
        )}`;

      const saved =
        localStorage.getItem(
          todayKey,
        );

      if (!saved) return;

      const parsed =
        JSON.parse(saved);

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        setTrackerState(parsed);
      }
    } catch {
      // Abaikan error localStorage
    }
  }, []);

  /* =====================================================
     DATE
  ===================================================== */

  useEffect(() => {
    setTodayFormatted(
      new Intl.DateTimeFormat(
        "id-ID",
        {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      ).format(new Date()),
    );
  }, []);

  /* =====================================================
     TRACKER
  ===================================================== */

  const completedCount =
    Object.values(
      trackerState,
    ).filter(Boolean).length;

  const totalTrackers =
    Object.keys(
      trackerState,
    ).length;

  const toggleTracker = (
    key: string,
  ) => {
    setTrackerState((prev) => {
      const nextState = {
        ...prev,
        [key]: !prev[key],
      };

      try {
        const todayKey =
          `zyba_trackers_${getDateKey(
            new Date(),
          )}`;

        localStorage.setItem(
          todayKey,
          JSON.stringify(
            nextState,
          ),
        );
      } catch {
        // Abaikan error localStorage
      }

      return nextState;
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-12 min-h-0">

      {/* =================================================
          TOP BANNER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 shadow-sm">

        <div>
          <div className="flex items-center gap-2 mb-1">

            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${userData.hasAssessment
                  ? "bg-orange-100 text-orange-500"
                  : "bg-green-100 text-green-500"
                }`}
            >
              {userData.hasAssessment
                ? "Welcome back"
                : "Selamat Datang"}
            </span>

            <span
              className="text-xs text-brown-700"
              suppressHydrationWarning
            >
              | {todayFormatted}
            </span>
          </div>

          <h1 className="font-display text-3xl font-extrabold text-brown-900">
            Hi, {userData.name}! 👋
          </h1>

          {!userData.hasAssessment && (
            <div className="mt-3">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 hover:bg-brown-900 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <span>
                  Mulai Asesmen Awal
                </span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          title="Pengaturan akun"
        >
          <div className="flex flex-col items-end">

            <span className="text-xs font-bold text-brown-900">
              {userData.hasAssessment
                ? "Daily Streak"
                : "Status Pengguna"}
            </span>

            <span className="text-xs text-brown-700">
              {userData.hasAssessment
                ? `${userData.streak}/365 Hari Aktif`
                : "Baru Bergabung"}
            </span>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl text-white font-display font-extrabold flex items-center justify-center text-xl shadow-lg ${userData.hasAssessment
                ? "bg-orange-500 shadow-orange-500/20"
                : "bg-green-500 shadow-green-500/20"
              }`}
          >
            {userData.hasAssessment
              ? `🔥 ${userData.streak}`
              : "🌱"}
          </div>
        </Link>
      </div>

      {/* =================================================
          METRICS
      ================================================= */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <MetricScoreCard
          score={
            userData.zybaScore
          }
          condition={
            userData.condition
          }
          hasAssessment={
            userData.hasAssessment
          }
        />

        {/*
          StressLevelChart sekarang mengambil
          histori langsung dari /api/daily-assessment.
          
          Tidak perlu lagi:
          weeklyData
          average
          stressLabel
          buildWeeklyStress()
        */}
        <StressLevelChart />

        <CompanionWidget
          conversationCount={
            userData.conversationCount
          }
        />
      </section>

      {/* =================================================
          TRACKER
      ================================================= */}

      <TrackerChecklist
        trackerState={
          trackerState
        }
        completedCount={
          completedCount
        }
        totalTrackers={
          totalTrackers
        }
        toggleTracker={
          toggleTracker
        }
      />

      {/* =================================================
          QUICK ACCESS
      ================================================= */}

      <QuickAccessCards />
    </div>
  );
}

/* =====================================================
   DATE HELPER
   ===================================================== */

function getDateKey(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  ).format(date);
}