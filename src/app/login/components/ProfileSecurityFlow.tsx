"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProfileSecurityFlowProps {
  initialEmail?: string;
  onSwitchToSignIn: () => void;
}

const AVATAR_OPTIONS = [
  { key: "fox", emoji: "🦊", label: "Rubah Cerdas", bg: "bg-orange-100" },
  { key: "panda", emoji: "🐼", label: "Panda Tenang", bg: "bg-green-100" },
  { key: "lion", emoji: "🦁", label: "Singa Berani", bg: "bg-amber-100" },
  { key: "rabbit", emoji: "🐰", label: "Kelinci Ceria", bg: "bg-pink-100" },
  { key: "leaf", emoji: "🌿", label: "Daun Zen", bg: "bg-emerald-100" },
  { key: "flower", emoji: "🌸", label: "Bunga Damai", bg: "bg-rose-100" },
];

const AVATAR_EMOJI_MAP: Record<string, string> = {
  fox: "🦊", panda: "🐼", lion: "🦁", rabbit: "🐰", leaf: "🌿", flower: "🌸",
};

export const POPULAR_CITIES = [
  "Jakarta, DKI Jakarta",
  "Surabaya, Jawa Timur",
  "Bandung, Jawa Barat",
  "Medan, Sumatera Utara",
  "Semarang, Jawa Tengah",
  "Yogyakarta, DI Yogyakarta",
  "Denpasar, Bali",
  "Makassar, Sulawesi Selatan",
  "Malang, Jawa Timur",
  "Palembang, Sumatera Selatan",
  "Tangerang, Banten",
  "Tangerang Selatan, Banten",
  "Bekasi, Jawa Barat",
  "Depok, Jawa Barat",
  "Bogor, Jawa Barat",
  "Surakarta (Solo), Jawa Tengah",
  "Batam, Kepulauan Riau",
  "Pekanbaru, Riau",
  "Bandar Lampung, Lampung",
  "Padang, Sumatera Barat",
  "Banjarmasin, Kalimantan Selatan",
  "Balikpapan, Kalimantan Timur",
  "Samarinda, Kalimantan Timur",
  "Pontianak, Kalimantan Barat",
  "Manado, Sulawesi Utara",
  "Mataram (Lombok), NTB",
  "Kupang, NTT",
  "Jayapura, Papua",
  "Ambon, Maluku",
  "Banda Aceh, Aceh",
  "Cirebon, Jawa Barat",
  "Sukabumi, Jawa Barat",
  "Tasikmalaya, Jawa Barat",
  "Magelang, Jawa Tengah",
  "Pekalongan, Jawa Tengah",
  "Tegal, Jawa Tengah",
  "Kediri, Jawa Timur",
  "Madiun, Jawa Timur",
  "Jember, Jawa Timur",
  "Banyuwangi, Jawa Timur",
];

export default function ProfileSecurityFlow({
  initialEmail = "",
  onSwitchToSignIn,
}: ProfileSecurityFlowProps) {
  const router = useRouter();

  // Sub-steps 1 to 8 matching Figma bottom row
  const [step, setStep] = useState<
    | "SELECT_AVATAR"
    | "PROFILE_SETUP"
    | "PASSWORD_STRENGTH"
    | "OTP_VERIFY"
    | "FINGERPRINT"
    | "NOTIFICATIONS"
    | "COMPILING"
    | "ALL_SET_UP"
  >("SELECT_AVATAR");

  // Form State
  const [avatar, setAvatar] = useState("fox"); // stores string key, not raw emoji
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(
    initialEmail && initialEmail !== "alex@zyba.app" ? initialEmail : ""
  );
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Pria");
  const [location, setLocation] = useState("Jakarta, DKI Jakarta");

  // Gender Dropdown State
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderDropdownRef = React.useRef<HTMLDivElement>(null);

  // Location Dropdown State
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const locationDropdownRef = React.useRef<HTMLDivElement>(null);

  // Sync initialEmail if changed from parent
  useEffect(() => {
    if (initialEmail && initialEmail !== "alex@zyba.app") {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Close Gender dropdown when clicked outside
  useEffect(() => {
    function handleGenderClickOutside(event: MouseEvent) {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenderOpen(false);
      }
    }
    document.addEventListener("mousedown", handleGenderClickOutside);
    return () => document.removeEventListener("mousedown", handleGenderClickOutside);
  }, []);

  // Close Location dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validation & Loading States
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpInfoMessage, setOtpInfoMessage] = useState("");
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // OTP State (4 digit)
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Biometric state
  const [isFingerprintScanned, setIsFingerprintScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Notification Toggles
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);

  // Compiling progress
  const [compileProgress, setCompileProgress] = useState(15);

  // Password strength logic
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthScore = (hasMinLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);

  // Compiling Data auto-advance
  useEffect(() => {
    if (step === "COMPILING") {
      const interval = setInterval(() => {
        setCompileProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("ALL_SET_UP"), 400);
            return 100;
          }
          return prev + 25;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Handle OTP digit changes (typing / single char)
  const handleOtpChange = (index: number, val: string) => {
    const cleanDigits = val.replace(/\D/g, "");
    if (cleanDigits.length > 1) {
      // In case multi-digit entered into one box
      const newOtp = [...otp];
      for (let i = 0; i < cleanDigits.length && index + i < 4; i++) {
        newOtp[index + i] = cleanDigits[i];
      }
      setOtp(newOtp);
      const nextIdx = Math.min(index + cleanDigits.length, 3);
      document.getElementById(`otp-digit-${nextIdx}`)?.focus();
      return;
    }

    const updated = [...otp];
    updated[index] = cleanDigits.slice(-1);
    setOtp(updated);

    // Auto-focus next input
    if (cleanDigits && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle Paste 4 Digits Directly
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.replace(/\D/g, "").slice(0, 4);
    if (!digits) return;

    const newOtp = ["", "", "", ""];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
    if (otpError) setOtpError("");

    // Auto focus the next box or the last box
    const focusIndex = Math.min(digits.length, 3);
    const targetInput = document.getElementById(`otp-digit-${focusIndex}`);
    targetInput?.focus();
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleScanFingerprint = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsFingerprintScanned(true);
    }, 1200);
  };

  const handleFinishAndRedirect = async () => {
    try {
      // Update data profil user setelah registrasi & verifikasi selesai
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PROFILE",
          email: email.trim(),
          name: fullName || undefined,
          phone: phone.trim() || undefined,
          location: location || undefined,
          avatarUrl: avatar,
        }),
      });
    } catch {
      // Ignore network issue in demo
    }
    // Redirect to assessment first — user hasn't done assessment yet
    window.location.href = "/assessment";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-brown-900/10 flex flex-col transition-all duration-300 relative">
      {/* ========================================================================= */}
      {/* 1. SELECT YOUR AVATAR */}
      {/* ========================================================================= */}
      {step === "SELECT_AVATAR" && (
        <div className="flex flex-col">
          {/* Header Kubah Organik Hijau */}
          <div className="relative w-full bg-[#E2EBD2] pt-8 pb-10 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
              title="Kembali ke Sign In"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 1 of 6 • Profile Setup
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Select Your Avatar
            </h2>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-white -mt-4 rounded-t-3xl z-10 text-center">
            {/* Avatar Preview Besar dengan Ring Ornamen khas Figma */}
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#E2EBD2] to-orange-100 border-4 border-white shadow-xl flex items-center justify-center text-5xl">
              <span>{AVATAR_EMOJI_MAP[avatar] || "🦊"}</span>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                ✨
              </div>
            </div>

            <div>
              <p className="text-xs text-brown-700/80 leading-relaxed max-w-xs">
                We have a set of customizable avatar. Or choose one of our friendly companions below.
              </p>
            </div>

            {/* Grid Preset Avatar */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setAvatar(item.key)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all ${
                    avatar === item.key
                      ? "border-orange-500 bg-orange-100/50 shadow-sm scale-105"
                      : "border-brown-900/10 bg-cream/40 hover:bg-cream"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-brown-900 truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("PROFILE_SETUP")}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PROFILE SETUP */}
      {/* ========================================================================= */}
      {step === "PROFILE_SETUP" && (
        <div className="flex flex-col">
          {/* Header Kubah dengan Avatar Lingkaran di tengah persis Figma Frame Profile Setup */}
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-12 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("SELECT_AVATAR")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 2 of 6 • Identity
            </span>

            {/* Avatar bulat di tengah lengkungan */}
            <div className="mt-3 w-16 h-16 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center text-3xl">
              {AVATAR_EMOJI_MAP[avatar] || "🦊"}
            </div>
          </div>

          <div className="p-8 flex flex-col gap-4 bg-white -mt-6 rounded-t-3xl z-10">
            <div className="text-center">
              <h2 className="font-display font-extrabold text-xl text-brown-900">
                Profile Setup
              </h2>
              <p className="text-xs text-brown-700/80">Lengkapi data akun ZYBA Anda</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Shimarron King"
                  className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="nama@email.com"
                  className={`w-full bg-cream/40 border ${
                    emailError ? "border-danger ring-1 ring-danger" : "border-brown-900/15"
                  } rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium`}
                />
                {emailError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-orange-100/70 border border-danger/30 text-left flex flex-col gap-1">
                    <p className="text-[11px] font-bold text-danger flex items-center gap-1.5">
                      <span>⚠️</span> {emailError}
                    </p>
                    {emailError.includes("terdaftar") && (
                      <button
                        type="button"
                        onClick={onSwitchToSignIn}
                        className="text-[11px] font-extrabold text-orange-600 hover:underline text-left self-start mt-0.5"
                      >
                        Sudah punya akun? Masuk di sini →
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="08123456789"
                  className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Custom Gender Dropdown */}
                <div className="relative" ref={genderDropdownRef}>
                  <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                    Gender
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                    className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium flex items-center justify-between gap-1 text-left cursor-pointer hover:bg-cream/60 transition-colors"
                  >
                    <span className="truncate">{gender}</span>
                    <span className="text-[10px] text-brown-700/60 shrink-0">
                      {isGenderOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isGenderOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border-2 border-brown-900/15 rounded-2xl shadow-2xl z-50 p-2 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      <div className="flex items-center justify-between px-2 py-1.5 border-b border-brown-900/10 mb-1">
                        <span className="text-[11px] font-extrabold text-brown-900">Pilih Gender</span>
                        <button
                          type="button"
                          onClick={() => setIsGenderOpen(false)}
                          className="text-xs text-brown-700/60 hover:text-brown-900 font-bold p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                      {["Pria", "Wanita", "Lainnya"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setGender(g);
                            setIsGenderOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                            gender === g
                              ? "bg-green-100 text-brown-900 font-bold"
                              : "text-brown-700 hover:bg-cream/70 hover:text-brown-900"
                          }`}
                        >
                          <span>{g}</span>
                          {gender === g && (
                            <span className="text-green-600 font-bold text-xs ml-1 shrink-0">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Searchable Location Dropdown */}
                <div className="relative" ref={locationDropdownRef}>
                  <label className="text-xs font-bold text-brown-900 pl-1 block mb-1">
                    Location
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationOpen(!isLocationOpen);
                      setLocationSearch("");
                    }}
                    className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium flex items-center justify-between gap-1 text-left cursor-pointer hover:bg-cream/60 transition-colors"
                  >
                    <span className="truncate">{location || "Pilih Kota..."}</span>
                    <span className="text-[10px] text-brown-700/60 shrink-0">
                      {isLocationOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Dropdown Popover (Membuka ke atas agar tidak pernah terpotong tepi bawah) */}
                  {isLocationOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 sm:w-72 bg-white border-2 border-brown-900/15 rounded-2xl shadow-2xl z-50 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      <div className="flex items-center justify-between pb-1 border-b border-brown-900/10">
                        <span className="text-[11px] font-extrabold text-brown-900">
                          Pilih Kota Domisili
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsLocationOpen(false)}
                          className="text-xs text-brown-700/60 hover:text-brown-900 font-bold p-0.5"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Search Filter Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          placeholder="Ketik nama kota..."
                          autoFocus
                          className="w-full bg-cream/50 border border-brown-900/15 rounded-xl px-2.5 py-1.5 pl-7 text-xs text-brown-900 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium placeholder:text-brown-700/40"
                        />
                        <span className="absolute left-2 top-2 text-[11px] text-brown-700/50">
                          🔍
                        </span>
                        {locationSearch && (
                          <button
                            type="button"
                            onClick={() => setLocationSearch("")}
                            className="absolute right-2 top-2 text-[10px] text-brown-700/60 hover:text-brown-900"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Filtered Cities List */}
                      <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5 pr-1 divide-y divide-brown-900/5">
                        {POPULAR_CITIES.filter((c) =>
                          c.toLowerCase().includes(locationSearch.toLowerCase().trim())
                        ).map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setLocation(city);
                              setIsLocationOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                              location === city
                                ? "bg-green-100 text-brown-900 font-bold"
                                : "text-brown-700 hover:bg-cream/70 hover:text-brown-900"
                            }`}
                          >
                            <span className="truncate">{city}</span>
                            {location === city && (
                              <span className="text-green-600 font-bold text-xs ml-1 shrink-0">✓</span>
                            )}
                          </button>
                        ))}

                        {/* Jika tidak ada di daftar, izinkan ketik kota kustom */}
                        {POPULAR_CITIES.filter((c) =>
                          c.toLowerCase().includes(locationSearch.toLowerCase().trim())
                        ).length === 0 && (
                          <div className="p-2 text-center text-[11px] text-brown-700/70">
                            <span>Kota tidak ada di daftar.</span>
                            {locationSearch.trim() && (
                              <button
                                type="button"
                                onClick={() => {
                                  setLocation(locationSearch.trim());
                                  setIsLocationOpen(false);
                                }}
                                className="mt-1.5 block w-full px-2.5 py-2 bg-orange-100 text-orange-600 font-bold rounded-xl text-xs hover:bg-orange-200 transition-colors"
                              >
                                Gunakan &quot;{locationSearch.trim()}&quot;
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              disabled={isCheckingEmail}
              onClick={async () => {
                setEmailError("");
                const trimmedEmail = email.trim();
                if (!trimmedEmail) {
                  setEmailError("Alamat email wajib diisi.");
                  return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(trimmedEmail)) {
                  setEmailError("Format email tidak valid. Masukkan alamat email yang benar.");
                  return;
                }

                setIsCheckingEmail(true);
                try {
                  const res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "CHECK_EMAIL", email: trimmedEmail }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setEmailError(data.error || "Email sudah terdaftar. Silakan gunakan email lain.");
                    return;
                  }
                  // Email aman, lanjut ke password setup
                  setStep("PASSWORD_STRENGTH");
                } catch {
                  setEmailError("Gagal memeriksa email. Periksa koneksi internet Anda.");
                } finally {
                  setIsCheckingEmail(false);
                }
              }}
              className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isCheckingEmail ? (
                <span>Memeriksa Email...</span>
              ) : (
                <>
                  <span>Continue</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PASSWORD SETUP & STRENGTH METER */}
      {/* ========================================================================= */}
      {step === "PASSWORD_STRENGTH" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("PROFILE_SETUP")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 3 of 6 • Security
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Password Setup
            </h2>
          </div>

          <div className="p-8 flex flex-col gap-5 bg-white -mt-4 rounded-t-3xl z-10">
            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brown-900 pl-1">
                Ketik Kata Sandi Baru
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/40 border border-brown-900/15 rounded-full px-4 py-3 text-xs md:text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider font-semibold"
              />
            </div>

            {/* Password Strength Meter Card (Figma pattern) */}
            <div className="p-4 rounded-2xl bg-cream/40 border border-brown-900/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brown-900">
                  Password Strength
                </span>
                <span
                  className={`text-[11px] font-extrabold ${
                    strengthScore === 3
                      ? "text-green-500"
                      : strengthScore === 2
                      ? "text-orange-500"
                      : "text-danger"
                  }`}
                >
                  {strengthScore === 3
                    ? "Kuat ✨"
                    : strengthScore === 2
                    ? "Sedang ⚡"
                    : "Lemah (Tingkatkan!) 💪"}
                </span>
              </div>

              {/* 3-Bar Segments */}
              <div className="grid grid-cols-3 gap-1.5">
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore >= 1 ? (strengthScore === 1 ? "bg-danger" : "bg-orange-500") : "bg-brown-900/15"
                  }`}
                />
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore >= 2 ? (strengthScore === 2 ? "bg-orange-500" : "bg-green-500") : "bg-brown-900/15"
                  }`}
                />
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore >= 3 ? "bg-green-500" : "bg-brown-900/15"
                  }`}
                />
              </div>

              {/* Requirement Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    hasMinLength ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                  }`}
                >
                  {hasMinLength ? "✓" : "○"} Minimal 8 Karakter
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    hasNumber ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                  }`}
                >
                  {hasNumber ? "✓" : "○"} Ada Angka (0-9)
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    hasSpecial ? "bg-green-100 text-green-500" : "bg-cream text-brown-700/60"
                  }`}
                >
                  {hasSpecial ? "✓" : "○"} Karakter Khusus (!@#)
                </span>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-orange-100/80 border border-danger/30 text-left">
                <p className="text-xs font-bold text-danger flex items-center gap-1.5">
                  <span>⚠️</span> {passwordError}
                </p>
                {passwordError.includes("terdaftar") && (
                  <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="text-[11px] font-extrabold text-orange-600 hover:underline text-left mt-1 block"
                  >
                    Masuk ke akun Anda sekarang →
                  </button>
                )}
              </div>
            )}

            {/* Tombol Continue → Request OTP */}
            <button
              type="button"
              disabled={isSendingOtp}
              onClick={async () => {
                setPasswordError("");
                if (!password || password.length < 8) {
                  setPasswordError("Kata sandi harus minimal 8 karakter.");
                  return;
                }

                setIsSendingOtp(true);
                try {
                  const res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "SIGNUP", email: email.trim() }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setPasswordError(data.error || "Gagal memproses pendaftaran. Periksa kembali email Anda.");
                    return;
                  }

                  setOtpInfoMessage(
                    data.message || `Kode OTP telah dikirimkan ke kotak masuk ${email.trim()}.`
                  );
                  setStep("OTP_VERIFY");
                } catch (e) {
                  setPasswordError("Gagal menghubungi server untuk pengiriman OTP. Periksa koneksi internet.");
                } finally {
                  setIsSendingOtp(false);
                }
              }}
              className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isSendingOtp ? (
                <span>Mengirim Kode OTP ke Email...</span>
              ) : (
                <>
                  <span>Continue</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OTP SETUP & 4-DIGIT VERIFICATION */}
      {/* ========================================================================= */}
      {step === "OTP_VERIFY" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("PASSWORD_STRENGTH")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 4 of 6 • Verification
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Enter 4 Digit OTP Code
            </h2>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-white -mt-4 rounded-t-3xl z-10 text-center">
            {/* Ilustrasi Tameng Hijau */}
            <div className="w-16 h-16 rounded-3xl bg-green-100 border border-green-500/30 flex items-center justify-center text-3xl shadow-sm">
              🛡️
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-brown-900">
                Verifikasi Email Anda
              </h3>
              <p className="text-xs text-brown-700/90 mt-1.5 max-w-xs leading-relaxed">
                {otpInfoMessage ? (
                  <span>{otpInfoMessage}</span>
                ) : (
                  <>
                    Kode verifikasi akun telah dikirim ke{" "}
                    <strong className="text-brown-900">{email}</strong>. Cek inbox atau folder spam Anda.
                  </>
                )}
              </p>
            </div>

            {/* Quick Demo Helper Box */}
            <div className="w-full p-3 rounded-2xl bg-cream/70 border border-brown-900/10 text-left flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-brown-900 block">
                  Mode Pengujian / Fallback:
                </span>
                <span className="text-[10px] text-brown-700 leading-tight block">
                  Bila SMTP belum diset, gunakan kode demo: <strong className="text-brown-900 font-mono">0000</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtp(["0", "0", "0", "0"]);
                  setOtpError("");
                }}
                className="px-3 py-1.5 rounded-full bg-brown-900 hover:bg-orange-500 text-white font-bold text-[10px] shrink-0 transition-colors shadow-xs"
              >
                Isi 0000
              </button>
            </div>

            {/* 4 Kotak Digit Besar */}
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`otp-digit-${index}`}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => {
                    handleOtpChange(index, e.target.value);
                    if (otpError) setOtpError("");
                  }}
                  onPaste={handleOtpPaste}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  className="w-12 h-14 text-center text-2xl font-display font-extrabold rounded-2xl border-2 border-brown-900/15 bg-cream/30 text-brown-900 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-xs"
                />
              ))}
            </div>

            {otpError && (
              <span className="text-xs font-bold text-danger bg-orange-100 px-3.5 py-1.5 rounded-full border border-danger/20">
                {otpError}
              </span>
            )}

            <div className="text-xs text-brown-700">
              Tidak menerima email OTP?{" "}
              <button
                type="button"
                disabled={isResendingOtp}
                onClick={async () => {
                  setIsResendingOtp(true);
                  setOtpError("");
                  try {
                    const res = await fetch("/api/auth", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "SIGNUP", email: email.trim() }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setOtpInfoMessage(data.message || "Kode OTP baru telah dikirimkan ke email Anda.");
                      alert(data.message || "Kode OTP berhasil dikirim ulang ke email Anda.");
                    } else {
                      setOtpError(data.error || "Gagal mengirim ulang OTP.");
                    }
                  } catch {
                    setOtpError("Gagal menghubungi server untuk kirim ulang OTP.");
                  } finally {
                    setIsResendingOtp(false);
                  }
                }}
                className="text-orange-500 font-bold hover:underline disabled:opacity-50"
              >
                {isResendingOtp ? "Mengirim ulang..." : "Kirim Ulang."}
              </button>
            </div>

            {/* Tombol Continue → Verify OTP via Backend */}
            <button
              type="button"
              disabled={isVerifyingOtp}
              onClick={async () => {
                const code = otp.join("");
                if (code.length < 4) {
                  setOtpError("Masukkan 4 digit kode OTP.");
                  return;
                }
                setIsVerifyingOtp(true);
                setOtpError("");
                try {
                  const res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "VERIFY_OTP",
                      email: email.trim(),
                      otp: code,
                      name: fullName || undefined,
                      password,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setStep("FINGERPRINT");
                  } else {
                    setOtpError(data.error || "Kode OTP salah atau telah kadaluarsa.");
                  }
                } catch (err) {
                  setOtpError("Gagal menghubungi server verifikasi.");
                } finally {
                  setIsVerifyingOtp(false);
                }
              }}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isVerifyingOtp ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FINGERPRINT SETUP */}
      {/* ========================================================================= */}
      {step === "FINGERPRINT" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("OTP_VERIFY")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 5 of 6 • Biometrics
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Fingerprint Setup
            </h2>
          </div>

          <div className="p-8 flex flex-col items-center gap-6 bg-white -mt-4 rounded-t-3xl z-10 text-center">
            {/* Ikon Sidik Jari Biometrik Besar khas Figma */}
            <button
              type="button"
              onClick={handleScanFingerprint}
              className={`relative w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all group ${
                isFingerprintScanned
                  ? "border-green-500 bg-green-100/50 shadow-lg scale-105"
                  : isScanning
                  ? "border-orange-500 bg-orange-100/30 animate-pulse"
                  : "border-brown-900/15 bg-cream/40 hover:border-orange-500 hover:scale-102"
              }`}
            >
              {/* SVG Sidik Jari Khas Figma */}
              <svg
                className={`w-16 h-16 transition-colors ${
                  isFingerprintScanned
                    ? "text-green-500"
                    : isScanning
                    ? "text-orange-500"
                    : "text-brown-900/70 group-hover:text-brown-900"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0c0 1.637.295 3.208.834 4.665M12 3a9 9 0 019 9c0 1.621-.32 3.167-.9 4.582"
                />
              </svg>

              {isScanning && (
                <div className="absolute inset-x-2 h-1 bg-orange-500 rounded-full animate-bounce" />
              )}
            </button>

            <div>
              <h3 className="font-display font-bold text-sm text-brown-900">
                {isFingerprintScanned
                  ? "Sidik Jari Berhasil Didaftarkan! ✨"
                  : isScanning
                  ? "Memindai Sensor Biometrik..."
                  : "Ketuk untuk Memindai Sidik Jari"}
              </h3>
              <p className="text-xs text-brown-700/80 mt-1 max-w-xs leading-relaxed">
                Scan your biometric fingerprint to make your account more secure and enable instant login.
              </p>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("NOTIFICATIONS")}
              className="w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>{isFingerprintScanned ? "Continue" : "Lewati / Continue"}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. NOTIFICATION SETUP */}
      {/* ========================================================================= */}
      {step === "NOTIFICATIONS" && (
        <div className="flex flex-col">
          <div className="relative w-full bg-[#E2EBD2] pt-6 pb-8 px-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setStep("FINGERPRINT")}
              className="absolute left-5 top-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-brown-900 flex items-center justify-center text-sm shadow-xs transition-colors"
            >
              ←
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-brown-700/70">
              Step 6 of 6 • Preferences
            </span>
            <h2 className="font-display font-extrabold text-xl text-brown-900 mt-1">
              Notification Setup
            </h2>
          </div>

          <div className="p-8 flex flex-col gap-5 bg-white -mt-4 rounded-t-3xl z-10">
            {/* Ilustrasi Yoga/Relaksasi khas Figma */}
            <div className="w-full py-3 flex items-center justify-center bg-cream/40 rounded-2xl border border-brown-900/10">
              <span className="text-4xl">🧘‍♂️</span>
            </div>

            {/* 3 Toggle Switch (Chatbot, Wellness, Community) */}
            <div className="flex flex-col gap-3">
              {/* Chatbot Notification */}
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-sm">
                    💬
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">
                      Chatbot Notification
                    </span>
                    <span className="text-[10px] text-brown-700">
                      Pengingat sesi curhat Zyba Companion
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifChatbot}
                  onChange={(e) => setNotifChatbot(e.target.checked)}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </div>

              {/* Wellness Notification */}
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-100 text-green-500 flex items-center justify-center text-sm">
                    🌿
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">
                      Wellness Notification
                    </span>
                    <span className="text-[10px] text-brown-700">
                      Mood check-in harian & breathing tracker
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifWellness}
                  onChange={(e) => setNotifWellness(e.target.checked)}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </div>

              {/* Community Notification */}
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
                    👥
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brown-900">
                      Community Notification
                    </span>
                    <span className="text-[10px] text-brown-700">
                      Update cerita hangat dari teman ZYBA
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifCommunity}
                  onChange={(e) => setNotifCommunity(e.target.checked)}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Tombol Continue → */}
            <button
              type="button"
              onClick={() => setStep("COMPILING")}
              className="mt-2 w-full py-3.5 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-md active:scale-98"
            >
              <span>Continue</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. COMPILING DATA... (Orange Screen khas Figma) */}
      {/* ========================================================================= */}
      {step === "COMPILING" && (
        <div className="w-full min-h-[460px] bg-gradient-to-br from-orange-500 to-[#F2884B] p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
          {/* Ornamen Lingkaran Halus */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/10 blur-xl pointer-events-none" />

          {/* 4-Petal Floral Logomark berputar lembut */}
          <div className="relative w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-6 shadow-xl animate-pulse">
            <div className="w-6 h-6 rounded-full bg-white/90" />
            <div className="absolute w-4 h-4 rounded-full bg-cream -top-1 left-1/2 -translate-x-1/2" />
            <div className="absolute w-4 h-4 rounded-full bg-green-100 -bottom-1 left-1/2 -translate-x-1/2" />
            <div className="absolute w-4 h-4 rounded-full bg-cream -left-1 top-1/2 -translate-y-1/2" />
            <div className="absolute w-4 h-4 rounded-full bg-green-100 -right-1 top-1/2 -translate-y-1/2" />
          </div>

          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2">
            Compiling Data...
          </h2>
          <p className="text-xs text-white/90 max-w-xs leading-relaxed mb-6 font-medium">
            Please wait... We&apos;re calculating the data based on your assessment inputs.
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xs bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/20">
            <div
              className="bg-white h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${compileProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white/80 mt-2">
            {compileProgress}% Selesai
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. AKUN SIAP — arahkan ke assessment dulu, bukan tampilkan skor palsu */}
      {/* ========================================================================= */}
      {step === "ALL_SET_UP" && (
        <div className="flex flex-col bg-[#EAF2DD] min-h-[460px] p-8 items-center justify-between text-center relative overflow-hidden">
          {/* Ornamen latar */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-green-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center relative z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-500 bg-white/70 px-3 py-1 rounded-full border border-green-500/20 mb-2">
              Akun Berhasil Dibuat ✓
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-brown-900">
              You&apos;re all Set Up!
            </h2>
            <span className="text-xs text-brown-700/80 mt-1 max-w-xs leading-relaxed">
              Profilmu sudah siap. Langkah selanjutnya adalah mengisi
              <strong className="text-brown-900"> Mental Health Assessment</strong> agar
              ZYBA bisa menyusun rencana kesehatan yang dipersonalisasi untukmu.
            </span>
          </div>

          {/* Ilustrasi — clipboard assessment */}
          <div className="relative z-10 my-4 flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-3xl bg-white shadow-xl border-2 border-green-500/20 flex flex-col items-center justify-center gap-1">
              <span className="text-4xl">📋</span>
              <span className="text-[10px] font-bold text-brown-700 uppercase tracking-wider">Assessment</span>
            </div>
            {/* 3 langkah mini */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {["Mood", "Stres", "Tidur", "Gejala"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-green-500/20 text-brown-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 w-full relative z-10">
            <button
              type="button"
              onClick={handleFinishAndRedirect}
              className="w-full py-4 rounded-full bg-brown-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg"
            >
              <span>Mulai Assessment Sekarang</span>
              <span className="text-base">→</span>
            </button>
            <p className="text-[10px] text-brown-700/60">
              ±5 menit · Privat & aman · Bisa diulang kapan saja
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
