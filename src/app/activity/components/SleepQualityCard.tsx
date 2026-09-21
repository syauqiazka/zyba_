"use client";

export default function SleepQualityCard() {
  return (
    <div className="lg:col-span-5 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col justify-between bg-gradient-to-b from-white to-cream/40">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
            Sleep Quality Dashboard
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-500">
            Level 1: Insomniac
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-2">
          <span className="font-display text-5xl font-extrabold text-brown-900">5.2h</span>
          <span className="text-xs text-brown-700 font-semibold">Total Durasi Tidur</span>
        </div>

        <p className="text-xs text-brown-700 leading-relaxed mt-2 bg-cream/70 p-4 rounded-2xl border border-brown-900/10">
          💡 <strong>Insight Zyba:</strong> Kamu terbangun 2 kali tadi malam. Cobalah hindari kafein setelah jam 4 sore dan ikuti latihan pernapasan Zyba Hours sebelum tidur.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-brown-900/10 text-center">
        <div className="bg-white p-3 rounded-2xl border border-brown-900/10">
          <span className="text-[10px] text-brown-700 font-bold uppercase">Deep Sleep</span>
          <span className="block font-display text-lg font-bold text-brown-900">1h 15m</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-brown-900/10">
          <span className="text-[10px] text-brown-700 font-bold uppercase">Sleep Efficiency</span>
          <span className="block font-display text-lg font-bold text-green-500">72%</span>
        </div>
      </div>
    </div>
  );
}
