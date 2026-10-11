/**
 * OTP Challenge — server-side HMAC-signed cookie + in-memory attempt tracking.
 *
 * Properti keamanan:
 * - OTP di-hash sebelum disimpan di cookie (HMAC-SHA256, tidak reversible dari cookie).
 * - Cookie ditandatangani server; modifikasi apapun akan gagal verifikasi.
 * - Setiap email+purpose hanya punya satu challenge aktif — request baru membatalkan yang lama.
 * - Maksimal 5 percobaan verifikasi per challenge.
 * - Cooldown 60 detik antar request OTP untuk email+purpose yang sama.
 * - OTP berlaku 10 menit.
 * - Setelah berhasil digunakan, token dikosongkan oleh caller (hapus cookie).
 */

import { createHmac, timingSafeEqual } from "crypto";

// ── Constants ────────────────────────────────────────────────────────────────

export const OTP_TTL_SECONDS = 10 * 60;          // 10 menit
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;        // 1 menit cooldown antar request OTP

// Cookie names — terpisah per purpose supaya tidak bisa cross-purpose
export const COOKIE_NAME_SIGNUP = "zyba_otp_signup";
export const COOKIE_NAME_RESET  = "zyba_otp_reset";

/**
 * @deprecated Gunakan COOKIE_NAME_SIGNUP.
 * Dipertahankan untuk kompatibilitas mundur dengan kode lama.
 */
export const COOKIE_NAME = COOKIE_NAME_SIGNUP;

export type OtpPurpose = "SIGNUP" | "RESET_PASSWORD";

// ── In-memory attempt tracker (per challenge token signature) ─────────────────
// Key: base64url payload (unique per email+otp+expiry), Value: attempt count
// Dibersihkan saat TTL habis via cleanup task ringan.
const attemptTracker = new Map<string, { count: number; expiresAt: number }>();

// ── In-memory resend cooldown tracker ────────────────────────────────────────
// Key: `email:purpose`, Value: timestamp (ms) kapan boleh request lagi
const resendCooldown = new Map<string, number>();

// ── Secret ───────────────────────────────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "NEXTAUTH_SECRET must be at least 32 characters for OTP HMAC signing."
    );
  }
  return secret;
}

// ── HMAC helpers ─────────────────────────────────────────────────────────────

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function hashOtp(otp: string): string {
  return createHmac("sha256", getSecret()).update("otp:" + otp).digest("base64url");
}

// ── Cookie name resolver ──────────────────────────────────────────────────────

export function cookieNameForPurpose(purpose: OtpPurpose): string {
  return purpose === "RESET_PASSWORD" ? COOKIE_NAME_RESET : COOKIE_NAME_SIGNUP;
}

// ── Payload interface ─────────────────────────────────────────────────────────

interface ChallengePayload {
  email: string;
  purpose: OtpPurpose;
  expiresAt: number;       // Unix timestamp (seconds)
  issuedAt: number;        // Unix timestamp (seconds) — untuk cooldown
  otpHash: string;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Periksa apakah email+purpose masih dalam cooldown resend.
 * Returns sisa detik cooldown (0 = boleh request).
 */
export function checkResendCooldown(email: string, purpose: OtpPurpose): number {
  const key = `${email.toLowerCase().trim()}:${purpose}`;
  const allowedAt = resendCooldown.get(key);
  if (!allowedAt) return 0;
  const remaining = Math.ceil((allowedAt - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

/**
 * Buat OTP challenge baru.
 * Otomatis menggantikan challenge lama untuk email+purpose yang sama.
 * Menetapkan cooldown resend (60 detik) dan membersihkan attempt lama.
 */
export function createOtpChallenge(
  email: string,
  otp: string,
  purpose: OtpPurpose = "SIGNUP"
): { token: string; maxAge: number } {
  const normalizedEmail = email.toLowerCase().trim();
  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAt = nowSec + OTP_TTL_SECONDS;

  const payload = Buffer.from(
    JSON.stringify({
      email: normalizedEmail,
      purpose,
      expiresAt,
      issuedAt: nowSec,
      otpHash: hashOtp(otp),
    } satisfies ChallengePayload),
    "utf8"
  ).toString("base64url");

  // Track attempt count under this payload key
  attemptTracker.set(payload, {
    count: 0,
    expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
  });

  // Set resend cooldown
  const cdKey = `${normalizedEmail}:${purpose}`;
  resendCooldown.set(cdKey, Date.now() + RESEND_COOLDOWN_SECONDS * 1000);

  // Cleanup expired attempt entries (lightweight, non-blocking)
  if (attemptTracker.size > 5000) {
    const now = Date.now();
    for (const [k, v] of attemptTracker.entries()) {
      if (v.expiresAt <= now) attemptTracker.delete(k);
    }
  }

  return {
    token: payload + "." + sign(payload),
    maxAge: OTP_TTL_SECONDS,
  };
}

export type VerifyResult =
  | { valid: true }
  | {
      valid: false;
      reason:
        | "missing"
        | "invalid"
        | "expired"
        | "mismatch"
        | "too_many_attempts"
        | "wrong_purpose"
        | "wrong_email";
    };

/**
 * Verifikasi OTP challenge.
 *
 * @param token         - Nilai cookie zyba_otp_* dari request.
 * @param email         - Email yang diklaim pengguna saat verifikasi.
 * @param otp           - Kode OTP yang dimasukkan pengguna.
 * @param purpose       - Tujuan OTP yang diharapkan.
 */
export function verifyOtpChallenge(
  token: string | undefined,
  email: string,
  otp: string,
  purpose: OtpPurpose = "SIGNUP"
): VerifyResult {
  if (!token) return { valid: false, reason: "missing" };

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return { valid: false, reason: "invalid" };

  const payload = token.slice(0, dotIdx);
  const signature = token.slice(dotIdx + 1);

  if (!payload || !signature) return { valid: false, reason: "invalid" };

  // 1. Verifikasi tanda tangan HMAC (timing-safe)
  const expectedSignature = sign(payload);
  const providedBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (
    providedBuf.length !== expectedBuf.length ||
    !timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return { valid: false, reason: "invalid" };
  }

  // 2. Decode payload
  let parsed: ChallengePayload;
  try {
    parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as ChallengePayload;
  } catch {
    return { valid: false, reason: "invalid" };
  }

  if (
    !parsed.email ||
    !parsed.purpose ||
    !parsed.expiresAt ||
    !parsed.otpHash
  ) {
    return { valid: false, reason: "invalid" };
  }

  // 3. Pastikan purpose cocok (OTP signup tidak bisa dipakai reset, dan sebaliknya)
  if (parsed.purpose !== purpose) {
    return { valid: false, reason: "wrong_purpose" };
  }

  // 4. Pastikan email cocok (OTP email A tidak berlaku untuk email B)
  if (parsed.email !== email.toLowerCase().trim()) {
    return { valid: false, reason: "wrong_email" };
  }

  // 5. Periksa expired
  if (Math.floor(Date.now() / 1000) >= parsed.expiresAt) {
    attemptTracker.delete(payload);
    return { valid: false, reason: "expired" };
  }

  // 6. Periksa jumlah percobaan
  const tracker = attemptTracker.get(payload);
  const attempts = tracker?.count ?? 0;
  if (attempts >= MAX_ATTEMPTS) {
    return { valid: false, reason: "too_many_attempts" };
  }

  // 7. Verifikasi OTP hash (timing-safe)
  const actualHash = hashOtp(otp);
  const providedHash = Buffer.from(parsed.otpHash);
  const expectedHash = Buffer.from(actualHash);
  if (
    providedHash.length !== expectedHash.length ||
    !timingSafeEqual(providedHash, expectedHash)
  ) {
    // Increment attempt count
    attemptTracker.set(payload, {
      count: attempts + 1,
      expiresAt: tracker?.expiresAt ?? Date.now() + OTP_TTL_SECONDS * 1000,
    });
    return { valid: false, reason: "mismatch" };
  }

  // Sukses — hapus dari tracker agar tidak bisa dipakai lagi
  attemptTracker.delete(payload);

  return { valid: true };
}

export function createOtpVerifiedProof(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const payload = Buffer.from(
    JSON.stringify({ email: normalizedEmail, expiresAt: Math.floor(Date.now() / 1000) + OTP_TTL_SECONDS }),
    "utf8"
  ).toString("base64url");
  return payload + "." + sign(payload);
}

export function verifyOtpVerifiedProof(token: string | undefined, email: string): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const expectedSignature = sign(payload);
    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      expiresAt?: number;
    };
    return parsed.email === email.toLowerCase().trim()
      && typeof parsed.expiresAt === "number"
      && Math.floor(Date.now() / 1000) < parsed.expiresAt;
  } catch {
    return false;
  }
}

// ── Proof token verification ──────────────────────────────────────────────────
// Digunakan oleh SIGNUP/RESET endpoint untuk memvalidasi bukti verifikasi OTP
// yang di-set oleh /api/auth/otp setelah VERIFY berhasil.

export interface OtpProofResult {
  valid: boolean;
  email?: string;
  purpose?: OtpPurpose;
  reason?: "missing" | "invalid" | "expired" | "wrong_purpose" | "wrong_email";
}

/**
 * Verifikasi proof token OTP yang ditandatangani server.
 * Proof dibuat oleh /api/auth/otp setelah verifikasi OTP berhasil.
 *
 * @param proofToken - Nilai cookie zyba_otp_proof_*.
 * @param email      - Email yang diklaim (harus cocok dengan proof).
 * @param purpose    - Purpose yang diharapkan (harus cocok dengan proof).
 */
export function verifyOtpProof(
  proofToken: string | undefined,
  email: string,
  purpose: OtpPurpose
): OtpProofResult {
  if (!proofToken) return { valid: false, reason: "missing" };

  const dotIdx = proofToken.lastIndexOf(".");
  if (dotIdx === -1) return { valid: false, reason: "invalid" };

  const payload = proofToken.slice(0, dotIdx);
  const sig = proofToken.slice(dotIdx + 1);

  if (!payload || !sig) return { valid: false, reason: "invalid" };

  // Verifikasi HMAC
  const expectedSig = createHmac("sha256", getSecret())
    .update("proof:" + payload)
    .digest("base64url");

  const providedBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);

  if (
    providedBuf.length !== expectedBuf.length ||
    !timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return { valid: false, reason: "invalid" };
  }

  // Decode payload
  let parsed: {
    email?: string;
    purpose?: string;
    verifiedAt?: number;
    exp?: number;
  };
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "invalid" };
  }

  if (!parsed.email || !parsed.purpose || !parsed.exp) {
    return { valid: false, reason: "invalid" };
  }

  // Cek expired
  if (Math.floor(Date.now() / 1000) >= parsed.exp) {
    return { valid: false, reason: "expired" };
  }

  // Cek purpose
  if (parsed.purpose !== purpose) {
    return { valid: false, reason: "wrong_purpose" };
  }

  // Cek email (timing-safe string compare via hash)
  const expectedEmailHash = createHmac("sha256", getSecret())
    .update("email:" + email.toLowerCase().trim())
    .digest("base64url");
  const storedEmailHash = createHmac("sha256", getSecret())
    .update("email:" + parsed.email.toLowerCase().trim())
    .digest("base64url");

  const ebuf1 = Buffer.from(expectedEmailHash);
  const ebuf2 = Buffer.from(storedEmailHash);
  if (ebuf1.length !== ebuf2.length || !timingSafeEqual(ebuf1, ebuf2)) {
    return { valid: false, reason: "wrong_email" };
  }

  return { valid: true, email: parsed.email, purpose: parsed.purpose as OtpPurpose };
}

/** Nama cookie proof untuk purpose tertentu. */
export function proofCookieNameForPurpose(purpose: OtpPurpose): string {
  return `zyba_otp_proof_${purpose.toLowerCase()}`;
}
