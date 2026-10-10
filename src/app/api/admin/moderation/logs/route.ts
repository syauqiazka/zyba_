import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/backend/billing/admin";
import { accountDb } from "@/backend/db/accountClient";

const VALID_ACTIONS = new Set([
  "WARN",
  "HIDE_POST",
  "HIDE_COMMENT",
  "DELETE_POST",
  "DELETE_COMMENT",
  "SUSPEND",
  "BAN",
  "LIFT_RESTRICTION",
  "DISMISS_REPORT",
]);

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
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Akses ditolak. Memerlukan role Administrator." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const action = searchParams.get("action");
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    // Filter tanggal inklusif WIB (Asia/Jakarta)
    const { gte, lte } = parseWibDateRange(startDateStr, endDateStr);
    if (gte || lte) {
      where.createdAt = {};
      if (gte) where.createdAt.gte = gte;
      if (lte) where.createdAt.lte = lte;
    }

    // Filter jenis tindakan
    if (action && VALID_ACTIONS.has(action)) {
      where.action = action;
    }

    // Filter pencarian
    if (search) {
      where.OR = [
        { reason: { contains: search, mode: "insensitive" } },
        { targetUser: { name: { contains: search, mode: "insensitive" } } },
        { targetUser: { email: { contains: search, mode: "insensitive" } } },
        { admin: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, rawLogs] = await Promise.all([
      accountDb.moderationLog.count({ where }),
      accountDb.moderationLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          targetUser: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              isBanned: true,
              isSuspended: true,
              suspendedUntil: true,
              banReason: true,
            },
          },
        },
      }),
    ]);

    const logs = rawLogs.map((log) => ({
      id: log.id,
      adminId: log.adminId,
      adminName: log.admin?.name || "Admin ZYBA",
      adminEmail: log.admin?.email,
      targetUserId: log.targetUserId,
      targetUserName: log.targetUser?.name || "Pengguna ZYBA",
      targetUserEmail: log.targetUser?.email,
      targetUserAvatar: log.targetUser?.avatarUrl || "fox",
      targetUserStatus: {
        isBanned: log.targetUser?.isBanned || false,
        isSuspended: log.targetUser?.isSuspended || false,
        suspendedUntil: log.targetUser?.suspendedUntil?.toISOString() || null,
      },
      action: log.action,
      reason: log.reason,
      durationDays: log.durationDays,
      reportId: log.reportId,
      metadata: log.metadata,
      createdAt: log.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("[Moderation Logs GET] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil riwayat audit moderasi." },
      { status: 500 }
    );
  }
}
