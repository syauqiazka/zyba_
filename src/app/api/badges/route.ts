/**
 * GET  /api/badges — get all badges and user's earned badges & pinned slots (0-2)
 * POST /api/badges — pin a badge to slot { slot, badgeKey, customLabel? }
 * DELETE /api/badges?slot=N — unpin badge from slot
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

import { getCachedBadges } from "@/lib/badges/badgeCache";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [allBadges, userBadges, user] = await Promise.all([
      getCachedBadges(),

      accountDb.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      }),
      accountDb.user.findUnique({
        where: { id: userId },
        select: { streakDays: true, streak: true },
      }),
    ]);

    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));
    const pinnedBadges = userBadges.filter((ub) => ub.slot !== null && ub.slot !== undefined);

    const totalXp = userBadges.reduce((sum, ub) => sum + (ub.badge?.xpReward || 0), 0);
    const streakDays = user?.streakDays || user?.streak || 0;

    return NextResponse.json({
      success: true,
      totalBadges: allBadges.length,
      earnedCount: userBadges.length,
      totalXp,
      streakDays,
      badges: pinnedBadges.map((ub) => ({
        slot: ub.slot,
        badgeKey: ub.badge.key,
        badgeName: ub.badge.name,
        icon: ub.badge.icon,
        customLabel: ub.customLabel || ub.badge.name,
      })),
      allBadges: allBadges.map((b) => ({
        id: b.id,
        key: b.key,
        name: b.name,
        description: b.description,
        category: b.category,
        icon: b.icon,
        xpReward: b.xpReward,
        unlocked: earnedBadgeIds.has(b.id),
        unlockedAt: userBadges.find((ub) => ub.badgeId === b.id)?.earnedAt || null,
      })),
    });
  } catch (error: any) {
    console.error("[Badges API GET] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slot, badgeKey, customLabel } = await request.json();

    if (typeof slot !== "number" || slot < 0 || slot > 2) {
      return NextResponse.json({ error: "Slot tidak valid (0–2)" }, { status: 400 });
    }

    // Find the badge
    const badge = await accountDb.badge.findUnique({ where: { key: badgeKey } });
    if (!badge) return NextResponse.json({ error: "Badge tidak ditemukan" }, { status: 404 });

    // Verify user has earned this badge
    const userBadge = await accountDb.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });
    if (!userBadge) {
      return NextResponse.json({ error: "Badge belum diraih" }, { status: 403 });
    }

    // Reset previous badge in this slot if any
    await accountDb.userBadge.updateMany({
      where: { userId, slot },
      data: { slot: null },
    });

    // Update this badge to slot
    const updated = await accountDb.userBadge.update({
      where: { id: userBadge.id },
      data: {
        slot,
        customLabel: customLabel ?? null,
      },
    });

    return NextResponse.json({ success: true, badge: updated });
  } catch (error: any) {
    console.error("[Badges API POST] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const slot = parseInt(searchParams.get("slot") ?? "");

    if (isNaN(slot) || slot < 0 || slot > 2) {
      return NextResponse.json({ error: "Slot tidak valid" }, { status: 400 });
    }

    await accountDb.userBadge.updateMany({
      where: { userId, slot },
      data: { slot: null },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Badges API DELETE] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
