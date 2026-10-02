/**
 * Shared in-memory cache for community feed.
 * Kept in a separate module to avoid circular imports between API routes.
 */

export interface CommunityPostsCache {
  data: {
    success: boolean;
    posts: any[];
    nextCursor?: string | null;
  };
  timestamp: number;
}

let cachedCommunityPosts: CommunityPostsCache | null = null;

/** TTL: 30s server-side; CDN gets max-age=20s + stale-while-revalidate=60s */
export const COMMUNITY_CACHE_TTL = 30_000;

export function getCommunityCache(): CommunityPostsCache | null {
  return cachedCommunityPosts;
}

export function setCommunityCache(data: CommunityPostsCache["data"]): void {
  cachedCommunityPosts = { data, timestamp: Date.now() };
}

export function invalidateCommunityCache(): void {
  cachedCommunityPosts = null;
}
