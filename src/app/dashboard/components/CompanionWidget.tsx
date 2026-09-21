"use client";

import { useState } from "react";
import Link from "next/link";

interface CompanionWidgetProps {
  conversationCount?: number;
}

export default function CompanionWidget({ conversationCount = 0 }: CompanionWidgetProps) {
  const [quickInput, setQuickInput] = useState("");

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br from-white to-green-100/30">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
            Zyba Companion
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-500 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Online AI
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display text-3xl font-extrabold text-brown-900">
            {conversationCount.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-brown-700 font-medium">Conversations Logged</span>
        </div>
        <p className="text-xs text-brown-700 mt-2">
          {conversationCount > 0
            ? "Siap mendengarkan cerita, memberikan teknik coping, atau sekadar berbincang santai."
            : "Belum ada sesi curhat aktif. Zyba siap mendengarkan ceritamu kapan pun tanpa menghakimi."}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-cream/80 p-1.5 rounded-2xl border border-brown-900/10">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Curhat sesuatu ke Zyba..."
            className="bg-transparent px-3 text-xs w-full focus:outline-none text-brown-900"
          />
          <Link
            href={`/companion?initialMsg=${encodeURIComponent(quickInput)}`}
            className="bg-brown-900 text-cream px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors shrink-0"
          >
            Chat →
          </Link>
        </div>
      </div>
    </div>
  );
}
