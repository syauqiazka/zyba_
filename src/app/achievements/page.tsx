"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Flame,
  Trophy,
  Zap,
  Heart,
  MessageSquare,
  Users,
  Activity,
  Sparkles,
  X,
  Edit3,
  Plus,
  Pin,
  type LucideIcon,
} from "lucide-react";
import BadgePickerModal from "./BadgePickerModal";
import BadgeLucideIcon from "./BadgeLucideIcon";

type AchievementCategory = "ALL" | "STREAK" | "WELLNESS" | "SOSIAL" | "COMPANION" | "AKTIVITAS" | "SPESIAL";

interface AchievementWithStatus {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  category: string;
  xpReward: number;
  badgeColor: string;
  badgeTextColor: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface PinnedBadge {
  slot: number;
  badgeKey: string;
  badgeName?: string;
  icon?: string;
  customLabel?: string;
}

const CATEGORY_ITEMS: { id: AchievementCategory; label: string; icon: LucideIcon }[] = [
  { id: "ALL", label: "Semua", icon: Trophy },
  { id: "STREAK", label: "Streak", icon: Flame },
  { id: "WELLNESS", label: "Wellness", icon: Heart },
  { id: "COMPANION", label: "Companion", icon: MessageSquare },
  { id: "SOSIAL", label: "Sosial", icon: Users },
  { id: "AKTIVITAS", label: "Aktivitas", icon: Activity },
  { id: "SPESIAL", label: "Spesial", icon: Sparkles },
];

const SLOT_LABELS = ["Badge 1", "Badge 2", "Badge 3"];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [pinnedBadges, setPinnedBadges] = useState<(PinnedBadge | null)[]>([null, null, null]);
  const [totalXp, setTotalXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [totalUnlocked, setTotalUnlocked] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>("ALL");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [achRes, badgeRes] = await Promise.all([
        fetch("/api/achievements"),
        fetch("/api/badges"),
      ]);
      const achData = await achRes.json();
      const badgeData = await badgeRes.json();

      if (!achRes.ok) {
        console.error("[Achievements] API error:", achRes.status, achData);
        setApiError(achData?.error || `HTTP ${achRes.status}`);
      } else if (achData.achievements) {
        setAchievements(achData.achievements);
        setTotalXp(achData.totalXp ?? 0);
        setStreakDays(achData.streakDays ?? 0);
        setTotalUnlocked(achData.totalUnlocked ?? 0);
        setTotalCount(achData.totalCount ?? achData.achievements.length);
      }
      if (badgeData.badges) {
        const slots: (PinnedBadge | null)[] = [null, null, null];
        for (const b of badgeData.badges) {
          if (b.slot >= 0 && b.slot <= 2) slots[b.slot] = b;
        }
        setPinnedBadges(slots);
      }
    } catch (e) {
      console.error("[AchievementsPage] Error fetching data:", e);
      setApiError("Gagal memuat data. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePinBadge = async (slot: number, badgeKey: string, customLabel?: string) => {
    try {
      await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, badgeKey, customLabel }),
      });
      setPickerSlot(null);
      fetchData();
    } catch (err) {
      console.error("Pin badge error:", err);
    }
  };

  const handleRemoveBadge = async (slot: number) => {
    try {
      await fetch(`/api/badges?slot=${slot}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Remove badge error:", err);
    }
  };

  const filtered =
    activeCategory === "ALL"
      ? achievements
      : achievements.filter(
          (a) => a.category.toUpperCase() === activeCategory.toUpperCase()
        );

  const unlockedCount = totalUnlocked;
  const maxBadges = totalCount || achievements.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-brown-700">Memuat pencapaian…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full pb-12">
      {/* ── Header ── */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-brown-900">
          Pencapaian & Badge
        </h1>
        <p className="text-xs sm:text-sm text-brown-700 mt-1">
          Rayakan perjalanan kesehatan fisik, mental, dan sosialmu bersama ZYBA.
        </p>
      </div>

      {/* Error Banner */}
      {apiError && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 text-sm text-orange-700 flex items-center gap-2">
          <Sparkles size={15} className="shrink-0" />
          <span>
            Gagal memuat badge: <strong>{apiError}</strong>.{" "}
            <button onClick={fetchData} className="underline font-bold">Coba lagi</button>
          </span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          value={`${streakDays} Hari`}
          label="Streak"
          icon={Flame}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          value={`${unlockedCount}`}
          label="Badge Diraih"
          icon={Trophy}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          value={`${totalXp} XP`}
          label="Total XP"
          icon={Zap}
          color="bg-cream text-brown-800"
        />
      </div>

      {/* ── Pinned Badges (Badge Tampilan Profil) ── */}
      <div className="bg-white rounded-3xl border border-brown-900/10 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-base text-brown-900">
              Badge Tampilan Profil
            </h2>
            <p className="text-xs text-brown-700 mt-0.5">
              Pilih hingga 3 badge kehormatan untuk disematkan di kartu profilmu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {pinnedBadges.map((badge, slot) => {
            const def = badge
              ? achievements.find((a) => a.key === badge.badgeKey)
              : null;
            return (
              <div key={slot} className="relative group">
                {def ? (
                  <div
                    className={`rounded-2xl p-4 flex flex-col items-center gap-2 border border-brown-900/10 ${def.badgeColor} transition-all`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                      <BadgeLucideIcon name={def.icon} className={`w-6 h-6 ${def.badgeTextColor}`} />
                    </div>
                    <span
                      className={`text-xs font-bold text-center leading-tight ${def.badgeTextColor}`}
                    >
                      {badge?.customLabel || def.title}
                    </span>

                    {/* Action buttons with touch friendly min 44px */}
                    <button
                      type="button"
                      onClick={() => handleRemoveBadge(slot)}
                      className="absolute top-1.5 right-1.5 min-h-[32px] min-w-[32px] rounded-full bg-white/90 hover:bg-rose-500 hover:text-white text-brown-700 flex items-center justify-center transition-colors shadow-xs"
                      title="Hapus badge dari profil"
                      aria-label="Hapus badge"
                    >
                      <X size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerSlot(slot)}
                      className="absolute bottom-1.5 right-1.5 min-h-[32px] min-w-[32px] rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-brown-700 flex items-center justify-center transition-colors shadow-xs"
                      title="Ganti badge"
                      aria-label="Ganti badge"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickerSlot(slot)}
                    className="w-full min-h-[110px] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brown-900/15 hover:border-orange-500/50 hover:bg-orange-50/50 transition-all text-brown-700/60 hover:text-orange-600 active:scale-95"
                  >
                    <Plus size={22} className="opacity-40" />
                    <span className="text-xs font-bold">{SLOT_LABELS[slot]}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Progress Bar Berdasarkan Real UserBadge ── */}
      <div className="bg-white rounded-3xl border border-brown-900/10 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm text-brown-900">
            Progress Koleksi Badge
          </span>
          <span className="text-xs text-brown-700 font-bold">
            {unlockedCount} / {maxBadges} Badge Diraih
          </span>
        </div>
        <div className="h-3 bg-brown-900/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-green-500 rounded-full transition-all duration-700"
            style={{
              width: `${maxBadges > 0 ? (unlockedCount / maxBadges) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_ITEMS.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`min-h-[40px] shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? "bg-brown-900 text-white shadow-sm"
                  : "bg-white border border-brown-900/10 text-brown-700 hover:bg-cream"
              }`}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Achievement Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pb-8">
        {filtered.map((ach) => (
          <AchievementCard
            key={ach.key}
            achievement={ach}
            onPin={(key) => {
              const emptySlot = pinnedBadges.findIndex((s) => s === null);
              if (emptySlot !== -1) handlePinBadge(emptySlot, key);
              else setPickerSlot(0);
            }}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-brown-700/60 text-sm">
            Belum ada badge di kategori ini.
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

function StatCard({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col items-center gap-1.5 border border-brown-900/8 ${
        color.split(" ")[0]
      } shadow-xs`}
    >
      <Icon size={22} className={color.split(" ")[1]} />
      <span className={`font-display font-bold text-lg ${color.split(" ")[1]}`}>
        {value}
      </span>
      <span className="text-xs text-brown-700/80 font-medium">{label}</span>
    </div>
  );
}

function AchievementCard({
  achievement,
  onPin,
}: {
  achievement: AchievementWithStatus;
  onPin: (key: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-3xl p-5 flex flex-col items-center text-center gap-2.5 border transition-all duration-200 ${
        achievement.unlocked
          ? `${achievement.badgeColor} border-brown-900/10 shadow-xs hover:shadow-md hover:-translate-y-0.5`
          : "bg-white/80 border-brown-900/8 opacity-60 grayscale"
      }`}
      title={achievement.description}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-transform ${
          achievement.unlocked ? "bg-white" : "bg-cream"
        }`}
      >
        <BadgeLucideIcon
          name={achievement.icon}
          className={`w-7 h-7 ${
            achievement.unlocked ? achievement.badgeTextColor : "text-brown-700/60"
          }`}
        />
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span
          className={`text-sm font-bold leading-tight ${
            achievement.unlocked ? achievement.badgeTextColor : "text-brown-700"
          }`}
        >
          {achievement.title}
        </span>
        <span className="text-[10px] font-bold text-brown-700/60 uppercase tracking-wider">
          +{achievement.xpReward} XP
        </span>
      </div>

      <p className="text-xs text-brown-700/80 leading-relaxed max-w-[220px]">
        {achievement.description}
      </p>

      {achievement.unlocked && achievement.unlockedAt && (
        <span className="text-[10px] font-semibold text-green-700 bg-white/70 px-2 py-0.5 rounded-full mt-1">
          Diraih pada{" "}
          {new Date(achievement.unlockedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </span>
      )}

      {/* Pin button on hover / active (unlocked only) with Lucide Pin */}
      {achievement.unlocked && (
        <button
          type="button"
          onClick={() => onPin(achievement.key)}
          className={`min-h-[36px] min-w-[36px] rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-sm hover:bg-orange-600 transition-all ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-90 sm:opacity-0"
          } absolute top-3 right-3`}
          title="Pasang ke profil"
          aria-label="Pasang ke profil"
        >
          <Pin size={16} />
        </button>
      )}
    </div>
  );
}
