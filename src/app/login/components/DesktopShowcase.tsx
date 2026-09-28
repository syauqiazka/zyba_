"use client";

import React from "react";
import {
  ArrowRight,
  Brain,
  Check,
  HeartPulse,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";

const POINTS = [
  {
    icon: MessageCircle,
    title: "Companion",
    text: "Ruang untuk cerita tanpa harus menyusun semuanya dengan sempurna.",
  },
  {
    icon: Brain,
    title: "Daily Check-in",
    text: "Kenali keadaanmu dan lihat perubahan dari waktu ke waktu.",
  },
  {
    icon: HeartPulse,
    title: "Langkah kecil",
    text: "Ubah apa yang kamu pahami menjadi tindakan yang realistis.",
  },
];

export default function DesktopShowcase() {
  return (
    <div className="relative flex h-full min-h-[650px] flex-col justify-between overflow-hidden p-9 xl:p-11">

      {/* BACKGROUND ACCENTS */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-green-500/10"
        aria-hidden="true"
      />

      {/* HERO COPY */}
      <div className="relative z-10">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brown-700/70">
          Wellness companion untuk Gen Z
        </p>

        <h1 className="mt-5 max-w-[600px] font-display text-5xl font-extrabold leading-[0.96] tracking-[-0.06em] text-brown-900 xl:text-6xl">
          Pelan-pelan,
          <br />
          <span className="text-orange-500">
            tapi tetap jalan.
          </span>
        </h1>

        <p className="mt-6 max-w-[520px] text-base leading-7 text-brown-700">
          Satu ruang untuk memahami keseharian,
          merawat diri, dan menemukan langkah
          berikutnya tanpa harus melakukan
          semuanya sekaligus.
        </p>
      </div>

      {/* ZYBA FLOW */}
      <div className="relative z-10 my-9 rounded-[26px] border border-brown-900/10 bg-white/90 p-5 shadow-[0_24px_60px_rgba(41,35,31,0.08)]">

        <div className="flex items-center justify-between border-b border-brown-900/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brown-700/55">
              Di dalam ZYBA
            </p>

            <p className="mt-1 font-display text-lg font-extrabold text-brown-900">
              Pahami → pilih → bergerak
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brown-900 text-xs font-extrabold text-white">
            S
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {POINTS.map(
            (point, index) => {
              const Icon = point.icon;

              return (
                <div
                  key={point.title}
                  className="flex items-center gap-3 rounded-2xl border border-brown-900/10 bg-[#fbf9f5] px-3.5 py-3"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${index === 0
                      ? "bg-orange-100 text-orange-500"
                      : index === 1
                        ? "bg-[#eee8f8] text-[#8771ad]"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.9}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-brown-900">
                      {point.title}
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-brown-700/75">
                      {point.text}
                    </p>
                  </div>

                  {index < 2 ? (
                    <ArrowRight
                      size={15}
                      className="ml-auto shrink-0 text-brown-700/25"
                    />
                  ) : (
                    <Check
                      size={16}
                      className="ml-auto shrink-0 text-green-600"
                    />
                  )}
                </div>
              );
            }
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-brown-900/10 pt-4 text-[11px] font-semibold text-brown-700/65">
          <LockKeyhole size={13} />

          Ruang privat. Kamu tetap punya kendali
          atas ceritamu.
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-brown-700/60">
        <span>Companion</span>
        <span>Check-in</span>
        <span>Activity</span>
        <span>Journey</span>
        <span>Community</span>
      </div>
    </div>
  );
}