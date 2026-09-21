"use client";

import { useState, useEffect } from "react";

export default function StreakCard() {
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    async function loadStreak() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.stats?.streak) {
            setStreak(data.stats.streak);
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    loadStreak();
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 border border-brown-900/10 bg-gradient-to-br from-orange-100/40 to-white flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
          Pencapaian Streak
        </span>
        <span className="font-display text-3xl font-extrabold text-brown-900 mt-1">
          {streak} Hari Aktif
        </span>
        <span className="text-xs text-brown-700 mt-0.5">Target: 365 Hari Mental Health Plan</span>
      </div>
      <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white font-display font-bold flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
        🔥
      </div>
    </div>
  );
}
