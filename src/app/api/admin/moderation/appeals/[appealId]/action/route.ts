import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/backend/billing/admin";
import { appealRepository } from "@/backend/community/appealRepository";

export async function POST(
  req: NextRequest,
  { params }: { params: { appealId: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Akses ditolak. Memerlukan role Administrator." },
        { status: 403 }
      );
    }

    const { appealId } = params;
    const body = await req.json().catch(() => ({}));
    const { action, note = "" } = body;

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { error: "Action tidak valid. Gunakan 'APPROVE' atau 'REJECT'." },
        { status: 400 }
      );
    }

    if (action === "REJECT" && !String(note).trim()) {
      return NextResponse.json(
        { error: "Alasan penolakan banding wajib diisi agar pengguna memahami keputusannya." },
        { status: 400 }
      );
    }

    const result = await appealRepository.processAppeal(
      appealId,
      action,
      admin.id,
      admin.name || "Admin ZYBA",
      String(note).trim()
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? "Permohonan banding disetujui. Akun pengguna berhasil dipulihkan (unban)."
          : "Permohonan banding telah ditolak.",
      appeal: result.appeal,
    });
  } catch (error: any) {
    console.error("[Admin Appeal Action POST] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memproses permohonan banding." },
      { status: 500 }
    );
  }
}
