/**
 * Backend Email & OTP Service for ZYBA Authentication
 * Menggunakan Brevo Transactional Email API via HTTPS (Port 443).
 * Endpoint: POST https://api.brevo.com/v3/smtp/email
 * Koneksi keluar SMTP (port 465/587) TIDAK digunakan.
 */

import { randomInt } from "crypto";

export const DEFAULT_BREVO_SENDER = "muhammad.syauqi1869@smk.belajar.id";

/**
 * Extracts a clean email address from strings like:
 * - "muhammad.syauqi1869@smk.belajar.id"
 * - "ZYBA Wellness <muhammad.syauqi1869@smk.belajar.id>"
 */
export function extractEmailAddress(raw: string): string {
  const match = raw.match(/<([^>]+)>/);
  return (match ? match[1] : raw).trim().toLowerCase();
}

/**
 * Resolves the sender email for Brevo transactional email.
 * Priority: BREVO_SENDER_EMAIL -> EMAIL_FROM -> DEFAULT_BREVO_SENDER
 */
export function resolveSenderEmail(): string {
  const raw =
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    DEFAULT_BREVO_SENDER;
  return extractEmailAddress(raw);
}

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
export function buildOtpEmailHtml(otp: string, recipientEmail: string, purposeLabel: string): string {
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

              <!-- OTP Display Box — 6 digit -->
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
 * Endpoint: POST https://api.brevo.com/v3/smtp/email
 * The OTP/challenge lifecycle remains in the existing auth routes.
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: OtpPurpose = "SIGNUP"
): Promise<{ success: boolean; delivered: boolean; message: string; messageId?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = resolveSenderEmail();

  if (!apiKey) {
    console.error("[EmailService] BREVO_API_KEY belum dikonfigurasi.");
    return {
      success: false,
      delivered: false,
      message: "Layanan email belum dikonfigurasi. Hubungi administrator.",
    };
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return {
      success: false,
      delivered: false,
      message: "Format alamat email penerima tidak valid.",
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
    `Kode verifikasi ZYBA Anda adalah: ${otp}.\n\n` +
    "Kode ini berlaku selama 10 menit.\n" +
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
        sender: {
          name: "ZYBA Wellness",
          email: senderEmail,
        },
        to: [
          {
            email: normalizedEmail,
          },
        ],
        subject,
        textContent,
        htmlContent: buildOtpEmailHtml(otp, normalizedEmail, purposeLabel),
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMessage = "";
      try {
        const parsed = JSON.parse(errorText);
        errorMessage = parsed?.message || parsed?.code || "";
      } catch {
        errorMessage = errorText.slice(0, 200);
      }

      console.error(
        `[EmailService] Brevo API rejected OTP email (HTTP ${response.status}): ${errorMessage}`
      );

      let clientMessage = "Email verifikasi belum berhasil dikirim. Silakan coba lagi beberapa saat.";
      if (response.status === 401 || response.status === 403) {
        clientMessage = "Konfigurasi layanan email tidak valid. Hubungi administrator.";
      } else if (response.status === 429) {
        clientMessage = "Layanan pengiriman email sedang sibuk. Silakan coba lagi beberapa saat.";
      } else if (response.status === 400) {
        clientMessage = "Gagal memproses pengiriman email verifikasi. Periksa kembali alamat email Anda.";
      } else if (response.status >= 500) {
        clientMessage = "Layanan email sedang mengalami gangguan. Silakan coba lagi beberapa saat.";
      }

      return {
        success: false,
        delivered: false,
        message: clientMessage,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { messageId?: string };
    const messageId = data?.messageId;

    console.log(
      `[EmailService] OTP email accepted by Brevo (purpose=${purpose}, status=${response.status}${
        messageId ? `, messageId=${messageId}` : ""
      }).`
    );

    return {
      success: true,
      delivered: true,
      message: "Email kode verifikasi berhasil dikirimkan ke kotak masuk Anda.",
      messageId,
    };
  } catch (err: unknown) {
    const isTimeout =
      (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) ||
      String(err).includes("timeout");
    const errName = err instanceof Error ? err.name : "UnknownError";

    console.error(`[EmailService] Brevo API request failed (purpose=${purpose}, error=${errName}).`);

    return {
      success: false,
      delivered: false,
      message: isTimeout
        ? "Koneksi ke layanan email timeout. Silakan coba lagi beberapa saat."
        : "Koneksi ke layanan email gagal. Silakan coba lagi beberapa saat.",
    };
  }
}

