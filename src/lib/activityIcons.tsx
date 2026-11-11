import React from "react";
import {
  Footprints,
  Activity,
  Dumbbell,
  Wind,
  Flower2,
  Sun,
  Flame,
  Bike,
  Waves,
  Coffee,
  Sparkles,
  Heart,
  Music,
  Smile,
  LucideIcon,
} from "lucide-react";

export interface ActivityIconOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const ACTIVITY_ICON_OPTIONS: ActivityIconOption[] = [
  { key: "walk", label: "Jalan Santai", icon: Footprints },
  { key: "stretch", label: "Stretching", icon: Activity },
  { key: "workout", label: "Workout", icon: Dumbbell },
  { key: "breathe", label: "Pernapasan", icon: Wind },
  { key: "meditate", label: "Meditasi", icon: Flower2 },
  { key: "sun", label: "Sinar Pagi", icon: Sun },
  { key: "run", label: "Kardio / Lari", icon: Flame },
  { key: "bike", label: "Bersepeda", icon: Bike },
  { key: "swim", label: "Berenang", icon: Waves },
  { key: "rest", label: "Rehat Tenang", icon: Coffee },
  { key: "sparkles", label: "Kebiasaan Sehat", icon: Sparkles },
  { key: "heart", label: "Perhatian Tubuh", icon: Heart },
  { key: "music", label: "Relaksasi Audio", icon: Music },
];

const EMOJI_TO_KEY_MAP: Record<string, string> = {
  "🚶": "walk",
  "🏃": "run",
  "🤸": "stretch",
  "🏋️": "workout",
  "🏋": "workout",
  "🧘": "meditate",
  "🫁": "breathe",
  "🚴": "bike",
  "🏊": "swim",
  "☕": "rest",
  "🧍": "rest",
  "☀️": "sun",
  "🌞": "sun",
  "✨": "sparkles",
  "❤️": "heart",
  "🎵": "music",
  "🎶": "music",
  "⚽": "workout",
  "🛹": "workout",
  "🧗": "workout",
};

const KEY_TO_ICON_MAP: Record<string, LucideIcon> = {
  walk: Footprints,
  run: Flame,
  stretch: Activity,
  workout: Dumbbell,
  breathe: Wind,
  meditate: Flower2,
  sun: Sun,
  bike: Bike,
  swim: Waves,
  rest: Coffee,
  sparkles: Sparkles,
  heart: Heart,
  music: Music,
};

/**
 * Universal icon renderer that intercepts both semantic keys and legacy emojis,
 * ensuring anti-slop SVG rendering across the entire activity ecosystem.
 */
export function renderActivityIcon(
  keyOrEmoji: string | undefined | null,
  className = "w-5 h-5",
  strokeWidth = 1.8
): React.ReactElement {
  if (!keyOrEmoji) {
    return <Activity className={className} strokeWidth={strokeWidth} />;
  }

  // Check if it's an emoji mapped to a key
  const resolvedKey = EMOJI_TO_KEY_MAP[keyOrEmoji] || keyOrEmoji.toLowerCase().trim();
  const IconComponent = KEY_TO_ICON_MAP[resolvedKey] || Activity;

  return <IconComponent className={className} strokeWidth={strokeWidth} />;
}

