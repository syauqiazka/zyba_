// src/backend/billing/entitlements.ts
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";

export const FREE_DAILY_MESSAGE_LIMIT = 20;

export async function getUserPlan(userId: string): Promise<"FREE" | "PLUS"> {
  const user = await accountDb.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan ?? "FREE";
}

export async function checkMessageQuota(userId: string) {
  const plan = await getUserPlan(userId);
  if (plan === "PLUS") return { allowed: true, remaining: Infinity };

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Join Message -> Conversation aman di sini karena keduanya di Companion DB yang sama
  // (bukan cross-database join — cek User.plan di atas itu satu-satunya query lintas DB).
  const countToday = await companionDb.message.count({
    where: {
      role: "USER",
      createdAt: { gte: startOfDay },
      conversation: { userId },
    },
  });

  return {
    allowed: countToday < FREE_DAILY_MESSAGE_LIMIT,
    remaining: Math.max(0, FREE_DAILY_MESSAGE_LIMIT - countToday),
  };
}

export async function hasFeature(
  userId: string,
  feature: "advanced_insights" | "monthly_report" | "exclusive_community"
): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "PLUS"; // semua 3 fitur ini murni gated by plan, tidak ada logic tambahan
}
