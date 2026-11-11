"use client";
import { useFreshDataSignal, notifyZybaDataChanged } from "@/hooks/useFreshData";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Flame, Sparkles, Camera, ArrowRight, CheckCircle2, Sun, Cloud, Compass } from "lucide-react";

import MetricScoreCard from "./components/MetricScoreCard";
import StressLevelChart from "./components/StressLevelChart";
import CompanionWidget from "./components/CompanionWidget";
import TrackerChecklist from "./components/TrackerChecklist";
import QuickAccessCards from "./components/QuickAccessCards";
import PremiumStatusWidget from "./components/PremiumStatusWidget";
import TactileMetricCards from "./components/TactileMetricCards";
import WeeklyTaskCards from "./components/WeeklyTaskCards";
import SanctuaryRightRail from "./components/SanctuaryRightRail";
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

function getGreetingInfo(): { greeting: string; period: "pagi" | "siang" | "sore" | "malam" } {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
      10
    );
    if (hour >= 4 && hour < 11) return { greeting: "Selamat Pagi", period: "pagi" };
    if (hour >= 11 && hour < 15) return { greeting: "Selamat Siang", period: "siang" };
    if (hour >= 15 && hour < 18) return { greeting: "Selamat Sore", period: "sore" };
    return { greeting: "Selamat Malam", period: "malam" };
  } catch {
    return { greeting: "Selamat Datang", period: "pagi" };
  }
}

function getEmpatheticSubtitle(
  name: string,
  condition: string,
  stressLevel: number | null,
  period: "pagi" | "siang" | "sore" | "malam",
  hasAssessment: boolean
): string {
  const firstName = name.split(" ")[0] || "teman";

  if (!hasAssessment) {
    return "Selamat datang di tempat perlindunganmu. Mari kenali ritme batinmu lewat check-in pertamamu.";
  }

  // High stress or "Perlu Perhatian"
  if (condition === "Perlu Perhatian" || (stressLevel !== null && stressLevel >= 4)) {
    if (period === "malam") {
      return `Hari yang cukup padat, ${firstName}. Lepaskan perlahan beban pikiranmu malam ini; ruang ini selalu aman untukmu beristirahat.`;
    }
    return `Pelukan hangat untukmu hari ini, ${firstName}. Ambil jeda sesering yang kamu butuhkan; tidak ada yang harus diselesaikan terburu-buru.`;
  }

  // Moderate stress or "Cukup"
  if (condition === "Cukup" || stressLevel === 3) {
    if (period === "sore" || period === "malam") {
      return `Satu hari yang bermakna telah kamu lalui, ${firstName}. Beri apresiasi pada dirimu yang telah melangkah sejauh ini.`;
    }
    return `Satu hari demi satu langkah kecil. Dengarkan apa yang tubuh dan batinmu butuhkan dengan penuh kelembutan.`;
  }

  // Good condition or low stress
  if (condition === "Baik" || (stressLevel !== null && stressLevel <= 2)) {
    if (period === "pagi") {
      return `Senang menyambut energimu yang jernih pagi ini, ${firstName}. Rawat ritme ketenangan ini sepanjang harimu.`;
    }
    return `Harmoni batinmu terasa menenangkan hari ini. Nikmati setiap momen kebersamaan dengan dirimu sendiri.`;
  }

  return "Tarik napas perlahan. Hadir seutuhnya di ruang tenangmu hari ini.";
}

function getEmotionalWeatherBadge(condition: string, hasAssessment: boolean) {
  if (!hasAssessment) {
    return (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cream/90 border border-white/20 flex items-center gap-1.5">
        <Sparkles size={12} strokeWidth={1.8} className="text-orange-300" />
        <span>Langkah Awal</span>
      </span>
    );
  }

  if (condition === "Baik") {
    return (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
        <Sun size={12} strokeWidth={1.8} className="text-emerald-300" />
        <span>Cuaca Batin: Teduh &amp; Stabil</span>
      </span>
    );
  }

  if (condition === "Cukup") {
    return (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1.5">
        <Cloud size={12} strokeWidth={1.8} className="text-amber-300" />
        <span>Cuaca Batin: Tenang Mengalir</span>
      </span>
    );
  }

  return (
    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/25 text-orange-200 border border-orange-400/30 flex items-center gap-1.5">
      <Compass size={12} strokeWidth={1.8} className="text-orange-300" />
      <span>Cuaca Batin: Butuh Kehangatan</span>
    </span>
  );
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
      "Refleksi Pagi": false,
      "Latihan Napas 4-7-8": false,
      "Jeda & Hidrasi Sore": false,
      "Catatan Jurnal Kesehatan": false,
      "Aktivitas Komunitas": false,
    });

  const [greetingInfo, setGreetingInfo] = useState<{
    greeting: string;
    period: "pagi" | "siang" | "sore" | "malam";
  }>({
    greeting: "Selamat Datang",
    period: "pagi",
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
   * LOAD TRACKER & SYNC WITH DB ACTIVITY
   * =====================================================
   */
  useEffect(() => {
    let cancelled = false;

    try {
      const todayKey =
        `zyba_trackers_${getJakartaDateKey()}`;

      const saved =
        localStorage.getItem(
          todayKey
        );

      if (saved) {
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
      }
    } catch {
      // Abaikan error
    }

    // Synchronize with database activity logs
    fetch("/api/activity", { method: "GET", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.todayActivities || !Array.isArray(data.todayActivities)) return;
        setTrackerState((prev) => {
          const next = { ...prev };
          for (const act of data.todayActivities) {
            if (act.title && act.completed) {
              next[act.title] = true;
            }
            if (act.type === "BREATHING" && act.completed) {
              next["Latihan Napas 4-7-8"] = true;
            }
          }
          return next;
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [dataRefreshSignal]);

  /*
   * =====================================================
   * DATE & GREETING
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
    setGreetingInfo(getGreetingInfo());
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
        const willBeDone = !prev[key];
        const nextState = {
          ...prev,
          [key]: willBeDone,
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

        if (willBeDone) {
          const activityType = key.toLowerCase().includes("napas")
            ? "BREATHING"
            : key.toLowerCase().includes("refleksi")
            ? "BREATHING"
            : "WORKOUT";

          fetch("/api/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: activityType,
              durationMin: 5,
              points: 20,
              completed: true,
              title: key,
            }),
          })
            .then(() => {
              notifyZybaDataChanged();
            })
            .catch((err) => {
              console.warn("Failed to persist tracker to DB:", err);
            });
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

      {avatarToast && (
        <div className="bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          {avatarToast}
        </div>
      )}

      {/* =================================================
          SANCTUARY ASYMMETRIC GRID (ORGANIC TACTILE SPREAD)
      ================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ====================================================
            MAIN SANCTUARY CANVASES (LEFT / CENTER 68%)
        ==================================================== */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-7">
          {/* 1. HERO SANCTUARY CARD (DEEP SAGE CRAFT CONTAINER) */}
          <div className="rounded-[28px] bg-[#344638] text-cream border border-[#445B4A] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col gap-6">
            {/* Subtle organic contour lines / backdrop decoration */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-black/15 blur-xl pointer-events-none" />

            {/* Hidden file input for avatar upload */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelected}
            />

            {/* Top Micro Quote & Date Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] text-cream/90 font-medium">
                <Sparkles size={14} className="text-orange-400 shrink-0" />
                <span>Setiap langkah kecil berharga. Kamu telah hadir hari ini.</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cream border border-white/15" suppressHydrationWarning>
                  {todayFormatted}
                </span>
                {getEmotionalWeatherBadge(userData.condition, userData.hasAssessment)}
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/25 text-orange-200 border border-orange-400/30">
                  {userData.hasAssessment ? `${userData.streak} Hari Konsistensi` : "Awal Perjalanan"}
                </span>
              </div>
            </div>

            {/* Main Greeting & Persona Anchor */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {/* Avatar with Crop & Cooldown Trigger */}
                <div className="relative group shrink-0">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("zyba_open_profile"))}
                    className="rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400 block transition-transform group-hover:scale-105 active:scale-95"
                    title="Buka profil lengkap"
                  >
                    <UserAvatar
                      src={userData.avatarUrl}
                      name={userData.name}
                      size="lg"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/20 shadow-xs cursor-pointer object-cover"
                      showStatus={false}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner pointer-events-none group-hover:pointer-events-auto"
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
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-xs border-2 border-[#344638] cursor-pointer transition-colors"
                    title="Ubah foto profil"
                    aria-label="Ubah foto profil"
                  >
                    <Camera size={11} />
                  </button>
                </div>

                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cream tracking-tight leading-tight">
                    {greetingInfo.greeting},{" "}
                    <span className="break-words text-white">{userData.name}</span>!
                  </h1>
                  <p className="text-xs sm:text-sm text-cream/80 mt-1 font-normal leading-relaxed max-w-lg">
                    {getEmpatheticSubtitle(
                      userData.name,
                      userData.condition,
                      userData.stressLevel,
                      greetingInfo.period,
                      userData.hasAssessment
                    )}
                  </p>
                </div>
              </div>

              {/* Action Button: Check In / Goal */}
              <div className="shrink-0 flex items-center gap-2">
                <Link
                  href="/mood-check-in"
                  className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{userData.hasAssessment ? "Lihat Asesmen" : "Mulai Check-In"}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* 2. THREE TACTILE PEBBLE METRIC CARDS */}
            <div className="relative z-10 pt-2">
              <TactileMetricCards
                streak={userData.streak}
                conversationCount={userData.conversationCount}
                score={userData.zybaScore}
                condition={userData.condition}
                hasAssessment={userData.hasAssessment}
              />
            </div>

            {/* 3. THIS WEEK TASKS (AKTIVITAS PEKAN INI) */}
            <div className="relative z-10 pt-2 border-t border-white/10">
              <WeeklyTaskCards
                hasAssessment={userData.hasAssessment}
                streak={userData.streak}
              />
            </div>
          </div>

          {/* 4. TANYA ZYBA COMPANION QUICK GATEWAY */}
          <CompanionWidget
            conversationCount={userData.conversationCount}
          />

          {/* 5. STRESS LEVEL & MOOD WAVEFORM */}
          <StressLevelChart initialHistory={assessmentHistory} />
        </div>

        {/* ====================================================
            SIDEBAR SANCTUARY RAIL (RIGHT 32%)
        ==================================================== */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* 1. Sanctuary Right Rail (Specialist Card, Today's Tasks, Mood Check Banner) */}
          <SanctuaryRightRail
            conversationCount={userData.conversationCount}
            hasAssessment={userData.hasAssessment}
            trackerState={trackerState}
            toggleTracker={toggleTracker}
          />

          {/* 2. Score Overview Detail Card */}
          <MetricScoreCard
            score={userData.zybaScore}
            condition={userData.condition}
            hasAssessment={userData.hasAssessment}
          />

          {/* 3. Quick Access / Crisis Safety Directory */}
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