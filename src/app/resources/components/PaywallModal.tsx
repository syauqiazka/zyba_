"use client";

import React from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PaywallModal({
  open,
  onClose,
  onUpgrade,
}: PaywallModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/30 text-center flex flex-col items-center gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brown-900/5 hover:bg-brown-900/10 text-brown-700 flex items-center justify-center transition-colors"
          aria-label="Tutup"
        >
          <X size={16} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
          <Sparkles size={28} />
        </div>

        <div>
          <h3 className="font-display font-extrabold text-xl text-brown-900">
            Buka Akses Penuh dengan Zyba Plus
          </h3>
          <p className="text-xs text-brown-700 mt-2 leading-relaxed">
            Materi premium ini hanya tersedia untuk pengguna Zyba Plus. Dapatkan akses tak terbatas ke seluruh materi audio meditasi mendalam, panduan tidur, dan latihan interaktif.
          </p>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
        >
          <span>Tingkatkan ke Zyba Plus</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={onClose}
          className="text-xs font-bold text-brown-700 hover:text-brown-900 transition-colors"
        >
          Mungkin Nanti
        </button>
      </div>
    </div>
  );
}
