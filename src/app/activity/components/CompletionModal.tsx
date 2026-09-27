"use client";

import React from "react";
import { Award, ArrowRight } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompletionModal({ isOpen, onClose }: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-green-500/30 text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-lg border border-green-500/20">
          <Award size={32} />
        </div>
        <h3 className="font-display font-extrabold text-xl text-brown-900">
          Kerja Bagus, Kamu Berhasil!
        </h3>
        <p className="text-xs text-brown-700 leading-relaxed">
          Kamu berhasil mencapai target aktivitas harian 1.200 poin! Zyba Score kamu meningkat +5 poin hari ini untuk konsistensi gerak aktif.
        </p>
        <button
          onClick={onClose}
          className="mt-2 w-full py-3 rounded-full bg-brown-900 text-white text-xs font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>Lanjutkan</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
