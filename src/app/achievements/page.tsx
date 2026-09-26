"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ACHIEVEMENT_DEFS, AchievementDef } from "@/lib/achievements/definitions";
import BadgePickerModal from "./BadgePickerModal";

type AchievementCategory = "ALL" | "STREAK" | "WELLNESS" | "SOCIAL" | "COMPANION" | "ACTIVITY" | "SPECIAL";

interface AchievementWithStatus extends AchievementDef {
  unlocked: boolean;
  unlockedAt: string | null;
}

interface PinnedBadge {
  slot: number;
  badgeKey: string;
  customLabel?: string;
}

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  ALL: "Semua",
  STREAK: "🔥 Streak",
  WELLNESS: "🧘 Wellness",
  COMPANION: "💬 Companion",
  SOCIAL: "🤝 Sosial",
  ACTIVITY: "⚡ Aktivitas",
  SPECIAL: "✨ Spesial",
};

const SLOT_LABELS = ["Badge 1", "Badge 2", "Badge 3"];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [pinnedBadges, setPinnedBadges] = useState<(PinnedBadge | null)[]>([null, null, null]);
  const [totalXp, setTotalXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [totalUnlocked, setTotalUnlocked] = useState(0);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>("ALL");
  const [loading, setLoading] = useState(true);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [achRes, badgeRes] = await Promise.all([
        fetch("/api/achievements"),
        fetch("/api/badges"),
      ]);
      const achData = await achRes.json();
      const badgeData = await badgeRes.json();

      if (achData.achievements) {
        setAchievements(achData.achievements);
        setTotalXp(achData.totalXp ?? 0);
        setStreakDays(achData.streakDays ?? 0);
        setTotalUnlocked(achData.totalUnlocked ?? 0);
      }
      if (badgeData.badges) {
        const slots: (PinnedBadge | null)[] = [null, null, null];
        for (const b of badgeData.badges) {
          if (b.slot >= 0 && b.slot <= 2) slots[b.slot] = b;
        }
        setPinnedBadges(slots);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePinBadge = async (slot: number, badgeKey: string, customLabel?: string) => {
    await fetch("/api/badges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, badgeKey, customLabel }),
    });
    setPickerSlot(null);
    fetchData();
  };

  const handleRemoveBadge = async (slot: number) => {
    await fetch(`/api/badges?slot=${slot}`, { method: "DELETE" });
    fetchData();
  };

  const filtered = activeCategory === "ALL"
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-brown-700">Memuat pencapaian…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-brown-900">
          Pencapaian & Badge
        </h1>
        <p className="text-sm text-brown-700 mt-1">
          Rayakan perjalanan kesehatanmu bersama ZYBA.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value={`${streakDays}d`} label="Streak" icon="🔥" color="bg-orange-100 text-orange-600" />
        <StatCard value={`${totalUnlocked}`} label="Diraih" icon="🏆" color="bg-green-100 text-green-700" />
        <StatCard value={`${totalXp} XP`} label="Total XP" icon="⚡" color="bg-cream text-brown-700" />
      </div>

      {/* ── Pinned Badges (Custom Badge Slots) ── */}
      <div className="bg-white rounded-2xl border border-brown-900/10 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-base text-brown-900">Badge Tampilan</h2>
            <p className="text-xs text-brown-700 mt-0.5">Pilih hingga 3 badge untuk ditampilkan di profilmu.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {pinnedBadges.map((badge, slot) => {
            const def = badge ? achievements.find((a) => a.key === badge.badgeKey) : null;
            return (
              <div key={slot} className="relative group">
                {def ? (
                  <div className={`rounded-2xl p-4 flex flex-col items-center gap-2 border border-brown-900/10 ${def.badgeColor} transition-all`}>
                    <span className="text-3xl">{def.icon}</span>
                    <span className={`text-xs font-bold text-center leading-tight ${def.badgeTextColor}`}>
                      {badge?.customLabel || def.title}
                    </span>
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveBadge(slot)}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brown-900/10 hover:bg-danger hover:text-white text-brown-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      title="Hapus badge"
                    >
                      ×
                    </button>
                    <button
                      onClick={() => setPickerSlot(slot)}
                      className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-brown-900/10 hover:bg-orange-500 hover:text-white text-brown-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      title="Ganti badge"
                    >
                      ✎
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPickerSlot(slot)}
                    className="w-full rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-dashed border-brown-900/15 hover:border-orange-500/50 hover:bg-orange-50 transition-all"
                  >
                    <span className="text-2xl opacity-30">＋</span>
                    <span className="text-xs text-brown-700/60 font-medium">{SLOT_LABELS[slot]}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="bg-white rounded-2xl border border-brown-900/10 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm text-brown-900">Progress Keseluruhan</span>
          <span className="text-xs text-brown-700 font-bold">{unlockedCount} / {totalCount}</span>
        </div>
        <div className="h-2.5 bg-brown-900/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${totalCount ? (unlockedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-brown-900 text-white shadow-sm"
                : "bg-white border border-brown-900/10 text-brown-700 hover:bg-cream"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* ── Achievement Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-10">
        {filtered.map((ach) => (
          <AchievementCard key={ach.key} achievement={ach} onPin={(key) => {
            // Find first empty slot
            const emptySlot = pinnedBadges.findIndex((s) => s === null);
            if (emptySlot !== -1) handlePinBadge(emptySlot, key);
            else setPickerSlot(0); // open picker to choose which slot to replace
          }} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-brown-700/50 text-sm">
            Belum ada pencapaian di kategori ini.
          </div>
        )}
      </div>

      {/* ── Badge Picker Modal ── */}
      {pickerSlot !== null && (
        <BadgePickerModal
          slot={pickerSlot}
          unlockedAchievements={achievements.filter((a) => a.unlocked)}
          currentBadgeKey={pinnedBadges[pickerSlot]?.badgeKey}
          onSelect={(key, label) => handlePinBadge(pickerSlot, key, label)}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}

function StatCard({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) {
  return (
    <div className={`rounded-2xl p-4 flex flex-col items-center gap-1 border border-brown-900/8 ${color.split(" ")[0]} shadow-xs`}>
      <span className="text-xl">{icon}</span>
      <span className={`font-display font-bold text-lg ${color.split(" ")[1]}`}>{value}</span>
      <span className="text-xs text-brown-700/70">{label}</span>
    </div>
  );
}

function AchievementCard({ achievement, onPin }: { achievement: AchievementWithStatus; onPin: (key: string) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl p-4 flex flex-col items-center gap-2 border transition-all duration-200 cursor-default
        ${achievement.unlocked
          ? `${achievement.badgeColor} border-brown-900/10 shadow-xs hover:shadow-md hover:-translate-y-0.5`
          : "bg-white border-brown-900/8 opacity-50 grayscale"
        }`}
      title={achievement.description}
    >
      <span className="text-3xl">{achievement.icon}</span>
      <span className={`text-xs font-bold text-center leading-tight ${achievement.unlocked ? achievement.badgeTextColor : "text-brown-700"}`}>
        {achievement.title}
      </span>
      {achievement.unlocked && achievement.unlockedAt && (
        <span className="text-[10px] text-brown-700/50">
          {new Date(achievement.unlockedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
        </span>
      )}
      {!achievement.unlocked && (
        <span className="text-[10px] text-brown-700/40 text-center">{achievement.description}</span>
      )}

      {/* Pin button on hover (unlocked only) */}
      {achievement.unlocked && hovered && (
        <button
          onClick={() => onPin(achievement.key)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-sm hover:bg-orange-600 transition-colors"
          title="Pasang ke profil"
        >
          📌
        </button>
      )}
    </div>
  );
}
