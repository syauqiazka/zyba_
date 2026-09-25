"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";

import {
  getLatestZybaScore,
  type AssessmentMetric,
  type DailyAssessment,
} from "@/lib/assessmentMetrics";

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

function getJakartaDateKey(
  date = new Date()
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(date);
}

function getAssessmentTime(
  item: DailyAssessment
) {
  if (item.createdAt) {
    const time =
      new Date(
        item.createdAt
      ).getTime();

    if (Number.isFinite(time)) {
      return time;
    }
  }

  if (item.date) {
    const time =
      new Date(
        `${item.date}T00:00:00+07:00`
      ).getTime();

    if (Number.isFinite(time)) {
      return time;
    }
  }

  return 0;
}

export default function DashboardPage() {
  const [userData, setUserData] =
    useState<UserData>(
      EMPTY_USER
    );

  const [trackerState, setTrackerState] =
    useState<
      Record<string, boolean>
    >({
      "Zyba Hours (Breathing)": false,
      "Health Journal Entry": false,
      "Daily Resource Reading": false,
      "Mental Journal Reflection": false,
      "Community Activity": false,
    });

  const [todayFormatted, setTodayFormatted] =
    useState("");

  /*
   * =====================================================
   * LOAD DASHBOARD
   * =====================================================
   */
  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        /*
         * User + Daily Assessment
         * diambil bersamaan.
         */
        const [
          userResponse,
          assessmentResponse,
        ] = await Promise.all([
          fetch(
            "/api/user/me",
            {
              method: "GET",
              cache: "no-store",
            }
          ),

          fetch(
            "/api/daily-assessment?limit=100&page=1",
            {
              method: "GET",
              cache: "no-store",
            }
          ),
        ]);

        if (
          !userResponse.ok
        ) {
          throw new Error(
            `User API gagal: ${userResponse.status}`
          );
        }

        if (
          !assessmentResponse.ok
        ) {
          throw new Error(
            `Daily Assessment API gagal: ${assessmentResponse.status}`
          );
        }

        const userData =
          await userResponse.json();

        const assessmentData =
          await assessmentResponse.json();

        if (
          !userData.success
        ) {
          throw new Error(
            userData.error ||
            "Gagal mengambil data user"
          );
        }

        if (cancelled) {
          return;
        }

        const user =
          userData.user ?? {};

        const stats =
          userData.stats ?? {};

        /*
         * =====================================================
         * DAILY ASSESSMENT
         * =====================================================
         */
        const history: DailyAssessment[] =
          Array.isArray(
            assessmentData.history
          )
            ? assessmentData.history
            : [];

        /*
         * =====================================================
         * ASSESSMENT SOURCE
         * =====================================================
         */
        const isNewAccount =
          Boolean(
            userData.isNewAccount ??
            stats.isNewAccount ??
            false
          );

        const initialAssessment =
          (userData.initialAssessment ??
            userData.assessment ??
            stats.initialAssessment ??
            null) as
          | AssessmentMetric
          | null;

        /*
         * =====================================================
         * DAILY ASSESSMENT TERBARU
         * =====================================================
         */
        const sortedHistory =
          [...history].sort(
            (a, b) =>
              getAssessmentTime(b) -
              getAssessmentTime(a)
          );

        const latestDaily =
          sortedHistory[0] ??
          null;

        /*
         * =====================================================
         * SCORE HARI INI / TERBARU
         * =====================================================
         */
        const zyba =
          getLatestZybaScore({
            isNewAccount,

            initialAssessment:
              initialAssessment as any,

            dailyAssessments:
              sortedHistory,

            /*
             * FALLBACK
             * kalau API Daily Assessment
             * belum mengirim score per record.
             */
            userZybaScore:
              user.zybaScore ??
              stats.zybaScore ??
              null,
          });

        /*
         * =====================================================
         * CONDITION
         * =====================================================
         */
        let condition =
          "Belum Dinilai";

        if (
          zyba.score !== null
        ) {
          if (
            zyba.score >= 80
          ) {
            condition = "Baik";
          } else if (
            zyba.score >= 60
          ) {
            condition = "Cukup";
          } else {
            condition =
              "Perlu Perhatian";
          }
        }

        /*
         * =====================================================
         * STRESS TERBARU
         * =====================================================
         */
        const latestStress =
          latestDaily?.stressLevel !=
            null
            ? Number(
              latestDaily.stressLevel
            )
            : null;

        const stressLabels = [
          "",
          "Sangat Rendah",
          "Rendah",
          "Sedang",
          "Tinggi",
          "Sangat Tinggi",
        ];

        const stressLabel =
          latestStress !== null
            ? stressLabels[
            Math.min(
              5,
              Math.max(
                1,
                Math.round(
                  latestStress
                )
              )
            )
            ]
            : "Belum Ada Data";

        /*
         * =====================================================
         * HAS ASSESSMENT
         * =====================================================
         */
        const hasAssessment =
          Boolean(
            history.length > 0 ||
            initialAssessment ||
            stats.hasAssessment
          );

        /*
         * =====================================================
         * USER DATA
         * =====================================================
         */
        const nextUserData:
          UserData = {
          name:
            user.name ||
            "Pengguna ZYBA",

          avatarUrl:
            user.avatarUrl ||
            "🦊",

          zybaScore:
            zyba.score,

          condition,

          stressLevel:
            latestStress,

          stressLabel,

          hasAssessment,

          streak:
            hasAssessment
              ? Math.max(
                1,
                Number(
                  stats.streak ||
                  1
                )
              )
              : 0,

          conversationCount:
            Number(
              stats.conversationCount ||
              0
            ),
        };

        setUserData(
          nextUserData
        );

        /*
         * =====================================================
         * CACHE
         * =====================================================
         */
        try {
          localStorage.setItem(
            "zyba_user_cache",
            JSON.stringify({
              name:
                user.name ||
                "Pengguna ZYBA",

              email:
                user.email,

              avatarUrl:
                user.avatarUrl ||
                "🦊",

              stats: {
                ...stats,

                zybaScore:
                  zyba.score,

                condition,

                stressLevel:
                  latestStress,

                stressLabel,

                hasAssessment,
              },

              initialAssessment,

              dailyAssessments:
                sortedHistory,
            })
          );
        } catch {
          // Abaikan localStorage
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        if (!cancelled) {
          setUserData(
            EMPTY_USER
          );
        }
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =====================================================
   * LOAD TRACKER
   * =====================================================
   */
  useEffect(() => {
    try {
      const todayKey =
        `zyba_trackers_${getJakartaDateKey()}`;

      const saved =
        localStorage.getItem(
          todayKey
        );

      if (!saved) {
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        setTrackerState(
          parsed
        );
      }
    } catch {
      // Abaikan error
    }
  }, []);

  /*
   * =====================================================
   * DATE
   * =====================================================
   */
  useEffect(() => {
    setTodayFormatted(
      new Intl.DateTimeFormat(
        "id-ID",
        {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone:
            "Asia/Jakarta",
        }
      ).format(
        new Date()
      )
    );
  }, []);

  /*
   * =====================================================
   * TRACKER
   * =====================================================
   */
  const completedCount =
    Object.values(
      trackerState
    ).filter(Boolean).length;

  const totalTrackers =
    Object.keys(
      trackerState
    ).length;

  const toggleTracker = (
    key: string
  ) => {
    setTrackerState(
      (prev) => {
        const nextState = {
          ...prev,
          [key]: !prev[key],
        };

        try {
          const todayKey =
            `zyba_trackers_${getJakartaDateKey()}`;

          localStorage.setItem(
            todayKey,
            JSON.stringify(
              nextState
            )
          );
        } catch {
          // Abaikan
        }

        return nextState;
      }
    );
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

                <span>
                  →
                </span>
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