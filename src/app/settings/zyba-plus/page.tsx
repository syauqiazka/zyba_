"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Sparkles, Zap, ArrowRight, TrendingUp, Brain, Activity } from "lucide-react";
import Link from "next/link";

const PRICE = 49_000;

const COMPARE = [
  {
    label: "Chat AI harian",
    free: "20 chat/hari",
    plus: "60 chat/hari",
    icon: <Brain size={14} />,
  },
  {
    label: "Wellness Memory",
    free: "Tidak tersedia",
    plus: "Personalized — AI mengingat konteks wellnessmu",
    icon: <Sparkles size={14} />,
  },
  {
    label: "Deteksi Pola Wellness",
    free: "Dasar",
    plus: "Advanced — deteksi tren mood, tidur & stres",
    icon: <TrendingUp size={14} />,
  },
  {
    label: "Laporan mingguan",
    free: "Tidak tersedia",
    plus: "Insight perjalanan wellness tiap minggu",
    icon: <Activity size={14} />,
  },
  {
    label: "Rencana personal AI",
    free: "Tidak tersedia",
    plus: "Program aktivitas & kebiasaan yang disesuaikan",
    icon: <Zap size={14} />,
  },
  {
    label: "Deep Insights",
    free: "Tidak tersedia",
    plus: "Dashboard analytics metrik kesehatanmu",
    icon: <TrendingUp size={14} />,
  },
  {
    label: "Prioritas AI",
    free: "Standar",
    plus: "Respons lebih cepat di jam sibuk",
    icon: <Zap size={14} />,
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(price)
    .replace("IDR", "Rp");

export default function ZybaPlusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [isPlus, setIsPlus] = useState(false);
  const [chatQuota, setChatQuota] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/user/me", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!mounted) return;
        const plus = data?.user?.plan === "PLUS";
        setIsPlus(plus);
        setPremiumUntil(data?.stats?.premiumUntil ?? null);
        if (data?.stats?.chatQuota) setChatQuota(data.stats.chatQuota);
      })
      .catch(() => {})
      .finally(() => mounted && setPlanLoading(false));
    return () => { mounted = false; };
  }, []);

  const handleUpgrade = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal membuat pembayaran.");
      if (!data.redirect) throw new Error("Halaman pembayaran tidak tersedia.");
      router.push(data.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pembayaran.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-3.5 py-6 sm:px-6 sm:py-10 pb-28 md:pb-12 text-brown-900">
      <div className="mx-auto w-full max-w-4xl">

        {/* ── Hero header ── */}
        <header className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-[11px] font-extrabold uppercase tracking-[0.16em] px-3 py-1.5 rounded-pill mb-3 sm:mb-4">
            <Sparkles size={11} />
            ZYBA Premium
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-brown-900 leading-tight">
            Pendampingan yang lebih<br />
            <span className="text-orange-500">personal</span> &{" "}
            <span className="text-green-600">mendalam</span>
          </h1>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed sm:leading-6 text-brown-700 max-w-xl">
            Tingkatkan perjalanan wellnessmu dengan insight berbasis data nyata,
            AI yang mengenalimu, dan rencana yang benar-benar sesuai kondisimu.
          </p>
        </header>

        {/* ── Plan status card ── */}
        {planLoading ? (
          <div className="mb-6 h-28 animate-pulse rounded-3xl border border-brown-900/10 bg-white" />
        ) : isPlus ? (
          /* Active Plus member card */
          <section className="mb-6 overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-[#f0f7e6] via-white to-[#fef7f0] p-4 sm:p-7 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-brown-900 flex items-center justify-center text-white shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-green-700">ZYBA PLUS AKTIF</p>
                  <h2 className="mt-0.5 sm:mt-1 font-display text-lg sm:text-xl font-extrabold text-brown-900">Selamat! Semua fitur Premium terbuka.</h2>
                  {premiumUntil && (
                    <p className="mt-1 text-xs text-brown-700/70">
                      Aktif sampai{" "}
                      <span className="font-semibold text-brown-900">
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(premiumUntil))}
                      </span>
                    </p>
                  )}
                  {chatQuota && (
                    <div className="mt-3 max-w-xs">
                      <div className="flex justify-between text-[11px] text-brown-700/70 mb-1">
                        <span>Chat AI hari ini</span>
                        <span className="font-semibold text-brown-900">{chatQuota.used}/{chatQuota.limit}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-brown-900/10 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (chatQuota.used / chatQuota.limit) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/settings/zyba-plus/insights"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brown-900 text-white px-5 py-3 text-xs sm:text-sm font-extrabold hover:bg-orange-500 transition-colors shrink-0"
              >
                <TrendingUp size={15} />
                Deep Insights
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        ) : (
          /* Upgrade CTA card */
          <section className="mb-6 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-cream p-4.5 sm:p-7 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-600 mb-0.5 sm:mb-1">Upgrade Sekarang</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900">{formatPrice(PRICE)}</span>
                  <span className="text-xs sm:text-sm font-bold text-brown-700/70">/ bulan</span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-brown-700/60">Transfer manual · Premium aktif setelah admin verifikasi</p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto sm:items-end">
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white hover:bg-orange-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-md shadow-orange-500/25"
                >
                  <CreditCard size={15} />
                  {loading ? "Menyiapkan..." : "Upgrade ke Plus →"}
                </button>
                {error && (
                  <p className="text-xs font-semibold text-red-600 max-w-xs text-left sm:text-right">{error}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Free vs Plus comparison ── */}
        <section className="rounded-3xl border border-brown-900/10 bg-white shadow-sm overflow-hidden">
          {/* Mobile Hint */}
          <div className="sm:hidden px-4 py-2 bg-orange-50/70 border-b border-orange-100/80 flex items-center justify-between text-[11px] font-medium text-orange-800">
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-orange-500" />
              Geser tabel ke samping untuk melihat detail perbandingan
            </span>
            <span className="text-[10px] text-orange-600/70">↔</span>
          </div>

          {/* Table Container with Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto w-full scrollbar-thin">
            <div className="min-w-[480px] sm:min-w-full">
              {/* Table header */}
              <div className="grid grid-cols-[minmax(140px,1.2fr)_minmax(85px,0.9fr)_minmax(160px,1.6fr)] gap-0 border-b border-brown-900/10 bg-cream/20">
                <div className="px-4 sm:px-5 py-3 sm:py-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brown-700/50">Fitur</p>
                </div>
                <div className="px-3 sm:px-4 py-3 sm:py-4 text-center border-l border-brown-900/10">
                  <p className="text-xs font-extrabold text-brown-700/70">Gratis</p>
                </div>
                <div className="px-3 sm:px-4 py-3 sm:py-4 text-center bg-gradient-to-b from-orange-100/60 to-white border-l border-orange-200">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600 flex items-center justify-center gap-1">
                    <Sparkles size={10} /> PLUS
                  </p>
                </div>
              </div>

              {/* Rows */}
              {COMPARE.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[minmax(140px,1.2fr)_minmax(85px,0.9fr)_minmax(160px,1.6fr)] gap-0 border-b border-brown-900/[0.06] last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-cream/25"
                  }`}
                >
                  {/* Feature label */}
                  <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2">
                    <span className="text-brown-700/50 shrink-0">{row.icon}</span>
                    <span className="text-xs font-semibold text-brown-900 leading-snug">{row.label}</span>
                  </div>

                  {/* Free */}
                  <div className="px-3 sm:px-4 py-3 sm:py-3.5 border-l border-brown-900/[0.06] flex items-center justify-center">
                    {row.free === "Tidak tersedia" ? (
                      <span className="text-brown-700/30 text-sm font-bold">—</span>
                    ) : (
                      <span className="text-[11px] text-brown-700/70 text-center font-medium leading-tight">{row.free}</span>
                    )}
                  </div>

                  {/* Plus */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 bg-orange-50/40 border-l border-orange-100 flex items-start gap-1.5 justify-start">
                    <Check size={13} className="text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[11px] text-brown-900 font-medium leading-relaxed">{row.plus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust / transparency ── */}
        <section className="mt-5 rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6">
          <div className="flex gap-3 items-start">
            <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-extrabold text-brown-900">Pembayaran diverifikasi manual, bukan otomatis</p>
              <p className="mt-1 text-xs leading-5 text-brown-700/70">
                ZYBA tidak mengaktifkan Premium hanya karena pengguna mengunggah bukti. Tim admin memeriksa setiap pembayaran sebelum fitur Plus diaktifkan. Proses biasanya memakan waktu 1×24 jam di hari kerja.
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer links ── */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/settings/billing")}
            className="text-[11px] font-bold text-brown-700/60 hover:text-brown-900 transition-colors"
          >
            Riwayat pembayaran →
          </button>
          {isPlus && (
            <Link
              href="/settings/zyba-plus/insights"
              className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Deep Wellness Insights →
            </Link>
          )}
        </div>

        {/* ── Bottom CTA for non-plus ── */}
        {!isPlus && !planLoading && (
          <div className="mt-8 rounded-3xl bg-brown-900 p-6 sm:p-8 text-center">
            <p className="font-display text-xl font-extrabold text-white mb-2">
              Mulai perjalanan wellness yang lebih bermakna
            </p>
            <p className="text-sm text-white/60 mb-5">Hanya Rp49.000/bulan. Bisa dibatalkan kapan saja.</p>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-3.5 text-sm font-extrabold text-white hover:bg-orange-400 disabled:opacity-50 transition-colors shadow-lg shadow-orange-500/30"
            >
              <Sparkles size={16} />
              {loading ? "Menyiapkan..." : "Upgrade ke ZYBA Plus →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
