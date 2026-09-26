import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
};

// Clean fallback avatar SVG (ZYBA style) when an uploaded file is not found
const FALLBACK_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="50" fill="#FCE3D3"/>
  <circle cx="50" cy="38" r="18" fill="#F2884B"/>
  <path d="M22 84 C22 66, 35 58, 50 58 C65 58, 78 66, 78 84 Z" fill="#3B2A20"/>
</svg>`;

// Clean fallback general image SVG for post attachments/banners when file is missing
const FALLBACK_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <rect width="600" height="360" fill="#F7F2E7"/>
  <rect x="16" y="16" width="568" height="328" rx="20" fill="#FFFFFF" stroke="#E4EED2" stroke-width="2"/>
  <circle cx="300" cy="150" r="44" fill="#FCE3D3"/>
  <text x="300" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" text-anchor="middle">🌿</text>
  <text x="300" y="230" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#3B2A20" text-anchor="middle">ZYBA Community</text>
  <text x="300" y="258" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#8FAE5D" text-anchor="middle">Gambar sedang disinkronkan</text>
</svg>`;

export async function GET(
  request: NextRequest,
  { params }: { params: { filePath: string[] } }
) {
  try {
    const rawSegments = params.filePath || [];

    // Path traversal security check
    if (
      rawSegments.some(
        (seg) =>
          seg.includes("..") ||
          seg.includes("/") ||
          seg.includes("\\") ||
          seg.trim() === ""
      )
    ) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const isAvatar = rawSegments.includes("avatars") || rawSegments.some((s) => s.toLowerCase().includes("avatar"));

    // Potential directory candidates across various deployment modes
    const candidatePaths = [
      path.join(process.cwd(), "public", "uploads", ...rawSegments),
      path.join(process.cwd(), "uploads", ...rawSegments),
      path.resolve("public", "uploads", ...rawSegments),
      path.resolve("uploads", ...rawSegments),
    ];

    let targetPath: string | null = null;
    for (const p of candidatePaths) {
      try {
        await fs.access(p);
        targetPath = p;
        break;
      } catch {
        // continue search
      }
    }

    if (!targetPath) {
      // Return a graceful SVG fallback instead of a broken 404 image box!
      const fallbackSvg = isAvatar ? FALLBACK_AVATAR_SVG : FALLBACK_IMAGE_SVG;
      return new NextResponse(fallbackSvg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    const fileBuffer = await fs.readFile(targetPath);
    const ext = (targetPath.split(".").pop() || "").toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("[Uploads Route Handler Error]:", error);
    return NextResponse.json(
      { error: "Gagal memuat file" },
      { status: 500 }
    );
  }
}
