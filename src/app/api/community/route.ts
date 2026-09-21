import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";
import { userRepository } from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";

export async function GET() {
  try {
    const posts = await communityRepository.getAllPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Community get error:", error);
    return NextResponse.json({ success: true, posts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId = "user_demo_alex";
    let authorName = "Alex Rivera";
    let avatarUrl = "🦊"; // resolved emoji for display in posts

    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        userId = session.userId;
        const user = await userRepository.findById(session.userId);
        if (user) {
          authorName = user.name;
          // Resolve avatar key → emoji for display in community posts
          avatarUrl = resolveAvatar(user.avatarUrl);
        }
      }
    }


    const body = await req.json();
    const { action, content, imageUrl, tag, postId } = body;

    // Handle like
    if (action === "LIKE" && postId) {
      const liked = await communityRepository.toggleLike(postId, userId);
      return NextResponse.json({ success: true, liked });
    }

    // Handle comment
    if (action === "COMMENT" && postId) {
      if (!content || !content.trim()) {
        return NextResponse.json(
          { error: "Komentar tidak boleh kosong." },
          { status: 400 }
        );
      }
      const isRisk = detectRisk(content);
      const comment = await communityRepository.addComment(postId, {
        userId,
        author: authorName,
        avatar: avatarUrl,
        content: content.trim(),
      });
      return NextResponse.json({
        success: true,
        comment,
        isRisk,
        crisisResources: isRisk ? CRISIS_RESOURCES : null,
      });
    }

    // Handle new post
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Konten postingan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Safety: detectRisk() dari crisisDetection.ts wajib dipanggil di semua teks bebas (AGENTS.md Bagian 12)
    const isRisk = detectRisk(content);

    const savedPost = await communityRepository.createPost({
      userId,
      author: authorName,
      avatar: avatarUrl,
      content: content.trim(),
      tag: tag || "Sharing",
      imageUrl: imageUrl || null,
    });

    return NextResponse.json({
      success: true,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
      post: savedPost,
      message: isRisk
        ? "Konten terdeteksi membutuhkan pendampingan darurat. Bantuan krisis tersedia."
        : "Postingan berhasil dipublikasikan.",
    });
  } catch (err: any) {
    console.error("Community post error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memproses postingan." },
      { status: 500 }
    );
  }
}
