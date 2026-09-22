"use client";

import React, { useState } from "react";
import { useCommunity } from "../context/CommunityContext";

export default function CommunityActivityView() {
  const { notifications } = useCommunity();
  const [filter, setFilter] = useState<"ALL" | "REPLIES" | "MENTIONS" | "VERIFIED">("ALL");

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "REPLIES") return n.action === "reply";
    if (filter === "MENTIONS") return n.action === "mention";
    if (filter === "VERIFIED") return n.user === "Sarah Jenkins";
    return true;
  });

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-4 animate-in fade-in duration-200">
      {/* Header & Filter Pills (Threads style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(["ALL", "REPLIES", "MENTIONS", "VERIFIED"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
              filter === tab
                ? "bg-brown-900 text-white border-brown-900 shadow-2xs"
                : "bg-white text-brown-700 border-brown-900/10 hover:border-brown-900/30"
            }`}
          >
            {tab === "ALL" ? "All" : tab === "REPLIES" ? "Replies" : tab === "MENTIONS" ? "Mentions" : "Verified"}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-brown-900/10 divide-y divide-brown-900/6 shadow-xs overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center text-xs text-brown-700/50">
            Belum ada notifikasi pada kategori ini.
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div key={n.id} className="p-4 flex items-start gap-3 hover:bg-cream/30 transition-colors">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-orange-600">
                  {n.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold">
                  {n.action === "like" ? <span className="text-[9px]">♥</span> : n.action === "reply" ? <span className="text-[9px]">↩</span> : <span className="text-[9px]">+</span>}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-brown-900">
                    {n.user}{" "}
                    <span className="font-normal text-brown-700/70">
                      {n.action === "like"
                        ? "menyukai ceritamu"
                        : n.action === "reply"
                        ? "membalas thread kamu"
                        : "mulai mengikutimu"}
                    </span>
                  </p>
                  <span className="text-[10px] text-brown-700/50 shrink-0">{n.time}</span>
                </div>
                {n.targetText && (
                  <p className="text-xs text-brown-700/80 mt-1 line-clamp-2 bg-[#FAF7F2] p-2 rounded-xl border border-brown-900/5">
                    {n.targetText}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
