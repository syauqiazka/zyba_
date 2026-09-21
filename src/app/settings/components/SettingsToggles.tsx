"use client";

import React from "react";

interface SettingsTogglesProps {
  commStyle: "CASUAL" | "FORMAL" | "FUN";
  onCommStyleChange: (v: "CASUAL" | "FORMAL" | "FUN") => void;
  notifChatbot: boolean;
  onNotifChatbotChange: (v: boolean) => void;
  notifWellness: boolean;
  onNotifWellnessChange: (v: boolean) => void;
  notifCommunity: boolean;
  onNotifCommunityChange: (v: boolean) => void;
  fingerprintEnabled: boolean;
  onFingerprintChange: (v: boolean) => void;
}

export default function SettingsToggles({
  commStyle,
  onCommStyleChange,
  notifChatbot,
  onNotifChatbotChange,
  notifWellness,
  onNotifWellnessChange,
  notifCommunity,
  onNotifCommunityChange,
  fingerprintEnabled,
  onFingerprintChange,
}: SettingsTogglesProps) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4 bg-white">
        <h3 className="font-display text-base font-bold text-brown-900 border-b border-brown-900/10 pb-2">
          2. Preferensi Zyba Companion
        </h3>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-brown-900">Gaya Bahasa AI Chatbot:</label>
          {(["CASUAL", "FORMAL", "FUN"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onCommStyleChange(s)}
              className={`p-3 rounded-2xl text-xs font-bold border transition-colors flex items-center justify-between ${
                commStyle === s
                  ? "bg-brown-900 text-white border-brown-900"
                  : "bg-cream text-brown-900 border-brown-900/10 hover:border-orange-500"
              }`}
            >
              <span>{s}</span>
              {commStyle === s && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4 bg-white">
        <h3 className="font-display text-base font-bold text-brown-900 border-b border-brown-900/10 pb-2">
          3. Keamanan & Notifikasi
        </h3>

        <div className="flex flex-col gap-3 text-xs text-brown-900">
          <label className="flex items-center justify-between cursor-pointer">
            <span>Otentikasi Biometrik / Fingerprint</span>
            <input
              type="checkbox"
              checked={fingerprintEnabled}
              onChange={(e) => onFingerprintChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>Notifikasi Chat Companion</span>
            <input
              type="checkbox"
              checked={notifChatbot}
              onChange={(e) => onNotifChatbotChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>Pengingat Mood Check-In & Tidur</span>
            <input
              type="checkbox"
              checked={notifWellness}
              onChange={(e) => onNotifWellnessChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>Notifikasi Aktivitas Komunitas</span>
            <input
              type="checkbox"
              checked={notifCommunity}
              onChange={(e) => onNotifCommunityChange(e.target.checked)}
              className="accent-green-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
