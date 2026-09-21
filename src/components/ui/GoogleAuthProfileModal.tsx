"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GoogleAuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

const AVATAR_OPTIONS = [
  { key: "fox", emoji: "🦊", label: "Rubah Cerdas", bg: "bg-orange-100" },
  { key: "panda", emoji: "🐼", label: "Panda Zen", bg: "bg-emerald-100" },
  { key: "lion", emoji: "🦁", label: "Singa Berani", bg: "bg-amber-100" },
  { key: "rabbit", emoji: "🐰", label: "Kelinci Ceria", bg: "bg-pink-100" },
  { key: "koala", emoji: "🐨", label: "Koala Tenang", bg: "bg-blue-100" },
  { key: "cat", emoji: "🐱", label: "Kucing Hangat", bg: "bg-purple-100" },
  { key: "leaf", emoji: "🌿", label: "Daun Zen", bg: "bg-green-100" },
  { key: "flower", emoji: "🌸", label: "Bunga Damai", bg: "bg-rose-100" },
];

const AVATAR_EMOJI_MAP: Record<string, string> = {
  fox: "🦊", panda: "🐼", lion: "🦁", rabbit: "🐰",
  koala: "🐨", cat: "🐱", leaf: "🌿", flower: "🌸",
};

export default function GoogleAuthProfileModal({
  isOpen,
  onClose,
  defaultEmail = "alex.rivera@gmail.com",
  defaultName = "Alex Rivera",
}: GoogleAuthProfileModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"GOOGLE_SELECT" | "PROFILE_SETUP">("GOOGLE_SELECT");
  const [selectedAccount, setSelectedAccount] = useState({
    name: defaultName,
    email: defaultEmail,
  });
  const [customEmail, setCustomEmail] = useState("");
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Setup fields
  const [avatar, setAvatar] = useState("fox"); // string key, not raw emoji
  const [fullName, setFullName] = useState(defaultName);
  const [commStyle, setCommStyle] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");
  const [notifCompanion, setNotifCompanion] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);

  if (!isOpen) return null;

  const handleGoogleAuth = async (emailToUse: string, nameToUse: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GOOGLE_AUTH",
          email: emailToUse,
          name: nameToUse,
          avatarUrl: avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal otentikasi Google.");
      }

      setFullName(data.user?.name || nameToUse);
      // Lanjut ke Step Setup Profil
      setStep("PROFILE_SETUP");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const activeEmail = useCustomEmail && customEmail ? customEmail : selectedAccount.email;
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PROFILE",
          email: activeEmail,
          name: fullName,
          avatarUrl: avatar,
          communicationStyle: commStyle,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan profil.");
      }

      // Berhasil setup profil, tutup modal dan arahkan ke onboarding assessment atau dashboard
      onClose();
      router.push("/assessment");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan setup profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-brown-900/35 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cream rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-[0_24px_80px_-28px_rgba(59,42,32,0.6)] border border-white/80 flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-brown-700/60 hover:text-brown-900 text-sm p-1 rounded-full hover:bg-cream transition-colors"
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* STEP 1: GOOGLE AUTH */}
        {step === "GOOGLE_SELECT" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cream border border-brown-900/10 flex items-center justify-center shrink-0 shadow-xs">
                {/* Google Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-display font-extrabold text-lg text-brown-900 leading-snug">
                  Masuk dengan Google
                </h3>
                <p className="text-xs text-brown-700">
                  Pilih akun Google untuk melanjutkan ke ZYBA
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-orange-100 text-danger text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Pilihan Akun Google Default / Demo */}
            {!useCustomEmail ? (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleGoogleAuth(selectedAccount.email, selectedAccount.name)}
                  className="p-3.5 rounded-2xl border border-brown-900/15 hover:border-orange-500 bg-cream/30 hover:bg-cream flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm">
                      {selectedAccount.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-brown-900 group-hover:text-orange-500 transition-colors">
                        {selectedAccount.name}
                      </span>
                      <span className="text-[11px] text-brown-700">
                        {selectedAccount.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-orange-500 font-bold">Lanjutkan →</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUseCustomEmail(true)}
                  className="text-xs font-semibold text-brown-700 hover:text-orange-500 text-center py-2 transition-colors"
                >
                  + Gunakan akun Google lain
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-1">
                <div>
                  <label className="text-xs font-bold text-brown-900">
                    Email Google Anda:
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="namaanda@gmail.com"
                    className="w-full mt-1.5 bg-cream/50 rounded-2xl border border-brown-900/15 px-4 py-3 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={!customEmail.trim() || isLoading}
                  onClick={() =>
                    handleGoogleAuth(
                      customEmail.trim(),
                      customEmail.split("@")[0] || "Pengguna ZYBA"
                    )
                  }
                  className="w-full py-3 rounded-pill bg-orange-500 text-white font-bold text-xs hover:opacity-90 disabled:opacity-40 transition-all shadow-sm"
                >
                  {isLoading ? "Menghubungkan ke Google..." : "Lanjutkan dengan Akun Ini →"}
                </button>

                <button
                  type="button"
                  onClick={() => setUseCustomEmail(false)}
                  className="text-xs font-medium text-brown-700 hover:underline text-center"
                >
                  Kembali ke akun default
                </button>
              </div>
            )}

            <div className="text-center pt-3 border-t border-brown-900/10">
              <span className="text-[10px] text-brown-700/80 leading-relaxed">
                ZYBA hanya meminta informasi profil publik dan email Google untuk menjaga keamanan akun Anda.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: SETUP PROFIL (BAGIAN 4.B AGENTS.MD) */}
        {step === "PROFILE_SETUP" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-500 font-bold flex items-center justify-center text-xl shrink-0">
                ✨
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-brown-900 leading-snug">
                  Setup Profil ZYBA
                </h3>
                <p className="text-xs text-brown-700">
                  Personalisasi avatar dan preferensimu sebelum mulai
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-orange-100 text-danger text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Pilih Avatar */}
            <div>
              <label className="text-xs font-bold text-brown-900 block mb-2">
                Pilih Avatar Favorit:
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_OPTIONS.map((item) => {
                  const isSelected = avatar === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setAvatar(item.key)}
                      aria-label={`Pilih avatar ${item.label}`}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-orange-500 bg-orange-100/70 shadow-sm scale-105"
                          : "border-brown-900/10 bg-cream/40 hover:bg-white hover:border-brown-900/20"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-xs ${item.bg}`}
                      >
                        {item.emoji}
                      </div>
                      <span
                        className={`text-[10px] font-bold truncate max-w-[70px] ${
                          isSelected ? "text-orange-500" : "text-brown-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nama Lengkap / Panggilan */}
            <div>
              <label className="text-xs font-bold text-brown-900 block mb-1">
                Nama Lengkap / Panggilan:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama kamu..."
                className="w-full bg-cream/50 rounded-2xl border border-brown-900/15 px-4 py-2.5 text-xs text-brown-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Gaya Komunikasi AI */}
            <div>
              <label className="text-xs font-bold text-brown-900 block mb-1.5">
                Gaya Komunikasi Teman AI ZYBA:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["CASUAL", "FORMAL", "FUN"] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCommStyle(style)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      commStyle === style
                        ? "bg-brown-900 text-white border-brown-900"
                        : "bg-cream/50 text-brown-700 border-brown-900/10 hover:border-orange-500"
                    }`}
                  >
                    {style === "CASUAL" ? "Santai" : style === "FORMAL" ? "Formal" : "Ceria (Fun)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferensi Notifikasi */}
            <div className="flex flex-col gap-2 p-3 bg-cream/40 rounded-2xl border border-brown-900/10">
              <span className="text-[11px] font-bold text-brown-900">
                Pengaturan Pengingat & Notifikasi:
              </span>
              <label className="flex items-center justify-between text-xs text-brown-700 cursor-pointer">
                <span>Pengingat Obrolan Companion</span>
                <input
                  type="checkbox"
                  checked={notifCompanion}
                  onChange={(e) => setNotifCompanion(e.target.checked)}
                  className="accent-green-500 w-4 h-4 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-brown-700 cursor-pointer">
                <span>Mood Check-In & Aktivitas Sehat</span>
                <input
                  type="checkbox"
                  checked={notifWellness}
                  onChange={(e) => setNotifWellness(e.target.checked)}
                  className="accent-green-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Tombol Simpan & Selesai Setup */}
            <button
              type="button"
              disabled={isLoading || !fullName.trim()}
              onClick={handleSaveProfile}
              className="mt-1 w-full py-3.5 rounded-pill bg-orange-500 text-white font-bold text-xs hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-40"
            >
              {isLoading ? "Menyimpan Profil..." : "Simpan & Mulai Wellness Journey →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
