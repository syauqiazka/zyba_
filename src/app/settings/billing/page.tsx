"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Receipt, RefreshCw } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
  orderId: string;
}

const statusLabel: Record<string, string> = {
  SUCCESS: "Berhasil",
  PENDING: "Menunggu",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

export default function BillingHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/billing/history", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat");
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10 pb-28 md:pb-12">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-brown-700/60 hover:text-brown-900"
            >
              <ArrowLeft size={14} /> Kembali
            </button>
            <h1 className="font-display text-2xl font-extrabold text-brown-900 sm:text-3xl">
              Riwayat Pembayaran
            </h1>
            <p className="mt-1 text-xs leading-5 text-brown-700 sm:text-sm">
              Semua transaksi ZYBA Premium yang terkait dengan akunmu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/settings/zyba-plus")}
            className="rounded-2xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
          >
            Upgrade Premium
          </button>
        </header>

        <section className="mt-6 overflow-hidden rounded-3xl border border-brown-900/10 bg-white">
          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl bg-cream" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-brown-700">Riwayat pembayaran gagal dimuat.</p>
              <button
                type="button"
                onClick={load}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brown-900 px-4 py-2 text-xs font-bold text-white"
              >
                <RefreshCw size={13} /> Coba lagi
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-10 text-center">
              <Receipt className="mx-auto text-brown-700/30" size={30} />
              <p className="mt-3 text-sm font-bold text-brown-900">Belum ada transaksi</p>
              <p className="mt-1 text-xs text-brown-700/60">Upgrade saat kamu siap.</p>
            </div>
          ) : (
            <div className="divide-y divide-brown-900/10">
              {payments.map((payment) => (
                <article key={payment.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-bold text-brown-900">
                          Zyba Premium
                        </h2>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${payment.status === "SUCCESS" ? "bg-green-100 text-green-700" : payment.status === "PENDING" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                          {statusLabel[payment.status] || payment.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-brown-700">{formatDate(payment.createdAt)}</p>
                      <p className="mt-1 break-all font-mono text-[10px] text-brown-700/50">
                        {payment.orderId}
                      </p>
                      {payment.paymentMethod && (
                        <p className="mt-1 text-[10px] text-brown-700/60">
                          Metode: {payment.paymentMethod}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-lg font-extrabold text-brown-900">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
