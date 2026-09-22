import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { getAblyTokenForUser } from "@/backend/realtime/ably";

/**
 * GET /api/community/dm/token
 * Get Ably token for client-side realtime connection
 */
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

    const ablyToken = await getAblyTokenForUser(session.userId);
    return NextResponse.json({ token: ablyToken });
  } catch (err: any) {
    console.error("[Ably Token]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
