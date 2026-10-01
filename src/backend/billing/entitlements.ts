// src/backend/billing/entitlements.ts
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";

export const FREE_DAILY_MESSAGE_LIMIT = 20;

// =====================================================
// USER PLAN CACHE
// TTL 10 detik
// Mengurangi query Account DB berulang saat user chat.
// =====================================================

const userPlanCache = new Map<
  string,
  {
    plan: "FREE" | "PLUS";
    timestamp: number;
  }
>();

const USER_PLAN_CACHE_TTL_MS = 10_000;

export async function getUserPlan(
  userId: string
): Promise<"FREE" | "PLUS"> {
  const cached = userPlanCache.get(userId);

  if (
    cached &&
    Date.now() - cached.timestamp <
      USER_PLAN_CACHE_TTL_MS
  ) {
    return cached.plan;
  }

  const user = await accountDb.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const plan = user?.plan ?? "FREE";

  userPlanCache.set(userId, {
    plan,
    timestamp: Date.now(),
  });

  return plan;
}

// =====================================================
// INVALIDATE USER PLAN CACHE
// Dipanggil saat plan/subscription user berubah.
// =====================================================

export function invalidateUserPlanCache(
  userId?: string
) {
  if (userId) {
    userPlanCache.delete(userId);
  } else {
    userPlanCache.clear();
  }
}

export async function checkMessageQuota(
  userId: string
) {
  const plan = await getUserPlan(userId);

  if (plan === "PLUS") {
    return {
      allowed: true,
      remaining: Infinity,
    };
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Join Message -> Conversation aman di sini karena
  // keduanya berada di Companion DB yang sama.
  const countToday =
    await companionDb.message.count({
      where: {
        role: "USER",
        createdAt: {
          gte: startOfDay,
        },
        conversation: {
          userId,
        },
      },
    });

  return {
    allowed:
      countToday <
      FREE_DAILY_MESSAGE_LIMIT,

    remaining: Math.max(
      0,
      FREE_DAILY_MESSAGE_LIMIT -
        countToday
    ),
  };
}

export async function hasFeature(
  userId: string,
  feature:
    | "advanced_insights"
    | "monthly_report"
    | "exclusive_community"
): Promise<boolean> {
  const plan = await getUserPlan(userId);

  return plan === "PLUS";
}