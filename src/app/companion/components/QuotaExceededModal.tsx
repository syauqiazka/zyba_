"use client";

import { useRouter } from "next/navigation";

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
}

export default function QuotaExceededModal({ isOpen, onClose, remaining }: QuotaExceededModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push("/settings/zyba-plus");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-cream rounded-3xl p-8 max-w-md w-full mx-4 border border-brown-900/10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl font-bold text-brown-900 mb-2">
            Batas Chat Hari Ini Tercapai
          </h2>

          {/* Message */}
          <p className="text-brown-700 mb-6">
            Kamu sudah menggunakan <span className="font-bold">20 pesan gratis</span> hari ini. 
            Upgrade ke <span className="font-bold text-orange-500">Zyba Plus</span> untuk chat unlimited 
            tanpa batas dengan AI Companion kapan saja.
          </p>

          {/* Benefits */}
          <div className="bg-white/70 rounded-2xl p-4 mb-6 w-full text-left border border-brown-900/10">
            <p className="font-bold text-brown-900 mb-2 text-sm">Dengan Zyba Plus:</p>
            <ul className="space-y-1.5 text-sm text-brown-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Chat unlimited dengan Zyba Companion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Insight kebiasaan mendalam berbasis AI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Laporan bulanan perkembanganmu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Akses komunitas eksklusif Zyba Plus</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors"
            >
              Upgrade ke Zyba Plus →
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white hover:bg-brown-900/5 text-brown-900 font-semibold rounded-full transition-colors border border-brown-900/10"
            >
              Nanti Saja
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-brown-600 mt-4">
            Kuota akan direset besok jam 00:00 WIB
          </p>
        </div>
      </div>
    </div>
  );
}
