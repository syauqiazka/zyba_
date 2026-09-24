"use client";

import React, { useState, useEffect } from "react";
import { detectRisk } from "@/lib/crisisDetection";
import QuickCheckInForm, { MOODS } from "./components/MoodSelectorForm";
import CalendarWidget from "./components/CalendarWidget";
import JournalHistory from "./components/JournalHistory";
import MoodBanner from "./components/MoodBanner";
import CrisisAlertModal from "./components/CrisisAlertModal";

interface MoodDay {
  day: number;
  mood: string | null;
}

interface MoodEntryItem {
  id: string;
  mood: string;
  stressLevel?: number | null;
  note?: string | null;
  createdAt: string;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  flaggedForRisk?: boolean;
}

export default function MoodCheckInPage() {
  // --- Form state (simplified: mood + optional stress + optional note) ---
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number]>(MOODS[3]); // Happy default
  const [stressRating, setStressRating] = useState<number>(2);
  const [note, setNote] = useState("");

  // --- UI state ---
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  // --- Data state ---
  const [userStreak, setUserStreak] = useState(1);
  const [moodCalendarData, setMoodCalendarData] = useState<MoodDay[]>([]);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, moodRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/mood"),
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          if (data.stats?.streak) setUserStreak(data.stats.streak);
        }

        if (moodRes.ok) {
          const data = await moodRes.json();
          setHasCheckedInToday(!!data.hasCheckedInToday);
          if (data.todayEntry) {
            setTodayEntry(data.todayEntry);
            const matchedMood = MOODS.find((m) => m.value === data.todayEntry.mood);
            if (matchedMood) setSelectedMood(matchedMood);
            if (data.todayEntry.stressLevel) setStressRating(data.todayEntry.stressLevel);
            if (data.todayEntry.note) setNote(data.todayEntry.note);
          }

          const now = new Date();
          const thisYear = now.getFullYear();
          const thisMonth = now.getMonth();

          // Build calendar data for current month
          const calendarDays: MoodDay[] = (data.entries ?? []).flatMap(
            (entry: MoodEntryItem) => {
              const d = new Date(entry.createdAt);
              if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
                return [{ day: d.getDate(), mood: entry.mood }];
              }
              return [];
            }
          );

          // Deduplicate — keep latest per day
          const seen = new Set<number>();
          const unique = calendarDays.filter(({ day }) => {
            if (seen.has(day)) return false;
            seen.add(day);
            return true;
          });
          setMoodCalendarData(unique);

          // Build recent entries for history panel (last 5 with notes)
          const withNotes: JournalEntry[] = (data.entries ?? [])
            .filter((e: MoodEntryItem) => e.note)
            .slice(0, 5)
            .map((e: MoodEntryItem) => ({
              id: e.id,
              title: `Mood Check-In`,
              content: e.note || "",
              mood: e.mood,
              date: new Date(e.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }));
          setRecentEntries(withNotes);
        }
      } catch {
        // Silently fail — UI degrades gracefully
      }
    }
    loadData();
  }, []);

  const handleSaveCheckIn = async () => {
    if (hasCheckedInToday) return;

    // Client-side crisis detection before sending
    const isRisk = note ? detectRisk(note) : false;
    if (isRisk) setCrisisAlert(true);

    setIsSaving(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood.value,
          stressLevel: stressRating,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.hasCheckedInToday) {
          setHasCheckedInToday(true);
        }
        throw new Error(data.error || "Gagal mencatat mood");
      }

      if (data.risk) setCrisisAlert(true);
      setHasCheckedInToday(true);
      setTodayEntry(data.entry);

      // Update calendar optimistically
      const todayNum = new Date().getDate();
      setMoodCalendarData((prev) => {
        const filtered = prev.filter((d) => d.day !== todayNum);
        return [{ day: todayNum, mood: selectedMood.value }, ...filtered];
      });

      // Add to recent entries if there's a note
      if (note.trim()) {
        const newEntry: JournalEntry = {
          id: `j-${Date.now()}`,
          title: "Mood Check-In",
          content: note.trim(),
          mood: selectedMood.value,
          date: "Hari ini",
          flaggedForRisk: isRisk,
        };
        setRecentEntries((prev) => [newEntry, ...prev].slice(0, 5));
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      console.warn("Mood check-in error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Banner */}
      <MoodBanner selectedMood={selectedMood} streak={userStreak} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Check-In Form */}
        <div className="lg:col-span-7">
          <QuickCheckInForm
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            stressRating={stressRating}
            setStressRating={setStressRating}
            note={note}
            setNote={setNote}
            onSave={handleSaveCheckIn}
            savedSuccess={savedSuccess}
            isSaving={isSaving}
            hasCheckedInToday={hasCheckedInToday}
            todayEntry={todayEntry}
          />
        </div>

        {/* Right: Calendar & Recent Entries */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CalendarWidget moodEntries={moodCalendarData} />
          <JournalHistory journalList={recentEntries} />
        </div>
      </div>

      {/* Crisis Modal */}
      <CrisisAlertModal isOpen={crisisAlert} onClose={() => setCrisisAlert(false)} />
    </div>
  );
}
