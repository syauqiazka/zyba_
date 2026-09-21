"use client";

import React from "react";
import { CRISIS_RESOURCES } from "@/lib/crisisDetection";

interface CrisisModalProps {
  setCrisisAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setExpressionText: React.Dispatch<React.SetStateAction<string>>;
}

export default function CrisisModal({ setCrisisAlert, setExpressionText }: CrisisModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
        <h3 className="font-display font-extrabold text-lg text-brown-900">
          Dukungan & Pertolongan Resmi
        </h3>
        <p className="text-xs text-brown-700 leading-relaxed bg-cream p-4 rounded-2xl">
          {CRISIS_RESOURCES.message}
        </p>
        <div className="flex flex-col gap-2">
          {CRISIS_RESOURCES.hotlines.map((h, i) => (
            <div key={i} className="p-3 rounded-2xl bg-green-100/50 flex justify-between text-xs">
              <span className="font-bold text-brown-900">{h.name}</span>
              <span className="font-extrabold text-green-500">{h.contact}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setCrisisAlert(false);
            setExpressionText("Saya merasa sedikit lelah dengan beban tugas, namun ingin belajar lebih tenang.");
          }}
          className="w-full py-3 rounded-2xl bg-brown-900 text-white text-xs font-bold"
        >
          Ubah Kalimat & Lanjutkan →
        </button>
      </div>
    </div>
  );
}
