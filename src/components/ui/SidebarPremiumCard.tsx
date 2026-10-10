"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Sparkles, Receipt, ArrowRight, ShieldCheck, Clock, CheckCircle2, AlertCircle, RefreshCw, X, Zap } from "lucide-react";

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
  onRefreshUser?: () => void;
}

export default function SidebarPremiumCard({ plan, subscription, premiumUntil, onRefreshUser }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "history">("status");
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Hitung sisa hari jika akun PLUS
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
        month: "short",
        year: "numeric",
      }).format(new Date(targetDate))
    : null;

  // Load riwayat pembayaran saat modal dibuka
  const loadPaymentHistory = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch("/api/billing/history", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPayments(Array.isArray(data.payments) ? data.payments : []);
      }
    } catch {
      // Ignore fallback
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && activeTab === "history" && payments.length === 0) {
      void loadPaymentHistory();
    }
  }, [isModalOpen, activeTab]);

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

  const isPlus = plan === "PLUS";

  return (
    <>
      {/* ── 1. SIDEBAR CARD (EXPANDED DESKTOP & MOBILE DRAWER) ── */}
      <div className="hidden lg:block md:hidden">
        {isPlus ? (
          /* Card untuk pengguna PLUS */
          <div className="relative overflow-hidden rounded-2xl border border-green-500/25 bg-gradient-to-br from-green-50/90 via-white to-orange-50/60 p-3 shadow-2xs transition-all hover:border-green-500/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                <Sparkles size={10} />
                Zyba Plus
              </span>
              <span className="text-[11px] font-bold text-green-700">
                {daysLeft !== null ? `${daysLeft} Hari Lagi` : "Aktif"}
              </span>
            </div>

            <p className="text-[11px] text-brown-700/80 leading-snug mb-2.5">
              {formattedEndDate
                ? `Berlaku hingga ${formattedEndDate}`
                : "Semua fitur premium & model AI aktif."}
            </p>

            {/* Quick Action buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-brown-900/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("status");
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white hover:bg-cream border border-brown-900/10 text-[10px] font-bold text-brown-900 transition-colors cursor-pointer"
                title="Cek status langganan"
              >
                <Clock size={11} className="text-green-600" />
                Status
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("history");
                  setIsModalOpen(true);
                  void loadPaymentHistory();
                }}
                className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white hover:bg-cream border border-brown-900/10 text-[10px] font-bold text-brown-900 transition-colors cursor-pointer"
                title="Lihat riwayat pembayaran"
              >
                <Receipt size={11} className="text-orange-500" />
                Riwayat
              </button>
            </div>
          </div>
        ) : (
          /* Card untuk pengguna FREE */
          <div className="relative overflow-hidden rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-50/80 via-white to-cream p-3 shadow-2xs transition-all hover:border-orange-500/40">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-wider">
                <Zap size={10} />
                Zyba Free
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("history");
                  setIsModalOpen(true);
                  void loadPaymentHistory();
                }}
                className="text-[10px] font-semibold text-brown-700/70 hover:text-brown-900 underline underline-offset-2 transition-colors cursor-pointer"
                title="Cek riwayat transaksi"
              >
                Riwayat
              </button>
            </div>

            <h4 className="font-display text-xs font-bold text-brown-900 leading-tight mb-1">
              Buka Akses Premium
            </h4>
            <p className="text-[10px] text-brown-700/80 leading-relaxed mb-2.5">
              Model AI tanpa batas, wawasan emosi personal & histori mendalam.
            </p>

            <Link
              href="/settings/zyba-plus"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white text-[11px] font-bold shadow-xs transition-all"
            >
              <Sparkles size={12} />
              Upgrade Sekarang
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* ── 2. COLLAPSED TABLET VIEW (md:w-20) ── */}
      <div className="hidden md:flex lg:hidden justify-center">
        <button
          type="button"
          onClick={() => {
            setActiveTab("status");
            setIsModalOpen(true);
          }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
            isPlus
              ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-500/30"
              : "bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-500/30"
          }`}
          title={isPlus ? `Zyba Plus (Sisa ${daysLeft ?? 0} hari)` : "Upgrade ke Zyba Plus"}
        >
          {isPlus ? <Sparkles size={18} /> : <Zap size={18} />}
        </button>
      </div>

      {/* ── 3. MODAL POPUP STATUS & RIWAYAT PEMBAYARAN ── */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-brown-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-brown-900/10 bg-cream p-5 sm:p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-brown-900/10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${
                    isPlus ? "bg-brown-900" : "bg-orange-500"
                  }`}
                >
                  {isPlus ? <Sparkles size={17} /> : <Zap size={17} />}
                </div>
                <div>
                  <h3 className="font-display text-base font-extrabold text-brown-900">
                    Langganan & Pembayaran
                  </h3>
                  <p className="text-[11px] text-brown-700/80">
                    Kelola paket ZYBA dan pantau transaksi akunmu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-brown-900/5 hover:bg-brown-900/10 flex items-center justify-center text-brown-700 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 p-1 mt-4 rounded-xl bg-brown-900/5 border border-brown-900/8">
              <button
                type="button"
                onClick={() => setActiveTab("status")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "status"
                    ? "bg-white text-brown-900 shadow-2xs"
                    : "text-brown-700/70 hover:text-brown-900"
                }`}
              >
                Status Langganan
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("history");
                  void loadPaymentHistory();
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "history"
                    ? "bg-white text-brown-900 shadow-2xs"
                    : "text-brown-700/70 hover:text-brown-900"
                }`}
              >
                Riwayat Pembayaran
              </button>
            </div>

            {/* TAB CONTENT: STATUS */}
            {activeTab === "status" && (
              <div className="mt-4 space-y-4">
                <div
                  className={`rounded-2xl border p-4 ${
                    isPlus
                      ? "border-green-500/25 bg-gradient-to-br from-green-50 to-white"
                      : "border-orange-500/25 bg-gradient-to-br from-orange-50 to-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        isPlus
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {isPlus ? "Aktif • Zyba Plus" : "Paket Standar • Zyba Free"}
                    </span>
                    {isPlus && daysLeft !== null && (
                      <span className="text-xs font-extrabold text-green-700">
                        {daysLeft} Hari Tersisa
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-lg font-extrabold text-brown-900">
                    {isPlus ? "Paket Plus Aktif" : "Gratis / Free Tier"}
                  </h4>

                  <p className="text-xs text-brown-700 mt-1 leading-relaxed">
                    {isPlus
                      ? formattedEndDate
                        ? `Masa aktif langganan kamu berlaku hingga ${formattedEndDate}. Semua fitur premium bebas diakses.`
                        : "Paket Plus aktif dengan akses tanpa batas."
                      : "Kamu saat ini menggunakan paket gratis dengan batas 20 pesan AI per hari dan fitur dasar."}
                  </p>

                  {/* List Keuntungan */}
                  <div className="mt-3.5 pt-3 border-t border-brown-900/8 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-brown-800">
                      <CheckCircle2 size={14} className={isPlus ? "text-green-600" : "text-brown-400"} />
                      <span>{isPlus ? "Batas 60 chat AI harian & model premium" : "Batas 20 chat harian standar"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-brown-800">
                      <CheckCircle2 size={14} className={isPlus ? "text-green-600" : "text-brown-400"} />
                      <span>{isPlus ? "Wellness Memory & riwayat konteks personal" : "Wellness Memory tidak tersedia"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-brown-800">
                      <CheckCircle2 size={14} className={isPlus ? "text-green-600" : "text-brown-400"} />
                      <span>{isPlus ? "Deep Insights & analitik tren kesehatan" : "Laporan analitik tren tidak tersedia"}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {isPlus ? (
                    <>
                      <Link
                        href="/settings/zyba-plus/insights"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-brown-900 hover:bg-brown-800 text-white text-center text-xs font-bold transition-all shadow-xs"
                      >
                        Buka Wellness Insights →
                      </Link>
                      <Link
                        href="/settings/zyba-plus"
                        onClick={() => setIsModalOpen(false)}
                        className="py-2.5 px-4 rounded-xl bg-white hover:bg-cream border border-brown-900/10 text-brown-900 text-center text-xs font-bold transition-colors"
                      >
                        Perpanjang Paket
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/settings/zyba-plus"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white text-center text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      Upgrade ke Zyba Plus (Rp49.000/bln)
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: RIWAYAT PEMBAYARAN */}
            {activeTab === "history" && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-brown-700">
                    Daftar Transaksi ({payments.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => void loadPaymentHistory()}
                    disabled={loadingPayments}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brown-700/80 hover:text-brown-900 transition-colors"
                  >
                    <RefreshCw size={11} className={loadingPayments ? "animate-spin" : ""} />
                    Perbarui
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {loadingPayments ? (
                    <div className="py-8 text-center text-xs text-brown-700/60">
                      <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-orange-500" />
                      Memuat riwayat transaksi...
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-brown-900/15 p-6 text-center">
                      <Receipt size={24} className="mx-auto text-brown-700/40 mb-2" />
                      <p className="text-xs font-bold text-brown-900">Belum ada transaksi</p>
                      <p className="text-[11px] text-brown-700/70 mt-0.5">
                        Pembayaran paket langganan akan otomatis tercatat di sini.
                      </p>
                    </div>
                  ) : (
                    payments.map((p) => {
                      const isSuccess = p.status === "SUCCESS";
                      const isPending = p.status === "PENDING";
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white border border-brown-900/8 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] font-bold text-brown-900 truncate">
                                {p.orderId}
                              </span>
                              <span
                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                  isSuccess
                                    ? "bg-green-100 text-green-700"
                                    : isPending
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {isSuccess ? "Berhasil" : isPending ? "Menunggu" : "Gagal"}
                              </span>
                            </div>
                            <div className="text-[10px] text-brown-700/70 mt-0.5 flex items-center gap-2">
                              <span>{formatDateTime(p.createdAt)}</span>
                              {p.paymentMethod && (
                                <>
                                  <span>•</span>
                                  <span className="uppercase">{p.paymentMethod}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-brown-900">
                              {formatRupiah(p.amount)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-brown-900/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-brown-700/70">
                    Butuh bantuan invoice atau bukti bayar?
                  </span>
                  <Link
                    href="/settings/billing"
                    onClick={() => setIsModalOpen(false)}
                    className="font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2"
                  >
                    Halaman Billing Lengkap →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      , document.body)}
    </>
  );
}