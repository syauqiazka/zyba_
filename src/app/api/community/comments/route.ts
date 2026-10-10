import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";
import { userRepository } from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";
import { invalidateCommunityCache } from "@/lib/communityCache";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID diperlukan." }, { status: 400 });
    }

    const comments = await communityRepository.getCommentsByPost(postId);

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error: any) {
    console.error("[GET Comments Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil komentar." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Silakan masuk untuk berkomentar." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    }

    // 🔒 Enforce moderation restrictions
    const modStatus = await userRepository.getUserModerationStatus(session.userId);
    if (modStatus.restricted) {
      return NextResponse.json(
        {
          error: modStatus.reason || "Akun Anda sedang dibatasi dan tidak dapat berkomentar.",
          isRestricted: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { postId, content, parentId } = body;

    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { error: "Post ID dan isi komentar wajib diisi." },
        { status: 400 }
      );
    }

    // Resolve author name & avatar directly from Account DB
    const user = await userRepository.findById(session.userId);
    const authorName = user?.name || session.name || "Pengguna ZYBA";
    const avatarUrl = resolveAvatar(user?.avatarUrl);

    const isRisk = detectRisk(content);

    const comment = await communityRepository.addComment(postId, {
      userId: session.userId,
      author: authorName,
      avatar: avatarUrl,
      content: content.trim(),
      parentId: parentId || null,
    });

    invalidateCommunityCache();

    return NextResponse.json({
      success: true,
      comment,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
    });
  } catch (error: any) {
    console.error("[POST Comment Error]:", error);
    return NextResponse.json(
      { error: error.message || "Gagal membuat komentar." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json({ error: "Comment ID diperlukan." }, { status: 400 });
    }

    const user = await userRepository.findById(session.userId);
    const isAdmin = (user as any)?.role === "ADMIN";

    const res = await communityRepository.deleteComment(commentId, session.userId, isAdmin);
    if (!res.success) {
      return NextResponse.json({ error: res.error || "Gagal menghapus komentar" }, { status: 400 });
    }

    invalidateCommunityCache();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menghapus komentar" }, { status: 500 });
  }
}