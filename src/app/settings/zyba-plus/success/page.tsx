"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-brown-900/10 shadow-lg text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-2xl font-extrabold text-brown-900 mb-2">
          {status === "pending" ? "Pembayaran Diproses" : "Selamat!"}
        </h1>
        
        {status === "pending" ? (
          <>
            <p className="text-brown-700 mb-6">
              Pembayaran Anda sedang diproses. Kami akan memberitahu Anda segera setelah pembayaran dikonfirmasi.
            </p>
            <p className="text-sm text-brown-600 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-brown-700 mb-2">
              Paket <span className="font-bold text-orange-500">Zyba Plus</span> Anda sudah aktif!
            </p>
            <p className="text-sm text-brown-600 mb-6">
              Nikmati fitur unlimited AI, rekomendasi personal, dan insight mendalam selama 30 hari ke depan.
            </p>
          </>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors"
          >
            Kembali ke Dashboard
          </Link>
          <Link
            href="/settings/billing"
            className="block w-full py-3 bg-white hover:bg-brown-900/5 text-brown-900 font-semibold rounded-full border border-brown-900/10 transition-colors"
          >
            Lihat Riwayat Pembayaran
          </Link>
        </div>
      </div>
    </div>
  );
}
