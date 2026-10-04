"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";

type PlanId = "monthly";

interface Plan {
  id: PlanId;
  label: string;
  price: number;
  period: string;
  sub: string;
}

const PRICE = 49_000;
const FEATURES = [
  "60 chat AI Premium per hari",
  "Personalized Wellness Memory",
  "Advanced Wellness Insight & Pattern",
  "Weekly Wellness Insight",
  "Rekomendasi wellness personal",
  "AI-generated personalized plan",
  "Prioritas pemrosesan AI",
];

const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price).replace("IDR", "Rp");

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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";

const PRICE = 49_000;
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
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price).replace("IDR", "Rp");

export default function ZybaPlusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      router.push(data.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pembayaran.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 text-white shadow-md"><Zap size={22} fill="currentColor" /></div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-600">ZYBA Premium</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-brown-900 sm:text-4xl">Lebih personal. Lebih mendalam.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-brown-700">Dapatkan insight wellness personal, pattern detection, rencana personal, dan 60 chat AI per hari.</p>
        </header>

        <section className="mt-7 rounded-3xl border border-orange-200 bg-orange-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold text-brown-900">Premium Bulanan</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-brown-900">{formatPrice(PRICE)} <span className="text-sm font-bold text-brown-700">/ bulan</span></p>
              <p className="mt-1 text-[11px] text-brown-700/70">Pembayaran manual. Premium aktif setelah admin memverifikasi transfer.</p>
            </div>
            <button type="button" onClick={handleUpgrade} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"><CreditCard size={17} /> {loading ? "Menyiapkan pembayaran..." : "Upgrade Premium"}</button>
          </div>
          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p>}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700"><Sparkles size={18} /></div><div><h2 className="font-display text-lg font-extrabold text-brown-900">Yang kamu dapat</h2><p className="text-xs text-brown-700/60">Semua fitur Premium ZYBA.</p></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{FEATURES.map((feature) => <div key={feature} className="flex items-start gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-100 text-green-700"><Check size={12} strokeWidth={3} /></span><span className="text-xs leading-5 text-brown-700">{feature}</span></div>)}</div>
            <div className="mt-6 rounded-2xl bg-cream p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-green-700" size={18} /><div><p className="text-xs font-bold text-brown-900">Pembayaran diverifikasi manual</p><p className="mt-1 text-[11px] leading-5 text-brown-700/70">ZYBA tidak mengaktifkan Premium hanya karena pengguna mengunggah bukti. Admin akan memeriksa pembayaran terlebih dahulu.</p></div></div></div>
          </div>

          <aside className="h-fit rounded-3xl border border-brown-900/10 bg-brown-900 p-5 text-white shadow-lg sm:p-6 lg:sticky lg:top-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">Paket Premium</p>
            <p className="mt-2 font-display text-2xl font-extrabold">Rp49.000</p>
            <p className="mt-1 text-xs text-white/60">per bulan</p>
            <button type="button" onClick={handleUpgrade} disabled={loading} className="mt-6 w-full rounded-2xl bg-orange-500 px-4 py-3.5 text-sm font-extrabold text-white hover:bg-orange-400 disabled:opacity-50">{loading ? "Menyiapkan..." : "Lanjut ke Pembayaran"}</button>
            <p className="mt-4 text-center text-[10px] leading-4 text-white/40">Setelah transfer, kirim bukti pembayaran dan tunggu verifikasi admin.</p>
          </aside>
        </section>

        <div className="mt-5 flex justify-center"><button type="button" onClick={() => router.push("/settings/billing")} className="text-[10px] font-bold text-brown-700/60 hover:text-brown-900">Riwayat pembayaran →</button></div>
      </div>
    </main>
  );
}
