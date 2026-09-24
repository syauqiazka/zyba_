"use client";

export default function DailyConditionCard() {
  return (
    <div className="xl:col-span-5 glass-card rounded-3xl p-6 md:p-7 border border-brown-900/10 bg-gradient-to-b from-white to-cream/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700">
            Kondisi Hari Ini
          </span>
          <h2 className="font-display text-2xl font-extrabold text-brown-900 mt-1">
            Energi sedang
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-500 text-[10px] font-bold">
          Recovery perlu dijaga
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="rounded-2xl bg-white border border-brown-900/10 p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-brown-700">
            Tidur
          </span>
          <span className="block font-display text-xl font-extrabold text-brown-900 mt-1">
            5.2h
          </span>
        </div>
        <div className="rounded-2xl bg-white border border-brown-900/10 p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-brown-700">
            Mood
          </span>
          <span className="block font-display text-xl font-extrabold text-green-500 mt-1">
            Cukup
          </span>
        </div>
        <div className="rounded-2xl bg-white border border-brown-900/10 p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-brown-700">
            Fokus
          </span>
          <span className="block font-display text-xl font-extrabold text-orange-500 mt-1">
            Sedang
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-cream/70 border border-brown-900/10 p-4">
        <p className="text-xs leading-relaxed text-brown-700">
          <strong className="text-brown-900">Insight Zyba:</strong> jadwalkan
          aktivitas ringan terlebih dahulu, lalu sisakan waktu untuk recovery
          dan relaksasi di sore atau malam hari.
        </p>
      </div>
    </div>
  );
}
