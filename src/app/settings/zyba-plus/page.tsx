"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";

declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

type PlanId = "monthly" | "yearly" | "lifetime";

interface Plan {
  id: PlanId;
  label: string;
  price: number;
  period: string;
  sub: string;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    label: "Bulanan",
    price: 49_000,
    period: "/ bulan",
    sub: "Fleksibel, batalkan kapan saja",
  },
  {
    id: "yearly",
    label: "Tahunan",
    price: 399_000,
    period: "/ tahun",
    sub: "Setara Rp 33.250 / bulan",
    badge: "HEMAT 32%",
  },
  {
    id: "lifetime",
    label: "Seumur Hidup",
    price: 999_000,
    period: "sekali bayar",
    sub: "Akses permanen tanpa perpanjangan",
    badge: "BEST VALUE",
  },
];

const FEATURES = [
  "60 chat AI Premium per hari",
  "Personalized Wellness Memory",
  "Advanced Wellness Insight & Pattern",
  "Weekly Wellness Insight",
  "Rekomendasi wellness personal",
  "AI-generated personalized plan",
  "Prioritas pemrosesan AI",
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("IDR", "Rp");

async function loadSnapScript(snapUrl: string, clientKey: string) {
  if (window.snap) return;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-zyba-midtrans="snap"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Gagal memuat payment gateway")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = snapUrl;
    script.async = true;
    script.dataset.zybaMidtrans = "snap";
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat payment gateway"));
    document.body.appendChild(script);
  });
}

export default function ZybaPlusPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = PLANS.find((plan) => plan.id === selected)!;

  const handleUpgrade = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Checkout gagal");

      await loadSnapScript(data.snapUrl, data.clientKey);

      if (!window.snap) throw new Error("Payment gateway belum siap");

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          router.push(
            `/settings/zyba-plus/success?order_id=${encodeURIComponent(data.orderId)}&status=success`
          );
        },
        onPending: () => {
          router.push(
            `/settings/zyba-plus/success?order_id=${encodeURIComponent(data.orderId)}&status=pending`
          );
        },
        onError: () => {
          setError("Pembayaran gagal. Silakan coba lagi.");
          setLoading(false);
        },
        onClose: () => setLoading(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 text-white shadow-md">
            <Zap size={22} fill="currentColor" />
          </div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
            ZYBA Premium
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brown-900 sm:text-4xl">
            Lebih personal. Lebih mendalam.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-brown-700">
            Dapatkan 60 chat AI per hari, insight wellness personal, pattern detection,
            dan rencana yang disusun dari perjalanan wellness-mu.
          </p>
        </header>

        <section className="mt-7 grid gap-3 rounded-3xl border border-brown-900/10 bg-white p-3 shadow-sm sm:grid-cols-3 sm:p-4">
          {PLANS.map((plan) => {
            const active = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(plan.id)}
                className={[
                  "relative min-h-[118px] rounded-2xl border-2 p-4 text-left transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                  active
                    ? "border-orange-500 bg-orange-50"
                    : "border-brown-900/10 bg-white hover:border-orange-300",
                ].join(" ")}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-brown-900 px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-extrabold text-brown-900">{plan.label}</p>
                    <p className="mt-2 font-display text-xl font-extrabold text-brown-900 sm:text-2xl">
                      {formatPrice(plan.price)}
                    </p>
                    <p className="text-[10px] text-brown-700">{plan.period}</p>
                  </div>
                  <span
                    className={[
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                      active ? "border-orange-500 bg-orange-500 text-white" : "border-brown-900/20",
                    ].join(" ")}
                  >
                    {active && <Check size={12} strokeWidth={3} />}
                  </span>
                </div>
                <p className="mt-2 text-[10px] leading-4 text-brown-700/60">{plan.sub}</p>
              </button>
            );
          })}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="font-display text-lg font-extrabold text-brown-900">
                  Yang kamu dapat
                </h2>
                <p className="text-xs text-brown-700/60">Semua fitur Premium ZYBA.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-100 text-green-700">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-xs leading-5 text-brown-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-cream p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-green-700" size={18} />
                <div>
                  <p className="text-xs font-bold text-brown-900">Pembayaran aman</p>
                  <p className="mt-1 text-[11px] leading-5 text-brown-700/70">
                    Pembayaran diproses melalui Midtrans. ZYBA tidak menyimpan data kartu
                    pembayaran di server aplikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-brown-900/10 bg-brown-900 p-5 text-white shadow-lg sm:p-6 lg:sticky lg:top-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">
              Paket dipilih
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-2xl font-extrabold">{selectedPlan.label}</p>
                <p className="mt-1 text-xs text-white/60">{selectedPlan.sub}</p>
              </div>
              <p className="font-display text-lg font-extrabold">{formatPrice(selectedPlan.price)}</p>
            </div>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={17} />
              {loading ? "Menyiapkan pembayaran..." : "Lanjut ke Pembayaran"}
            </button>

            {error && (
              <p className="mt-3 rounded-xl bg-red-500/15 px-3 py-2 text-[11px] leading-5 text-red-100">
                {error}
              </p>
            )}

            <p className="mt-4 text-center text-[10px] leading-4 text-white/40">
              Setelah pembayaran berhasil, status Premium akan aktif setelah konfirmasi
              dari payment gateway.
            </p>
          </aside>
        </section>

        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-brown-700/50">
          <span>✓ 60 chat/hari</span>
          <span>✓ Insight personal</span>
          <span>✓ Bisa dibatalkan sesuai paket</span>
          <button
            type="button"
            onClick={() => router.push("/settings/billing")}
            className="font-bold text-brown-900/60 hover:text-brown-900"
          >
            Riwayat pembayaran →
          </button>
        </div>
      </div>
    </main>
  );
}
