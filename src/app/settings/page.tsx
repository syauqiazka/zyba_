"use client";

import React, { useState, useEffect } from "react";
import ProfileSettingsModal from "@/components/profile/ProfileSettingsModal";
import { SettingsBanner, ProfileSection, SettingsToggles } from "./components";
import { PersonaId } from "@/backend/ai/personas";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@zyba.app");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [location, setLocation] = useState("Jakarta, Indonesia");
  const [bio, setBio] = useState("Mahasiswa & Gen Z Wellness Enthusiast.");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("KINA");
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("zyba_user_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {}

    async function loadUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setName(data.user.name || "Alex Rivera");
            setEmail(data.user.email || "alex@zyba.app");
            setPhone(data.user.phone || "+62 812-3456-7890");
            setLocation(data.user.location || "Jakarta, Indonesia");
            setBio(data.user.bio || "Mahasiswa & Gen Z Wellness Enthusiast.");
          }
        }
        // Load notification prefs
        const notifRes = await fetch("/api/settings/notifications");
        if (notifRes.ok) {
          const { pref } = await notifRes.json();
          if (pref) {
            setNotifChatbot(pref.companionNotif ?? true);
            setNotifWellness(pref.wellnessNotif ?? true);
            setNotifCommunity(pref.communityNotif ?? false);
          }
        }
      } catch {}
    }
    loadUser();
  }, []);

  const handleSave = async () => {
    setIsSaved(false);
    try {
      await Promise.all([
        fetch("/api/user/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, location, bio }),
        }),
        fetch("/api/settings/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companionNotif: notifChatbot, wellnessNotif: notifWellness, communityNotif: notifCommunity }),
        }),
      ]);
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        const parsed = cached ? JSON.parse(cached) : {};
        localStorage.setItem("zyba_user_cache", JSON.stringify({ ...parsed, name, email }));
      } catch {}
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/settings/export");
      if (!res.ok) throw new Error("Export gagal");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zyba-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengekspor data. Coba lagi.");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus akun.");
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <SettingsBanner onOpenProfileModal={() => setShowProfileModal(true)} onSave={handleSave} isSaved={isSaved} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ProfileSection name={name} email={email} phone={phone} location={location} bio={bio}
          onNameChange={setName} onEmailChange={setEmail} onPhoneChange={setPhone}
          onLocationChange={setLocation} onBioChange={setBio} />

        <SettingsToggles
          selectedPersona={selectedPersona}
          onPersonaChange={setSelectedPersona}
          notifChatbot={notifChatbot} onNotifChatbotChange={setNotifChatbot}
          notifWellness={notifWellness} onNotifWellnessChange={setNotifWellness}
          notifCommunity={notifCommunity} onNotifCommunityChange={setNotifCommunity}
          fingerprintEnabled={fingerprintEnabled} onFingerprintChange={setFingerprintEnabled}
        />
      </div>

      {/* Bagian 24.1: Privasi Data */}
      <div className="rounded-3xl p-6 border border-brown-900/10 bg-white flex flex-col gap-4">
        <h3 className="font-display text-base font-bold text-brown-900 border-b border-brown-900/10 pb-2">
          4. Privasi & Data
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={handleExportData}
            className="flex-1 py-2.5 rounded-xl border border-brown-900/15 text-xs font-bold text-brown-900 hover:bg-cream transition-colors">
            Ekspor Semua Data Saya (JSON)
          </button>
          <button type="button" onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 py-2.5 rounded-xl border border-danger/30 text-xs font-bold text-danger hover:bg-danger/5 transition-colors">
            Hapus Akun Saya
          </button>
        </div>
        <p className="text-[10px] text-brown-700/60">
          Ekspor mengunduh semua data mood, jurnal, percakapan, dan post komunitas dalam format JSON.
          Hapus akun bersifat permanen dan menghapus data dari seluruh layanan ZYBA.
        </p>
      </div>

      <ProfileSettingsModal user={{ name, email }} isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUserUpdate={(u) => { if (u.name) setName(u.name); if (u.email) setEmail(u.email); }}
        onLogout={async () => { await fetch("/api/auth", { method: "DELETE" }); window.location.href = "/login"; }}
      />

      {/* Konfirmasi hapus akun */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-base text-brown-900">Hapus Akun?</h3>
            <p className="text-xs text-brown-700">
              Semua data kamu (mood, jurnal, percakapan, post komunitas) akan dihapus permanen dari seluruh layanan ZYBA.
              Aksi ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-brown-900/15 text-xs font-bold text-brown-700 hover:bg-cream">
                Batal
              </button>
              <button type="button" onClick={handleDeleteAccount} disabled={isDeleting}
                className="flex-1 py-2.5 rounded-full bg-danger text-white text-xs font-bold hover:opacity-90 disabled:opacity-50">
                {isDeleting ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
