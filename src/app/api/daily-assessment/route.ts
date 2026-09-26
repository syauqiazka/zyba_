import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";
import { checkAndUnlock } from "@/lib/achievements/engine";

// =====================================================
// USER ID
// =====================================================

async function getCurrentUserId(req: NextRequest): Promise<string> {
  const token = req.cookies.get("auth-token")?.value;

  if (token) {
    const session = await verifySessionToken(token);

    if (session?.userId) {
      return session.userId;
    }
  }

  // Fallback development.
  // Jangan digunakan untuk production.
  const user = await accountDb.user.findFirst({
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  return user.id;
}

// =====================================================
// TANGGAL WIB
// =====================================================

function getTodayDateString(
  clientDate?: string | null
): string {
  if (
    clientDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(clientDate)
  ) {
    return clientDate;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// =====================================================
// FAST IN-MEMORY CACHE (TTL 8s)
// Mengeliminasi query Neon DB berulang saat render Dashboard / Mood
// =====================================================
const dailyAssessmentCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 8000;

function invalidateDailyAssessmentCache(userId?: string) {
  if (userId) {
    for (const key of dailyAssessmentCache.keys()) {
      if (key.startsWith(userId)) dailyAssessmentCache.delete(key);
    }
  } else {
    dailyAssessmentCache.clear();
  }
}

// =====================================================
// GET
// =====================================================

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const checkDate = getTodayDateString(
    searchParams.get("date")
  );

  const todayDate = checkDate;

  try {
    let userId: string;

    try {
      userId = await getCurrentUserId(req);
    } catch {
      return NextResponse.json({
        today: null,
        todayDate,
        hasCompletedToday: false,
        history: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const page = Math.max(
      1,
      parseInt(
        searchParams.get("page") || "1",
        10
      )
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        parseInt(
          searchParams.get("limit") || "10",
          10
        )
      )
    );

    // Cek cache
    const cacheKey = `${userId}:${page}:${limit}:${checkDate}`;
    const cached = dailyAssessmentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "private, max-age=5, stale-while-revalidate=15",
        },
      });
    }

    const skip = (page - 1) * limit;

    const [todayRecord, history, total] =
      await Promise.all([
        accountDb.dailyAssessment.findUnique({
          where: {
            userId_date: {
              userId,
              date: checkDate,
            },
          },
        }),

        accountDb.dailyAssessment.findMany({
          where: {
            userId,
          },
          orderBy: [
            {
              date: "desc",
            },
            {
              createdAt: "desc",
            },
          ],
          skip,
          take: limit,
        }),

        accountDb.dailyAssessment.count({
          where: {
            userId,
          },
        }),
      ]);

    const responseData = {
      today: todayRecord || null,
      todayDate,
      hasCompletedToday: !!todayRecord,
      history: history || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: total > 0 ? Math.ceil(total / limit) : 0,
      },
    };

    dailyAssessmentCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    });

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "private, max-age=5, stale-while-revalidate=15",
      },
    });
  } catch (error: any) {
    console.error(
      "[GET /api/daily-assessment]",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Gagal mengambil assessment harian",
        today: null,
        todayDate,
        hasCompletedToday: false,
        history: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// POST
// 1 ASSESSMENT PER HARI
// =====================================================

export async function POST(req: NextRequest) {
  try {
    const userId =
      await getCurrentUserId(req);

    const body =
      await req.json();

    const {
      mood,

      // Mental
      stressLevel,
      stressRating,
      anxietyLevel,
      satisfactionLevel,
      productivityLevel,
      meTimeLevel,

      // Fisik
      sleepRating,
      sleepHours,
      energyLevel,
      eatingHabit,
      physicalActivity,

      // Sosial
      socialConnection,
      socialSupport,
      communityInteraction,

      // Refleksi
      gratitude,
      reflection,
      expressionText,

      // Context
      goal,
      gender,
      age,
      weight,
      soughtHelp,
      physicalSymptoms,
      mentalSymptoms,
      medications,
      energyTags,
    } = body as any;

    // =================================================
    // VALIDASI
    // =================================================

    if (!mood) {
      return NextResponse.json(
        {
          error:
            "Mood wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const todayDate =
      getTodayDateString(
        body.clientDate ||
        body.date
      );

    // =================================================
    // CEK 1X PER HARI
    // =================================================

    const existing =
      await accountDb.dailyAssessment.findUnique({
        where: {
          userId_date: {
            userId,
            date: todayDate,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Kamu sudah menyelesaikan Assessment Harian hari ini. Evaluasi hanya dapat dilakukan 1 kali per hari.",

          hasCompletedToday: true,

          record: existing,
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // REFLEKSI
    // =================================================

    const freeText =
      reflection ||
      expressionText ||
      "";

    const isRisk =
      freeText
        ? detectRisk(freeText)
        : false;

    // =================================================
    // NORMALISASI NILAI
    // =================================================

    const finalStress =
      stressLevel !== undefined
        ? Number(stressLevel)
        : stressRating !== undefined
          ? Number(stressRating)
          : 2;

    const finalSleep =
      sleepRating !== undefined &&
        sleepRating !== null
        ? Number(sleepRating)
        : 3;

    // =================================================
    // HITUNG ZYBA SCORE
    // =================================================

    const {
      calculateZybaScoreFromDailyAnswers,
    } = await import(
      "@/backend/scoring/zybaScore"
    );

    const scores =
      calculateZybaScoreFromDailyAnswers({
        mood,

        stressLevel:
          finalStress,

        anxietyLevel:
          Number(anxietyLevel) ||
          finalStress,

        satisfactionLevel:
          Number(
            satisfactionLevel
          ) || 3,

        productivityLevel:
          Number(
            productivityLevel
          ) || 3,

        meTimeLevel:
          Number(
            meTimeLevel
          ) || 3,

        sleepRating:
          finalSleep,

        sleepHours:
          sleepHours ?? 3,

        energyLevel:
          Number(energyLevel) ||
          3,

        eatingHabit:
          Number(eatingHabit) ||
          3,

        physicalActivity:
          Number(
            physicalActivity
          ) || 3,

        socialConnection:
          Number(
            socialConnection
          ) || 3,

        socialSupport:
          Number(
            socialSupport
          ) || 3,

        communityInteraction:
          Number(
            communityInteraction
          ) || 3,

        gratitude:
          gratitude ||
          undefined,

        reflection:
          freeText ||
          undefined,
      });

    // =================================================
    // SIMPAN DAILY ASSESSMENT
    // =================================================

    const record =
      await accountDb.dailyAssessment.create({
        data: {
          userId,

          date:
            todayDate,

          mood:
            mood as any,

          stressLevel:
            finalStress,

          sleepRating:
            finalSleep,

          energyTags:
            Array.isArray(
              energyTags
            )
              ? energyTags
              : [],

          reflection:
            gratitude
              ? `[Hal Positif]: ${gratitude}\n[Refleksi]: ${freeText}`
              : freeText || null,

          flaggedForRisk:
            isRisk,

          // ⭐ PENTING
          // SCORE ASSESSMENT INI DISIMPAN
          calculatedScore:
            scores.zybaScore,
        },
      });

    // =================================================
    // UPDATE USER SCORE TERBARU
    // =================================================

    await accountDb.user.update({
      where: {
        id: userId,
      },

      data: {
        zybaScore:
          scores.zybaScore,

        stressLevel:
          finalStress,

        onboardingCompleted:
          true,
      },
    });

    // =================================================
    // SIMPAN ASSESSMENT PROFILE
    // =================================================

    try {
      const {
        userRepository,
      } = await import(
        "@/backend/auth/userRepository"
      );

      await userRepository.saveAssessment(
        userId,

        {
          goal:
            goal ||
            "Stress Relief & Relaxation",

          gender:
            gender ||
            "Pria",

          age:
            age
              ? Number(age)
              : 21,

          weight:
            weight
              ? Number(weight)
              : 65,

          mood,

          soughtHelp:
            soughtHelp ??
            false,

          physicalSymptoms:
            Array.isArray(
              physicalSymptoms
            )
              ? physicalSymptoms
              : [],

          sleepRating:
            finalSleep,

          stressRating:
            finalStress,

          medications:
            medications ||
            "Tidak ada",

          mentalSymptoms:
            Array.isArray(
              mentalSymptoms
            )
              ? mentalSymptoms
              : [],

          expressionText:
            freeText,
        },

        scores.zybaScore,

        finalStress
      );
    } catch (error) {
      console.warn(
        "[dailyAssessment] saveAssessment gagal:",
        error
      );
    }

    // Invalidate caches immediately so dashboard & assessment update instantly
    invalidateDailyAssessmentCache(userId);

    // Achievement check (fire-and-forget)
    checkAndUnlock(userId, { type: "mood_checkin" }).catch(() => {});
    checkAndUnlock(userId, { type: "login" }).catch(() => {});

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      record,

      zybaScore:
        scores.zybaScore,

      scores,

      isRisk,

      crisisResources:
        isRisk
          ? CRISIS_RESOURCES
          : null,
    });
  } catch (error: any) {
    console.error(
      "[POST /api/daily-assessment]",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Gagal menyimpan assessment harian",
      },
      {
        status: 500,
      }
    );
  }
}