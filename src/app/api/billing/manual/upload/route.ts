import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const uploadLimit = await checkRateLimit(`upload:${session.userId}`, 15, 60);
    if (!uploadLimit.allowed) {
      return rateLimitResponse(uploadLimit.retryAfterSec, "Terlalu banyak permintaan unggah bukti pembayaran.");
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Bukti pembayaran wajib dipilih." }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Ukuran bukti maksimal 5MB." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { validateImageBuffer, generateSafeFileName } = await import("@/lib/server/uploadSecurity");
    const validation = validateImageBuffer(buffer);
    if (!validation.valid || !validation.extension) {
      return NextResponse.json({ error: validation.error || "Bukti harus berupa gambar asli JPG, PNG, atau WebP." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const cleanName = generateSafeFileName("payment", session.userId, validation.extension);
    const filePath = path.join(uploadDir, cleanName);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${cleanName}`;
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("[Manual Payment Upload]", error);
    return NextResponse.json({ error: "Gagal mengunggah bukti pembayaran." }, { status: 500 });
  }
}
