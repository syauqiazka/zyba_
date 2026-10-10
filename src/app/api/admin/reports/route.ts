import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/backend/billing/admin";
import { reportRepository } from "@/backend/community/reportRepository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Akses ditolak. Memerlukan role Administrator." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 15;
    const status = searchParams.get("status") || "ALL";
    const targetType = searchParams.get("targetType") || "ALL";
    const reason = searchParams.get("reason") || "ALL";
    const search = searchParams.get("search") || "";

    const data = await reportRepository.getReports({
      page,
      limit,
      status,
      targetType,
      reason,
      search,
    });

    return NextResponse.json({
      success: true,
      reports: data.reports,
      pagination: data.pagination,
    });
  } catch (error: any) {
    console.error("[Admin Reports GET Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil daftar laporan." },
      { status: 500 }
    );
  }
}
