import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "File wajib dikirim." }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Hanya file gambar yang diizinkan." }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran foto maksimal 5MB." }, { status: 400 });
    }

    let avatarUrl: string;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      // Upload ke Vercel Blob via REST API
      const filename = `avatars/${session.userId}-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
      const blobRes = await fetch(`https://blob.vercel-storage.com/${filename}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + blobToken,
          "Content-Type": file.type,
          "x-content-type": file.type,
        },
        body: await file.arrayBuffer(),
      });

      if (!blobRes.ok) {
        const errText = await blobRes.text();
        console.error("[Avatar Upload] Blob error:", errText);
        return NextResponse.json({ error: "Gagal upload foto." }, { status: 500 });
      }

      const blobData = await blobRes.json();
      avatarUrl = blobData.url;
    } else {
      // Dev fallback: convert to base64 data URL
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      avatarUrl = `data:${file.type};base64,${base64}`;
    }

    // Save URL to DB
    await accountDb.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

    // Update localStorage cache hint (URL only — client handles the rest)
    return NextResponse.json({ success: true, avatarUrl });
  } catch (err: any) {
    console.error("[Avatar Upload Error]:", err);
    return NextResponse.json({ error: err.message || "Upload error" }, { status: 500 });
  }
}
