"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProfileUser } from "./ProfilePopover";

interface ProfileSettingsModalProps {
  user: ProfileUser;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (updated: Partial<ProfileUser>) => void;
  onLogout: () => void;
}

export default function ProfileSettingsModal({
  user,
  isOpen,
  onClose,
  onUserUpdate,
  onLogout,
}: ProfileSettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "privacy" | "messaging" | "notifications" | "plus">("account");
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user.name || "Alex Rivera");
  const [isRevealingEmail, setIsRevealingEmail] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email || "alex@zyba.app");
  const [phoneNumber, setPhoneNumber] = useState("+62 812-3456-7890");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(phoneNumber);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setUsernameInput(user.name);
    setEmailInput(user.email);
  }, [user]);

  if (!isOpen || !mounted) return null;

  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return;
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PROFILE",
          name: usernameInput.trim(),
          email: user.email,
        }),
      });
      onUserUpdate({ name: usernameInput.trim() });
      setIsEditingUsername(false);
      triggerSuccess("Username berhasil diperbarui!");
    } catch {
      setIsEditingUsername(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!emailInput.trim()) return;
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PROFILE",
          name: user.name,
          email: emailInput.trim(),
        }),
      });
      onUserUpdate({ email: emailInput.trim() });
      setIsEditingEmail(false);
      triggerSuccess("Email berhasil diperbarui!");
    } catch {
      setIsEditingEmail(false);
    }
  };

  const handleSavePhone = () => {
    setPhoneNumber(phoneInput);
    setIsEditingPhone(false);
    triggerSuccess("Nomor telepon berhasil disimpan!");
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CHANGE_PASSWORD",
          email: user.email,
          newPassword,
        }),
      });
      setIsChangingPassword(false);
      setNewPassword("");
      triggerSuccess("Password berhasil diubah!");
    } catch {
      setIsChangingPassword(false);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const maskedEmail = user.email
    ? user.email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(Math.max(6, b.length)) + c)
    : "*****************@gmail.com";

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-brown-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="flex w-full max-w-5xl h-[86vh] bg-cream text-brown-900 rounded-3xl overflow-hidden shadow-2xl border border-brown-900/15 relative">
        <aside className="w-64 bg-[#EFE9DD] p-5 flex flex-col justify-between overflow-y-auto shrink-0 border-r border-brown-900/10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-display font-bold text-base text-white overflow-hidden shadow-xs shrink-0">
                {user.avatarUrl && user.avatarUrl.length <= 4 ? (
                  <span>{user.avatarUrl}</span>
                ) : (
                  <span>{user.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-brown-900 truncate">{user.name}</span>
                <span className="text-[11px] text-brown-700 hover:text-orange-500 cursor-pointer transition-colors font-medium">
                  Edit Profiles ✎
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pengaturan..."
                className="w-full bg-white/90 text-xs text-brown-900 placeholder:text-brown-700/50 rounded-xl px-3 py-2 outline-hidden border border-brown-900/10 focus:border-orange-500 transition-colors"
              />
              <svg className="w-3.5 h-3.5 text-brown-700/60 absolute right-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-brown-700/70 uppercase tracking-wider px-2 py-1">
                User Settings
              </span>

              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === "account"
                    ? "bg-brown-900 text-cream shadow-xs"
                    : "text-brown-700 hover:bg-brown-900/5 hover:text-brown-900"
                }`}
              >
                <span>Account</span>
              </button>

              {activeTab === "account" && (
                <div className="pl-3.5 flex flex-col gap-0.5 border-l-2 border-orange-500 ml-3 my-0.5">
                  <a href="#account-info" className="text-[11px] font-semibold text-brown-900 py-1 px-1 hover:text-orange-500">
                    Account Info
                  </a>
                  <a href="#password-security" className="text-[11px] font-medium text-brown-700 py-1 px-1 hover:text-orange-500">
                    Password & Security
                  </a>
                  <span className="text-[11px] font-medium text-brown-700/60 py-1 px-1">
                    Account Standing
                  </span>
                  <span className="text-[11px] font-medium text-brown-700/60 py-1 px-1">
                    Family Center
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab("privacy")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === "privacy"
                    ? "bg-brown-900 text-cream shadow-xs"
                    : "text-brown-700 hover:bg-brown-900/5 hover:text-brown-900"
                }`}
              >
                <span>Data & Privacy</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("messaging")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === "messaging"
                    ? "bg-brown-900 text-cream shadow-xs"
                    : "text-brown-700 hover:bg-brown-900/5 hover:text-brown-900"
                }`}
              >
                <span>Messaging Permissions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === "notifications"
                    ? "bg-brown-900 text-cream shadow-xs"
                    : "text-brown-700 hover:bg-brown-900/5 hover:text-brown-900"
                }`}
              >
                <span>Notifications</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 border-t border-brown-900/10 pt-2.5">
              <span className="text-[10px] font-extrabold text-brown-700/70 uppercase tracking-wider px-2 py-1">
                Billing & Langganan
              </span>

              <button
                type="button"
                onClick={() => setActiveTab("plus")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === "plus"
                    ? "bg-brown-900 text-cream shadow-xs"
                    : "text-brown-700 hover:bg-brown-900/5 hover:text-brown-900"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>Zyba Plus</span>
                </div>
                <span className="text-[9px] bg-orange-100 text-orange-600 font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                  1 BULAN FREE
                </span>
              </button>

              <div className="px-3 py-1.5 text-xs text-brown-700/70 font-medium">Subscriptions</div>
              <div className="px-3 py-1.5 text-xs text-brown-700/70 font-medium">Gift Inventory</div>
              <div className="px-3 py-1.5 text-xs text-brown-700/70 font-medium">Billing History</div>
            </div>
          </div>

          <div className="border-t border-brown-900/10 pt-3">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition-colors"
            >
              <span>Keluar (Log Out)</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-white p-8 sm:p-10 overflow-y-auto flex flex-col gap-7 relative">
          <div className="absolute top-6 right-8 flex flex-col items-center gap-1 z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-brown-900/20 text-brown-700 hover:text-brown-900 hover:border-brown-900 hover:bg-cream flex items-center justify-center transition-all cursor-pointer"
              title="Tutup Pengaturan (ESC)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-[10px] font-bold text-brown-700/70 tracking-wider uppercase">ESC</span>
          </div>

          {saveSuccessMsg && (
            <div className="bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 animate-in fade-in">
              <span>✓</span>
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-display font-extrabold text-brown-900">Account</h2>
            <p className="text-xs text-brown-700 mt-1">Kelola data profil pengguna, alamat email, dan keamanan akun ZYBA milikmu.</p>
          </div>

          <div id="account-info" className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brown-700">Account Info</h3>

            <div className="bg-cream/50 rounded-2xl p-5 flex flex-col gap-4 border border-brown-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brown-900/10">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-brown-700/80">Username</span>
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="bg-white text-xs text-brown-900 px-3 py-1.5 rounded-xl border border-brown-900/15 focus:border-orange-500 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleSaveUsername}
                        className="text-xs font-bold bg-orange-500 text-white px-3.5 py-1.5 rounded-full hover:bg-orange-600 transition-colors shadow-2xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingUsername(false)}
                        className="text-xs font-semibold text-brown-700 hover:text-brown-900 px-2 py-1.5"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-brown-900 mt-0.5">{user.name}</span>
                  )}
                </div>

                {!isEditingUsername && (
                  <button
                    type="button"
                    onClick={() => setIsEditingUsername(true)}
                    className="bg-white border border-brown-900/15 hover:bg-cream text-brown-900 text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brown-900/10">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-brown-700/80">Email</span>
                  {isEditingEmail ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="bg-white text-xs text-brown-900 px-3 py-1.5 rounded-xl border border-brown-900/15 focus:border-orange-500 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleSaveEmail}
                        className="text-xs font-bold bg-orange-500 text-white px-3.5 py-1.5 rounded-full hover:bg-orange-600 transition-colors shadow-2xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(false)}
                        className="text-xs font-semibold text-brown-700 hover:text-brown-900 px-2 py-1.5"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-semibold text-brown-900">
                        {isRevealingEmail ? user.email : maskedEmail}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsRevealingEmail(!isRevealingEmail)}
                        className="text-xs text-orange-600 hover:underline cursor-pointer font-bold"
                      >
                        {isRevealingEmail ? "Sembunyikan" : "Reveal"}
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingEmail && (
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(true)}
                    className="bg-white border border-brown-900/15 hover:bg-cream text-brown-900 text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-brown-700/80">Phone Number</span>
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="bg-white text-xs text-brown-900 px-3 py-1.5 rounded-xl border border-brown-900/15 focus:border-orange-500 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleSavePhone}
                        className="text-xs font-bold bg-orange-500 text-white px-3.5 py-1.5 rounded-full hover:bg-orange-600 transition-colors shadow-2xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingPhone(false)}
                        className="text-xs font-semibold text-brown-700 hover:text-brown-900 px-2 py-1.5"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-brown-700 mt-0.5">
                      {phoneNumber || "Belum menambahkan nomor telepon."}
                    </span>
                  )}
                </div>

                {!isEditingPhone && (
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(true)}
                    className="bg-white border border-brown-900/15 hover:bg-cream text-brown-900 text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                  >
                    {phoneNumber ? "Edit" : "Tambah"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div id="password-security" className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brown-700">Password & Security</h3>

            <div className="bg-cream/50 rounded-2xl p-5 flex flex-col gap-4 border border-brown-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brown-900/10">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-brown-700/80">Password</span>
                  {isChangingPassword ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <input
                        type="password"
                        placeholder="Password Baru"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white text-xs text-brown-900 px-3 py-1.5 rounded-xl border border-brown-900/15 focus:border-orange-500 outline-hidden w-64"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          className="text-xs font-bold bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors shadow-2xs"
                        >
                          Simpan Password Baru
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(false)}
                          className="text-xs font-semibold text-brown-700 hover:text-brown-900 px-2 py-1.5"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold tracking-widest text-brown-900 mt-0.5">••••••••••••</span>
                  )}
                </div>

                {!isChangingPassword && (
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-white border border-brown-900/15 hover:bg-cream text-brown-900 text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pb-3 border-b border-brown-900/10">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-brown-900">Multi-Factor Authentication</span>
                  <span className="text-xs text-brown-700 mt-0.5">
                    Amankan akun ZYBA dengan verifikasi 2 langkah (OTP).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerSuccess("Fitur 2FA aktif!")}
                  className="flex items-center gap-1 text-xs font-bold text-green-600 hover:underline cursor-pointer"
                >
                  Set up ❯
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-brown-900">Logged-in Devices</span>
                  <span className="text-xs text-brown-700 mt-0.5">
                    1 perangkat aktif (Web Desktop Browser)
                  </span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-bold text-brown-700 hover:text-brown-900"
                >
                  1 device ❯
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
