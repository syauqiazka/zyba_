"use client";

import { useState } from "react";
import {
  ShieldCheck,
  HeartHandshake,
  LockKeyhole,
  MessageCircleHeart,
  Flag,
  Check,
} from "lucide-react";

type CommunityGuidelinesModalProps = {
  open: boolean;
  onAccept: () => Promise<void> | void;
  loading?: boolean;
};

export default function CommunityGuidelinesModal({
  open,
  onAccept,
  loading = false,
}: CommunityGuidelinesModalProps) {
  const [accepted, setAccepted] = useState(false);

  if (!open) return null;

  const handleAccept = async () => {
    if (!accepted || loading) return;
    await onAccept();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brown-900/55 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] bg-[#F7F2E7] border border-brown-900/10 shadow-2xl">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 sm:px-8 sm:pt-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E2EBD2] text-green-700">
              <ShieldCheck size={22} strokeWidth={2} />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-green-700">
                Selamat datang di Community
              </p>

              <h2 className="mt-1 font-display text-xl font-extrabold text-brown-900 sm:text-2xl">
                Community Guidelines
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-brown-700/70">
                Ruang yang nyaman dimulai dari cara kita
                memperlakukan satu sama lain.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-6 max-h-[46vh] overflow-y-auto rounded-2xl border border-brown-900/10 bg-white/60 p-5 sm:mx-8 sm:p-6">
          <div className="space-y-5">

            {/* Respect */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <HeartHandshake
                  size={16}
                  className="text-orange-500"
                />

                <h3 className="text-sm font-bold text-brown-900">
                  Saling menghormati
                </h3>
              </div>

              <p className="text-xs leading-6 text-brown-700/80">
                Perlakukan anggota Community dengan hormat.
                Hindari hinaan, pelecehan, perundungan,
                atau serangan pribadi.
              </p>
            </section>

            {/* Safe space */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <MessageCircleHeart
                  size={16}
                  className="text-green-600"
                />

                <h3 className="text-sm font-bold text-brown-900">
                  Jaga ruang tetap aman
                </h3>
              </div>

              <p className="text-xs leading-6 text-brown-700/80">
                Bagikan pengalaman dan pendapat dengan
                bertanggung jawab. Jangan gunakan Community
                untuk mengancam, mengintimidasi, atau
                menyakiti orang lain.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <LockKeyhole
                  size={16}
                  className="text-green-600"
                />

                <h3 className="text-sm font-bold text-brown-900">
                  Lindungi privasi
                </h3>
              </div>

              <p className="text-xs leading-6 text-brown-700/80">
                Jangan membagikan informasi pribadi,
                identitas, foto, atau data sensitif milik
                orang lain tanpa izin.
              </p>
            </section>

            {/* Content */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-orange-500"
                />

                <h3 className="text-sm font-bold text-brown-900">
                  Bagikan dengan bijak
                </h3>
              </div>

              <p className="text-xs leading-6 text-brown-700/80">
                Hindari konten yang berbahaya, diskriminatif,
                mengandung ancaman, atau sengaja dibuat untuk
                merugikan pengguna lain.
              </p>
            </section>

            {/* Wellness disclaimer */}
            <section>
              <h3 className="mb-2 text-sm font-bold text-brown-900">
                Community bukan pengganti bantuan profesional
              </h3>

              <p className="text-xs leading-6 text-brown-700/80">
                Pengalaman pengguna lain bukan diagnosis atau
                pengganti bantuan dari tenaga kesehatan
                profesional. Jika kamu berada dalam kondisi
                darurat, cari bantuan yang sesuai.
              </p>
            </section>

            {/* Report */}
            <section>
              <div className="mb-2 flex items-center gap-2">
                <Flag
                  size={16}
                  className="text-orange-500"
                />

                <h3 className="text-sm font-bold text-brown-900">
                  Laporkan konten bermasalah
                </h3>
              </div>

              <p className="text-xs leading-6 text-brown-700/80">
                Jika kamu menemukan konten atau perilaku
                yang melanggar aturan Community, gunakan
                fitur pelaporan yang tersedia.
              </p>
            </section>

            {/* Version */}
            <div className="rounded-xl border border-brown-900/10 bg-[#F7F2E7] px-4 py-3">
              <p className="text-[10px] leading-5 text-brown-700/60">
                Community Guidelines Version:{" "}
                <strong>1.0</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="px-6 pt-5 sm:px-8">
          <label className="flex cursor-pointer items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={accepted}
              onClick={() =>
                setAccepted((value) => !value)
              }
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                accepted
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-brown-900/25 bg-white"
              }`}
            >
              {accepted && (
                <Check
                  size={13}
                  strokeWidth={3}
                />
              )}
            </button>

            <span className="text-xs leading-5 text-brown-700/80">
              Saya telah membaca dan menyetujui{" "}
              <strong className="font-bold text-brown-900">
                Community Guidelines ZYBA
              </strong>
              .
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
          <button
            type="button"
            disabled={!accepted || loading}
            onClick={handleAccept}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brown-900 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? "Menyimpan..."
              : "Saya Mengerti & Lanjutkan"}

            {!loading && <span>→</span>}
          </button>

          <p className="mt-3 text-center text-[10px] leading-4 text-brown-700/50">
            Persetujuan ini akan disimpan pada akunmu.
          </p>
        </div>
      </div>
    </div>
  );
}