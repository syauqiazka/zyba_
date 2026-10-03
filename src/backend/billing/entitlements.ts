// src/backend/billing/entitlements.ts
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";

export const FREE_DAILY_MESSAGE_LIMIT = 20;
export const PREMIUM_DAILY_MESSAGE_LIMIT = 60;

type ZYBAGlobal = typeof globalThis & {
  __zybaUserPlanCache?: Map<string, { plan: "FREE" | "PLUS"; timestamp: number }>;
};

const globalForPlanCache = globalThis as ZYBAGlobal;
const userPlanCache =
  globalForPlanCache.__zybaUserPlanCache ??
  new Map<string, { plan: "FREE" | "PLUS"; timestamp: number }>();

globalForPlanCache.__zybaUserPlanCache = userPlanCache;
const USER_PLAN_CACHE_TTL_MS = 10_000;

export async function getUserPlan(userId: string): Promise<"FREE" | "PLUS"> {
  const cached = userPlanCache.get(userId);
  if (cached && Date.now() - cached.timestamp < USER_PLAN_CACHE_TTL_MS) return cached.plan;

  const user = await accountDb.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const plan = user?.plan ?? "FREE";
  userPlanCache.set(userId, { plan, timestamp: Date.now() });
  return plan;
}

export function invalidateUserPlanCache(userId?: string) {
  if (userId) userPlanCache.delete(userId);
  else userPlanCache.clear();
}

type QuotaRow = { messageCount: number };

function getJakartaDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function getJakartaDayBounds(dateKey: string) {
  const start = new Date(dateKey + "T00:00:00+07:00");
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function getQuotaId(userId: string, dateKey: string) {
  return userId + ":" + dateKey;
}

async function getCurrentMessageCount(userId: string, dateKey: string): Promise<number> {
  const counter = await companionDb.dailyMessageQuota.findUnique({
    where: { userId_date: { userId, date: dateKey } },
    select: { messageCount: true },
  });

  if (counter) return counter.messageCount;

  const { start, end } = getJakartaDayBounds(dateKey);

  return companionDb.message.count({
    where: {
      role: "USER",
      createdAt: { gte: start, lt: end },
      conversation: { userId },
    },
  });
}

export async function checkMessageQuota(userId: string) {
  const plan = await getUserPlan(userId);
  const dailyLimit =
    plan === "PLUS" ? PREMIUM_DAILY_MESSAGE_LIMIT : FREE_DAILY_MESSAGE_LIMIT;

  const dateKey = getJakartaDateKey();
  const countToday = await getCurrentMessageCount(userId, dateKey);

  return {
    allowed: countToday < dailyLimit,
    remaining: Math.max(0, dailyLimit - countToday),
    limit: dailyLimit,
    plan,
  };
}

/**
 * Reserve one quota slot atomically.
 * PostgreSQL serializes concurrent upserts on the unique (userId, date) key.
 */
export async function consumeMessageQuota(userId: string) {
  const plan = await getUserPlan(userId);
  const dailyLimit = plan === "PLUS" ? PREMIUM_DAILY_MESSAGE_LIMIT : FREE_DAILY_MESSAGE_LIMIT;
  const dateKey = getJakartaDateKey();
  const { start: dayStart, end: dayEnd } = getJakartaDayBounds(dateKey);
  const quotaId = getQuotaId(userId, dateKey);

  // Fast path: once today's counter exists, never rescan message history.
  const existing = await companionDb.dailyMessageQuota.findUnique({
    where: { userId_date: { userId, date: dateKey } },
    select: { messageCount: true },
  });

  if (existing) {
    const rows = await companionDb.$queryRaw<QuotaRow[]>`
      INSERT INTO "daily_message_quotas"
        ("id", "userId", "date", "messageCount", "createdAt", "updatedAt")
      VALUES
        (${quotaId}, ${userId}, ${dateKey}, 1, NOW(), NOW())
      ON CONFLICT ("userId", "date")
      DO UPDATE SET
        "messageCount" = "daily_message_quotas"."messageCount" + 1,
        "updatedAt" = NOW()
      WHERE "daily_message_quotas"."messageCount" < ${dailyLimit}
      RETURNING "messageCount"
    `;
    const count = rows[0]?.messageCount;
    if (count === undefined) return { allowed: false, remaining: 0, limit: dailyLimit, plan };
    return { allowed: true, remaining: Math.max(0, dailyLimit - count), limit: dailyLimit, plan };
  }

  // First request of the day: bootstrap from persisted USER messages.
  const rows = await companionDb.$queryRaw<QuotaRow[]>`
    INSERT INTO "daily_message_quotas"
      ("id", "userId", "date", "messageCount", "createdAt", "updatedAt")
    SELECT
      ${quotaId}, ${userId}, ${dateKey}, COUNT(*)::int + 1, NOW(), NOW()
    FROM "messages" AS m
    INNER JOIN "conversations" AS c ON c."id" = m."conversationId"
    WHERE c."userId" = ${userId}
      AND m."role" = 'USER'
      AND m."createdAt" >= ${dayStart}
      AND m."createdAt" < ${dayEnd}
    HAVING COUNT(*) < ${dailyLimit}
    ON CONFLICT ("userId", "date")
    DO UPDATE SET
      "messageCount" = "daily_message_quotas"."messageCount" + 1,
      "updatedAt" = NOW()
    WHERE "daily_message_quotas"."messageCount" < ${dailyLimit}
    RETURNING "messageCount"
  `;
  const count = rows[0]?.messageCount;
  if (count === undefined) return { allowed: false, remaining: 0, limit: dailyLimit, plan };
  return { allowed: true, remaining: Math.max(0, dailyLimit - count), limit: dailyLimit, plan };
}

export async function releaseMessageQuota(userId: string) {
  const dateKey = getJakartaDateKey();

  await companionDb.$executeRaw`
    UPDATE "daily_message_quotas"
    SET
      "messageCount" = GREATEST("messageCount" - 1, 0),
      "updatedAt" = NOW()
    WHERE "userId" = ${userId}
      AND "date" = ${dateKey}
      AND "messageCount" > 0
  `;
}

export async function hasFeature(
  userId: string,
  feature: "advanced_insights" | "monthly_report" | "exclusive_community"
): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "PLUS";
}
