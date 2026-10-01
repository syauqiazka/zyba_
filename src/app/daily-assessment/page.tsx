"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DailyRecord,
  Pagination,
  DailyAssessmentForm,
} from "./components/DailyAssessmentForm";
import DailyAssessmentSummary from "./components/DailyAssessmentSummary";
import DailyAssessmentHistory from "./components/DailyAssessmentHistory";
import CalendarWidget from "./components/CalendarWidget";
import JournalHistory from "./components/JournalHistory";
import HistoryTabs from "./components/HistoryTabs";
import { useMoodOverview } from "./useMoodOverview";
import {
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react";

type PageState = "loading" | "form" | "summary";

export default function DailyAssessmentPage() {
  const { streak, calendarData, journalList, reload } = useMoodOverview();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const displayDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const loadData = useCallback(async (page = 1) => {
    try {
      setIsHistoryLoading(true);
      const clientDate = new Intl.DateTimeFormat("en-CA").format(new Date());
      const res = await fetch(
        `/api/daily-assessment?page=${page}&limit=10&date=${clientDate}&_t=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setTodayRecord(data.today);
      setHistory(data.history || []);
      setPagination(
        data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
      );

      if (data.hasCompletedToday && data.today) {
        setPageState("summary");
      } else {
        setPageState("form");
      }
    } catch {
      setPageState("form");
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const clientDate = new Intl.DateTimeFormat("en-CA").format(new Date());
      const res = await fetch("/api/daily-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, clientDate }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Jika sudah menyelesaikan assessment hari ini, langsung tutup form dan tampilkan summary
        if (data.hasCompletedToday && data.record) {
          setTodayRecord(data.record);
          setPageState("summary");
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 4500);
          return;
        }
        throw new Error(data.error || "Gagal menyimpan assessment");
      }

      if (data.isRisk) setCrisisAlert(true);

      // LANGSUNG tutup form putih (0ms delay) dan tampilkan summary
      if (data.record) {
        setTodayRecord(data.record);
        setPageState("summary");

        // Optimistic update history (menghemat 1 network request berulang)
        setHistory((prev) => {
          const exists = prev.some((h) => h.id === data.record.id || h.date === data.record.date);
          if (exists) {
            return prev.map((h) => (h.id === data.record.id || h.date === data.record.date ? data.record : h));
          }
          return [data.record, ...prev];
        });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4500);

      // Sinkronisasi kalender & streak di latar belakang tanpa menghambat UI
      reload().catch(() => {});
    } catch (err: any) {
      console.error("Daily assessment submit error:", err);
      alert(err.message || "Gagal menyimpan assessment harian");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadData(page);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 pb-12 max-w-[1240px] mx-auto select-none">
      {/* ── 1. Page Header (Calm, Focused, Minimal) ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brown-900/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#1B3C53] bg-[#1B3C53]/10 px-2.5 py-0.5 rounded-full">
              Ritual Harian
            </span>
            <span className="text-xs text-brown-700/70" suppressHydrationWarning>
              Hari ini · sekitar 1–2 menit
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-brown-900 tracking-tight flex items-center gap-2">
            <span>Daily Assessment</span>
          </h1>
        </div>

        {/* Streak & Status Badges */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brown-900/10 shadow-2xs">
            <Flame size={15} className="text-orange-500 fill-orange-500 shrink-0" />
            <span className="text-xs font-bold text-brown-900">
              {streak} Hari Aktif
            </span>
          </div>

          {pageState === "summary" ? (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-500/20 text-xs font-bold shadow-2xs">
              <CheckCircle2 size={13} className="shrink-0" />
              <span>Selesai</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-300/40 text-xs font-bold shadow-2xs">
              <Calendar size={13} className="shrink-0" />
              <span>Hari Ini</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Success Toast ────────────────────────────────────────── */}
      {savedSuccess && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-green-100/70 border border-green-500/30 rounded-2xl animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-brown-900">
              Assessment Harian berhasil disimpan dan skor ZYBA diperbarui!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            className="text-brown-700/60 hover:text-brown-900 text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 3. Crisis Alert ─────────────────────────────────────────── */}
      {crisisAlert && (
        <div className="rounded-2xl p-4 bg-orange-50 border border-orange-500/30 flex items-start gap-3 animate-in fade-in duration-300">
          <AlertCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold text-brown-900 mb-0.5">
              Kami mendengarmu
            </p>
            <p className="text-xs text-brown-700 leading-relaxed">
              Kamu tidak sendirian. Jika kamu butuh teman bicara darurat, hubungi{" "}
              <strong>Into The Light Indonesia di 119 ext 8</strong> (Hotline Kemenkes, 24 jam).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCrisisAlert(false)}
            className="text-brown-700/60 hover:text-brown-900 p-1"
            aria-label="Tutup"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── 4. Main Two-Column Layout ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
        {/* Left Column (Ritual / Form or Summary) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {pageState === "loading" && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-brown-900/10 animate-pulse flex flex-col gap-4">
              <div className="h-5 w-40 bg-cream rounded" />
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-cream rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {pageState === "form" && (
            <DailyAssessmentForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {pageState === "summary" && todayRecord && (
            <DailyAssessmentSummary record={todayRecord} />
          )}
        </div>

        {/* Right Column: Calendar & History */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
          <CalendarWidget moodEntries={calendarData} />
          <HistoryTabs
            assessment={
              <DailyAssessmentHistory
                history={history}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={isHistoryLoading}
              />
            }
            journal={<JournalHistory embedded journalList={journalList} />}
          />
        </div>
      </div>
    </div>
  );
}
