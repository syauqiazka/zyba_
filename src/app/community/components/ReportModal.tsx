"use client";

import React, { useState } from "react";
import { AlertCircle, X, ShieldAlert, Loader2, Check } from "lucide-react";

interface ReportModalProps {
  open: boolean;
  postId: string;
  authorName: string;
  targetType?: "POST" | "COMMENT";
  commentId?: string;
  onClose: () => void;
  onReportSuccess: (isCrisis: boolean, hideChoice: boolean) => void;
}

const REPORT_REASONS = [
  {
    id: "self_harm",
    title: "Bahaya diri atau krisis darurat",
    desc: "Ungkapan keputusasaan berat, keinginan melukai diri, atau situasi bahaya.",
    isCrisis: true,
  },
  {
    id: "harassment",
    title: "Pelecehan atau perundungan",
    desc: "Menargetkan individu dengan hinaan, intimidasi, atau kekerasan verbal.",
  },
  {
    id: "hate_speech",
    title: "Ujaran kebencian & diskriminasi",
    desc: "Menyerang berdasarkan SARA, orientasi, gender, atau disabilitas.",
  },
  {
    id: "inappropriate",
    title: "Konten tidak pantas / asusila",
    desc: "Materi seksual eksplisit, kekerasan grafis, atau vulgar.",
  },
  {
    id: "spam",
    title: "Spam, penipuan, atau promosi ilegal",
    desc: "Iklan berulang, link mencurigakan, atau skema penipuan.",
  },
  {
    id: "other",
    title: "Pelanggaran pedoman lainnya",
    desc: "Melanggar aturan komunitas ZYBA yang tidak tercantum di atas.",
  },
];

export default function ReportModal({
  open,
  postId,
  authorName,
  targetType = "POST",
  commentId,
  onClose,
  onReportSuccess,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("harassment");
  const [details, setDetails] = useState<string>("");
  const [hidePost, setHidePost] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const isComment = targetType === "COMMENT";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const endpoint = isComment && commentId
        ? `/api/community/comments/${commentId}/report`
        : `/api/community/posts/${postId}/report`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: selectedReason,
          details: details.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok && res.status !== 200) {
        throw new Error(data?.error || "Gagal mengirim laporan");
      }

      const isCrisis = selectedReason === "self_harm" || Boolean(data?.isCrisis);
      onReportSuccess(isCrisis, hidePost);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-brown-900/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-brown-900/8 flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brown-900">
                Laporkan Postingan
              </h3>
              <p className="text-xs text-brown-700/70">
                Postingan oleh <span className="font-semibold text-brown-900">@{authorName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-brown-700 hover:text-brown-900 hover:bg-brown-900/5 flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-brown-700 leading-relaxed">
            Pilih alasan yang paling sesuai. Laporan Anda bersifat anonim dan membantu menjaga ZYBA sebagai ruang aman.
          </p>

          {/* Reason options */}
          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => {
              const active = selectedReason === reason.id;
              return (
                <button
                  type="button"
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    active
                      ? "border-orange-500 bg-orange-50/50 shadow-xs"
                      : "border-brown-900/10 hover:border-brown-900/20 hover:bg-cream/40"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-xs text-brown-900">
                        {reason.title}
                      </span>
                      {reason.isCrisis && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-red-100 text-red-700">
                          Darurat
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-brown-700/70 leading-relaxed">
                      {reason.desc}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      active
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-brown-900/30 bg-white"
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-brown-900 mb-1.5">
              Keterangan Tambahan (opsional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Berikan detail atau konteks lebih lanjut jika ada..."
              rows={3}
              maxLength={400}
              className="w-full text-xs p-3 rounded-2xl border border-brown-900/15 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none bg-cream/20 text-brown-900 placeholder:text-brown-700/40"
            />
          </div>

          {/* Hide post checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hidePost}
              onChange={(e) => setHidePost(e.target.checked)}
              className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
            />
            <span className="text-xs text-brown-700">
              Sembunyikan postingan ini segera dari feed saya
            </span>
          </label>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-brown-900/8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-pill text-xs font-semibold text-brown-700 hover:bg-cream transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-pill text-xs font-semibold bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>Kirim Laporan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
