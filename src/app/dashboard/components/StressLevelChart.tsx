"use client";

interface WeeklyStressData {
  day: string;
  date: string;
  stressLevel: number | null;
}

interface StressLevelChartProps {
  weeklyData?: WeeklyStressData[];
  average?: number | null;
  stressLabel?: string;
}

const STRESS_LABELS = [
  "",
  "Sangat Rendah",
  "Rendah",
  "Sedang",
  "Tinggi",
  "Sangat Tinggi",
];

function getStressTheme(stressLevel: number | null) {
  if (
    stressLevel === null ||
    stressLevel === undefined
  ) {
    return {
      bar: "bg-cream",
      text: "text-brown-700",
      badge:
        "bg-cream text-brown-700 border-brown-900/15",
    };
  }

  // 1–2 = Rendah → Hijau
  if (stressLevel <= 2) {
    return {
      bar: "bg-green-500",
      text: "text-green-600",
      badge:
        "bg-green-100 text-green-700 border-green-500/20",
    };
  }

  // 3 = Sedang → Kuning
  if (stressLevel === 3) {
    return {
      bar: "bg-yellow-400",
      text: "text-yellow-600",
      badge:
        "bg-yellow-100 text-yellow-700 border-yellow-500/20",
    };
  }

  // 4–5 = Tinggi → Merah
  return {
    bar: "bg-red-500",
    text: "text-red-600",
    badge:
      "bg-red-100 text-red-700 border-red-500/20",
  };
}

export default function StressLevelChart({
  weeklyData = [],
  average = null,
  stressLabel,
}: StressLevelChartProps) {
  const hasData = weeklyData.some(
    (item) =>
      item.stressLevel !== null &&
      item.stressLevel !== undefined
  );

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  /**
   * Gunakan average untuk menentukan warna
   * badge header.
   *
   * Kalau average belum ada, gunakan stress
   * dari data yang tersedia.
   */
  const headerStressLevel =
    average !== null
      ? Math.round(average)
      : (
        weeklyData.find(
          (item) =>
            item.stressLevel !== null &&
            item.stressLevel !== undefined
        )?.stressLevel ?? null
      );

  const headerTheme =
    getStressTheme(headerStressLevel);

  const activeLabel =
    stressLabel ??
    (
      average !== null
        ? STRESS_LABELS[
        Math.min(
          5,
          Math.max(
            1,
            Math.round(average)
          )
        )
        ]
        : "Belum Ada Data"
    );

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
          Stress Level (Minggu Ini)
        </span>

        <span
          className={`
            text-xs
            font-bold
            px-2.5
            py-0.5
            rounded-full
            border
            ${hasData
              ? headerTheme.badge
              : "bg-cream text-brown-700 border-brown-900/15"
            }
          `}
        >
          {hasData
            ? activeLabel
            : "Belum Ada Data"}
        </span>
      </div>

      {/* =================================================
          CHART
      ================================================= */}
      <div className="flex items-end justify-between gap-2 h-28 my-3 px-1">

        {weeklyData.map((item) => {
          const hasValue =
            item.stressLevel !== null &&
            item.stressLevel !== undefined;

          const stressTheme =
            getStressTheme(
              item.stressLevel
            );

          const percent = hasValue
            ? (item.stressLevel! / 5) * 100
            : 10;

          const isToday =
            item.date === today;

          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
            >
              {/* -----------------------------------------
                  VALUE
              ----------------------------------------- */}
              {hasValue && (
                <span
                  className={`
                    text-[9px]
                    font-bold
                    ${isToday
                      ? stressTheme.text
                      : "text-brown-700"
                    }
                  `}
                >
                  {item.stressLevel}
                </span>
              )}

              {/* -----------------------------------------
                  BAR
              ----------------------------------------- */}
              <div
                style={{
                  height: `${Math.max(
                    percent,
                    hasValue ? 15 : 10
                  )}%`,
                }}
                className={`
                  w-full
                  rounded-t-xl
                  transition-all
                  duration-500

                  ${hasValue
                    ? stressTheme.bar
                    : "bg-cream border-t border-dashed border-brown-900/20"
                  }

                  ${isToday && hasValue
                    ? "shadow-md"
                    : ""
                  }
                `}
              />

              {/* -----------------------------------------
                  DAY
              ----------------------------------------- */}
              <span
                className={`
                  text-[10px]
                  font-semibold

                  ${isToday && hasValue
                    ? stressTheme.text
                    : "text-brown-700"
                  }
                `}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-brown-900/10 text-brown-700">

        <span>
          Rata-rata:{" "}
          {average !== null
            ? `${average.toFixed(1)} / 5`
            : "- / 5"}
        </span>

        {hasData && (
          <span>
            {
              weeklyData.filter(
                (item) =>
                  item.stressLevel !== null &&
                  item.stressLevel !== undefined
              ).length
            }{" "}
            hari terisi
          </span>
        )}
      </div>
    </div>
  );
}