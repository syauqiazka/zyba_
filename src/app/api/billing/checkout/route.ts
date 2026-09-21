import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { accountDb } from "@/backend/db/accountClient";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

// Harga Zyba Plus per bulan (Rupiah)
const PLUS_MONTHLY_PRICE = 49000;

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const userId = session.userId;

    // 1. Buat record Subscription (status PENDING)
    const subscription = await accountDb.subscription.create({
      data: {
        userId,
        plan: "PLUS",
        status: "PENDING",
      },
    });

    // 2. Buat record Payment (status PENDING)
    const orderId = `zyba-plus-${subscription.id}-${Date.now()}`;
    const payment = await accountDb.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: PLUS_MONTHLY_PRICE,
        orderId,
        status: "PENDING",
      },
    });

    // 3. Request Snap Token dari Midtrans
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: PLUS_MONTHLY_PRICE,
      },
      customer_details: {
        email: session.email,
        first_name: session.name,
      },
      item_details: [
        {
          id: "zyba-plus-monthly",
          price: PLUS_MONTHLY_PRICE,
          quantity: 1,
          name: "Zyba Plus - Langganan Bulanan",
        },
      ],
    };

    const midtransResponse = await fetch(MIDTRANS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify(midtransPayload),
    });

    if (!midtransResponse.ok) {
      const errorText = await midtransResponse.text();
      console.error("[Checkout] Midtrans API error:", errorText);
      return NextResponse.json({ error: "Payment gateway request failed" }, { status: 500 });
    }

    const midtransData = await midtransResponse.json();

    return NextResponse.json({
      snapToken: midtransData.token,
      orderId,
      amount: PLUS_MONTHLY_PRICE,
    });
  } catch (err: any) {
    console.error("[Checkout] Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
