/**
 * GET /api/achievements
 * Returns all badges/achievements from DB with unlock status based on real UserBadge count.
 */

import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { verifySessionToken } from "@/lib/auth";

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.userId ?? null;
}

// Category styling map for badge cards
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Streak: { bg: "bg-orange-100", text: "text-orange-600" },
  Wellness: { bg: "bg-green-100", text: "text-green-700" },
  Companion: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Sosial: { bg: "bg-amber-100", text: "text-amber-700" },
  Aktivitas: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Spesial: { bg: "bg-purple-100", text: "text-purple-700" },
};

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

const [allBadges, userBadges, user] = await Promise.all([
  accountDb.badge.findMany({
    orderBy: { xpReward: "asc" },
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      icon: true,
      category: true,
      xpReward: true,
    },
  }),

  accountDb.userBadge.findMany({
    where: { userId },
    orderBy: { earnedAt: "desc" },
    select: {
      earnedAt: true,
      badge: {
        select: {
          key: true,
          xpReward: true,
        },
      },
    },
  }),

  accountDb.user.findUnique({
    where: { id: userId },
    select: {
      streakDays: true,
      streak: true,
    },
  }),
]);

    const unlockedMap = new Map(
      userBadges.map((ub) => [ub.badge.key, ub.earnedAt.toISOString()])
    );

    const achievements = allBadges.map((b) => {
      const colors = CATEGORY_COLORS[b.category] || { bg: "bg-cream", text: "text-brown-900" };
      return {
        id: b.id,
        key: b.key,
        title: b.name,
        description: b.description,
        icon: b.icon, // Lucide icon name, e.g. "Flame", "Heart", "Wind", etc.
        category: b.category.toUpperCase(),
        xpReward: b.xpReward,
        badgeColor: colors.bg,
        badgeTextColor: colors.text,
        unlocked: unlockedMap.has(b.key),
        unlockedAt: unlockedMap.get(b.key) ?? null,
      };
    });

    const totalUnlocked = userBadges.length;
    const totalBadges = allBadges.length;
    const totalXp = userBadges.reduce((sum, ub) => sum + (ub.badge?.xpReward || 0), 0);
    const streakDays = user?.streakDays || user?.streak || 0;

    return NextResponse.json({
      success: true,
      achievements,
      totalUnlocked,
      totalCount: totalBadges,
      totalXp,
      streakDays,
    });
  } catch (error: any) {
    console.error("[Achievements API GET] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memuat data pencapaian." },
      { status: 500 }
    );
  }
}
