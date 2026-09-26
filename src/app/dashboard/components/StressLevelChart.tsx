
"use client";

import { useEffect, useMemo, useState } from "react";

interface WeeklyStressData {
  day: string;
  date: string;
  stressLevel: number | null;
}

interface DailyAssessmentRecord {
  id?: string;
  date?: string | null;
  createdAt?: string | null;
  stressLevel?: number | null;
}

const DAY_NAMES = [
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
  "Min",
];

const STRESS_LABELS = [
  "",
  "Sangat Rendah",
  "Rendah",
  "Sedang",
  "Tinggi",
  "Sangat Tinggi",
];

function getJakartaDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getMonday(date = new Date()) {
  const result = new Date(date);

  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);

  return result;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildWeeklyStress(
  records: DailyAssessmentRecord[],
): WeeklyStressData[] {
  const now = new Date();
  const monday = getMonday(now);

  return DAY_NAMES.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const dateKey = formatDateKey(date);

    const record = records
      .filter((item) => {
        if (
          item.stressLevel === null ||
          item.stressLevel === undefined
        ) {
          return false;
        }

        const itemDate =
          item.date ??
          (item.createdAt
            ? formatDateKey(new Date(item.createdAt))
            : null);

        return itemDate === dateKey;
      })
      .sort((a, b) => {
        const aTime = new Date(
          a.createdAt ?? a.date ?? 0,
        ).getTime();

        const bTime = new Date(
          b.createdAt ?? b.date ?? 0,
        ).getTime();

        return bTime - aTime;
      })[0];

    return {
      day,
      date: dateKey,
      stressLevel:
        record?.stressLevel !== undefined &&
          record?.stressLevel !== null
          ? Number(record.stressLevel)
          : null,
    };
  });
}

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

  if (stressLevel <= 2) {
    return {
      bar: "bg-green-500",
      text: "text-green-600",
      badge:
        "bg-green-100 text-green-700 border-green-500/20",
    };
  }

  if (stressLevel === 3) {
    return {
      bar: "bg-yellow-400",
      text: "text-yellow-600",
      badge:
        "bg-yellow-100 text-yellow-700 border-yellow-500/20",
    };
  }

  return {
    bar: "bg-red-500",
    text: "text-red-600",
    badge:
      "bg-red-100 text-red-700 border-red-500/20",
  };
}

function getStressLabel(stressLevel: number | null) {
  if (
    stressLevel === null ||
    stressLevel === undefined
  ) {
    return "Belum Ada Data";
  }

  const safeLevel = Math.min(
    5,
    Math.max(1, Math.round(stressLevel)),
  );

  return STRESS_LABELS[safeLevel];
}

interface StressLevelChartProps {
  initialHistory?: DailyAssessmentRecord[];
}

export default function StressLevelChart({ initialHistory }: StressLevelChartProps = {}) {
  const [weeklyData, setWeeklyData] = useState<WeeklyStressData[]>(() => {
    if (initialHistory && Array.isArray(initialHistory) && initialHistory.length > 0) {
      return buildWeeklyStress(initialHistory);
    }
    return [];
  });

  const [loading, setLoading] = useState(!initialHistory || initialHistory.length === 0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialHistory && Array.isArray(initialHistory) && initialHistory.length > 0) {
      setWeeklyData(buildWeeklyStress(initialHistory));
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadWeeklyStress() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/daily-assessment?limit=7&page=1",
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch daily assessment: ${response.status}`,
          );
        }

        const data = await response.json();

        const history: DailyAssessmentRecord[] =
          Array.isArray(data.history)
            ? data.history
            : [];

        const currentWeek =
          buildWeeklyStress(history);

        if (!cancelled) {
          setWeeklyData(currentWeek);
        }
      } catch (err) {
        console.error(
          "[StressLevelChart] Failed to load DB data:",
          err,
        );

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWeeklyStress();

    return () => {
      cancelled = true;
    };
  }, []);

  const today = getJakartaDateKey();

  // Cek apakah ada data stress
  const hasData = weeklyData.some(
    (item) =>
      item.stressLevel !== null &&
      item.stressLevel !== undefined &&
      Number.isFinite(item.stressLevel),
  );

  // Hitung rata-rata stress minggu ini
  const average = useMemo(() => {
    const values = weeklyData
      .map((item) => item.stressLevel)
      .filter(
        (value): value is number =>
          value !== null &&
          value !== undefined &&
          Number.isFinite(value),
      );

    if (values.length === 0) {
      return null;
    }

    return Number(
      (
        values.reduce(
          (sum, value) => sum + value,
          0,
        ) / values.length
      ).toFixed(1),
    );
  }, [weeklyData]);

  const headerStressLevel =
    average !== null
      ? Math.round(average)
      : (
        weeklyData.find(
          (item) =>
            item.stressLevel !== null &&
            item.stressLevel !== undefined,
        )?.stressLevel ?? null
      );

  const headerTheme =
    getStressTheme(headerStressLevel);

  const activeLabel =
    getStressLabel(headerStressLevel);

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
          Stress Level (Minggu Ini)
        </span>

        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${hasData
              ? headerTheme.badge
              : "bg-cream text-brown-700 border-brown-900/15"
            }`}
        >
          {loading
            ? "Memuat..."
            : hasData
              ? activeLabel
              : "Belum Ada Data"}
        </span>
      </div>

      {/* CHART */}
      <div className="flex items-end justify-between gap-2 h-28 my-3 px-1">
        {weeklyData.length > 0 ? (
          weeklyData.map((item) => {
            const hasValue =
              item.stressLevel !== null &&
              item.stressLevel !== undefined;

            const stressTheme =
              getStressTheme(item.stressLevel);

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
                {/* VALUE */}
                {hasValue && (
                  <span
                    className={`text-[9px] font-bold ${isToday
                        ? stressTheme.text
                        : "text-brown-700"
                      }`}
                  >
                    {item.stressLevel}
                  </span>
                )}

                {/* BAR */}
                <div
                  style={{
                    height: `${Math.max(
                      percent,
                      hasValue ? 15 : 10,
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

                {/* DAY */}
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
          })
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-brown-700">
            {loading
              ? "Memuat data assessment..."
              : "Belum ada data assessment minggu ini."}
          </div>
        )}
      </div>

      {/* FOOTER */}
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
                  item.stressLevel !== undefined,
              ).length
            }{" "}
            hari terisi
          </span>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <span className="text-[9px] text-red-500/70 mt-2">
          Histori Daily Assessment gagal dimuat.
        </span>
      )}
    </div>
  );
}


