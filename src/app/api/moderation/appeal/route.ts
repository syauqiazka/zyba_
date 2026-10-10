import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { userRepository } from "@/backend/auth/userRepository";
import { appealRepository } from "@/backend/community/appealRepository";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userRepository.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const appeal = await appealRepository.getLatestAppealForUser(user.id);
    const modStatus = await userRepository.getUserModerationStatus(user.id);

    return NextResponse.json({
      success: true,
      moderationStatus: modStatus,
      appeal,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil data banding." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { appealReason, contactEmail } = body;

    if (!appealReason || !String(appealReason).trim()) {
      return NextResponse.json(
        { error: "Alasan atau argumen penyangkalan banding wajib diisi." },
        { status: 400 }
      );
    }

    if (String(appealReason).trim().length < 10) {
      return NextResponse.json(
        { error: "Mohon jelaskan alasan banding Anda secara jelas (minimal 10 karakter)." },
        { status: 400 }
      );
    }

    const result = await appealRepository.createAppeal({
      userId: session.userId,
      appealReason: String(appealReason).trim(),
      contactEmail: contactEmail ? String(contactEmail).trim() : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error, appeal: result.appeal }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Permohonan banding Anda berhasil dikirim dan sedang menunggu peninjauan moderator.",
      appeal: result.appeal,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal mengirim permohonan banding." },
      { status: 500 }
    );
  }
}
