"use client";

import { useCallback, useEffect, useState } from "react";
import { MOODS } from "@/lib/moods";

export interface MoodDay {
    day: number;
    mood: string | null;
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    mood: string;
    date: string;
    flaggedForRisk?: boolean;
}

// Satu-satunya bagian yang bergantung pada nama field DailyRecord.
// Kalau nama field di API beda, cukup ubah tiga fungsi ini.
const moodOf = (r: any): string => String(r?.mood ?? "").toUpperCase();

const dateOf = (r: any): Date | null => {
    const raw = r?.createdAt ?? r?.date ?? r?.recordedAt;
    const d = raw ? new Date(raw) : null;
    return d && !isNaN(d.getTime()) ? d : null;
};

const noteOf = (r: any): string =>
    String(r?.note ?? r?.notes ?? r?.reflection ?? r?.journal ?? "").trim();

export function useMoodOverview() {
    const [streak, setStreak] = useState(1);
    const [calendarData, setCalendarData] = useState<MoodDay[]>([]);
    const [journalList, setJournalList] = useState<JournalEntry[]>([]);
    const [todayMoodValue, setTodayMoodValue] = useState<string | null>(null);

    const reload = useCallback(async () => {
        try {
            const [userRes, recordRes] = await Promise.all([
                fetch("/api/user/me"),
                fetch("/api/daily-assessment?page=1&limit=31"),
            ]);

            if (userRes.ok) {
                const data = await userRes.json();
                if (data.stats?.streak) setStreak(data.stats.streak);
            }

            if (!recordRes.ok) return;
            const data = await recordRes.json();

            // Sumbernya sama dengan "Ringkasan Hari Ini": today + history
            const records: any[] = [...(data.today ? [data.today] : []), ...(data.history ?? [])];
            const now = new Date();

            setTodayMoodValue(data.today ? moodOf(data.today) || null : null);

            // Kalender: satu mood per hari untuk bulan berjalan
            const seenDays = new Set<number>();
            const days: MoodDay[] = [];
            for (const r of records) {
                const d = dateOf(r);
                const mood = moodOf(r);
                if (!d || !mood) continue;
                if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) continue;
                if (seenDays.has(d.getDate())) continue;
                seenDays.add(d.getDate());
                days.push({ day: d.getDate(), mood });
            }
            setCalendarData(days);

            // Riwayat jurnal: 5 record terakhir yang punya catatan
            const seenIds = new Set<string>();
            const journals: JournalEntry[] = [];
            for (const r of records) {
                const d = dateOf(r);
                const content = noteOf(r);
                if (!d || !content) continue;
                const id = String(r.id ?? d.toISOString());
                if (seenIds.has(id)) continue;
                seenIds.add(id);
                journals.push({
                    id,
                    title: "Assessment Harian",
                    content,
                    mood: MOODS.find((m) => m.value === moodOf(r))?.label ?? moodOf(r),
                    date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
                });
                if (journals.length === 5) break;
            }
            setJournalList(journals);
        } catch {
            // UI tetap tampil dengan data kosong
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const selectedMood = MOODS.find((m) => m.value === todayMoodValue) ?? MOODS[3];

    return { selectedMood, streak, calendarData, journalList, reload };
}