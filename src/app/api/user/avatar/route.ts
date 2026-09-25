import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";

    // Support JSON body for setting preset emoji or external avatar URL
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const newAvatar = body.avatarUrl;
      if (!newAvatar) {
        return NextResponse.json({ error: "avatarUrl wajib diisi." }, { status: 400 });
      }

      await accountDb.user.update({
        where: { id: session.userId },
        data: { avatarUrl: newAvatar },
      });

      return NextResponse.json({ success: true, avatarUrl: newAvatar });
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
        console.warn("[Avatar Blob Upload Error]:", blobErr);
      }
    }

    // Local filesystem storage fallback in public/uploads/avatars
    if (!avatarUrl) {
      try {
        const avatarsDir = path.join(process.cwd(), "public", "uploads", "avatars");
        await fs.mkdir(avatarsDir, { recursive: true });

        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        const filename = `avatar_${session.userId}_${Date.now()}.${ext}`;
        const filePath = path.join(avatarsDir, filename);

        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        avatarUrl = `/uploads/avatars/${filename}`;
      } catch (fsErr) {
        console.warn("[Avatar FS fallback]:", fsErr);
        // Base64 fallback
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        avatarUrl = `data:${file.type};base64,${base64}`;
      }
    }

    // Save URL to DB
    await accountDb.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

    return NextResponse.json({ success: true, avatarUrl });
  } catch (err: any) {
    console.error("[Avatar Upload Error]:", err);
    return NextResponse.json({ error: err.message || "Upload error" }, { status: 500 });
  }
}

