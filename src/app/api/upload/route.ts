import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken } from "@/lib/auth";
import { validateImageBuffer, generateSafeFileName } from "@/lib/server/uploadSecurity";

// File upload endpoint for community posts, attachments, and photos.
// Enforces:
// 1. Authentication (session token required)
// 2. Magic bytes / file signature validation (JPEG, PNG, WebP only)
// 3. Strict 5MB file size limit
// 4. Safe random filename without user-controlled paths or extensions
export async function POST(req: NextRequest) {
  try {
    // 1. Autentikasi sesi
    const token =
      req.cookies.get("auth-token")?.value ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json(
        { error: "Sesi login diperlukan untuk mengunggah file." },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Sesi tidak valid atau telah berakhir." },
        { status: 401 }
      );
    }

    const { checkRateLimit, rateLimitResponse } = await import("@/lib/server/rateLimit");
    const uploadLimit = await checkRateLimit(`upload:${session.userId}`, 20, 60);
    if (!uploadLimit.allowed) {
      return rateLimitResponse(uploadLimit.retryAfterSec, "Terlalu banyak unggahan file. Silakan tunggu.");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File wajib dikirim." }, { status: 400 });
    }

    // 2. Validasi ukuran file (Maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar melebihi batas maksimal 5MB." },
        { status: 400 }
      );
    }

    // 3. Baca buffer dan validasi signature / magic bytes sebenarnya
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateImageBuffer(buffer);
    if (!validation.valid || !validation.extension || !validation.mime) {
      return NextResponse.json(
        { error: validation.error || "File harus berupa gambar asli (JPEG, PNG, atau WebP)." },
        { status: 400 }
      );
    }

    // 4. Buat nama file yang aman (tidak mempercayai input path/nama client)
    const cleanName = generateSafeFileName("post", session.userId, validation.extension);

    // ── Self-Hosted Filesystem Storage (public/uploads/ & uploads/) ──
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const rootUploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.mkdir(rootUploadDir, { recursive: true }).catch(() => {});

      const filePath = path.join(uploadDir, cleanName);
      const rootFilePath = path.join(rootUploadDir, cleanName);

      await fs.writeFile(filePath, buffer);
      await fs.writeFile(rootFilePath, buffer).catch(() => {});

      const url = `/uploads/${cleanName}`;
      return NextResponse.json({ success: true, url, pathname: url });
    } catch (fsErr) {
      console.warn("[Upload FS failed, attempting Vercel Blob fallback]:", fsErr);

      // Optional fallback: Vercel Blob if token exists
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (blobToken) {
        try {
          const filename = `zyba/${cleanName}`;
          const res = await fetch(`https://blob.vercel-storage.com/${filename}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + blobToken,
              "Content-Type": validation.mime,
              "x-content-type": validation.mime,
            },
            body: buffer,
          });

          if (res.ok) {
            const data = await res.json();
            return NextResponse.json({ success: true, url: data.url, pathname: data.pathname });
          }
        } catch (blobErr) {
          console.warn("[Upload Blob fallback failed]:", blobErr);
        }
      }

      // Ultimate fallback: Base64 data URL
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${validation.mime};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl, pathname: dataUrl });
    }
  } catch (err: any) {
    console.error("[Upload Error]:", err);
    return NextResponse.json(
      { error: "Gagal memproses upload file." },
      { status: 500 }
    );
  }
}
