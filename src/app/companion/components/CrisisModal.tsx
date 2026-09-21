"use client";

import { CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";

interface Props {
  crisisAlert: boolean;
  setCrisisAlert: (v: boolean) => void;
}

export default function CrisisModal({ crisisAlert, setCrisisAlert }: Props) {
  if (!crisisAlert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brown-900/10 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-500 font-bold flex items-center justify-center text-xl">
            🤝
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-brown-900">
              Kami Di Sini Untukmu
            </h3>
            <span className="text-xs text-brown-700">Bantuan Resmi 24/7 Gratis</span>
          </div>
        </div>

        <p className="text-xs text-brown-700 leading-relaxed bg-cream p-4 rounded-2xl">
          {CRISIS_RESOURCES.message}
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-brown-900">Layanan Pendampingan Indonesia:</span>
          {CRISIS_RESOURCES.hotlines.map((h, i) => (
            <div key={i} className="p-3 rounded-2xl bg-green-100/50 flex items-center justify-between">
              <span className="text-xs font-bold text-brown-900">{h.name}</span>
              <span className="text-xs font-extrabold text-green-500">{h.contact}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCrisisAlert(false)}
          className="mt-2 w-full py-3 rounded-2xl bg-brown-900 text-white text-xs font-bold"
        >
          Saya Mengerti & Aman →
        </button>
      </div>
    </div>
  );
}
