import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { userRepository } from "@/backend/auth/userRepository";
import { communityRepository } from "@/backend/community/communityRepository";
import { communityDb } from "@/backend/db/communityClient";
import { verifySessionToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // First try Prisma directly (fast path for normal Neon-based IDs)
    let user: { id: string; name: string; username: string | null; avatarUrl: string | null; bio: string | null } | null = null;

    try {
      const dbUser = await accountDb.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          bio: true,
        },
      });
      if (dbUser) {
        user = dbUser;
      }
    } catch (dbErr: any) {
      console.warn("[profile GET] Direct DB failed, falling back:", dbErr.message);
    }

    // Fallback: userRepository.findById() checks local data/users.json too
    // (needed when user was created while Neon was unavailable — IDs like user_TIMESTAMP_xxx)
    if (!user) {
      const storedUser = await userRepository.findById(userId);
      if (storedUser) {
        user = {
          id: storedUser.id,
          name: storedUser.name || "Pengguna ZYBA",
          username: storedUser.username || null,
          avatarUrl: storedUser.avatarUrl || null,
          bio: storedUser.bio || null,
        };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch counts from Community DB (safe — will return 0 on error)
    let followerCount = 0;
    let followingCount = 0;
    let postCount = 0;

    try {
      [followerCount, followingCount, postCount] = await Promise.all([
        communityRepository.getFollowerCount(userId),
        communityRepository.getFollowingCount(userId),
        communityDb.communityPost.count({ where: { userId } }),
      ]);
    } catch (communityErr: any) {
      console.warn("[profile GET] Community counts failed:", communityErr.message);
    }

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
    const { name, username, bio, avatarUrl } = body;

    // Validate
    if (name !== undefined && (!name || !name.trim())) {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    // For local-fallback users (user_TIMESTAMP_xxx), use userRepository.update()
    // which also handles local JSON storage
    const isLocalFallbackUser = params.userId.startsWith("user_") && !params.userId.match(/^user_[0-9a-f-]{36}$/);

    if (isLocalFallbackUser) {
      const updated = await userRepository.update(params.userId, {
        name: name?.trim(),
        avatarUrl: avatarUrl ?? undefined,
        bio: bio?.trim() || undefined,
        username: username?.trim().toLowerCase().replace(/[^a-z0-9_]/g, "") || undefined,
      });

      if (!updated) {
        return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json({
        user: {
          id: updated.id,
          name: updated.name,
          username: updated.username,
          avatarUrl: updated.avatarUrl,
          bio: updated.bio,
        }
      });
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
          ...(avatarUrl !== undefined && { avatarUrl }),
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
        ...(avatarUrl !== undefined && { avatarUrl }),
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
