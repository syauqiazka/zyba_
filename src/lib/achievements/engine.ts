/**
 * ZYBA Achievement Engine
 * Call `checkAndUnlock(userId, event)` after key user actions.
 * Returns newly unlocked achievements so the UI can celebrate them.
 */

import { prisma } from "@/lib/prisma";
import { companionDb } from "@/backend/db/companionClient";
import { communityDb } from "@/backend/db/communityClient";
import { ACHIEVEMENT_DEFS } from "./definitions";

export type AchievementEvent =
  | { type: "mood_checkin" }
  | { type: "journal_entry" }
  | { type: "companion_message"; conversationCount: number }
  | { type: "community_post" }
  | { type: "community_like"; likeCount: number }
  | { type: "activity_complete"; activityCount: number }
  | { type: "assessment_complete" }
  | { type: "login" };   // daily login, updates streak

/** Ensure all achievements exist in DB (idempotent). */
export async function seedAchievements() {
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

/** Core: check event, unlock matching achievements, update streak. Returns newly unlocked keys. */
export async function checkAndUnlock(
  userId: string,
  event: AchievementEvent
): Promise<string[]> {
  const keysToUnlock: string[] = [];

  if (event.type === "login") {
    await updateStreak(userId);
  }

  // Fetch user's already-unlocked keys
  const existing = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievement: { select: { key: true } } },
  });
  const unlockedKeys = new Set(existing.map((u) => u.achievement.key));

  // Get current user for streak/counts (streakDays may not exist in DB yet — wrap with try-catch)
  let userStreakDays = 0;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true },
    });
    userStreakDays = user?.streakDays ?? 0;
  } catch {
    // streakDays column not yet migrated — use 0 as fallback
    userStreakDays = 0;
  }

  // Evaluate each achievement definition
  for (const def of ACHIEVEMENT_DEFS) {
    if (unlockedKeys.has(def.key)) continue; // already unlocked

    let shouldUnlock = false;

    switch (def.category) {
      case "STREAK": {
        if (event.type === "login") {
          const streak = userStreakDays;
          shouldUnlock = !!def.threshold && streak >= def.threshold;
        }
        break;
      }
      case "WELLNESS": {
        if (def.key.startsWith("mood_") && event.type === "mood_checkin") {
          const count = await prisma.moodEntry.count({ where: { userId } });
          shouldUnlock = !!def.threshold && count >= def.threshold;
        } else if (def.key.startsWith("journal_") && event.type === "journal_entry") {
          const count = await prisma.journalEntry.count({ where: { userId } });
          shouldUnlock = !!def.threshold && count >= def.threshold;
        }
        break;
      }
      case "COMPANION": {
        if (event.type === "companion_message") {
          const count = await companionDb.conversation.count({ where: { userId } });
          shouldUnlock = !!def.threshold && count >= def.threshold;
        }
        break;
      }
      case "SOCIAL": {
        if (def.key === "community_first_post" && event.type === "community_post") {
          const count = await communityDb.communityPost.count({ where: { userId } });
          shouldUnlock = count >= 1;
        } else if (def.key === "community_supporter" && event.type === "community_like") {
          shouldUnlock = !!def.threshold && event.likeCount >= def.threshold;
        }
        break;
      }
      case "ACTIVITY": {
        if (event.type === "activity_complete") {
          shouldUnlock = !!def.threshold && event.activityCount >= def.threshold;
        }
        break;
      }
      case "SPECIAL": {
        if (def.key === "assessment_complete" && event.type === "assessment_complete") {
          shouldUnlock = true;
        }
        if (def.key === "early_adopter" && event.type === "login") {
          // Give to all current users (registered before a cutoff — use first-login heuristic)
          const ua = await prisma.userAchievement.count({ where: { userId } });
          shouldUnlock = ua === 0; // first time checking = early user
        }
        break;
      }
    }

    if (shouldUnlock) {
      keysToUnlock.push(def.key);
    }
  }

  if (keysToUnlock.length > 0) {
    // Fetch achievement IDs
    const achievements = await prisma.achievement.findMany({
      where: { key: { in: keysToUnlock } },
      select: { id: true, key: true },
    });
    await prisma.userAchievement.createMany({
      data: achievements.map((a) => ({ userId, achievementId: a.id })),
      skipDuplicates: true,
    });
  }

  return keysToUnlock;
}

/** Update login streak (call on every authenticated request or login). */
async function updateStreak(userId: string) {
  // streakDays/lastStreakDate may not exist in DB yet — wrap entire function
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true, lastStreakDate: true },
    });
    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!user.lastStreakDate) {
      await prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastStreakDate: today },
      });
      return;
    }

    const last = new Date(user.lastStreakDate);
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const diffDays = Math.floor((today.getTime() - lastDay.getTime()) / 86400000);

    if (diffDays === 0) return; // same day, no update needed
    if (diffDays === 1) {
      // Consecutive day
      await prisma.user.update({
        where: { id: userId },
        data: { streakDays: { increment: 1 }, lastStreakDate: today },
      });
    } else {
      // Streak broken
      await prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastStreakDate: today },
      });
    }
  } catch (e: any) {
    // Column doesn't exist yet — silently skip streak update
    console.warn("[achievement] updateStreak skipped (streakDays not in DB):", e.message?.slice(0, 80));
  }
}
