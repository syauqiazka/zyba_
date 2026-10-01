export interface UserMeCacheEntry {
  data: any;
  timestamp: number;
}

export interface DailyAssessmentCacheEntry {
  data: any;
  timestamp: number;
}

type ZYBAGlobal = typeof globalThis & {
  __zybaUserMeCache?: Map<string, UserMeCacheEntry>;
  __zybaDailyAssessmentCache?: Map<string, DailyAssessmentCacheEntry>;
};

const globalForCache = globalThis as ZYBAGlobal;

export const userMeCache =
  globalForCache.__zybaUserMeCache ??
  new Map<string, UserMeCacheEntry>();

globalForCache.__zybaUserMeCache = userMeCache;

export const dailyAssessmentCache =
  globalForCache.__zybaDailyAssessmentCache ??
  new Map<string, DailyAssessmentCacheEntry>();

globalForCache.__zybaDailyAssessmentCache = dailyAssessmentCache;

export const USER_ME_CACHE_TTL_MS = 6000;
export const DAILY_ASSESSMENT_CACHE_TTL_MS = 8000;

export function getUserMeCache(userId: string) {
  const entry = userMeCache.get(userId);

  if (!entry) {
    return null;
  }

  if (
    Date.now() - entry.timestamp >=
    USER_ME_CACHE_TTL_MS
  ) {
    userMeCache.delete(userId);
    return null;
  }

  return entry.data;
}

export function setUserMeCache(
  userId: string,
  data: any
) {
  userMeCache.set(userId, {
    data,
    timestamp: Date.now(),
  });
}

export function invalidateUserMeCache(
  userId?: string
) {
  if (userId) {
    userMeCache.delete(userId);
    return;
  }

  userMeCache.clear();
}

export function getDailyAssessmentCache(cacheKey: string) {
  const entry = dailyAssessmentCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() - entry.timestamp >= DAILY_ASSESSMENT_CACHE_TTL_MS) {
    dailyAssessmentCache.delete(cacheKey);
    return null;
  }
  return entry.data;
}

export function setDailyAssessmentCache(cacheKey: string, data: any) {
  dailyAssessmentCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

export function invalidateDailyAssessmentCache(userId?: string) {
  if (userId) {
    for (const key of dailyAssessmentCache.keys()) {
      if (key.startsWith(userId)) {
        dailyAssessmentCache.delete(key);
      }
    }
    return;
  }
  dailyAssessmentCache.clear();
}
