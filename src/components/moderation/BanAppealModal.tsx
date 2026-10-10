"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Send,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

interface BanAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  banReason?: string | null;
  isBanned?: boolean;
  isSuspended?: boolean;
}

export default function BanAppealModal({
  isOpen,
  onClose,
  banReason = "Pelanggaran pedoman komunitas ZYBA",
  isBanned = true,
  isSuspended = false,
}: BanAppealModalProps) {
  const [appealReason, setAppealReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingAppeal, setExistingAppeal] = useState<any>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadCurrentAppeal = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/moderation/appeal", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.appeal) {
        setExistingAppeal(data.appeal);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCurrentAppeal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim() || appealReason.trim().length < 10) {
      setError("Mohon jelaskan alasan banding secara jelas (minimal 10 karakter).");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/moderation/appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appealReason: appealReason.trim(),
          contactEmail: contactEmail.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal mengirim permohonan banding.");

      setSuccessMsg(data.message || "Permohonan banding berhasil dikirim.");
      setExistingAppeal(data.appeal);
      setAppealReason("");
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat mengirim banding.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-brown-900 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col border border-brown-900/10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-900/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-sm text-brown-900">
                Penyangkalan & Banding Pemblokiran
              </h2>
              <p className="text-[11px] text-brown-700/60 mt-0.5">
                {isBanned ? "Akun diblokir permanen" : isSuspended ? "Akun ditangguhkan" : "Pembatasan akun"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-brown-700/50 hover:text-brown-900 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">
          {/* Alasan Pemblokiran */}
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-3.5">
            <p className="font-bold text-red-900 text-[11px] uppercase tracking-wider">
              Alasan Pemblokiran Akun
            </p>
            <p className="mt-1 text-xs text-red-800 font-medium leading-relaxed">
              &quot;{banReason || "Pelanggaran pedoman komunitas ZYBA"}&quot;
            </p>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <RefreshCw className="animate-spin mx-auto text-orange-500 mb-2" size={20} />
              <p className="text-[11px] text-brown-700/60">Memeriksa status banding...</p>
            </div>
          ) : existingAppeal && existingAppeal.status === "PENDING" ? (
            /* State: Sedang Menunggu Review */
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Clock size={16} className="text-amber-600" />
                <span>Pengajuan Banding Sedang Ditinjau</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Permohonan banding Anda telah diterima dan saat ini sedang ditinjau oleh tim moderator ZYBA. Kami akan meninjau riwayat dan argumen Anda secara adil.
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-800">
                <p className="font-semibold">Argumen yang Anda kirimkan:</p>
                <p className="italic mt-0.5">&quot;{existingAppeal.appealReason}&quot;</p>
              </div>
            </div>
          ) : existingAppeal && existingAppeal.status === "APPROVED" ? (
            /* State: Disetujui */
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-800 font-bold">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Permohonan Banding Diterima!</span>
              </div>
              <p className="text-xs text-green-900 leading-relaxed">
                {existingAppeal.adminNote || "Pemblokiran akun Anda telah dicabut. Anda dapat kembali menggunakan seluruh fitur ZYBA."}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 w-full py-2.5 rounded-xl bg-green-700 text-white font-bold text-xs hover:bg-green-800 transition-colors"
              >
                Muat Ulang Halaman
              </button>
            </div>
          ) : (
            /* State: Form Pengajuan Baru */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {existingAppeal && existingAppeal.status === "REJECTED" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <XCircle size={14} className="text-red-600" />
                    <span>Permohonan Sebelumnya Ditolak</span>
                  </div>
                  {existingAppeal.adminNote && (
                    <p className="text-xs">Catatan Admin: {existingAppeal.adminNote}</p>
                  )}
                  <p className="text-[10px] text-red-700/70 pt-1">
                    Anda dapat mengajukan permohonan baru dengan menyertakan penjelasan yang lebih lengkap.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-brown-900 mb-1">
                  Argumen & Alasan Penyangkalan (Wajib)
                </label>
                <p className="text-[10px] text-brown-700/60 mb-1.5 leading-relaxed">
                  Jelaskan mengapa Anda merasa pemblokiran ini adalah kekeliruan, atau komitmen Anda untuk mematuhi pedoman komunitas ZYBA:
                </p>
                <textarea
                  rows={4}
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Contoh: Saya meminta maaf atas postingan tersebut. Saya tidak bermaksud melanggar pedoman dan berkomitmen untuk menjaga ruang aman ZYBA..."
                  className="w-full resize-none rounded-2xl border border-brown-900/15 bg-cream/60 px-3.5 py-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-brown-900 mb-1">
                  Email Kontak Tambahan (Opsional)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email alternatif jika ada..."
                  className="w-full rounded-xl border border-brown-900/15 bg-cream/60 px-3 py-2 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}

              {successMsg && (
                <p className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs font-semibold text-green-700">
                  {successMsg}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !appealReason.trim()}
                  className="w-full py-2.5 rounded-xl bg-brown-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={13} />
                      Kirim Permohonan Banding
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-[10px] text-brown-700/50 flex items-start gap-1.5 leading-relaxed">
            <HelpCircle size={13} className="shrink-0 mt-0.5" />
            <span>
              Tim moderator ZYBA meninjau setiap permohonan banding secara manual untuk memastikan keadilan dan kenyamanan seluruh pengguna komunitas.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
