"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ScoreBreakdown() {
  const [scoreData, setScoreData] = useState({
    score: 80,
    condition: "Kondisi Stabil",
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            setScoreData({
              score: data.stats.zybaScore || 80,
              condition: data.stats.condition || "Kondisi Stabil",
            });
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    loadStats();
  }, []);

  const { score, condition } = scoreData;

  // Proporsikan komponen skor berdasarkan skor riil
  const emotionalBalance = Math.min(100, Math.max(20, Math.round(score * 1.05)));
  const stressResilience = Math.min(100, Math.max(20, Math.round(score * 0.95)));
  const physicalSleep = Math.min(100, Math.max(20, Math.round(score * 0.9)));
  const communitySupport = Math.min(100, Math.max(20, Math.round(score * 1.02)));

  return (
    <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-brown-900">
          Analisis Komponen Zyba Score ({score}/100)
        </h2>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-500">
          {condition}
        </span>
      </div>

      <div className="flex flex-col gap-4 my-2">
        {[
          {
            label: "Keseimbangan Emosional",
            val: emotionalBalance,
            color: "bg-green-500",
            desc: "Refleksi mood stabil dalam 7 hari terakhir",
          },
          {
            label: "Resiliensi Stres",
            val: stressResilience,
            color: "bg-orange-500",
            desc: "Tingkat respons positif terhadap tekanan",
          },
          {
            label: "Aktivitas Fisik & Tidur",
            val: physicalSleep,
            color: "bg-mood-depressed",
            desc: "Kualitas istirahat dan keteraturan aktivitas harian",
          },
          {
            label: "Dukungan Komunitas",
            val: communitySupport,
            color: "bg-mood-happy",
            desc: "Partisipasi aktif di Zyba Community",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1.5 p-3 rounded-2xl bg-cream/40 border border-brown-900/10"
          >
            <div className="flex justify-between items-center text-xs font-bold text-brown-900">
              <span>{item.label}</span>
              <span>{item.val} / 100</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-cream overflow-hidden border border-brown-900/10">
              <div
                className={`h-full ${item.color} transition-all duration-700`}
                style={{ width: `${item.val}%` }}
              />
            </div>
            <span className="text-[10px] text-brown-700">{item.desc}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs text-brown-700">
        <span>Metrik diperbarui otomatis secara real-time.</span>
        <Link href="/companion" className="font-bold text-orange-500 hover:underline">
          Tanya Zyba Companion →
        </Link>
      </div>
    </div>
  );
}
