import { createHmac, timingSafeEqual } from "crypto";

const OTP_TTL_SECONDS = 10 * 60;
const COOKIE_NAME = "zyba_otp_challenge";

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("NEXTAUTH_SECRET must be configured for OTP verification.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function hashOtp(otp: string): string {
  return createHmac("sha256", getSecret()).update("otp:" + otp).digest("base64url");
}

export function createOtpChallenge(email: string, otp: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Math.floor(Date.now() / 1000) + OTP_TTL_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({
      email: normalizedEmail,
      expiresAt,
      otpHash: hashOtp(otp),
    }),
    "utf8"
  ).toString("base64url");

  return {
    token: payload + "." + sign(payload),
    maxAge: OTP_TTL_SECONDS,
  };
}

export function verifyOtpChallenge(
  token: string | undefined,
  email: string,
  otp: string
): { valid: boolean; reason?: "missing" | "invalid" | "expired" | "mismatch" } {
  if (!token) return { valid: false, reason: "missing" };

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { valid: false, reason: "invalid" };

  const expectedSignature = sign(payload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { valid: false, reason: "invalid" };
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      expiresAt?: number;
      otpHash?: string;
    };

    if (
      parsed.email !== email.toLowerCase().trim() ||
      !parsed.expiresAt ||
      !parsed.otpHash
    ) {
      return { valid: false, reason: "invalid" };
    }

    if (Math.floor(Date.now() / 1000) >= parsed.expiresAt) {
      return { valid: false, reason: "expired" };
    }

    const actualHash = hashOtp(otp);
    const providedHash = Buffer.from(parsed.otpHash);
    const expectedHash = Buffer.from(actualHash);
    if (
      providedHash.length !== expectedHash.length ||
      !timingSafeEqual(providedHash, expectedHash)
    ) {
      return { valid: false, reason: "mismatch" };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "invalid" };
  }
}

export { COOKIE_NAME, OTP_TTL_SECONDS };
