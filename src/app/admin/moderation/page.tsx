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
  History,
  FileText,
  UserCheck,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type ReportStatus = "PENDING" | "ACTION_TAKEN" | "DISMISSED";
type ReportTargetType = "POST" | "COMMENT";

interface ContentPreview {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  timeAgo: string;
  isHidden: boolean;
  postContext?: { id: string; content: string; authorName: string } | null;
  parentCommentContext?: { id: string; content: string } | null;
}

interface ReportedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  warningCount: number;
  isBanned: boolean;
  isSuspended: boolean;
  suspendedUntil?: string | null;
}

interface Reporter {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

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
  contentPreview?: ContentPreview | string | null;
  parentContentPreview?: string | null;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
  reportedUser?: ReportedUser | null;
  reporter?: Reporter | null;
}

interface ModerationLogItem {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail?: string;
  targetUserId: string;
  targetUserName: string;
  targetUserEmail?: string;
  targetUserAvatar?: string;
  targetUserStatus: {
    isBanned: boolean;
    isSuspended: boolean;
    suspendedUntil?: string | null;
  };
  action: string;
  reason: string;
  durationDays?: number | null;
  reportId?: string | null;
  metadata?: any;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Labels ─────────────────────────────────────────────────────────────────
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

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  ALL: { label: "Semua Tindakan", color: "" },
  WARN: { label: "Peringatan", color: "bg-amber-100 text-amber-800 border-amber-200" },
  HIDE_POST: { label: "Sembunyikan Postingan", color: "bg-blue-100 text-blue-800 border-blue-200" },
  HIDE_COMMENT: { label: "Sembunyikan Komentar", color: "bg-blue-100 text-blue-800 border-blue-200" },
  DELETE_POST: { label: "Hapus Postingan", color: "bg-orange-100 text-orange-800 border-orange-200" },
  DELETE_COMMENT: { label: "Hapus Komentar", color: "bg-orange-100 text-orange-800 border-orange-200" },
  SUSPEND: { label: "Tangguhkan Sementara", color: "bg-red-100 text-red-800 border-red-200" },
  BAN: { label: "Blokir Permanen", color: "bg-red-800 text-white border-red-900" },
  LIFT_RESTRICTION: { label: "Cabut Pembatasan", color: "bg-green-100 text-green-800 border-green-200" },
  DISMISS_REPORT: { label: "Tolak Laporan", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function getContentText(cp: ContentPreview | string | null | undefined): string | null {
  if (!cp) return null;
  if (typeof cp === "string") return cp;
  return cp.content || null;
}
function getParentText(cp: ContentPreview | string | null | undefined): string | null {
  if (!cp || typeof cp === "string") return null;
  return cp.parentCommentContext?.content || cp.postContext?.content || null;
}
function resolveTargetUserName(r: Report): string {
  return r.reportedUser?.name || r.targetUserName || "Pengguna";
}
function resolveWarningCount(r: Report): number {
  return r.reportedUser?.warningCount ?? r.targetWarningCount ?? 0;
}
function resolveTargetUserId(r: Report): string | null | undefined {
  return r.reportedUser?.id ?? r.targetUserId;
}
function resolveReporterName(r: Report): string | undefined {
  return r.reporter?.name ?? r.reporterName;
}

function fmtWib(isoStr?: string | null): string {
  if (!isoStr) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoStr));
}

function getWibTodayString(): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);
  return wib.toISOString().slice(0, 10);
}

function getWibMinusDays(days: number): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000 - days * 86400000);
  return wib.toISOString().slice(0, 10);
}

function getWibMonthStartString(): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);
  const year = wib.getFullYear();
  const month = String(wib.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

type PresetKey = "ALL" | "TODAY" | "7DAYS" | "30DAYS" | "THIS_MONTH" | "CUSTOM";

// ─── Action Modal ───────────────────────────────────────────────────────────
interface ActionModalProps {
  report: Report;
  onClose: () => void;
  onSuccess: () => void;
}

function ActionModal({ report, onClose, onSuccess }: ActionModalProps) {
  const [action, setAction] = useState<string>("");
  const [reason, setReason] = useState(REASON_LABELS[report.reason] || "Pelanggaran pedoman komunitas");
  const [durationDays, setDurationDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const targetUserNameDisplay = resolveTargetUserName(report);
  const warningCountDisplay = resolveWarningCount(report);
  const contentText = getContentText(report.contentPreview);
  const parentText = getParentText(report.contentPreview) || report.parentContentPreview || null;

  const ACTIONS = [
    {
      value: "WARN",
      label: "Peringatkan Pengguna",
      icon: <TriangleAlert size={15} />,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      value: report.targetType === "POST" ? "HIDE_POST" : "HIDE_COMMENT",
      label: `Sembunyikan ${report.targetType === "POST" ? "Postingan" : "Komentar"}`,
      icon: <EyeOff size={15} />,
      color: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      value: report.targetType === "POST" ? "DELETE_POST" : "DELETE_COMMENT",
      label: `Hapus ${report.targetType === "POST" ? "Postingan" : "Komentar"}`,
      icon: <Trash2 size={15} />,
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    {
      value: "SUSPEND",
      label: "Tangguhkan Sementara",
      icon: <Clock size={15} />,
      color: "text-red-700 bg-red-50 border-red-200",
    },
    {
      value: "BAN",
      label: "Blokir Permanen (Nonaktifkan Akun)",
      icon: <ShieldBan size={15} />,
      color: "text-red-900 bg-red-100 border-red-300",
    },
    {
      value: "LIFT_RESTRICTION",
      label: "Cabut Pembatasan (Pulihkan Akun)",
      icon: <CheckCircle2 size={15} />,
      color: "text-green-700 bg-green-50 border-green-200",
    },
    {
      value: "DISMISS_REPORT",
      label: "Tolak Laporan (Tidak Ada Pelanggaran)",
      icon: <X size={15} />,
      color: "text-brown-700 bg-cream border-brown-900/15",
    },
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
        targetUserId: resolveTargetUserId(report),
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
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-900/10 shrink-0">
          <div>
            <h2 className="font-display font-bold text-sm text-brown-900 flex items-center gap-2">
              <Shield size={16} className="text-orange-500" />
              Tindakan Moderasi
            </h2>
            <p className="text-[11px] text-brown-700/60 mt-0.5">
              {report.targetType === "POST" ? "Postingan" : "Komentar"} ·{" "}
              <span className="font-semibold">{targetUserNameDisplay}</span>
              {warningCountDisplay > 0 && (
                <span className="ml-1.5 text-amber-600">({warningCountDisplay} peringatan)</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-brown-700/50 hover:text-brown-900 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {contentText && (
            <div className="rounded-2xl bg-cream p-3.5 border border-brown-900/5">
              {parentText && (
                <div className="text-[10px] text-brown-700/50 mb-1.5 border-l-2 border-orange-300 pl-2 italic">
                  ↩ &quot;{parentText}&quot;
                </div>
              )}
              <p className="text-xs text-brown-900 leading-relaxed">&quot;{contentText}&quot;</p>
            </div>
          )}
          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
            <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-amber-900">
                {REASON_LABELS[report.reason] || report.reason}
              </p>
              {report.details && (
                <p className="text-[11px] text-amber-800/80 mt-0.5">{String(report.details)}</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-brown-900 mb-2">Pilih Tindakan</p>
            <div className="flex flex-col gap-1.5">
              {ACTIONS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAction(a.value)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
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
                className="w-full rounded-xl border border-brown-900/15 bg-cream px-3 py-2 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-semibold"
              />
            </div>
          )}
          <div>
            <label className="text-[11px] font-bold text-brown-900 block mb-1.5">
              Catatan Moderasi (wajib untuk audit)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-brown-900/15 bg-cream px-3 py-2 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              placeholder="Alasan resmi tindakan ini..."
              maxLength={500}
            />
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>
        <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-brown-900/8 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-brown-900/15 text-xs font-semibold text-brown-700 hover:bg-cream transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!action || !reason.trim() || submitting}
            className="flex-1 py-2.5 rounded-xl bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {submitting ? (
              <RefreshCw size={14} className="animate-spin" />
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

// ─── Badges ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReportStatus }) {
  const cfg = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    ACTION_TAKEN: "bg-green-100 text-green-800 border-green-200",
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

function TargetBadge({ type }: { type: ReportTargetType }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
        type === "POST"
          ? "bg-orange-100 text-orange-700 border-orange-200"
          : "bg-blue-100 text-blue-700 border-blue-200"
      }`}
    >
      {TARGET_LABELS[type]}
    </span>
  );
}

// ─── Main Admin Moderation Page ─────────────────────────────────────────────
export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<"REPORTS" | "AUDIT_LOGS">("REPORTS");

  // State: Tab Laporan
  const [reports, setReports] = useState<Report[]>([]);
  const [repPagination, setRepPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [repLoading, setRepLoading] = useState(true);
  const [repError, setRepError] = useState("");
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [repStatus, setRepStatus] = useState("PENDING");
  const [repTargetType, setRepTargetType] = useState("ALL");
  const [repReason, setRepReason] = useState("ALL");
  const [repSearch, setRepSearch] = useState("");
  const [repSearchInput, setRepSearchInput] = useState("");
  const [repPage, setRepPage] = useState(1);

  // State: Tab Riwayat Audit Moderasi
  const [logs, setLogs] = useState<ModerationLogItem[]>([]);
  const [logPagination, setLogPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState("");
  const [logPreset, setLogPreset] = useState<PresetKey>("ALL");
  const [logStartDate, setLogStartDate] = useState("");
  const [logEndDate, setLogEndDate] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("ALL");
  const [logSearchInput, setLogSearchInput] = useState("");
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logPage, setLogPage] = useState(1);
  const [selectedLogDetail, setSelectedLogDetail] = useState<ModerationLogItem | null>(null);

  // Load Laporan
  const loadReports = useCallback(async () => {
    setRepLoading(true);
    setRepError("");
    try {
      const params = new URLSearchParams({
        page: String(repPage),
        limit: "15",
        status: repStatus,
        targetType: repTargetType,
        reason: repReason,
        search: repSearch,
      });
      const res = await fetch(`/api/admin/reports?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403) throw new Error("Akses ditolak. Anda tidak memiliki hak admin.");
      if (!res.ok) throw new Error(data.error || "Gagal mengambil laporan.");
      setReports(data.reports || []);
      setRepPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 });
    } catch (err) {
      setRepError(err instanceof Error ? err.message : "Gagal mengambil laporan.");
    } finally {
      setRepLoading(false);
    }
  }, [repPage, repStatus, repTargetType, repReason, repSearch]);

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    setLogLoading(true);
    setLogError("");
    try {
      const params = new URLSearchParams({
        page: String(logPage),
        limit: "15",
        ...(logActionFilter !== "ALL" ? { action: logActionFilter } : {}),
        ...(logStartDate ? { startDate: logStartDate } : {}),
        ...(logEndDate ? { endDate: logEndDate } : {}),
        ...(logSearchQuery ? { search: logSearchQuery } : {}),
      });
      const res = await fetch(`/api/admin/moderation/logs?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403) throw new Error("Akses ditolak. Anda tidak memiliki hak admin.");
      if (!res.ok) throw new Error(data.error || "Gagal mengambil riwayat audit moderasi.");
      setLogs(data.logs || []);
      setLogPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 });
    } catch (err) {
      setLogError(err instanceof Error ? err.message : "Gagal mengambil riwayat audit moderasi.");
    } finally {
      setLogLoading(false);
    }
  }, [logPage, logActionFilter, logStartDate, logEndDate, logSearchQuery]);

  useEffect(() => {
    if (activeTab === "REPORTS") {
      loadReports();
    } else {
      loadAuditLogs();
    }
  }, [activeTab, loadReports, loadAuditLogs]);

  const applyRepSearch = () => {
    setRepSearch(repSearchInput);
    setRepPage(1);
  };

  const applyLogPreset = (key: PresetKey) => {
    setLogPreset(key);
    setLogPage(1);
    if (key === "ALL") {
      setLogStartDate("");
      setLogEndDate("");
    } else if (key === "TODAY") {
      const today = getWibTodayString();
      setLogStartDate(today);
      setLogEndDate(today);
    } else if (key === "7DAYS") {
      setLogStartDate(getWibMinusDays(7));
      setLogEndDate(getWibTodayString());
    } else if (key === "30DAYS") {
      setLogStartDate(getWibMinusDays(30));
      setLogEndDate(getWibTodayString());
    } else if (key === "THIS_MONTH") {
      setLogStartDate(getWibMonthStartString());
      setLogEndDate(getWibTodayString());
    }
  };

  const handleLogCustomDateChange = (start: string, end: string) => {
    setLogStartDate(start);
    setLogEndDate(end);
    setLogPreset("CUSTOM");
    setLogPage(1);
  };

  const applyLogFilters = () => {
    setLogSearchQuery(logSearchInput.trim());
    setLogPage(1);
  };

  const resetLogFilters = () => {
    setLogPreset("ALL");
    setLogStartDate("");
    setLogEndDate("");
    setLogActionFilter("ALL");
    setLogSearchInput("");
    setLogSearchQuery("");
    setLogPage(1);
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-8 text-brown-900">
      <div className="mx-auto max-w-5xl">
        {/* Header Navigation */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={22} className="text-orange-500" />
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900">
                Moderasi Komunitas
              </h1>
            </div>
            <p className="text-sm text-brown-700/70">
              Kelola laporan pengguna, tinjau pelanggaran, dan audit seluruh riwayat tindakan admin.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-brown-900 bg-white border border-brown-900/15 rounded-xl px-3.5 py-2 transition-colors shadow-sm"
            >
              <CreditCard size={13} className="text-orange-500" /> Keuangan
            </Link>
            <button
              type="button"
              onClick={() => {
                if (activeTab === "REPORTS") {
                  setRepPage(1);
                  loadReports();
                } else {
                  setLogPage(1);
                  loadAuditLogs();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-brown-900/15 rounded-xl px-3.5 py-2 text-brown-700 hover:text-brown-900 transition-colors shadow-sm"
            >
              <RefreshCw size={13} /> Perbarui
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mb-5 flex border-b border-brown-900/15">
          <button
            type="button"
            onClick={() => setActiveTab("REPORTS")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-colors relative ${
              activeTab === "REPORTS"
                ? "text-brown-900 border-b-2 border-orange-500"
                : "text-brown-700/60 hover:text-brown-900"
            }`}
          >
            <FileText size={15} />
            Laporan Pengguna
            {repPagination.total > 0 && (
              <span className="text-[10px] bg-orange-100 text-orange-800 font-extrabold px-1.5 py-0.2 rounded-full">
                {repPagination.total}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("AUDIT_LOGS")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-colors relative ${
              activeTab === "AUDIT_LOGS"
                ? "text-brown-900 border-b-2 border-orange-500"
                : "text-brown-700/60 hover:text-brown-900"
            }`}
          >
            <History size={15} />
            Riwayat Audit Tindakan
          </button>
        </div>

        {/* ─── TAB 1: LAPORAN PENGGUNA ────────────────────────────────────────── */}
        {activeTab === "REPORTS" && (
          <div>
            {/* Filter Bar Laporan */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1 bg-white rounded-xl border border-brown-900/15 px-3 py-1.5 flex-1 min-w-[200px]">
                <Search size={13} className="text-brown-700/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari pelapor, konten, atau pengguna..."
                  value={repSearchInput}
                  onChange={(e) => setRepSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyRepSearch()}
                  className="flex-1 text-xs text-brown-900 placeholder:text-brown-700/40 bg-transparent focus:outline-none"
                />
                {repSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setRepSearchInput("");
                      setRepSearch("");
                      setRepPage(1);
                    }}
                  >
                    <X size={12} className="text-brown-700/50 hover:text-brown-900" />
                  </button>
                )}
              </div>
              <select
                value={repStatus}
                onChange={(e) => {
                  setRepStatus(e.target.value);
                  setRepPage(1);
                }}
                className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 focus:outline-none font-semibold"
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={repTargetType}
                onChange={(e) => {
                  setRepTargetType(e.target.value);
                  setRepPage(1);
                }}
                className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 focus:outline-none font-semibold"
              >
                {Object.entries(TARGET_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={repReason}
                onChange={(e) => {
                  setRepReason(e.target.value);
                  setRepPage(1);
                }}
                className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 focus:outline-none font-semibold"
              >
                {Object.entries(REASON_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              {repSearch && (
                <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
                  Pencarian: &quot;{repSearch}&quot;
                </span>
              )}
            </div>

            {repLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white border border-brown-900/10 animate-pulse" />
                ))}
              </div>
            ) : repError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <ShieldAlert size={32} className="text-red-400 mx-auto mb-3" />
                <p className="font-display font-bold text-sm text-red-700">{repError}</p>
                <button
                  type="button"
                  onClick={loadReports}
                  className="mt-3 text-xs font-semibold text-orange-500 hover:underline"
                >
                  Coba lagi
                </button>
              </div>
            ) : reports.length === 0 ? (
              <div className="rounded-2xl border border-brown-900/10 bg-white p-10 text-center">
                <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
                <h2 className="font-display font-bold text-base text-brown-900">Tidak ada laporan ditemukan</h2>
                <p className="text-sm text-brown-700/60 mt-1">
                  {repStatus === "PENDING"
                    ? "Semua laporan telah ditangani!"
                    : "Ubah filter untuk melihat laporan lain."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {reports.map((report) => {
                  const targetName = resolveTargetUserName(report);
                  const warnCount = resolveWarningCount(report);
                  const reporterName = resolveReporterName(report);
                  const previewText = getContentText(report.contentPreview);
                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl border border-brown-900/10 p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-wrap items-start gap-3 justify-between">
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
                          {previewText && (
                            <p className="text-xs text-brown-900 italic truncate max-w-md mb-1">
                              &quot;{previewText}&quot;
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-brown-700/60">
                            {targetName && (
                              <span className="font-semibold text-brown-900">@{targetName}</span>
                            )}
                            {warnCount > 0 && (
                              <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                                <AlertTriangle size={10} />
                                {warnCount} peringatan
                              </span>
                            )}
                            {reporterName && <span>Dilaporkan oleh {reporterName}</span>}
                            <span>· {fmtWib(report.createdAt)}</span>
                          </div>
                          {report.details && (
                            <p className="text-[11px] text-brown-700/70 mt-1 leading-relaxed line-clamp-2">
                              {String(report.details)}
                            </p>
                          )}
                          {report.resolutionNote && (
                            <p className="text-[11px] text-green-700 mt-1 font-medium">
                              ✓ {String(report.resolutionNote)}
                            </p>
                          )}
                        </div>
                        {report.status === "PENDING" ? (
                          <button
                            type="button"
                            onClick={() => setActiveReport(report)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-brown-900 text-white rounded-xl px-3.5 py-2 hover:bg-orange-500 transition-colors shrink-0 shadow-sm"
                          >
                            <Shield size={13} /> Tindak
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveReport(report)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-cream text-brown-700 border border-brown-900/15 rounded-xl px-3.5 py-2 hover:bg-white transition-colors shrink-0"
                          >
                            <Eye size={13} /> Detail
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Laporan */}
            {!repLoading && repPagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between gap-2">
                <p className="text-xs text-brown-700/60">
                  {repPagination.total} laporan · Halaman {repPagination.page}/{repPagination.totalPages}
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRepPage((p) => Math.max(1, p - 1))}
                    disabled={repPage <= 1}
                    className="w-8 h-8 rounded-xl border border-brown-900/15 bg-white flex items-center justify-center text-brown-700 hover:bg-cream transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.min(5, repPagination.totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(repPagination.totalPages - 4, repPage - 2)) + i;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setRepPage(p)}
                        className={`w-8 h-8 rounded-xl border text-xs font-bold transition-colors ${
                          repPage === p
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
                    onClick={() => setRepPage((p) => Math.min(repPagination.totalPages, p + 1))}
                    disabled={repPage >= repPagination.totalPages}
                    className="w-8 h-8 rounded-xl border border-brown-900/15 bg-white flex items-center justify-center text-brown-700 hover:bg-cream transition-colors disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: RIWAYAT AUDIT TINDAKAN MODERASI ────────────────────────── */}
        {activeTab === "AUDIT_LOGS" && (
          <div>
            {/* Filter Toolbar Audit */}
            <section className="mb-4 rounded-2xl border border-brown-900/10 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3">
                {/* Presets Row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-brown-700 mr-1 flex items-center gap-1">
                    <Filter size={12} /> Preset:
                  </span>
                  {[
                    { key: "ALL", label: "Semua Waktu" },
                    { key: "TODAY", label: "Hari Ini" },
                    { key: "7DAYS", label: "7 Hari Terakhir" },
                    { key: "30DAYS", label: "30 Hari Terakhir" },
                    { key: "THIS_MONTH", label: "Bulan Ini" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applyLogPreset(p.key as PresetKey)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                        logPreset === p.key
                          ? "bg-brown-900 text-white border-brown-900"
                          : "bg-cream text-brown-700 border-brown-900/10 hover:bg-cream/80"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Filters Controls Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Tanggal Mulai */}
                  <div className="flex items-center gap-1.5 bg-cream/70 rounded-xl border border-brown-900/15 px-3 py-1.5">
                    <span className="text-[11px] font-bold text-brown-700/60">Dari:</span>
                    <input
                      type="date"
                      value={logStartDate}
                      onChange={(e) => handleLogCustomDateChange(e.target.value, logEndDate)}
                      className="bg-transparent text-xs text-brown-900 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Tanggal Akhir (Inklusif WIB) */}
                  <div className="flex items-center gap-1.5 bg-cream/70 rounded-xl border border-brown-900/15 px-3 py-1.5">
                    <span className="text-[11px] font-bold text-brown-700/60">Sampai:</span>
                    <input
                      type="date"
                      value={logEndDate}
                      onChange={(e) => handleLogCustomDateChange(logStartDate, e.target.value)}
                      className="bg-transparent text-xs text-brown-900 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Filter Action */}
                  <select
                    value={logActionFilter}
                    onChange={(e) => {
                      setLogActionFilter(e.target.value);
                      setLogPage(1);
                    }}
                    className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 font-semibold focus:outline-none"
                  >
                    {Object.entries(ACTION_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>

                  {/* Search Bar */}
                  <div className="flex items-center gap-1.5 bg-cream/70 rounded-xl border border-brown-900/15 px-3 py-1.5 flex-1 min-w-[200px]">
                    <Search size={13} className="text-brown-700/50 shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari admin, target user, atau catatan..."
                      value={logSearchInput}
                      onChange={(e) => setLogSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyLogFilters()}
                      className="flex-1 text-xs text-brown-900 placeholder:text-brown-700/40 bg-transparent focus:outline-none"
                    />
                    {logSearchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogSearchInput("");
                          setLogSearchQuery("");
                          setLogPage(1);
                        }}
                      >
                        <X size={12} className="text-brown-700/50 hover:text-brown-900" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={applyLogFilters}
                    className="bg-brown-900 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-orange-500 transition-colors shadow-sm"
                  >
                    Terapkan
                  </button>

                  {(logStartDate || logEndDate || logActionFilter !== "ALL" || logSearchQuery) && (
                    <button
                      type="button"
                      onClick={resetLogFilters}
                      className="border border-brown-900/15 bg-white text-brown-700 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-cream transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Audit Logs Content */}
            <section className="rounded-3xl border border-brown-900/10 bg-white p-4 sm:p-6 shadow-sm">
              {logLoading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="animate-spin mx-auto text-orange-500 mb-2" size={24} />
                  <p className="text-xs text-brown-700/60 font-medium">Memuat riwayat audit moderasi...</p>
                </div>
              ) : logError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                  <ShieldAlert size={32} className="text-red-400 mx-auto mb-3" />
                  <p className="font-display font-bold text-sm text-red-700">{logError}</p>
                  <button
                    type="button"
                    onClick={loadAuditLogs}
                    className="mt-3 text-xs font-semibold text-orange-500 hover:underline"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-14 text-center">
                  <History className="mx-auto text-brown-700/40 mb-2" size={36} />
                  <p className="font-display text-base font-bold text-brown-900">
                    Tidak ada riwayat tindakan moderasi
                  </p>
                  <p className="mt-1 text-xs text-brown-700/60 max-w-sm mx-auto">
                    Belum ada tindakan moderasi yang tercatat dalam rentang waktu atau kriteria filter ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-brown-900/10 text-[11px] font-bold text-brown-700/70 uppercase">
                        <th className="py-3 px-3">Waktu (WIB)</th>
                        <th className="py-3 px-3">Admin Pelaksana</th>
                        <th className="py-3 px-3">Target Pengguna</th>
                        <th className="py-3 px-3">Jenis Tindakan</th>
                        <th className="py-3 px-3">Alasan & Catatan</th>
                        <th className="py-3 px-3 text-right">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-900/5">
                      {logs.map((log) => {
                        const actInfo = ACTION_LABELS[log.action] || {
                          label: log.action,
                          color: "bg-gray-100 text-gray-800",
                        };

                        return (
                          <tr key={log.id} className="hover:bg-cream/40 transition-colors">
                            <td className="py-3 px-3 text-brown-700 whitespace-nowrap">
                              {fmtWib(log.createdAt)}
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold text-brown-900">{log.adminName}</p>
                              <p className="text-[10px] text-brown-700/60 truncate max-w-[140px]">
                                {log.adminEmail || "-"}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-brown-900">{log.targetUserName}</p>
                                {log.targetUserStatus.isBanned && (
                                  <span className="text-[9px] font-extrabold bg-red-700 text-white px-1.5 py-0.2 rounded">
                                    BANNED
                                  </span>
                                )}
                                {log.targetUserStatus.isSuspended && (
                                  <span className="text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.2 rounded">
                                    SUSPENDED
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-brown-700/60 truncate max-w-[140px]">
                                {log.targetUserEmail || "-"}
                              </p>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${actInfo.color}`}
                              >
                                {actInfo.label}
                              </span>
                              {log.durationDays && (
                                <span className="ml-1.5 text-[10px] font-semibold text-brown-700/70">
                                  ({log.durationDays} hari)
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 max-w-[240px]">
                              <p className="text-xs text-brown-900 font-medium leading-relaxed truncate">
                                {log.reason}
                              </p>
                              {log.reportId && (
                                <p className="text-[10px] text-brown-700/50 mt-0.5">
                                  Ref Laporan: #{log.reportId.slice(-6)}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedLogDetail(log)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cream text-brown-800 hover:bg-white border border-brown-900/10 transition-colors"
                              >
                                Buka
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Audit Logs */}
              {!logLoading && logPagination.totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-brown-900/10">
                  <p className="text-xs text-brown-700/70">
                    Menampilkan {logs.length} dari {logPagination.total} tindakan · Halaman {logPagination.page} dari{" "}
                    {logPagination.totalPages}
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                      disabled={logPage <= 1}
                      className="w-8 h-8 rounded-xl border border-brown-900/15 bg-white flex items-center justify-center text-brown-700 hover:bg-cream transition-colors disabled:opacity-40"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: Math.min(5, logPagination.totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(logPagination.totalPages - 4, logPage - 2)) + i;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setLogPage(p)}
                          className={`w-8 h-8 rounded-xl border text-xs font-bold transition-colors ${
                            logPage === p
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
                      onClick={() => setLogPage((p) => Math.min(logPagination.totalPages, p + 1))}
                      disabled={logPage >= logPagination.totalPages}
                      className="w-8 h-8 rounded-xl border border-brown-900/15 bg-white flex items-center justify-center text-brown-700 hover:bg-cream transition-colors disabled:opacity-40"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Modal Action untuk Laporan Aktif */}
      {activeReport && (
        <ActionModal
          report={activeReport}
          onClose={() => setActiveReport(null)}
          onSuccess={() => {
            setActiveReport(null);
            loadReports();
          }}
        />
      )}

      {/* Modal Detail Log Audit Moderasi */}
      {selectedLogDetail && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedLogDetail(null)}
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brown-900/10 shrink-0">
              <div>
                <h2 className="font-display font-bold text-sm text-brown-900 flex items-center gap-2">
                  <History size={16} className="text-orange-500" />
                  Detail Audit Moderasi
                </h2>
                <p className="text-[11px] text-brown-700/60 mt-0.5">ID: {selectedLogDetail.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-brown-700/50 hover:text-brown-900 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-cream/60 rounded-2xl p-3.5 border border-brown-900/10">
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Admin Pelaksana</p>
                  <p className="font-bold text-brown-900 mt-0.5">{selectedLogDetail.adminName}</p>
                  <p className="text-[10px] text-brown-700/60 truncate">{selectedLogDetail.adminEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Target Pengguna</p>
                  <p className="font-bold text-brown-900 mt-0.5">{selectedLogDetail.targetUserName}</p>
                  <p className="text-[10px] text-brown-700/60 truncate">{selectedLogDetail.targetUserEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Tindakan</p>
                  <p className="font-bold text-brown-900 mt-0.5">
                    {ACTION_LABELS[selectedLogDetail.action]?.label || selectedLogDetail.action}
                  </p>
                  {selectedLogDetail.durationDays && (
                    <p className="text-[10px] text-amber-700">{selectedLogDetail.durationDays} hari</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Waktu Eksekusi (WIB)</p>
                  <p className="font-bold text-brown-900 mt-0.5">{fmtWib(selectedLogDetail.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-brown-900 mb-1">Alasan & Catatan Resmi:</p>
                <div className="p-3 bg-cream/70 rounded-2xl border border-brown-900/10 text-xs text-brown-900 leading-relaxed">
                  {selectedLogDetail.reason}
                </div>
              </div>

              {selectedLogDetail.metadata && (
                <div>
                  <p className="font-bold text-brown-900 mb-1">Metadata Tambahan:</p>
                  <pre className="p-3 bg-brown-900 text-cream rounded-2xl text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedLogDetail.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-brown-900/8">
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="w-full py-2.5 rounded-xl bg-brown-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
