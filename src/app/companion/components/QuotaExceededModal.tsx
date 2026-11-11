"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Zap, Check } from "lucide-react";

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining?: number;
  limit?: number;
  plan?: "FREE" | "PLUS";
}

export default function QuotaExceededModal({
  isOpen,
  onClose,
  remaining = 0,
  limit = 20_000,
  plan = "FREE",
}: QuotaExceededModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push("/settings/zyba-plus");
  };

  const formattedLimit = limit >= 1000 ? `${(limit / 1000).toFixed(0)}k` : limit.toLocaleString("id-ID");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full border border-brown-900/10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-4 shadow-inner">
            <Zap className="w-7 h-7 text-orange-500" />
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl font-bold text-brown-900 mb-2">
            Batas Token Hari Ini Tercapai
          </h2>

          {/* Message */}
          <p className="text-sm text-brown-700 leading-relaxed mb-5">
            Kamu telah menggunakan seluruh <span className="font-bold text-brown-900">{limit.toLocaleString("id-ID")} token ({formattedLimit})</span> hari ini (100% terpakai).
            {plan === "FREE" ? (
              <>
                {" "}Tingkatkan ke <span className="font-bold text-orange-500">Zyba Plus</span> untuk kuota hingga <span className="font-bold text-brown-900">150.000 token/hari</span> dengan akses model AI tercanggih.
              </>
            ) : (
              <> Kuota 150.000 token Premium akan direset otomatis pukul 00:00 WIB.</>
            )}
          </p>

          {/* Benefits */}
          {plan === "FREE" && (
            <div className="bg-cream/60 rounded-2xl p-4 mb-6 w-full text-left border border-brown-900/10 space-y-2">
              <p className="font-bold text-brown-900 text-xs uppercase tracking-wider mb-2">
                Keunggulan Zyba Plus:
              </p>
              <ul className="space-y-2 text-xs text-brown-700">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>150.000 token/hari</strong> — bebas curhat tanpa khawatir terpotong</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>Akses model reasoning cerdas & riwayat percakapan panjang</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>Laporan mingguan & bulanan pola ketenangan batin</span>
                </li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2.5 w-full">
            {plan === "FREE" && (
              <button
                type="button"
                onClick={handleUpgrade}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all shadow-xs cursor-pointer text-sm"
              >
                Tingkatkan ke Zyba Plus ↗
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-white hover:bg-brown-900/5 text-brown-700 font-semibold rounded-full transition-colors border border-brown-900/10 cursor-pointer text-sm"
            >
              Nanti Saja
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-brown-700/60 mt-4">
            Kuota token direset otomatis setiap malam pukul 00:00 WIB.
          </p>
        </div>
      </div>
    </div>
  );
}
