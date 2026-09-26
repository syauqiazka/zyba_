/**
 * ZYBA Achievement Definitions
 * Single source of truth — synced to DB via seed or upsert.
 */

export type AchievementCategory =
  | "STREAK"
  | "WELLNESS"
  | "SOCIAL"
  | "COMPANION"
  | "ACTIVITY"
  | "SPECIAL";

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;           // emoji
  category: AchievementCategory;
  threshold?: number;
  isSecret?: boolean;
  xpReward: number;
  badgeColor: string;     // Tailwind bg class for the badge card
  badgeTextColor: string; // Tailwind text class
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ── STREAK ──────────────────────────────────────────────────────
  {
    key: "streak_1",
    title: "Hari Pertama",
    description: "Selesaikan sesi pertamamu bersama ZYBA.",
    icon: "🌱",
    category: "STREAK",
    threshold: 1,
    xpReward: 10,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },
  {
    key: "streak_3",
    title: "3 Hari Berturut-turut",
    description: "Aktif selama 3 hari tanpa jeda.",
    icon: "🔥",
    category: "STREAK",
    threshold: 3,
    xpReward: 25,
    badgeColor: "bg-orange-100",
    badgeTextColor: "text-orange-600",
  },
  {
    key: "streak_7",
    title: "Semangat Sepekan",
    description: "7 hari streak — kamu luar biasa!",
    icon: "⚡",
    category: "STREAK",
    threshold: 7,
    xpReward: 50,
    badgeColor: "bg-orange-100",
    badgeTextColor: "text-orange-600",
  },
  {
    key: "streak_14",
    title: "Dua Pekan Penuh",
    description: "14 hari streak. Konsistensimu menginspirasi.",
    icon: "🎯",
    category: "STREAK",
    threshold: 14,
    xpReward: 100,
    badgeColor: "bg-orange-100",
    badgeTextColor: "text-orange-700",
  },
  {
    key: "streak_30",
    title: "Satu Bulan Bersama ZYBA",
    description: "30 hari berturut-turut. Kamu sungguh luar biasa!",
    icon: "🏆",
    category: "STREAK",
    threshold: 30,
    xpReward: 300,
    badgeColor: "bg-mood-happy/20",
    badgeTextColor: "text-brown-900",
  },

  // ── WELLNESS ────────────────────────────────────────────────────
  {
    key: "mood_first",
    title: "Mood Pertama",
    description: "Catat mood pertamamu di Mood Check-In.",
    icon: "🙂",
    category: "WELLNESS",
    threshold: 1,
    xpReward: 10,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },
  {
    key: "mood_10",
    title: "10 Mood Tercatat",
    description: "Catat mood 10 kali — kamu mulai mengenal dirimu.",
    icon: "📊",
    category: "WELLNESS",
    threshold: 10,
    xpReward: 40,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },
  {
    key: "mood_30",
    title: "Jurnal Mood Sebulan",
    description: "30 entri mood tercatat. Analisis emosi yang mendalam!",
    icon: "📈",
    category: "WELLNESS",
    threshold: 30,
    xpReward: 100,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },
  {
    key: "journal_first",
    title: "Penulis Pertama",
    description: "Tulis entri jurnal pertamamu.",
    icon: "📝",
    category: "WELLNESS",
    threshold: 1,
    xpReward: 10,
    badgeColor: "bg-cream",
    badgeTextColor: "text-brown-700",
  },
  {
    key: "journal_10",
    title: "10 Catatan Jiwa",
    description: "10 entri jurnal ditulis dengan sepenuh hati.",
    icon: "📔",
    category: "WELLNESS",
    threshold: 10,
    xpReward: 60,
    badgeColor: "bg-cream",
    badgeTextColor: "text-brown-700",
  },

  // ── COMPANION ───────────────────────────────────────────────────
  {
    key: "companion_first",
    title: "Sapa ZYBA",
    description: "Kirim pesan pertamamu ke Zyba Companion.",
    icon: "💬",
    category: "COMPANION",
    threshold: 1,
    xpReward: 10,
    badgeColor: "bg-orange-100",
    badgeTextColor: "text-orange-600",
  },
  {
    key: "companion_10",
    title: "Teman Ngobrol",
    description: "10 percakapan bersama Zyba Companion.",
    icon: "🤝",
    category: "COMPANION",
    threshold: 10,
    xpReward: 50,
    badgeColor: "bg-orange-100",
    badgeTextColor: "text-orange-600",
  },
  {
    key: "companion_50",
    title: "Cerita Tanpa Batas",
    description: "50 percakapan. Zyba selalu ada untukmu.",
    icon: "🌟",
    category: "COMPANION",
    threshold: 50,
    xpReward: 150,
    badgeColor: "bg-orange-100",
    badgeTextColor: "text-orange-700",
  },

  // ── SOCIAL ──────────────────────────────────────────────────────
  {
    key: "community_first_post",
    title: "Suara Pertama",
    description: "Buat postingan pertamamu di Zyba Community.",
    icon: "📢",
    category: "SOCIAL",
    threshold: 1,
    xpReward: 20,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },
  {
    key: "community_supporter",
    title: "Supporter",
    description: "Berikan 10 like di postingan komunitas.",
    icon: "❤️",
    category: "SOCIAL",
    threshold: 10,
    xpReward: 30,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },

  // ── ACTIVITY ────────────────────────────────────────────────────
  {
    key: "activity_first",
    title: "Gerak Pertama",
    description: "Selesaikan aktivitas fisik pertamamu.",
    icon: "🏃",
    category: "ACTIVITY",
    threshold: 1,
    xpReward: 15,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },
  {
    key: "activity_7",
    title: "Aktif Seminggu",
    description: "7 aktivitas fisik selesai.",
    icon: "💪",
    category: "ACTIVITY",
    threshold: 7,
    xpReward: 75,
    badgeColor: "bg-green-100",
    badgeTextColor: "text-green-700",
  },

  // ── SPECIAL ─────────────────────────────────────────────────────
  {
    key: "early_adopter",
    title: "Early Adopter",
    description: "Bergabung di awal peluncuran ZYBA. Terima kasih!",
    icon: "🚀",
    category: "SPECIAL",
    isSecret: false,
    xpReward: 50,
    badgeColor: "bg-mood-depressed/20",
    badgeTextColor: "text-brown-900",
  },
  {
    key: "assessment_complete",
    title: "Kenali Dirimu",
    description: "Selesaikan assessment kesehatan mental pertamamu.",
    icon: "🧠",
    category: "SPECIAL",
    threshold: 1,
    xpReward: 30,
    badgeColor: "bg-mood-depressed/20",
    badgeTextColor: "text-brown-900",
  },
  {
    key: "zyba_sakura",
    title: "Bunga Sakura ZYBA",
    description: "Badge eksklusif berbentuk bunga sakura ZYBA — diraih oleh pengguna setia.",
    icon: "🌸",
    category: "SPECIAL",
    isSecret: true,
    xpReward: 200,
    badgeColor: "bg-mood-sad/30",
    badgeTextColor: "text-brown-900",
  },
];

export const achievementMap = Object.fromEntries(
  ACHIEVEMENT_DEFS.map((a) => [a.key, a])
) as Record<string, AchievementDef>;
