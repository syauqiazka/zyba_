import { NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    // Light DB ping — SELECT 1 via Prisma queryRaw
    await accountDb.$queryRaw`SELECT 1`;

    const latencyMs = Date.now() - start;

    return NextResponse.json(
      {
        status: "ok",
        db: "connected",
        latencyMs,
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "degraded",
        db: "error",
        error: err?.message?.slice(0, 120) ?? "Unknown DB error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "10",
        },
      }
    );
  }
}
