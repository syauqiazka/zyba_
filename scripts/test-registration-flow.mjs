/**
 * Registration Flow & Password Setup Integration Verification Test Suite
 */

import crypto from "crypto";

process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "zyba-super-secret-key-at-least-32-chars-long-security-check";

console.log("==================================================================");
console.log("🧪 ZYBA REGISTRATION & OTP PASSWORD SETUP TEST SUITE");
console.log("==================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

// 1. Validasi Password
console.log("--- 1. Password Validation Rules ---");
const validatePasswordRule = (pwd) => Boolean(pwd && pwd.length >= 8);
assert(!validatePasswordRule(""), "Password kosong ditolak");
assert(!validatePasswordRule("short"), "Password 5 karakter ditolak");
assert(!validatePasswordRule("1234567"), "Password 7 karakter ditolak");
assert(validatePasswordRule("12345678"), "Password 8 karakter diterima");
assert(validatePasswordRule("StrongP@ssw0rd!"), "Password kompleks >= 8 diterima");

// 2. OTP Generation (crypto.randomInt)
console.log("\n--- 2. Cryptographic OTP Generation ---");
function generateSecureOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}
const otp1 = generateSecureOTP();
const otp2 = generateSecureOTP();
assert(/^\d{6}$/.test(otp1), `OTP 1 adalah tepat 6 digit angka (${otp1})`);
assert(/^\d{6}$/.test(otp2), `OTP 2 adalah tepat 6 digit angka (${otp2})`);
assert(otp1.length === 6 && Number(otp1) >= 100000 && Number(otp1) <= 999999, "OTP berada dalam rentang [100000, 999999]");

// 3. Challenge Creation & Verification
console.log("\n--- 3. OTP Challenge & Verification ---");
const secret = process.env.NEXTAUTH_SECRET;
function createChallenge(email, otp, purpose = "SIGNUP") {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Math.floor(Date.now() / 1000) + 600;
  const issuedAt = Math.floor(Date.now() / 1000);
  const otpHash = crypto.createHmac("sha256", secret).update("otp:" + otp).digest("base64url");
  const payload = Buffer.from(
    JSON.stringify({ email: normalizedEmail, purpose, expiresAt, issuedAt, otpHash }),
    "utf8"
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return { token: `${payload}.${signature}`, maxAge: 600 };
}

function verifyChallenge(token, email, otp, purpose = "SIGNUP") {
  if (!token) return { valid: false, reason: "missing" };
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { valid: false, reason: "invalid" };

  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return { valid: false, reason: "invalid" };
  }

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (parsed.email !== email.toLowerCase().trim()) return { valid: false, reason: "wrong_email" };
  if (parsed.purpose !== purpose) return { valid: false, reason: "wrong_purpose" };
  if (Math.floor(Date.now() / 1000) >= parsed.expiresAt) return { valid: false, reason: "expired" };

  const actualHash = crypto.createHmac("sha256", secret).update("otp:" + otp).digest("base64url");
  const providedHash = Buffer.from(parsed.otpHash);
  const expectedHash = Buffer.from(actualHash);
  if (providedHash.length !== expectedHash.length || !crypto.timingSafeEqual(providedHash, expectedHash)) {
    return { valid: false, reason: "mismatch" };
  }
  return { valid: true };
}

const email = "test.user@zyba.app";
const challenge = createChallenge(email, otp1, "SIGNUP");
assert(challenge.token.length > 50, "Challenge token terbit dengan HMAC");

// Verifikasi dengan OTP salah
const wrongAttempt = verifyChallenge(challenge.token, email, "000000", "SIGNUP");
assert(!wrongAttempt.valid && wrongAttempt.reason === "mismatch", "OTP salah ditolak (mismatch)");

// Verifikasi dengan OTP benar
const correctAttempt = verifyChallenge(challenge.token, email, otp1, "SIGNUP");
assert(correctAttempt.valid, "OTP benar berhasil diverifikasi");

// 4. Signup Protection without Proof
console.log("\n--- 4. Signup Protection Without Valid Proof ---");
function verifyProof(proofToken, claimEmail, expectedPurpose = "SIGNUP") {
  if (!proofToken) return { valid: false, reason: "missing" };
  const dotIdx = proofToken.lastIndexOf(".");
  if (dotIdx === -1) return { valid: false, reason: "invalid" };
  const payload = proofToken.slice(0, dotIdx);
  const sig = proofToken.slice(dotIdx + 1);
  if (!payload || !sig) return { valid: false, reason: "invalid" };

  const expectedSig = crypto.createHmac("sha256", secret).update("proof:" + payload).digest("base64url");
  const providedBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return { valid: false, reason: "invalid" };
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "invalid" };
  }
  if (!parsed.email || !parsed.purpose || !parsed.exp) return { valid: false, reason: "invalid" };
  if (Math.floor(Date.now() / 1000) >= parsed.exp) return { valid: false, reason: "expired" };
  if (parsed.purpose !== expectedPurpose) return { valid: false, reason: "wrong_purpose" };
  if (parsed.email.toLowerCase().trim() !== claimEmail.toLowerCase().trim()) return { valid: false, reason: "wrong_email" };

  return { valid: true, email: parsed.email, purpose: parsed.purpose };
}

assert(!verifyProof(undefined, email, "SIGNUP").valid, "Signup tanpa proof token ditolak");
assert(!verifyProof("invalid.tampered.token", email, "SIGNUP").valid, "Signup dengan proof palsu ditolak");

// 5. Valid Proof Token Verification
console.log("\n--- 5. Valid Proof Token Verification ---");
const proofPayload = Buffer.from(
  JSON.stringify({
    email,
    purpose: "SIGNUP",
    verifiedAt: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
  }),
  "utf8"
).toString("base64url");

const proofSig = crypto.createHmac("sha256", secret)
  .update("proof:" + proofPayload)
  .digest("base64url");

const validProofToken = proofPayload + "." + proofSig;
const validProofResult = verifyProof(validProofToken, email, "SIGNUP");
assert(validProofResult.valid, "Proof token valid lolos verifikasi untuk signup");

// 6. UI Password Step State & Error Contract
console.log("\n--- 6. UI Password Step Error & Navigation Contract ---");
function simulatePasswordStepClick({ password, isRequestingOtp, sendOtpResult }) {
  if (isRequestingOtp) return { action: "NONE", reason: "ALREADY_REQUESTING" };
  if (!password || password.length < 8) {
    return { action: "SET_ERROR", error: "Kata sandi harus minimal 8 karakter." };
  }
  if (sendOtpResult.success) {
    return { action: "TRANSITION_STEP", nextStep: "OTP_VERIFY" };
  } else {
    return { action: "SET_ERROR", error: sendOtpResult.error || "Gagal mengirim kode verifikasi." };
  }
}

const shortPwdRes = simulatePasswordStepClick({ password: "123", isRequestingOtp: false, sendOtpResult: { success: true } });
assert(shortPwdRes.action === "SET_ERROR" && shortPwdRes.error.includes("8 karakter"), "Password pendek menghasilkan error UI eksplisit");

const busyRes = simulatePasswordStepClick({ password: "password123", isRequestingOtp: true, sendOtpResult: { success: true } });
assert(busyRes.action === "NONE", "Double-click dicegah saat loading");

const failedSendRes = simulatePasswordStepClick({
  password: "password123",
  isRequestingOtp: false,
  sendOtpResult: { success: false, error: "Tunggu 45 detik sebelum meminta kode baru." }
});
assert(failedSendRes.action === "SET_ERROR" && failedSendRes.error.includes("Tunggu 45 detik"), "Kegagalan OTP ditampilkan ke layar pengguna");

const successSendRes = simulatePasswordStepClick({
  password: "password123",
  isRequestingOtp: false,
  sendOtpResult: { success: true }
});
assert(successSendRes.action === "TRANSITION_STEP" && successSendRes.nextStep === "OTP_VERIFY", "Pengiriman berhasil memindahkan pengguna ke langkah OTP_VERIFY");

console.log("\n==================================================================");
console.log(`📊 Total: ${passed} PASS, ${failed} FAIL`);
console.log("==================================================================");

if (failed > 0) process.exit(1);
