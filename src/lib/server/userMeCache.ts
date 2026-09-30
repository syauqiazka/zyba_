export interface UserMeCacheEntry {
  data: any;
  timestamp: number;
}

type ZYBAGlobal = typeof globalThis & {
  __zybaUserMeCache?: Map<string, UserMeCacheEntry>;
};

const globalForCache = globalThis as ZYBAGlobal;

export const userMeCache =
  globalForCache.__zybaUserMeCache ??
  new Map<string, UserMeCacheEntry>();

globalForCache.__zybaUserMeCache = userMeCache;

export const USER_ME_CACHE_TTL_MS = 6000;

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
