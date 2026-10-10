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

function parseWibDateRange(startDateStr?: string | null, endDateStr?: string | null) {
  let gte: Date | undefined;
  let lte: Date | undefined;

  if (startDateStr && /^\d{4}-\d{2}-\d{2}$/.test(startDateStr)) {
    gte = new Date(`${startDateStr}T00:00:00+07:00`);
  }
  if (endDateStr && /^\d{4}-\d{2}-\d{2}$/.test(endDateStr)) {
    lte = new Date(`${endDateStr}T23:59:59.999+07:00`);
  }

  if (gte && lte && gte > lte) {
    const temp = gte;
    gte = new Date(`${endDateStr}T00:00:00+07:00`);
    lte = new Date(`${startDateStr}T23:59:59.999+07:00`);
  }

  return { gte, lte };
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") || "ALL";
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const where: any = { provider: "manual" };

    // 1. Status Filter
    if (statusParam && statusParam !== "ALL") {
      where.status = statusParam;
    }

    // 2. Date Range Filter (Inklusif WIB UTC+7)
    const { gte, lte } = parseWibDateRange(startDateStr, endDateStr);
    if (gte || lte) {
      where.createdAt = {};
      if (gte) where.createdAt.gte = gte;
      if (lte) where.createdAt.lte = lte;
    }

    // 3. Search Filter (orderId or user details)
    if (search) {
      // Find matching user IDs first to allow querying across relation
      const matchedUsers = await accountDb.user.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      });
      const userIds = matchedUsers.map((u) => u.id);

      where.OR = [
        { orderId: { contains: search, mode: "insensitive" } },
        { transactionId: { contains: search, mode: "insensitive" } },
        ...(userIds.length > 0 ? [{ userId: { in: userIds } }] : []),
      ];
    }

    // Hitung ringkasan statistik (summary metrics) berdasarkan filter rentang tanggal & search
    // Note: Summary metrics dihitung pada scope tanggal/search yang sama
    const summaryWhereBase: any = { provider: "manual" };
    if (gte || lte) {
      summaryWhereBase.createdAt = {};
      if (gte) summaryWhereBase.createdAt.gte = gte;
      if (lte) summaryWhereBase.createdAt.lte = lte;
    }
    if (where.OR) {
      summaryWhereBase.OR = where.OR;
    }

    const [
      totalCount,
      successPayments,
      pendingCount,
      failedCount,
      filteredTotal,
      rawPayments,
    ] = await Promise.all([
      accountDb.payment.count({ where: summaryWhereBase }),
      accountDb.payment.findMany({
        where: { ...summaryWhereBase, status: "SUCCESS" },
        select: { amount: true },
      }),
      accountDb.payment.count({ where: { ...summaryWhereBase, status: "PENDING" } }),
      accountDb.payment.count({
        where: { ...summaryWhereBase, status: { in: ["FAILED", "CANCELLED", "EXPIRED"] } },
      }),
      accountDb.payment.count({ where }),
      accountDb.payment.findMany({
        where,
        include: {
          subscription: {
            select: { id: true, plan: true, status: true, startDate: true, endDate: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalRevenue = successPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const successCount = successPayments.length;

    // Fetch user details for current page items
    const userIds = [...new Set(rawPayments.map((p) => p.userId))];
    const users = await accountDb.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const payments = rawPayments.map((p) => {
      const meta = payloadOf(p.rawPayload);
      return {
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        orderId: p.orderId,
        transactionId: p.transactionId,
        status: p.status,
        paymentMethod: p.paymentMethod || "Transfer Manual",
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        proofUrl: meta.proofUrl ?? null,
        senderName: meta.senderName ?? null,
        submittedAt: meta.submittedAt ?? null,
        rejectionReason: meta.rejectionReason ?? null,
        paidAt: meta.paidAt ?? null,
        verifiedAt: meta.verifiedAt ?? null,
        subscription: p.subscription,
        user: userMap.get(p.userId) || null,
      };
    });

    return NextResponse.json({
      success: true,
      payments,
      summary: {
        totalCount,
        successCount,
        pendingCount,
        failedCount,
        totalRevenue,
      },
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit) || 1,
      },
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

    if (!paymentId || !action) {
      return NextResponse.json({ error: "Data approval tidak valid." }, { status: 400 });
    }
    if (action === "REJECT" && !reason) {
      return NextResponse.json({ error: "Alasan penolakan wajib diisi." }, { status: 400 });
    }

    const result = await accountDb.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { subscription: true },
      });
      if (!payment || payment.provider !== "manual") {
        throw new Error("Pembayaran tidak ditemukan.");
      }
      if (payment.status !== "PENDING") {
        throw new Error("Pembayaran ini sudah diproses.");
      }
      const meta = payloadOf(payment.rawPayload);
      if (!meta.proofUrl || !meta.submittedAt) {
        throw new Error("Bukti pembayaran belum dikirim.");
      }

      if (action === "REJECT") {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "CANCELLED",
            rawPayload: {
              ...meta,
              rejectionReason: reason,
              rejectedAt: new Date().toISOString(),
            },
          },
        });
        await tx.subscription.update({
          where: { id: payment.subscriptionId },
          data: { status: "CANCELLED" },
        });
        return { userId: payment.userId, approved: false };
      }

      const now = new Date();
      const currentActive = await tx.subscription.findFirst({
        where: {
          userId: payment.userId,
          plan: "PLUS",
          status: "ACTIVE",
          endDate: { gt: now },
          id: { not: payment.subscriptionId },
        },
        select: { endDate: true },
      });
      const base = currentActive?.endDate && currentActive.endDate > now ? currentActive.endDate : now;
      const endDate = new Date(base);
      endDate.setDate(endDate.getDate() + 30);

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          rawPayload: {
            ...meta,
            paidAt: now.toISOString(),
            verifiedAt: now.toISOString(),
            rejectionReason: null,
          },
        },
      });
      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
          status: "ACTIVE",
          startDate: now,
          endDate,
        },
      });
      await tx.user.update({
        where: { id: payment.userId },
        data: { plan: "PLUS" },
      });

      return { userId: payment.userId, approved: true };
    });

    invalidateUserPlanCache(result.userId);
    invalidateUserMeCache(result.userId);

    return NextResponse.json({
      success: true,
      message: result.approved
        ? "Pembayaran berhasil disetujui. Paket PLUS aktif 30 hari."
        : "Pembayaran telah ditolak.",
    });
  } catch (error: any) {
    console.error("[Admin Payments PATCH]", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui status pembayaran." },
      { status: 400 }
    );
  }
}
