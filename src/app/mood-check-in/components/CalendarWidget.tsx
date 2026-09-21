"use client";

import React, { useMemo } from "react";

interface MoodDay {
  day: number;
  mood: string | null; // null = no entry recorded
}

interface CalendarWidgetProps {
  moodEntries?: MoodDay[];
}

const MOOD_COLORS: Record<string, string> = {
  DEPRESSED: "bg-mood-depressed",
  SAD: "bg-mood-sad",
  NEUTRAL: "bg-mood-neutral",
  HAPPY: "bg-mood-happy",
  OVERJOYED: "bg-mood-overjoyed",
};

const MOOD_LABEL_ID: Record<string, string> = {
  DEPRESSED: "Depressed",
  SAD: "Sad",
  NEUTRAL: "Neutral",
  HAPPY: "Happy",
  OVERJOYED: "Overjoyed",
};

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function CalendarWidget({ moodEntries = [] }: CalendarWidgetProps) {
  const today = new Date();
  const todayDate = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  // Number of days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day of week the 1st falls on (0=Sun ... 6=Sat)
  const firstWeekday = new Date(year, month, 1).getDay();

  // Build a lookup map: day → mood
  const moodMap = useMemo(() => {
    const map: Record<number, string | null> = {};
    moodEntries.forEach(({ day, mood }) => {
      map[day] = mood;
    });
    return map;
  }, [moodEntries]);

  // Compute dominant mood stats from entries
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moodEntries.forEach(({ mood }) => {
      if (mood) counts[mood] = (counts[mood] || 0) + 1;
    });
    return counts;
  }, [moodEntries]);

  const totalEntries = Object.values(moodCounts).reduce((a, b) => a + b, 0);
  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return (
    <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-brown-900">
          Kalender Mood Bulanan
        </h3>
        <span className="text-xs text-brown-700 font-semibold">
          {MONTH_NAMES[month]} {year}
        </span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-[10px] font-bold text-brown-700/60 pb-1">
            {d}
          </span>
        ))}

        {/* Empty offset cells before the 1st */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isFuture = day > todayDate;
          const isToday = day === todayDate;
          const mood = moodMap[day] ?? null;

          let cellBg = "";
          let textColor = "text-brown-700";

          if (isFuture) {
            // future — blank
            cellBg = "";
            textColor = "text-brown-700/30";
          } else if (mood) {
            // has a recorded mood
            cellBg = MOOD_COLORS[mood] ?? "bg-green-100";
            textColor = mood === "HAPPY" ? "text-brown-900" : "text-white";
          } else {
            // past with no entry
            cellBg = "bg-brown-900/5";
            textColor = "text-brown-700/50";
          }

          return (
            <div
              key={day}
              title={mood ? MOOD_LABEL_ID[mood] : undefined}
              className={`h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all
                ${cellBg} ${textColor}
                ${isToday ? "ring-2 ring-orange-500 ring-offset-1" : ""}
                ${!isFuture && !mood ? "border border-dashed border-brown-900/10" : ""}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between text-[11px] text-brown-700 pt-2 border-t border-brown-900/10">
        {totalEntries === 0 ? (
          <span className="text-brown-700/50 italic">Belum ada data mood bulan ini</span>
        ) : (
          <>
            {topMoods[0] && (
              <span className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${MOOD_COLORS[topMoods[0][0]]}`} />
                Dominan: {MOOD_LABEL_ID[topMoods[0][0]]} ({Math.round((topMoods[0][1] / totalEntries) * 100)}%)
              </span>
            )}
            {topMoods[1] && (
              <span className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${MOOD_COLORS[topMoods[1][0]]}`} />
                {MOOD_LABEL_ID[topMoods[1][0]]} ({Math.round((topMoods[1][1] / totalEntries) * 100)}%)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
