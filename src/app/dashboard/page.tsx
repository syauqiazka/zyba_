"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";

interface AssessmentItem {
  id?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;

  mood?: string | null;
  stressLevel?: number | null;
  sleepRating?: number | null;

  energyTags?: string[];
  reflection?: string | null;

  zybaScore?: number | null;
}

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

const DAY_NAMES = [
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
  "Min",
];

function getMonday(date = new Date()) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);

  return result;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Membentuk data 7 hari.
 *
 * Prioritas:
 * 1. dailyAssessments
 * 2. initialAssessment untuk akun baru
 * 3. stressLevel dari stats sebagai fallback
 */
function buildWeeklyStress(
  dailyAssessments: AssessmentItem[],
  initialAssessment: AssessmentItem | null,
  fallbackStress: number | null,
  isNewAccount: boolean
) {
  const monday = getMonday();

  const days = DAY_NAMES.map(
    (dayName, index) => {
      const date = new Date(monday);

      date.setDate(
        monday.getDate() + index
      );

      const dateKey = formatDateKey(date);

      /**
       * Daily assessment pada tanggal tersebut.
       */
      const dailyRecords =
        dailyAssessments
          .filter((item) => {
            if (
              item.stressLevel === null ||
              item.stressLevel === undefined
            ) {
              return false;
            }

            const itemDate =
              item.date ??
              (
                item.createdAt
                  ? formatDateKey(
                    new Date(
                      item.createdAt
                    )
                  )
                  : null
              );

            return itemDate === dateKey;
          })
          .sort((a, b) => {
            const aTime = new Date(
              a.createdAt ?? a.date ?? 0
            ).getTime();

            const bTime = new Date(
              b.createdAt ?? b.date ?? 0
            ).getTime();

            return bTime - aTime;
          });

      let stressLevel =
        dailyRecords[0]
          ?.stressLevel ??
        null;

      /**
       * Untuk akun baru, assessment awal
       * boleh menjadi baseline apabila
       * tanggalnya cocok dengan minggu ini
       * dan belum ada daily pada tanggal itu.
       */
      if (
        stressLevel === null &&
        isNewAccount &&
        initialAssessment?.stressLevel !== null &&
        initialAssessment?.stressLevel !== undefined &&
        initialAssessment.createdAt
      ) {
        const initialDate =
          formatDateKey(
            new Date(
              initialAssessment.createdAt
            )
          );

        if (initialDate === dateKey) {
          stressLevel =
            initialAssessment.stressLevel;
        }
      }

      return {
        day: dayName,
        date: dateKey,
        stressLevel,
      };
    }
  );

  /**
   * Hitung rata-rata dari data yang benar-benar ada.
   */
  const values = days
    .map((item) => item.stressLevel)
    .filter(
      (value): value is number =>
        value !== null &&
        value !== undefined &&
        Number.isFinite(value)
    );

  /**
   * Kalau belum ada histori tetapi API punya
   * stressLevel terbaru, pakai sebagai fallback.
   */
  if (
    values.length === 0 &&
    fallbackStress !== null &&
    Number.isFinite(fallbackStress)
  ) {
    const today = new Date();
    const todayKey =
      formatDateKey(today);

    const todayIndex =
      mondayToIndex(today);

    days[todayIndex].stressLevel =
      fallbackStress;

    return {
      days,
      average: fallbackStress,
    };
  }

  const average =
    values.length > 0
      ? Number(
        (
          values.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / values.length
        ).toFixed(1)
      )
      : null;

  return {
    days,
    average,
  };
}

function mondayToIndex(date: Date) {
  const day = date.getDay();

  return day === 0 ? 6 : day - 1;
}

function getStressLabel(
  stressLevel: number | null
) {
  if (
    stressLevel === null ||
    stressLevel === undefined
  ) {
    return "Belum Ada Data";
  }

  const labels: Record<
    number,
    string
  > = {
    1: "Sangat Rendah",
    2: "Rendah",
    3: "Sedang",
    4: "Tinggi",
    5: "Sangat Tinggi",
  };

  return (
    labels[stressLevel] ??
    `Level ${stressLevel}`
  );
}

export default function DashboardPage() {
  const [userData, setUserData] =
    useState<UserData>(
      EMPTY_USER
    );

  const [
    dailyAssessments,
    setDailyAssessments,
  ] = useState<AssessmentItem[]>([]);

  const [
    initialAssessment,
    setInitialAssessment,
  ] = useState<AssessmentItem | null>(
    null
  );

  const [
    isNewAccount,
    setIsNewAccount,
  ] = useState(false);

  const [trackerState, setTrackerState] =
    useState<{
      [key: string]: boolean;
    }>({
      "Zyba Hours (Breathing)": false,
      "Health Journal Entry": false,
      "Daily Resource Reading": false,
      "Mental Journal Reflection": false,
      "Community Activity": false,
    });

  const [
    todayFormatted,
    setTodayFormatted,
  ] = useState("");

  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch(
          "/api/user/me",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            `Request gagal: ${res.status}`
          );
        }

        const data =
          await res.json();

        if (!data.success) {
          throw new Error(
            data.error ||
            "Gagal mengambil data user"
          );
        }

        console.log(
          "[Dashboard] API:",
          data
        );

        const stats =
          data.stats ?? {};

        /* ---------------------------------------------
           ASSESSMENT AWAL
        --------------------------------------------- */

        const initial =
          data.initialAssessment ??
          stats.initialAssessment ??
          stats.assessment ??
          null;

        /* ---------------------------------------------
           DAILY ASSESSMENTS
        --------------------------------------------- */

        const daily =
          Array.isArray(
            data.dailyAssessments
          )
            ? data.dailyAssessments
            : Array.isArray(
              stats.dailyAssessments
            )
              ? stats.dailyAssessments
              : [];

        /* ---------------------------------------------
           STATUS ASSESSMENT

           Jangan hitung dari Zyba Score.

           API sudah menentukan hasAssessment.
        --------------------------------------------- */

        const hasAssessment =
          Boolean(
            stats.hasAssessment
          ) ||
          Boolean(initial) ||
          daily.length > 0;

        /* ---------------------------------------------
           IS NEW ACCOUNT

           API boleh mengirim nilai ini.
           Kalau belum, gunakan keberadaan
           initial assessment sebagai fallback.
        --------------------------------------------- */

        const newAccount =
          Boolean(
            data.isNewAccount ??
            stats.isNewAccount ??
            initial
          );

        setInitialAssessment(
          initial
        );

        setDailyAssessments(
          daily
        );

        setIsNewAccount(
          newAccount
        );

        /* ---------------------------------------------
           USER STATE

           Gunakan stats langsung dari API.
        --------------------------------------------- */

        setUserData({
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
                Number(
                  stats.streak || 1
                )
              )
              : 0,

          hasAssessment,

          conversationCount:
            Number(
              stats.conversationCount ||
              0
            ),
        });

        /* ---------------------------------------------
           UPDATE CACHE
        --------------------------------------------- */

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

              stats: {
                ...stats,
                hasAssessment,
              },

              initialAssessment:
                initial,

              dailyAssessments:
                daily,
            })
          );
        } catch {
          // Abaikan error localStorage
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      }
    }

    fetchDashboardData();
  }, []);

  /* =====================================================
     LOAD TRACKER
  ===================================================== */

  useEffect(() => {
    try {
      const todayKey =
        `zyba_trackers_${formatDateKey(
          new Date()
        )}`;

      const saved =
        localStorage.getItem(
          todayKey
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (
          parsed &&
          typeof parsed ===
          "object"
        ) {
          setTrackerState(parsed);
        }
      }
    } catch {
      // Abaikan error localStorage
    }
  }, []);

  /* =====================================================
     TANGGAL
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
        }
      ).format(new Date())
    );
  }, []);

  /* =====================================================
     TRACKER
  ===================================================== */

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
    setTrackerState((prev) => {
      const nextState = {
        ...prev,
        [key]: !prev[key],
      };

      try {
        const todayKey =
          `zyba_trackers_${formatDateKey(
            new Date()
          )}`;

        localStorage.setItem(
          todayKey,
          JSON.stringify(
            nextState
          )
        );
      } catch {
        // Abaikan error localStorage
      }

      return nextState;
    });
  };

  /* =====================================================
     WEEKLY STRESS
  ===================================================== */

  const weeklyStress =
    buildWeeklyStress(
      dailyAssessments,
      initialAssessment,
      userData.stressLevel,
      isNewAccount
    );

  const stressAverage =
    weeklyStress.average;

  const stressLabel =
    stressAverage !== null
      ? getStressLabel(
        Math.round(
          stressAverage
        )
      )
      : userData.stressLabel;

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

        <StressLevelChart
          weeklyData={
            weeklyStress.days
          }
          average={
            stressAverage
          }
          stressLabel={
            stressLabel
          }
        />

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