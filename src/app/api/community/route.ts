import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { verifySessionToken } from "@/lib/auth";
import { communityRepository } from "@/backend/community/communityRepository";
import { userRepository } from "@/backend/auth/userRepository";
import { resolveAvatar } from "@/lib/avatarUtils";

// Fast in-memory cache for community posts (TTL 6s)
let cachedCommunityPosts: { data: any; timestamp: number } | null = null;
const COMMUNITY_CACHE_TTL = 6000;

function invalidateCommunityCache() {
  cachedCommunityPosts = null;
}

export async function GET() {
  try {
    if (cachedCommunityPosts && Date.now() - cachedCommunityPosts.timestamp < COMMUNITY_CACHE_TTL) {
      return NextResponse.json(cachedCommunityPosts.data, {
        headers: {
          "Cache-Control": "public, max-age=5, stale-while-revalidate=15",
        },
      });
    }

    const posts = await communityRepository.getAllPosts();
    const responseData = { success: true, posts };
    cachedCommunityPosts = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, max-age=5, stale-while-revalidate=15",
      },
    });
  } catch (error) {
    console.error("Community get error:", error);
    return NextResponse.json({ success: true, posts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    let userId = "user_demo_alex";
    let authorName = "Pengguna ZYBA";
    let avatarUrl = "fox";

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
      invalidateCommunityCache();
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
      invalidateCommunityCache();
      return NextResponse.json({
        success: true,
        comment,
        isRisk,
        crisisResources: isRisk ? CRISIS_RESOURCES : null,
      });
    }

    // Handle new post
    const hasContent = Boolean(content && content.trim());
    const hasImage = Boolean(imageUrl && String(imageUrl).trim());

    if (!hasContent && !hasImage) {
      return NextResponse.json(
        { error: "Konten atau foto postingan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const cleanContent = hasContent ? content.trim() : "";

    // Safety: detectRisk() dari crisisDetection.ts wajib dipanggil di semua teks bebas (AGENTS.md Bagian 12)
    const isRisk = cleanContent ? detectRisk(cleanContent) : false;

    const savedPost = await communityRepository.createPost({
      userId,
      author: authorName,
      avatar: avatarUrl,
      content: cleanContent,
      tag: tag || "Sharing",
      imageUrl: hasImage ? String(imageUrl).trim() : null,
    });
    invalidateCommunityCache();

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
