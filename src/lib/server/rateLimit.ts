import { NextRequest, NextResponse } from "next/server";
import { companionDb } from "@/backend/db/companionClient";

// Shared PostgreSQL-backed rate limiter.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

function normalizeKey(key: string): string {
  return key.length <= 180 ? key : key.slice(0, 180);
}

export async function checkRateLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const normalizedKey = normalizeKey(key);
  const now = new Date();
  const windowMs = windowSec * 1000;

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
  if (!bucket) throw new Error("RATE_LIMIT_BUCKET_UPDATE_FAILED");

  const elapsedMs = Math.max(0, now.getTime() - new Date(bucket.windowStart).getTime());
  const allowed = bucket.hitCount <= limit;

  return {
    allowed,
    remaining: Math.max(0, limit - bucket.hitCount),
    retryAfterSec: allowed ? 0 : Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000)),
  };
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
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
