import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import { getUserPlan } from "@/backend/billing/entitlements";
import { calculateDailyZybaScore } from "@/lib/assessmentMetrics";

type PlanItem = {
  title: string;
  detail: string;
  reason: string;
};

type InsightData = {
  summary: {
    averageScore: number | null;
    averageMood: number | null;
    averageStress: number | null;
    averageSleep: number | null;
    checkIns: number;
    journals: number;
    completedActivities: number;
  };
  weekly: {
    score: number | null;
    scoreDelta: number | null;
    stress: number | null;
    stressDelta: number | null;
    strongestDay: string | null;
    focus: string;
  };
  patterns: string[];
  recommendations: string[];
  memory: string[];
  personalizedPlan: PlanItem[];
  dataQuality: {
    level: "low" | "medium" | "high";
    label: string;
    checkIns: number;
  };
};

type InsightCache = { expiresAt: number; data: InsightData };

const globalForInsights = globalThis as typeof globalThis & {
  __zybaPremiumInsightsCache?: Map<string, InsightCache>;
};
const cache =
  globalForInsights.__zybaPremiumInsightsCache ??
  new Map<string, InsightCache>();
globalForInsights.__zybaPremiumInsightsCache = cache;

const CACHE_TTL_MS = 60_000;
const MOOD_SCORE: Record<string, number> = {
  DEPRESSED: 20,
  SAD: 40,
  NEUTRAL: 60,
  HAPPY: 80,
  OVERJOYED: 95,
};

function avg(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreOf(item: any) {
  const value = item.calculatedScore ?? calculateDailyZybaScore(item);
  return Number.isFinite(value) ? Number(value) : null;
}

function buildInsights(input: {
  assessments: any[];
  journals: any[];
  activities: any[];
}): InsightData {
  const { assessments, journals, activities } = input;
  const sorted = [...assessments].sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );

  const scores = sorted.map(scoreOf).filter((v): v is number => v !== null);
  const moods = sorted
    .map((item) => MOOD_SCORE[String(item.mood || "").toUpperCase()])
    .filter((v): v is number => Number.isFinite(v));
  const stresses = sorted
    .map((item) => Number(item.stressLevel))
    .filter((v) => v >= 1 && v <= 5);
  const sleeps = sorted
    .map((item) => Number(item.sleepRating))
    .filter((v) => v >= 1 && v <= 5);

  const recent = sorted.slice(-7);
  const previous = sorted.slice(-14, -7);
  const recentScores = recent.map(scoreOf).filter((v): v is number => v !== null);
  const previousScores = previous.map(scoreOf).filter((v): v is number => v !== null);
  const recentStressValues = recent
    .map((item) => Number(item.stressLevel))
    .filter((v) => v >= 1 && v <= 5);
  const previousStressValues = previous
    .map((item) => Number(item.stressLevel))
    .filter((v) => v >= 1 && v <= 5);

  const sleepMoodPairs = sorted
    .map((item) => {
      const sleep = Number(item.sleepRating);
      const mood = MOOD_SCORE[String(item.mood || "").toUpperCase()];
      return sleep >= 1 && sleep <= 5 && Number.isFinite(mood)
        ? { sleep, mood }
        : null;
    })
    .filter((v): v is { sleep: number; mood: number } => Boolean(v));

  const sleepHigh = avg(
    sleepMoodPairs.filter((item) => item.sleep >= 4).map((item) => item.mood)
  );
  const sleepLow = avg(
    sleepMoodPairs.filter((item) => item.sleep <= 2).map((item) => item.mood)
  );

  const recentScore = avg(recentScores);
  const previousScore = avg(previousScores);
  const recentStress = avg(recentStressValues);
  const previousStress = avg(previousStressValues);
  const completedActivities = activities.filter((item) => item.completed).length;
  const reflectionCount = sorted.filter(
    (item) => typeof item.reflection === "string" && item.reflection.trim()
  ).length;

  const strongestDay = recent
    .map((item) => ({ date: item.date, score: scoreOf(item) }))
    .filter((item): item is { date: string; score: number } => item.score !== null)
    .sort((a, b) => b.score - a.score)[0];

  const patterns: string[] = [];

  if (sleepHigh !== null && sleepLow !== null && sleepHigh - sleepLow >= 8) {
    patterns.push(
      "Hari dengan kualitas tidur lebih baik cenderung memiliki mood yang lebih positif."
    );
  }

  if (recentStress !== null && previousStress !== null) {
    if (recentStress < previousStress - 0.25) {
      patterns.push("Rata-rata stres 7 hari terakhir lebih rendah dibanding 7 hari sebelumnya.");
    } else if (recentStress > previousStress + 0.25) {
      patterns.push("Rata-rata stres 7 hari terakhir meningkat dibanding 7 hari sebelumnya.");
    }
  }

  if (
    completedActivities >= 3 &&
    recentScore !== null &&
    previousScore !== null &&
    recentScore > previousScore + 2
  ) {
    patterns.push("Konsistensi aktivitas beriringan dengan peningkatan skor periode terbaru.");
  }

  const activityByType = new Map<string, { total: number; completed: number }>();
  for (const activity of activities) {
    const current = activityByType.get(activity.type) ?? { total: 0, completed: 0 };
    current.total += 1;
    if (activity.completed) current.completed += 1;
    activityByType.set(activity.type, current);
  }

  const strongestActivity = [...activityByType.entries()]
    .filter(([, value]) => value.completed > 0)
    .sort((a, b) => b[1].completed - a[1].completed)[0];

  if (strongestActivity) {
    patterns.push(
      "Aktivitas yang paling sering selesai: " +
        strongestActivity[0].toLowerCase().replace(/_/g, " ") +
        "."
    );
  }

  if (!patterns.length && sorted.length >= 3) {
    patterns.push("Belum ada pola kuat yang terdeteksi; lanjutkan check-in agar insight semakin akurat.");
  }

  const recentSleep = sleeps.slice(-7);
  const averageRecentSleep = avg(recentSleep);
  const focus =
    recentStress !== null && recentStress >= 3.5
      ? "Stress regulation"
      : averageRecentSleep !== null && averageRecentSleep < 3
        ? "Recovery & sleep"
        : completedActivities < 3
          ? "Consistent movement"
          : reflectionCount < 2
            ? "Reflection"
            : "Consistency";

  const recommendations = [
    recentStress !== null && recentStress >= 3.5
      ? "Sisihkan 5–10 menit untuk latihan pernapasan ketika tekanan terasa meningkat."
      : null,
    averageRecentSleep !== null && averageRecentSleep < 3
      ? "Prioritaskan rutinitas tidur yang konsisten dan kurangi aktivitas berat menjelang waktu tidur."
      : null,
    completedActivities < 3
      ? "Tambahkan 2–3 sesi gerak ringan yang realistis minggu ini."
      : null,
    reflectionCount < Math.max(2, Math.ceil(sorted.length / 3))
      ? "Gunakan refleksi singkat setelah check-in untuk membantu mengenali pola harian."
      : null,
  ].filter(Boolean) as string[];

  if (!recommendations.length) {
    recommendations.push(
      "Pertahankan kebiasaan yang sudah konsisten dan gunakan check-in untuk melihat perubahan minggu berikutnya."
    );
  }

  const personalizedPlan: PlanItem[] = [];

  if (recentStress !== null && recentStress >= 3) {
    personalizedPlan.push({
      title: "Reset 5 menit",
      detail: "Lakukan 1 sesi breathing singkat saat stres mulai naik.",
      reason: "Stres rata-rata minggu ini berada di level yang perlu dipantau.",
    });
  }

  if (averageRecentSleep !== null && averageRecentSleep < 3) {
    personalizedPlan.push({
      title: "Prioritaskan recovery",
      detail: "Targetkan rutinitas tidur yang konsisten selama 7 hari.",
      reason: "Kualitas tidur terbaru masih berada di bawah target.",
    });
  }

  if (completedActivities < 3) {
    personalizedPlan.push({
      title: "Gerak ringan",
      detail: "Selesaikan minimal 3 aktivitas ringan minggu ini.",
      reason: "Aktivitas yang selesai masih relatif sedikit.",
    });
  }

  if (reflectionCount < 2) {
    personalizedPlan.push({
      title: "Refleksi singkat",
      detail: "Tulis 1–2 kalimat setelah check-in setidaknya dua kali minggu ini.",
      reason: "Refleksi membantu ZYBA mendapatkan konteks perjalananmu.",
    });
  }

  if (!personalizedPlan.length) {
    personalizedPlan.push({
      title: "Pertahankan momentum",
      detail: "Lanjutkan kebiasaan yang sudah konsisten dan cek perubahan skor minggu depan.",
      reason: "Data terbaru menunjukkan pola yang relatif stabil.",
    });
  }

  const dataQuality =
    sorted.length >= 14
      ? { level: "high" as const, label: "Data kuat", checkIns: sorted.length }
      : sorted.length >= 7
        ? { level: "medium" as const, label: "Data cukup", checkIns: sorted.length }
        : { level: "low" as const, label: "Data awal", checkIns: sorted.length };

  const memory: string[] = [
    `ZYBA punya ${sorted.length} check-in harian sebagai konteks perjalananmu.`,
    completedActivities > 0
      ? `${completedActivities} aktivitas tercatat selesai.`
      : "Belum ada aktivitas yang tercatat selesai.",
    journals.length > 0
      ? `${journals.length} catatan jurnal tersedia sebagai konteks.`
      : "Belum ada jurnal yang bisa dipakai sebagai konteks.",
  ];

  if (sleepHigh !== null && sleepLow !== null && sleepHigh - sleepLow >= 8) {
    memory.push("Kualitas tidur yang lebih baik tampak berkaitan dengan mood yang lebih positif pada data kamu.");
  }

  if (strongestActivity) {
    memory.push(
      `Aktivitas yang paling sering selesai sejauh ini adalah ${strongestActivity[0].toLowerCase().replace(/_/g, " ")}.`
    );
  }

  return {
    summary: {
      averageScore: avg(scores) !== null ? Math.round(avg(scores)!) : null,
      averageMood: avg(moods) !== null ? Math.round(avg(moods)!) : null,
      averageStress: avg(stresses) !== null ? Number(avg(stresses)!.toFixed(1)) : null,
      averageSleep: avg(sleeps) !== null ? Number(avg(sleeps)!.toFixed(1)) : null,
      checkIns: sorted.length,
      journals: journals.length,
      completedActivities,
    },
    weekly: {
      score: recentScore !== null ? Math.round(recentScore) : null,
      scoreDelta:
        recentScore !== null && previousScore !== null
          ? Math.round(recentScore - previousScore)
          : null,
      stress: recentStress !== null ? Number(recentStress.toFixed(1)) : null,
      stressDelta:
        recentStress !== null && previousStress !== null
          ? Number((recentStress - previousStress).toFixed(1))
          : null,
      strongestDay: strongestDay?.date ?? null,
      focus,
    },
    patterns,
    recommendations,
    memory,
    personalizedPlan: personalizedPlan.slice(0, 4),
    dataQuality,
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if ((await getUserPlan(session.userId)) !== "PLUS") {
      return NextResponse.json(
        { error: "Premium feature", code: "PREMIUM_REQUIRED" },
        { status: 403 }
      );
    }

    const cached = cache.get(session.userId);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
        },
      });
    }

    const [assessments, journals, activities] = await Promise.all([
      accountDb.dailyAssessment.findMany({
        where: { userId: session.userId },
        orderBy: { date: "desc" },
        take: 90,
        select: {
          date: true,
          mood: true,
          stressLevel: true,
          sleepRating: true,
          reflection: true,
          calculatedScore: true,
        },
      }),
      accountDb.journalEntry.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { createdAt: true, mood: true, title: true },
      }),
      accountDb.activityLog.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 90,
        select: { completed: true, type: true, createdAt: true },
      }),
    ]);

    const data = buildInsights({ assessments, journals, activities });
    cache.set(session.userId, { expiresAt: Date.now() + CACHE_TTL_MS, data });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[PremiumInsights] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat Premium Insight" },
      { status: 500 }
    );
  }
}
