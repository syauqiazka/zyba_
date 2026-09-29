"use client";

import React from "react";
import {
  Flame,
  Heart,
  MessageSquare,
  Users,
  BookOpen,
  Wind,
  Zap,
  Activity,
  Sparkles,
  Trophy,
  Smile,
  Shield,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Heart,
  MessageSquare,
  Users,
  BookOpen,
  Wind,
  Zap,
  Activity,
  Sparkles,
  Trophy,
  Smile,
  Shield,
  ThumbsUp,
};

export default function BadgeLucideIcon({
  name,
  className = "w-6 h-6",
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = ICON_MAP[name] || Trophy;
  return <IconComponent className={className} />;
}
