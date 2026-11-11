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

/*
 * Ambil mood dari Daily Assessment.
 */
const moodOf = (r: any): string =>
    String(
        r?.mood ?? ""
    ).toUpperCase();

/*
 * Ambil tanggal record.
 */
const dateOf = (r: any): Date | null => {
    const raw =
        r?.createdAt ??
        r?.date ??
        r?.recordedAt;

    if (!raw) {
        return null;
    }

    const d = new Date(raw);

    return !isNaN(d.getTime())
        ? d
        : null;
};

/*
 * Ambil reflection / journal kalau tersedia.
 */
const noteOf = (r: any): string =>
    String(
        r?.note ??
        r?.notes ??
        r?.reflection ??
        r?.journal ??
        ""
    ).trim();

/*
 * Tanggal Jakarta YYYY-MM-DD.
 */
function getJakartaDateKey(
    date = new Date()
) {
    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).format(date);
}

export function useMoodOverview() {
    const [streak, setStreak] =
        useState(1);

    const [calendarData, setCalendarData] =
        useState<MoodDay[]>([]);

    const [journalList, setJournalList] =
        useState<JournalEntry[]>([]);

    const [todayMoodValue, setTodayMoodValue] =
        useState<string | null>(null);

    const reload = useCallback(
        async () => {
            try {
                const clientDate =
                    getJakartaDateKey();

                const [
                    userRes,
                    recordRes,
                ] = await Promise.all([
                    fetch(
                        "/api/user/me",
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        `/api/daily-assessment?page=1&limit=31&date=${clientDate}`,
                        {
                            cache: "no-store",
                        }
                    ),
                ]);

                /*
                 * ============================================
                 * STREAK
                 * ============================================
                 */
                if (userRes.ok) {
                    const userData =
                        await userRes.json();

                    if (
                        userData.stats?.streak !==
                        undefined
                    ) {
                        setStreak(
                            Number(
                                userData.stats.streak
                            )
                        );
                    }
                }

                /*
                 * ============================================
                 * DAILY ASSESSMENT
                 * ============================================
                 */
                if (!recordRes.ok) {
                    return;
                }

                const data =
                    await recordRes.json();

                /*
                 * today + history
                 *
                 * today biasanya adalah
                 * assessment terbaru hari ini.
                 */
                const records: any[] = [
                    ...(data.today
                        ? [data.today]
                        : []),

                    ...(Array.isArray(
                        data.history
                    )
                        ? data.history
                        : []),
                ];

                /*
                 * Hilangkan duplicate berdasarkan ID.
                 */
                const seenIds =
                    new Set<string>();

                const uniqueRecords: any[] =
                    [];

                for (const record of records) {
                    const id =
                        String(
                            record?.id ??
                            `${record?.date ?? ""}-${record?.createdAt ?? ""}`
                        );

                    if (
                        seenIds.has(id)
                    ) {
                        continue;
                    }

                    seenIds.add(id);
                    uniqueRecords.push(
                        record
                    );
                }

                /*
                 * Urutkan terbaru → terlama.
                 */
                uniqueRecords.sort(
                    (a, b) => {
                        const aDate =
                            dateOf(a);

                        const bDate =
                            dateOf(b);

                        return (
                            (bDate?.getTime() ??
                                0) -
                            (aDate?.getTime() ??
                                0)
                        );
                    }
                );

                /*
                 * ============================================
                 * MOOD HARI INI
                 * ============================================
                 */
                const todayRecord =
                    uniqueRecords.find(
                        (record) =>
                            record?.date ===
                            clientDate
                    );

                setTodayMoodValue(
                    todayRecord
                        ? moodOf(
                            todayRecord
                        ) || null
                        : data.today
                            ? moodOf(
                                data.today
                            ) || null
                            : null
                );

                /*
                 * ============================================
                 * KALENDER MOOD BULANAN
                 * ============================================
                 */
                const now =
                    new Date();

                const currentYear =
                    Number(
                        new Intl.DateTimeFormat(
                            "en-US",
                            {
                                timeZone:
                                    "Asia/Jakarta",
                                year: "numeric",
                            }
                        ).format(now)
                    );

                const currentMonth =
                    Number(
                        new Intl.DateTimeFormat(
                            "en-US",
                            {
                                timeZone:
                                    "Asia/Jakarta",
                                month: "2-digit",
                            }
                        ).format(now)
                    ) - 1;

                const seenDays =
                    new Set<number>();

                const days: MoodDay[] =
                    [];

                for (const record of uniqueRecords) {
                    const d =
                        dateOf(record);

                    const mood =
                        moodOf(record);

                    if (
                        !d ||
                        !mood
                    ) {
                        continue;
                    }

                    /*
                     * Konversi tanggal record
                     * ke tanggal Jakarta.
                     */
                    const parts =
                        new Intl.DateTimeFormat(
                            "en-US",
                            {
                                timeZone:
                                    "Asia/Jakarta",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                            }
                        ).formatToParts(d);

                    const year =
                        Number(
                            parts.find(
                                (p) =>
                                    p.type ===
                                    "year"
                            )?.value
                        );

                    const month =
                        Number(
                            parts.find(
                                (p) =>
                                    p.type ===
                                    "month"
                            )?.value
                        ) - 1;

                    const day =
                        Number(
                            parts.find(
                                (p) =>
                                    p.type ===
                                    "day"
                            )?.value
                        );

                    if (
                        year !==
                        currentYear ||
                        month !==
                        currentMonth
                    ) {
                        continue;
                    }

                    if (
                        seenDays.has(
                            day
                        )
                    ) {
                        continue;
                    }

                    seenDays.add(
                        day
                    );

                    days.push({
                        day,
                        mood,
                    });
                }

                setCalendarData(
                    days
                );

                /*
                 * ============================================
                 * HEALTH JOURNAL
                 * ============================================
                 *
                 * PENTING:
                 *
                 * Sekarang SEMUA Daily Assessment
                 * dimasukkan ke Health Journal.
                 *
                 * Reflection tetap digunakan
                 * kalau user mengisinya.
                 *
                 * Kalau kosong, kita tampilkan
                 * catatan otomatis.
                 */
                const journals: JournalEntry[] =
                    [];

                for (const record of uniqueRecords) {
                    const d =
                        dateOf(record);

                    if (!d) {
                        continue;
                    }

                    const id =
                        String(
                            record?.id ??
                            d.toISOString()
                        );

                    const moodValue =
                        moodOf(record);

                    const moodLabel =
                        (
                            MOODS.find(
                                (m) =>
                                    m.value === moodValue
                            )?.label ?? moodValue
                        ) || "Belum Ada Mood";

                    /*
                     * Reflection asli kalau ada.
                     */
                    const reflection =
                        noteOf(record);

                    /*
                     * Kalau reflection kosong,
                     * assessment tetap masuk Journal.
                     */
                    const content =
                        reflection ||
                        "Assessment harian selesai. Tidak ada catatan refleksi.";

                    journals.push({
                        id,

                        title:
                            "Assessment Harian",

                        content,

                        mood:
                            moodLabel,

                        date:
                            d.toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    timeZone:
                                        "Asia/Jakarta",
                                }
                            ),

                        flaggedForRisk:
                            Boolean(
                                record?.flaggedForRisk
                            ),
                    });

                    /*
                     * Maksimal 5 journal terbaru.
                     */
                    if (
                        journals.length >=
                        5
                    ) {
                        break;
                    }
                }

                setJournalList(
                    journals
                );
            } catch (error) {
                console.error(
                    "[useMoodOverview] Failed to load:",
                    error
                );

                /*
                 * Jangan merusak UI ketika
                 * API gagal.
                 */
            }
        },
        []
    );

    useEffect(() => {
        reload();
    }, [reload]);

    const selectedMood =
        MOODS.find(
            (m) =>
                m.value ===
                todayMoodValue
        ) ??
        MOODS[3];

    return {
        selectedMood,
        streak,
        calendarData,
        journalList,
        reload,
    };
}