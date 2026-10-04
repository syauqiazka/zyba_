import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Bukti pembayaran wajib dipilih." }, { status: 400 });

    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(file.type)) return NextResponse.json({ error: "Bukti harus JPG, PNG, atau WebP." }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Ukuran bukti maksimal 5MB." }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const cleanName = `payment_${session.userId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, cleanName);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const url = `/uploads/${cleanName}`;
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("[Manual Payment Upload]", error);
    return NextResponse.json({ error: "Gagal mengunggah bukti pembayaran." }, { status: 500 });
  }
}
