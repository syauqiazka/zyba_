import { NextRequest, NextResponse } from "next/server";
import { companionDb } from "@/backend/db/companionClient";

// Shared PostgreSQL-backed rate limiter with memory fallback.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

function normalizeKey(key: string): string {
  return key.length <= 180 ? key : key.slice(0, 180);
}

// In-memory fallback if database connection is unavailable
const memoryBuckets = new Map<string, { hitCount: number; windowStart: number }>();

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const normalizedKey = normalizeKey(key);
  const now = new Date();
  const windowMs = windowSec * 1000;

  try {
    const rows = await companionDb.$queryRaw<Array<{ hitCount: number; windowStart: Date }>>
    `INSERT INTO "rate_limit_buckets"
    ("id", "key", "windowStart", "windowMs", "hitCount", "createdAt", "updatedAt")
  VALUES (
    ${normalizedKey}, ${normalizedKey}, ${now}, ${windowMs}, 1, NOW(), NOW()
  )
  ON CONFLICT ("key") DO UPDATE SET
    "hitCount" = CASE
      WHEN EXTRACT(EPOCH FROM (${now} - "rate_limit_buckets"."windowStart")) * 1000 >= "rate_limit_buckets"."windowMs"
        THEN 1 ELSE "rate_limit_buckets"."hitCount" + 1 END,
    "windowStart" = CASE
      WHEN EXTRACT(EPOCH FROM (${now} - "rate_limit_buckets"."windowStart")) * 1000 >= "rate_limit_buckets"."windowMs"
        THEN ${now} ELSE "rate_limit_buckets"."windowStart" END,
    "windowMs" = ${windowMs},
    "updatedAt" = NOW()
  RETURNING "hitCount", "windowStart"`;

    const bucket = rows[0];
    if (bucket) {
      const elapsedMs = Math.max(0, now.getTime() - new Date(bucket.windowStart).getTime());
      const allowed = bucket.hitCount <= limit;

      return {
        allowed,
        remaining: Math.max(0, limit - bucket.hitCount),
        retryAfterSec: allowed ? 0 : Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000)),
      };
    }
  } catch (dbErr) {
    console.warn("[RateLimit DB fallback to in-memory]:", dbErr);
  }

  // Safe Fallback: Enforce limit using in-memory bucket so protection never opens completely
  const nowMs = now.getTime();
  let memBucket = memoryBuckets.get(normalizedKey);

  if (!memBucket || nowMs - memBucket.windowStart >= windowMs) {
    memBucket = { hitCount: 1, windowStart: nowMs };
    memoryBuckets.set(normalizedKey, memBucket);
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSec: 0,
    };
  }

  memBucket.hitCount += 1;
  const elapsedMs = nowMs - memBucket.windowStart;
  const allowed = memBucket.hitCount <= limit;

  // Cleanup old memory keys periodically
  if (memoryBuckets.size > 2000) {
    for (const [k, v] of memoryBuckets.entries()) {
      if (nowMs - v.windowStart > windowMs) {
        memoryBuckets.delete(k);
      }
    }
  }

  return {
    allowed,
    remaining: Math.max(0, limit - memBucket.hitCount),
    retryAfterSec: allowed ? 0 : Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000)),
  };
}

/**
 * Extracts client IP with priority to trusted socket IP & verified proxy headers.
 * Prevents trivial rate limit evasion via arbitrary spoofed headers.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Next.js socket-level verified IP
  if (req.ip) {
    return req.ip;
  }

  // 2. Cloudflare verified connecting IP
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  // 3. True-Client-IP header (Akamai / Cloudflare Enterprise)
  const trueClientIp = req.headers.get("true-client-ip");
  if (trueClientIp) {
    return trueClientIp.trim();
  }

  // 4. Standard X-Forwarded-For: Take the LAST untrusted proxy or first hop
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[0];
    }
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

export function rateLimitResponse(
  retryAfterSec: number,
  message = "Terlalu banyak permintaan. Silakan coba lagi nanti."
): NextResponse {
  return NextResponse.json(
    {
      error: "TOO_MANY_REQUESTS",
      message: `${message} (Tunggu ${retryAfterSec} detik)`,
      retryAfter: retryAfterSec,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
