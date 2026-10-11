/**
 * Unit & Integration Test Suite for Brevo Transactional Email API (HTTPS) & OTP Security
 * 
 * Tests:
 * 1. Safe config handling when BREVO_API_KEY is missing
 * 2. Successful OTP email dispatch via Brevo HTTPS API (status 201/200)
 * 3. HTTP 400 / 401 / 403 / 429 / 500 error responses
 * 4. Network errors and timeout handling (no false success)
 * 5. Secret & OTP isolation (no leaks in logs or client messages)
 * 6. Sender address resolution & extraction (default, BREVO_SENDER_EMAIL, EMAIL_FROM)
 * 7. Verification that NO fallback to SMTP occurs
 * 8. Cryptographic OTP generation, HMAC challenge, and proof tokens
 * 9. Cooldown and max-attempts enforcement
 */

import crypto from "crypto";

process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  "zyba-brevo-super-secret-key-at-least-32-chars-for-hmac";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

// Intercept console messages for leak assertions
const capturedLogs = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

function startCapturingLogs() {
  capturedLogs.length = 0;
  console.log = (...args) => {
    capturedLogs.push({ type: "log", text: args.map(String).join(" ") });
    originalConsoleLog(...args);
  };
  console.error = (...args) => {
    capturedLogs.push({ type: "error", text: args.map(String).join(" ") });
    originalConsoleError(...args);
  };
}

function stopCapturingLogs() {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}

async function runTests() {
  console.log("==================================================================");
  console.log("🧪 ZYBA BREVO HTTPS API & OTP SECURITY VERIFICATION SUITE");
  console.log("==================================================================\n");

  const {
    sendOTPEmail,
    generateOTP,
    resolveSenderEmail,
    extractEmailAddress,
    DEFAULT_BREVO_SENDER,
  } = await import("../src/backend/auth/emailService.ts");

  const {
    createOtpChallenge,
    verifyOtpChallenge,
    checkResendCooldown,
    verifyOtpProof,
    proofCookieNameForPurpose,
    MAX_ATTEMPTS,
  } = await import("../src/lib/otpChallenge.ts");

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1: SENDER EMAIL EXTRACTION & FALLBACKS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("--- 1. Sender Email Resolution & Extraction ---");
  {
    assert(
      DEFAULT_BREVO_SENDER === "muhammad.syauqi1869@smk.belajar.id",
      "Default sender is muhammad.syauqi1869@smk.belajar.id"
    );

    assert(
      extractEmailAddress("user@zyba.app") === "user@zyba.app",
      "Extract plain email address"
    );

    assert(
      extractEmailAddress("ZYBA Wellness <support@zyba.app>") === "support@zyba.app",
      "Extract email address from formatted 'Name <email>' string"
    );

    const oldBrevoSender = process.env.BREVO_SENDER_EMAIL;
    const oldEmailFrom = process.env.EMAIL_FROM;

    delete process.env.BREVO_SENDER_EMAIL;
    delete process.env.EMAIL_FROM;
    assert(
      resolveSenderEmail() === "muhammad.syauqi1869@smk.belajar.id",
      "Falls back to default verified sender when env is unset"
    );

    process.env.BREVO_SENDER_EMAIL = "custom.sender@zyba.app";
    assert(
      resolveSenderEmail() === "custom.sender@zyba.app",
      "BREVO_SENDER_EMAIL takes precedence when provided"
    );

    delete process.env.BREVO_SENDER_EMAIL;
    process.env.EMAIL_FROM = "ZYBA App <fallback@zyba.app>";
    assert(
      resolveSenderEmail() === "fallback@zyba.app",
      "EMAIL_FROM fallback works with name bracket parsing"
    );

    // Restore env
    if (oldBrevoSender) process.env.BREVO_SENDER_EMAIL = oldBrevoSender;
    else delete process.env.BREVO_SENDER_EMAIL;
    if (oldEmailFrom) process.env.EMAIL_FROM = oldEmailFrom;
    else delete process.env.EMAIL_FROM;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 2: MISSING BREVO_API_KEY PRODUCES SAFE CONFIG ERROR
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 2. Missing BREVO_API_KEY Safety Handling ---");
  {
    const oldApiKey = process.env.BREVO_API_KEY;
    delete process.env.BREVO_API_KEY;

    startCapturingLogs();
    const result = await sendOTPEmail("test@example.com", "123456", "SIGNUP");
    stopCapturingLogs();

    assert(result.success === false, "Missing API key returns success: false");
    assert(result.delivered === false, "Missing API key returns delivered: false");
    assert(
      result.message.includes("belum dikonfigurasi"),
      "Returns safe user-facing configuration message"
    );

    // Restore
    if (oldApiKey) process.env.BREVO_API_KEY = oldApiKey;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3: INVALID RECIPIENT EMAIL VALIDATION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 3. Invalid Recipient Email Validation ---");
  {
    process.env.BREVO_API_KEY = "test-brevo-key";
    const result = await sendOTPEmail("invalid-email-format", "123456", "SIGNUP");
    assert(result.success === false, "Malformed recipient email returns success: false");
    assert(result.delivered === false, "Malformed recipient email returns delivered: false");
    assert(result.message.includes("tidak valid"), "Message indicates invalid email format");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 4: SUCCESSFUL BREVO HTTPS DISPATCH (201 / 200)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 4. Successful Brevo HTTPS API Delivery ---");
  {
    process.env.BREVO_API_KEY = "xkeysib-test-dummy-api-key-123456789";
    process.env.BREVO_SENDER_EMAIL = "muhammad.syauqi1869@smk.belajar.id";

    let capturedUrl = "";
    let capturedOptions = null;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
      capturedUrl = String(url);
      capturedOptions = options;
      return {
        ok: true,
        status: 201,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ messageId: "<202610111200.brevo.test@smtp-relay.brevo.com>" }),
        text: async () => JSON.stringify({ messageId: "<202610111200.brevo.test@smtp-relay.brevo.com>" }),
      };
    };

    const testOtp = "789123";
    const testRecipient = "Recipient.User@Domain.Com";
    const result = await sendOTPEmail(testRecipient, testOtp, "SIGNUP");

    assert(result.success === true, "Brevo success returns success: true");
    assert(result.delivered === true, "Brevo success returns delivered: true");
    assert(result.messageId?.includes("brevo.test"), "Returns messageId from Brevo response");

    // Verify request characteristics
    assert(capturedUrl === "https://api.brevo.com/v3/smtp/email", "Sent to official Brevo HTTPS endpoint");
    assert(capturedOptions.method === "POST", "HTTP method is POST");
    assert(capturedOptions.headers["accept"] === "application/json", "Header accept: application/json");
    assert(capturedOptions.headers["api-key"] === "xkeysib-test-dummy-api-key-123456789", "Header api-key is set");
    assert(capturedOptions.headers["content-type"] === "application/json", "Header content-type: application/json");

    const payload = JSON.parse(capturedOptions.body);
    assert(payload.sender.name === "ZYBA Wellness", "Sender name is ZYBA Wellness");
    assert(payload.sender.email === "muhammad.syauqi1869@smk.belajar.id", "Sender email is verified address");
    assert(payload.to[0].email === "recipient.user@domain.com", "Recipient email is normalized to lowercase");
    assert(payload.textContent.includes(testOtp), "Plain textContent includes OTP");
    assert(payload.htmlContent.includes(testOtp), "HTML htmlContent includes OTP");
    assert(payload.textContent.includes("10 menit"), "Plain textContent mentions 10-minute validity");

    globalThis.fetch = originalFetch;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 5: HTTP ERROR STATUS HANDLING (400, 401, 403, 429, 500)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 5. Brevo HTTP Error Responses (400, 401, 403, 429, 500) ---");
  {
    const originalFetch = globalThis.fetch;
    const testErrorCodes = [
      { status: 400, body: { code: "invalid_parameter", message: "unregistered sender" }, expectedWord: "Periksa kembali" },
      { status: 401, body: { code: "unauthorized", message: "Key not found" }, expectedWord: "administrator" },
      { status: 403, body: { code: "forbidden", message: "Account disabled" }, expectedWord: "administrator" },
      { status: 429, body: { code: "res_limit", message: "Too many calls" }, expectedWord: "sibuk" },
      { status: 500, body: { code: "server_error", message: "Internal error" }, expectedWord: "gangguan" },
    ];

    for (const testCase of testErrorCodes) {
      globalThis.fetch = async () => ({
        ok: false,
        status: testCase.status,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => testCase.body,
        text: async () => JSON.stringify(testCase.body),
      });

      const res = await sendOTPEmail("test@example.com", "654321", "RESET_PASSWORD");
      assert(res.success === false, `HTTP ${testCase.status} returns success: false`);
      assert(res.delivered === false, `HTTP ${testCase.status} returns delivered: false`);
      assert(
        res.message.includes(testCase.expectedWord),
        `HTTP ${testCase.status} produces user-safe message mentioning '${testCase.expectedWord}'`
      );
    }

    globalThis.fetch = originalFetch;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 6: TIMEOUT AND NETWORK ERROR HANDLING (NO FALSE SUCCESS)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 6. Timeout and Network Failures ---");
  {
    const originalFetch = globalThis.fetch;

    // Simulated network connection refused
    globalThis.fetch = async () => {
      const err = new TypeError("fetch failed: ECONNREFUSED");
      err.cause = { code: "ECONNREFUSED" };
      throw err;
    };

    const netErrRes = await sendOTPEmail("test@example.com", "112233", "SIGNUP");
    assert(netErrRes.success === false, "Network error returns success: false");
    assert(netErrRes.delivered === false, "Network error returns delivered: false");
    assert(netErrRes.message.includes("gagal"), "Network error message indicates failure");

    // Simulated timeout
    globalThis.fetch = async () => {
      const timeoutErr = new Error("The operation was aborted due to timeout");
      timeoutErr.name = "TimeoutError";
      throw timeoutErr;
    };

    const timeoutRes = await sendOTPEmail("test@example.com", "112233", "SIGNUP");
    assert(timeoutRes.success === false, "Timeout returns success: false");
    assert(timeoutRes.delivered === false, "Timeout returns delivered: false");
    assert(timeoutRes.message.includes("timeout"), "Timeout error message indicates timeout");

    globalThis.fetch = originalFetch;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 7: SENSITIVE DATA ISOLATION (NO API KEY OR OTP LEAK IN LOGS)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 7. Privacy & Log Audit (No API Key / OTP Leaks) ---");
  {
    const secretApiKey = "xkeysib-super-secret-unique-string-never-leak";
    const secretOtp = "987654";
    process.env.BREVO_API_KEY = secretApiKey;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      headers: new Headers(),
      text: async () => JSON.stringify({ code: "unauthorized", message: "Bad API Key" }),
      json: async () => ({ code: "unauthorized" }),
    });

    startCapturingLogs();
    await sendOTPEmail("target@zyba.app", secretOtp, "SIGNUP");
    stopCapturingLogs();

    const allLoggedText = capturedLogs.map((l) => l.text).join(" ");
    assert(!allLoggedText.includes(secretApiKey), "API key is NEVER printed in logs");
    assert(!allLoggedText.includes(secretOtp), "Raw OTP code is NEVER printed in error logs");

    globalThis.fetch = originalFetch;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 8: CRYPTOGRAPHIC OTP AND HMAC CHALLENGE FLOW
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 8. Cryptographic OTP & Challenge Verification ---");
  {
    const generatedOtp = generateOTP();
    assert(/^\d{6}$/.test(generatedOtp), `Generated OTP is exactly 6 digits (${generatedOtp})`);
    assert(Number(generatedOtp) >= 100000 && Number(generatedOtp) <= 999999, "OTP is within [100000, 999999]");

    const email = "auth.tester@zyba.app";
    const challenge = createOtpChallenge(email, generatedOtp, "SIGNUP");
    assert(Boolean(challenge.token), "Challenge token is issued");
    assert(challenge.maxAge === 600, "Challenge maxAge is 600s (10 minutes)");

    // Attempt with incorrect OTP
    const wrongAttempt = verifyOtpChallenge(challenge.token, email, "000000", "SIGNUP");
    assert(!wrongAttempt.valid && wrongAttempt.reason === "mismatch", "Incorrect OTP is rejected (mismatch)");

    // Attempt with wrong purpose
    const wrongPurposeAttempt = verifyOtpChallenge(challenge.token, email, generatedOtp, "RESET_PASSWORD");
    assert(!wrongPurposeAttempt.valid && wrongPurposeAttempt.reason === "wrong_purpose", "Cross-purpose verification is rejected");

    // Correct OTP
    const correctAttempt = verifyOtpChallenge(challenge.token, email, generatedOtp, "SIGNUP");
    assert(correctAttempt.valid === true, "Correct OTP is verified successfully");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 9: COOLDOWN & MAX ATTEMPTS ENFORCEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 9. Cooldown & Attempt Limit Enforcement ---");
  {
    const email = "cooldown.tester@zyba.app";
    const otp = generateOTP();
    const challenge = createOtpChallenge(email, otp, "RESET_PASSWORD");

    // Cooldown should now be active
    const cooldown = checkResendCooldown(email, "RESET_PASSWORD");
    assert(cooldown > 0 && cooldown <= 60, `Resend cooldown active (${cooldown}s remaining)`);

    // Exhaust attempts
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      verifyOtpChallenge(challenge.token, email, "999999", "RESET_PASSWORD");
    }

    const exhaustedAttempt = verifyOtpChallenge(challenge.token, email, otp, "RESET_PASSWORD");
    assert(
      !exhaustedAttempt.valid && exhaustedAttempt.reason === "too_many_attempts",
      `Challenge locked after ${MAX_ATTEMPTS} failed attempts`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 10: NO SMTP FALLBACK IN THE OTP PATH
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- 10. Verification: No SMTP Fallback ---");
  {
    const fs = await import("fs");
    const emailServiceSource = fs.readFileSync(
      new URL("../src/backend/auth/emailService.ts", import.meta.url),
      "utf8"
    );

    assert(
      !emailServiceSource.includes("nodemailer"),
      "emailService.ts contains NO nodemailer imports or usage"
    );
    assert(
      !emailServiceSource.includes("createTransport"),
      "emailService.ts contains NO SMTP createTransport"
    );
    assert(
      !emailServiceSource.includes("SMTP_HOST"),
      "emailService.ts does NOT fall back to SMTP_HOST"
    );
    assert(
      emailServiceSource.includes("https://api.brevo.com/v3/smtp/email"),
      "emailService.ts uses Brevo HTTPS API endpoint"
    );
  }

  console.log("\n==================================================================");
  console.log(`🏁 TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered an error:", err);
  process.exit(1);
});
