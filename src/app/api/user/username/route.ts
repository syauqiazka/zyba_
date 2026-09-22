import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";
import { ensureUsername } from "@/lib/usernameUtils";

// Get current username
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await accountDb.user.findUnique({
      where: { id: session.userId },
      select: { username: true },
    });

    return NextResponse.json({ username: user?.username || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Generate username if missing
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const username = await ensureUsername(session.userId);

    return NextResponse.json({ username });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update username (custom)
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await req.json();

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }

    // Check alphanumeric + dots/underscores
    if (!/^[a-z0-9._]+$/.test(username)) {
      return NextResponse.json({ error: "Username can only contain lowercase letters, numbers, dots, and underscores" }, { status: 400 });
    }

    // Check availability
    const existing = await accountDb.user.findUnique({
      where: { username },
    });

    if (existing && existing.id !== session.userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    await accountDb.user.update({
      where: { id: session.userId },
      data: { username },
    });

    return NextResponse.json({ username });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
