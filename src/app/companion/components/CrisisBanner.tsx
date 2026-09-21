"use client";

import { CRISIS_RESOURCES } from "@/backend/crisis/crisisDetection";

interface CrisisBannerProps {
  onClose: () => void;
}

/**
 * Banner krisis tenang sesuai AGENTS.md Bagian 10.5 & 12:
 * - Muncul di atas jendela chat (bukan popup mengagetkan/modal interuptif).
 * - Background lembut netral (bukan warna promosi orange-500).
 * - Teks tenang, suportif, tanpa nuansa playful/marketing.
 * - Tidak auto-dismiss (tetap ada sampai pengguna menutup secara manual).
 */
export default function CrisisBanner({ onClose }: CrisisBannerProps) {
  return (
    <div
      role="alert"
      className="mx-6 mt-4 p-4 rounded-2xl bg-[#F0EDE4] border border-brown-900/15 text-brown-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
          🌱
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-xs text-brown-900">
              Layanan Pendampingan & Bantuan Bebas Pulsa
            </h4>
            <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full border border-brown-900/10 text-brown-700 font-medium">
              24/7 Resmi
            </span>
          </div>
          <p className="text-xs text-brown-700 leading-relaxed max-w-2xl">
            {CRISIS_RESOURCES.message} Jika kamu atau orang terdekat membutuhkan dukungan emosional segera, hubungi:
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {CRISIS_RESOURCES.hotlines.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-white border border-brown-900/10 text-[11px] font-medium text-brown-900"
              >
                <span className="text-brown-700">{h.name}:</span>
                <strong className="text-green-500 font-bold">{h.contact}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        type="button"
        className="self-end sm:self-center shrink-0 px-3 py-1.5 rounded-pill border border-brown-900/20 text-xs font-semibold text-brown-700 hover:bg-white hover:text-brown-900 transition-colors"
        aria-label="Tutup banner pendampingan"
      >
        ✕ Tutup
      </button>
    </div>
  );
}
