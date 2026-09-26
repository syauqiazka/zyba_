"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCommunity } from "../context/CommunityContext";
import { Heart, MessageSquare, AtSign, MessageCircle, UserPlus, CheckCheck } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

export default function CommunityActivityView() {
  const router = useRouter();
  const { notifications } = useCommunity();
  const [filter, setFilter] = useState<"ALL" | "FOLLOWS" | "REPLIES" | "MENTIONS">("ALL");

  // Mark all notifications as read when opening Activity view
  useEffect(() => {
    fetch("/api/community/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
      .then(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("zyba_badge_update"));
        }
      })
      .catch((err) => {
        console.warn("Failed to mark notifications read:", err);
      });
  }, []);

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "FOLLOWS") return n.action === "follow";
    if (filter === "REPLIES") return n.action === "reply";
    if (filter === "MENTIONS") return n.action === "mention";
    return true;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "like":
        return <Heart size={10} className="fill-current" />;
      case "reply":
        return <MessageSquare size={10} className="fill-current" />;
      case "mention":
        return <AtSign size={10} />;
      case "dm":
        return <MessageCircle size={10} />;
      case "follow":
      default:
        return <UserPlus size={10} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "like":
        return "bg-rose-500 text-white";
      case "reply":
        return "bg-blue-500 text-white";
      case "mention":
        return "bg-purple-500 text-white";
      case "dm":
        return "bg-orange-500 text-white";
      case "follow":
      default:
        return "bg-green-600 text-white";
    }
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    if (n.action === "follow" && n.actorId) {
      router.push(`/community/profile/${n.actorId}`);
    } else if (n.action === "dm" && n.actorId) {
      router.push(`/community/messages?userId=${n.actorId}`);
    } else if (n.postId) {
      router.push(`/community`);
    }
  };

  return (
    <div className="w-full max-w-[620px] mx-auto py-4 px-2 space-y-4 animate-in fade-in duration-200">
      {/* Header & Filter Pills */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(["ALL", "FOLLOWS", "REPLIES", "MENTIONS"] as const).map((tab) => (
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
              {tab === "ALL"
                ? "Semua"
                : tab === "FOLLOWS"
                ? "Pengikut Baru"
                : tab === "REPLIES"
                ? "Balasan"
                : "Sebutan"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-green-700 font-semibold shrink-0">
          <CheckCheck size={14} />
          <span className="hidden sm:inline">Sudah dibaca</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-brown-900/10 divide-y divide-brown-900/6 shadow-xs overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center text-xs text-brown-700/50 flex flex-col items-center justify-center gap-2">
            <UserPlus size={28} className="opacity-30" />
            <span>Belum ada notifikasi pada kategori ini.</span>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className="p-4 flex items-start gap-3 hover:bg-cream/30 transition-colors cursor-pointer group"
            >
              <div className="relative shrink-0">
                <UserAvatar
                  src={n.avatar && n.avatar.startsWith("/") ? n.avatar : null}
                  name={n.user}
                  size="md"
                  showStatus={false}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs ${getActionColor(
                    n.action
                  )}`}
                >
                  {getActionIcon(n.action)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-brown-900 leading-snug">
                    <span className="hover:underline">{n.user}</span>{" "}
                    <span className="font-normal text-brown-700/70">
                      {n.action === "like"
                        ? "menyukai ceritamu"
                        : n.action === "reply"
                        ? "membalas postinganmu"
                        : n.action === "mention"
                        ? "menyebutmu dalam postingan"
                        : n.action === "dm"
                        ? "mengirim pesan langsung kepadamu"
                        : "mulai mengikutimu"}
                    </span>
                  </p>
                  <span className="text-[10px] text-brown-700/50 shrink-0 font-medium">
                    {n.time}
                  </span>
                </div>

                {n.targetText && (
                  <p className="text-xs text-brown-700/80 mt-1 line-clamp-2 bg-[#FAF7F2] p-2 rounded-xl border border-brown-900/5">
                    {n.targetText}
                  </p>
                )}

                {n.action === "follow" && n.actorId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-orange-500 group-hover:underline">
                      Lihat profil →
                    </span>
                  </div>
                )}
                {n.action === "dm" && n.actorId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-orange-500 group-hover:underline">
                      Buka obrolan →
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
