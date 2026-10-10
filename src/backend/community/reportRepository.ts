import fs from "fs";
import path from "path";
import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";
import { userRepository } from "@/backend/auth/userRepository";
import { formatRelativeTime } from "@/lib/dateUtils";

export type ReportTargetType = "POST" | "COMMENT";
export type ReportStatus = "PENDING" | "REVIEWING" | "ACTION_TAKEN" | "DISMISSED";

export interface StoredCommunityReport {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  postId?: string | null;
  reportedUserId: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  reviewedBy?: string | null;
  resolutionNote?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnrichedReportItem extends StoredCommunityReport {
  reportedUser?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    warningCount: number;
    isBanned: boolean;
    isSuspended: boolean;
    suspendedUntil?: string | null;
  } | null;
  reporter?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
  contentPreview?: {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    timeAgo: string;
    isHidden: boolean;
    postContext?: {
      id: string;
      content: string;
      authorName: string;
    } | null;
    parentCommentContext?: {
      id: string;
      content: string;
    } | null;
  } | null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_FILE = path.join(DATA_DIR, "community_reports.json");

function readLocalReports(): StoredCommunityReport[] {
  try {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    const content = fs.readFileSync(REPORTS_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeLocalReports(reports: StoredCommunityReport[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf8");
  } catch (err) {
    console.warn("[reportRepository] write local fallback failed:", err);
  }
}

export const reportRepository = {
  /**
   * Membuat laporan baru terhadap post atau comment.
   */
  async createReport(data: {
    reporterId: string;
    targetType: ReportTargetType;
    targetId: string;
    reason: string;
    details?: string;
  }): Promise<{ success: boolean; report?: StoredCommunityReport; error?: string; alreadyReported?: boolean }> {
    const { reporterId, targetType, targetId, reason, details } = data;

    let reportedUserId = "";
    let postId: string | null = null;

    // 1. Verifikasi konten target & temukan pemilik konten
    try {
      if (targetType === "POST") {
        const post = await communityDb.communityPost.findUnique({
          where: { id: targetId },
          select: { id: true, userId: true },
        });
        if (!post) {
          return { success: false, error: "Postingan yang dilaporkan tidak ditemukan." };
        }
        reportedUserId = post.userId;
        postId = post.id;
      } else {
        const comment = await communityDb.communityComment.findUnique({
          where: { id: targetId },
          select: { id: true, userId: true, postId: true },
        });
        if (!comment) {
          return { success: false, error: "Komentar yang dilaporkan tidak ditemukan." };
        }
        reportedUserId = comment.userId;
        postId = comment.postId;
      }
    } catch (err: any) {
      console.warn("[reportRepo] DB lookup target fallback:", err?.message);
      // Fallback: anggap target valid jika DB offline
      reportedUserId = reportedUserId || "user_unknown";
      postId = targetType === "POST" ? targetId : null;
    }

    if (reportedUserId === reporterId) {
      return { success: false, error: "Anda tidak dapat melaporkan konten milik sendiri." };
    }

    // 2. Cek duplikasi laporan aktif oleh pelapor yang sama
    try {
      const existing = await communityDb.communityReport.findFirst({
        where: {
          reporterId,
          targetId,
          status: "PENDING",
        },
      });
      if (existing) {
        return {
          success: true,
          alreadyReported: true,
          report: {
            ...existing,
            createdAt: existing.createdAt.toISOString(),
            updatedAt: existing.updatedAt.toISOString(),
            resolvedAt: existing.resolvedAt?.toISOString() ?? null,
          },
        };
      }
    } catch {
      const local = readLocalReports();
      const existingLocal = local.find(
        (r) => r.reporterId === reporterId && r.targetId === targetId && r.status === "PENDING"
      );
      if (existingLocal) {
        return { success: true, alreadyReported: true, report: existingLocal };
      }
    }

    // 3. Simpan ke database
    try {
      const created = await communityDb.communityReport.create({
        data: {
          reporterId,
          targetType,
          targetId,
          postId,
          reportedUserId,
          reason,
          details: details?.trim() || null,
          status: "PENDING",
        },
      });

      const reportDto: StoredCommunityReport = {
        id: created.id,
        reporterId: created.reporterId,
        targetType: created.targetType as ReportTargetType,
        targetId: created.targetId,
        postId: created.postId,
        reportedUserId: created.reportedUserId,
        reason: created.reason,
        details: created.details,
        status: created.status as ReportStatus,
        reviewedBy: created.reviewedBy,
        resolutionNote: created.resolutionNote,
        resolvedAt: created.resolvedAt ? created.resolvedAt.toISOString() : null,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };

      return { success: true, report: reportDto };
    } catch (dbErr: any) {
      console.warn("[reportRepo] DB create fallback to local file:", dbErr?.message);

      const nowIso = new Date().toISOString();
      const reportDto: StoredCommunityReport = {
        id: "rep_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6),
        reporterId,
        targetType,
        targetId,
        postId,
        reportedUserId,
        reason,
        details: details?.trim() || null,
        status: "PENDING",
        reviewedBy: null,
        resolutionNote: null,
        resolvedAt: null,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      const local = readLocalReports();
      local.unshift(reportDto);
      writeLocalReports(local);

      return { success: true, report: reportDto };
    }
  },

  /**
   * Mengambil daftar laporan dengan server-side pagination & filter untuk Admin Dashboard.
   */
  async getReports(filters: {
    page?: number;
    limit?: number;
    status?: string;
    targetType?: string;
    reason?: string;
    search?: string;
  }): Promise<{
    reports: EnrichedReportItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(50, Math.max(5, Number(filters.limit) || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status && filters.status !== "ALL") {
      where.status = filters.status;
    }
    if (filters.targetType && filters.targetType !== "ALL") {
      where.targetType = filters.targetType;
    }
    if (filters.reason && filters.reason !== "ALL") {
      where.reason = filters.reason;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { details: { contains: q, mode: "insensitive" } },
        { reason: { contains: q, mode: "insensitive" } },
        { targetId: { contains: q } },
      ];
    }

    let reports: StoredCommunityReport[] = [];
    let total = 0;

    try {
      const [dbReports, dbCount] = await Promise.all([
        communityDb.communityReport.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        communityDb.communityReport.count({ where }),
      ]);

      total = dbCount;
      reports = dbReports.map((r) => ({
        id: r.id,
        reporterId: r.reporterId,
        targetType: r.targetType as ReportTargetType,
        targetId: r.targetId,
        postId: r.postId,
        reportedUserId: r.reportedUserId,
        reason: r.reason,
        details: r.details,
        status: r.status as ReportStatus,
        reviewedBy: r.reviewedBy,
        resolutionNote: r.resolutionNote,
        resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));
    } catch (err: any) {
      console.warn("[reportRepo] DB getReports fallback to local:", err?.message);
      let local = readLocalReports();
      if (filters.status && filters.status !== "ALL") {
        local = local.filter((r) => r.status === filters.status);
      }
      if (filters.targetType && filters.targetType !== "ALL") {
        local = local.filter((r) => r.targetType === filters.targetType);
      }
      if (filters.reason && filters.reason !== "ALL") {
        local = local.filter((r) => r.reason === filters.reason);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        local = local.filter(
          (r) =>
            (r.details && r.details.toLowerCase().includes(q)) ||
            r.reason.toLowerCase().includes(q) ||
            r.targetId.includes(q)
        );
      }
      total = local.length;
      reports = local.slice(skip, skip + limit);
    }

    // 4. Enrich dengan data pengguna & preview konten
    const enriched = await Promise.all(
      reports.map(async (rep) => {
        let reportedUser = null;
        let reporter = null;
        let contentPreview = null;

        // Fetch reported user info
        try {
          const u = await userRepository.findById(rep.reportedUserId);
          if (u) {
            reportedUser = {
              id: u.id,
              name: u.name,
              email: u.email,
              avatarUrl: u.avatarUrl,
              warningCount: u.warningCount || 0,
              isBanned: Boolean(u.isBanned),
              isSuspended: Boolean(u.isSuspended),
              suspendedUntil: u.suspendedUntil ?? null,
            };
          }
        } catch {}

        // Fetch reporter info
        try {
          const r = await userRepository.findById(rep.reporterId);
          if (r) {
            reporter = {
              id: r.id,
              name: r.name,
              email: r.email,
              avatarUrl: r.avatarUrl,
            };
          }
        } catch {}

        // Fetch content preview
        try {
          if (rep.targetType === "POST") {
            const post = await communityDb.communityPost.findUnique({
              where: { id: rep.targetId },
            });
            if (post) {
              contentPreview = {
                id: post.id,
                content: post.content || "(Tidak ada teks konten)",
                imageUrl: post.imageUrl,
                createdAt: post.createdAt.toISOString(),
                timeAgo: formatRelativeTime(post.createdAt),
                isHidden: Boolean(post.isHidden),
                postContext: null,
                parentCommentContext: null,
              };
            }
          } else {
            const comment = await communityDb.communityComment.findUnique({
              where: { id: rep.targetId },
              include: {
                post: true,
                parent: true,
              },
            });
            if (comment) {
              contentPreview = {
                id: comment.id,
                content: comment.content || "(Komentar kosong)",
                imageUrl: null,
                createdAt: comment.createdAt.toISOString(),
                timeAgo: formatRelativeTime(comment.createdAt),
                isHidden: Boolean(comment.isHidden),
                postContext: comment.post
                  ? {
                      id: comment.post.id,
                      content: comment.post.content || "",
                      authorName: "Post #" + comment.post.id.slice(-6),
                    }
                  : null,
                parentCommentContext: comment.parent
                  ? {
                      id: comment.parent.id,
                      content: comment.parent.content || "",
                    }
                  : null,
              };
            }
          }
        } catch {}

        return {
          ...rep,
          reportedUser,
          reporter,
          contentPreview,
        };
      })
    );

    return {
      reports: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  /**
   * Memperbarui status laporan (RESOLVED, DISMISSED, ACTION_TAKEN).
   */
  async updateReport(
    reportId: string,
    status: ReportStatus,
    adminId: string,
    resolutionNote?: string
  ): Promise<boolean> {
    const now = new Date();
    try {
      await communityDb.communityReport.update({
        where: { id: reportId },
        data: {
          status,
          reviewedBy: adminId,
          resolutionNote: resolutionNote?.trim() || null,
          resolvedAt: now,
        },
      });
      return true;
    } catch {
      const local = readLocalReports();
      const idx = local.findIndex((r) => r.id === reportId);
      if (idx !== -1) {
        local[idx].status = status;
        local[idx].reviewedBy = adminId;
        local[idx].resolutionNote = resolutionNote?.trim() || null;
        local[idx].resolvedAt = now.toISOString();
        local[idx].updatedAt = now.toISOString();
        writeLocalReports(local);
        return true;
      }
      return false;
    }
  },

  /**
   * Menyembunyikan konten yang melanggar tanpa merusak relasi komentar lain.
   */
  async hideContent(targetType: ReportTargetType, targetId: string): Promise<boolean> {
    try {
      if (targetType === "POST") {
        await communityDb.communityPost.update({
          where: { id: targetId },
          data: { isHidden: true },
        });
      } else {
        await communityDb.communityComment.update({
          where: { id: targetId },
          data: { isHidden: true },
        });
      }
      return true;
    } catch (err: any) {
      console.warn("[reportRepo] hideContent failed:", err?.message);
      return false;
    }
  },

  /**
   * Menghapus konten dari database.
   */
  async deleteContent(targetType: ReportTargetType, targetId: string): Promise<boolean> {
    try {
      if (targetType === "POST") {
        await communityDb.communityLike.deleteMany({ where: { postId: targetId } });
        await communityDb.communityComment.deleteMany({ where: { postId: targetId } });
        await communityDb.communityPost.delete({ where: { id: targetId } });
      } else {
        await communityDb.communityComment.delete({ where: { id: targetId } });
      }
      return true;
    } catch (err: any) {
      console.warn("[reportRepo] deleteContent failed:", err?.message);
      return false;
    }
  },
};
