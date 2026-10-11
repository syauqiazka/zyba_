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

export type OtpPurpose = "SIGNUP" | "RESET_PASSWORD";

/**
 * Send OTP email using Brevo's HTTPS transactional email API.
 * The OTP/challenge lifecycle remains in the existing auth routes.
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: OtpPurpose = "SIGNUP"
): Promise<{ success: boolean; delivered: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_SENDER_EMAIL?.trim() || process.env.EMAIL_FROM?.trim();

  if (!apiKey || !fromEmail) {
    console.error("[EmailService] BREVO_API_KEY atau BREVO_SENDER_EMAIL belum dikonfigurasi.");
    return {
      success: false,
      delivered: false,
      message: "Layanan email belum dikonfigurasi. Hubungi administrator.",
    };
  }

  const purposeLabel =
    purpose === "RESET_PASSWORD"
      ? "Kode Verifikasi Reset Password"
      : "Kode Verifikasi Pendaftaran";
  const subjectPrefix =
    purpose === "RESET_PASSWORD"
      ? "Reset Password ZYBA"
      : "Kode Verifikasi ZYBA";

  const subject = `[${subjectPrefix}] Kode 6 digit Anda`;
  const textContent =
    `Kode verifikasi ZYBA Anda adalah: ${otp}. ` +
    "Kode ini berlaku selama 10 menit. " +
    "Jangan bagikan kode ini kepada siapa pun, termasuk tim ZYBA.";

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "ZYBA Wellness", email: fromEmail },
        to: [{ email: normalizedEmail }],
        subject,
        textContent,
        htmlContent: buildOtpEmailHtml(otp, normalizedEmail, purposeLabel),
      }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });

    if (!response.ok) {
      // Do not log API keys, recipient addresses, or OTPs.
      const errorText = await response.text().catch(() => "");
      console.error(
        `[EmailService] Brevo API rejected OTP email (HTTP ${response.status}). ` +
        `Response: ${errorText.slice(0, 500)}`
      );
      return {
        success: false,
        delivered: false,
        message:
          response.status === 401 || response.status === 403
            ? "Konfigurasi layanan email tidak valid. Hubungi administrator."
            : "Email verifikasi belum berhasil dikirim. Silakan coba lagi beberapa saat.",
      };
    }

    console.log(`[EmailService] OTP email accepted by Brevo (purpose=${purpose}, status=${response.status}).`);
    return {
      success: true,
      delivered: true,
      message: "Email kode verifikasi berhasil dikirimkan ke kotak masuk Anda.",
    };
  } catch (err: unknown) {
    const errName = err instanceof Error ? err.name : "UnknownError";
    console.error(`[EmailService] Brevo API request failed (purpose=${purpose}, error=${errName}).`);
    return {
      success: false,
      delivered: false,
      message: "Koneksi ke layanan email gagal. Silakan coba lagi beberapa saat.",
    };
  }
}
