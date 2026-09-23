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

// ---------- POST: Buat atau update Assessment Harian (upsert by date) ----------

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const body = await req.json();

    const {
      mood,
      stressLevel,
      sleepRating,
      energyTags,
      reflection,
    } = body as {
      mood: string;
      stressLevel?: number;
      sleepRating?: number;
      energyTags?: string[];
      reflection?: string;
    };

    if (!mood) {
      return NextResponse.json({ error: "Mood wajib diisi" }, { status: 400 });
    }

    // Deteksi risiko bahaya diri pada teks refleksi bebas (AGENTS.md Bagian 8 & 11)
    const isRisk = reflection ? detectRisk(reflection) : false;

    const todayDate = new Date().toISOString().slice(0, 10);

    // Upsert — satu record per user per hari, bisa diedit
    const record = await (accountDb as any).dailyAssessment.upsert({
      where: { userId_date: { userId, date: todayDate } },
      update: {
        mood: mood as any,
        stressLevel: stressLevel !== undefined ? Number(stressLevel) : null,
        sleepRating: sleepRating !== undefined ? Number(sleepRating) : null,
        energyTags: energyTags || [],
        reflection: reflection || null,
        flaggedForRisk: isRisk,
      },
      create: {
        userId,
        date: todayDate,
        mood: mood as any,
        stressLevel: stressLevel !== undefined ? Number(stressLevel) : null,
        sleepRating: sleepRating !== undefined ? Number(sleepRating) : null,
        energyTags: energyTags || [],
        reflection: reflection || null,
        flaggedForRisk: isRisk,
      },
    });

    return NextResponse.json({
      success: true,
      record,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
    });
  } catch (err: any) {
    console.error("[POST /api/daily-assessment]", err);
    return NextResponse.json({ error: err.message || "Gagal menyimpan assessment harian" }, { status: 500 });
  }
}
