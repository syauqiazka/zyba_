import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import { buildFreeWellnessInsights } from "@/lib/wellness/insightsService";

/**
 * GET /api/wellness/insights
 * Endpoint GRATIS untuk semua pengguna (Free maupun Plus).
 * Mengembalikan ringkasan data wellness milik pengguna yang login:
 * - Summary Zyba Score, mood, stres, dan tidur
 * - Weekly Insight (skor & stres 7 hari vs minggu sebelumnya, hari terkuat, fokus)
 * - Pattern Detection deterministik dengan ambang data minimum dan empty state yang jelas
 * - Rekomendasi dasar yang relevan dengan kebiasaan pengguna
 * - Indikator kualitas & kecukupan data
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Sesi login diperlukan" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const userId = session.userId;

    // Ambil data milik pengguna yang sedang login
    const [assessments, journals, activities] = await Promise.all([
      accountDb.dailyAssessment.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 90,
        select: {
          date: true,
          mood: true,
          stressLevel: true,
          sleepRating: true,
          reflection: true,
          calculatedScore: true,
          createdAt: true,
        },
      }),
      accountDb.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { createdAt: true, mood: true, title: true },
      }),
      accountDb.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 90,
        select: { completed: true, type: true, createdAt: true },
      }),
    ]);

    const data = buildFreeWellnessInsights({ assessments, journals, activities });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, max-age=20, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[WellnessInsights GET] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat insight wellness" },
      { status: 500 }
    );
  }
}
