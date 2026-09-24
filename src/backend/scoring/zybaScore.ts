import { accountDb } from "@/backend/db/accountClient";
import { communityDb } from "@/backend/db/communityClient";

const WINDOW_DAYS = 7; // rolling 7-day window

// Mood value map: DEPRESSED=1 ... OVERJOYED=5
const MOOD_VALUE: Record<string, number> = {
  DEPRESSED: 1,
  SAD: 2,
  NEUTRAL: 3,
  HAPPY: 4,
  OVERJOYED: 5,
};

// Helper: Mental score (50% weight)
// Based on recent MoodEntries: avg mood (0-100) minus avg stress penalty
function calculateMentalScore(
  entries: { mood: string; stressLevel: number | null }[]
): number {
  if (entries.length === 0) return 60; // neutral baseline if no data

  const avgMood =
    entries.reduce((sum, e) => sum + (MOOD_VALUE[e.mood] ?? 3), 0) /
    entries.length;
  // Normalise mood 1-5 to 0-100
  const moodScore = ((avgMood - 1) / 4) * 100;

  // Stress penalty: avg stress 1-5 => subtract up to 25 pts
  const validStress = entries.filter((e) => e.stressLevel !== null);
  let stressPenalty = 0;
  if (validStress.length > 0) {
    const avgStress =
      validStress.reduce((sum, e) => sum + (e.stressLevel ?? 3), 0) /
      validStress.length;
    stressPenalty = ((avgStress - 1) / 4) * 25;
  }

  return Math.max(0, Math.min(100, moodScore - stressPenalty));
}

// Helper: Fisik score (25% weight)
// Based on activity completions in rolling window
function calculateFisikScore(
  activities: { completed: boolean }[]
): number {
  const completed = activities.filter((a) => a.completed === true).length;
  if (completed === 0) return 40; // baseline if no activities logged
  // Consistency: max 1 activity per day = 100
  const score = Math.min(100, 40 + (completed / WINDOW_DAYS) * 60);
  return Math.round(score);
}

// Helper: Sosial score (25% weight)
// Based on community participation: posts + comments in rolling window
function calculateSosialScore(postCount: number, commentCount: number): number {
  const totalActions = postCount + commentCount;
  if (totalActions === 0) return 40; // baseline if no community activity
  // Soft cap: 7 actions over 7 days => 100 pts
  const score = Math.min(100, 40 + (totalActions / 7) * 60);
  return Math.round(score);
}

// Main export: calculate Zyba Score on-demand for a userId
export async function calculateZybaScore(userId: string): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - WINDOW_DAYS);

  // Run all queries concurrently
  const [moodEntries, activities, postCount, commentCount] = await Promise.all([
    // Mental: mood + stress from MoodEntry
    accountDb.moodEntry.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { mood: true, stressLevel: true },
    }),
    // Fisik: completed activity logs
    accountDb.activityLog.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { completed: true },
    }),
    // Sosial: community posts (cross-DB, graceful fallback)
    communityDb.communityPost
      .count({ where: { userId, createdAt: { gte: since } } })
      .catch(() => 0),
    // Sosial: community comments (cross-DB, graceful fallback)
    communityDb.communityComment
      .count({ where: { userId, createdAt: { gte: since } } })
      .catch(() => 0),
  ]);

  const mentalScore = calculateMentalScore(moodEntries);
  const fisikScore = calculateFisikScore(activities);
  const sosialScore = calculateSosialScore(postCount, commentCount);

  // Bobot: Mental 50%, Fisik 25%, Sosial 25%
  const zybaScore = Math.round(
    mentalScore * 0.5 + fisikScore * 0.25 + sosialScore * 0.25
  );

  return Math.max(0, Math.min(100, zybaScore));
}

// Condition label from score
export function scoreToCondition(score: number): string {
  if (score >= 80) return "Kondisi Baik";
  if (score >= 60) return "Cukup Baik";
  return "Perlu Perhatian";
}

// ---------- D.4: Kalkulator Zyba Score dari 15 Pertanyaan Harian (Mental / Fisik / Sosial) ----------

export interface DailyAssessmentAnswers {
  // Mental (6 pertanyaan)
  mood: string; // DEPRESSED, SAD, NEUTRAL, HAPPY, OVERJOYED
  stressLevel: number; // 1-5 (1=tenang, 5=sangat tertekan)
  anxietyLevel?: number; // 1-5 (1=tenang, 5=sangat cemas)
  satisfactionLevel?: number; // 1-5 (1=tidak puas, 5=sangat puas)
  productivityLevel?: number; // 1-5 (1=terdistraksi, 5=fokus & produktif)
  meTimeLevel?: number; // 1-5 (1=kurang sekali, 5=sangat cukup)

  // Fisik (5 pertanyaan)
  sleepRating: number; // 1-5
  sleepHours?: number | string; // rating 1-5 atau pilihan durasi
  energyLevel?: number; // 1-5 (1=drop/lelah, 5=sangat bugar)
  eatingHabit?: number; // 1-5 (1=tidak teratur, 5=sangat teratur & sehat)
  physicalActivity?: number; // 1-5 (1=sedentari, 5=olahraga/aktif)

  // Sosial (3 pertanyaan)
  socialConnection?: number; // 1-5 (1=terisolasi, 5=sangat terhubung)
  socialSupport?: number; // 1-5 (1=tidak didukung, 5=didengar & didukung)
  communityInteraction?: number; // 1-5 (1=minim, 5=aktif ngobrol & berkomunitas)

  // Gratitude & Refleksi
  gratitude?: string;
  reflection?: string;
}

export function calculateZybaScoreFromDailyAnswers(answers: DailyAssessmentAnswers): {
  zybaScore: number;
  mentalScore: number;
  fisikScore: number;
  sosialScore: number;
  condition: string;
} {
  // 1. Aspek Mental (6 pertanyaan, Bobot 50%)
  const moodVal = MOOD_VALUE[answers.mood] ?? 3;
  const moodScore = ((moodVal - 1) / 4) * 100;
  const stressScore = ((5 - (answers.stressLevel || 3)) / 4) * 100; // stres terbalik
  const anxietyScore = ((5 - (answers.anxietyLevel || answers.stressLevel || 3)) / 4) * 100; // cemas terbalik
  const satisfactionScore = (((answers.satisfactionLevel || 3) - 1) / 4) * 100;
  const productivityScore = (((answers.productivityLevel || 3) - 1) / 4) * 100;
  const meTimeScore = (((answers.meTimeLevel || 3) - 1) / 4) * 100;

  const mentalScore = Math.round(
    (moodScore + stressScore + anxietyScore + satisfactionScore + productivityScore + meTimeScore) / 6
  );

  // 2. Aspek Fisik (5 pertanyaan, Bobot 25%)
  const sleepScore = (((answers.sleepRating || 3) - 1) / 4) * 100;
  
  // Durasi tidur (skor optimal)
  let sleepHoursScore = 80;
  if (answers.sleepHours === 4 || answers.sleepHours === "7-8 jam") sleepHoursScore = 100;
  else if (answers.sleepHours === 3 || answers.sleepHours === "6-7 jam") sleepHoursScore = 85;
  else if (answers.sleepHours === 5 || answers.sleepHours === "> 8 jam") sleepHoursScore = 80;
  else if (answers.sleepHours === 2 || answers.sleepHours === "4-5 jam") sleepHoursScore = 55;
  else if (answers.sleepHours === 1 || answers.sleepHours === "< 4 jam") sleepHoursScore = 30;

  const energyScore = (((answers.energyLevel || 3) - 1) / 4) * 100;
  const eatingScore = (((answers.eatingHabit || 3) - 1) / 4) * 100;
  const activityScore = (((answers.physicalActivity || 3) - 1) / 4) * 100;

  const fisikScore = Math.round(
    (sleepScore + sleepHoursScore + energyScore + eatingScore + activityScore) / 5
  );

  // 3. Aspek Sosial (3 pertanyaan, Bobot 25%)
  const connectionScore = (((answers.socialConnection || 3) - 1) / 4) * 100;
  const supportScore = (((answers.socialSupport || 3) - 1) / 4) * 100;
  const communityScore = (((answers.communityInteraction || 3) - 1) / 4) * 100;

  const sosialScore = Math.round((connectionScore + supportScore + communityScore) / 3);

  // Bobot Resmi: Mental 50%, Fisik 25%, Sosial 25%
  const zybaScore = Math.max(
    0,
    Math.min(100, Math.round(mentalScore * 0.5 + fisikScore * 0.25 + sosialScore * 0.25))
  );

  return {
    zybaScore,
    mentalScore,
    fisikScore,
    sosialScore,
    condition: scoreToCondition(zybaScore),
  };
}
