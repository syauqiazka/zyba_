"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const status = params.get("status");
  const orderId = params.get("order_id");
  const pending = status === "pending";

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-brown-900/10 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${pending ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"}`}>
            {pending ? "⏳" : "✓"}
          </div>
          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
            ZYBA Premium
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-brown-900">
            {pending ? "Pembayaran sedang diproses" : "Pembayaran berhasil"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-brown-700">
            {pending
              ? "Jangan khawatir. Tunggu konfirmasi dari payment gateway. Status akun akan mengikuti hasil webhook pembayaran."
              : "Pembayaranmu sudah diterima. Premium akan aktif setelah konfirmasi pembayaran selesai diproses."}
          </p>

          {orderId && (
            <div className="mt-5 rounded-2xl bg-cream p-3 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brown-700/50">
                Order ID
              </p>
              <p className="mt-1 break-all font-mono text-[11px] text-brown-900">{orderId}</p>
            </div>
          )}

          <div className="mt-6 grid gap-2">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
              Kembali ke Dashboard
            </Link>
            <Link
              href="/settings/billing"
              className="rounded-2xl border border-brown-900/10 bg-white px-4 py-3 text-sm font-semibold text-brown-900 hover:bg-cream"
            >
              Lihat Riwayat Pembayaran
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
