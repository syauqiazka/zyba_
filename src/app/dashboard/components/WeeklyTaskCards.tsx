"use client";

import Link from "next/link";
import { Smile, Wind, BookOpen, HeartHandshake, ArrowRight } from "lucide-react";

interface WeeklyTaskCardsProps {
  hasAssessment: boolean;
  streak: number;
}

/**
 * Pintasan langkah kecil — daftar baris datar, bukan kartu.
 * Tidak menampilkan persentase/progres karangan: belum ada data nyata untuk itu.
 */
export default function WeeklyTaskCards({ hasAssessment }: WeeklyTaskCardsProps) {
  const tasks = [
    {
      id: "mood-check",
      title: "Mood Check-In",
      desc: hasAssessment ? "Tambah refleksi hari ini" : "Catat perasaanmu, cukup 1–2 menit",
      icon: Smile,
      href: "/mood-check-in",
    },
    {
      id: "breathing",
      title: "Latihan Napas 4-7-8",
      desc: "Redakan tegang dalam 3 menit",
      icon: Wind,
      href: "/activity",
    },
    {
      id: "journaling",
      title: "Jurnal Emosi",
      desc: "Lihat pola dan catatan perjalananmu",
      icon: BookOpen,
      href: "/wellness-journey",
    },
    {
      id: "community",
      title: "Zyba Community",
      desc: "Baca dan berbagi cerita di ruang aman",
      icon: HeartHandshake,
      href: "/community",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <h3 className="font-display text-base sm:text-lg font-bold text-brown-900 tracking-tight mb-1">
        Langkah kecil hari ini
      </h3>

      <ul className="flex flex-col divide-y divide-brown-900/10">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <li key={task.id}>
              <Link
                href={task.href}
                className="group flex items-center gap-3 py-3 px-2 -mx-2 rounded-xl hover:bg-brown-900/5 transition-colors"
              >
                <Icon size={18} strokeWidth={1.8} className="text-brown-700 shrink-0" aria-hidden />
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-brown-900 truncate">{task.title}</span>
                  <span className="text-xs text-brown-700 truncate">{task.desc}</span>
                </span>
                <ArrowRight
                  size={14}
                  className="ml-auto text-brown-700/40 group-hover:text-orange-500 transition-colors shrink-0"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
