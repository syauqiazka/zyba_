import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "ARTICLE" | "COURSE" | "AUDIO" | "ALL"

    const whereClause: any = {};
    if (type && type !== "ALL") {
      whereClause.type = type;
    }

    const resources = await accountDb.resource.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      resources,
      total: resources.length,
    });
  } catch (error: any) {
    console.error("[Resources API GET] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memuat konten edukasi." },
      { status: 500 }
    );
  }
}
