import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";

// ---------- Helper: Ambil userId dari session JWT ----------

async function getCurrentUserId(req: NextRequest): Promise<string> {
  const token = req.cookies.get("auth-token")?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session?.userId) return session.userId;
  }
  // Fallback untuk dev: ambil user pertama dari DB (bukan untuk produksi)
  const user = await accountDb.user.findFirst({ select: { id: true } });
  if (!user) throw new Error("No authenticated user found.");
  return user.id;
}

// Helper: Dapatkan tanggal YYYY-MM-DD dalam zona waktu Indonesia (WIB / Asia/Jakarta) atau client
function getTodayDateString(clientDate?: string | null): string {
  if (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate)) {
    return clientDate;
  }
  // Default timezone Asia/Jakarta (WIB = UTC+7) agar reset tepat jam 00:00 malam waktu lokal
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// ---------- GET: Cek status hari ini + riwayat harian ----------

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const checkDate = getTodayDateString(searchParams.get("date"));
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
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    }

    let todayRecord = null;
    let history: any[] = [];
    let total = 0;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    try {
      [todayRecord, [history, total]] = await Promise.all([
        (accountDb as any).dailyAssessment.findUnique({
          where: { userId_date: { userId, date: checkDate } },
        }),
        Promise.all([
          (accountDb as any).dailyAssessment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          (accountDb as any).dailyAssessment.count({ where: { userId } }),
        ]),
      ]);
    } catch (dbErr) {
      console.warn("[dailyAssessment db fallback]", dbErr);
    }

    return NextResponse.json({
      today: todayRecord || null,
      todayDate,
      hasCompletedToday: !!todayRecord,
      history: history || [],
      pagination: {
        page,
        limit,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      today: null,
      todayDate,
      hasCompletedToday: false,
      history: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  }
}

// ---------- POST: Buat Assessment Harian (Hanya 1x per hari) ----------

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const body = await req.json();

    const {
      mood,
      stressLevel,
      stressRating,
      anxietyLevel,
      satisfactionLevel,
      productivityLevel,
      meTimeLevel,
      sleepRating,
      sleepHours,
      energyLevel,
      eatingHabit,
      physicalActivity,
      socialConnection,
      socialSupport,
      communityInteraction,
      gratitude,
      energyTags,
      reflection,
      expressionText,
      goal,
      gender,
      age,
      weight,
      soughtHelp,
      physicalSymptoms,
      mentalSymptoms,
      medications,
    } = body as any;

    if (!mood) {
      return NextResponse.json({ error: "Mood wajib diisi" }, { status: 400 });
    }

    const todayDate = getTodayDateString(body.clientDate || body.date);

    // 🔒 PENTING: Kunci 1x per hari (tidak bisa check-in lagi di hari yang sama)
    const existing = await (accountDb as any).dailyAssessment.findUnique({
      where: { userId_date: { userId, date: todayDate } },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Kamu sudah menyelesaikan Assessment Harian hari ini. Evaluasi hanya dapat dilakukan 1 kali per hari.",
          hasCompletedToday: true,
          record: existing,
        },
        { status: 400 }
      );
    }

    const freeText = reflection || expressionText || "";
    // Deteksi risiko bahaya diri pada teks ekspresi/refleksi bebas (AGENTS.md Bagian 8 & 11)
    const isRisk = freeText ? detectRisk(freeText) : false;

    const finalStress = stressLevel !== undefined ? Number(stressLevel) : (stressRating !== undefined ? Number(stressRating) : 2);
    const finalSleep = sleepRating !== undefined && sleepRating !== null ? Number(sleepRating) : null;

    // Hitung Zyba Score langsung dari 15 pertanyaan (Mental, Fisik, Sosial)
    const { calculateZybaScoreFromDailyAnswers } = await import("@/backend/scoring/zybaScore");
    const scores = calculateZybaScoreFromDailyAnswers({
      mood,
      stressLevel: finalStress,
      anxietyLevel: Number(anxietyLevel) || finalStress,
      satisfactionLevel: Number(satisfactionLevel) || 3,
      productivityLevel: Number(productivityLevel) || 3,
      meTimeLevel: Number(meTimeLevel) || 3,
      sleepRating: finalSleep || 3,
      sleepHours: sleepHours ?? 3,
      energyLevel: Number(energyLevel) || 3,
      eatingHabit: Number(eatingHabit) || 3,
      physicalActivity: Number(physicalActivity) || 3,
      socialConnection: Number(socialConnection) || 3,
      socialSupport: Number(socialSupport) || 3,
      communityInteraction: Number(communityInteraction) || 3,
      gratitude: gratitude || undefined,
      reflection: freeText || undefined,
    });

    // Buat record DailyAssessment
    const record = await (accountDb as any).dailyAssessment.create({
      data: {
        userId,
        date: todayDate,
        mood: mood as any,
        stressLevel: finalStress,
        sleepRating: finalSleep,
        energyTags: energyTags || [],
        reflection: gratitude ? `[Hal Positif]: ${gratitude}\n[Refleksi]: ${freeText}` : (freeText || null),
        flaggedForRisk: isRisk,
      },
    });

    // Simpan juga ke profil kesehatan assessment pengguna
    try {
      const { userRepository } = await import("@/backend/auth/userRepository");
      await userRepository.saveAssessment(
        userId,
        {
          goal: goal || "Stress Relief & Relaxation",
          gender: gender || "Pria",
          age: age ? Number(age) : 21,
          weight: weight ? Number(weight) : 65,
          mood,
          soughtHelp: soughtHelp ?? false,
          physicalSymptoms: physicalSymptoms || [],
          sleepRating: finalSleep || 3,
          stressRating: finalStress,
          medications: medications || "Tidak ada",
          mentalSymptoms: mentalSymptoms || [],
          expressionText: freeText,
        },
        scores.zybaScore,
        finalStress
      );
    } catch (saveErr) {
      console.warn("[dailyAssessment] userRepository.saveAssessment fallback:", saveErr);
    }

    // Update Zyba Score pengguna di database
    try {
      await accountDb.user.update({
        where: { id: userId },
        data: { zybaScore: scores.zybaScore, stressLevel: finalStress },
      });
    } catch (userErr) {
      console.warn("[dailyAssessment] user update fallback:", userErr);
    }

    return NextResponse.json({
      success: true,
      record,
      zybaScore: scores.zybaScore,
      scores,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
    });
  } catch (err: any) {
    console.error("[POST /api/daily-assessment]", err);
    return NextResponse.json({ error: err.message || "Gagal menyimpan assessment harian" }, { status: 500 });
  }
}
