"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ZybaPlusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Request checkout dari server
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Checkout failed");
      }

      const { snapToken, orderId } = await res.json();

      // 2. Load Midtrans Snap.js kalau belum
      if (!window.snap) {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // 3. Tampilkan Midtrans popup
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
          console.log("[Payment] Popup closed");
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
    <div className="min-h-screen bg-cream px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold text-brown-900 mb-2">
          Pilih Paket ZYBA
        </h1>
        <p className="text-brown-700 mb-8">
          Upgrade ke Zyba Plus untuk fitur AI unlimited, rekomendasi personal, dan insight mendalam.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-6 border border-brown-900/10 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display text-xl font-bold text-brown-900">Zyba Free</h2>
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                Paket Saat Ini
              </span>
            </div>
            <p className="text-3xl font-extrabold text-brown-900 mb-4">Rp 0</p>
            <ul className="space-y-2 text-sm text-brown-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>20 pesan AI per hari</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Mood tracking dasar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Akses community feed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Resources gratis</span>
              </li>
            </ul>
          </div>

          {/* Plus Plan */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border-2 border-orange-500 shadow-lg relative">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                REKOMENDASI
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display text-xl font-bold text-brown-900">Zyba Plus</h2>
            </div>
            <p className="text-3xl font-extrabold text-brown-900 mb-1">Rp 49.000</p>
            <p className="text-sm text-brown-700 mb-4">per bulan</p>
            <ul className="space-y-2 text-sm text-brown-900 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">✓</span>
                <span className="font-semibold">Unlimited AI chat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">✓</span>
                <span className="font-semibold">Rekomendasi personal AI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">✓</span>
                <span className="font-semibold">Program komunitas eksklusif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">✓</span>
                <span className="font-semibold">Insight kebiasaan mendalam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">✓</span>
                <span className="font-semibold">Laporan perkembangan bulanan</span>
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-full transition-colors"
            >
              {loading ? "Memproses..." : "Upgrade ke Zyba Plus →"}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
