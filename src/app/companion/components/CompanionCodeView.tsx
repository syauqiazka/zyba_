"use client";

import React from "react";
import { useCompanion } from "../context/CompanionContext";

export default function CompanionCodeView() {
  const { setActiveSection, setShowProModal, handleSendMessage } = useCompanion();

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-6 border-b border-brown-900/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚡</span>
            <h1 className="font-serif font-bold text-2xl text-brown-900">
              Code & Action Programs
            </h1>
          </div>
          <p className="text-xs text-brown-700/70">
            Automasi dan script aksi wellness: eksekutor kebiasaan, webhook reminder, dan integrasi kalender.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowProModal(true)}
          className="rounded-xl bg-orange-500 text-white text-xs font-bold px-4 py-2 hover:bg-orange-600 transition-all shadow-xs"
        >
          ⚡ Upgrade ke Pro
        </button>
      </div>

      <div className="mt-6 bg-white rounded-3xl border border-brown-900/8 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-brown-900/5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-xs font-mono font-bold text-brown-900">
              wellness_routine_sync.ts
            </span>
          </div>
          <span className="text-[10px] font-mono text-brown-700/50">TypeScript · Zyba SDK</span>
        </div>

        <pre className="p-4 bg-[#FAF7F2] rounded-2xl text-xs font-mono text-brown-900 leading-relaxed overflow-x-auto border border-brown-900/5">
{`// Automated Wellness Routine Trigger
import { ZybaCompanion } from "@zyba/wellness-core";

export async function executeDailyRoutine(userId: string) {
  const companion = new ZybaCompanion({ userId, mode: "curhat_to_action" });
  
  // 1. Evaluasi streak & kualitas tidur
  const healthMetrics = await companion.getLatestMetrics();
  
  // 2. Buat jadwal istirahat mikro otomatis
  if (healthMetrics.stressLevel > 3) {
    await companion.scheduleMicroBreak({
      intervalMinutes: 45,
      exercise: "Breathing 4-4-4",
      calmingAudio: "Rainforest Ambient"
    });
  }
  
  return { status: "Active", nextCheckin: "21:00 WIB" };
}`}
        </pre>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-brown-700/70">
            Ingin mengeksekusi script wellness otomatis untuk akunmu?
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveSection("chat");
              handleSendMessage("Bantu aku membuat program kebiasaan harian dengan script otomatis!");
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
          >
            Bahas Skrip di Chat →
          </button>
        </div>
      </div>
    </div>
  );
}
