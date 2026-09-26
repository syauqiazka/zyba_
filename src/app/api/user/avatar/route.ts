import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import fs from "fs/promises";
import path from "path";

// Cooldown 3 hari untuk ganti foto profil
const COOLDOWN_DAYS = 3;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

function formatRemainingTime(ms: number): string {
  const totalMinutes = Math.max(1, Math.ceil(ms / (1000 * 60)));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) {
    return `${days} hari ${hours} jam`;
  }
  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  }
  return `${minutes} menit`;
}

async function getUserLastAvatarChange(userId: string): Promise<Date | null> {
  try {
    const u = await accountDb.user.findUnique({
      where: { id: userId },
      select: { lastAvatarChangeAt: true },
    });
    if (u?.lastAvatarChangeAt) return new Date(u.lastAvatarChangeAt);
  } catch {}

  try {
    const { userRepository } = await import("@/backend/auth/userRepository");
    const local = await userRepository.findById(userId);
    if (local?.lastAvatarChangeAt) return new Date(local.lastAvatarChangeAt);
  } catch {}

  return null;
}

/**
 * GET /api/user/avatar
 * Returns cooldown status for profile picture change
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const lastChange = await getUserLastAvatarChange(session.userId);

    let canChange = true;
    let remainingMs = 0;

    if (lastChange) {
      const elapsed = Date.now() - lastChange.getTime();
      if (elapsed < COOLDOWN_MS) {
        canChange = false;
        remainingMs = COOLDOWN_MS - elapsed;
      }
    }

    return NextResponse.json({
      canChange,
      remainingMs,
      remainingText: remainingMs > 0 ? formatRemainingTime(remainingMs) : null,
      cooldownDays: COOLDOWN_DAYS,
      lastAvatarChangeAt: lastChange ? lastChange.toISOString() : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/user/avatar
 * Uploads cropped/selected avatar and enforces 3-day cooldown
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    // Cek cooldown 3 hari
    const lastChange = await getUserLastAvatarChange(session.userId);
    if (lastChange) {
      const elapsed = Date.now() - lastChange.getTime();
      if (elapsed < COOLDOWN_MS) {
        const remainingMs = COOLDOWN_MS - elapsed;
        return NextResponse.json(
          {
            error: `Foto profil sedang cooldown. Kamu baru bisa mengganti foto profil lagi dalam ${formatRemainingTime(
              remainingMs
            )}.`,
            remainingMs,
            cooldownDays: COOLDOWN_DAYS,
          },
          { status: 429 }
        );
      }
    }

    const contentType = req.headers.get("content-type") || "";

    // Support JSON body for setting preset emoji or external avatar URL
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const newAvatar = body.avatarUrl;
      if (!newAvatar) {
        return NextResponse.json({ error: "avatarUrl wajib diisi." }, { status: 400 });
      }

      const now = new Date();
      try {
        await accountDb.user.update({
          where: { id: session.userId },
          data: { avatarUrl: newAvatar, lastAvatarChangeAt: now },
        });
      } catch {
        await accountDb.user.update({
          where: { id: session.userId },
          data: { avatarUrl: newAvatar },
        });
      }

      const { userRepository } = await import("@/backend/auth/userRepository");
      await userRepository.update(session.userId, {
        avatarUrl: newAvatar,
        lastAvatarChangeAt: now.toISOString(),
      });

      return NextResponse.json({
        success: true,
        avatarUrl: newAvatar,
        lastAvatarChangeAt: now.toISOString(),
      });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "File wajib dikirim." }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Hanya file gambar yang diizinkan." }, { status: 400 });
    }

    // Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran foto maksimal 8MB." }, { status: 400 });
    }

    let avatarUrl: string | null = null;

    // ── Primary: Self-Hosted Filesystem Storage in public/uploads/avatars ──
    try {
      const avatarsDir = path.join(process.cwd(), "public", "uploads", "avatars");
      const rootAvatarsDir = path.join(process.cwd(), "uploads", "avatars");
      await fs.mkdir(avatarsDir, { recursive: true });
      await fs.mkdir(rootAvatarsDir, { recursive: true }).catch(() => {});

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const filename = `avatar_${session.userId}_${Date.now()}.${ext}`;
      const filePath = path.join(avatarsDir, filename);
      const rootFilePath = path.join(rootAvatarsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      await fs.writeFile(rootFilePath, buffer).catch(() => {});

      avatarUrl = `/uploads/avatars/${filename}`;
    } catch (fsErr) {
      console.warn("[Avatar FS storage failed, attempting fallback]:", fsErr);

      // Optional fallback: Vercel Blob if token exists
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (blobToken) {
        try {
          const ext = file.name.split(".").pop() || "jpg";
          const filename = `avatars/${session.userId}-${Date.now()}.${ext}`;
          const blobRes = await fetch(`https://blob.vercel-storage.com/${filename}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + blobToken,
              "Content-Type": file.type,
              "x-content-type": file.type,
            },
            body: await file.arrayBuffer(),
          });

          if (blobRes.ok) {
            const blobData = await blobRes.json();
            avatarUrl = blobData.url;
          }
        } catch (blobErr) {
          console.warn("[Avatar Blob fallback failed]:", blobErr);
        }
      }

      // Ultimate fallback: Base64 data URL
      if (!avatarUrl) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        avatarUrl = `data:${file.type};base64,${base64}`;
      }
    }

    // Save URL and lastAvatarChangeAt to DB
    const now = new Date();
    try {
      await accountDb.user.update({
        where: { id: session.userId },
        data: { avatarUrl, lastAvatarChangeAt: now },
      });
    } catch {
      await accountDb.user.update({
        where: { id: session.userId },
        data: { avatarUrl },
      });
    }

    const { userRepository } = await import("@/backend/auth/userRepository");
    await userRepository.update(session.userId, {
      avatarUrl,
      lastAvatarChangeAt: now.toISOString(),
    });

    return NextResponse.json({
      success: true,
      avatarUrl,
      lastAvatarChangeAt: now.toISOString(),
    });
  } catch (err: any) {
    console.error("[Avatar Upload Error]:", err);
    return NextResponse.json({ error: err.message || "Upload error" }, { status: 500 });
  }
}
