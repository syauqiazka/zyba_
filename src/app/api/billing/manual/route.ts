import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";

const PRICE = 49_000;

async function getSession(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const paymentId = new URL(req.url).searchParams.get("payment_id");
    if (!paymentId) return NextResponse.json({ error: "Payment ID wajib." }, { status: 400 });

    const payment = await accountDb.payment.findFirst({
      where: { id: paymentId, userId: session.userId, provider: "manual" },
      select: {
        id: true, amount: true, orderId: true, status: true, proofUrl: true,
        senderName: true, rejectionReason: true, submittedAt: true, paidAt: true,
        createdAt: true,
      },
    });

    if (!payment) return NextResponse.json({ error: "Pembayaran tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    console.error("[Manual Payment GET]", error);
    return NextResponse.json({ error: "Gagal mengambil pembayaran." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
    const proofUrl = typeof body.proofUrl === "string" ? body.proofUrl : "";
    const senderName = typeof body.senderName === "string" ? body.senderName.trim() : "";

    if (!paymentId || !proofUrl || !senderName) {
      return NextResponse.json({ error: "Nama pengirim dan bukti pembayaran wajib diisi." }, { status: 400 });
    }
    if (!proofUrl.startsWith("/uploads/") && !proofUrl.startsWith("http")) {
      return NextResponse.json({ error: "Bukti pembayaran tidak valid." }, { status: 400 });
    }

    const payment = await accountDb.payment.findFirst({
      where: { id: paymentId, userId: session.userId, provider: "manual" },
      select: { id: true, amount: true, status: true },
    });

    if (!payment) return NextResponse.json({ error: "Pembayaran tidak ditemukan." }, { status: 404 });
    if (payment.amount !== PRICE) return NextResponse.json({ error: "Nominal pembayaran tidak valid." }, { status: 400 });
    if (payment.status !== "PENDING" && payment.status !== "REJECTED") {
      return NextResponse.json({ error: "Pembayaran ini sudah diproses dan tidak dapat dikirim ulang." }, { status: 409 });
    }

    await accountDb.payment.update({
      where: { id: payment.id },
      data: {
        proofUrl,
        senderName,
        submittedAt: new Date(),
        rejectionReason: null,
        status: "PENDING",
      },
    });

    await accountDb.subscription.updateMany({
      where: { userId: session.userId, payments: { some: { id: payment.id } } },
      data: { status: "PENDING" },
    });

    return NextResponse.json({ success: true, message: "Bukti pembayaran berhasil dikirim dan sedang diverifikasi." });
  } catch (error: any) {
    console.error("[Manual Payment POST]", error);
    return NextResponse.json({ error: "Gagal mengirim bukti pembayaran." }, { status: 500 });
  }
}
