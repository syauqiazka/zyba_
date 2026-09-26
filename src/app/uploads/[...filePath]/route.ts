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

    // Check in public/uploads/
    const primaryPath = path.join(process.cwd(), "public", "uploads", ...rawSegments);
    let targetPath = primaryPath;

    let exists = false;
    try {
      await fs.access(primaryPath);
      exists = true;
    } catch {
      // Fallback: check in uploads/ directly in project root
      const fallbackPath = path.join(process.cwd(), "uploads", ...rawSegments);
      try {
        await fs.access(fallbackPath);
        targetPath = fallbackPath;
        exists = true;
      } catch {
        exists = false;
      }
    }

    if (!exists) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
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
