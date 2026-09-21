"use client";

import React from "react";

interface SettingsBannerProps {
  onOpenProfileModal: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export default function SettingsBanner({
  onOpenProfileModal,
  onSave,
  isSaved,
}: SettingsBannerProps) {
  return (
    <div className="glass-card rounded-3xl p-7 border border-brown-900/10 bg-gradient-to-r from-cream via-white to-green-100/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-brown-900 text-white text-xs font-bold uppercase tracking-wider">
            Account & Settings
          </span>
          <span className="text-xs text-brown-700">Zyba Settings</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-brown-900">
          Pengaturan Akun & Presensi
        </h1>
        <p className="text-xs text-brown-700 mt-1 max-w-xl">
          Atur profil pribadi, preferensi gaya komunikasi AI Zyba Companion, serta privasi dan keamanan akunmu.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenProfileModal}
          className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs px-4 py-3 rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚙️ Pengaturan Profil</span>
        </button>
        <button
          onClick={onSave}
          className="bg-brown-900 hover:bg-orange-500 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shadow-md shrink-0"
        >
          {isSaved ? "✓ Tersimpan!" : "Simpan Perubahan →"}
        </button>
      </div>
    </div>
  );
}
