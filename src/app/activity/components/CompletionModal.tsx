"use client";

import React from "react";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompletionModal({ isOpen, onClose }: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] p-7 sm:p-8 max-w-sm w-full shadow-2xl border border-green-500/25 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow-xs border border-green-500/20">
          <Sparkles size={28} />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-800 bg-green-100 px-3 py-1 rounded-full">
            Target Harian Tercapai
          </span>
          <h3 className="font-display font-extrabold text-xl text-brown-900 mt-2">
            Langkah Kecil yang Berarti
          </h3>
        </div>

        <p className="text-xs text-brown-700/80 leading-relaxed font-body">
          Kamu telah menyelesaikan target aktivitas harianmu. Setiap peregangan dan tarikan napas tenang hari ini adalah bentuk kepedulian tulus untuk dirimu sendiri.
        </p>

        <button
          onClick={onClose}
          className="mt-2 w-full py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
        >
          <span>Kembali ke Halaman</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
