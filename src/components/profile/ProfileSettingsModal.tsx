"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ProfileUser } from "./ProfilePopover";
import PersonaPicker from "@/app/companion/components/PersonaPicker";
import { PersonaId } from "@/backend/ai/personas";

interface ProfileSettingsModalProps {
  user: ProfileUser;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (updated: Partial<ProfileUser>) => void;
  onLogout: () => void;
}

// Sidebar structure — sama seperti sebelumnya, tapi sekarang id = section anchor
interface SidebarItem { id: string; label: string; badge?: string; badgeColor?: string }
interface SidebarSection { label: string; key: string; items: SidebarItem[] }

const SIDEBAR: SidebarSection[] = [
  { label: "PENGATURAN AKUN", key: "account", items: [
    { id: "profile-info",      label: "Info Profil" },
    { id: "password-security", label: "Password & Keamanan" },
    { id: "devices",           label: "Perangkat Aktif" },
    { id: "connections",       label: "Koneksi Sosial" },
  ]},
  { label: "PRIVASI & DATA", key: "privacy", items: [
    { id: "privacy-data",   label: "Data & Privasi" },
    { id: "delete-account", label: "Hapus Akun", badgeColor: "text-danger" },
  ]},
  { label: "COMPANION & WELLNESS", key: "companion", items: [
    { id: "persona",           label: "Karakter Zyba", badge: "BARU", badgeColor: "bg-orange-100 text-orange-600" },
    { id: "gaya-bahasa",       label: "Gaya Bahasa AI" },
    { id: "riwayat-companion", label: "Riwayat Percakapan" },
  ]},
  { label: "NOTIFIKASI", key: "notif", items: [
    { id: "notif-push",  label: "Push & In-App" },
    { id: "notif-email", label: "Email" },
  ]},
  { label: "KOMUNITAS", key: "community", items: [
    { id: "community-visibility", label: "Visibilitas Postingan" },
    { id: "community-activity",   label: "Aktivitas & Interaksi" },
  ]},
  { label: "BILLING & LANGGANAN", key: "billing", items: [
    { id: "zyba-plus",       label: "Zyba Plus", badge: "1 BULAN FREE", badgeColor: "bg-green-100 text-green-700" },
    { id: "billing-history", label: "Riwayat Pembayaran" },
  ]},
  { label: "PREFERENSI APLIKASI", key: "app", items: [
    { id: "appearance",    label: "Tampilan & Tema" },
    { id: "language",      label: "Bahasa & Wilayah" },
    { id: "accessibility", label: "Aksesibilitas" },
  ]},
  { label: "INFO & BANTUAN", key: "info", items: [
    { id: "crisis-resources", label: "Hotline Krisis", badge: "📞" },
    { id: "about",            label: "Tentang ZYBA" },
  ]},
];

const CRISIS = [
  { name: "Into The Light Indonesia", phone: "119 ext 8" },
  { name: "Yayasan Pulih", phone: "(021) 788-42580" },
  { name: "Hotline Kesehatan Jiwa Kemenkes", phone: "500-454" },
];

export default function ProfileSettingsModal({ user, isOpen, onClose, onUserUpdate, onLogout }: ProfileSettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState("profile-info");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["account", "companion"])
  );
  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingTo = useRef(false);

  // Account state
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || user.handle || "");
  const [bio, setBio] = useState(user.bio || "");
  const [email] = useState(user.email || "");
  const [phone, setPhone] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [revealEmail, setRevealEmail] = useState(false);

  // Companion
  const [persona, setPersona] = useState<PersonaId>("KINA");
  const [commStyle, setCommStyle] = useState<"CASUAL" | "FORMAL" | "FUN">("CASUAL");

  // Notif
  const [notifChatbot, setNotifChatbot] = useState(true);
  const [notifWellness, setNotifWellness] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);

  // Community
  const [postVisibility, setPostVisibility] = useState<"public" | "anonymous">("public");
  const [fontSize, setFontSize] = useState("normal");

  // Delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setName(user.name);
    setUsername(user.username || user.handle || "");
    setBio(user.bio || "");
  }, [user]);
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/settings/notifications").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.pref) { setNotifChatbot(d.pref.companionNotif ?? true); setNotifWellness(d.pref.wellnessNotif ?? true); setNotifCommunity(d.pref.communityNotif ?? false); }
    }).catch(() => {});
  }, [isOpen]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  // ── Scroll-spy via IntersectionObserver ─────────────────────────────────
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const container = contentRef.current;
    if (!container) return;

    // Small delay to let DOM render
    const t = setTimeout(() => {
      observerRef.current?.disconnect();
      const allIds = SIDEBAR.flatMap(s => s.items.map(i => i.id));
      const entries = new Map<string, number>(); // id → intersectionRatio

      observerRef.current = new IntersectionObserver(
        (obs) => {
          if (isScrollingTo.current) return;
          obs.forEach(e => { entries.set(e.target.id, e.intersectionRatio); });
          // Pick the section with highest visibility
          let bestId = activeId;
          let bestRatio = -1;
          entries.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; bestId = id; } });
          if (bestRatio > 0) setActiveId(bestId);
        },
        { root: container, threshold: [0, 0.1, 0.3, 0.5, 1.0], rootMargin: "-10% 0px -60% 0px" }
      );

      allIds.forEach(id => {
        const el = container.querySelector(`#${id}`);
        if (el) observerRef.current!.observe(el);
      });
    }, 100);

    return () => { clearTimeout(t); observerRef.current?.disconnect(); };
  }, [isOpen, mounted]);

  // ── Smooth scroll to section ─────────────────────────────────────────────
  const scrollTo = useCallback((id: string) => {
    setActiveId(id);
    isScrollingTo.current = true;
    const container = contentRef.current;
    const el = container?.querySelector(`#${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { isScrollingTo.current = false; }, 800);
    }
  }, []);

  if (!isOpen || !mounted) return null;

  const ok = (msg: string) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(null), 3000); };
  const maskedEmail = email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 6)) + c);
  const maskedEmailShort = email.replace(/^(.)(.*)(@.*)$/, (_, a, _b, c) => a + "***" + c);

  const saveName = async () => {
    try { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_PROFILE", name, email }) }); onUserUpdate({ name }); setIsEditingName(false); ok("Nama diperbarui!"); } catch { setIsEditingName(false); }
  };
  const saveUsername = async () => {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal mengubah username");
        return;
      }
      setUsername(clean);
      onUserUpdate({ username: clean, handle: clean });
      setIsEditingUsername(false);
      ok("Username (@" + clean + ") berhasil disimpan!");
    } catch {
      setIsEditingUsername(false);
    }
  };
  const saveBio = async () => {
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bio.trim() }),
      });
      if (res.ok) {
        onUserUpdate({ bio: bio.trim() });
        setIsEditingBio(false);
        ok("Bio berhasil disimpan!");
      }
    } catch {
      setIsEditingBio(false);
    }
  };
  const savePhone = async () => {
    try { await fetch("/api/user/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) }); setIsEditingPhone(false); ok("Nomor telepon disimpan!"); } catch { setIsEditingPhone(false); }
  };
  const savePassword = async () => {
    if (!newPassword.trim()) return;
    try { await fetch("/api/user/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: newPassword }) }); setIsChangingPassword(false); setNewPassword(""); ok("Password diperbarui!"); } catch { setIsChangingPassword(false); }
  };
  const saveNotif = async () => {
    try { await fetch("/api/settings/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ companionNotif: notifChatbot, wellnessNotif: notifWellness, communityNotif: notifCommunity }) }); ok("Notifikasi disimpan!"); } catch {}
  };
  const exportData = async () => {
    try { const res = await fetch("/api/settings/export"); if (!res.ok) throw new Error(); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `zyba-data-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); } catch { alert("Gagal mengekspor data."); }
  };
  const deleteAccount = async () => {
    setIsDeleting(true);
    try { const res = await fetch("/api/account/delete", { method: "DELETE" }); if (res.ok) { window.location.href = "/"; } else { const d = await res.json(); alert(d.error || "Gagal."); } } catch { alert("Terjadi kesalahan."); } finally { setIsDeleting(false); setShowDeleteConfirm(false); }
  };

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[88vh] flex overflow-hidden border border-brown-900/10">

        {/* ── Sidebar ── */}
        <aside className="w-60 shrink-0 bg-cream/60 border-r border-brown-900/10 flex flex-col overflow-y-auto">
          {/* User card */}
          <div className="p-4 border-b border-brown-900/10 shrink-0">
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/70 border border-brown-900/10">
              <div className="w-10 h-10 rounded-xl bg-brown-900 text-white font-display font-extrabold flex items-center justify-center text-base shrink-0">
                {name.slice(0,1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-brown-900 truncate">{name}</p>
                <p className="text-[10px] text-brown-700 truncate">{maskedEmailShort}</p>
              </div>
            </div>
          </div>

          {/* Nav — section header = toggle dropdown, item = smooth scroll + scroll-spy highlight */}
          <div className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
            {SIDEBAR.map(section => {
              const isExpanded = expandedSections.has(section.key);
              const hasActive = section.items.some(i => i.id === activeId);
              return (
                <div key={section.key} className="mb-0.5">
                  {/* Section header — clickable toggle */}
                  <button type="button" onClick={() => toggleSection(section.key)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition-colors select-none ${
                      hasActive && !isExpanded
                        ? "text-orange-500 bg-orange-50"
                        : "text-brown-700/60 hover:text-brown-900 hover:bg-brown-900/5"
                    }`}>
                    <span>{section.label}</span>
                    <span className={`text-[10px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                  </button>

                  {/* Sub-items dropdown */}
                  {isExpanded && (
                    <div className="mt-0.5 flex flex-col gap-0.5 pl-1">
                      {section.items.map(item => (
                        <button key={item.id} type="button"
                          onClick={() => scrollTo(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                            activeId === item.id
                              ? "bg-brown-900 text-white shadow-sm"
                              : `text-brown-700 hover:bg-brown-900/5 hover:text-brown-900 ${item.badgeColor?.includes("danger") ? "hover:!text-danger" : ""}`
                          } ${item.badgeColor?.includes("danger") && activeId !== item.id ? "text-danger/80" : ""}`}>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              activeId === item.id ? "bg-white/20 text-white" : (item.badgeColor || "bg-brown-900/10 text-brown-700")
                            }`}>{item.badge}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-brown-900/10 shrink-0">
            <button type="button" onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition-colors">
              <span>🚪</span><span>Keluar (Log Out)</span>
            </button>
          </div>
        </aside>

        {/* ── Main: satu halaman panjang, scroll-spy ── */}
        <main ref={contentRef} className="flex-1 overflow-y-auto relative">
          {/* Close button fixed di pojok */}
          <button type="button" onClick={onClose}
            className="sticky top-6 float-right mr-6 mt-6 z-10 w-9 h-9 rounded-full border border-brown-900/20 text-brown-700 hover:bg-cream hover:text-brown-900 flex items-center justify-center text-sm transition-all bg-white shadow-sm">
            ✕
          </button>

          <div className="px-10 pt-10 pb-20 flex flex-col gap-1">
            {saveMsg && (
              <div className="sticky top-4 z-20 bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm mb-4">
                ✓ {saveMsg}
              </div>
            )}

            {/* ── PENGATURAN AKUN ────────────────────────────────────── */}
            <Section id="profile-info" title="Info Profil">
              <div className="bg-cream/50 rounded-2xl p-5 flex flex-col gap-4 border border-brown-900/10">
                <Row label="Nama" value={isEditingName ? undefined : <span className="text-sm font-bold text-brown-900">{name}</span>}
                  action={!isEditingName ? <Btn onClick={() => setIsEditingName(true)}>Edit</Btn> : undefined}>
                  {isEditingName && <InlineEdit value={name} onChange={setName} onSave={saveName} onCancel={() => setIsEditingName(false)} />}
                </Row>
                <Row label="Username (@ handle)" value={isEditingUsername ? undefined : <span className="text-sm font-semibold text-brown-900">{username ? `@${username}` : "Belum diatur"}</span>}
                  action={!isEditingUsername ? <Btn onClick={() => setIsEditingUsername(true)}>{username ? "Edit" : "Atur"}</Btn> : undefined}>
                  {isEditingUsername && (
                    <div className="flex flex-col gap-1 w-full max-w-sm mt-1">
                      <div className="flex items-center rounded-xl border border-brown-900/15 bg-white px-3 py-1.5 gap-1 focus-within:border-orange-500">
                        <span className="text-xs text-brown-700/50 select-none">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                          maxLength={30}
                          placeholder="username"
                          className="flex-1 bg-transparent text-xs text-brown-900 outline-none"
                        />
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button onClick={saveUsername} className="text-xs font-bold bg-orange-500 text-white px-3.5 py-1 rounded-full hover:bg-orange-600 transition-colors">Simpan</button>
                        <button onClick={() => setIsEditingUsername(false)} className="text-xs text-brown-700">Batal</button>
                      </div>
                    </div>
                  )}
                </Row>
                <Row label="Bio Komunitas" value={isEditingBio ? undefined : <span className="text-xs text-brown-700 max-w-md line-clamp-2">{bio || "Belum ada bio"}</span>}
                  action={!isEditingBio ? <Btn onClick={() => setIsEditingBio(true)}>{bio ? "Edit" : "Tambah"}</Btn> : undefined}>
                  {isEditingBio && (
                    <div className="flex flex-col gap-1 w-full max-w-md mt-1">
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        maxLength={160}
                        rows={2}
                        placeholder="Ceritakan sedikit tentang dirimu..."
                        className="w-full bg-white text-xs text-brown-900 p-2.5 rounded-xl border border-brown-900/15 outline-none focus:border-orange-500 resize-none"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-brown-700/40">{bio.length}/160</span>
                        <div className="flex gap-2">
                          <button onClick={saveBio} className="text-xs font-bold bg-orange-500 text-white px-3.5 py-1 rounded-full hover:bg-orange-600 transition-colors">Simpan</button>
                          <button onClick={() => setIsEditingBio(false)} className="text-xs text-brown-700">Batal</button>
                        </div>
                      </div>
                    </div>
                  )}
                </Row>
                <Row label="Email" value={
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brown-900">{revealEmail ? email : maskedEmail}</span>
                    <button onClick={() => setRevealEmail(!revealEmail)} className="text-xs text-orange-600 font-bold hover:underline">{revealEmail ? "Sembunyikan" : "Reveal"}</button>
                  </div>
                } />
                <Row label="Nomor Telepon" value={isEditingPhone ? undefined : <span className="text-sm text-brown-700">{phone || "Belum ditambahkan"}</span>}
                  action={!isEditingPhone ? <Btn onClick={() => setIsEditingPhone(true)}>{phone ? "Edit" : "Tambah"}</Btn> : undefined}>
                  {isEditingPhone && <InlineEdit value={phone} onChange={setPhone} onSave={savePhone} onCancel={() => setIsEditingPhone(false)} placeholder="+62 8xx-xxxx-xxxx" />}
                </Row>
              </div>
            </Section>

            <Section id="password-security" title="Password & Keamanan">
              <div className="bg-cream/50 rounded-2xl p-5 flex flex-col gap-4 border border-brown-900/10">
                <Row label="Password" value={isChangingPassword ? undefined : <span className="text-sm tracking-widest text-brown-900">••••••••••</span>}
                  action={!isChangingPassword ? <Btn onClick={() => setIsChangingPassword(true)}>Ganti</Btn> : undefined}>
                  {isChangingPassword && (
                    <div className="flex flex-col gap-2 mt-1.5">
                      <input type="password" placeholder="Password baru" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-white text-xs text-brown-900 px-3 py-1.5 rounded-xl border border-brown-900/15 focus:border-orange-500 outline-none w-56" />
                      <div className="flex gap-2"><button onClick={savePassword} className="text-xs font-bold bg-orange-500 text-white px-4 py-1.5 rounded-full">Simpan</button><button onClick={() => setIsChangingPassword(false)} className="text-xs text-brown-700">Batal</button></div>
                    </div>
                  )}
                </Row>
                <Row label="Multi-Factor Authentication" value={<span className="text-xs text-brown-700">Amankan akun dengan OTP email</span>} action={<button onClick={() => ok("2FA segera hadir!")} className="text-xs font-bold text-green-600 hover:underline">Set up ❯</button>} />
                <Row label="Perangkat Login" value={<span className="text-xs text-brown-700">1 perangkat aktif (Web Desktop)</span>} />
              </div>
            </Section>

            <Section id="devices" title="Perangkat Aktif">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm font-bold text-brown-900">Web Desktop Browser</p><p className="text-xs text-brown-700">Login terakhir: hari ini</p></div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Aktif Sekarang</span>
                </div>
              </div>
            </Section>

            <Section id="connections" title="Koneksi Sosial">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="text-xl">🔵</span><div><p className="text-sm font-bold text-brown-900">Google</p><p className="text-xs text-brown-700">Hubungkan untuk login lebih mudah</p></div></div>
                  <Btn onClick={() => ok("Fitur segera hadir!")}>Hubungkan</Btn>
                </div>
              </div>
            </Section>

            {/* ── PRIVASI & DATA ────────────────────────────────────── */}
            <SectionDivider />
            <Section id="privacy-data" title="Data & Privasi">
              <div className="flex flex-col gap-4">
                <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                  <p className="text-xs text-brown-700 mb-3">Unduh semua data kamu (mood, jurnal, percakapan, post) dalam format JSON.</p>
                  <Btn onClick={exportData}>Ekspor Semua Data (JSON)</Btn>
                </div>
                <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                  <p className="text-sm font-bold text-brown-900 mb-1">Kontrol Data AI</p>
                  <p className="text-xs text-brown-700">Percakapan Zyba Companion tidak dipakai untuk melatih model AI pihak ketiga.</p>
                </div>
              </div>
            </Section>

            <Section id="delete-account" title="Hapus Akun">
              <div className="bg-danger/5 rounded-2xl p-5 border-2 border-danger/20">
                <p className="text-xs text-brown-700 mb-4">Hapus akun secara permanen dari seluruh server ZYBA. Aksi ini tidak bisa dibatalkan.</p>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className="bg-white border border-danger/30 text-danger text-xs font-bold px-5 py-2 rounded-full hover:bg-danger/5">Hapus Akun Saya</button>
                ) : (
                  <div className="bg-white rounded-2xl p-4 border border-danger/20 flex flex-col gap-3">
                    <p className="text-sm font-bold text-brown-900">Yakin ingin menghapus akun?</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 rounded-full border border-brown-900/15 text-xs font-bold text-brown-700 hover:bg-cream">Batal</button>
                      <button onClick={deleteAccount} disabled={isDeleting} className="flex-1 py-2 rounded-full bg-danger text-white text-xs font-bold hover:opacity-90 disabled:opacity-50">{isDeleting ? "Menghapus..." : "Ya, Hapus"}</button>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* ── COMPANION & WELLNESS ─────────────────────────────── */}
            <SectionDivider />
            <Section id="persona" title="Karakter Zyba">
              <div className="flex flex-col gap-3">
                <p className="text-xs text-brown-700">Karakter ini mengubah gaya bicara dan kepribadian Zyba saat menemanimu.</p>
                <PersonaPicker selected={persona} onChange={setPersona} />
                <Btn onClick={() => ok("Karakter disimpan!")}>Simpan</Btn>
              </div>
            </Section>

            <Section id="gaya-bahasa" title="Gaya Bahasa AI">
              <div className="flex flex-col gap-2">
                {(["CASUAL", "FORMAL", "FUN"] as const).map(s => (
                  <button key={s} onClick={() => setCommStyle(s)} className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold border transition-colors ${commStyle === s ? "bg-brown-900 text-white border-brown-900" : "bg-cream text-brown-900 border-brown-900/10 hover:border-orange-500"}`}>
                    <span>{s === "CASUAL" ? "😊 Santai" : s === "FORMAL" ? "🎩 Formal" : "🎉 Fun"}</span>
                    {commStyle === s && <span>✓</span>}
                  </button>
                ))}
                <Btn onClick={() => ok("Gaya bahasa disimpan!")}>Simpan</Btn>
              </div>
            </Section>

            <Section id="riwayat-companion" title="Riwayat Percakapan">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <p className="text-xs text-brown-700 mb-3">Percakapan tersimpan ada di sidebar Companion. Hapus riwayat yang tidak diperlukan.</p>
                <Btn onClick={() => ok("Fitur kelola riwayat segera hadir!")}>Kelola Riwayat ❯</Btn>
              </div>
            </Section>

            {/* ── NOTIFIKASI ───────────────────────────────────────── */}
            <SectionDivider />
            <Section id="notif-push" title="Push & In-App">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10 flex flex-col gap-4">
                {[
                  { label: "Notifikasi Chat Companion", val: notifChatbot, set: setNotifChatbot, desc: "Pengingat sesi companion & respons baru" },
                  { label: "Pengingat Wellness Harian", val: notifWellness, set: setNotifWellness, desc: "Mood check-in, aktivitas, tidur" },
                  { label: "Aktivitas Komunitas", val: notifCommunity, set: setNotifCommunity, desc: "Like, komentar, postingan baru" },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between gap-3 pb-3 border-b border-brown-900/10 last:border-0 last:pb-0">
                    <div><p className="text-sm font-bold text-brown-900">{n.label}</p><p className="text-xs text-brown-700">{n.desc}</p></div>
                    <input type="checkbox" checked={n.val} onChange={e => n.set(e.target.checked)} className="accent-green-500 w-4 h-4 shrink-0" />
                  </div>
                ))}
              </div>
              <Btn onClick={saveNotif}>Simpan</Btn>
            </Section>

            <Section id="notif-email" title="Notifikasi Email">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-bold text-brown-900">Newsletter & Tips Wellness</p><p className="text-xs text-brown-700">Tips mingguan untuk kesehatan mental & fisik</p></div>
                  <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)} className="accent-green-500 w-4 h-4" />
                </div>
              </div>
              <Btn onClick={() => ok("Preferensi email disimpan!")}>Simpan</Btn>
            </Section>

            {/* ── KOMUNITAS ────────────────────────────────────────── */}
            <SectionDivider />
            <Section id="community-visibility" title="Visibilitas Postingan">
              <div className="flex flex-col gap-2">
                {(["public", "anonymous"] as const).map(v => (
                  <button key={v} onClick={() => setPostVisibility(v)} className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold border transition-colors ${postVisibility === v ? "bg-brown-900 text-white border-brown-900" : "bg-white text-brown-900 border-brown-900/10 hover:border-orange-500"}`}>
                    <span>{v === "public" ? "🌍 Publik ke komunitas" : "🎭 Anonim"}</span>
                    {postVisibility === v && <span>✓</span>}
                  </button>
                ))}
                <Btn onClick={() => ok("Visibilitas disimpan!")}>Simpan</Btn>
              </div>
            </Section>

            <Section id="community-activity" title="Aktivitas & Interaksi">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <p className="text-xs text-brown-700 mb-3">Kelola siapa yang bisa melihat aktivitasmu, memberi komentar, atau menyebut namamu.</p>
                <Btn onClick={() => ok("Fitur izin komunitas segera hadir!")}>Atur Izin ❯</Btn>
              </div>
            </Section>

            {/* ── BILLING ──────────────────────────────────────────── */}
            <SectionDivider />
            <Section id="zyba-plus" title="Zyba Plus">
              <ZybaPlusTab onSuccess={ok} />
            </Section>

            <Section id="billing-history" title="Riwayat Pembayaran">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <p className="text-xs text-brown-700">Belum ada riwayat pembayaran. Aktifkan Zyba Plus untuk melihat tagihan di sini.</p>
              </div>
            </Section>

            {/* ── PREFERENSI APLIKASI ───────────────────────────────── */}
            <SectionDivider />
            <Section id="appearance" title="Tampilan & Tema">
              <div className="flex flex-col gap-2">
                {["small", "normal", "large"].map(s => (
                  <button key={s} onClick={() => setFontSize(s)} className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold border transition-colors ${fontSize === s ? "bg-brown-900 text-white border-brown-900" : "bg-white text-brown-900 border-brown-900/10 hover:border-orange-500"}`}>
                    <span>{s === "small" ? "Teks Kecil" : s === "normal" ? "Teks Normal" : "Teks Besar"}</span>
                    {fontSize === s && <span>✓</span>}
                  </button>
                ))}
                <Btn onClick={() => ok("Tampilan diperbarui!")}>Simpan</Btn>
              </div>
            </Section>

            <Section id="language" title="Bahasa & Wilayah">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown-900">Bahasa Antarmuka</span>
                  <span className="text-xs font-bold text-brown-700 bg-cream px-3 py-1 rounded-full border border-brown-900/10">🇮🇩 Indonesia</span>
                </div>
              </div>
            </Section>

            <Section id="accessibility" title="Aksesibilitas">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <p className="text-xs text-brown-700">ZYBA dibangun mengikuti standar WCAG 2.1 AA. Laporkan masalah aksesibilitas ke hello@zyba.app.</p>
              </div>
            </Section>

            {/* ── INFO & BANTUAN ────────────────────────────────────── */}
            <SectionDivider />
            <Section id="crisis-resources" title="Hotline Krisis">
              <div className="bg-green-100 rounded-2xl p-5 border border-green-200">
                <p className="text-xs text-green-700 mb-4">Layanan 24/7, gratis, dan rahasia.</p>
                {CRISIS.map(c => (
                  <div key={c.name} className="flex items-center justify-between py-2.5 border-b border-green-200 last:border-0">
                    <p className="text-sm font-bold text-brown-900">{c.name}</p>
                    <a href={`tel:${c.phone.replace(/\D/g,"")}`} className="text-xs font-extrabold text-orange-600 hover:underline">{c.phone}</a>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="about" title="Tentang ZYBA">
              <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
                <div className="flex flex-col gap-2 text-xs text-brown-900">
                  <div className="flex justify-between py-1.5 border-b border-brown-900/10"><span className="text-brown-700">Versi</span><span className="font-bold">1.0.0</span></div>
                  <div className="flex justify-between py-1.5 border-b border-brown-900/10"><span className="text-brown-700">Platform</span><span className="font-bold">Next.js 14 + Neon Postgres</span></div>
                  <div className="flex justify-between py-1.5"><span className="text-brown-700">Kontak Tim</span><a href="mailto:hello@zyba.app" className="font-bold text-orange-600 hover:underline">hello@zyba.app</a></div>
                </div>
              </div>
            </Section>

          </div>
        </main>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

// ── Layout helpers ────────────────────────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-3 scroll-mt-6 pt-6">
      <h2 className="font-display font-extrabold text-lg text-brown-900">{title}</h2>
      {children}
    </section>
  );
}

function SectionDivider() {
  return <div className="border-t border-brown-900/10 mt-4" />;
}

function Row({ label, value, action, children }: { label: string; value?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-brown-900/10 last:border-0 last:pb-0">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-brown-700/70">{label}</span>
        {value && <div className="mt-0.5">{value}</div>}
        {children}
      </div>
      {action && <div className="shrink-0 mt-0.5">{action}</div>}
    </div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="self-start bg-white border border-brown-900/15 hover:bg-cream text-brown-900 text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-sm">
      {children}
    </button>
  );
}

function InlineEdit({ value, onChange, onSave, onCancel, placeholder }: { value: string; onChange: (v: string) => void; onSave: () => void; onCancel: () => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="bg-white text-xs text-brown-900 px-3 py-1.5 rounded-xl border border-brown-900/15 focus:border-orange-500 outline-none" />
      <button type="button" onClick={onSave} className="text-xs font-bold bg-orange-500 text-white px-3.5 py-1.5 rounded-full hover:bg-orange-600">Simpan</button>
      <button type="button" onClick={onCancel} className="text-xs font-semibold text-brown-700 hover:text-brown-900 px-2">Batal</button>
    </div>
  );
}


// ── ZybaPlusTab ───────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "monthly",
    label: "Bulanan",
    price: "Rp 49.000",
    period: "/ bulan",
    badge: null,
    desc: "Fleksibel, batalkan kapan saja",
    highlight: false,
  },
  {
    id: "yearly",
    label: "Tahunan",
    price: "Rp 399.000",
    period: "/ tahun",
    badge: "HEMAT 32%",
    desc: "Setara Rp 33.250 / bulan",
    highlight: true,
  },
  {
    id: "lifetime",
    label: "Seumur Hidup",
    price: "Rp 999.000",
    period: "sekali bayar",
    badge: "BEST VALUE",
    desc: "Akses permanen, tidak perlu perpanjang",
    highlight: false,
  },
];

const PLUS_FEATURES = [
  "Semua model AI premium (Gemini Pro, GPT-4o, Claude)",
  "Chat tanpa batas per hari",
  "Analitik wellness mendalam",
  "Ekspor laporan PDF bulanan",
  "Prioritas respons AI",
  "Akses fitur beta lebih awal",
];

function ZybaPlusTab({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [selected, setSelected] = useState<string>("yearly");

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-6 border border-orange-200 flex flex-col items-center text-center gap-2">
        <span className="text-4xl">⚡</span>
        <h3 className="font-display font-extrabold text-lg text-brown-900">Zyba Plus</h3>
        <p className="text-xs text-brown-700 max-w-xs">
          Akses penuh ke semua AI model, percakapan tanpa batas, dan analitik wellness mendalam.
        </p>
        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
          🎁 1 BULAN FREE untuk pengguna baru
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map(plan => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.id)}
            className={`relative flex flex-col gap-1.5 p-4 rounded-2xl border-2 text-left transition-all ${
              selected === plan.id
                ? "border-orange-500 bg-orange-50 shadow-md"
                : "border-brown-900/10 bg-white hover:border-orange-300"
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                plan.highlight ? "bg-orange-500 text-white" : "bg-green-500 text-white"
              }`}>
                {plan.badge}
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brown-900">{plan.label}</span>
              {selected === plan.id && <span className="text-orange-500 font-bold text-sm">✓</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-xl text-brown-900">{plan.price}</span>
              <span className="text-[10px] text-brown-700">{plan.period}</span>
            </div>
            <span className="text-[10px] text-brown-700">{plan.desc}</span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onSuccess(`Berhasil memilih paket ${PLANS.find(p => p.id === selected)?.label}! Fitur pembayaran segera hadir.`)}
        className="w-full py-3 rounded-full bg-orange-500 text-white text-sm font-extrabold hover:bg-orange-600 transition-colors shadow-md"
      >
        Mulai dengan paket {PLANS.find(p => p.id === selected)?.label} →
      </button>

      {/* Features */}
      <div className="bg-cream/50 rounded-2xl p-5 border border-brown-900/10">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-brown-700 mb-3">Semua yang kamu dapat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {PLUS_FEATURES.map(f => (
            <div key={f} className="flex items-start gap-2 py-1 text-xs text-brown-900">
              <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-brown-700/60 text-center">
        Pembayaran aman. Batalkan kapan saja (paket bulanan/tahunan). Tidak ada biaya tersembunyi.
      </p>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────
