"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, Check } from "lucide-react";

declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
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
  sub?: string;
  badge?: { text: string; color: string };
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    label: "Bulanan",
    price: 49000,
    period: "/ bulan",
    sub: "Fleksibel, batalkan kapan saja",
  },
  {
    id: "yearly",
    label: "Tahunan",
    price: 399000,
    period: "/ tahun",
    sub: "Setara Rp 33.250 / bulan",
    badge: { text: "HEMAT 32%", color: "bg-orange-500 text-white" },
  },
  {
    id: "lifetime",
    label: "Seumur Hidup",
    price: 999000,
    period: "sekali bayar",
    sub: "Akses permanen, tidak perlu perpanjang",
    badge: { text: "BEST VALUE", color: "bg-green-500 text-white" },
  },
];

const FEATURES = [
  "Semua model AI premium (Gemini Pro, GPT-4o, Claude)",
  "Analitik wellness mendalam",
  "Prioritas respons AI",
  "Chat tanpa batas per hari",
  "Ekspor laporan PDF bulanan",
  "Akses fitur beta lebih awal",
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(price)
    .replace("IDR", "Rp");

export default function ZybaPlusPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Checkout gagal");
      }

      const { snapToken, orderId, snapUrl, clientKey } = await res.json();

      // Load Midtrans Snap.js
      if (!window.snap) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = snapUrl || "https://app.sandbox.midtrans.com/snap/snap.js";
          script.setAttribute("data-client-key", clientKey || "");
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Gagal memuat payment gateway"));
          document.body.appendChild(script);
        });
      }

      window.snap?.pay(snapToken, {
        onSuccess: (result) => {
          console.log("[Payment] Success:", result);
          router.push(`/settings/zyba-plus/success?order_id=${orderId}`);
        },
        onPending: (result) => {
          console.log("[Payment] Pending:", result);
          router.push(`/settings/zyba-plus/success?order_id=${orderId}&status=pending`);
        },
        onError: (result) => {
          console.error("[Payment] Error:", result);
          setError("Pembayaran gagal. Silakan coba lagi.");
          setLoading(false);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error("[Upgrade] Error:", err);
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white fill-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-brown-900">Zyba Plus</h1>
          <p className="text-sm text-brown-700 mt-1 max-w-sm mx-auto">
            Akses penuh ke semua AI model, percakapan tanpa batas, dan analitik wellness mendalam.
          </p>
          <span className="inline-block mt-3 text-xs font-bold bg-green-100 text-green-700 px-4 py-1.5 rounded-full">
            🎁 1 BULAN FREE untuk pengguna baru
          </span>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-brown-900/10 bg-white hover:border-orange-300"
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${plan.badge.color}`}>
                    {plan.badge.text}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute top-2 right-2 text-orange-500">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                <p className="text-xs font-bold text-brown-900 mt-1">{plan.label}</p>
                <p className="font-display text-lg sm:text-xl font-extrabold text-brown-900 leading-tight mt-1">
                  {formatPrice(plan.price)}
                </p>
                <p className="text-[10px] text-brown-700 mt-0.5">{plan.period}</p>
                {plan.sub && (
                  <p className="text-[9px] sm:text-[10px] text-brown-700/60 mt-1 leading-tight">{plan.sub}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-4 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm transition-colors shadow-lg mb-2"
        >
          {loading
            ? "Memproses..."
            : `Mulai dengan paket ${selectedPlan.label} →`}
        </button>

        {error && (
          <p className="text-center text-sm text-red-600 mb-3">{error}</p>
        )}

        <p className="text-center text-[10px] text-brown-700/50 mb-6">
          Pembayaran aman melalui Midtrans. Dibatalkan kapan saja.
        </p>

        {/* Feature list */}
        <div className="bg-white rounded-2xl border border-brown-900/10 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brown-700/60 mb-3">
            Semua yang kamu dapat
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <Check size={14} className="text-green-500 mt-0.5 shrink-0" strokeWidth={3} />
                <span className="text-xs text-brown-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
