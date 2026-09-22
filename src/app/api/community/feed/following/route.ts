import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";

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

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const posts = await communityRepository.getFollowingPosts(
      session.userId,
      limit,
      cursor
    );

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error("Following feed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch following feed" },
      { status: 500 }
    );
  }
}
