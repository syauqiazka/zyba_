"use client";

import React, { useState, useEffect } from "react";
import ProfileSettingsModal from "@/components/profile/ProfileSettingsModal";
import { SettingsBanner, ProfileSection, SettingsToggles } from "./components";
import { PersonaId } from "@/backend/ai/personas";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PLUS">("FREE");
  const [avatarKey, setAvatarKey] = useState("fox");
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("KINA");
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Load from localStorage cache first (instant render)
    try {
      const cached = localStorage.getItem("zyba_user_cache");
      if (cached) {
        const p = JSON.parse(cached);
        if (p.name) setName(p.name);
        if (p.email) setEmail(p.email);
        if (p.username) setUsername(p.username);
        if (p.bio) setBio(p.bio);
        if (p.phone) setPhone(p.phone);
        if (p.location) setLocation(p.location);
        if (p.plan) setPlan(p.plan);
        if (p.avatarKey) setAvatarKey(p.avatarKey);
      }
      const savedPersona = localStorage.getItem("zyba_companion_persona") as PersonaId | null;
      if (savedPersona) setSelectedPersona(savedPersona);
    } catch {}

    async function loadFromDB() {
      try {
        const [userRes, notifRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/settings/notifications"),
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          if (data.user) {
            const u = data.user;
            setName(u.name || "");
            setEmail(u.email || "");
            setPhone(u.phone || "");
            setLocation(u.location || "");
            setBio(u.bio || "");
            setUsername(u.username || "");
            setPlan(u.plan || "FREE");
            setAvatarKey(u.avatarKey || "fox");
            // Sync full profile into localStorage cache
            try {
              const existing = localStorage.getItem("zyba_user_cache");
              const prev = existing ? JSON.parse(existing) : {};
              localStorage.setItem("zyba_user_cache", JSON.stringify({
                ...prev, name: u.name, email: u.email,
                username: u.username || prev.username, bio: u.bio || prev.bio,
                phone: u.phone || prev.phone, location: u.location || prev.location,
                plan: u.plan, avatarKey: u.avatarKey, avatarUrl: u.avatarUrl,
              }));
            } catch {}
          }
        }

        if (notifRes.ok) {
          const { pref } = await notifRes.json();
          if (pref) {
            setNotifChatbot(pref.companionNotif ?? true);
            setNotifWellness(pref.wellnessNotif ?? true);
            setNotifCommunity(pref.communityNotif ?? false);
          }
        }
      } catch (err) {
        console.error("[Settings] Load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFromDB();
  }, []);

  const handleSave = async () => {
    setIsSaved(false);
    setSaveError(null);
    try {
      const [profileRes] = await Promise.all([
        fetch("/api/user/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, location, bio, ...(username ? { username } : {}) }),
        }),
        fetch("/api/settings/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companionNotif: notifChatbot, wellnessNotif: notifWellness, communityNotif: notifCommunity }),
        }),
      ]);

      if (!profileRes.ok) {
        const errData = await profileRes.json();
        setSaveError(errData.error || "Gagal menyimpan profil");
        return;
      }

      const profileData = await profileRes.json();
      const updated = profileData.user;
      // Sync localStorage
      try {
        const existing = localStorage.getItem("zyba_user_cache");
        const prev = existing ? JSON.parse(existing) : {};
        localStorage.setItem("zyba_user_cache", JSON.stringify({
          ...prev,
          name: updated.name || name, email: updated.email || email,
          username: updated.username ?? username, bio: updated.bio ?? bio,
          phone: updated.phone ?? phone, location: updated.location ?? location,
        }));
      } catch {}
      try { localStorage.setItem("zyba_companion_persona", selectedPersona); } catch {}

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
      setSaveError("Terjadi kesalahan. Coba lagi.");
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
        localStorage.clear();
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

      {saveError && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-xs font-bold px-4 py-2.5 rounded-xl">
          ⚠ {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ProfileSection
          name={name} email={email} phone={phone} location={location} bio={bio}
          plan={plan} avatarKey={avatarKey} isLoading={isLoading}
          onNameChange={setName} onEmailChange={setEmail} onPhoneChange={setPhone}
          onLocationChange={setLocation} onBioChange={setBio}
        />

        <SettingsToggles
          selectedPersona={selectedPersona}
          onPersonaChange={(p) => {
            setSelectedPersona(p);
            try { localStorage.setItem("zyba_companion_persona", p); } catch {}
          }}
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

      <ProfileSettingsModal
        user={{ name, email, username, bio, handle: username ? `@${username}` : undefined }}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUserUpdate={(u) => {
          if (u.name) setName(u.name);
          if (u.email) setEmail(u.email);
          if (u.username !== undefined) setUsername(u.username || "");
          if (u.bio !== undefined) setBio(u.bio || "");
        }}
        onLogout={async () => {
          await fetch("/api/auth", { method: "DELETE" });
          localStorage.clear();
          window.location.href = "/login";
        }}
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
