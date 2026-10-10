import fs from "fs";
import path from "path";
import { accountDb } from "@/backend/db/accountClient";
import { communityDb } from "@/backend/db/communityClient";
import { userRepository } from "@/backend/auth/userRepository";
import { invalidateCommunityCache } from "@/lib/communityCache";

export type AppealStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface BanAppealItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  banReason: string;
  appealReason: string;
  contactEmail?: string | null;
  status: AppealStatus;
  adminNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const APPEALS_FILE = path.join(DATA_DIR, "ban_appeals.json");

function readLocalAppeals(): BanAppealItem[] {
  try {
    if (!fs.existsSync(APPEALS_FILE)) return [];
    const content = fs.readFileSync(APPEALS_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeLocalAppeals(appeals: BanAppealItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(APPEALS_FILE, JSON.stringify(appeals, null, 2), "utf8");
  } catch (err) {
    console.warn("[appealRepository] write local fallback failed:", err);
  }
}

export const appealRepository = {
  /**
   * Membuat pengajuan banding baru oleh pengguna yang diblokir/dibatasi
   */
  async createAppeal(data: {
    userId: string;
    appealReason: string;
    contactEmail?: string;
  }): Promise<{ success: boolean; appeal?: BanAppealItem; error?: string }> {
    const user = await userRepository.findById(data.userId);
    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    if (!user.isBanned && !user.isSuspended) {
      return {
        success: false,
        error: "Akun Anda saat ini tidak dalam status diblokir atau dibatasi.",
      };
    }

    const appeals = readLocalAppeals();
    const existingPending = appeals.find(
      (a) => a.userId === data.userId && a.status === "PENDING"
    );

    if (existingPending) {
      return {
        success: false,
        error: "Anda sudah memiliki permohonan banding yang sedang menunggu peninjauan moderator.",
        appeal: existingPending,
      };
    }

    const newAppeal: BanAppealItem = {
      id: `appeal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      userName: user.name || "Pengguna ZYBA",
      userEmail: user.email,
      userAvatar: user.avatarUrl || "fox",
      banReason: user.banReason || "Pelanggaran pedoman komunitas ZYBA",
      appealReason: data.appealReason.trim(),
      contactEmail: data.contactEmail?.trim() || user.email,
      status: "PENDING",
      adminNote: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appeals.unshift(newAppeal);
    writeLocalAppeals(appeals);

    // Rekam juga di moderation log sebagai notifikasi appeal
    try {
      await accountDb.moderationLog.create({
        data: {
          adminId: user.id, // self-referenced
          targetUserId: user.id,
          action: "WARN", // generic action
          reason: `Pengajuan banding pembatasan akun: ${newAppeal.appealReason.slice(0, 100)}`,
          metadata: {
            type: "BAN_APPEAL_SUBMITTED",
            appealId: newAppeal.id,
            contactEmail: newAppeal.contactEmail,
          },
        },
      });
    } catch (e) {
      console.warn("[appealRepository] log write skipped:", e);
    }

    return { success: true, appeal: newAppeal };
  },

  /**
   * Mengambil banding aktif milik pengguna
   */
  async getLatestAppealForUser(userId: string): Promise<BanAppealItem | null> {
    const appeals = readLocalAppeals();
    return appeals.find((a) => a.userId === userId) || null;
  },

  /**
   * Mengambil daftar appeal untuk admin dengan filter dan pagination
   */
  async getAppeals(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    appeals: BanAppealItem[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
    counts: { pending: number; approved: number; rejected: number; total: number };
  }> {
    const { status = "ALL", search = "", page = 1, limit = 15 } = params;
    let list = readLocalAppeals();

    const counts = {
      pending: list.filter((a) => a.status === "PENDING").length,
      approved: list.filter((a) => a.status === "APPROVED").length,
      rejected: list.filter((a) => a.status === "REJECTED").length,
      total: list.length,
    };

    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.userName.toLowerCase().includes(q) ||
          a.userEmail.toLowerCase().includes(q) ||
          a.appealReason.toLowerCase().includes(q) ||
          a.banReason.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const skip = (page - 1) * limit;
    const paginated = list.slice(skip, skip + limit);

    return {
      appeals: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      counts,
    };
  },

  /**
   * Memproses tindakan peninjauan banding oleh admin (APPROVE atau REJECT)
   */
  async processAppeal(
    appealId: string,
    action: "APPROVE" | "REJECT",
    adminId: string,
    adminName: string,
    note = ""
  ): Promise<{ success: boolean; error?: string; appeal?: BanAppealItem }> {
    const appeals = readLocalAppeals();
    const idx = appeals.findIndex((a) => a.id === appealId);
    if (idx === -1) {
      return { success: false, error: "Data pengajuan banding tidak ditemukan." };
    }

    const appeal = appeals[idx];
    const nowIso = new Date().toISOString();

    if (action === "APPROVE") {
      // 1. Cabut pemblokiran user secara resmi
      await userRepository.liftRestrictions(
        appeal.userId,
        adminId,
        note.trim() || `Banding disetujui oleh moderator ${adminName}`
      );

      // 2. Pulihkan postingan dan komentar pengguna
      try {
        await communityDb.communityPost.updateMany({
          where: { userId: appeal.userId },
          data: { isHidden: false },
        });
        await communityDb.communityComment.updateMany({
          where: { userId: appeal.userId },
          data: { isHidden: false },
        });
      } catch (err) {
        console.warn("[processAppeal] unhide posts/comments:", err);
      }

      invalidateCommunityCache();

      appeal.status = "APPROVED";
      appeal.adminNote = note.trim() || "Permohonan banding diterima. Akun Anda telah dipulihkan.";
      appeal.reviewedBy = adminName;
      appeal.reviewedAt = nowIso;
      appeal.updatedAt = nowIso;
    } else {
      // REJECT
      appeal.status = "REJECTED";
      appeal.adminNote = note.trim() || "Permohonan banding ditolak setelah peninjauan oleh tim moderator.";
      appeal.reviewedBy = adminName;
      appeal.reviewedAt = nowIso;
      appeal.updatedAt = nowIso;

      // Catat di ModerationLog
      await userRepository.recordModerationLog({
        adminId,
        targetUserId: appeal.userId,
        action: "WARN",
        reason: `Banding unban ditolak: ${appeal.adminNote}`,
        metadata: { appealId: appeal.id, rejectedAppeal: true },
      });
    }

    appeals[idx] = appeal;
    writeLocalAppeals(appeals);

    return { success: true, appeal };
  },
};
