import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";
import { communityDb } from "@/backend/db/communityClient";

export type BadgeTriggerAction =
  | "mood_checkin"
  | "companion_message"
  | "community_post"
  | "journal_entry"
  | "breathing_complete"
  | "activity_complete";

interface UnlockedBadgeInfo {
  key: string;
  name: string;
  icon: string;
  xpReward: number;
}

/**
 * Core trigger function to evaluate and grant badges to a user.
 * Idempotent: uses @@unique([userId, badgeId]) in user_badges.
 */
export async function triggerBadgeCheck(
  userId: string,
  action: BadgeTriggerAction
): Promise<UnlockedBadgeInfo[]> {
  try {
    const newlyUnlocked: UnlockedBadgeInfo[] = [];

    // 1. Fetch all badges from DB
    const allBadges = await accountDb.badge.findMany();
    if (!allBadges || allBadges.length === 0) return [];

    // 2. Fetch user's currently earned badge IDs
    const existingUserBadges = await accountDb.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });
    const earnedBadgeIds = new Set(existingUserBadges.map((ub) => ub.badgeId));

    // Helper to award a badge if not already earned
    const awardBadge = async (badgeKey: string) => {
      const badge = allBadges.find((b) => b.key === badgeKey);
      if (!badge || earnedBadgeIds.has(badge.id)) return;

      try {
        await accountDb.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        earnedBadgeIds.add(badge.id);
        newlyUnlocked.push({
          key: badge.key,
          name: badge.name,
          icon: badge.icon,
          xpReward: badge.xpReward,
        });
      } catch (err: any) {
        // Unique constraint race condition handled gracefully
        console.warn("[BadgeService] Award badge duplicate/error:", err.message);
      }
    };

    // 3. Evaluate criteria based on trigger action
    switch (action) {
      case "mood_checkin": {
        // Badge: "first_mood" (Mood Pertama)
        await awardBadge("first_mood");

        // Check user streak from User model for "streak_3"
        const user = await accountDb.user.findUnique({
          where: { id: userId },
          select: { streakDays: true, streak: true },
        });
        const currentStreak = user?.streakDays || user?.streak || 0;
        if (currentStreak >= 3) {
          await awardBadge("streak_3");
        }
        if (currentStreak >= 7) {
          await awardBadge("streak_7");
        }
        break;
      }

      case "companion_message": {
        // Badge: "first_companion" (Sapa ZYBA)
        await awardBadge("first_companion");
        break;
      }

      case "community_post": {
        // Badge: "first_community" (Penulis Pertama)
        await awardBadge("first_community");
        break;
      }

      case "journal_entry": {
        // Badge: "journal_10" (10 Catatan Jiwa)
        const journalCount = await accountDb.journalEntry.count({
          where: { userId },
        });
        if (journalCount >= 10) {
          await awardBadge("journal_10");
        }
        break;
      }

      case "breathing_complete": {
        // Badge: "first_breathing" (Napas Tenang)
        await awardBadge("first_breathing");

        // Badge: "deep_zen" if 5 or more breathing exercises completed
        const breathingCount = await accountDb.activityLog.count({
          where: { userId, type: "BREATHING", completed: true },
        });
        if (breathingCount >= 5) {
          await awardBadge("deep_zen");
        }
        break;
      }

      case "activity_complete": {
        // Badge: "activity_first"
        await awardBadge("activity_first");
        break;
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("[BadgeService] Error checking badges:", error);
    return [];
  }
}

/**
 * Get total user badges and progress for /achievements
 */
export async function getUserBadgeStats(userId: string) {
  try {
    const [totalBadges, earnedCount, earnedBadges] = await Promise.all([
      accountDb.badge.count(),
      accountDb.userBadge.count({ where: { userId } }),
      accountDb.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      }),
    ]);

    const totalXp = earnedBadges.reduce((sum, ub) => sum + (ub.badge?.xpReward || 0), 0);

    return {
      totalBadges,
      earnedCount,
      earnedBadges,
      totalXp,
      progressPercentage: totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0,
    };
  } catch (error) {
    console.error("[BadgeService] Error fetching badge stats:", error);
    return {
      totalBadges: 9,
      earnedCount: 0,
      earnedBadges: [],
      totalXp: 0,
      progressPercentage: 0,
    };
  }
}
