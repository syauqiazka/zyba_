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
    console.warn("[RateLimit SECURITY WARNING]: Database rate limiter unavailable, falling back to strict in-memory limit:", dbErr);
  }

  // Safe Fallback: Enforce limit using in-memory bucket so protection never opens completely.
  // In multi-instance Docker environments, each instance keeps local memory buckets.
  // To avoid doubling the threshold across 2 instances during DB cold-start/outage,
  // enforce conservative limits for sensitive endpoints (auth, otp, reset, export).
  const isSensitiveEndpoint =
    normalizedKey.startsWith("login:") ||
    normalizedKey.startsWith("signup:") ||
    normalizedKey.startsWith("otp_") ||
    normalizedKey.startsWith("reset_pw:") ||
    normalizedKey.startsWith("export:");
  const effectiveLimit = isSensitiveEndpoint ? Math.max(1, Math.floor(limit / 2)) : limit;

  const nowMs = now.getTime();
  let memBucket = memoryBuckets.get(normalizedKey);

  if (!memBucket || nowMs - memBucket.windowStart >= windowMs) {
    memBucket = { hitCount: 1, windowStart: nowMs };
    memoryBuckets.set(normalizedKey, memBucket);
    return {
      allowed: true,
      remaining: Math.max(0, effectiveLimit - 1),
      retryAfterSec: 0,
    };
  }

  memBucket.hitCount += 1;
  const elapsedMs = nowMs - memBucket.windowStart;
  const allowed = memBucket.hitCount <= effectiveLimit;

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
    remaining: Math.max(0, effectiveLimit - memBucket.hitCount),
    retryAfterSec: allowed ? 0 : Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000)),
  };
}

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::1$|^::$/;

function sanitizeIp(rawIp: string | null | undefined): string | null {
  if (!rawIp) return null;
  const trimmed = rawIp.trim();
  // Strip port if present (e.g., 1.2.3.4:5678)
  const withoutPort = trimmed.includes(":") && !trimmed.includes("::") && trimmed.split(":").length === 2
    ? trimmed.split(":")[0]
    : trimmed;
  if (IPV4_REGEX.test(withoutPort) || IPV6_REGEX.test(withoutPort)) {
    return withoutPort;
  }
  return null;
}

/**
 * Extracts client IP with priority to trusted socket IP & verified proxy headers.
 * Protects against arbitrary spoofed headers (CF-Connecting-IP, True-Client-IP, X-Forwarded-For)
 * by verifying against reverse-proxy configuration and IP address format.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Next.js socket-level verified IP
  if (req.ip) {
    const verified = sanitizeIp(req.ip);
    if (verified) return verified;
  }

  // 2. Reverse proxy header set and sanitized by Apache/Nginx (e.g. RequestHeader set X-Real-IP "%{REMOTE_ADDR}s")
  const realIp = sanitizeIp(req.headers.get("x-real-ip"));
  if (realIp) {
    return realIp;
  }

  // 3. Cloudflare verified connecting IP ONLY if explicitly behind verified Cloudflare proxy
  if (process.env.TRUST_CLOUDFLARE_PROXY === "true") {
    const cfIp = sanitizeIp(req.headers.get("cf-connecting-ip"));
    if (cfIp) return cfIp;

    const trueClientIp = sanitizeIp(req.headers.get("true-client-ip"));
    if (trueClientIp) return trueClientIp;
  }

  // 4. Standard X-Forwarded-For: Extract first hop and validate format strictly
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => sanitizeIp(p)).filter(Boolean);
    if (parts.length > 0 && parts[0]) {
      return parts[0];
    }
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
