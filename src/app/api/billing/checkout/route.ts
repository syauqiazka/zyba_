import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";

const PRICE = 49_000;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await verifySessionToken(token);
    if (!session?.userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    if (body.plan !== "monthly") {
      return NextResponse.json({ error: "Plan Premium yang tersedia hanya bulanan." }, { status: 400 });
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const result = await accountDb.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${session.userId}))`;

      const active = await tx.subscription.findFirst({
        where: { userId: session.userId, plan: "PLUS", status: "ACTIVE", endDate: { gt: now } },
        select: { id: true, endDate: true },
      });
      if (active) return { active, pending: null };

      const pending = await tx.payment.findFirst({
        where: {
          userId: session.userId,
          provider: "manual",
          status: "PENDING",
          createdAt: { gt: cutoff },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (pending) return { active: null, pending };

      const subscription = await tx.subscription.create({
        data: { userId: session.userId, plan: "PLUS", status: "PENDING" },
      });

      const orderId = `ZYBA-MANUAL-${subscription.id.slice(-10)}-${Date.now().toString(36)}`;

      const payment = await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          userId: session.userId,
          amount: PRICE,
          provider: "manual",
          orderId,
          paymentMethod: "MANUAL_TRANSFER",
          status: "PENDING",
        },
        select: { id: true },
      });

      return { active: null, pending: payment };
    });

    if (result.active) {
      return NextResponse.json(
        { error: "Akun kamu sudah memiliki ZYBA Premium aktif.", endDate: result.active.endDate },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: result.pending!.id,
      amount: PRICE,
      redirect: `/settings/zyba-plus/payment?payment_id=${encodeURIComponent(result.pending!.id)}`,
    });
  } catch (error: any) {
    console.error("[Manual Checkout] Error:", error);
    return NextResponse.json({ error: error?.message || "Gagal membuat pembayaran." }, { status: 500 });
  }
}
