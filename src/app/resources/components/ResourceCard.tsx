"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Headphones,
  Moon,
  GraduationCap,
  Brain,
  Heart,
  Zap,
  ArrowRight,
} from "lucide-react";
import { getResourceSlug } from "@/lib/resourceSlug";

export interface ResourceItem {
  id: string;
  type: "ARTICLE" | "COURSE" | "AUDIO";
  title: string;
  author: string;
  duration: string;
  category: string;
  isPro: boolean;
  iconName:
    | "book"
    | "headphones"
    | "moon"
    | "graduation"
    | "brain"
    | "heart"
    | "music";
  desc: string;
  audioUrl?: string;
  articleContent?: string[];
}

interface ResourceCardProps {
  item: ResourceItem;
  onClick: () => void;
}

const ICON_THEMES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  headphones: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-500/25",
  },
  book: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-500/25",
  },
  moon: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-500/25",
  },
  graduation: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-500/25",
  },
  brain: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-500/25",
  },
  heart: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    border: "border-rose-500/25",
  },
  music: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-500/25",
  },
};

export function ResourceIcon({
  name,
  className = "w-6 h-6",
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "headphones":
      return <Headphones className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "moon":
      return <Moon className={className} />;
    case "graduation":
      return <GraduationCap className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "heart":
      return <Heart className={className} />;
    case "music":
      return <Headphones className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

export default function ResourceCard({
  item,
  onClick,
}: ResourceCardProps) {
  const theme = ICON_THEMES[item.iconName] || ICON_THEMES.book;
  const resourceSlug = getResourceSlug(item.title);

  return (
    <div
      onClick={onClick}
      className="glass-card glass-card-hover rounded-3xl p-6 border border-brown-900/10 cursor-pointer flex flex-col justify-between bg-white group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      {item.isPro && (
        <span className="absolute top-4 right-4 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-sm flex items-center gap-1">
          <Zap size={11} className="fill-white" /> PRO
        </span>
      )}

      <div>
        <div
          className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} ${theme.border} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs`}
        >
          <ResourceIcon
            name={item.iconName}
            className="w-7 h-7"
          />
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-100/70 px-2 py-0.5 rounded-md">
            {item.category}
          </span>

          <span className="text-[11px] font-medium text-brown-700/70">
            • {item.duration}
          </span>
        </div>

        <h3 className="font-display font-bold text-base text-brown-900 leading-snug">
          <Link
            href={`/resources/${resourceSlug}`}
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="hover:text-orange-500 transition-colors"
          >
            {item.title}
          </Link>
        </h3>

        <p className="text-xs text-brown-700 mt-2 leading-relaxed">
          {item.desc}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-brown-900/10 text-xs font-bold text-brown-900">
        <span className="text-brown-700/80 font-medium">
          Oleh {item.author}
        </span>

        <div className="flex items-center gap-3">
          <Link
            href={`/resources/${resourceSlug}`}
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="text-brown-700/80 hover:text-brown-900 transition-colors"
          >
            Detail
          </Link>

          <span className="text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            {item.type === "COURSE" ? "Mulai Audio" : "Baca Artikel"}
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
