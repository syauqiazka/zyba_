import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { verifySessionToken } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session) return NextResponse.json({ error: "Session tidak valid" }, { status: 401 });

    const { companionNotif, wellnessNotif, communityNotif } = await req.json();

    await accountDb.notificationPref.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, companionNotif: !!companionNotif, wellnessNotif: !!wellnessNotif, communityNotif: !!communityNotif },
      update: { companionNotif: !!companionNotif, wellnessNotif: !!wellnessNotif, communityNotif: !!communityNotif },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySessionToken(token);
    if (!session) return NextResponse.json({ error: "Session tidak valid" }, { status: 401 });

    const pref = await accountDb.notificationPref.findUnique({ where: { userId: session.userId } });
    return NextResponse.json({ pref: pref ?? { companionNotif: true, wellnessNotif: true, communityNotif: false } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
