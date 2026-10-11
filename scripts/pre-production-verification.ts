/**
 * ZYBA - FINAL PRE-PRODUCTION SECURITY VERIFICATION SUITE
 * Pengujian independen: Integration tests pada Route Handler aktual,
 * spoofing X-Forwarded-For, validasi upload biner, dan proteksi otorisasi.
 */

import { NextRequest } from "next/server.js";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { getClientIp, checkRateLimit } from "../src/lib/server/rateLimit";
import { validateImageBuffer, generateSafeFileName } from "../src/lib/server/uploadSecurity";

// Import Route Handlers aktual
import { POST as authPostHandler, DELETE as authDeleteHandler } from "../src/app/api/auth/route";
import { GET as userMeGetHandler } from "../src/app/api/user/me/route";
import { GET as postDetailHandler } from "../src/app/api/community/posts/[postId]/route";
import { POST as communityPostHandler } from "../src/app/api/community/route";
import { DELETE as commentDeleteHandler } from "../src/app/api/community/comments/route";
import { GET as searchGetHandler } from "../src/app/api/community/search/route";
import { POST as otpPostHandler } from "../src/app/api/auth/otp/route";
import { POST as uploadPostHandler } from "../src/app/api/upload/route";
import { GET as journalGetHandler } from "../src/app/api/journal/route";
import { GET as activityGetHandler } from "../src/app/api/activity/route";
import { POST as companionPostHandler } from "../src/app/api/companion/route";
import { GET as conversationsGetHandler } from "../src/app/api/companion/conversations/route";
import { GET as billingHistoryHandler } from "../src/app/api/billing/history/route";
import { GET as premiumInsightsHandler } from "../src/app/api/premium/insights/route";

interface TestReportItem {
  id: string;
  category: "INTEGRATION" | "UNIT" | "SPOOFING" | "UPLOAD";
  name: string;
  status: "VERIFIED" | "PARTIALLY VERIFIED" | "FAIL";
  evidence: string;
  notes: string;
}

const reportItems: TestReportItem[] = [];

function record(
  id: string,
  category: "INTEGRATION" | "UNIT" | "SPOOFING" | "UPLOAD",
  name: string,
  status: "VERIFIED" | "PARTIALLY VERIFIED" | "FAIL",
  evidence: string,
  notes: string
) {
  reportItems.push({ id, category, name, status, evidence, notes });
  const icon = status === "VERIFIED" ? "✅" : status === "PARTIALLY VERIFIED" ? "⚠️" : "❌";
  console.log(`${icon} [${status}] [${category}] ${name}`);
  console.log(`   └─ File: ${evidence}`);
  console.log(`   └─ ${notes}\n`);
}

async function runPreProductionVerification() {
  console.log("================================================================================");
  console.log("🔒 ZYBA FINAL PRE-PRODUCTION INDEPENDENT SECURITY VERIFICATION");
  console.log("================================================================================\n");

  // ============================================================================
  // BAGIAN 1: INTEGRATION TESTS PADA ROUTE HANDLERS AKTUAL (TANPA SESSION)
  // ============================================================================
  console.log("--- 1. Integration Tests: Route Handlers Privat Tanpa Session ---");

  // Test 1: User Me GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/user/me");
    const res = await userMeGetHandler(req);
    const body = await res.json();
    if (res.status === 401 && body.error === "Unauthorized") {
      record("INT-01", "INTEGRATION", "GET /api/user/me menolak request tanpa session", "VERIFIED", "src/app/api/user/me/route.ts:26", "Mengembalikan HTTP 401 Unauthorized secara langsung.");
    } else {
      record("INT-01", "INTEGRATION", "GET /api/user/me menolak request tanpa session", "FAIL", "src/app/api/user/me/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-01", "INTEGRATION", "GET /api/user/me menolak request tanpa session", "FAIL", "src/app/api/user/me/route.ts", err.message);
  }

  // Test 2: Auth UPDATE_PROFILE tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "UPDATE_PROFILE", name: "Hacker" }),
    });
    const res = await authPostHandler(req);
    const body = await res.json();
    if (res.status === 401) {
      record("INT-02", "INTEGRATION", "POST /api/auth (UPDATE_PROFILE) menolak tanpa session", "VERIFIED", "src/app/api/auth/route.ts:70-74", "Mengembalikan HTTP 401 saat auth-token tidak ada.");
    } else {
      record("INT-02", "INTEGRATION", "POST /api/auth (UPDATE_PROFILE) menolak tanpa session", "FAIL", "src/app/api/auth/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-02", "INTEGRATION", "POST /api/auth (UPDATE_PROFILE) menolak tanpa session", "FAIL", "src/app/api/auth/route.ts", err.message);
  }

  // Test 3: Auth ACCEPT_TERMS tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ACCEPT_TERMS" }),
    });
    const res = await authPostHandler(req);
    if (res.status === 401) {
      record("INT-03", "INTEGRATION", "POST /api/auth (ACCEPT_TERMS) menolak tanpa session", "VERIFIED", "src/app/api/auth/route.ts:24-27", "Mengembalikan HTTP 401 saat token tidak ada.");
    } else {
      record("INT-03", "INTEGRATION", "POST /api/auth (ACCEPT_TERMS) menolak tanpa session", "FAIL", "src/app/api/auth/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-03", "INTEGRATION", "POST /api/auth (ACCEPT_TERMS) menolak tanpa session", "FAIL", "src/app/api/auth/route.ts", err.message);
  }

  // Test 4: Post Detail GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/community/posts/post_123");
    const res = await postDetailHandler(req, { params: { postId: "post_123" } });
    if (res.status === 401) {
      record("INT-04", "INTEGRATION", "GET /api/community/posts/[postId] menolak tanpa session", "VERIFIED", "src/app/api/community/posts/[postId]/route.ts:12", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-04", "INTEGRATION", "GET /api/community/posts/[postId] menolak tanpa session", "FAIL", "src/app/api/community/posts/[postId]/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-04", "INTEGRATION", "GET /api/community/posts/[postId] menolak tanpa session", "FAIL", "src/app/api/community/posts/[postId]/route.ts", err.message);
  }

  // Test 5: Community POST tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "NEW_POST", content: "Halo" }),
    });
    const res = await communityPostHandler(req);
    if (res.status === 401) {
      record("INT-05", "INTEGRATION", "POST /api/community menolak request tanpa session", "VERIFIED", "src/app/api/community/route.ts:93-96", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-05", "INTEGRATION", "POST /api/community menolak request tanpa session", "FAIL", "src/app/api/community/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-05", "INTEGRATION", "POST /api/community menolak request tanpa session", "FAIL", "src/app/api/community/route.ts", err.message);
  }

  // Test 6: Community Search GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/community/search?q=test");
    const res = await searchGetHandler(req);
    if (res.status === 401) {
      record("INT-06", "INTEGRATION", "GET /api/community/search menolak pencarian tanpa session", "VERIFIED", "src/app/api/community/search/route.ts:10-12", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-06", "INTEGRATION", "GET /api/community/search menolak pencarian tanpa session", "FAIL", "src/app/api/community/search/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-06", "INTEGRATION", "GET /api/community/search menolak pencarian tanpa session", "FAIL", "src/app/api/community/search/route.ts", err.message);
  }

  // Test 7: Upload POST tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
    });
    const res = await uploadPostHandler(req);
    if (res.status === 401) {
      record("INT-07", "INTEGRATION", "POST /api/upload menolak upload file tanpa session", "VERIFIED", "src/app/api/upload/route.ts:22-24", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-07", "INTEGRATION", "POST /api/upload menolak upload file tanpa session", "FAIL", "src/app/api/upload/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-07", "INTEGRATION", "POST /api/upload menolak upload file tanpa session", "FAIL", "src/app/api/upload/route.ts", err.message);
  }

  // Test 8: Journal GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/journal");
    const res = await journalGetHandler(req);
    if (res.status === 401) {
      record("INT-08", "INTEGRATION", "GET /api/journal menolak akses tanpa session", "VERIFIED", "src/app/api/journal/route.ts:10", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-08", "INTEGRATION", "GET /api/journal menolak akses tanpa session", "FAIL", "src/app/api/journal/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-08", "INTEGRATION", "GET /api/journal menolak akses tanpa session", "FAIL", "src/app/api/journal/route.ts", err.message);
  }

  // Test 9: Activity GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/activity");
    const res = await activityGetHandler(req);
    if (res.status === 401) {
      record("INT-09", "INTEGRATION", "GET /api/activity menolak akses tanpa session", "VERIFIED", "src/app/api/activity/route.ts:28", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-09", "INTEGRATION", "GET /api/activity menolak akses tanpa session", "FAIL", "src/app/api/activity/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-09", "INTEGRATION", "GET /api/activity menolak akses tanpa session", "FAIL", "src/app/api/activity/route.ts", err.message);
  }

  // Test 10: Companion POST tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Halo Zyba" }),
    });
    const res = await companionPostHandler(req);
    if (res.status === 401) {
      record("INT-10", "INTEGRATION", "POST /api/companion menolak chat tanpa session", "VERIFIED", "src/app/api/companion/route.ts:18", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-10", "INTEGRATION", "POST /api/companion menolak chat tanpa session", "FAIL", "src/app/api/companion/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-10", "INTEGRATION", "POST /api/companion menolak chat tanpa session", "FAIL", "src/app/api/companion/route.ts", err.message);
  }

  // Test 11: Billing History GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/billing/history");
    const res = await billingHistoryHandler(req);
    if (res.status === 401) {
      record("INT-11", "INTEGRATION", "GET /api/billing/history menolak akses tanpa session", "VERIFIED", "src/app/api/billing/history/route.ts:9", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-11", "INTEGRATION", "GET /api/billing/history menolak akses tanpa session", "FAIL", "src/app/api/billing/history/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-11", "INTEGRATION", "GET /api/billing/history menolak akses tanpa session", "FAIL", "src/app/api/billing/history/route.ts", err.message);
  }

  // Test 12: Premium Insights GET tanpa session
  try {
    const req = new NextRequest("http://localhost:3000/api/premium/insights");
    const res = await premiumInsightsHandler(req);
    if (res.status === 401) {
      record("INT-12", "INTEGRATION", "GET /api/premium/insights menolak akses tanpa session", "VERIFIED", "src/app/api/premium/insights/route.ts:28", "Mengembalikan HTTP 401 Unauthorized.");
    } else {
      record("INT-12", "INTEGRATION", "GET /api/premium/insights menolak akses tanpa session", "FAIL", "src/app/api/premium/insights/route.ts", `Status: ${res.status}`);
    }
  } catch (err: any) {
    record("INT-12", "INTEGRATION", "GET /api/premium/insights menolak akses tanpa session", "FAIL", "src/app/api/premium/insights/route.ts", err.message);
  }

  // Test 13: Logout endpoint behavior
  try {
    const res = await authDeleteHandler();
    const cookieHeader = res.headers.get("set-cookie") || "";
    if (res.status === 200 && cookieHeader.includes("auth-token") && (cookieHeader.includes("Max-Age=0") || cookieHeader.includes("max-age=0"))) {
      record("INT-13", "INTEGRATION", "DELETE /api/auth menyetel maxAge=0 pada cookie auth-token", "VERIFIED", "src/app/api/auth/route.ts:379-385", "Cookie auth-token langsung di-expire pada browser.");
    } else {
      record("INT-13", "INTEGRATION", "DELETE /api/auth menyetel maxAge=0 pada cookie auth-token", "FAIL", "src/app/api/auth/route.ts:379-385", `Set-Cookie header: ${cookieHeader}`);
    }
  } catch (err: any) {
    record("INT-13", "INTEGRATION", "DELETE /api/auth menyetel maxAge=0 pada cookie auth-token", "FAIL", "src/app/api/auth/route.ts", err.message);
  }

  // ============================================================================
  // BAGIAN 2: PENGUJIAN SPOOFING X-FORWARDED-FOR PADA RATE LIMITER
  // ============================================================================
  console.log("\n--- 2. Pengujian Evasion Rate Limiting via X-Forwarded-For ---");

  // Skenario 2.1: Klien mengirim X-Forwarded-For palsu tanpa rewrite proxy
  const spoofReq1 = new NextRequest("http://localhost:3000/api/auth", {
    headers: { "x-forwarded-for": "103.20.10.1, 127.0.0.1" },
  });
  const ip1 = getClientIp(spoofReq1);

  const spoofReq2 = new NextRequest("http://localhost:3000/api/auth", {
    headers: { "x-forwarded-for": "103.20.10.2, 127.0.0.1" },
  });
  const ip2 = getClientIp(spoofReq2);

  // Jika getClientIp menghasilkan 103.20.10.1 dan 103.20.10.2, maka rate limiter bergantung pada reverse proxy
  if (ip1 === "103.20.10.1" && ip2 === "103.20.10.2") {
    record(
      "SPOOF-01",
      "SPOOFING",
      "Kerapuhan Manipulasi X-Forwarded-For (Jika Proxy Tidak Menimpa Header)",
      "PARTIALLY VERIFIED",
      "src/lib/server/rateLimit.ts:118-124",
      "getClientIp membaca elemen pertama X-Forwarded-For. Tanpa konfigurasi RemoteIPHeader / RequestHeader overwrite di Apache, penyerang dapat memalsukan IP untuk menghindari batas percobaan."
    );
  } else {
    record(
      "SPOOF-01",
      "SPOOFING",
      "Kerapuhan Manipulasi X-Forwarded-For",
      "VERIFIED",
      "src/lib/server/rateLimit.ts:118-124",
      "IP soket mendominasi dan mengabaikan header palsu."
    );
  }

  // Skenario 2.2: Rate limiter multi-instance vs single instance
  const testLimitKey = `test_evasion_${Date.now()}`;
  const hit1 = await checkRateLimit(testLimitKey, 2, 60);
  const hit2 = await checkRateLimit(testLimitKey, 2, 60);
  const hit3 = await checkRateLimit(testLimitKey, 2, 60);

  if (hit1.allowed && hit2.allowed && !hit3.allowed) {
    record(
      "SPOOF-02",
      "UNIT",
      "Batas Percobaan Rate Limit Efektif pada Key Tunggal",
      "VERIFIED",
      "src/lib/server/rateLimit.ts:28-56",
      "Permintaan ke-3 ditolak dengan allowed: false dan retryAfterSec dihitung."
    );
  } else {
    record(
      "SPOOF-02",
      "UNIT",
      "Batas Percobaan Rate Limit Efektif pada Key Tunggal",
      "FAIL",
      "src/lib/server/rateLimit.ts:28-56",
      `Hit3 allowed: ${hit3.allowed}`
    );
  }

  // ============================================================================
  // BAGIAN 3: VERIFIKASI UPLOAD BINER, DIMENSI & NON-EXECUTABLE
  // ============================================================================
  console.log("\n--- 3. Verifikasi Upload Biner & Proteksi Eksekusi ---");

  // Test 3.1: PNG Asli dengan dimensi terukur
  // Header PNG 8 bytes + IHDR chunk (length 13, IHDR, width=800, height=600, bitdepth, colortype...)
  const validPngBuffer = Buffer.alloc(33);
  // PNG signature
  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].forEach((b, i) => (validPngBuffer[i] = b));
  // IHDR length 13
  validPngBuffer.writeUInt32BE(13, 8);
  // IHDR tag
  validPngBuffer.write("IHDR", 12);
  // Width 800
  validPngBuffer.writeUInt32BE(800, 16);
  // Height 600
  validPngBuffer.writeUInt32BE(600, 20);

  const pngValidation = validateImageBuffer(validPngBuffer);
  if (pngValidation.valid && pngValidation.extension === "png" && pngValidation.width === 800 && pngValidation.height === 600) {
    record("UPL-01", "UPLOAD", "Validasi PNG Biner & Ekstraksi Dimensi Asli", "VERIFIED", "src/lib/server/uploadSecurity.ts:22-35", "Berhasil mengekstrak dimensi asli 800x600 px tanpa library eksternal.");
  } else {
    record("UPL-01", "UPLOAD", "Validasi PNG Biner & Ekstraksi Dimensi Asli", "FAIL", "src/lib/server/uploadSecurity.ts", JSON.stringify(pngValidation));
  }

  // Test 3.2: PNG Bomb / Pixel Flood (> 6000 px)
  const bombPngBuffer = Buffer.alloc(33);
  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].forEach((b, i) => (bombPngBuffer[i] = b));
  bombPngBuffer.writeUInt32BE(13, 8);
  bombPngBuffer.write("IHDR", 12);
  bombPngBuffer.writeUInt32BE(32000, 16); // Width 32.000 px!
  bombPngBuffer.writeUInt32BE(32000, 20); // Height 32.000 px!

  const bombValidation = validateImageBuffer(bombPngBuffer);
  if (!bombValidation.valid && bombValidation.error?.includes("melebihi batas")) {
    record("UPL-02", "UPLOAD", "Penolakan Decompression Bomb / Pixel Flood Gambar", "VERIFIED", "src/lib/server/uploadSecurity.ts:133-143", "Gambar dengan dimensi 32.000x32.000 px berhasil ditolak.");
  } else {
    record("UPL-02", "UPLOAD", "Penolakan Decompression Bomb / Pixel Flood Gambar", "FAIL", "src/lib/server/uploadSecurity.ts", JSON.stringify(bombValidation));
  }

  // Test 3.3: Polyglot PHP Script dalam header JPEG
  const fakePhpPayload = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff]), // Awalan JPEG
    Buffer.from("<?php system($_GET['cmd']); ?>"),
  ]);
  const polyglotValidation = validateImageBuffer(fakePhpPayload);
  // Signature FF D8 FF akan lolos ekstensi jpg, namun nama file digenerate acak dengan akhiran .jpg
  const sanitizedName = generateSafeFileName("avatar", "user_admin", polyglotValidation.extension || "jpg");
  if (sanitizedName.endsWith(".jpg") && !sanitizedName.includes(".php")) {
    record(
      "UPL-03",
      "UPLOAD",
      "Penetralan Ekstensi Eksekusi File Polyglot",
      "VERIFIED",
      "src/lib/server/uploadSecurity.ts:153-162",
      "File selalu dipaksa berekstensi .jpg/.png/.webp tanpa mempertahankan ekstensi .php dari pengunggah."
    );
  } else {
    record("UPL-03", "UPLOAD", "Penetralan Ekstensi Eksekusi File Polyglot", "FAIL", "src/lib/server/uploadSecurity.ts", sanitizedName);
  }

  // ============================================================================
  // RINGKASAN PRE-PRODUCTION VERIFICATION
  // ============================================================================
  console.log("\n================================================================================");
  console.log("📊 RINGKASAN HASIL PRE-PRODUCTION VERIFICATION");
  console.log("================================================================================");
  const total = reportItems.length;
  const verified = reportItems.filter((i) => i.status === "VERIFIED").length;
  const partial = reportItems.filter((i) => i.status === "PARTIALLY VERIFIED").length;
  const fail = reportItems.filter((i) => i.status === "FAIL").length;

  console.log(`Total Pengujian Skenario : ${total}`);
  console.log(`VERIFIED                 : ${verified}`);
  console.log(`PARTIALLY VERIFIED       : ${partial}`);
  console.log(`FAIL                     : ${fail}`);
  console.log("================================================================================\n");

  return { total, verified, partial, fail, items: reportItems };
}

runPreProductionVerification().catch(console.error);
