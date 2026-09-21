"use client";

import React, { useState, useEffect } from "react";
import ProfileSettingsModal from "@/components/profile/ProfileSettingsModal";
import {
  SettingsBanner,
  ProfileSection,
  SettingsToggles,
} from "./components";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@zyba.app");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [location, setLocation] = useState("Jakarta, Indonesia");
  const [bio, setBio] = useState("Mahasiswa & Gen Z Wellness Enthusiast.");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [commStyle, setCommStyle] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Instant cache hydration
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
            if (data.user.communicationStyle) {
              setCommStyle(data.user.communicationStyle);
            }
          }
        }
      } catch (err) {
        // Fallback silently
      }
    }
    loadUser();
  }, []);

  const handleSave = async () => {
    setIsSaved(false);
    try {
      await fetch("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          location,
          bio,
          communicationStyle: commStyle,
        }),
      });

      // Update cache
      try {
        const cached = localStorage.getItem("zyba_user_cache");
        const parsed = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          "zyba_user_cache",
          JSON.stringify({ ...parsed, name, email })
        );
      } catch {}

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <SettingsBanner
        onOpenProfileModal={() => setShowProfileModal(true)}
        onSave={handleSave}
        isSaved={isSaved}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile & Account Details */}
        <ProfileSection
          name={name}
          email={email}
          phone={phone}
          location={location}
          bio={bio}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onLocationChange={setLocation}
          onBioChange={setBio}
        />

        {/* Right Column: AI Style & Security Toggles */}
        <SettingsToggles
          commStyle={commStyle}
          onCommStyleChange={setCommStyle}
          notifChatbot={notifChatbot}
          onNotifChatbotChange={setNotifChatbot}
          notifWellness={notifWellness}
          onNotifWellnessChange={setNotifWellness}
          notifCommunity={notifCommunity}
          onNotifCommunityChange={setNotifCommunity}
          fingerprintEnabled={fingerprintEnabled}
          onFingerprintChange={setFingerprintEnabled}
        />
      </div>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        user={{ name, email }}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUserUpdate={(u) => {
          if (u.name) setName(u.name);
          if (u.email) setEmail(u.email);
        }}
        onLogout={async () => {
          await fetch("/api/auth", { method: "DELETE" });
          window.location.href = "/login";
        }}
      />
    </div>
  );
}
