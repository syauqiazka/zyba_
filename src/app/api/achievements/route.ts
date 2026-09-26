/**
 * GET /api/achievements
 * Returns all achievements with unlock status for the current user.
 *
 * GET /api/achievements?unseen=1
 * Returns newly unlocked unseen achievements (for toast notifications).
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { ACHIEVEMENT_DEFS } from "@/lib/achievements/definitions";

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.userId ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unseenOnly = searchParams.get("unseen") === "1";

    // Seed achievements if table is empty
    const count = await prisma.achievement.count();
    if (count === 0) {
      await seedAchievementsToDb();
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    });

    if (unseenOnly) {
      const unseen = userAchievements.filter((ua) => !ua.seen);
      if (unseen.length > 0) {
        await prisma.userAchievement.updateMany({
          where: { userId, seen: false },
          data: { seen: true },
        });
      }
      return NextResponse.json({
        achievements: unseen.map((ua) => ({
          key: ua.achievement.key,
          title: ua.achievement.title,
          icon: ua.achievement.icon,
          xpReward: ua.achievement.xpReward,
          unlockedAt: ua.unlockedAt,
        })),
      });
    }

    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievement.key, ua.unlockedAt])
    );

    const allWithStatus = ACHIEVEMENT_DEFS
      .filter((def) => !def.isSecret || unlockedMap.has(def.key))
      .map((def) => ({
        ...def,
        unlocked: unlockedMap.has(def.key),
        unlockedAt: unlockedMap.get(def.key) ?? null,
      }));

    // Also fetch user streak for header stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true },
    });

    return NextResponse.json({
      achievements: allWithStatus,
      totalUnlocked: unlockedMap.size,
      totalXp: ACHIEVEMENT_DEFS
        .filter((d) => unlockedMap.has(d.key))
        .reduce((s, d) => s + d.xpReward, 0),
      streakDays: user?.streakDays ?? 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function seedAchievementsToDb() {
  for (const def of ACHIEVEMENT_DEFS) {
    await prisma.achievement.upsert({
      where: { key: def.key },
      update: {
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category as any,
        threshold: def.threshold ?? null,
        isSecret: def.isSecret ?? false,
        xpReward: def.xpReward,
      },
      create: {
        key: def.key,
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category as any,
        threshold: def.threshold ?? null,
        isSecret: def.isSecret ?? false,
        xpReward: def.xpReward,
      },
    });
  }
}
