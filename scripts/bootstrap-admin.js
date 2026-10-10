#!/usr/bin/env node
/**
 * scripts/bootstrap-admin.js
 * 
 * Idempotent Admin Account Bootstrap Script for ZYBA.
 * 
 * Keamanan:
 * - Tidak ada password atau secret yang di-hardcode ke source code.
 * - Password di-hash menggunakan bcrypt (cost 12).
 * - Idempotent: jika akun admin sudah ada, script hanya memperbarui role menjadi ADMIN
 *   dan password jika diminta, tanpa membuat entri duplikat.
 * 
 * Penggunaan:
 *   ADMIN_EMAIL="admin@zyba.app" ADMIN_PASSWORD="PasswordKuat123!" node scripts/bootstrap-admin.js
 *   atau:
 *   node scripts/bootstrap-admin.js --email admin@zyba.app --password "PasswordKuat123!"
 */

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Parse args
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const email = (process.env.ADMIN_EMAIL || getArg("--email") || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || getArg("--password") || "";
const name = process.env.ADMIN_NAME || getArg("--name") || "Administrator ZYBA";

if (!email || !password) {
  console.error("=================================================================");
  console.error("❌ KESALAHAN: Kredensial bootstrap admin belum disediakan.");
  console.error("=================================================================");
  console.error("Demi keamanan data, ZYBA tidak menggunakan password default.");
  console.error("Jalankan script dengan environment variable atau parameter argumen:");
  console.error("");
  console.error("  ADMIN_EMAIL=\"admin@zyba.app\" ADMIN_PASSWORD=\"PasswordKuat123!\" node scripts/bootstrap-admin.js");
  console.error("  atau:");
  console.error("  node scripts/bootstrap-admin.js --email admin@zyba.app --password \"PasswordKuat123!\"");
  console.error("=================================================================");
  process.exit(1);
}

if (password.length < 8) {
  console.error("❌ Password admin minimal harus 8 karakter untuk keamanan.");
  process.exit(1);
}

async function bootstrap() {
  console.log(`==> [1/3] Menyiapkan bootstrap admin untuk: ${email}`);

  let AccountClient = null;
  let accountDb = null;
  try {
    const generated = require("../src/generated/account-client");
    AccountClient = generated.PrismaClient;
    accountDb = new AccountClient();
  } catch (err) {
    console.warn("⚠️ Prisma client tidak dapat dihubungkan langsung, fallback ke file lokal.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let dbSuccess = false;

  // 1. Database PostgreSQL
  if (accountDb) {
    try {
      const existing = await accountDb.user.findUnique({ where: { email } });
      if (existing) {
        await accountDb.user.update({
          where: { id: existing.id },
          data: {
            role: "ADMIN",
            passwordHash,
            name: existing.name || name,
            plan: "PLUS",
            isBanned: false,
            isSuspended: false,
          },
        });
        console.log(`✔ [DB] Akun yang sudah ada diperbarui menjadi ADMIN: ID ${existing.id}`);
      } else {
        const created = await accountDb.user.create({
          data: {
            email,
            passwordHash,
            name,
            role: "ADMIN",
            plan: "PLUS",
            onboardingCompleted: true,
            avatarUrl: "owl",
            zybaScore: 90,
            stressLevel: 1,
          },
        });
        console.log(`✔ [DB] Akun admin baru berhasil dibuat: ID ${created.id}`);
      }
      dbSuccess = true;
    } catch (dbErr) {
      console.warn("⚠️ [DB] Operasi database gagal atau database offline:", dbErr.message);
    } finally {
      await accountDb.$disconnect().catch(() => {});
    }
  }

  // 2. Fallback data/users.json
  const DATA_DIR = path.join(__dirname, "..", "data");
  const USERS_FILE = path.join(DATA_DIR, "users.json");
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let localUsers = [];
    if (fs.existsSync(USERS_FILE)) {
      try {
        localUsers = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
      } catch {}
    }

    const idx = localUsers.findIndex((u) => u.email.toLowerCase() === email);
    const nowIso = new Date().toISOString();

    if (idx !== -1) {
      localUsers[idx].role = "ADMIN";
      localUsers[idx].passwordHash = passwordHash;
      localUsers[idx].plan = "PLUS";
      localUsers[idx].isBanned = false;
      localUsers[idx].isSuspended = false;
      localUsers[idx].updatedAt = nowIso;
      console.log(`✔ [Local Fallback] Akun lokal diperbarui menjadi ADMIN.`);
    } else {
      localUsers.push({
        id: "admin_" + Date.now().toString(36),
        email,
        passwordHash,
        name,
        avatarUrl: "owl",
        role: "ADMIN",
        plan: "PLUS",
        onboardingCompleted: true,
        zybaScore: 90,
        stressLevel: 1,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      console.log(`✔ [Local Fallback] Akun admin baru ditambahkan ke data/users.json.`);
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2), "utf8");
  } catch (fsErr) {
    console.warn("⚠️ Gagal memperbarui fallback lokal:", fsErr.message);
  }

  console.log("=================================================================");
  console.log("🎉 Bootstrap admin selesai!");
  console.log(`Email : ${email}`);
  console.log(`Role  : ADMIN`);
  console.log(`Status: Aktif & Terverifikasi`);
  console.log("=================================================================");
}

bootstrap().catch((e) => {
  console.error("❌ Fatal error saat bootstrap admin:", e);
  process.exit(1);
});
