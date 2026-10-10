"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Receipt,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Crown,
} from "lucide-react";

/* ─────────────────────────────────────────────── */
/* TYPES                                           */
/* ─────────────────────────────────────────────── */

interface SubscriptionInfo {
  id?: string;
  plan?: "FREE" | "PLUS";
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface PaymentHistoryItem {
  id: string;
  amount: number;
  provider: string;
  orderId: string;
  paymentMethod: string | null;
  status: string;
  createdAt: string;
}

interface Props {
  plan: "FREE" | "PLUS";
  subscription?: SubscriptionInfo | null;
  premiumUntil?: string | null;
}

/* ─────────────────────────────────────────────── */
/* HELPERS                                         */
/* ─────────────────────────────────────────────── */

function formatRupiah(val: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(val)
    .replace("IDR", "Rp");
}

function formatDateTime(val: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(val));
}

function formatDate(val: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(val));
}

function calcDaysLeft(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ─────────────────────────────────────────────── */
/* PAYMENT HISTORY ROW                            */
/* ─────────────────────────────────────────────── */

function PaymentRow({ p }: { p: PaymentHistoryItem }) {
  const isSuccess = p.status === "SUCCESS";
  const isPending = p.status === "PENDING";
  const statusLabel = isSuccess ? "Berhasil" : isPending ? "Menunggu" : "Gagal";
  const statusCls = isSuccess
    ? "bg-green-100 text-green-700"
    : isPending
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-700";

  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-brown-900/8 hover:border-brown-900/15 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-brown-900 truncate max-w-[160px]">
            {p.orderId}
          </span>
          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${statusCls}`}>
            {statusLabel}
          </span>
        </div>
        <div className="text-[11px] text-brown-700/70 mt-0.5 flex items-center gap-1.5 flex-wrap">
          <span>{formatDateTime(p.createdAt)}</span>
          {p.paymentMethod && (
            <>
              <span>·</span>
              <span className="uppercase font-semibold">{p.paymentMethod}</span>
            </>
          )}
        </div>
      </div>
      <span className="shrink-0 text-sm font-extrabold text-brown-900">
        {formatRupiah(p.amount)}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* HISTORY ACCORDION BODY                          */
/* ─────────────────────────────────────────────── */

function HistoryAccordion({
  borderColor,
  hoverBg,
}: {
  borderColor: string;
  hoverBg: string;
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadHistory = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/history", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPayments(Array.isArray(data.payments) ? data.payments : []);
      }
    } catch {
      // Sengaja diabaikan — bukan data kritis
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [loading]);

  useEffect(() => {
    if (showHistory && !loaded) void loadHistory();
  }, [showHistory, loaded, loadHistory]);

  return (
    <div className={`border-t ${borderColor}`}>
      <button
        type="button"
        onClick={() => setShowHistory((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-5 sm:px-6 py-3.5 text-xs font-bold text-brown-700 hover:text-brown-900 ${hoverBg} transition-colors cursor-pointer`}
      >
        <span className="flex items-center gap-1.5">
          <Receipt size={13} className="text-orange-500" />
          Riwayat Pembayaran
        </span>
        {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showHistory && (
        <div className="px-5 sm:px-6 pb-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-brown-700/60">
              {loading ? "Memuat..." : `${payments.length} transaksi`}
            </span>
            <button
              type="button"
              onClick={() => { setLoaded(false); void loadHistory(); }}
              disabled={loading}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brown-700/70 hover:text-brown-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              Perbarui
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <RefreshCw size={20} className="animate-spin mx-auto text-orange-500 mb-2" />
              <p className="text-xs text-brown-700/60">Memuat riwayat transaksi...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brown-900/15 py-7 text-center">
              <Receipt size={22} className="mx-auto text-brown-700/30 mb-2" />
              <p className="text-xs font-bold text-brown-900">Belum ada transaksi</p>
              <p className="text-[11px] text-brown-700/60 mt-0.5">
                Pembayaran paket akan otomatis tercatat di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
              {payments.map((p) => <PaymentRow key={p.id} p={p} />)}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-brown-900/8">
            <span className="text-[11px] text-brown-700/60">
              Butuh invoice atau bukti bayar?
            </span>
            <Link
              href="/settings/billing"
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
            >
              Halaman Billing →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* MAIN WIDGET                                     */
/* ─────────────────────────────────────────────── */

export default function PremiumStatusWidget({ plan, subscription, premiumUntil }: Props) {
  const isPlus = plan === "PLUS";
  const endDate = subscription?.endDate || premiumUntil;
  const daysLeft = calcDaysLeft(endDate);
  const formattedEnd = endDate ? formatDate(endDate) : null;

  /* ── PLUS ── */
  if (isPlus) {
    return (
      <div className="rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-50/90 via-white to-orange-50/40 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-green-500/15">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm shrink-0">
              <Crown size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles size={9} />
                  Zyba Plus
                </span>
                <span className="text-[11px] font-bold text-green-700">
                  {daysLeft !== null ? `${daysLeft} hari tersisa` : "Aktif"}
                </span>
              </div>
              <p className="text-xs text-brown-700/80 mt-0.5">
                {formattedEnd
                  ? `Aktif hingga ${formattedEnd}`
                  : "Semua fitur premium aktif"}
              </p>
            </div>
          </div>

          <Link
            href="/settings/zyba-plus"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream border border-green-500/25 text-xs font-bold text-brown-900 transition-colors whitespace-nowrap shadow-2xs"
          >
            Perpanjang
          </Link>
        </div>

        {/* Feature chips */}
        <div className="px-5 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            "💬 60 Chat AI/hari",
            "🧠 Wellness Memory",
            "📊 Pattern Detection",
          ].map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/70 border border-green-500/15"
            >
              <CheckCircle2 size={13} className="text-green-500 shrink-0" />
              <span className="text-[11px] font-semibold text-brown-800">{label}</span>
            </div>
          ))}
        </div>

        {/* Riwayat accordion */}
        <HistoryAccordion
          borderColor="border-green-500/15"
          hoverBg="hover:bg-green-50/50"
        />
      </div>
    );
  }

  /* ── FREE ── */
  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-300/40 bg-gradient-to-br from-[#fff7ed] via-white to-[#f5f0ff] shadow-sm">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-purple-200/20 blur-xl" />

      {/* Main content */}
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between p-5 sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
              <Zap size={9} />
              Zyba Free
            </span>
            <span className="text-[10px] font-bold text-brown-700/50">
              Upgrade untuk pengalaman lebih personal
            </span>
          </div>

          <h2 className="font-display text-xl font-extrabold tracking-tight text-brown-900 sm:text-2xl">
            Buka akses Zyba Plus
          </h2>
          <p className="mt-1 max-w-xl text-xs leading-5 text-brown-700 sm:text-sm">
            Dapatkan 60 chat AI/hari, Wellness Memory, Pattern Detection, dan rencana personal 7 hari.
          </p>

          <div className="mt-3.5 flex flex-wrap gap-2">
            {["60 AI chat/hari", "Wellness Memory", "Pattern Detection", "Personalized Plan"].map(
              (f) => (
                <span
                  key={f}
                  className="rounded-full border border-brown-900/10 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-brown-700"
                >
                  ✓ {f}
                </span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-1.5 shrink-0">
          <Link
            href="/settings/zyba-plus"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-orange-500/20 transition-all whitespace-nowrap"
          >
            <Sparkles size={14} />
            Upgrade Sekarang
            <ArrowRight size={14} />
          </Link>
          <span className="text-[10px] text-brown-700/50">Mulai dari Rp49.000/bln</span>
        </div>
      </div>

      {/* Riwayat pembayaran accordion */}
      <HistoryAccordion
        borderColor="border-orange-300/25"
        hoverBg="hover:bg-orange-50/30"
      />
    </div>
  );
}
