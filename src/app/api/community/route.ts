import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";
import { userRepository } from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";
import {
  getCommunityCache,
  setCommunityCache,
  invalidateCommunityCache,
  COMMUNITY_CACHE_TTL,
} from "@/lib/communityCache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const take = Math.min(Number(searchParams.get("take") || 30), 50);

    // Only use cache for first page (no cursor) to avoid stale paginated results
    const isFirstPage = !cursor;

    const cached = getCommunityCache();
    if (
      isFirstPage &&
      cached &&
      Date.now() - cached.timestamp < COMMUNITY_CACHE_TTL
    ) {
      return NextResponse.json(
        cached.data,
        {
          headers: {
            "Cache-Control": "public, max-age=20, stale-while-revalidate=60",
            "X-Cache": "HIT",
          },
        }
      );
    }

    const posts = await communityRepository.getAllPosts(take, cursor);

    const responseData = {
      success: true,
      posts,
      nextCursor: posts.length === take ? posts[posts.length - 1]?.id : null,
    };

    if (isFirstPage) {
      setCommunityCache(responseData);
    }

    return NextResponse.json(
      responseData,
      {
        headers: {
          "Cache-Control": isFirstPage
            ? "public, max-age=20, stale-while-revalidate=60"
            : "public, max-age=10, stale-while-revalidate=30",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error: any) {
    console.error(
      "[Community GET] Database error:",
      error
    );

    invalidateCommunityCache();

    return NextResponse.json(
      {
        success: false,
        posts: [],
        error:
          error?.message ||
          "Database Community tidak dapat diakses.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const token =
      req.cookies.get("auth-token")?.value;

    let userId = "user_demo_alex";
    let authorName = "Pengguna ZYBA";
    let avatarUrl = "fox";

    if (token) {
      const session =
        await verifySessionToken(token);

      if (session) {
        userId = session.userId;

        const user =
          await userRepository.findById(
            session.userId
          );

        if (user) {
          authorName = user.name;
          avatarUrl = resolveAvatar(
            user.avatarUrl
          );
        }
      }
    }

    // 🔒 SERVER-SIDE MODERATION ENFORCEMENT: Pengguna yang dibatasi (banned atau suspended) dilarang berinteraksi
    const modStatus = await userRepository.getUserModerationStatus(userId);
    if (modStatus.restricted) {
      return NextResponse.json(
        {
          error: modStatus.reason || "Akun Anda sedang dibatasi dan tidak dapat melakukan tindakan ini.",
          isRestricted: true,
          isBanned: modStatus.isBanned,
          isSuspended: modStatus.isSuspended,
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      action,
      content,
      imageUrl,
      tag,
      postId,
      parentId,
      commentId,
    } = body;

    // =========================
    // LIKE
    // =========================
    if (
      action === "LIKE" &&
      postId
    ) {
      const liked =
        await communityRepository.toggleLike(
          postId,
          userId
        );

      invalidateCommunityCache();

      return NextResponse.json({
        success: true,
        liked,
      });
    }

    // =========================
    // COMMENT / NESTED REPLY
    // =========================
    if (
      action === "COMMENT" &&
      postId
    ) {
      if (
        !content ||
        !content.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Komentar tidak boleh kosong.",
          },
          {
            status: 400,
          }
        );
      }

      const isRisk =
        detectRisk(content);

      try {
        const comment =
          await communityRepository.addComment(
            postId,
            {
              userId,
              author: authorName,
              avatar: avatarUrl,
              content: content.trim(),
              parentId: parentId || null,
            }
          );

        invalidateCommunityCache();

        return NextResponse.json({
          success: true,
          comment,
          isRisk,
          crisisResources: isRisk
            ? CRISIS_RESOURCES
            : null,
        });
      } catch (err: any) {
        return NextResponse.json(
          { error: err?.message || "Gagal mengirim komentar." },
          { status: 400 }
        );
      }
    }

    // =========================
    // DELETE COMMENT
    // =========================
    if (action === "DELETE_COMMENT" && commentId) {
      const actingUser = await userRepository.findById(userId).catch(() => null);
      const isAdmin = (actingUser as any)?.role === "ADMIN";
      const res = await communityRepository.deleteComment(commentId, userId, isAdmin);
      if (!res.success) {
        return NextResponse.json({ error: res.error || "Gagal menghapus komentar" }, { status: 400 });
      }
      invalidateCommunityCache();
      return NextResponse.json({ success: true });
    }

    // =========================
    // NEW POST
    // =========================
    const hasContent = Boolean(
      content &&
      content.trim()
    );

    const hasImage = Boolean(
      imageUrl &&
      String(imageUrl).trim()
    );

    if (
      !hasContent &&
      !hasImage
    ) {
      return NextResponse.json(
        {
          error:
            "Konten atau foto postingan tidak boleh kosong.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanContent =
      hasContent
        ? content.trim()
        : "";

    const isRisk = cleanContent
      ? detectRisk(cleanContent)
      : false;

    const savedPost =
      await communityRepository.createPost({
        userId,
        author: authorName,
        avatar: avatarUrl,
        content: cleanContent,
        tag:
          tag || "Sharing",
        imageUrl: hasImage
          ? String(imageUrl).trim()
          : null,
      });

    invalidateCommunityCache();

    let unlockedBadges: any[] =
      [];

    try {
      const {
        triggerBadgeCheck,
      } = await import(
        "@/lib/badges/badgeService"
      );

      unlockedBadges =
        await triggerBadgeCheck(
          userId,
          "community_post"
        );
    } catch (badgeError) {
      console.warn(
        "[Community Badge] Trigger error:",
        badgeError
      );
    }

    return NextResponse.json({
      success: true,
      isRisk,
      crisisResources: isRisk
        ? CRISIS_RESOURCES
        : null,
      post: savedPost,
      unlockedBadges,
      message: isRisk
        ? "Konten terdeteksi membutuhkan pendampingan darurat. Bantuan krisis tersedia."
        : "Postingan berhasil dipublikasikan.",
    });
  } catch (error: any) {
    console.error(
      "[Community POST] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal memproses postingan.",
      },
      {
        status: 500,
      }
    );
  }
}