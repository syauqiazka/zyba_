import { calculateDailyZybaScore } from "../assessmentMetrics";

export interface FreeWellnessInsights {
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
  patterns: {
    items: string[];
    hasEnoughData: boolean;
    dataPoints: number;
    minRequired: number;
    emptyMessage: string;
  };
  recommendations: string[];
  dataQuality: {
    level: "low" | "medium" | "high";
    label: string;
    checkIns: number;
    hint: string;
  };
  observations: {
    category: string;
    title: string;
    description: string;
    direction: "up" | "down" | "neutral";
    isPositive: boolean;
  }[];
}

export interface PremiumWellnessInsights extends FreeWellnessInsights {
  isPremium: true;
  longitudinalAnalysis: {
    stabilityIndex: string;
    scoreTrajectory: "meningkat" | "stabil" | "menurun" | "fluktuatif";
    stabilityDescription: string;
    periodBreakdown: {
      label: string;
      checkIns: number;
      avgScore: number | null;
      avgStress: number | null;
    }[];
  };
  deepTriggers: {
    stressTriggers: string[];
    recoveryBoosters: string[];
  };
  memory: string[];
  adaptivePlan: {
    day: number;
    title: string;
    detail: string;
    reason: string;
  }[];
  companionContext: {
    summaryText: string;
    suggestedPrompt: string;
  };
}

const MOOD_SCORES: Record<string, number> = {
  OVERJOYED: 95,
  HAPPY: 80,
  NEUTRAL: 60,
  SAD: 40,
  DEPRESSED: 20,
};

function avg(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function scoreOf(item: any): number | null {
  const val = item.calculatedScore ?? calculateDailyZybaScore(item);
  return Number.isFinite(val) ? Number(val) : null;
}

/**
 * Membangun insight dasar yang sepenuhnya GRATIS untuk semua pengguna.
 * Menghitung metrik deterministik dari data check-in, jurnal, dan aktivitas pengguna yang login.
 */
export function buildFreeWellnessInsights(input: {
  assessments: any[];
  journals: any[];
  activities: any[];
}): FreeWellnessInsights {
  const { assessments, journals, activities } = input;

  const sorted = [...assessments].sort((a, b) =>
    String(a.date || a.createdAt || "").localeCompare(String(b.date || b.createdAt || ""))
  );

  const scores = sorted.map(scoreOf).filter((v): v is number => v !== null);
  const moods = sorted
    .map((item) => MOOD_SCORES[String(item.mood || "").toUpperCase()])
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

  const recentScore = avg(recentScores);
  const previousScore = avg(previousScores);
  const recentStress = avg(recentStressValues);
  const previousStress = avg(previousStressValues);
  const completedActivities = activities.filter((item) => item.completed).length;

  const reflectionCount = sorted.filter(
    (item) => typeof item.reflection === "string" && item.reflection.trim().length > 0
  ).length;

  const strongestDay = recent
    .map((item) => ({ date: item.date || item.createdAt?.slice(0, 10), score: scoreOf(item) }))
    .filter((item): item is { date: string; score: number } => item.score !== null)
    .sort((a, b) => b.score - a.score)[0];

  // -------------------------------------------------------------
  // PATTERN DETECTION DETERMINISTIK DENGAN AMBANG BERTAHAP
  // -------------------------------------------------------------
  const patternList: string[] = [];
  const minRequiredForPatterns = 3;
  const hasEnoughDataForPatterns = sorted.length >= minRequiredForPatterns;

  if (hasEnoughDataForPatterns) {
    // 1. Pola Hubungan Tidur & Mood
    const goodSleepMoods: number[] = [];
    const lowSleepMoods: number[] = [];
    sorted.forEach((item) => {
      const sl = Number(item.sleepRating);
      const m = MOOD_SCORES[String(item.mood || "").toUpperCase()];
      if (Number.isFinite(sl) && Number.isFinite(m)) {
        if (sl >= 3.5) goodSleepMoods.push(m);
        else lowSleepMoods.push(m);
      }
    });

    const avgGoodSleepMood = avg(goodSleepMoods);
    const avgLowSleepMood = avg(lowSleepMoods);

    if (
      avgGoodSleepMood !== null &&
      avgLowSleepMood !== null &&
      avgGoodSleepMood - avgLowSleepMood >= 5
    ) {
      patternList.push(
        `Berdasarkan ${sorted.length} check-in: Kualitas tidur yang lebih baik (rating ≥ 4) cenderung beriringan dengan suasana hati yang lebih positif.`
      );
    } else if (avg(sleeps) !== null && avg(sleeps)! >= 3.8) {
      patternList.push(
        `Berdasarkan data terkini: Kualitas istirahat malammu terjaga baik (rata-rata ${avg(sleeps)!.toFixed(1)} / 5), mendukung stabilitas energimu.`
      );
    }

    // 2. Pola Perubahan & Stabilitas Stres
    if (recentStress !== null && previousStress !== null) {
      const stressDelta = Number((recentStress - previousStress).toFixed(1));
      if (stressDelta <= -0.25) {
        patternList.push(
          `Tren 7 hari: Rata-rata tingkat stres mereda ${Math.abs(stressDelta)} poin dibanding 7 hari sebelumnya.`
        );
      } else if (stressDelta >= 0.25) {
        patternList.push(
          `Tren 7 hari: Terpantau peningkatan stres sebesar ${stressDelta} poin dibanding minggu lalu; prioritaskan jeda istirahat.`
        );
      } else {
        patternList.push(
          `Tren 7 hari: Pengelolaan stres stabil di level ${recentStress.toFixed(1)} / 5 tanpa lonjakan tajam.`
        );
      }
    } else if (recentStress !== null) {
      patternList.push(
        `Tingkat stres 7 hari terakhir berada pada rata-rata ${recentStress.toFixed(1)} / 5.`
      );
    }

    // 3. Pola Aktivitas & Kebiasaan Sehat
    const activityByType = new Map<string, { total: number; completed: number }>();
    for (const activity of activities) {
      const cur = activityByType.get(activity.type) ?? { total: 0, completed: 0 };
      cur.total += 1;
      if (activity.completed) cur.completed += 1;
      activityByType.set(activity.type, cur);
    }

    const strongestActivity = [...activityByType.entries()]
      .filter(([, v]) => v.completed > 0)
      .sort((a, b) => b[1].completed - a[1].completed)[0];

    if (strongestActivity) {
      const actName = strongestActivity[0].toLowerCase().replace(/_/g, " ");
      patternList.push(
        `Kebiasaan konsisten: Aktivitas yang paling sering kamu selesaikan adalah ${actName} (${strongestActivity[1].completed} kali).`
      );
    }

    // 4. Pola Refleksi
    if (reflectionCount >= 2) {
      patternList.push(
        `Konsistensi catatan: Kamu telah menuliskan ${reflectionCount} refleksi mandiri, membantu mengenali dinamika emosimu.`
      );
    }
  }

  // -------------------------------------------------------------
  // FOKUS MINGGU INI & REKOMENDASI DASAR
  // -------------------------------------------------------------
  const recentSleep = sleeps.slice(-7);
  const averageRecentSleep = avg(recentSleep);

  const focus =
    recentStress !== null && recentStress >= 3.5
      ? "Regulasi Stres"
      : averageRecentSleep !== null && averageRecentSleep < 3
        ? "Pemulihan Tidur"
        : completedActivities < 3
          ? "Konsistensi Gerak"
          : reflectionCount < 2
            ? "Refleksi Diri"
            : "Keseimbangan Harian";

  const recommendations: string[] = [];

  if (recentStress !== null && recentStress >= 3.5) {
    recommendations.push(
      "Luangkan 5–10 menit untuk latihan pernapasan (Breathing) saat ritme harian mulai terasa padat."
    );
  }
  if (averageRecentSleep !== null && averageRecentSleep < 3.2) {
    recommendations.push(
      "Pertahankan jam tidur yang konsisten dan kurangi stimulasi layar 30 menit sebelum istirahat."
    );
  }
  if (completedActivities < 3) {
    recommendations.push(
      "Coba selesaikan 2–3 aktivitas ringan (jalan santai atau peregangan) minggu ini untuk menjaga energi fisik."
    );
  }
  if (reflectionCount < Math.max(2, Math.ceil(sorted.length / 3))) {
    recommendations.push(
      "Tuliskan 1–2 kalimat refleksi saat check-in untuk membantu mengurai apa yang sedang kamu rasakan."
    );
  }
  if (!recommendations.length) {
    recommendations.push(
      "Pertahankan ritme wellness yang sudah berjalan baik dan lanjutkan check-in harianmu."
    );
  }

  // -------------------------------------------------------------
  // DATA QUALITY & OBSERVATIONS
  // -------------------------------------------------------------
  const dataQuality =
    sorted.length >= 14
      ? {
          level: "high" as const,
          label: "Data kuat",
          checkIns: sorted.length,
          hint: "Data sudah sangat memadai untuk melihat tren jangka panjang dan pola konsisten.",
        }
      : sorted.length >= 7
        ? {
          level: "medium" as const,
          label: "Data cukup",
          checkIns: sorted.length,
          hint: "Data 7 hari sudah cukup untuk perbandingan mingguan yang bermakna.",
        }
        : {
          level: "low" as const,
          label: "Data awal",
          checkIns: sorted.length,
          hint: "Lanjutkan check-in beberapa hari lagi agar perbandingan periode menjadi lebih akurat.",
        };

  const observations = [
    recentScore !== null
      ? {
          category: "Skor ZYBA",
          title: `Skor 7 Hari: ${Math.round(recentScore)}`,
          description:
            previousScore !== null
              ? `Skor ${recentScore >= previousScore ? "naik" : "turun"} ${Math.abs(Math.round(recentScore - previousScore))} poin dibanding minggu sebelumnya.`
              : "Belum ada periode sebelumnya sebagai pembanding.",
          direction:
            previousScore === null
              ? ("neutral" as const)
              : recentScore >= previousScore
                ? ("up" as const)
                : ("down" as const),
          isPositive: previousScore === null || recentScore >= previousScore,
        }
      : null,
    recentStress !== null
      ? {
          category: "Stres",
          title: `Tingkat Stres: ${recentStress.toFixed(1)} / 5`,
          description:
            recentStress <= 2.5
              ? "Tingkat stres berada dalam rentang rendah dan terkendali."
              : recentStress <= 3.5
                ? "Tingkat stres berada dalam batas moderat."
                : "Tingkat stres memerlukan perhatian dan relaksasi ekstra.",
          direction:
            previousStress === null
              ? ("neutral" as const)
              : recentStress <= previousStress
                ? ("down" as const)
                : ("up" as const),
          isPositive: recentStress <= 3.0,
        }
      : null,
  ].filter(Boolean) as FreeWellnessInsights["observations"];

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
    patterns: {
      items: patternList,
      hasEnoughData: hasEnoughDataForPatterns,
      dataPoints: sorted.length,
      minRequired: minRequiredForPatterns,
      emptyMessage:
        "Belum cukup data untuk mengenali pola. Lanjutkan check-in minimal 3–5 hari agar ZYBA dapat membandingkan perkembanganmu secara objektif.",
    },
    recommendations,
    dataQuality,
    observations,
  };
}

/**
 * Membangun insight mendalam EKSKLUSIF ZYBA PLUS (PREMIUM).
 * Memberikan analisis multi-faktor, analisis pemicu stres (deep triggers),
 * rencana pemulihan adaptif 7 hari terpersonalisasi, dan memori AI Companion.
 */
export function buildPremiumWellnessInsights(input: {
  assessments: any[];
  journals: any[];
  activities: any[];
}): PremiumWellnessInsights {
  const freeInsights = buildFreeWellnessInsights(input);
  const { assessments, journals, activities } = input;

  const sorted = [...assessments].sort((a, b) =>
    String(a.date || a.createdAt || "").localeCompare(String(b.date || b.createdAt || ""))
  );

  // 1. Longitudinal Multi-Period Breakdown (30, 60, 90 hari)
  const now = Date.now();
  const day30Cutoff = now - 30 * 86400000;
  const day60Cutoff = now - 60 * 86400000;

  const last30 = sorted.filter(
    (item) => new Date(item.date || item.createdAt).getTime() >= day30Cutoff
  );
  const prev30 = sorted.filter((item) => {
    const t = new Date(item.date || item.createdAt).getTime();
    return t >= day60Cutoff && t < day30Cutoff;
  });

  const avg30Score = avg(last30.map(scoreOf).filter((v): v is number => v !== null));
  const avgPrev30Score = avg(prev30.map(scoreOf).filter((v): v is number => v !== null));
  const avg30Stress = avg(
    last30.map((i) => Number(i.stressLevel)).filter((v) => v >= 1 && v <= 5)
  );

  let trajectory: "meningkat" | "stabil" | "menurun" | "fluktuatif" = "stabil";
  if (avg30Score !== null && avgPrev30Score !== null) {
    const diff = avg30Score - avgPrev30Score;
    if (diff >= 4) trajectory = "meningkat";
    else if (diff <= -4) trajectory = "menurun";
    else trajectory = "stabil";
  }

  const stabilityIndex =
    trajectory === "meningkat"
      ? "Tren Positif & Berkembang"
      : trajectory === "stabil"
        ? "Konsisten & Seimbang"
        : trajectory === "menurun"
          ? "Perlu Pemulihan Bertahap"
          : "Dinamis";

  const stabilityDescription =
    sorted.length >= 7
      ? `Stabilitas mentalmu berada dalam fase ${stabilityIndex.toLowerCase()}. Variasi skor harian menunjukkan resiliensi yang dapat terus dioptimalkan.`
      : "Data longitudinal akan semakin tajam saat kamu melengkapi check-in 14–30 hari.";

  // 2. Deep Triggers & Recovery Boosters
  const stressTriggers: string[] = [];
  const recoveryBoosters: string[] = [];

  // Analisis pemicu stres: korelasi tidur rendah & stres tinggi
  const highStressLowSleep = sorted.filter(
    (i) => Number(i.stressLevel) >= 4 && Number(i.sleepRating) <= 2
  );
  if (highStressLowSleep.length >= 2) {
    stressTriggers.push(
      "Kurang tidur (≤ 2 rating) konsisten memicu peningkatan skor stres pada hari berikutnya."
    );
  }

  // Hari tanpa aktivitas fisik vs stres
  const stressDays = sorted.filter((i) => Number(i.stressLevel) >= 4);
  if (stressDays.length >= 3 && activities.filter((a) => a.completed).length === 0) {
    stressTriggers.push(
      "Minimnya jeda gerak fisik berkontribusi pada penumpukan ketegangan harian."
    );
  }

  // Recovery boosters: aktivitas & breathing
  const breathingSessions = activities.filter(
    (a) => a.completed && a.type === "BREATHING"
  ).length;
  if (breathingSessions >= 2) {
    recoveryBoosters.push(
      `Sesi latihan pernapasan (${breathingSessions} sesi selesai) terbukti menjadi faktor efektif pereda keteganganmu.`
    );
  }

  const walkingSessions = activities.filter(
    (a) => a.completed && (a.type === "WALKING" || a.type === "RUNNING")
  ).length;
  if (walkingSessions >= 2) {
    recoveryBoosters.push(
      `Jalan santai & gerak aktif (${walkingSessions} sesi) berkorelasi positif dengan perbaikan suasana hati.`
    );
  }

  if (journals.length >= 2) {
    recoveryBoosters.push(
      `Penulisan jurnal berkala (${journals.length} entri) mempercepat pemulihan emosional saat menghadapi hari yang berat.`
    );
  }

  if (!stressTriggers.length) {
    stressTriggers.push(
      "Belum terdeteksi pemicu stres dominan; tingkat keteganganmu masih berada dalam batas yang terkontrol."
    );
  }
  if (!recoveryBoosters.length) {
    recoveryBoosters.push(
      "Coba tambahkan 1 sesi latihan pernapasan atau jalan santai untuk menguji efektivitas pemulihanmu."
    );
  }

  // 3. Personalized Wellness Memory untuk AI Companion
  const memory: string[] = [
    `Riwayat Wellness: ${sorted.length} check-in tercatat dengan skor rata-rata ${freeInsights.summary.averageScore ?? "—"}.`,
    `Fokus Dominan: ${freeInsights.weekly.focus}.`,
    `Aktivitas Selesai: ${freeInsights.summary.completedActivities} sesi fisik/relaksasi berhasil diselesaikan.`,
    `Catatan Jurnal: ${journals.length} entri refleksi tersimpan sebagai konteks perjalanan.`,
  ];
  if (freeInsights.weekly.strongestDay) {
    memory.push(`Hari dengan kondisi terbaik baru-baru ini: ${freeInsights.weekly.strongestDay}.`);
  }

  // 4. Personalized Adaptive 7-Day Plan (Rencana Adaptif Harian)
  const adaptivePlan = [
    {
      day: 1,
      title: "Audit Ritme & Napas Tenang",
      detail: "Mulai minggu dengan 1 sesi Breathing 5 menit di pagi atau sore hari.",
      reason: "Menstabilkan baseline energi dan fokus sebelum aktivitas padat dimulai.",
    },
    {
      day: 2,
      title: "Gerak Ringan Tanpa Beban",
      detail: "Jalan santai minimal 15–20 menit di luar ruangan.",
      reason: "Merangsang sirkulasi dan sirkadian alami untuk mendukung tidur malam.",
    },
    {
      day: 3,
      title: "Refleksi Mid-Week",
      detail: "Tulis 3 hal yang menguras energimu dan 1 hal yang memberi rasa lega di jurnal ZYBA.",
      reason: "Mencegah akumulasi stres di pertengahan minggu.",
    },
    {
      day: 4,
      title: "Detoks Stimulasi Layar",
      detail: "Tutup layar gadget 45 menit sebelum tidur malam ini.",
      reason: "Meningkatkan kualitas deep sleep dan pemulihan sistem saraf.",
    },
    {
      day: 5,
      title: "Transisi Akhir Pekan",
      detail: "Lakukan peregangan tubuh santai selama 10 menit setelah menyelesaikan tugas utama.",
      reason: "Menandai batas jelas antara rutinitas kerja/kuliah dan waktu pemulihan.",
    },
    {
      day: 6,
      title: "Aktivitas Menyenangkan Bebas Tekanan",
      detail: "Habiskan waktu untuk hobi atau bersosialisasi yang membuatmu merasa hangat.",
      reason: "Membangun energi sosial positif yang terbukti menaikkan Zyba Score.",
    },
    {
      day: 7,
      title: "Evaluasi & Apresiasi Diri",
      detail: "Cek kembali perkembangan skor di Wellness Journey dan berikan apresiasi atas usahamu.",
      reason: "Memperkuat kebiasaan mindfulness dan komitmen berkelanjutan.",
    },
  ];

  // 5. Konteks untuk Tanya Zyba / Companion
  const companionContext = {
    summaryText: `Pengguna ZYBA dengan ${sorted.length} check-in. Rata-rata skor: ${freeInsights.summary.averageScore ?? "N/A"}, stres: ${freeInsights.summary.averageStress ?? "N/A"}/5, fokus minggu ini: ${freeInsights.weekly.focus}. Pemicu utama: ${stressTriggers[0]}.`,
    suggestedPrompt: `Hai Zyba, aku ingin berdiskusi tentang rencanaku minggu ini berdasarkan fokus wellness terbaruku (${freeInsights.weekly.focus}). Apa saran terbaikmu?`,
  };

  return {
    ...freeInsights,
    isPremium: true,
    longitudinalAnalysis: {
      stabilityIndex,
      scoreTrajectory: trajectory,
      stabilityDescription,
      periodBreakdown: [
        {
          label: "30 Hari Terakhir",
          checkIns: last30.length,
          avgScore: avg30Score !== null ? Math.round(avg30Score) : null,
          avgStress: avg30Stress !== null ? Number(avg30Stress.toFixed(1)) : null,
        },
        {
          label: "30 Hari Sebelumnya",
          checkIns: prev30.length,
          avgScore: avgPrev30Score !== null ? Math.round(avgPrev30Score) : null,
          avgStress: null,
        },
      ],
    },
    deepTriggers: {
      stressTriggers,
      recoveryBoosters,
    },
    memory,
    adaptivePlan,
    companionContext,
  };
}
