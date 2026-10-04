import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { requireAdmin } from "@/backend/billing/admin";
import { invalidateUserPlanCache } from "@/backend/billing/entitlements";
import { invalidateUserMeCache } from "@/lib/server/userMeCache";

type ManualPayload = {
  proofUrl?: string;
  senderName?: string;
  submittedAt?: string;
  rejectionReason?: string | null;
  rejectedAt?: string;
  paidAt?: string;
  verifiedAt?: string;
};

function payloadOf(value: unknown): ManualPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as ManualPayload;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const status = new URL(req.url).searchParams.get("status") || "PENDING";
    const payments = await accountDb.payment.findMany({
      where: { provider: "manual", ...(status === "ALL" ? {} : { status: status as any }) },
      include: { subscription: { select: { id: true, plan: true, status: true, startDate: true, endDate: true } } },
      orderBy: { createdAt: "desc" }, take: 100,
    });
    const users = await accountDb.user.findMany({
      where: { id: { in: payments.map((p) => p.userId) } },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));
    return NextResponse.json({
      success: true,
      payments: payments.map((p) => {
        const meta = payloadOf(p.rawPayload);
        return {
          id: p.id, userId: p.userId, amount: p.amount, orderId: p.orderId,
          status: p.status, paymentMethod: p.paymentMethod, createdAt: p.createdAt, updatedAt: p.updatedAt,
          proofUrl: meta.proofUrl ?? null, senderName: meta.senderName ?? null,
          submittedAt: meta.submittedAt ?? null, rejectionReason: meta.rejectionReason ?? null,
          paidAt: meta.paidAt ?? null, subscription: p.subscription, user: userMap.get(p.userId) || null,
        };
      }),
    });
  } catch (error) {
    console.error("[Admin Payments GET]", error);
    return NextResponse.json({ error: "Gagal mengambil data pembayaran." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
    const action = body.action === "APPROVE" || body.action === "REJECT" ? body.action : null;
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    if (!paymentId || !action) return NextResponse.json({ error: "Data approval tidak valid." }, { status: 400 });
    if (action === "REJECT" && !reason) return NextResponse.json({ error: "Alasan penolakan wajib diisi." }, { status: 400 });

    const result = await accountDb.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId }, include: { subscription: true } });
      if (!payment || payment.provider !== "manual") throw new Error("Pembayaran tidak ditemukan.");
      if (payment.status !== "PENDING") throw new Error("Pembayaran ini sudah diproses.");
      const meta = payloadOf(payment.rawPayload);
      if (!meta.proofUrl || !meta.submittedAt) throw new Error("Bukti pembayaran belum dikirim.");

      if (action === "REJECT") {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "CANCELLED", rawPayload: { ...meta, rejectionReason: reason, rejectedAt: new Date().toISOString() } },
        });
        await tx.subscription.update({ where: { id: payment.subscriptionId }, data: { status: "CANCELLED" } });
        return { userId: payment.userId, approved: false };
      }

      const now = new Date();
      const currentActive = await tx.subscription.findFirst({
        where: { userId: payment.userId, plan: "PLUS", status: "ACTIVE", endDate: { gt: now }, id: { not: payment.subscriptionId } },
        select: { endDate: true },
      });
      const base = currentActive?.endDate && currentActive.endDate > now ? currentActive.endDate : now;
      const endDate = new Date(base);
      endDate.setDate(endDate.getDate() + 30);

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS", rawPayload: { ...meta, paidAt: now.toISOString(), verifiedAt: now.toISOString(), rejectionReason: null } },
      });
      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: "ACTIVE", startDate: now, endDate },
      });
      await tx.user.update({ where: { id: payment.userId }, data: { plan: "PLUS" } });
      return { userId: payment.userId, approved: true, endDate };
    });

    invalidateUserPlanCache(result.userId);
    invalidateUserMeCache(result.userId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[Admin Payments PATCH]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memproses pembayaran." }, { status: 400 });
  }
}
