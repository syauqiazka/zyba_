import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import crypto from "crypto";
import { invalidateUserPlanCache } from "@/backend/billing/entitlements";
import { invalidateUserMeCache } from "@/lib/server/userMeCache";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
    } = body;

    if (!MIDTRANS_SERVER_KEY) {
      console.error("[Webhook] MIDTRANS_SERVER_KEY not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Verifikasi signature
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.warn("[Webhook] Invalid signature:", { order_id, signature_key });
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    console.log("[Webhook] Valid signature for order:", order_id, "status:", transaction_status);

    // 2. Cari Payment record berdasarkan orderId
    const payment = await accountDb.payment.findUnique({
      where: { orderId: order_id },
      include: { subscription: true },
    });

    if (!payment) {
      console.warn("[Webhook] Payment not found:", order_id);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Pastikan nominal webhook sama dengan nominal Payment yang dibuat server.
    const webhookAmount = Number(gross_amount);
    if (!Number.isFinite(webhookAmount) || webhookAmount !== payment.amount) {
      console.warn("[Webhook] Amount mismatch:", {
        order_id,
        webhookAmount,
        expectedAmount: payment.amount,
      });
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // 3. Idempotency check — jangan proses ulang kalau sudah SUCCESS
    if (payment.status === "SUCCESS") {
      console.log("[Webhook] Payment already processed as SUCCESS:", order_id);
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // 4. Tentukan status berdasarkan transaction_status + fraud_status
    let newPaymentStatus: "SUCCESS" | "FAILED" | "PENDING" | "EXPIRED" | "CANCELLED" = "PENDING";
    let subscriptionStatus: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING" = "PENDING";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        newPaymentStatus = "SUCCESS";
        subscriptionStatus = "ACTIVE";
      }
    } else if (transaction_status === "settlement") {
      newPaymentStatus = "SUCCESS";
      subscriptionStatus = "ACTIVE";
    } else if (transaction_status === "deny" || transaction_status === "cancel") {
      newPaymentStatus = "FAILED";
      subscriptionStatus = "CANCELLED";
    } else if (transaction_status === "expire") {
      newPaymentStatus = "EXPIRED";
      subscriptionStatus = "EXPIRED";
    }

    // 5. Claim payment + entitlement dalam satu transaction.
    // Guard status mencegah dua webhook sukses mengaktifkan entitlement bersamaan
    // dan mencegah webhook lama menurunkan status SUCCESS.
    const result = await accountDb.$transaction(async (tx) => {
      const claimed = await tx.payment.updateMany({
        where: {
          id: payment.id,
          status: { not: "SUCCESS" },
        },
        data: {
          rawPayload: body,
          transactionId: transaction_id || payment.transactionId,
          paymentMethod: payment_type || payment.paymentMethod,
          status: newPaymentStatus,
        },
      });

      if (claimed.count !== 1) {
        return { alreadyProcessed: true, activated: false };
      }

      if (newPaymentStatus === "SUCCESS" && subscriptionStatus === "ACTIVE") {
        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 30);

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

        return { alreadyProcessed: false, activated: true };
      }

      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: subscriptionStatus },
      });

      return { alreadyProcessed: false, activated: false };
    });

    if (result.alreadyProcessed) {
      console.log("[Webhook] Payment already processed concurrently:", order_id);
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    if (result.activated) {
      invalidateUserPlanCache(payment.userId);
      invalidateUserMeCache(payment.userId);
      console.log("[Webhook] Subscription activated for user:", payment.userId);
    } else if (subscriptionStatus === "CANCELLED" || subscriptionStatus === "EXPIRED") {
      const downgrade = await accountDb.user.updateMany({
        where: {
          id: payment.userId,
          plan: "PLUS",
          subscriptions: {
            none: {
              status: "ACTIVE",
              endDate: { gt: new Date() },
            },
          },
        },
        data: { plan: "FREE" },
      });

      if (downgrade.count === 1) {
        invalidateUserPlanCache(payment.userId);
        invalidateUserMeCache(payment.userId);
      }
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}