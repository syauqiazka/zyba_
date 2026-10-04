"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Copy, ImagePlus, ShieldCheck, Upload, XCircle } from "lucide-react";

const PRICE = 49_000;

const bankName = process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME || "Bank belum dikonfigurasi";
const bankAccount = process.env.NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT || "";
const bankHolder = process.env.NEXT_PUBLIC_PAYMENT_BANK_HOLDER || "ZYBA";
const qrisUrl = process.env.NEXT_PUBLIC_PAYMENT_QRIS_URL || "";

type Payment = {
  id: string;
  amount: number;
  orderId: string;
  status: string;
  proofUrl?: string | null;
  senderName?: string | null;
  rejectionReason?: string | null;
  submittedAt?: string | null;
  paidAt?: string | null;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(value).replace("IDR", "Rp");

export default function ManualPaymentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [senderName, setSenderName] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canSubmit = Boolean(paymentId && senderName.trim() && proofUrl && !submitting);

  const load = async () => {
    if (!paymentId) {
      setError("Pembayaran tidak ditemukan.");
      return;
    }
    const res = await fetch(`/api/billing/manual?payment_id=${encodeURIComponent(paymentId)}`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Gagal mengambil data pembayaran.");
      return;
    }
    setPayment(data.payment);
    setSenderName(data.payment.senderName || "");
    setProofUrl(data.payment.proofUrl || "");
  };

  useEffect(() => { load(); }, [paymentId]);

  const statusText = useMemo(() => {
    if (!payment) return "";
    if (payment.status === "SUCCESS") return "Pembayaran diterima";
    if (payment.status === "REJECTED") return "Pembayaran ditolak";
    if (payment.status === "PENDING" && payment.submittedAt) return "Menunggu verifikasi admin";
    return "Menunggu bukti pembayaran";
  }, [payment]);

  const copyAccount = async () => {
    if (!bankAccount) return;
    await navigator.clipboard.writeText(bankAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleUpload = async (file: File) => {
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Bukti harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran bukti maksimal 5MB.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/billing/manual/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload bukti gagal.");
      setProofUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload bukti gagal.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!paymentId || !canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/billing/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, proofUrl, senderName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal mengirim bukti pembayaran.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim bukti pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  if (payment?.status === "SUCCESS") {
    return (
      <main className="min-h-screen bg-cream px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-green-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <CheckCircle2 className="mx-auto text-green-600" size={52} />
          <h1 className="mt-4 font-display text-2xl font-extrabold text-brown-900">Premium sudah aktif</h1>
          <p className="mt-2 text-sm leading-6 text-brown-700">Pembayaran kamu sudah diverifikasi. Nikmati ZYBA Premium.</p>
          <button onClick={() => router.push("/settings/zyba-plus")} className="mt-6 rounded-2xl bg-brown-900 px-5 py-3 text-sm font-bold text-white">Kembali ke ZYBA Premium</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <button onClick={() => router.push("/settings/zyba-plus")} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-brown-700 hover:text-brown-900">
          <ArrowLeft size={16} /> Kembali
        </button>

        <header>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-600">Pembayaran Manual</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-brown-900">Aktifkan ZYBA Premium</h1>
          <p className="mt-2 text-sm text-brown-700">Transfer {formatPrice(PRICE)} lalu kirim bukti pembayaran. Premium aktif setelah admin memverifikasi.</p>
        </header>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-brown-900">1. Transfer pembayaran</h2>
            <div className="mt-4 rounded-2xl bg-cream p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60">Total</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-brown-900">{formatPrice(PRICE)}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-brown-900/10 p-4">
              <p className="text-xs font-bold text-brown-700">{bankName}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="break-all font-display text-xl font-extrabold text-brown-900">{bankAccount || "Belum dikonfigurasi"}</p>
                <button onClick={copyAccount} disabled={!bankAccount} className="shrink-0 rounded-xl border border-brown-900/10 p-2 disabled:opacity-30" aria-label="Salin nomor rekening"><Copy size={16} /></button>
              </div>
              <p className="mt-1 text-xs text-brown-700">a.n. {bankHolder}</p>
              {copied && <p className="mt-2 text-[11px] font-bold text-green-700">Nomor rekening disalin.</p>}
            </div>

            {qrisUrl && (
              <div className="mt-4 rounded-2xl border border-brown-900/10 p-4 text-center">
                <p className="text-xs font-bold text-brown-700">Atau bayar dengan QRIS</p>
                <img src={qrisUrl} alt="QRIS ZYBA" className="mx-auto mt-3 max-h-64 w-auto rounded-xl" />
              </div>
            )}

            <div className="mt-4 flex gap-3 rounded-2xl bg-green-50 p-4">
              <ShieldCheck className="shrink-0 text-green-700" size={18} />
              <p className="text-[11px] leading-5 text-brown-700">Pastikan nominal tepat {formatPrice(PRICE)} agar pembayaran mudah diverifikasi.</p>
            </div>
          </section>

          <section className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-brown-900">2. Kirim bukti</h2>
            <label className="mt-4 block text-xs font-bold text-brown-700">Nama pengirim</label>
            <input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Nama sesuai rekening/e-wallet" className="mt-2 w-full rounded-2xl border border-brown-900/10 bg-cream px-4 py-3 text-sm outline-none focus:border-orange-500" />

            <label className="mt-4 block text-xs font-bold text-brown-700">Bukti pembayaran</label>
            <label className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brown-900/15 bg-cream/60 p-4 text-center hover:border-orange-400">
              {proofUrl ? (
                <div className="w-full">
                  <img src={proofUrl} alt="Bukti pembayaran" className="mx-auto max-h-52 rounded-xl object-contain" />
                  <p className="mt-2 text-[11px] font-bold text-orange-600">Ganti bukti</p>
                </div>
              ) : (
                <>
                  <ImagePlus className="text-brown-700/50" size={30} />
                  <p className="mt-2 text-xs font-bold text-brown-900">Pilih screenshot bukti transfer</p>
                  <p className="mt-1 text-[10px] text-brown-700/60">JPG, PNG, WebP — maksimal 5MB</p>
                </>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={uploading} />
            </label>

            {uploading && <p className="mt-2 text-xs text-brown-700">Mengunggah bukti...</p>}

            {payment?.status === "REJECTED" && (
              <div className="mt-4 rounded-2xl bg-red-50 p-4">
                <div className="flex gap-2">
                  <XCircle className="shrink-0 text-red-600" size={18} />
                  <div>
                    <p className="text-xs font-extrabold text-red-700">Pembayaran ditolak</p>
                    <p className="mt-1 text-[11px] leading-5 text-red-700/80">{payment.rejectionReason || "Silakan kirim bukti yang benar."}</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={submit} disabled={!canSubmit || uploading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3.5 text-sm font-extrabold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50">
              <Upload size={17} /> {submitting ? "Mengirim..." : payment?.status === "REJECTED" ? "Kirim Ulang Bukti" : "Kirim untuk Verifikasi"}
            </button>

            <p className="mt-3 text-center text-[10px] leading-4 text-brown-700/50">Status: {statusText}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
