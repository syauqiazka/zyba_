import { NextRequest, NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import crypto from "crypto";

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

    // 3. Idempotency check — jangan proses ulang kalau sudah SUCCESS
    if (payment.status === "SUCCESS") {
      console.log("[Webhook] Payment already processed as SUCCESS:", order_id);
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // 4. Update Payment rawPayload untuk audit
    await accountDb.payment.update({
      where: { id: payment.id },
      data: {
        rawPayload: body,
        transactionId: transaction_id || payment.transactionId,
        paymentMethod: payment_type || payment.paymentMethod,
        updatedAt: new Date(),
      },
    });

    // 5. Tentukan status berdasarkan transaction_status + fraud_status
    let newPaymentStatus: "SUCCESS" | "FAILED" | "PENDING" | "EXPIRED" | "CANCELLED" = "PENDING";
    let subscriptionStatus: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING" = "PENDING";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        newPaymentStatus = "SUCCESS";
        subscriptionStatus = "ACTIVE";
      } else {
        newPaymentStatus = "PENDING";
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
    } else if (transaction_status === "pending") {
      newPaymentStatus = "PENDING";
    }

    // 6. Update Payment status
    await accountDb.payment.update({
      where: { id: payment.id },
      data: { status: newPaymentStatus },
    });

    // 7. Kalau SUCCESS → aktifkan subscription + upgrade user plan
    if (newPaymentStatus === "SUCCESS" && subscriptionStatus === "ACTIVE") {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 30); // 30 hari dari sekarang

      await accountDb.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
          status: "ACTIVE",
          startDate: now,
          endDate,
        },
      });

      await accountDb.user.update({
        where: { id: payment.userId },
        data: { plan: "PLUS" },
      });

      console.log("[Webhook] Subscription activated for user:", payment.userId);
    } else {
      // Update subscription status kalau bukan ACTIVE
      await accountDb.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: subscriptionStatus },
      });
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
