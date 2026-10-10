import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import { getUserPlan } from "@/backend/billing/entitlements";
import { companionDb } from "@/backend/db/companionClient";
import {
  buildPremiumWellnessInsights,
  PremiumWellnessInsights,
} from "@/lib/wellness/insightsService";

const CACHE_TTL_MS = 60_000;

/**
 * GET /api/premium/insights
 * Endpoint KHUSUS ZYBA PLUS (PREMIUM).
 * Memvalidasi autentikasi dan status langganan server-side.
 * Menyediakan nilai tambah mendalam:
 * - Analisis longitudinal multi-periode (30–90 hari) & trajectory
 * - Deep Triggers & Recovery Boosters (pemicu stres vs faktor pemulihan)
 * - Personalized Adaptive 7-Day Plan (Day 1 s/d Day 7 berdasar data unik)
 * - Personalized Wellness Memory & integrasi konteks untuk Tanya Zyba
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

    // Verifikasi entitlement server-side
    const plan = await getUserPlan(userId);
    if (plan !== "PLUS") {
      return NextResponse.json(
        {
          error: "Fitur ini khusus untuk pelanggan ZYBA Plus.",
          code: "PREMIUM_REQUIRED",
          freeInsightsAvailableAt: "/wellness-journey",
        },
        { status: 403 }
      );
    }

    // Cek cache companion DB
    let cached: { expiresAt: Date; data: unknown } | null = null;
    try {
      cached = await companionDb.premiumInsightCache.findUnique({
        where: { userId },
        select: { expiresAt: true, data: true },
      });
    } catch (cacheError) {
      console.warn("[PremiumInsights] Cache read unavailable; computing fresh:", cacheError);
    }

    if (cached && cached.expiresAt.getTime() > Date.now()) {
      return NextResponse.json(cached.data as PremiumWellnessInsights, {
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
        },
      });
    }

    // Ambil data milik pengguna
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

    const data = buildPremiumWellnessInsights({ assessments, journals, activities });
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS);

    try {
      await companionDb.premiumInsightCache.upsert({
        where: { userId },
        create: {
          id: `premium-insight:${userId}`,
          userId,
          expiresAt,
          data: data as any,
        },
        update: {
          expiresAt,
          data: data as any,
        },
      });
    } catch (cacheError) {
      console.warn("[PremiumInsights] Cache write unavailable; returning fresh data:", cacheError);
    }

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
