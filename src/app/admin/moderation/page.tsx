"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ShieldBan,
  ShieldAlert,
  Clock,
  Trash2,
  EyeOff,
  UserX,
  TriangleAlert,
  X,
  CreditCard,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type ReportStatus = "PENDING" | "ACTION_TAKEN" | "DISMISSED";
type ReportTargetType = "POST" | "COMMENT";

interface Report {
  id: string;
  targetType: ReportTargetType;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  createdAt: string;
  reporterId?: string | null;
  reporterName?: string;
  targetId: string;
  targetUserId?: string | null;
  targetUserName?: string;
  targetWarningCount?: number;
  contentPreview?: string | null;
  parentContentPreview?: string | null;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const REASON_LABELS: Record<string, string> = {
  self_harm: "Bahaya Diri / Krisis",
  harassment: "Pelecehan / Perundungan",
  hate_speech: "Ujaran Kebencian",
  inappropriate: "Konten Tidak Pantas",
  spam: "Spam / Penipuan",
  other: "Pelanggaran Lainnya",
  ALL: "Semua Alasan",
};

const STATUS_LABELS: Record<string, string> = {
  ALL: "Semua Status",
  PENDING: "Menunggu",
  ACTION_TAKEN: "Ditindaklanjuti",
  DISMISSED: "Ditolak",
};

const TARGET_LABELS: Record<string, string> = {
  ALL: "Semua Konten",
  POST: "Postingan",
  COMMENT: "Komentar",
};

// ─── Action Modal ───────────────────────────────────────────────────────────
interface ActionModalProps {
  report: Report;
  onClose: () => void;
  onSuccess: () => void;
}

function ActionModal({ report, onClose, onSuccess }: ActionModalProps) {
  const [action, setAction] = useState<string>("");
  const [reason, setReason] = useState(
    REASON_LABELS[report.reason] || "Pelanggaran pedoman komunitas"
  );
  const [durationDays, setDurationDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ACTIONS = [
    { value: "WARN", label: "Peringatkan Pengguna", icon: <TriangleAlert size={15} />, color: "text-amber-600 bg-amber-50 border-amber-200" },
    {
      value: report.targetType === "POST" ? "HIDE_POST" : "HIDE_COMMENT",
      label: `Sembunyikan ${report.targetType === "POST" ? "Postingan" : "Komentar"}`,
      icon: <EyeOff size={15} />,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      value: report.targetType === "POST" ? "DELETE_POST" : "DELETE_COMMENT",
      label: `Hapus ${report.targetType === "POST" ? "Postingan" : "Komentar"}`,
      icon: <Trash2 size={15} />,
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    { value: "SUSPEND", label: "Tangguhkan Sementara", icon: <Clock size={15} />, color: "text-red-600 bg-red-50 border-red-200" },
    { value: "BAN", label: "Blokir Permanen", icon: <ShieldBan size={15} />, color: "text-red-800 bg-red-100 border-red-300" },
    { value: "LIFT_RESTRICTION", label: "Cabut Pembatasan", icon: <CheckCircle2 size={15} />, color: "text-green-700 bg-green-50 border-green-200" },
    { value: "DISMISS_REPORT", label: "Tolak Laporan", icon: <X size={15} />, color: "text-brown-700 bg-cream border-brown-900/15" },
  ];

  const handleSubmit = async () => {
    if (!action) {
      setError("Pilih tindakan terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const body: Record<string, any> = {
        reportId: report.id,
        targetUserId: report.targetUserId,
        action,
        reason,
        resolutionNote: reason,
        targetType: report.targetType,
        targetId: report.targetId,
      };
      if (action === "SUSPEND") body.durationDays = durationDays;

      const res = await fetch("/api/admin/moderation/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menjalankan tindakan.");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menjalankan tindakan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-900/10 shrink-0">
          <div>
            <h2 className="font-display font-bold text-sm text-brown-900 flex items-center gap-2">
              <Shield size={16} className="text-orange-500" />
              Tindakan Moderasi
            </h2>
            <p className="text-[11px] text-brown-700/60 mt-0.5">
              {report.targetType === "POST" ? "Postingan" : "Komentar"} ·{" "}
              <span className="font-semibold">{report.targetUserName || "Pengguna"}</span>
              {report.targetWarningCount !== undefined && report.targetWarningCount > 0 && (
                <span className="ml-1.5 text-amber-600">({report.targetWarningCount} peringatan)</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-brown-700/50 hover:text-brown-900 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Content preview */}
          {report.contentPreview && (
            <div className="rounded-xl bg-cream p-3">
              {report.parentContentPreview && (
                <div className="text-[10px] text-brown-700/50 mb-1.5 border-l-2 border-orange-200 pl-2 italic">
                  ↩ "{report.parentContentPreview}"
                </div>
              )}
              <p className="text-xs text-brown-900 leading-relaxed">"{report.contentPreview}"</p>
            </div>
          )}

          {/* Reason info */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-amber-800">{REASON_LABELS[report.reason] || report.reason}</p>
              {report.details && <p className="text-[11px] text-amber-700/80 mt-0.5">{report.details}</p>}
            </div>
          </div>

          {/* Action selection */}
          <div>
            <p className="text-[11px] font-bold text-brown-900 mb-2">Pilih Tindakan</p>
            <div className="flex flex-col gap-1.5">
              {ACTIONS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAction(a.value)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                    action === a.value
                      ? a.color + " ring-2 ring-current ring-offset-1"
                      : "border-brown-900/10 text-brown-700 hover:bg-cream"
                  }`}
                >
                  <span className={action === a.value ? "" : "opacity-50"}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suspend duration */}
          {action === "SUSPEND" && (
            <div>
              <label className="text-[11px] font-bold text-brown-900 block mb-1.5">
                Durasi Penangguhan (hari)
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={durationDays}
                onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-brown-900/15 bg-cream px-3 py-2 text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          )}

          {/* Reason text */}
          <div>
            <label className="text-[11px] font-bold text-brown-900 block mb-1.5">
              Catatan Moderasi (wajib)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-brown-900/15 bg-cream px-3 py-2 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              placeholder="Alasan atau catatan untuk tindakan ini..."
              maxLength={500}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-brown-900/8 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-brown-900/15 text-sm font-semibold text-brown-700 hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!action || !reason.trim() || submitting}
            className="flex-1 py-2.5 rounded-xl bg-brown-900 text-white text-sm font-semibold hover:bg-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            ) : (
              <>
                <Shield size={14} />
                Jalankan Tindakan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReportStatus }) {
  const cfg = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    ACTION_TAKEN: "bg-green-100 text-green-700 border-green-200",
    DISMISSED: "bg-brown-900/8 text-brown-700/70 border-brown-900/15",
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg}`}>
      {status === "PENDING" && <Clock size={9} />}
      {status === "ACTION_TAKEN" && <CheckCircle2 size={9} />}
      {status === "DISMISSED" && <X size={9} />}
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Target Badge ───────────────────────────────────────────────────────────
function TargetBadge({ type }: { type: ReportTargetType }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      type === "POST"
        ? "bg-orange-100 text-orange-600 border-orange-200"
        : "bg-blue-100 text-blue-600 border-blue-200"
    }`}>
      {TARGET_LABELS[type]}
    </span>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  // Filters
  const [status, setStatus] = useState("PENDING");
  const [targetType, setTargetType] = useState("ALL");
  const [reason, setReason] = useState("ALL");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        status,
        targetType,
        reason,
        search,
      });
      const res = await fetch(`/api/admin/reports?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403) throw new Error("Akses ditolak. Anda tidak memiliki hak admin.");
      if (!res.ok) throw new Error(data.error || "Gagal mengambil laporan.");
      setReports(data.reports || []);
      setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil laporan.");
    } finally {
      setLoading(false);
    }
  }, [page, status, targetType, reason, search]);

  useEffect(() => { load(); }, [load]);

  const applySearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* ── Header ── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-orange-500" />
              <h1 className="font-display text-2xl font-extrabold text-brown-900">Moderasi Komunitas</h1>
            </div>
            <p className="text-sm text-brown-700/70">Kelola laporan, tinjau konten, dan terapkan tindakan moderasi.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-brown-900 bg-white border border-brown-900/15 rounded-xl px-3 py-2 transition-colors"
            >
              <CreditCard size={13} />
              Keuangan
            </Link>
            <button
              type="button"
              onClick={() => { setPage(1); load(); }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-brown-900/15 rounded-xl px-3 py-2 text-brown-700 hover:text-brown-900 transition-colors"
            >
              <RefreshCw size={13} />
              Perbarui
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-brown-900/15 px-3 py-1.5 flex-1 min-w-[200px]">
            <Search size={13} className="text-brown-700/50 shrink-0" />
            <input
              type="text"
              placeholder="Cari pelapor, konten, atau pengguna..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
              className="flex-1 text-xs text-brown-900 placeholder:text-brown-700/40 bg-transparent focus:outline-none"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}>
                <X size={12} className="text-brown-700/50 hover:text-brown-900" />
              </button>
            )}
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 focus:outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          {/* Target type */}
          <select
            value={targetType}
            onChange={(e) => { setTargetType(e.target.value); setPage(1); }}
            className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 focus:outline-none"
          >
            {Object.entries(TARGET_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          {/* Reason */}
          <select
            value={reason}
            onChange={(e) => { setReason(e.target.value); setPage(1); }}
            className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 focus:outline-none"
          >
            {Object.entries(REASON_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          {search && (
            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-pill px-2.5 py-1">
              Pencarian: "{search}"
            </span>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white border border-brown-900/10 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <ShieldAlert size={32} className="text-red-400 mx-auto mb-3" />
            <p className="font-display font-bold text-sm text-red-700">{error}</p>
            <button onClick={load} className="mt-3 text-xs font-semibold text-orange-500 hover:underline">Coba lagi</button>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-brown-900/10 bg-white p-10 text-center">
            <CheckCircle2 size={36} className="text-green-400 mx-auto mb-3" />
            <h2 className="font-display font-bold text-base text-brown-900">Tidak ada laporan ditemukan</h2>
            <p className="text-sm text-brown-700/60 mt-1">
              {status === "PENDING" ? "Semua laporan telah ditangani!" : "Ubah filter untuk melihat laporan lain."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-brown-900/10 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-wrap items-start gap-3 justify-between">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <StatusBadge status={report.status} />
                      <TargetBadge type={report.targetType} />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream border border-brown-900/10 text-brown-700">
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                      {report.reason === "self_harm" && (
                        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full animate-pulse">
                          ⚠ KRISIS
                        </span>
                      )}
                    </div>

                    {/* Content preview */}
                    {report.contentPreview && (
                      <p className="text-xs text-brown-900 italic truncate max-w-md mb-1">
                        "{report.contentPreview}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-brown-700/60">
                      {report.targetUserName && (
                        <span className="font-semibold text-brown-900">@{report.targetUserName}</span>
                      )}
                      {report.targetWarningCount !== undefined && report.targetWarningCount > 0 && (
                        <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                          <AlertTriangle size={10} />{report.targetWarningCount} peringatan
                        </span>
                      )}
                      {report.reporterName && <span>Dilaporkan oleh {report.reporterName}</span>}
                      <span>· {fmt(report.createdAt)}</span>
                    </div>

                    {report.details && (
                      <p className="text-[11px] text-brown-700/70 mt-1 leading-relaxed line-clamp-2">{report.details}</p>
                    )}

                    {report.resolutionNote && (
                      <p className="text-[11px] text-green-700 mt-1 font-medium">✓ {report.resolutionNote}</p>
                    )}
                  </div>

                  {/* Action button */}
                  {report.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => setActiveReport(report)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-brown-900 text-white rounded-xl px-3 py-2 hover:bg-orange-500 transition-colors shrink-0"
                    >
                      <Shield size={13} />
                      Tindak
                    </button>
                  )}
                  {report.status !== "PENDING" && (
                    <button
                      type="button"
                      onClick={() => setActiveReport(report)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-cream text-brown-700 border border-brown-900/15 rounded-xl px-3 py-2 hover:bg-white transition-colors shrink-0"
                    >
                      <Eye size={13} />
                      Detail
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-2">
            <p className="text-xs text-brown-700/60">
              {pagination.total} laporan · Halaman {pagination.page}/{pagination.totalPages}
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-xl border border-brown-900/15 bg-white flex items-center justify-center text-brown-700 hover:bg-cream transition-colors disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(pagination.totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-xl border text-xs font-bold transition-colors ${
                      page === p
                        ? "bg-brown-900 text-white border-brown-900"
                        : "bg-white text-brown-700 border-brown-900/15 hover:bg-cream"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="w-8 h-8 rounded-xl border border-brown-900/15 bg-white flex items-center justify-center text-brown-700 hover:bg-cream transition-colors disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Action Modal ── */}
      {activeReport && (
        <ActionModal
          report={activeReport}
          onClose={() => setActiveReport(null)}
          onSuccess={() => {
            setActiveReport(null);
            load();
          }}
        />
      )}
    </main>
  );
}
