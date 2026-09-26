import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// File upload endpoint for community posts, attachments, and photos.
// If BLOB_READ_WRITE_TOKEN is provided, uploads to Vercel Blob storage.
// Otherwise, saves directly to public/uploads/ for instant local development and self-hosting.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File wajib dikirim." }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Hanya file gambar (JPEG, PNG, WEBP, GIF) yang diperbolehkan." }, { status: 400 });
    }

    // Maximum file size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran gambar maksimal 10MB." }, { status: 400 });
    }

    // ── Self-Hosted Filesystem Storage (public/uploads/ & uploads/) ──
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const rootUploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.mkdir(rootUploadDir, { recursive: true }).catch(() => {});

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanName = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = path.join(uploadDir, cleanName);
      const rootFilePath = path.join(rootUploadDir, cleanName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      await fs.writeFile(rootFilePath, buffer).catch(() => {});

      const url = `/uploads/${cleanName}`;
      return NextResponse.json({ success: true, url, pathname: url });
    } catch (fsErr) {
      console.warn("[Upload FS failed, attempting Vercel Blob fallback]:", fsErr);

      // Optional fallback: Vercel Blob if token exists
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) {
        try {
          const filename = `zyba/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
          const res = await fetch(`https://blob.vercel-storage.com/${filename}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": file.type || "application/octet-stream",
              "x-content-type": file.type || "application/octet-stream",
            },
            body: await file.arrayBuffer(),
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
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl, pathname: dataUrl });
    }
  } catch (err: any) {
    console.error("[Upload Error]:", err);
    return NextResponse.json({ error: err.message || "Gagal memproses upload file" }, { status: 500 });
  }
}

