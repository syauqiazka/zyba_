import { communityDb } from "@/backend/db/communityClient";
import { accountDb } from "@/backend/db/accountClient";

export type ModerationNoticeType =
  | "ban"
  | "suspend"
  | "unban"
  | "appeal_rejected"
  | "warn";

export interface SendModerationNoticeParams {
  targetUserId: string;
  adminId?: string;
  adminName?: string;
  type: ModerationNoticeType;
  title?: string;
  message: string;
  reason?: string;
}

/**
 * Mengirim notifikasi komunitas dan pesan langsung (Direct Message) ke inbox pengguna
 * saat terjadi penindakan moderasi (Ban, Suspend, Unban, Banding).
 */
export async function sendModerationNotificationAndMessage(
  params: SendModerationNoticeParams
): Promise<{ success: boolean; notificationId?: string; messageId?: string }> {
  try {
    const { targetUserId, type, message } = params;
    if (!targetUserId) {
      return { success: false };
    }

    // 1. Tentukan actor/admin ID
    let effectiveAdminId = params.adminId;
    if (!effectiveAdminId) {
      try {
        const firstAdmin = await accountDb.user.findFirst({
          where: { role: "ADMIN" },
          select: { id: true },
        });
        if (firstAdmin) {
          effectiveAdminId = firstAdmin.id;
        }
      } catch (err) {
        console.warn("[sendModerationNotice] Gagal mencari admin user:", err);
      }
    }

    // Jika tetap tidak ada admin terdaftar, buat/gunakan ID moderasi sistem
    if (!effectiveAdminId) {
      effectiveAdminId = "zyba_system_moderation";
    }

    // 2. Cari atau buat Direct Conversation antara admin/moderator dan targetUser
    let conversationId: string | null = null;
    try {
      const existingParticipations = await communityDb.directParticipant.findMany({
        where: { userId: targetUserId },
        include: {
          conversation: {
            include: {
              participants: true,
            },
          },
        },
      });

      const matchedConv = existingParticipations.find((p) => {
        const parts = p.conversation.participants;
        return (
          parts.length === 2 &&
          parts.some((part) => part.userId === effectiveAdminId)
        );
      });

      if (matchedConv) {
        conversationId = matchedConv.conversationId;
      } else {
        const newConv = await communityDb.directConversation.create({
          data: {
            participants: {
              create: [
                { userId: effectiveAdminId },
                { userId: targetUserId },
              ],
            },
          },
        });
        conversationId = newConv.id;
      }
    } catch (convErr) {
      console.warn("[sendModerationNotice] Gagal membuat/mencari percakapan DM:", convErr);
    }

    // 3. Buat Direct Message resmi di inbox pengguna
    let createdMsgId: string | undefined;
    if (conversationId) {
      try {
        const msg = await communityDb.directMessage.create({
          data: {
            conversationId,
            senderId: effectiveAdminId,
            content: message.trim(),
          },
        });
        createdMsgId = msg.id;

        await communityDb.directConversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: new Date() },
        });
      } catch (msgErr) {
        console.warn("[sendModerationNotice] Gagal mengirim pesan DM:", msgErr);
      }
    }

    // 4. Buat notifikasi komunitas
    let createdNotifId: string | undefined;
    try {
      const notif = await communityDb.communityNotification.create({
        data: {
          recipientId: targetUserId,
          actorId: effectiveAdminId,
          type,
          conversationId: conversationId || undefined,
          readAt: null,
        },
      });
      createdNotifId = notif.id;
    } catch (notifErr) {
      console.warn("[sendModerationNotice] Gagal membuat notifikasi komunitas:", notifErr);
    }

    return {
      success: true,
      notificationId: createdNotifId,
      messageId: createdMsgId,
    };
  } catch (err: any) {
    console.error("[sendModerationNotificationAndMessage] Error:", err);
    return { success: false };
  }
}
