"use client";
import { useFreshDataSignal } from "@/hooks/useFreshData";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Flame, Sparkles, Camera, ArrowRight, CheckCircle2 } from "lucide-react";

import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";
import PremiumStatusWidget from "./components/PremiumStatusWidget";
import UserAvatar from "@/components/ui/UserAvatar";
import AvatarCropModal from "@/components/ui/AvatarCropModal";

import {
  getLatestZybaScore,
  type AssessmentMetric,
  type DailyAssessment,
} from "@/lib/assessmentMetrics";

interface SubscriptionInfo {
  id?: string;
  plan?: "FREE" | "PLUS";
  status?: string;
  startDate?: string;
  endDate?: string;
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

  plan: "FREE" | "PLUS";
  subscription: SubscriptionInfo | null;
  premiumUntil: string | null;
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

  plan: "FREE",
  subscription: null,
  premiumUntil: null,
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
  const [userData, setUserData] = useState<UserData>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.name) {
            return {
              name: parsed.name || "Pengguna ZYBA",
              avatarUrl: parsed.avatarUrl || "🦊",
              zybaScore: parsed.stats?.zybaScore ?? parsed.zybaScore ?? null,
              condition: parsed.stats?.condition ?? parsed.condition ?? "Belum Dinilai",
              stressLevel: parsed.stats?.stressLevel ?? parsed.stressLevel ?? null,
              stressLabel: parsed.stats?.stressLabel ?? parsed.stressLabel ?? "Belum Ada Data",
              streak: parsed.stats?.streak ?? parsed.streak ?? 0,
              hasAssessment: parsed.stats?.hasAssessment ?? parsed.hasAssessment ?? false,
              conversationCount: parsed.stats?.conversationCount ?? parsed.conversationCount ?? 0,
              plan: (parsed.stats?.plan === "PLUS" || parsed.plan === "PLUS" ? "PLUS" : "FREE") as "FREE" | "PLUS",
              subscription: parsed.stats?.subscription ?? parsed.subscription ?? null,
              premiumUntil: parsed.stats?.premiumUntil ?? parsed.premiumUntil ?? null,
            };
          }
        }
      } catch { }
    }
    return EMPTY_USER;
  });

  const [trackerState, setTrackerState] =
    useState<
      Record<string, boolean>
    >({
      "Zyba Hours (Latihan Napas)": false,
      "Catatan Jurnal Kesehatan": false,
      "Membaca Wawasan Harian": false,
      "Refleksi Jurnal Mental": false,
      "Aktivitas Komunitas": false,
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
  const dataRefreshSignal = useFreshDataSignal();
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
    } catch { }
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
      } catch { }

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
            "/api/daily-assessment?limit=14&page=1&includeTotal=false",
            {
              method: "GET",
              cache: "no-store",
            }
          ),
        ]);

        if (!userResponse.ok) {
          throw new Error(
            `User API gagal: ${userResponse.status}`
          );
        }

        const userData = await userResponse.json();
        const assessmentData = assessmentResponse.ok
          ? await assessmentResponse.json()
          : { history: [] };

        if (!userData.success && !userData.user) {
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

          plan: (user.plan === "PLUS" ? "PLUS" : "FREE") as "FREE" | "PLUS",
          subscription: (userData as any).subscription ?? null,
          premiumUntil: stats.premiumUntil ?? null,
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
  }, [dataRefreshSignal]);

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

      {/* PREMIUM STATUS WIDGET — dinamis berdasarkan plan aktual */}
      <PremiumStatusWidget
        plan={userData.plan}
        subscription={userData.subscription}
        premiumUntil={userData.premiumUntil}
      />

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
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("zyba_open_profile"))}
              className="rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 block transition-transform group-hover:scale-105 active:scale-95"
              title="Buka profil lengkap"
            >
              <UserAvatar
                src={userData.avatarUrl}
                name={userData.name}
                size="lg"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-brown-900/10 shadow-xs cursor-pointer object-cover"
                showStatus={false}
              />
            </button>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner pointer-events-none group-hover:pointer-events-auto"
              title={
                cooldownInfo && !cooldownInfo.canChange
                  ? `Cooldown: ${cooldownInfo.remainingText}`
                  : "Ubah foto profil"
              }
            >
              <Camera size={16} />
            </button>
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brown-900 hover:bg-orange-500 text-cream flex items-center justify-center shadow-xs border-2 border-cream cursor-pointer transition-colors"
              title="Ubah foto profil"
              aria-label="Ubah foto profil"
            >
              <Camera size={11} />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest ${
                  userData.hasAssessment
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {userData.hasAssessment ? "Ruang Hadir" : "Selamat Bergabung"}
              </span>

              <span className="text-xs text-brown-700/80 font-medium" suppressHydrationWarning>
                · {todayFormatted}
              </span>

              {/* Cooldown badge if active */}
              {cooldownInfo && !cooldownInfo.canChange && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/50">
                  Cooldown foto: {cooldownInfo.remainingText}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight leading-tight">
              Hai, <span className="break-words">{userData.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-brown-700 mt-0.5 font-normal">
              Tarik napas perlahan. Hadir seutuhnya di ruang tenangmu hari ini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 border border-brown-900/10 shadow-xs"
            title={userData.hasAssessment ? `${userData.streak} hari konsisten merawat diri` : "Pengguna baru ZYBA"}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                userData.hasAssessment
                  ? "bg-orange-100 text-orange-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {userData.hasAssessment ? (
                <Flame className="w-5 h-5 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 shrink-0" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-brown-900 leading-tight">
                {userData.hasAssessment ? `${userData.streak} Hari Hadir` : "Baru Hadir"}
              </span>
              <span className="text-[10px] text-brown-700/70">
                {userData.hasAssessment ? "Ritual konsisten" : "Awal perjalanan"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {avatarToast && (
        <div className="bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          {avatarToast}
        </div>
      )}

      {/* =================================================
          SANCTUARY ASYMMETRIC GRID (65% : 35%)
      ================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Focus Column (65%) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 sm:gap-8">
          {/* 1. Mindful Assessment Ritual Hero Card */}
          <div className="rounded-[32px] bg-white/95 border border-brown-900/10 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Subtle paper tint glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-orange-100/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-green-100/35 blur-2xl" />

            <div className="relative flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
                    Ritual Harian
                  </span>
                  <span className="text-xs text-brown-700/80">
                    10 Domain Kesejahteraan
                  </span>
                </div>
                {userData.hasAssessment && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-green-500/20">
                    <CheckCircle2 size={13} />
                    Sudah Tercatat Hari Ini
                  </span>
                )}
              </div>

              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-brown-900 leading-snug">
                  {userData.hasAssessment
                    ? "Evaluasi emosionalmu hari ini telah tersimpan."
                    : "Bagaimana keadaan batin dan tubuhmu hari ini?"}
                </h2>
                <p className="text-xs sm:text-sm text-brown-700 mt-2 max-w-xl leading-relaxed">
                  {userData.hasAssessment
                    ? `Kondisi suasana hatimu hari ini: ${userData.condition}. Rawat keseimbanganmu dengan tidak menuntut hal yang berlebihan.`
                    : "Luangkan jeda hening 1–2 menit untuk mengamati perasaan, energi fisik, dan kebutuhanmu tanpa menghakimi."}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <Link
                  href="/daily-assessment"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 hover:bg-brown-900 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <span>{userData.hasAssessment ? "Lihat Hasil Asesmen" : "Mulai Check-In Hari Ini"}</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/wellness-journey"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream hover:bg-cream/70 text-brown-900 text-xs sm:text-sm font-semibold transition-colors duration-200 border border-brown-900/10 cursor-pointer"
                >
                  <span>Riwayat Tren</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Tanya Zyba Private Gateway */}
          <CompanionWidget
            conversationCount={
              userData.conversationCount
            }
          />

          {/* 3. Stress Level & Mood Waveform */}
          <StressLevelChart initialHistory={assessmentHistory} />
        </div>

        {/* Side Companion Column (35%) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sm:gap-8">
          {/* 1. Score Overview */}
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

          {/* 2. Gentle Routine Checklist */}
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

          {/* 3. Quick Access / Safety Net */}
          <QuickAccessCards />
        </div>
      </div>

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