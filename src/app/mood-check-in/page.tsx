"use client";

import React, { useState, useEffect } from "react";
import { detectRisk } from "@/lib/crisisDetection";
import MoodBanner from "./components/MoodBanner";
import MoodSelectorForm, { MOODS, SLEEP_OPTIONS } from "./components/MoodSelectorForm";
import CalendarWidget from "./components/CalendarWidget";
import JournalHistory from "./components/JournalHistory";
import CrisisAlertModal from "./components/CrisisAlertModal";

interface MoodDay {
  day: number;
  mood: string | null;
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
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number]>(MOODS[3]); // Happy default
  const [stressRating, setStressRating] = useState<number>(2);
  const [sleepRating, setSleepRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalList, setJournalList] = useState<JournalEntry[]>([]); // Load dari API, mulai kosong
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [userStreak, setUserStreak] = useState(1);
  const [moodCalendarData, setMoodCalendarData] = useState<MoodDay[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, moodRes, journalRes] = await Promise.all([
          fetch("/api/user/me"),
          fetch("/api/mood"),
          fetch("/api/journal"),
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          if (data.stats?.streak) setUserStreak(data.stats.streak);
        }

        if (moodRes.ok) {
          const data = await moodRes.json();
          const now = new Date();
          const thisYear = now.getFullYear();
          const thisMonth = now.getMonth();

          // Map API entries to { day, mood } for current month only
          const calendarDays: MoodDay[] = (data.entries ?? []).flatMap(
            (entry: { createdAt: string; mood: string }) => {
              const d = new Date(entry.createdAt);
              if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
                return [{ day: d.getDate(), mood: entry.mood }];
              }
              return [];
            }
          );

          // Deduplicate — keep latest entry per day (entries are desc-ordered)
          const seen = new Set<number>();
          const unique = calendarDays.filter(({ day }) => {
            if (seen.has(day)) return false;
            seen.add(day);
            return true;
          });

          setMoodCalendarData(unique);
        }

        if (journalRes.ok) {
          const data = await journalRes.json();
          if (data.entries && data.entries.length > 0) {
            // Map API journal entries to local JournalEntry format
            const apiEntries: JournalEntry[] = data.entries.map(
              (e: { id: string; title: string; content: string; mood: string; createdAt: string }) => ({
                id: e.id,
                title: e.title || "Catatan",
                content: e.content,
                mood: e.mood || "NEUTRAL",
                date: new Date(e.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              })
            );
            setJournalList(apiEntries);
          }
        }
      } catch (err) {
        // Fallback silently — journal list stays empty
      }
    }
    loadData();
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveCheckIn = () => {
    const isRisk = journalContent ? detectRisk(journalContent) : false;
    if (isRisk) {
      setCrisisAlert(true);
    }

    // Format metadata info from sleep and energy tags
    const metaParts: string[] = [];
    if (sleepRating !== null) {
      const sleepOpt = SLEEP_OPTIONS.find((o) => o.rating === sleepRating);
      metaParts.push(`Tidur: ${sleepOpt?.label || sleepRating + "/5"}${sleepOpt ? ` (${sleepOpt.desc})` : ""}`);
    }
    if (selectedTags.length > 0) {
      metaParts.push(`Kondisi: ${selectedTags.join(", ")}`);
    }

    const metaSummary = metaParts.length > 0 ? `[${metaParts.join(" • ")}]` : "";
    const noteForMood = metaSummary
      ? (journalContent ? `${metaSummary}\n\n${journalContent}` : metaSummary)
      : journalContent;

    // 1. Simpan ke /api/mood
    fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: selectedMood.value,
        stressLevel: stressRating,
        note: noteForMood || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.risk) setCrisisAlert(true);
      })
      .catch((err) => console.warn("Mood API sync error:", err));

    // 2. Simpan ke /api/journal jika ada catatan atau judul atau tag
    if (journalTitle.trim() || journalContent.trim() || metaParts.length > 0) {
      const titleToSave = journalTitle.trim() || `Mood Check-In (${selectedMood.label})`;
      const contentToSave = journalContent.trim()
        ? (metaSummary ? `${metaSummary}\n\n${journalContent.trim()}` : journalContent.trim())
        : metaSummary || "Check-in harian.";

      const newEntry: JournalEntry = {
        id: `j-${Date.now()}`,
        title: titleToSave,
        content: contentToSave,
        mood: selectedMood.value,
        date: "Hari Ini",
        flaggedForRisk: isRisk,
      };

      setJournalList([newEntry, ...journalList]);

      fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEntry.title,
          content: newEntry.content,
          mood: newEntry.mood,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isRisk) setCrisisAlert(true);
        })
        .catch((err) => console.warn("Journal API sync warning:", err));
    }

    // 3. Update Kalender secara langsung untuk hari ini
    const todayNum = new Date().getDate();
    setMoodCalendarData((prev) => {
      const filtered = prev.filter((d) => d.day !== todayNum);
      return [{ day: todayNum, mood: selectedMood.value }, ...filtered];
    });

    // 4. Update cache local storage
    try {
      const cached = localStorage.getItem("zyba_user_cache");
      const parsed = cached ? JSON.parse(cached) : {};
      const newStreak = userStreak;
      localStorage.setItem(
        "zyba_user_cache",
        JSON.stringify({
          ...parsed,
          stats: {
            ...parsed.stats,
            stressLevel: stressRating,
            streak: newStreak,
          },
        })
      );
    } catch {}

    setJournalTitle("");
    setJournalContent("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <MoodBanner selectedMood={selectedMood} streak={userStreak} />

      {/* Main Grid: Mood Selector & Stress Rating Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Mood, Stress, Sleep, Energy Tags, & Journal Input */}
        <MoodSelectorForm
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          stressRating={stressRating}
          setStressRating={setStressRating}
          sleepRating={sleepRating}
          setSleepRating={setSleepRating}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          journalTitle={journalTitle}
          setJournalTitle={setJournalTitle}
          journalContent={journalContent}
          setJournalContent={setJournalContent}
          savedSuccess={savedSuccess}
          onSave={handleSaveCheckIn}
        />

        {/* Right Panel: Calendar & Journal History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CalendarWidget moodEntries={moodCalendarData} />
          <JournalHistory journalList={journalList} />
        </div>
      </div>

      <CrisisAlertModal isOpen={crisisAlert} onClose={() => setCrisisAlert(false)} />
    </div>
  );
}
