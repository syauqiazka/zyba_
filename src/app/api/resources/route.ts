import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { unstable_cache } from "next/cache";
import { verifySessionToken } from "@/lib/auth";
import { getUserPlan } from "@/backend/billing/entitlements";

const getCachedResources = unstable_cache(
  async (type?: string | null) => {
    const whereClause: any = {};
    if (type && type !== "ALL") {
      whereClause.type = type;
    }

    return accountDb.resource.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  },
  ["api-resources-list"],
  { revalidate: 3600, tags: ["resources"] }
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "ARTICLE" | "COURSE" | "AUDIO" | "ALL"

    const token = req.cookies.get("auth-token")?.value;
    let isPlus = false;
    if (token) {
      const session = await verifySessionToken(token);
      if (session?.userId) isPlus = (await getUserPlan(session.userId)) === "PLUS";
    }

    const resources = await getCachedResources(type);
    const safeResources = resources.map((resource) =>
      resource.isPro && !isPlus
        ? { ...resource, body: null, audioUrl: null }
        : resource
    );

    return NextResponse.json(
      {
        success: true,
        resources,
        total: resources.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    console.error("[Resources API GET] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memuat konten edukasi." },
      { status: 500 }
    );
  }
}

