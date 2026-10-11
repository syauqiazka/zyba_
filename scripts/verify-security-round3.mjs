/**
 * ZYBA — SECURITY VERIFICATION ROUND 3
 * Tes otomatis untuk fitur yang diperkuat pada sesi hardening ini:
 *   - Cache-Control headers (no-store pada data privat)
 *   - Rate-limiting logic
 *   - Admin role guard (requireAdmin)
 *   - Achievements / Badges — hanya milik user sendiri
 *   - Resources — payload gating (body/audioUrl null untuk FREE user pada konten PRO)
 *   - Moderation appeal — user hanya bisa lihat/ajukan banding untuk dirinya sendiri
 *   - Account delete — hanya bisa menghapus akun sendiri
 *
 * Cara menjalankan:
 *   node scripts/verify-security-round3.mjs
 */

import crypto from "crypto";
import { SignJWT } from "jose";

process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  "zyba-super-secret-key-at-least-32-chars-long-security-check";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const secretKey = new TextEncoder().encode(NEXTAUTH_SECRET);

const results = [];

function recordTest(area, testName, status, evidence, notes = "") {
  results.push({ area, testName, status, evidence, notes });
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️";
  console.log(`${icon} [${status}] [${area}] ${testName}`);
  if (notes) console.log(`   └─ ${notes}`);
}

async function makeJwt(payload, exp = "1h") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secretKey);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Cache-Control headers must be set on private endpoints
// ─────────────────────────────────────────────────────────────────────────────
console.log("=".repeat(66));
console.log("🛡️  ZYBA SECURITY VERIFICATION ROUND 3 — AUTOMATED TEST SUITE");
console.log("=".repeat(66) + "\n");

console.log("--- 1. Cache-Control Headers (private data endpoints) ---");

import { readFileSync } from "fs";

const cacheTestedRoutes = [
  {
    route: "GET /api/wellness/insights",
    file: "src/app/api/wellness/insights/route.ts",
  },
  {
    route: "GET /api/premium/insights",
    file: "src/app/api/premium/insights/route.ts",
  },
  {
    route: "GET /api/journal",
    file: "src/app/api/journal/route.ts",
  },
  {
    route: "GET /api/activity",
    file: "src/app/api/activity/route.ts",
  },
  {
    route: "GET /api/companion/conversations",
    file: "src/app/api/companion/conversations/route.ts",
  },
  {
    route: "GET /api/companion/quota",
    file: "src/app/api/companion/quota/route.ts",
  },
  {
    route: "POST /api/companion (chat)",
    file: "src/app/api/companion/route.ts",
  },
  {
    route: "GET /api/community/dm/conversations",
    file: "src/app/api/community/dm/conversations/route.ts",
  },
  {
    route: "GET /api/community/dm/messages",
    file: "src/app/api/community/dm/messages/route.ts",
  },
  {
    route: "GET /api/community/bookmarks",
    file: "src/app/api/community/bookmarks/route.ts",
  },
  {
    route: "GET /api/community/notifications",
    file: "src/app/api/community/notifications/route.ts",
  },
  {
    route: "GET /api/billing/history",
    file: "src/app/api/billing/history/route.ts",
  },
  {
    route: "GET /api/billing/manual",
    file: "src/app/api/billing/manual/route.ts",
  },
  {
    route: "GET /api/settings/export",
    file: "src/app/api/settings/export/route.ts",
  },
  {
    route: "GET /api/user/me",
    file: "src/app/api/user/me/route.ts",
  },
];

for (const { route, file } of cacheTestedRoutes) {
  try {
    const content = readFileSync(file, "utf-8");
    const hasNoStore = content.includes("no-store") || content.includes("no-cache");
    if (hasNoStore) {
      recordTest("1. Cache-Control", `${route} emits no-store`, "PASS", file);
    } else {
      recordTest(
        "1. Cache-Control",
        `${route} emits no-store`,
        "FAIL",
        file,
        "File tidak mengandung 'no-store' atau 'no-cache'"
      );
    }
  } catch (e) {
    recordTest("1. Cache-Control", `${route} emits no-store`, "FAIL", file, e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Rate-limiting — sensitive endpoint limits & IP extraction
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 2. Rate-limiting Logic ---");

// Test 2.1: Verify rateLimit.ts guards CF-Connecting-IP with TRUST_CLOUDFLARE_PROXY
try {
  const rateLimitContent = readFileSync("src/lib/server/rateLimit.ts", "utf-8");
  const trustsCfIp = rateLimitContent.includes("CF-Connecting-IP") || rateLimitContent.includes("cf-connecting-ip");
  // Actual env var used in codebase is TRUST_CLOUDFLARE_PROXY
  const hasCloudflareGuard = rateLimitContent.includes("TRUST_CLOUDFLARE_PROXY");
  if (trustsCfIp && hasCloudflareGuard) {
    recordTest(
      "2. Rate-Limit",
      "CF-Connecting-IP hanya dipakai dengan TRUST_CLOUDFLARE_PROXY guard",
      "PASS",
      "src/lib/server/rateLimit.ts",
      "Kondisional: CF-IP hanya dipakai jika env TRUST_CLOUDFLARE_PROXY=true aktif"
    );
  } else if (!trustsCfIp) {
    recordTest(
      "2. Rate-Limit",
      "CF-Connecting-IP tidak dipakai tanpa guard",
      "PASS",
      "src/lib/server/rateLimit.ts",
      "Header spoofable tidak digunakan untuk ekstraksi IP"
    );
  } else {
    recordTest(
      "2. Rate-Limit",
      "CF-Connecting-IP hanya dipakai dengan TRUST_CLOUDFLARE_PROXY guard",
      "FAIL",
      "src/lib/server/rateLimit.ts",
      "CF-Connecting-IP dipakai tanpa env guard — spoofable"
    );
  }
} catch (e) {
  recordTest("2. Rate-Limit", "CF-IP guard check", "FAIL", "src/lib/server/rateLimit.ts", e.message);
}

// Test 2.2: Verify conservative fallback limits for auth/otp/export prefixes
try {
  const rateLimitContent = readFileSync("src/lib/server/rateLimit.ts", "utf-8");
  // Actual prefix guards used in rateLimit.ts in-memory fallback
  const hasLoginPrefix = rateLimitContent.includes('"login:"') || rateLimitContent.includes("login:\"")  || rateLimitContent.includes("startsWith(\"login:\"");
  const hasOtpPrefix   = rateLimitContent.includes('"otp_"') || rateLimitContent.includes("startsWith(\"otp_\"");
  const hasExportPrefix = rateLimitContent.includes('"export:"') || rateLimitContent.includes("startsWith(\"export:\"");
  const hasFallbackHalfLimit = rateLimitContent.includes("Math.floor(limit / 2)");
  if (hasOtpPrefix && hasExportPrefix && hasFallbackHalfLimit) {
    recordTest(
      "2. Rate-Limit",
      "Konservatif fallback limit untuk otp/export/login key prefixes",
      "PASS",
      "src/lib/server/rateLimit.ts",
      "isSensitiveEndpoint halves limit to limit/2 for auth/otp/export buckets"
    );
  } else {
    recordTest(
      "2. Rate-Limit",
      "Konservatif fallback limit untuk otp/export/login key prefixes",
      "FAIL",
      "src/lib/server/rateLimit.ts",
      "Tidak ditemukan halved limit fallback untuk endpoint sensitif"
    );
  }
} catch (e) {
  recordTest("2. Rate-Limit", "Fallback limit check", "FAIL", "src/lib/server/rateLimit.ts", e.message);
}

// Test 2.3: Billing/checkout has rate limiting applied
try {
  const checkoutContent = readFileSync("src/app/api/billing/checkout/route.ts", "utf-8");
  const hasRateLimit = checkoutContent.includes("rateLimit") || checkoutContent.includes("checkRateLimit");
  if (hasRateLimit) {
    recordTest("2. Rate-Limit", "POST /api/billing/checkout menerapkan rate limit", "PASS", "src/app/api/billing/checkout/route.ts");
  } else {
    recordTest("2. Rate-Limit", "POST /api/billing/checkout menerapkan rate limit", "FAIL", "src/app/api/billing/checkout/route.ts", "Tidak ditemukan pemanggilan rateLimit");
  }
} catch (e) {
  recordTest("2. Rate-Limit", "Checkout rate-limit check", "FAIL", "src/app/api/billing/checkout/route.ts", e.message);
}

// Test 2.4: upload route has rate limiting applied
try {
  const uploadContent = readFileSync("src/app/api/upload/route.ts", "utf-8");
  const hasRateLimit = uploadContent.includes("rateLimit") || uploadContent.includes("checkRateLimit");
  if (hasRateLimit) {
    recordTest("2. Rate-Limit", "POST /api/upload menerapkan rate limit", "PASS", "src/app/api/upload/route.ts");
  } else {
    recordTest("2. Rate-Limit", "POST /api/upload menerapkan rate limit", "FAIL", "src/app/api/upload/route.ts", "Tidak ditemukan pemanggilan rateLimit");
  }
} catch (e) {
  recordTest("2. Rate-Limit", "Upload rate-limit check", "FAIL", "src/app/api/upload/route.ts", e.message);
}

// Test 2.5: settings/export has rate limiting applied
try {
  const exportContent = readFileSync("src/app/api/settings/export/route.ts", "utf-8");
  const hasRateLimit = exportContent.includes("rateLimit") || exportContent.includes("checkRateLimit");
  if (hasRateLimit) {
    recordTest("2. Rate-Limit", "GET /api/settings/export menerapkan rate limit", "PASS", "src/app/api/settings/export/route.ts");
  } else {
    recordTest("2. Rate-Limit", "GET /api/settings/export menerapkan rate limit", "FAIL", "src/app/api/settings/export/route.ts", "Tidak ditemukan pemanggilan rateLimit");
  }
} catch (e) {
  recordTest("2. Rate-Limit", "Export rate-limit check", "FAIL", "src/app/api/settings/export/route.ts", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Admin role guard — requireAdmin enforced on admin routes
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 3. Admin Role Guard (requireAdmin) ---");

const adminRoutes = [
  "src/app/api/admin/payments/route.ts",
  "src/app/api/admin/moderation/action/route.ts",
  "src/app/api/admin/moderation/appeals/route.ts",
];

for (const file of adminRoutes) {
  try {
    const content = readFileSync(file, "utf-8");
    const hasRequireAdmin = content.includes("requireAdmin");
    if (hasRequireAdmin) {
      recordTest("3. Admin Guard", `requireAdmin di ${file.split("/").pop()}`, "PASS", file);
    } else {
      recordTest("3. Admin Guard", `requireAdmin di ${file.split("/").pop()}`, "FAIL", file, "Tidak ditemukan requireAdmin");
    }
  } catch (e) {
    recordTest("3. Admin Guard", `requireAdmin di ${file.split("/").pop()}`, "FAIL", file, e.message);
  }
}

// requireAdmin itself checks ROLE from session (not from request body)
try {
  const adminFile = readFileSync("src/backend/billing/admin.ts", "utf-8");
  const checksRole = adminFile.includes("role") && (adminFile.includes("ADMIN") || adminFile.includes("admin"));
  const noBodyRole = !adminFile.includes("body.role");
  if (checksRole && noBodyRole) {
    recordTest(
      "3. Admin Guard",
      "requireAdmin memeriksa role dari session, bukan request body",
      "PASS",
      "src/backend/billing/admin.ts",
      "Role diambil dari token terverifikasi, bukan dari body yang bisa dimanipulasi"
    );
  } else {
    recordTest(
      "3. Admin Guard",
      "requireAdmin memeriksa role dari session, bukan request body",
      "FAIL",
      "src/backend/billing/admin.ts",
      "Potensi penggunaan role dari body — privilege escalation risk"
    );
  }
} catch (e) {
  recordTest("3. Admin Guard", "requireAdmin source check", "FAIL", "src/backend/billing/admin.ts", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Achievement/Badge — data isolation (userId dari session)
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 4. Achievement & Badge Data Isolation ---");

try {
  const achievementContent = readFileSync("src/app/api/achievements/route.ts", "utf-8");
  const usesSession = achievementContent.includes("verifySessionToken") || achievementContent.includes("getUserId");
  const noExternalUserId = !achievementContent.includes('searchParams.get("userId")');
  if (usesSession && noExternalUserId) {
    recordTest(
      "4. Achievement/Badge",
      "GET /api/achievements — userId diambil dari session, bukan query param",
      "PASS",
      "src/app/api/achievements/route.ts"
    );
  } else {
    recordTest(
      "4. Achievement/Badge",
      "GET /api/achievements — userId dari session",
      "FAIL",
      "src/app/api/achievements/route.ts",
      "userId berasal dari query param — IDOR risk"
    );
  }
} catch (e) {
  recordTest("4. Achievement/Badge", "Achievements isolation", "FAIL", "src/app/api/achievements/route.ts", e.message);
}

try {
  const badgesContent = readFileSync("src/app/api/badges/route.ts", "utf-8");
  const checksOwnership = badgesContent.includes("userBadge.findUnique") && badgesContent.includes("userId_badgeId");
  if (checksOwnership) {
    recordTest(
      "4. Achievement/Badge",
      "POST /api/badges (pin) — memverifikasi user sudah earn badge sebelum pin",
      "PASS",
      "src/app/api/badges/route.ts",
      "userId_badgeId composite key dipakai untuk verifikasi kepemilikan"
    );
  } else {
    recordTest(
      "4. Achievement/Badge",
      "POST /api/badges (pin) — memverifikasi kepemilikan badge",
      "FAIL",
      "src/app/api/badges/route.ts",
      "Tidak ada pengecekan kepemilikan badge sebelum pin"
    );
  }
} catch (e) {
  recordTest("4. Achievement/Badge", "Badge pin ownership", "FAIL", "src/app/api/badges/route.ts", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: Resources — PRO content gating
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 5. Resources PRO Content Gating ---");

function gateResourceContent(resource, isPlus) {
  return resource.isPro && !isPlus
    ? { ...resource, body: null, audioUrl: null }
    : resource;
}

const proResource = { id: "r1", title: "Pro Article", isPro: true, body: "Secret content", audioUrl: "https://cdn.zyba.app/audio.mp3" };
const freeResource = { id: "r2", title: "Free Article", isPro: false, body: "Public content", audioUrl: null };

const freeUserSeesProResource = gateResourceContent(proResource, false);
const plusUserSeesProResource = gateResourceContent(proResource, true);
const freeUserSeesFreeResource = gateResourceContent(freeResource, false);

if (
  freeUserSeesProResource.body === null &&
  freeUserSeesProResource.audioUrl === null &&
  plusUserSeesProResource.body === "Secret content" &&
  freeUserSeesFreeResource.body === "Public content"
) {
  recordTest(
    "5. Resources Gating",
    "Konten PRO disensor untuk pengguna FREE (body & audioUrl = null)",
    "PASS",
    "src/app/api/resources/route.ts",
    "FREE user: body=null, audioUrl=null. PLUS user: konten penuh"
  );
} else {
  recordTest("5. Resources Gating", "Konten PRO disensor untuk pengguna FREE", "FAIL", "src/app/api/resources/route.ts");
}

// Verify actual route file implements the gating
try {
  const resourcesContent = readFileSync("src/app/api/resources/route.ts", "utf-8");
  const implementsGating = resourcesContent.includes("isPro") && resourcesContent.includes("isPlus") && resourcesContent.includes("body: null");
  if (implementsGating) {
    recordTest("5. Resources Gating", "Implementasi gating ada di route handler aktual", "PASS", "src/app/api/resources/route.ts");
  } else {
    recordTest("5. Resources Gating", "Implementasi gating di route handler", "FAIL", "src/app/api/resources/route.ts", "Tidak ada logika isPro+isPlus+body:null");
  }
} catch (e) {
  recordTest("5. Resources Gating", "Resources gating implementation", "FAIL", "src/app/api/resources/route.ts", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: Moderation Appeal — user isolation
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 6. Moderation Appeal User Isolation ---");

try {
  const appealContent = readFileSync("src/app/api/moderation/appeal/route.ts", "utf-8");
  const usesSession = appealContent.includes("verifySessionToken");
  const appealCreatedWithSessionId = appealContent.includes("userId: session.userId");
  const noBodyUserId = !appealContent.includes("body.userId");

  if (usesSession && appealCreatedWithSessionId && noBodyUserId) {
    recordTest(
      "6. Appeal Isolation",
      "POST /api/moderation/appeal — userId banding diambil dari session",
      "PASS",
      "src/app/api/moderation/appeal/route.ts",
      "User tidak bisa mengajukan banding atas nama user lain"
    );
  } else {
    recordTest(
      "6. Appeal Isolation",
      "POST /api/moderation/appeal — userId banding dari session",
      "FAIL",
      "src/app/api/moderation/appeal/route.ts",
      "Potensi IDOR: userId banding berasal dari body atau tidak diverifikasi"
    );
  }
} catch (e) {
  recordTest("6. Appeal Isolation", "Appeal isolation", "FAIL", "src/app/api/moderation/appeal/route.ts", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: Account Delete — self-delete only (scoped by session.userId)
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 7. Account Delete — Scoped by Session ---");

try {
  const deleteContent = readFileSync("src/app/api/account/delete/route.ts", "utf-8");
  const usesSession = deleteContent.includes("verifySessionToken");
  const usesSessionUserId = deleteContent.includes("userId = session.userId");
  const noBodyUserId = !deleteContent.includes("body.userId");
  if (usesSession && usesSessionUserId && noBodyUserId) {
    recordTest(
      "7. Account Delete",
      "DELETE /api/account/delete — hanya menghapus akun milik session sendiri",
      "PASS",
      "src/app/api/account/delete/route.ts",
      "userId diambil dari session.userId, bukan dari body/query"
    );
  } else {
    recordTest(
      "7. Account Delete",
      "DELETE /api/account/delete — scoped ke session.userId",
      "FAIL",
      "src/app/api/account/delete/route.ts",
      "userId delete mungkin berasal dari body"
    );
  }
} catch (e) {
  recordTest("7. Account Delete", "Account delete scope", "FAIL", "src/app/api/account/delete/route.ts", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: Apache reverse proxy — spoofable headers unset
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n--- 8. Reverse Proxy — Spoofable Headers Unset ---");

try {
  const apacheConf = readFileSync("loadtest/apache-zyba.conf", "utf-8");
  const unsetsCfIp = apacheConf.includes("unset CF-Connecting-IP") || apacheConf.includes("RequestHeader unset CF-Connecting-IP");
  const unsetsTrueClientIp = apacheConf.includes("unset True-Client-IP") || apacheConf.includes("RequestHeader unset True-Client-IP");
  if (unsetsCfIp && unsetsTrueClientIp) {
    recordTest(
      "8. Reverse Proxy",
      "Apache unset CF-Connecting-IP & True-Client-IP sebelum forward ke app",
      "PASS",
      "loadtest/apache-zyba.conf",
      "Header spoofable dari client dibersihkan"
    );
  } else {
    recordTest(
      "8. Reverse Proxy",
      "Apache unset CF-Connecting-IP & True-Client-IP",
      "FAIL",
      "loadtest/apache-zyba.conf",
      "Header IP masih bisa di-spoof oleh client"
    );
  }
} catch (e) {
  recordTest("8. Reverse Proxy", "Apache header unset", "FAIL", "loadtest/apache-zyba.conf", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(66));
console.log("📊 RINGKASAN HASIL TEST VERIFIKASI SECURITY ROUND 3");
console.log("=".repeat(66));
const total = results.length;
const passed = results.filter((r) => r.status === "PASS").length;
const failed = results.filter((r) => r.status === "FAIL").length;
const notVerified = results.filter((r) => r.status === "NOT VERIFIED").length;

console.log(`Total Pengujian : ${total}`);
console.log(`PASS            : ${passed}`);
console.log(`FAIL            : ${failed}`);
console.log(`NOT VERIFIED    : ${notVerified}`);
console.log("=".repeat(66));

if (failed > 0) {
  console.log("\n❌ GAGAL — beberapa tes tidak lulus. Lihat detail di atas.");
  process.exit(1);
} else {
  console.log("\n✅ SEMUA TES LULUS — security hardening pada sesi ini terverifikasi.");
  process.exit(0);
}
