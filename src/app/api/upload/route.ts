import { NextRequest, NextResponse } from "next/server";

// Vercel Blob upload: client gets a token and uploads directly, or server proxies.
// This route proxies the upload to avoid exposing BLOB_READ_WRITE_TOKEN to client.
export async function POST(req: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN tidak dikonfigurasi." }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "File wajib dikirim." }, { status: 400 });

    const filename = `zyba/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    // Use Vercel Blob REST API
    const res = await fetch(`https://blob.vercel-storage.com/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": file.type || "application/octet-stream",
        "x-content-type": file.type || "application/octet-stream",
      },
      body: await file.arrayBuffer(),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Blob upload failed: " + errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ url: data.url, pathname: data.pathname });
  } catch (err: any) {
    console.error("[Upload Error]:", err);
    return NextResponse.json({ error: err.message || "Upload error" }, { status: 500 });
  }
}
