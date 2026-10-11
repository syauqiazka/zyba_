/**
 * Backend Email & OTP Service for ZYBA Authentication
 * Menggunakan Nodemailer SMTP sebagai satu-satunya metode pengiriman email OTP.
 * Resend API TIDAK digunakan — hanya SMTP.
 */

import nodemailer from "nodemailer";
import { randomInt } from "crypto";

/**
 * Generate a cryptographically secure 6-digit OTP.
 * Uses Node.js crypto.randomInt — NOT Math.random().
 */
export function generateOTP(_email?: string): string {
  // randomInt(min, max) produces a value in [min, max)
  // So randomInt(100000, 1000000) gives exactly 6 digits: 100000 – 999999
  return randomInt(100000, 1000000).toString();
}

/**
 * @deprecated Use the new generateOTP() (no email param).
 * Kept for backward-compat with old callers that pass an unused email arg.
 */
export function generateOTPCompat(_email: string): string {
  return generateOTP();
}

/**
 * @deprecated OTP verification must be done via challenge session.
 */
export function verifyOTP(
  _email: string,
  _inputOtp: string
): { success: boolean; message: string } {
  return {
    success: false,
    message: "Verifikasi OTP harus dilakukan melalui challenge sesi.",
  };
}

/**
 * Helper to build responsive HTML email template with ZYBA branding
 */
function buildOtpEmailHtml(otp: string, recipientEmail: string, purposeLabel: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode Verifikasi ZYBA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F2E7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3B2A20;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F2E7; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 10px 25px rgba(59, 42, 32, 0.08); border: 1px solid rgba(59, 42, 32, 0.08);">
          
          <!-- Header Brand -->
          <tr>
            <td style="background-color: #E4EED2; padding: 36px 30px 28px; text-align: center;">
              <div style="display: inline-block; width: 46px; height: 46px; line-height: 46px; background-color: #F2884B; border-radius: 50%; color: #FFFFFF; font-size: 24px; font-weight: bold; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(242, 136, 75, 0.3);">
                ✦
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #3B2A20; letter-spacing: 1px;">ZYBA</h1>
              <p style="margin: 4px 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #5A4636;">
                Gen Z Wellness Support
              </p>
            </td>
          </tr>

          <!-- Konten Utama -->
          <tr>
            <td style="padding: 36px 32px 28px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #3B2A20;">
                ${purposeLabel}
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #5A4636;">
                Halo! Masukkan 6 digit kode verifikasi berikut untuk melanjutkan:
              </p>

              <!-- OTP Display Box — 6 digit, NO literal OTP in comments -->
              <div style="margin: 28px auto; padding: 20px 24px; max-width: 280px; background-color: #FCE3D3; border: 2px dashed #F2884B; border-radius: 20px; text-align: center;">
                <span style="font-size: 38px; font-weight: 900; letter-spacing: 14px; color: #F2884B; font-family: 'Courier New', monospace; display: block; margin-left: 14px;">
                  ${otp}
                </span>
              </div>

              <!-- Masa Berlaku -->
              <div style="display: inline-block; background-color: #F7F2E7; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #5A4636; margin-bottom: 20px;">
                ⏱️ Berlaku selama 10 menit
              </div>

              <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #8C7B70;">
                Email ini dikirimkan untuk <strong>${recipientEmail}</strong>. Jika Anda tidak merasa melakukan ini di ZYBA, Anda dapat mengabaikan email ini dengan aman.
              </p>
            </td>
          </tr>

          <!-- Security Tip Footer -->
          <tr>
            <td style="background-color: #FDFBF8; border-top: 1px solid rgba(59, 42, 32, 0.06); padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #8C7B70; line-height: 1.4;">
                🛡️ <strong>Keamanan:</strong> Jangan pernah membagikan kode verifikasi ini kepada siapa pun, termasuk tim ZYBA. Tim ZYBA tidak pernah meminta kode OTP Anda.
              </p>
            </td>
          </tr>

        </table>

        <!-- Copyright -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; font-size: 11px; color: #8C7B70;">
              © ${new Date().getFullYear()} ZYBA Indonesia. All rights reserved.<br/>
              Ruang aman untuk curhat, solusi, dan aksi nyata Gen Z.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Create Nodemailer Transporter based on environment variables.
 * Priority: SMTP_HOST/PORT/USER/PASS → GMAIL_USER/GMAIL_APP_PASSWORD.
 * Resend API is NOT used.
 */
function createSmtpTransporter() {
  // Check for generic SMTP config first (recommended)
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost.trim(),
      port: smtpPort,
      secure: smtpSecure, // true for port 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: smtpUser.trim(),
        // Bersihkan spasi dari App Password (mis. Google App Password format 4x4)
        pass: smtpPass.trim().replace(/\s+/g, ""),
      },
      connectionTimeout: 10000, // 10 detik batas koneksi awal
      greetingTimeout: 10000,   // 10 detik batas greeting SMTP
      socketTimeout: 15000,     // 15 detik batas soket
      // For STARTTLS (port 587): requireTLS ensures upgrade from plain to TLS
      ...(smtpSecure ? {} : { requireTLS: smtpPort === 587 }),
    });
  }

  // Fallback: Gmail shorthand using GMAIL_USER / GMAIL_APP_PASSWORD
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser.trim(),
        // Remove all spaces from Google App Password (groups of 4 chars separated by spaces)
        pass: gmailPass.trim().replace(/\s+/g, ""),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return null;
}

/**
 * Resolve the "from" address for outgoing emails.
 */
function resolveFromAddress(): string {
  if (process.env.EMAIL_FROM) {
    return process.env.EMAIL_FROM;
  }
  // Build from SMTP_USER or GMAIL_USER
  const senderAddr =
    process.env.SMTP_USER ||
    process.env.GMAIL_USER ||
    "no-reply@zyba.app";
  return `"ZYBA Wellness" <${senderAddr}>`;
}

export type OtpPurpose = "SIGNUP" | "RESET_PASSWORD";

/**
 * Mengirim email kode OTP ke pengguna menggunakan SMTP.
 *
 * @param email  - Alamat email tujuan (akan dinormalisasi lowercase).
 * @param otp    - Kode OTP 6 digit yang sudah di-generate.
 * @param purpose - Tujuan OTP: "SIGNUP" | "RESET_PASSWORD".
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: OtpPurpose = "SIGNUP"
): Promise<{ success: boolean; delivered: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const purposeLabel =
    purpose === "RESET_PASSWORD"
      ? "Kode Verifikasi Reset Password"
      : "Kode Verifikasi Pendaftaran";

  const subjectPrefix =
    purpose === "RESET_PASSWORD"
      ? "Reset Password ZYBA"
      : "Kode Verifikasi ZYBA";

  const transporter = createSmtpTransporter();

  if (!transporter) {
    console.error(
      "[EmailService] SMTP tidak dikonfigurasi. Set SMTP_HOST, SMTP_USER, SMTP_PASS " +
      "atau GMAIL_USER, GMAIL_APP_PASSWORD di environment variables."
    );
    return {
      success: false,
      delivered: false,
      message:
        "Layanan email belum dikonfigurasi. Hubungi administrator untuk mengaktifkan pengiriman email.",
    };
  }

  try {
    const startMs = Date.now();
    const domain = normalizedEmail.includes("@") ? normalizedEmail.split("@")[1] : "unknown";
    // Log diagnostik aman (tanpa kode OTP dan tanpa kredensial)
    console.log(
      `[EmailService] Mengirim email OTP (${purpose}) ke domain @${domain} via SMTP...`
    );

    const info = await transporter.sendMail({
      from: resolveFromAddress(),
      to: normalizedEmail,
      subject: `[${subjectPrefix}] Kode 6 digit Anda`,
      text:
        `Kode verifikasi ZYBA Anda adalah: ${otp}. ` +
        `Kode ini berlaku selama 10 menit. ` +
        `Jangan bagikan kode ini kepada siapa pun, termasuk tim ZYBA.`,
      html: buildOtpEmailHtml(otp, normalizedEmail, purposeLabel),
    });

    const durationMs = Date.now() - startMs;
    // Log MessageId (metadata aman, bukan OTP)
    console.log(
      `[EmailService] ✅ Email OTP (${purpose}) terkirim ke domain @${domain} (${durationMs}ms). MessageId: ${info.messageId}`
    );

    return {
      success: true,
      delivered: true,
      message: "Email kode verifikasi berhasil dikirimkan ke kotak masuk Anda.",
    };
  } catch (err: unknown) {
    // Log pesan error TANPA menyertakan credentials (err.message sudah cukup)
    const errMsg = err instanceof Error ? err.message : String(err);
    const domain = normalizedEmail.includes("@") ? normalizedEmail.split("@")[1] : "unknown";
    console.error(
      `[EmailService] ❌ Gagal mengirim email OTP (${purpose}) ke domain @${domain}: ${errMsg}`
    );

    let clientMsg = "Gagal mengirim email verifikasi. Periksa alamat email Anda dan coba lagi dalam beberapa menit.";
    if (errMsg.includes("EAUTH") || errMsg.includes("Invalid login") || errMsg.includes("Username and Password not accepted")) {
      clientMsg = "Autentikasi akun email server gagal. Hubungi administrator sistem.";
    } else if (errMsg.includes("ETIMEDOUT") || errMsg.includes("ESOCKETTIMEDOUT") || errMsg.includes("ECONNREFUSED")) {
      clientMsg = "Koneksi ke server email timeout. Silakan periksa jaringan dan coba lagi.";
    }

    return {
      success: false,
      delivered: false,
      message: clientMsg,
    };
  }
}
