"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, RefreshCw, X } from "lucide-react";

type Payment = {
  id: string;
  amount: number;
  orderId: string;
  status: string;
  proofUrl?: string | null;
  senderName?: string | null;
  submittedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  user?: { name: string; email: string; avatarUrl?: string | null } | null;
  subscription: { status: string; startDate?: string | null; endDate?: string | null };
};

const money = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v).replace("IDR", "Rp");

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/payments?status=PENDING", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403) throw new Error("Akun ini tidak memiliki akses admin.");
      if (!res.ok) throw new Error(data.error || "Gagal mengambil pembayaran.");
      setPayments(data.payments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const action = async (paymentId: string, type: "APPROVE" | "REJECT") => {
    if (type === "REJECT" && !reason.trim()) {
      setError("Isi alasan penolakan terlebih dahulu.");
      return;
    }

    setProcessing(paymentId);
    setError("");
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action: type, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal memproses pembayaran.");
      setSelected(null);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses pembayaran.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-600">ZYBA Admin</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-brown-900">Pembayaran Premium</h1>
            <p className="mt-2 text-sm text-brown-700">Verifikasi transfer manual Rp49.000 sebelum Premium diaktifkan.</p>
          </div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brown-900/10 bg-white px-4 py-2.5 text-xs font-bold text-brown-900">
            <RefreshCw size={15} /> Segarkan
          </button>
        </div>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <section className="mt-6 rounded-3xl border border-brown-900/10 bg-white p-4 sm:p-6">
          {loading ? (
            <p className="py-10 text-center text-sm text-brown-700/60">Memuat pembayaran...</p>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center">
              <Check className="mx-auto text-green-600" size={36} />
              <p className="mt-3 font-display text-lg font-extrabold text-brown-900">Tidak ada pembayaran menunggu</p>
              <p className="mt-1 text-xs text-brown-700/60">Semua pembayaran manual sudah diproses.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <article key={payment.id} className="rounded-2xl border border-brown-900/10 bg-cream/50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-bold text-brown-900">{payment.user?.name || "Pengguna ZYBA"}</p>
                      <p className="mt-0.5 truncate text-xs text-brown-700">{payment.user?.email || "Email tidak tersedia"}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-brown-700/70">
                        <span>{money(payment.amount)}</span>
                        <span>Pengirim: {payment.senderName || "Belum ada"}</span>
                        <span>{payment.submittedAt ? new Date(payment.submittedAt).toLocaleString("id-ID") : "Belum dikirim"}</span>
                      </div>
                    </div>
                    <button onClick={() => { setSelected(payment); setReason(""); }} className="shrink-0 rounded-2xl bg-brown-900 px-4 py-2.5 text-xs font-extrabold text-white">
                      Periksa pembayaran
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-brown-900/60 p-0 sm:items-center sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">Verifikasi pembayaran</p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-brown-900">{selected.user?.name || "Pengguna ZYBA"}</h2>
                <p className="text-xs text-brown-700">{selected.user?.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-xl p-2 hover:bg-cream"><X size={18} /></button>
            </div>

            {selected.proofUrl ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-brown-900/10 bg-cream">
                <img src={selected.proofUrl} alt="Bukti pembayaran" className="mx-auto max-h-[55vh] w-full object-contain" />
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Bukti pembayaran belum tersedia.</div>
            )}

            <div className="mt-4 grid gap-2 rounded-2xl bg-cream p-4 text-xs text-brown-700 sm:grid-cols-2">
              <p><b>Nominal:</b> {money(selected.amount)}</p>
              <p><b>Pengirim:</b> {selected.senderName || "-"}</p>
              <p><b>Order:</b> {selected.orderId}</p>
              <p><b>Dikirim:</b> {selected.submittedAt ? new Date(selected.submittedAt).toLocaleString("id-ID") : "-"}</p>
            </div>

            <label className="mt-5 block text-xs font-bold text-brown-700">Alasan jika ditolak</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: nominal tidak sesuai atau bukti tidak terbaca." rows={3} className="mt-2 w-full rounded-2xl border border-brown-900/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500" />

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button disabled={processing === selected.id} onClick={() => action(selected.id, "REJECT")} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 disabled:opacity-50">Tolak pembayaran</button>
              <button disabled={processing === selected.id || !selected.proofUrl} onClick={() => action(selected.id, "APPROVE")} className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50">Terima & aktifkan Premium</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
