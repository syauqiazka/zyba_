// src/lib/assessmentMetrics.ts

export interface InitialAssessment {
    id?: string;
    createdAt?: string;

    initialMood?: string | null;
    stressLevel?: number | null;
    sleepQualityRating?: number | null;

    flaggedForRisk?: boolean;
}

export interface DailyAssessment {
    id?: string;
    date?: string;
    createdAt?: string;

    mood?: string | null;
    stressLevel?: number | null;
    sleepRating?: number | null;

    energyTags?: string[];
    reflection?: string | null;

    flaggedForRisk?: boolean;
}

function getTimestamp(
    item: InitialAssessment | DailyAssessment
) {
    return new Date(
        item.createdAt ?? 0
    ).getTime();
}

/**
 * Ambil sumber assessment sesuai tipe akun.
 *
 * AKUN BARU:
 * assessment awal + daily
 *
 * AKUN LAMA:
 * daily saja
 */
export function getAssessmentSources({
    isNewAccount,
    initialAssessment,
    dailyAssessments,
}: {
    isNewAccount: boolean;
    initialAssessment?: InitialAssessment | null;
    dailyAssessments: DailyAssessment[];
}) {
    const records: (
        | InitialAssessment
        | DailyAssessment
    )[] = [];

    if (
        isNewAccount &&
        initialAssessment
    ) {
        records.push(initialAssessment);
    }

    records.push(...dailyAssessments);

    return records.sort(
        (a, b) =>
            getTimestamp(b) -
            getTimestamp(a)
    );
}

/**
 * Zyba Score.
 *
 * Karena schema DailyAssessment saat ini
 * TIDAK punya zybaScore, dashboard menggunakan
 * nilai User.zybaScore yang dihitung/disimpan
 * oleh backend.
 */
export function getLatestZybaScore({
    userZybaScore,
    initialAssessment,
    dailyAssessments,
    isNewAccount,
}: {
    userZybaScore?: number | null;
    initialAssessment?: InitialAssessment | null;
    dailyAssessments: DailyAssessment[];
    isNewAccount: boolean;
}) {
    const sources = getAssessmentSources({
        isNewAccount,
        initialAssessment,
        dailyAssessments,
    });

    const hasAssessment =
        sources.length > 0 ||
        userZybaScore !== null &&
        userZybaScore !== undefined;

    return {
        score:
            userZybaScore ?? null,

        hasAssessment,

        latest:
            sources.length > 0
                ? sources[0]
                : null,
    };
}

/**
 * Stress minggu ini.
 *
 * Akun baru:
 * assessment awal + daily
 *
 * Akun lama:
 * daily saja
 */
export function getWeeklyStressData({
    isNewAccount,
    initialAssessment,
    dailyAssessments,
}: {
    isNewAccount: boolean;
    initialAssessment?: InitialAssessment | null;
    dailyAssessments: DailyAssessment[];
}) {
    const now = new Date();

    /**
     * Awal minggu = Senin.
     */
    const startOfWeek =
        new Date(now);

    startOfWeek.setHours(
        0,
        0,
        0,
        0
    );

    const day =
        startOfWeek.getDay();

    const diff =
        day === 0
            ? 6
            : day - 1;

    startOfWeek.setDate(
        startOfWeek.getDate() - diff
    );

    /**
     * Akhir minggu = Minggu.
     */
    const endOfWeek =
        new Date(startOfWeek);

    endOfWeek.setDate(
        endOfWeek.getDate() + 6
    );

    endOfWeek.setHours(
        23,
        59,
        59,
        999
    );

    /**
     * Daily selalu masuk.
     */
    const records: {
        date: string;
        stressLevel: number;
        createdAt?: string;
    }[] = [];

    dailyAssessments.forEach(
        (item) => {
            if (
                item.stressLevel === null ||
                item.stressLevel === undefined
            ) {
                return;
            }

            const date =
                item.createdAt
                    ? new Date(item.createdAt)
                    : item.date
                        ? new Date(item.date)
                        : null;

            if (!date) return;

            if (
                date >= startOfWeek &&
                date <= endOfWeek
            ) {
                records.push({
                    date: item.date ??
                        date.toISOString().slice(0, 10),

                    stressLevel:
                        Number(item.stressLevel),

                    createdAt:
                        item.createdAt,
                });
            }
        }
    );

    /**
     * Assessment awal hanya ikut untuk AKUN BARU.
     *
     * Hanya dimasukkan kalau tanggalnya
     * memang berada di minggu berjalan.
     */
    if (
        isNewAccount &&
        initialAssessment?.stressLevel !== null &&
        initialAssessment?.stressLevel !== undefined &&
        initialAssessment?.createdAt
    ) {
        const date =
            new Date(
                initialAssessment.createdAt
            );

        if (
            date >= startOfWeek &&
            date <= endOfWeek
        ) {
            records.push({
                date: date
                    .toISOString()
                    .slice(0, 10),

                stressLevel:
                    Number(
                        initialAssessment.stressLevel
                    ),

                createdAt:
                    initialAssessment.createdAt,
            });
        }
    }

    /**
     * Urutkan terbaru.
     */
    records.sort(
        (a, b) =>
            new Date(
                b.createdAt ?? b.date
            ).getTime() -
            new Date(
                a.createdAt ?? a.date
            ).getTime()
    );

    const dayNames = [
        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab",
        "Min",
    ];

    const days = dayNames.map(
        (dayName, index) => {
            const target =
                new Date(startOfWeek);

            target.setDate(
                startOfWeek.getDate() +
                index
            );

            const targetDate =
                target
                    .toISOString()
                    .slice(0, 10);

            /**
             * Kalau ada beberapa record
             * di tanggal yang sama, ambil
             * yang paling baru.
             */
            const record =
                records.find(
                    (item) =>
                        item.date === targetDate
                );

            return {
                day: dayName,
                date: targetDate,
                stressLevel:
                    record?.stressLevel ??
                    null,
            };
        }
    );

    const values =
        records.map(
            (item) =>
                item.stressLevel
        );

    const average =
        values.length > 0
            ? Number(
                (
                    values.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) / values.length
                ).toFixed(1)
            )
            : null;

    return {
        days,
        average,
        count: values.length,
    };
}