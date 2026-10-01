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
const PLAN_PRICES: Record<string, { amount: number; label: string }> = {
  monthly: { amount: 49_000, label: "Zyba Plus - Langganan Bulanan" },
  yearly: { amount: 399_000, label: "Zyba Plus - Langganan Tahunan" },
  lifetime: { amount: 999_000, label: "Zyba Plus - Seumur Hidup" },
};

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

    // ── Parse plan dari body ────────────────────────────────────────────────
    let planId = "yearly";
    try {
      const body = await req.json();
      if (body?.plan && PLAN_PRICES[body.plan]) planId = body.plan;
    } catch {}

    const plan = PLAN_PRICES[planId];
    const userId = session.userId;

    // ── Buat Subscription (PENDING) ─────────────────────────────────────────
    const subscription = await accountDb.subscription.create({
      data: {
        userId,
        plan: "PLUS",
        status: "PENDING",
      },
    });

    // order_id Midtrans max 50 karakter
    // Format: zyba-{plan}-{sub6}-{ts36}
    // Contoh: zyba-yearly-fy8100-lq7k2a  (≤ 30 chars)
    const subShort = subscription.id.slice(-6);
    const tsBase36 = Date.now().toString(36);
    const orderId = `zyba-${planId}-${subShort}-${tsBase36}`;

    // ── Buat Payment record (PENDING) ────────────────────────────────────────
    await accountDb.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: plan.amount,
        orderId,
        status: "PENDING",
      },
    });

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
      return NextResponse.json(
        { error: "Payment gateway request failed" },
        { status: 500 }
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
