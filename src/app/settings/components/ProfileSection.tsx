"use client";

import React from "react";

interface ProfileSectionProps {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onBioChange: (v: string) => void;
}

export default function ProfileSection({
  name,
  email,
  phone,
  location,
  bio,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onLocationChange,
  onBioChange,
}: ProfileSectionProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AL";

  return (
    <div className="lg:col-span-7 glass-card rounded-3xl p-7 border border-brown-900/10 flex flex-col gap-6 bg-white">
      <h2 className="font-display text-lg font-bold text-brown-900 border-b border-brown-900/10 pb-3">
        1. Profil Pengguna
      </h2>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500 text-white font-display font-extrabold flex items-center justify-center text-xl shadow-md">
          {initials}
        </div>
        <div>
          <span className="text-sm font-bold text-brown-900 block">{name}</span>
          <span className="text-xs text-brown-700 block">{email}</span>
          <span className="text-[10px] bg-orange-100 text-orange-500 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
            Zyba Plus Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-brown-900">Nama Lengkap:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brown-900">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-brown-900">Nomor HP:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brown-900">Lokasi / Kota:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 px-4 py-3 text-xs text-brown-900 font-bold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-brown-900">Bio Singkat:</label>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          rows={2}
          className="w-full mt-1 bg-cream/50 rounded-2xl border border-brown-900/10 p-3 text-xs text-brown-900 font-bold focus:outline-none"
        />
      </div>
    </div>
  );
}
