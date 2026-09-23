import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { communityRepository } from "@/backend/community/communityRepository";
import { communityDb } from "@/backend/db/communityClient";
import { verifySessionToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Fetch user from Account DB
    const user = await accountDb.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch counts from Community DB
    const [followerCount, followingCount, postCount] = await Promise.all([
      communityRepository.getFollowerCount(userId),
      communityRepository.getFollowingCount(userId),
      communityDb.communityPost.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      user,
      followerCount,
      followingCount,
      postCount,
    });
  } catch (error: any) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session || session.userId !== params.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, username, bio } = body;

    // Validate
    if (name !== undefined && (!name || !name.trim())) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    // Check username uniqueness if being changed
    if (username !== undefined && username.trim()) {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const existing = await accountDb.user.findFirst({
        where: { username: cleanUsername, NOT: { id: params.userId } },
      });
      if (existing) {
        return NextResponse.json({ error: "Username sudah dipakai" }, { status: 409 });
      }

      const updated = await accountDb.user.update({
        where: { id: params.userId },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          username: cleanUsername,
          ...(bio !== undefined && { bio: bio.trim() || null }),
        },
        select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
      });
      return NextResponse.json({ user: updated });
    }

    const updated = await accountDb.user.update({
      where: { id: params.userId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(bio !== undefined && { bio: bio.trim() || null }),
      },
      select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
