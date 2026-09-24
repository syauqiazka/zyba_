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

// ---------- GET: Cek status hari ini + riwayat harian ----------

export async function GET(req: NextRequest) {
  const todayDate = new Date().toISOString().slice(0, 10);
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

    const { searchParams } = new URL(req.url);
    const checkDate = searchParams.get("date") || todayDate;

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
      sleepRating,
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
    } = body as {
      mood: string;
      stressLevel?: number;
      stressRating?: number;
      sleepRating?: number;
      energyTags?: string[];
      reflection?: string;
      expressionText?: string;
      goal?: string;
      gender?: string;
      age?: number | string;
      weight?: number | string;
      soughtHelp?: boolean | null;
      physicalSymptoms?: string[];
      mentalSymptoms?: string[];
      medications?: string;
    };

    if (!mood) {
      return NextResponse.json({ error: "Mood wajib diisi" }, { status: 400 });
    }

    const todayDate = new Date().toISOString().slice(0, 10);

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

    // Buat record DailyAssessment
    const record = await (accountDb as any).dailyAssessment.create({
      data: {
        userId,
        date: todayDate,
        mood: mood as any,
        stressLevel: finalStress,
        sleepRating: finalSleep,
        energyTags: energyTags || [],
        reflection: freeText || null,
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
        75, // fallback baseline
        finalStress
      );
    } catch (saveErr) {
      console.warn("[dailyAssessment] userRepository.saveAssessment fallback:", saveErr);
    }

    // Hitung ulang Zyba Score dinamis pengguna
    let updatedScore = 75;
    try {
      const { calculateZybaScore } = await import("@/backend/scoring/zybaScore");
      updatedScore = await calculateZybaScore(userId);
      await accountDb.user.update({
        where: { id: userId },
        data: { zybaScore: updatedScore, stressLevel: finalStress },
      });
    } catch (scoreErr) {
      console.warn("[dailyAssessment] calculateZybaScore fallback:", scoreErr);
    }

    return NextResponse.json({
      success: true,
      record,
      zybaScore: updatedScore,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
    });
  } catch (err: any) {
    console.error("[POST /api/daily-assessment]", err);
    return NextResponse.json({ error: err.message || "Gagal menyimpan assessment harian" }, { status: 500 });
  }
}
