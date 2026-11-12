"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

interface CompanionWidgetProps {
  conversationCount?: number;
}

export default function CompanionWidget({ conversationCount = 0 }: CompanionWidgetProps) {
  const [quickInput, setQuickInput] = useState("");

  return (
    <div className="rounded-[20px] bg-white/90 border border-brown-900/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-orange-500" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-brown-700">
              Zyba Companion
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Siaga 24/7
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900">
            {conversationCount.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-brown-700 font-medium">percakapan tersimpan</span>
        </div>

        <p className="text-xs sm:text-sm text-brown-700 mt-2 leading-relaxed">
          {conversationCount > 0
            ? "Zyba siap mendengarkan cerita, membantu teknik pernapasan, atau sekadar bertukar pikiran dengan tenang."
            : "Ruang privat dan aman. Ceritakan apa pun yang sedang membebani pikiranmu hari ini tanpa takut dihakimi."}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (quickInput.trim()) {
              window.location.href = `/companion?initialMsg=${encodeURIComponent(quickInput)}`;
            }
          }}
          className="flex items-center gap-2 bg-cream/70 p-1.5 rounded-full border border-brown-900/15 focus-within:border-orange-500/40 focus-within:bg-white transition-all"
        >
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Tuliskan apa yang kamu rasakan saat ini..."
            className="bg-transparent px-4 text-xs sm:text-sm w-full focus:outline-hidden text-brown-900 placeholder:text-brown-700/50"
          />
          <Link
            href={`/companion?initialMsg=${encodeURIComponent(quickInput)}`}
            className="bg-brown-900 hover:bg-orange-500 text-cream px-4 py-2 rounded-full text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Curhat</span>
            <ArrowRight size={13} />
          </Link>
        </form>
      </div>
    </div>
  );
}
