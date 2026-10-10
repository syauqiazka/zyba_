import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/backend/billing/admin";
import { appealRepository } from "@/backend/community/appealRepository";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Akses ditolak. Memerlukan role Administrator." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));

    const result = await appealRepository.getAppeals({
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("[Admin Appeals GET] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil daftar permohonan banding." },
      { status: 500 }
    );
  }
}
