/**
 * Backend Email & OTP Service for ZYBA Authentication
 * Menggunakan Nodemailer untuk pengiriman email nyata via Gmail / SMTP / Resend.
 */

import nodemailer from "nodemailer";

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function generateOTP(email: string): string {
  // Generate 4-digit numeric code
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email.toLowerCase().trim(), { otp, expiresAt });
  console.log(`[Backend EmailService] OTP generated for ${email}: ${otp}`);

  return otp;
}

export function verifyOTP(email: string, inputOtp: string): { success: boolean; message: string } {
  // Mode demo fallback sesuai AGENTS.md Bagian 8.3: kode tetap "0000" atau "000000"
  if (inputOtp === "0000" || inputOtp === "000000") {
    return { success: true, message: "Verifikasi OTP berhasil (mode demo)." };
  }

  const normalized = email.toLowerCase().trim();
  const record = otpStore.get(normalized);

  if (!record) {
    return { success: false, message: "Kode OTP tidak ditemukan atau belum diminta. Silakan minta kode baru." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return { success: false, message: "Kode OTP telah kadaluarsa (berlaku 10 menit). Silakan minta kode baru." };
  }

  if (record.otp !== inputOtp) {
    return { success: false, message: "Kode OTP tidak cocok. Periksa kembali email Anda." };
  }

  otpStore.delete(normalized);
  return { success: true, message: "Verifikasi OTP berhasil." };
}

/**
 * Helper to build responsive HTML email template with ZYBA branding
 */
function buildOtpEmailHtml(otp: string, recipientEmail: string): string {
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
                Kode Verifikasi Pendaftaran
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #5A4636;">
                Halo! Terima kasih telah memulai perjalanan kesehatan mental & fisik Anda bersama ZYBA. Masukkan 4 digit kode verifikasi berikut untuk menyelesaikan setup akun Anda:
              </p>

              <!-- OTP Display Box -->
              <div style="margin: 28px auto; padding: 20px 24px; max-width: 260px; background-color: #FCE3D3; border: 2px dashed #F2884B; border-radius: 20px; text-align: center;">
                <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #F2884B; font-family: 'Courier New', monospace; display: block; margin-left: 12px;">
                  ${otp}
                </span>
              </div>

              <!-- Masa Berlaku -->
              <div style="display: inline-block; background-color: #F7F2E7; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #5A4636; margin-bottom: 20px;">
                ⏱️ Berlaku selama 10 menit
              </div>

              <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #8C7B70;">
                Email ini dikirimkan untuk <strong>${recipientEmail}</strong>. Jika Anda tidak merasa mendaftar di ZYBA, Anda dapat mengabaikan email ini dengan aman.
              </p>
            </td>
          </tr>

          <!-- Security Tip Footer -->
          <tr>
            <td style="background-color: #FDFBF8; border-top: 1px solid rgba(59, 42, 32, 0.06); padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #8C7B70; line-height: 1.4;">
                🛡️ <strong>Keamanan:</strong> Jangan pernah membagikan kode verifikasi ini kepada siapa pun. Tim ZYBA tidak pernah meminta kode OTP Anda.
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
 * Create Nodemailer Transporter based on environment variables
 */
function createTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass.replace(/\s+/g, ""), // Bersihkan spasi dari Google App Password
      },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return null;
}

/**
 * Mengirim email kode OTP ke pengguna
 */
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; delivered: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Coba kirim via Resend API jika RESEND_API_KEY tersedia
  if (process.env.RESEND_API_KEY) {
    try {
      console.log(`[Backend EmailService] Mengirim email OTP ke ${normalizedEmail} via Resend...`);
      const fromAddress = process.env.EMAIL_FROM || "ZYBA Wellness <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [normalizedEmail],
          subject: `${otp} adalah Kode Verifikasi ZYBA Anda`,
          html: buildOtpEmailHtml(otp, normalizedEmail),
        }),
      });

      if (res.ok) {
        console.log(`[Backend EmailService] ✅ Email OTP sukses terkirim via Resend ke ${normalizedEmail}`);
        return { success: true, delivered: true, message: "Email OTP berhasil dikirim ke kotak masuk Anda." };
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("[Backend EmailService] Resend API Error:", errorData);
      }
    } catch (err) {
      console.error("[Backend EmailService] Exception Resend:", err);
    }
  }

  // 2. Coba kirim via Nodemailer (Gmail / SMTP)
  const transporter = createTransporter();
  if (transporter) {
    try {
      console.log(`[Backend EmailService] Mengirim email OTP ke ${normalizedEmail} via Nodemailer/SMTP...`);
      const senderName = "ZYBA Wellness Support";
      const senderAddress = process.env.GMAIL_USER || process.env.SMTP_USER || "no-reply@zyba.app";

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderAddress}>`,
        to: normalizedEmail,
        subject: `${otp} adalah Kode Verifikasi ZYBA Anda`,
        text: `Kode verifikasi akun ZYBA Anda adalah: ${otp}. Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.`,
        html: buildOtpEmailHtml(otp, normalizedEmail),
      });

      console.log(`[Backend EmailService] ✅ Email OTP sukses terkirim ke ${normalizedEmail}. MessageId: ${info.messageId}`);
      return { success: true, delivered: true, message: "Email OTP berhasil dikirim ke kotak masuk Anda." };
    } catch (err: any) {
      console.error("[Backend EmailService] ❌ Gagal mengirim email via SMTP:", err?.message || err);
      // Fallback log
      console.log(`[Backend EmailService] ⚠️ Simpan kode OTP untuk pengujian: ${otp}`);
      return {
        success: true,
        delivered: false,
        message: `Gagal mengirim email secara otomatis (${err?.message || "Kredensial SMTP tidak valid"}). Mode pengujian aktif.`,
      };
    }
  }

  // 3. Fallback bila konfigurasi SMTP / Gmail belum diatur di .env
  console.log("=================================================");
  console.log("📧 [ZYBA AUTH BACKEND EMAIL SERVICE - MODE TESTING]");
  console.log(`Penerima : ${normalizedEmail}`);
  console.log(`Kode OTP : ${otp}`);
  console.log("-------------------------------------------------");
  console.log("💡 TIPS PENGIRIMAN NYATA:");
  console.log("Untuk mengirim email langsung ke inbox Gmail pengguna, tambahkan di file .env:");
  console.log("GMAIL_USER=\"email-anda@gmail.com\"");
  console.log("GMAIL_APP_PASSWORD=\"16-digit-app-password\"");
  console.log("=================================================");

  return {
    success: true,
    delivered: false,
    message: "Konfigurasi SMTP belum diatur di .env. Kode OTP dicatat di konsol server (atau gunakan 0000 untuk demo).",
  };
}
