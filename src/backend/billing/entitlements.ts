// src/backend/billing/entitlements.ts
import { accountDb } from "@/backend/db/accountClient";
import { companionDb } from "@/backend/db/companionClient";

// Kuota Token Harian (Gen Z Wellness - Granular Token System)
export const FREE_DAILY_TOKEN_LIMIT = 20_000;       // 20.000 token/hari (~25-35 sesi percakapan)
export const PREMIUM_DAILY_TOKEN_LIMIT = 150_000;   // 150.000 token/hari (~200+ sesi percakapan mendalam)

// Alias kompatibilitas
export const FREE_DAILY_MESSAGE_LIMIT = FREE_DAILY_TOKEN_LIMIT;
export const PREMIUM_DAILY_MESSAGE_LIMIT = PREMIUM_DAILY_TOKEN_LIMIT;

export interface TokenQuotaStatus {
  allowed: boolean;
  tokensUsed: number;
  remaining: number;
  limit: number;
  percentUsed: number;
  percentRemaining: number;
  plan: "FREE" | "PLUS";
}

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
    select: {
      plan: true,
      subscriptions: {
        where: {
          plan: "PLUS",
          status: "ACTIVE",
          endDate: { gt: new Date() },
        },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!user) {
    userPlanCache.set(userId, { plan: "FREE", timestamp: Date.now() });
    return "FREE";
  }

  // Subscription expiry is enforced lazily on entitlement reads, so a user
  // cannot keep Premium access after endDate merely because no webhook/job
  // happened to run at the exact expiry time.
  let plan: "FREE" | "PLUS" = user.plan === "PLUS" ? "PLUS" : "FREE";

  if (plan === "PLUS" && user.subscriptions.length === 0) {
    await accountDb.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: {
          userId,
          plan: "PLUS",
          status: "ACTIVE",
          endDate: { lte: new Date() },
        },
        data: { status: "EXPIRED" },
      });

      await tx.user.updateMany({
        where: {
          id: userId,
          plan: "PLUS",
          subscriptions: {
            none: {
              plan: "PLUS",
              status: "ACTIVE",
              endDate: { gt: new Date() },
            },
          },
        },
        data: { plan: "FREE" },
      });
    });

    plan = "FREE";
  }

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

async function getCurrentTokenUsage(userId: string, dateKey: string): Promise<number> {
  const counter = await companionDb.dailyMessageQuota.findUnique({
    where: { userId_date: { userId, date: dateKey } },
    select: { messageCount: true },
  });

  if (counter) {
    // Jika counter lama masih berbasis hitungan pesan kecil (< 100), normalisasi ke perkiraan token
    if (counter.messageCount > 0 && counter.messageCount <= 100) {
      return counter.messageCount * 350;
    }
    return counter.messageCount;
  }

  const { start, end } = getJakartaDayBounds(dateKey);

  // Jika belum ada counter harian, hitung perkiraan dari pesan user hari ini
  const userMsgCount = await companionDb.message.count({
    where: {
      role: "USER",
      createdAt: { gte: start, lt: end },
      conversation: { userId },
    },
  });

  return userMsgCount * 350;
}

/**
 * Cek status kuota token pengguna hari ini.
 * Menghasilkan metrik kuota token: jumlah terpakai, sisa, limit, dan persentase tersisa.
 */
export async function checkTokenQuota(userId: string): Promise<TokenQuotaStatus> {
  const plan = await getUserPlan(userId);
  const dailyLimit =
    plan === "PLUS" ? PREMIUM_DAILY_TOKEN_LIMIT : FREE_DAILY_TOKEN_LIMIT;

  const dateKey = getJakartaDateKey();
  const tokensUsed = await getCurrentTokenUsage(userId, dateKey);

  const remaining = Math.max(0, dailyLimit - tokensUsed);
  const percentUsed = Math.min(100, Math.round((tokensUsed / dailyLimit) * 1000) / 10);
  const percentRemaining = Math.max(0, Math.round((100 - percentUsed) * 10) / 10);

  return {
    allowed: tokensUsed < dailyLimit,
    tokensUsed,
    remaining,
    limit: dailyLimit,
    percentUsed,
    percentRemaining,
    plan,
  };
}

/**
 * Konsumsi kuota token secara granular & atomic.
 */
export async function consumeTokenQuota(
  userId: string,
  tokensToConsume: number
): Promise<TokenQuotaStatus> {
  const plan = await getUserPlan(userId);
  const dailyLimit =
    plan === "PLUS" ? PREMIUM_DAILY_TOKEN_LIMIT : FREE_DAILY_TOKEN_LIMIT;
  const dateKey = getJakartaDateKey();
  const quotaId = getQuotaId(userId, dateKey);
  const tokens = Math.max(1, Math.round(tokensToConsume));

  // Atomic upsert with Postgres
  const rows = await companionDb.$queryRaw<QuotaRow[]>`
    INSERT INTO "daily_message_quotas"
      ("id", "userId", "date", "messageCount", "createdAt", "updatedAt")
    VALUES
      (${quotaId}, ${userId}, ${dateKey}, ${tokens}, NOW(), NOW())
    ON CONFLICT ("userId", "date")
    DO UPDATE SET
      "messageCount" = "daily_message_quotas"."messageCount" + ${tokens},
      "updatedAt" = NOW()
    RETURNING "messageCount"
  `;

  const totalTokens = rows[0]?.messageCount ?? tokens;
  const remaining = Math.max(0, dailyLimit - totalTokens);
  const percentUsed = Math.min(100, Math.round((totalTokens / dailyLimit) * 1000) / 10);
  const percentRemaining = Math.max(0, Math.round((100 - percentUsed) * 10) / 10);

  return {
    allowed: totalTokens <= dailyLimit,
    tokensUsed: totalTokens,
    remaining,
    limit: dailyLimit,
    percentUsed,
    percentRemaining,
    plan,
  };
}

/**
 * Kembalikan kuota token jika eksekusi AI gagal.
 */
export async function releaseTokenQuota(userId: string, tokensToRefund: number) {
  const dateKey = getJakartaDateKey();
  const tokens = Math.max(1, Math.round(tokensToRefund));

  await companionDb.$executeRaw`
    UPDATE "daily_message_quotas"
    SET
      "messageCount" = GREATEST("messageCount" - ${tokens}, 0),
      "updatedAt" = NOW()
    WHERE "userId" = ${userId}
      AND "date" = ${dateKey}
      AND "messageCount" > 0
  `;
}

// =========================================================================
// Backward Compatibility Functions (menjaga dependensi lama tetap aman)
// =========================================================================

export async function checkMessageQuota(userId: string) {
  const tokenQuota = await checkTokenQuota(userId);
  return {
    allowed: tokenQuota.allowed,
    remaining: tokenQuota.remaining,
    limit: tokenQuota.limit,
    tokensUsed: tokenQuota.tokensUsed,
    percentUsed: tokenQuota.percentUsed,
    percentRemaining: tokenQuota.percentRemaining,
    plan: tokenQuota.plan,
  };
}

export async function consumeMessageQuota(userId: string) {
  // Konsumsi default 350 token per chat untuk caller lama
  const tokenQuota = await consumeTokenQuota(userId, 350);
  return {
    allowed: tokenQuota.allowed,
    remaining: tokenQuota.remaining,
    limit: tokenQuota.limit,
    tokensUsed: tokenQuota.tokensUsed,
    percentUsed: tokenQuota.percentUsed,
    percentRemaining: tokenQuota.percentRemaining,
    plan: tokenQuota.plan,
  };
}

export async function releaseMessageQuota(userId: string) {
  await releaseTokenQuota(userId, 350);
}

export async function hasFeature(
  userId: string,
  feature: "advanced_insights" | "monthly_report" | "exclusive_community"
): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "PLUS";
}
