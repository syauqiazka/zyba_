import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { checkMessageQuota } from "@/backend/billing/entitlements";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const quotaCheck = await checkMessageQuota(session.userId);

    return NextResponse.json({
      allowed: quotaCheck.allowed,
      remaining: quotaCheck.remaining,
      limit: quotaCheck.remaining === Infinity ? "unlimited" : 20,
    });
  } catch (err: any) {
    console.error("[Quota Check Error]:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
