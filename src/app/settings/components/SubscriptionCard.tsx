"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Receipt, ArrowRight, Clock, ShieldCheck, Zap, RefreshCw, X, CheckCircle2 } from "lucide-react";

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
  plan?: "FREE" | "PLUS";
  subscription?: SubscriptionInfo | null;
  premiumUntil?: string | null;
  onRefresh?: () => void;
}

export default function SubscriptionCard({
  plan = "FREE",
  subscription,
  premiumUntil,
  onRefresh,
}: Props) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const isPlus = plan === "PLUS";
  const targetDate = subscription?.endDate || premiumUntil;

  const daysLeft = (() => {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const formattedEndDate = targetDate
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(targetDate))
    : null;

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch("/api/billing/history", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPayments(Array.isArray(data.payments) ? data.payments : []);
      }
    } catch {
      // Fallback silent
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
    void fetchPayments();
  };

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace("IDR", "Rp");

  const formatDateTime = (val: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(val));

  return (
    <>
      <div className="rounded-3xl p-6 sm:p-7 border border-brown-900/10 bg-white shadow-xs transition-all flex flex-col gap-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brown-900/10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                isPlus ? "bg-green-600 shadow-md shadow-green-600/20" : "bg-orange-500 shadow-md shadow-orange-500/20"
              }`}
            >
              {isPlus ? <Sparkles size={18} /> : <Zap size={18} />}
            </div>
            <div>
              <h3 className="font-display text-base font-extrabold text-brown-900">
                Langganan & Keanggotaan
              </h3>
              <p className="text-xs text-brown-700/70">
                Status paket, masa berlaku, serta riwayat transaksi ZYBA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleOpenHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brown-900/15 hover:bg-cream text-xs font-bold text-brown-900 transition-colors cursor-pointer"
            >
              <Receipt size={14} className="text-orange-500" />
              Riwayat Pembayaran
            </button>
            <Link
              href={isPlus ? "/settings/zyba-plus" : "/settings/zyba-plus"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Sparkles size={13} />
              {isPlus ? "Kelola Plus" : "Upgrade Sekarang"}
            </Link>
          </div>
        </div>

        {/* Status Body */}
        {isPlus ? (
          /* Active Zyba Plus Box */
          <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-50/70 via-white to-orange-50/40 p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-extrabold uppercase tracking-wider">
                    <Sparkles size={12} />
                    Zyba Plus Aktif
                  </span>
                  {daysLeft !== null && (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      ⏳ Sisa {daysLeft} Hari Lagi
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-brown-900 mt-1">
                  {formattedEndDate
                    ? `Berlaku hingga ${formattedEndDate}`
                    : "Paket Zyba Plus kamu sedang aktif."}
                </p>

                <p className="text-xs text-brown-700/80 leading-relaxed max-w-xl">
                  Kamu menikmati akses kuota chat harian 60 chat, model AI pilihan berkecepatan tinggi, wawasan emosi personal, dan deteksi pola wellness mingguan.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/settings/zyba-plus/insights"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors"
                >
                  Deep Insights
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Free Tier Box */
          <div className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-50/60 via-white to-cream p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold uppercase tracking-wider">
                    <Zap size={12} />
                    Zyba Free
                  </span>
                  <span className="text-xs font-medium text-brown-700/70">
                    Paket Standar
                  </span>
                </div>

                <h4 className="font-display text-sm font-extrabold text-brown-900 mt-1">
                  Buka Potensi Penuh Pendampingan ZYBA
                </h4>
                <p className="text-xs text-brown-700/80 leading-relaxed max-w-xl">
                  Upgrade ke Zyba Plus untuk menikmati 60 chat/hari, respons AI sub-detik, memori wellness berkelanjutan, dan rekomendasi aktivitas yang dipersonalisasi khusus untukmu.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/settings/zyba-plus"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-extrabold hover:bg-orange-600 shadow-sm transition-all"
                >
                  <Sparkles size={13} />
                  Upgrade Rp 49.000 / bln
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Riwayat Pembayaran (Fullscreen backdrop, responsive, no slop) */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-brown-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-brown-900/10 bg-cream p-5 sm:p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-brown-900/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="font-display text-base font-extrabold text-brown-900">
                    Riwayat Pembayaran
                  </h3>
                  <p className="text-xs text-brown-700/70">
                    Semua transaksi tagihan & verifikasi langganan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-brown-900/5 hover:bg-brown-900/10 flex items-center justify-center text-brown-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 max-h-[60vh] overflow-y-auto">
              {loadingPayments ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-brown-700/60">
                  <RefreshCw size={20} className="animate-spin text-orange-500" />
                  <span className="text-xs font-semibold">Memuat riwayat transaksi...</span>
                </div>
              ) : payments.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                  <Receipt size={28} className="text-brown-700/30" />
                  <p className="text-xs font-bold text-brown-900">Belum ada transaksi</p>
                  <p className="text-[11px] text-brown-700/60 max-w-xs">
                    Setelah kamu melakukan pembayaran Zyba Plus, riwayat dan bukti statusnya akan dicatat di sini.
                  </p>
                  <Link
                    href="/settings/zyba-plus"
                    onClick={() => setShowHistoryModal(false)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
                  >
                    Mulai Langganan Plus
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {payments.map((p) => {
                    const isSuccess = p.status === "SUCCESS";
                    const isPending = p.status === "PENDING";
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-white border border-brown-900/10 flex items-center justify-between gap-3 shadow-2xs hover:border-orange-500/30 transition-all"
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-brown-900">
                              {formatRupiah(p.amount)}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                isSuccess
                                  ? "bg-green-100 text-green-700"
                                  : isPending
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {isSuccess ? "Berhasil" : isPending ? "Menunggu Verifikasi" : p.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-brown-700/60 mt-0.5">
                            Order ID: <span className="font-mono">{p.orderId}</span>
                          </span>
                          <span className="text-[10px] text-brown-700/50">
                            {formatDateTime(p.createdAt)} · {p.paymentMethod || "Transfer Manual"}
                          </span>
                        </div>

                        {isSuccess && (
                          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-brown-900/10 flex items-center justify-between text-xs">
              <Link
                href="/settings/billing"
                onClick={() => setShowHistoryModal(false)}
                className="font-bold text-orange-600 hover:underline"
              >
                Halaman Billing Lengkap →
              </Link>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-brown-900 text-white font-bold hover:bg-brown-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
