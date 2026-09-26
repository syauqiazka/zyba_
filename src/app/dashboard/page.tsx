"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";
import UserAvatar from "@/components/ui/UserAvatar";
import AvatarCropModal from "@/components/ui/AvatarCropModal";

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

  const [assessmentHistory, setAssessmentHistory] =
    useState<any[]>([]);

  // Avatar upload & crop modal state
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarToast, setAvatarToast] = useState<string | null>(null);
  const [cooldownInfo, setCooldownInfo] = useState<{
    canChange: boolean;
    remainingText: string | null;
    cooldownDays: number;
  } | null>(null);

  // Check cooldown status
  const checkCooldown = useCallback(async () => {
    try {
      const res = await fetch("/api/user/avatar");
      if (res.ok) {
        const data = await res.json();
        setCooldownInfo(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkCooldown();

    // Listen for avatar updates from other components
    const handleAvatarUpdate = (e: any) => {
      if (e?.detail?.avatarUrl) {
        setUserData((prev) => ({ ...prev, avatarUrl: e.detail.avatarUrl }));
        checkCooldown();
      }
    };
    window.addEventListener("zyba_user_updated", handleAvatarUpdate);
    return () => window.removeEventListener("zyba_user_updated", handleAvatarUpdate);
  }, [checkCooldown]);

  const handleAvatarClick = () => {
    if (cooldownInfo && !cooldownInfo.canChange) {
      alert(`Foto profil sedang dalam masa cooldown. Kamu baru bisa mengganti foto profil lagi dalam ${cooldownInfo.remainingText}.`);
      return;
    }
    avatarInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (JPG, PNG, WEBP, GIF) yang diizinkan.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran foto maksimal 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleConfirmCrop = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", croppedFile);
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.avatarUrl) {
        throw new Error(data.error || "Gagal mengunggah foto profil.");
      }

      setUserData((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      setIsCropModalOpen(false);
      setCropImageSrc(null);
      await checkCooldown();

      // Sync localStorage and notify sidebar
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        const prev = cached ? JSON.parse(cached) : {};
        localStorage.setItem("zyba_user_cache", JSON.stringify({ ...prev, avatarUrl: data.avatarUrl }));
        window.dispatchEvent(new CustomEvent("zyba_user_updated", { detail: { avatarUrl: data.avatarUrl } }));
      } catch {}

      setAvatarToast("✓ Foto profil berhasil diperbarui!");
      setTimeout(() => setAvatarToast(null), 3500);
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto profil.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

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
            "/api/daily-assessment?limit=14&page=1",
            {
              method: "GET",
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

        setAssessmentHistory(history);

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
         * Authoritative Zyba Score:
         * Prioritaskan stats.zybaScore yang sudah disinkronkan berdasarkan timestamp
         * terbaru di /api/user/me, lalu zyba.score, lalu user.zybaScore.
         */
        const finalScore =
          stats.zybaScore ??
          zyba.score ??
          user.zybaScore ??
          null;

        /*
         * =====================================================
         * CONDITION
         * =====================================================
         */
        let condition =
          "Belum Dinilai";

        if (
          finalScore !== null
        ) {
          if (
            finalScore >= 80
          ) {
            condition = "Baik";
          } else if (
            finalScore >= 60
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
        const resolvedStress =
          stats.stressLevel != null
            ? Number(stats.stressLevel)
            : latestDaily?.stressLevel != null
            ? Number(latestDaily.stressLevel)
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
          resolvedStress !== null
            ? stressLabels[
            Math.min(
              5,
              Math.max(
                1,
                Math.round(
                  resolvedStress
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
            finalScore,

          condition,

          stressLevel:
            resolvedStress,

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
                  finalScore,

                condition,

                stressLevel:
                  resolvedStress,

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 glass-card p-6 rounded-3xl border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 shadow-sm relative overflow-hidden">
        
        {/* Hidden file input for avatar upload */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelected}
        />

        <div className="flex items-center gap-4">
          {/* Avatar with Crop & Cooldown Trigger */}
          <div className="relative group shrink-0">
            <UserAvatar
              src={userData.avatarUrl}
              name={userData.name}
              size="lg"
              className="w-16 h-16 rounded-full border-2 border-orange-300 shadow-md cursor-pointer transition-transform group-hover:scale-105"
              showStatus={false}
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner"
              title={
                cooldownInfo && !cooldownInfo.canChange
                  ? `Cooldown: ${cooldownInfo.remainingText}`
                  : "Ubah foto profil (Crop & Cooldown)"
              }
            >
              <span className="text-[10px] font-bold">📷 Ubah</span>
            </button>
            {/* Mobile camera badge */}
            <button
              type="button"
              onClick={handleAvatarClick}
              className="md:hidden absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-md border-2 border-white cursor-pointer"
              title="Ubah foto profil"
            >
              📷
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  userData.hasAssessment
                    ? "bg-orange-100 text-orange-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {userData.hasAssessment ? "Welcome back" : "Selamat Datang"}
              </span>

              <span className="text-xs text-brown-700" suppressHydrationWarning>
                | {todayFormatted}
              </span>

              {/* Cooldown badge if active */}
              {cooldownInfo && !cooldownInfo.canChange && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/50">
                  ⏳ Cooldown: {cooldownInfo.remainingText}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-brown-900">
              Hi, {userData.name}! 👋
            </h1>

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
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            title="Pengaturan akun"
          >
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
      </div>

      {avatarToast && (
        <div className="bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          {avatarToast}
        </div>
      )}

      {/* =================================================
          METRICS
      ================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

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

        <StressLevelChart initialHistory={assessmentHistory} />

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

      {/* Avatar Crop Modal */}
      <AvatarCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        onClose={() => {
          setIsCropModalOpen(false);
          setCropImageSrc(null);
        }}
        onConfirm={handleConfirmCrop}
        isUploading={isUploadingAvatar}
      />
    </div>
  );
}