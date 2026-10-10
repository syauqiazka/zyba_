"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Filter,
  RefreshCw,
  Search,
  Shield,
  X,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

type Payment = {
  id: string;
  amount: number;
  orderId: string;
  transactionId?: string | null;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED";
  paymentMethod: string;
  proofUrl?: string | null;
  senderName?: string | null;
  submittedAt?: string | null;
  rejectionReason?: string | null;
  paidAt?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  user?: { name: string; email: string; avatarUrl?: string | null } | null;
  subscription: { status: string; startDate?: string | null; endDate?: string | null; plan?: string | null };
};

type Summary = {
  totalCount: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const money = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(v)
    .replace("IDR", "Rp");

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

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalCount: 0,
    successCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalRevenue: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");

  // Filters State
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [preset, setPreset] = useState<PresetKey>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const applyPreset = (key: PresetKey) => {
    setPreset(key);
    setPage(1);
    if (key === "ALL") {
      setStartDate("");
      setEndDate("");
    } else if (key === "TODAY") {
      const today = getWibTodayString();
      setStartDate(today);
      setEndDate(today);
    } else if (key === "7DAYS") {
      setStartDate(getWibMinusDays(7));
      setEndDate(getWibTodayString());
    } else if (key === "30DAYS") {
      setStartDate(getWibMinusDays(30));
      setEndDate(getWibTodayString());
    } else if (key === "THIS_MONTH") {
      setStartDate(getWibMonthStartString());
      setEndDate(getWibTodayString());
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPreset("CUSTOM");
    setPage(1);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        status: statusFilter,
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
      });

      const res = await fetch(`/api/admin/payments?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403) throw new Error("Akun ini tidak memiliki hak akses admin.");
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data pembayaran.");

      setPayments(data.payments || []);
      if (data.summary) setSummary(data.summary);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil pembayaran.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, startDate, endDate, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApplyFilter = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleResetFilter = () => {
    setStatusFilter("ALL");
    setPreset("ALL");
    setStartDate("");
    setEndDate("");
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handleAction = async (paymentId: string, type: "APPROVE" | "REJECT") => {
    if (type === "REJECT" && !reason.trim()) {
      setError("Isi alasan penolakan terlebih dahulu.");
      return;
    }

    setProcessing(paymentId);
    setError("");
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action: type, reason: reason.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal memproses pembayaran.");
      setSelected(null);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses pembayaran.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-8 text-brown-900">
      <div className="mx-auto max-w-6xl">
        {/* Header Navigation */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={22} className="text-orange-500" />
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900">
                Riwayat & Verifikasi Keuangan
              </h1>
            </div>
            <p className="text-sm text-brown-700/70">
              Audit transaksi langganan, verifikasi pembayaran manual, dan filter arus pendapatan ZYBA Plus.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/moderation"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-brown-900 bg-white border border-brown-900/15 rounded-xl px-3.5 py-2 transition-colors shadow-sm"
            >
              <Shield size={14} className="text-orange-500" /> Moderasi Komunitas
            </Link>
            <button
              onClick={() => {
                setPage(1);
                load();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-brown-900/15 rounded-xl px-3.5 py-2 text-brown-700 hover:text-brown-900 transition-colors shadow-sm"
            >
              <RefreshCw size={14} /> Segarkan
            </button>
          </div>
        </div>

        {/* Financial Stat Cards (Summary) */}
        <section className="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Total Transaksi */}
          <div className="rounded-2xl border border-brown-900/10 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold text-brown-700/60 uppercase tracking-wider">Total Transaksi</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-brown-900">{summary.totalCount}</p>
            <p className="text-[10px] text-brown-700/50 mt-0.5">Semua status dalam rentang</p>
          </div>

          {/* Transaksi Berhasil */}
          <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-green-800 uppercase tracking-wider">Berhasil</p>
              <CheckCircle2 size={15} className="text-green-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-extrabold text-green-900">{summary.successCount}</p>
            <p className="text-[10px] text-green-700/70 mt-0.5">Langganan aktif</p>
          </div>

          {/* Transaksi Pending */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Menunggu</p>
              <Clock size={15} className="text-amber-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-extrabold text-amber-900">{summary.pendingCount}</p>
            <p className="text-[10px] text-amber-700/70 mt-0.5">Perlu verifikasi admin</p>
          </div>

          {/* Transaksi Ditolak / Gagal */}
          <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider">Ditolak / Batal</p>
              <XCircle size={15} className="text-red-500" />
            </div>
            <p className="mt-1 font-display text-2xl font-extrabold text-red-900">{summary.failedCount}</p>
            <p className="text-[10px] text-red-700/70 mt-0.5">Tidak valid</p>
          </div>

          {/* Total Pendapatan Bersih (Hanya Sukses) */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">Total Pendapatan</p>
              <TrendingUp size={15} className="text-orange-600" />
            </div>
            <p className="mt-1 font-display text-xl font-extrabold text-orange-950 truncate">
              {money(summary.totalRevenue)}
            </p>
            <p className="text-[10px] text-orange-700/80 mt-0.5">Hanya dari transaksi sukses</p>
          </div>
        </section>

        {/* Filter Toolbar */}
        <section className="mb-6 rounded-2xl border border-brown-900/10 bg-white p-4 shadow-sm">
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
                  onClick={() => applyPreset(p.key as PresetKey)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                    preset === p.key
                      ? "bg-brown-900 text-white border-brown-900"
                      : "bg-cream text-brown-700 border-brown-900/10 hover:bg-cream/80"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Date Pickers & Status & Search Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Tanggal Mulai */}
              <div className="flex items-center gap-1.5 bg-cream/70 rounded-xl border border-brown-900/15 px-3 py-1.5">
                <span className="text-[11px] font-bold text-brown-700/60">Dari:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
                  className="bg-transparent text-xs text-brown-900 font-medium focus:outline-none"
                />
              </div>

              {/* Tanggal Akhir (Inklusif WIB) */}
              <div className="flex items-center gap-1.5 bg-cream/70 rounded-xl border border-brown-900/15 px-3 py-1.5">
                <span className="text-[11px] font-bold text-brown-700/60">Sampai:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
                  className="bg-transparent text-xs text-brown-900 font-medium focus:outline-none"
                />
              </div>

              {/* Filter Status */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs rounded-xl border border-brown-900/15 bg-white px-3 py-2 text-brown-900 font-semibold focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Menunggu Persetujuan</option>
                <option value="SUCCESS">Berhasil / Aktif</option>
                <option value="CANCELLED">Ditolak / Batal</option>
                <option value="FAILED">Gagal</option>
              </select>

              {/* Search Bar */}
              <div className="flex items-center gap-1.5 bg-cream/70 rounded-xl border border-brown-900/15 px-3 py-1.5 flex-1 min-w-[200px]">
                <Search size={13} className="text-brown-700/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari Order ID, nama, atau email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                  className="flex-1 text-xs text-brown-900 placeholder:text-brown-700/40 bg-transparent focus:outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                      setPage(1);
                    }}
                  >
                    <X size={12} className="text-brown-700/50 hover:text-brown-900" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleApplyFilter}
                className="bg-brown-900 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-orange-500 transition-colors shadow-sm"
              >
                Terapkan
              </button>
              {(startDate || endDate || statusFilter !== "ALL" || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="border border-brown-900/15 bg-white text-brown-700 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-cream transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Transaction Table / List */}
        <section className="rounded-3xl border border-brown-900/10 bg-white p-4 sm:p-6 shadow-sm">
          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="animate-spin mx-auto text-orange-500 mb-2" size={24} />
              <p className="text-xs text-brown-700/60 font-medium">Memuat data transaksi keuangan...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-14 text-center">
              <Check className="mx-auto text-green-600 mb-2" size={36} />
              <p className="font-display text-base font-bold text-brown-900">
                Tidak ada data pembayaran ditemukan
              </p>
              <p className="mt-1 text-xs text-brown-700/60 max-w-sm mx-auto">
                {statusFilter === "PENDING"
                  ? "Semua pembayaran manual telah diproses!"
                  : "Tidak ada transaksi yang cocok dengan kriteria filter rentang waktu ini."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brown-900/10 text-[11px] font-bold text-brown-700/70 uppercase">
                    <th className="py-3 px-3">Waktu (WIB)</th>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Pengguna</th>
                    <th className="py-3 px-3">Paket & Nominal</th>
                    <th className="py-3 px-3">Pengirim / Catatan</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brown-900/5">
                  {payments.map((p) => {
                    const statusBadge = {
                      PENDING: "bg-amber-100 text-amber-800 border-amber-200",
                      SUCCESS: "bg-green-100 text-green-800 border-green-200",
                      CANCELLED: "bg-red-100 text-red-800 border-red-200",
                      FAILED: "bg-red-100 text-red-800 border-red-200",
                      EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
                    }[p.status] || "bg-gray-100 text-gray-700";

                    return (
                      <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                        <td className="py-3 px-3 text-brown-700 whitespace-nowrap">
                          {fmtWib(p.createdAt)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-brown-900">
                          {p.orderId}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-brown-900">{p.user?.name || "Pengguna ZYBA"}</p>
                          <p className="text-[10px] text-brown-700/60 truncate max-w-[160px]">
                            {p.user?.email || "-"}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 mb-0.5">
                            {p.subscription?.plan || "PLUS"}
                          </span>
                          <p className="font-bold text-brown-900">{money(p.amount)}</p>
                        </td>
                        <td className="py-3 px-3 max-w-[200px]">
                          {p.senderName ? (
                            <p className="text-brown-800">
                              <span className="font-semibold">A.N:</span> {p.senderName}
                            </p>
                          ) : (
                            <span className="text-brown-700/40 italic">-</span>
                          )}
                          {p.rejectionReason && (
                            <p className="text-[10px] text-red-600 mt-0.5 truncate">
                              Ditolak: {p.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBadge}`}
                          >
                            {p.status === "PENDING"
                              ? "Menunggu"
                              : p.status === "SUCCESS"
                              ? "Berhasil"
                              : p.status === "CANCELLED"
                              ? "Ditolak"
                              : p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(p);
                              setReason(p.rejectionReason || "");
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                              p.status === "PENDING"
                                ? "bg-brown-900 text-white hover:bg-orange-500 shadow-sm"
                                : "bg-cream text-brown-800 hover:bg-white border border-brown-900/10"
                            }`}
                          >
                            {p.status === "PENDING" ? "Periksa" : "Detail"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-brown-900/10">
              <p className="text-xs text-brown-700/70">
                Menampilkan {payments.length} dari {pagination.total} transaksi · Halaman {pagination.page} dari{" "}
                {pagination.totalPages}
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
        </section>
      </div>

      {/* Review Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brown-900/10 shrink-0">
              <div>
                <h2 className="font-display font-bold text-sm text-brown-900 flex items-center gap-2">
                  <CreditCard size={16} className="text-orange-500" />
                  Verifikasi Pembayaran Manual
                </h2>
                <p className="text-[11px] text-brown-700/60 mt-0.5">
                  Order ID: <span className="font-mono font-semibold">{selected.orderId}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-brown-700/50 hover:text-brown-900 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">
              {/* User & Amount Info */}
              <div className="grid grid-cols-2 gap-3 bg-cream/60 rounded-2xl p-3.5 border border-brown-900/10">
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Pengguna</p>
                  <p className="font-bold text-brown-900 mt-0.5">{selected.user?.name || "Pengguna ZYBA"}</p>
                  <p className="text-[10px] text-brown-700/60 truncate">{selected.user?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Nominal Ditagih</p>
                  <p className="font-bold text-orange-600 text-sm mt-0.5">{money(selected.amount)}</p>
                  <p className="text-[10px] text-brown-700/60">Paket PLUS (30 Hari)</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Nama Rekening Pengirim</p>
                  <p className="font-bold text-brown-900 mt-0.5">{selected.senderName || "Tidak dicantumkan"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown-700/60 uppercase">Waktu Pengajuan (WIB)</p>
                  <p className="font-bold text-brown-900 mt-0.5">{fmtWib(selected.submittedAt || selected.createdAt)}</p>
                </div>
              </div>

              {/* Bukti Transfer */}
              <div>
                <p className="font-bold text-brown-900 mb-2">Bukti Struk Transfer:</p>
                {selected.proofUrl ? (
                  <div className="rounded-2xl border border-brown-900/15 overflow-hidden bg-black/5 flex flex-col items-center p-2">
                    <img
                      src={selected.proofUrl}
                      alt="Bukti Transfer"
                      className="max-h-64 object-contain rounded-xl"
                    />
                    <a
                      href={selected.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline"
                    >
                      Buka Gambar Asli <ExternalLink size={12} />
                    </a>
                  </div>
                ) : (
                  <p className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-amber-800 text-[11px]">
                    Pengguna belum mengunggah foto bukti transfer.
                  </p>
                )}
              </div>

              {/* Form Alasan Penolakan */}
              {selected.status === "PENDING" && (
                <div>
                  <label className="text-[11px] font-bold text-brown-900 block mb-1.5">
                    Alasan Penolakan (Hanya jika ingin menolak):
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contoh: Bukti transfer buram, mutasi rekening belum masuk..."
                    className="w-full resize-none rounded-xl border border-brown-900/15 bg-cream px-3 py-2 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
              )}

              {selected.rejectionReason && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-800">
                  <p className="font-bold text-[11px]">Catatan Penolakan Sebelumnya:</p>
                  <p className="mt-0.5 text-xs">{selected.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 px-5 pb-5 pt-3 border-t border-brown-900/8 shrink-0">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-xl border border-brown-900/15 text-xs font-semibold text-brown-700 hover:bg-cream transition-colors"
              >
                Tutup
              </button>
              {selected.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleAction(selected.id, "REJECT")}
                    disabled={Boolean(processing)}
                    className="flex-1 py-2.5 rounded-xl border border-red-300 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-40"
                  >
                    Tolak Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(selected.id, "APPROVE")}
                    disabled={Boolean(processing)}
                    className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {processing ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Setujui & Aktifkan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
