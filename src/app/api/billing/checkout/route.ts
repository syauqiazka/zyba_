import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const MIDTRANS_SNAP_API = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const MIDTRANS_SNAP_JS = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

// ── Harga plan (Rupiah) ──────────────────────────────────────────────────────
const PLAN_PRICES = {
  monthly: { amount: 49_000, label: "Zyba Plus - Langganan Bulanan" },
} as const;

export async function POST(req: NextRequest) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!MIDTRANS_SERVER_KEY) {
      console.error("[Checkout] MIDTRANS_SERVER_KEY not set");
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    // ── Premium saat ini hanya tersedia bulanan ──────────────────────────────
    let body: { plan?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
    }

    if (body.plan !== "monthly") {
      return NextResponse.json(
        { error: "Plan Premium yang tersedia hanya bulanan." },
        { status: 400 }
      );
    }

    const planId = "monthly";
    const plan = PLAN_PRICES[planId];
    const userId = session.userId;

    // Serialisasi checkout per user di PostgreSQL. Tanpa lock ini, dua request
    // yang datang hampir bersamaan bisa sama-sama lolos pengecekan PENDING
    // sebelum salah satunya sempat membuat subscription.
    const now = new Date();
    const pendingCutoff = new Date(now.getTime() - 15 * 60 * 1000);

    const checkout = await accountDb.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;

      const activeSubscription = await tx.subscription.findFirst({
        where: {
          userId,
          plan: "PLUS",
          status: "ACTIVE",
          endDate: { gt: now },
        },
        select: { id: true, endDate: true },
      });

      if (activeSubscription) {
        return { activeSubscription, recentPending: null, subscription: null };
      }

      const recentPending = await tx.subscription.findFirst({
        where: {
          userId,
          plan: "PLUS",
          status: "PENDING",
          createdAt: { gt: pendingCutoff },
        },
        select: { id: true },
      });

      if (recentPending) {
        return { activeSubscription: null, recentPending, subscription: null };
      }

      const subscription = await tx.subscription.create({
        data: {
          userId,
          plan: "PLUS",
          status: "PENDING",
        },
      });

      // order_id Midtrans max 50 karakter
      // Format: zyba-{plan}-{sub6}-{ts36}
      const subShort = subscription.id.slice(-6);
      const tsBase36 = Date.now().toString(36);
      const orderId = `zyba-${planId}-${subShort}-${tsBase36}`;

      await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          userId,
          amount: plan.amount,
          orderId,
          status: "PENDING",
        },
      });

      return { activeSubscription: null, recentPending: null, subscription: { id: subscription.id, orderId } };
    });

    if (checkout.activeSubscription) {
      return NextResponse.json(
        {
          error: "Akun kamu sudah memiliki Zyba Premium aktif.",
          endDate: checkout.activeSubscription.endDate,
        },
        { status: 409 }
      );
    }

    if (checkout.recentPending) {
      return NextResponse.json(
        { error: "Checkout Premium sedang diproses. Tunggu beberapa menit sebelum mencoba lagi." },
        { status: 409 }
      );
    }

    const subscription = checkout.subscription!;
    const orderId = subscription.orderId;

    // ── Request Snap Token dari Midtrans ─────────────────────────────────────
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: plan.amount,
      },
      customer_details: {
        email: session.email,
        first_name: session.name || "Pengguna ZYBA",
      },
      item_details: [
        {
          id: `zyba-plus-${planId}`,
          price: plan.amount,
          quantity: 1,
          name: plan.label,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/zyba-plus/success?order_id=${orderId}`,
      },
    };

    const midtransRes = await fetch(MIDTRANS_SNAP_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify(midtransPayload),
    });

    if (!midtransRes.ok) {
      const errorText = await midtransRes.text();
      console.error("[Checkout] Midtrans API error:", errorText);

      await accountDb.$transaction([
        accountDb.payment.update({
          where: { orderId },
          data: { status: "FAILED", rawPayload: { error: errorText.slice(0, 1000) } },
        }),
        accountDb.subscription.update({
          where: { id: subscription.id },
          data: { status: "CANCELLED" },
        }),
      ]);

      return NextResponse.json(
        { error: "Payment gateway request failed" },
        { status: 502 }
      );
    }

    const midtransData = await midtransRes.json();

    return NextResponse.json({
      snapToken: midtransData.token,
      orderId,
      amount: plan.amount,
      snapUrl: MIDTRANS_SNAP_JS,
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    });
  } catch (err: any) {
    console.error("[Checkout] Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
