"use client";

import Link from "next/link";

interface StressLevelChartProps {
  stressLevel?: number | null;
  stressLabel?: string;
}

export default function StressLevelChart({
  stressLevel = null,
  stressLabel = "Belum Ada Data",
}: StressLevelChartProps) {
  const hasData = stressLevel !== null && stressLevel !== undefined;

  // Hitung persentase bar untuk hari aktif berdasarkan level stres riil (1 - 5)
  const activePercent = hasData ? Math.round((stressLevel / 5) * 100) : 0;

  // Tentukan indeks hari saat ini (0 = Min, 1 = Sen, ..., 5 = Jum, 6 = Sab)
  const todayIdx = new Date().getDay();
  // Map index: 1 -> Sen(0), 2 -> Sel(1), 3 -> Rab(2), 4 -> Kam(3), 5 -> Jum(4), 6 -> Sab(5), 0 -> Min(6)
  const dayOrder = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const currentDayPos = todayIdx === 0 ? 6 : todayIdx - 1;

  const daysData = dayOrder.map((day, idx) => ({
    day,
    val: hasData && idx === currentDayPos ? activePercent : 0,
    active: hasData && idx === currentDayPos,
  }));

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
          Stress Level (Minggu Ini)
        </span>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            hasData
              ? "bg-orange-100 text-orange-500"
              : "bg-cream border border-brown-900/15 text-brown-700"
          }`}
        >
          {hasData ? stressLabel : "Belum Ada Data"}
        </span>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-28 my-2 px-2">
        {daysData.map((bar) => (
          <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              style={{ height: bar.val > 0 ? `${Math.max(bar.val, 15)}%` : "12%" }}
              className={`w-full rounded-t-xl transition-all duration-500 ${
                bar.active
                  ? "bg-orange-500 shadow-md shadow-orange-500/20"
                  : hasData
                  ? "bg-orange-100"
                  : "bg-cream border-t border-dashed border-brown-900/20"
              }`}
            />
            <span className="text-[10px] font-semibold text-brown-700">{bar.day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-brown-900/10 text-brown-700">
        <span>Rata-rata: {hasData ? `${stressLevel.toFixed(1)} / 5` : "- / 5"}</span>
        <Link href="/daily-assessment" className="font-bold text-orange-500 hover:underline">
          {hasData ? "Detail Mood →" : "Check-In Mood →"}
        </Link>
      </div>
    </div>
  );
}
