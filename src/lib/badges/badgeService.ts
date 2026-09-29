import { accountDb } from "@/backend/db/accountClient";
import { userRepository } from "@/backend/auth/userRepository";

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

async function ensureAccountUser(userId: string): Promise<boolean> {
  try {
    const existing = await accountDb.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (existing) {
      return true;
    }

    const ensured = await userRepository.ensureUserExistsInNeon(userId);

    return Boolean(ensured?.neonId);
  } catch (error) {
    console.error("[BadgeService] Failed to ensure user:", error);
    return false;
  }
}

/**
 * Mengecek dan memberikan badge kepada user.
 * Aman dipanggil berkali-kali karena UserBadge mempunyai unique constraint:
 * @@unique([userId, badgeId])
 */
export async function triggerBadgeCheck(
  userId: string,
  action: BadgeTriggerAction
): Promise<UnlockedBadgeInfo[]> {
  try {
    if (!userId) {
      return [];
    }

    // Pastikan user ada di Account DB.
    // Ini penting untuk user lama/local-fallback.
    const userReady = await ensureAccountUser(userId);

    if (!userReady) {
      console.warn(
        `[BadgeService] User ${userId} belum tersedia di Account DB.`
      );
      return [];
    }

    const allBadges = await accountDb.badge.findMany();

    if (allBadges.length === 0) {
      console.warn(
        "[BadgeService] Tidak ada data badge. Jalankan seed-badges.ts."
      );
      return [];
    }

    const existingUserBadges = await accountDb.userBadge.findMany({
      where: { userId },
      select: {
        badgeId: true,
      },
    });

    const earnedBadgeIds = new Set(
      existingUserBadges.map((item) => item.badgeId)
    );

    const newlyUnlocked: UnlockedBadgeInfo[] = [];

    async function awardBadge(badgeKey: string) {
      const badge = allBadges.find((item) => item.key === badgeKey);

      if (!badge) {
        console.warn(
          `[BadgeService] Badge "${badgeKey}" tidak ditemukan.`
        );
        return;
      }

      if (earnedBadgeIds.has(badge.id)) {
        return;
      }

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
      } catch (error: any) {
        // Aman untuk race condition karena unique constraint
        console.warn(
          "[BadgeService] Gagal award badge:",
          error?.message || error
        );
      }
    }

    switch (action) {
      case "mood_checkin": {
        await awardBadge("first_mood");

        const user = await accountDb.user.findUnique({
          where: { id: userId },
          select: {
            streakDays: true,
            streak: true,
          },
        });

        const currentStreak =
          user?.streakDays ||
          user?.streak ||
          0;

        if (currentStreak >= 3) {
          await awardBadge("streak_3");
        }

        if (currentStreak >= 7) {
          await awardBadge("streak_7");
        }

        break;
      }

      case "companion_message": {
        await awardBadge("first_companion");
        break;
      }

      case "community_post": {
        await awardBadge("first_community");
        break;
      }

      case "journal_entry": {
        const journalCount =
          await accountDb.journalEntry.count({
            where: { userId },
          });

        if (journalCount >= 10) {
          await awardBadge("journal_10");
        }

        break;
      }

      case "breathing_complete": {
        await awardBadge("first_breathing");

        const breathingCount =
          await accountDb.activityLog.count({
            where: {
              userId,
              type: "BREATHING",
              completed: true,
            },
          });

        if (breathingCount >= 5) {
          await awardBadge("deep_zen");
        }

        break;
      }

      case "activity_complete": {
        await awardBadge("activity_first");
        break;
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error(
      "[BadgeService] Error checking badges:",
      error
    );

    return [];
  }
}

/**
 * Statistik badge untuk halaman achievements.
 */
export async function getUserBadgeStats(userId: string) {
  try {
    const [
      totalBadges,
      earnedCount,
      earnedBadges,
    ] = await Promise.all([
      accountDb.badge.count(),

      accountDb.userBadge.count({
        where: { userId },
      }),

      accountDb.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      }),
    ]);

    const totalXp = earnedBadges.reduce(
      (sum, item) =>
        sum + (item.badge?.xpReward || 0),
      0
    );

    return {
      totalBadges,
      earnedCount,
      earnedBadges,
      totalXp,
      progressPercentage:
        totalBadges > 0
          ? Math.round(
            (earnedCount / totalBadges) * 100
          )
          : 0,
    };
  } catch (error) {
    console.error(
      "[BadgeService] Error fetching badge stats:",
      error
    );

    return {
      totalBadges: 0,
      earnedCount: 0,
      earnedBadges: [],
      totalXp: 0,
      progressPercentage: 0,
    };
  }
}