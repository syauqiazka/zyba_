// src/lib/assessmentMetrics.ts

export interface InitialAssessment {
    id?: string;
    createdAt?: string;

    initialMood?: string | null;
    stressLevel?: number | null;
    sleepQualityRating?: number | null;

    flaggedForRisk?: boolean;

    calculatedScore?: number | null;
    zybaScore?: number | null;
    score?: number | null;

    condition?: string | null;
}

export interface DailyAssessment {
    id?: string;
    date?: string;
    createdAt?: string;

    mood?: string | null;
    stressLevel?: number | null;
    anxietyLevel?: number | null;
    satisfactionLevel?: number | null;
    productivityLevel?: number | null;
    meTimeLevel?: number | null;

    sleepRating?: number | null;
    sleepHours?: number | string | null;
    energyLevel?: number | null;
    eatingHabit?: number | null;
    physicalActivity?: number | null;

    socialConnection?: number | null;
    socialSupport?: number | null;
    communityInteraction?: number | null;

    energyTags?: string[];
    gratitude?: string | null;
    reflection?: string | null;

    goal?: string | null;
    gender?: string | null;
    age?: string | null;
    weight?: string | null;

    soughtHelp?: boolean | null;
    physicalSymptoms?: string[];
    mentalSymptoms?: string[];
    medications?: string | null;

    flaggedForRisk?: boolean;

    calculatedScore?: number | null;
    zybaScore?: number | null;
    score?: number | null;

    condition?: string | null;
}

export type AssessmentMetric =
    | InitialAssessment
    | DailyAssessment;

/* =====================================================
   TIMESTAMP
===================================================== */

function getTimestamp(
    item: AssessmentMetric
): number {
    if (item.createdAt) {
        const time =
            new Date(
                item.createdAt
            ).getTime();

        if (Number.isFinite(time)) {
            return time;
        }
    }

    if (
        "date" in item &&
        item.date
    ) {
        const time =
            new Date(
                `${item.date}T00:00:00+07:00`
            ).getTime();

        if (Number.isFinite(time)) {
            return time;
        }
    }

    return 0;
}

/* =====================================================
   NORMALIZE SCORE
===================================================== */

function normalizeScore(
    value: unknown
): number | null {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const score =
        Number(value);

    if (
        !Number.isFinite(score)
    ) {
        return null;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(score)
        )
    );
}

/* =====================================================
   SCORE YANG SUDAH TERSIMPAN
===================================================== */

function getStoredScore(
    item: AssessmentMetric
): number | null {
    return normalizeScore(
        item.calculatedScore ??
        item.zybaScore ??
        item.score
    );
}

/* =====================================================
   HELPER ANGKA
===================================================== */

function numberOrNull(
    value: unknown
): number | null {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const result =
        Number(value);

    return Number.isFinite(
        result
    )
        ? result
        : null;
}

/* =====================================================
   HITUNG SCORE DAILY ASSESSMENT
 *
 * Rumus HARUS sama dengan DailyAssessmentForm:
 *
 * Mental = 50%
 * Fisik  = 25%
 * Sosial = 25%
===================================================== */

export function calculateDailyZybaScore(
    item: DailyAssessment
): number | null {
    /*
     * Kalau backend sudah menyimpan score,
     * pakai score tersebut.
     */
    const storedScore =
        getStoredScore(item);

    if (
        storedScore !== null
    ) {
        return storedScore;
    }

    /*
     * ===================================================
     * MENTAL
     * ===================================================
     */

    const moodMap: Record<
        string,
        number
    > = {
        DEPRESSED: 1,
        SAD: 2,
        NEUTRAL: 3,
        HAPPY: 4,
        OVERJOYED: 5,
    };

    const moodValue =
        moodMap[
        String(
            item.mood ?? ""
        ).toUpperCase()
        ] ?? 3;

    const moodScore =
        ((moodValue - 1) / 4) *
        100;

    const stress =
        numberOrNull(
            item.stressLevel
        );

    const anxiety =
        numberOrNull(
            item.anxietyLevel
        );

    const satisfaction =
        numberOrNull(
            item.satisfactionLevel
        );

    const productivity =
        numberOrNull(
            item.productivityLevel
        );

    const meTime =
        numberOrNull(
            item.meTimeLevel
        );

    /*
     * Kalau data inti mental belum ada,
     * belum bisa menghitung score dari record.
     */
    if (
        stress === null ||
        anxiety === null ||
        satisfaction === null ||
        productivity === null ||
        meTime === null
    ) {
        return null;
    }

    const stressScore =
        ((5 - stress) / 4) *
        100;

    const anxietyScore =
        ((5 - anxiety) / 4) *
        100;

    const satisfactionScore =
        ((satisfaction - 1) / 4) *
        100;

    const productivityScore =
        ((productivity - 1) / 4) *
        100;

    const meTimeScore =
        ((meTime - 1) / 4) *
        100;

    const mental =
        Math.round(
            (
                moodScore +
                stressScore +
                anxietyScore +
                satisfactionScore +
                productivityScore +
                meTimeScore
            ) / 6
        );

    /*
     * ===================================================
     * FISIK
     * ===================================================
     */

    const sleepRating =
        numberOrNull(
            item.sleepRating
        );

    const sleepHoursRaw =
        item.sleepHours;

    const sleepHours =
        numberOrNull(
            sleepHoursRaw
        );

    const energyLevel =
        numberOrNull(
            item.energyLevel
        );

    const eatingHabit =
        numberOrNull(
            item.eatingHabit
        );

    const physicalActivity =
        numberOrNull(
            item.physicalActivity
        );

    if (
        sleepRating === null ||
        sleepHours === null ||
        energyLevel === null ||
        eatingHabit === null ||
        physicalActivity === null
    ) {
        return null;
    }

    const sleepScore =
        ((sleepRating - 1) / 4) *
        100;

    /*
     * SAMA persis dengan DailyAssessmentForm.
     */
    const sleepHoursScore =
        sleepHours === 4
            ? 100
            : sleepHours === 3
                ? 85
                : sleepHours === 5
                    ? 80
                    : sleepHours === 2
                        ? 55
                        : 30;

    const energyScore =
        ((energyLevel - 1) / 4) *
        100;

    const eatingScore =
        ((eatingHabit - 1) / 4) *
        100;

    const activityScore =
        ((physicalActivity - 1) / 4) *
        100;

    const fisik =
        Math.round(
            (
                sleepScore +
                sleepHoursScore +
                energyScore +
                eatingScore +
                activityScore
            ) / 5
        );

    /*
     * ===================================================
     * SOSIAL
     * ===================================================
     */

    const socialConnection =
        numberOrNull(
            item.socialConnection
        );

    const socialSupport =
        numberOrNull(
            item.socialSupport
        );

    const communityInteraction =
        numberOrNull(
            item.communityInteraction
        );

    if (
        socialConnection === null ||
        socialSupport === null ||
        communityInteraction === null
    ) {
        return null;
    }

    const connectionScore =
        ((socialConnection - 1) /
            4) *
        100;

    const supportScore =
        ((socialSupport - 1) / 4) *
        100;

    const communityScore =
        ((communityInteraction -
            1) /
            4) *
        100;

    const sosial =
        Math.round(
            (
                connectionScore +
                supportScore +
                communityScore
            ) / 3
        );

    /*
     * ===================================================
     * FINAL ZYBA SCORE
     * ===================================================
     */

    const zyba =
        Math.round(
            mental * 0.5 +
            fisik * 0.25 +
            sosial * 0.25
        );

    return Math.min(
        100,
        Math.max(
            0,
            zyba
        )
    );
}

/* =====================================================
   GET SCORE ASSESSMENT
===================================================== */

function getAssessmentScore(
    item: AssessmentMetric
): number | null {
    /*
     * Daily Assessment
     */
    if (
        "mood" in item
    ) {
        return calculateDailyZybaScore(
            item
        );
    }

    /*
     * Initial Assessment
     */
    return getStoredScore(
        item
    );
}

/* =====================================================
   SOURCES
===================================================== */

export function getAssessmentSources({
    isNewAccount,
    initialAssessment,
    dailyAssessments,
}: {
    isNewAccount: boolean;

    initialAssessment?:
    | InitialAssessment
    | null;

    dailyAssessments:
    DailyAssessment[];
}) {
    const records: AssessmentMetric[] =
        [];

    /*
     * Assessment awal hanya untuk
     * akun baru.
     */
    if (
        isNewAccount &&
        initialAssessment
    ) {
        records.push(
            initialAssessment
        );
    }

    /*
     * Daily selalu masuk.
     */
    records.push(
        ...dailyAssessments
    );

    /*
     * Terbaru → terlama.
     */
    return records.sort(
        (a, b) =>
            getTimestamp(b) -
            getTimestamp(a)
    );
}

/* =====================================================
   GET LATEST ZYBA SCORE
===================================================== */

export function getLatestZybaScore({
    userZybaScore,
    initialAssessment,
    dailyAssessments,
    isNewAccount,
}: {
    userZybaScore?: number | null;

    initialAssessment?:
    | InitialAssessment
    | null;

    dailyAssessments:
    DailyAssessment[];

    isNewAccount: boolean;
}) {
    /*
     * Urutkan daily terbaru.
     */
    const sortedDaily =
        [...dailyAssessments].sort(
            (a, b) =>
                getTimestamp(b) -
                getTimestamp(a)
        );

    /*
     * ===================================================
     * PRIORITAS 1:
     * DAILY TERBARU
     * ===================================================
     */
    for (
        const daily of sortedDaily
    ) {
        const score =
            calculateDailyZybaScore(
                daily
            );

        if (
            score !== null
        ) {
            return {
                score,

                hasAssessment:
                    true,

                latest:
                    daily,

                latestScored:
                    daily,
            };
        }
    }

    /*
     * ===================================================
     * PRIORITAS 2:
     * ASSESSMENT AWAL
     * ===================================================
     */
    if (
        isNewAccount &&
        initialAssessment
    ) {
        const initialScore =
            getAssessmentScore(
                initialAssessment
            );

        if (
            initialScore !== null
        ) {
            return {
                score:
                    initialScore,

                hasAssessment:
                    true,

                latest:
                    initialAssessment,

                latestScored:
                    initialAssessment,
            };
        }
    }

    /*
     * ===================================================
     * PRIORITAS 3:
     * USER SCORE LAMA
     * ===================================================
     *
     * Hanya fallback kalau assessment
     * belum menyediakan data score.
     */
    const fallback =
        normalizeScore(
            userZybaScore
        );

    return {
        score:
            fallback,

        hasAssessment:
            sortedDaily.length > 0 ||
            Boolean(
                initialAssessment
            ) ||
            fallback !== null,

        latest:
            sortedDaily[0] ??
            initialAssessment ??
            null,

        latestScored:
            null,
    };
}

/* =====================================================
   WEEKLY STRESS
===================================================== */

export function getWeeklyStressData({
    isNewAccount,
    initialAssessment,
    dailyAssessments,
}: {
    isNewAccount: boolean;

    initialAssessment?:
    | InitialAssessment
    | null;

    dailyAssessments:
    DailyAssessment[];
}) {
    const now =
        new Date();

    const jakartaNow =
        new Date(
            now.toLocaleString(
                "en-US",
                {
                    timeZone:
                        "Asia/Jakarta",
                }
            )
        );

    const startOfWeek =
        new Date(
            jakartaNow
        );

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
        startOfWeek.getDate() -
        diff
    );

    const endOfWeek =
        new Date(
            startOfWeek
        );

    endOfWeek.setDate(
        endOfWeek.getDate() +
        6
    );

    endOfWeek.setHours(
        23,
        59,
        59,
        999
    );

    const records: {
        date: string;
        stressLevel: number;
        createdAt?: string;
    }[] = [];

    dailyAssessments.forEach(
        (item) => {
            if (
                item.stressLevel ===
                null ||
                item.stressLevel ===
                undefined
            ) {
                return;
            }

            const timestamp =
                getTimestamp(item);

            if (
                timestamp === 0
            ) {
                return;
            }

            const date =
                new Date(
                    timestamp
                );

            const jakartaDate =
                new Intl.DateTimeFormat(
                    "en-CA",
                    {
                        timeZone:
                            "Asia/Jakarta",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }
                ).format(date);

            const target =
                new Date(
                    `${jakartaDate}T00:00:00`
                );

            if (
                target < startOfWeek ||
                target > endOfWeek
            ) {
                return;
            }

            records.push({
                date:
                    jakartaDate,

                stressLevel:
                    Number(
                        item.stressLevel
                    ),

                createdAt:
                    item.createdAt,
            });
        }
    );

    /*
     * Assessment awal hanya untuk akun baru.
     */
    if (
        isNewAccount &&
        initialAssessment?.stressLevel !==
        null &&
        initialAssessment?.stressLevel !==
        undefined &&
        initialAssessment?.createdAt
    ) {
        const date =
            new Date(
                initialAssessment.createdAt
            );

        const jakartaDate =
            new Intl.DateTimeFormat(
                "en-CA",
                {
                    timeZone:
                        "Asia/Jakarta",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }
            ).format(date);

        const target =
            new Date(
                `${jakartaDate}T00:00:00`
            );

        if (
            target >=
            startOfWeek &&
            target <=
            endOfWeek
        ) {
            records.push({
                date:
                    jakartaDate,

                stressLevel:
                    Number(
                        initialAssessment.stressLevel
                    ),

                createdAt:
                    initialAssessment.createdAt,
            });
        }
    }

    /*
     * Terbaru dulu.
     */
    records.sort(
        (a, b) =>
            new Date(
                b.createdAt ??
                `${b.date}T00:00:00+07:00`
            ).getTime() -
            new Date(
                a.createdAt ??
                `${a.date}T00:00:00+07:00`
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

    const days =
        dayNames.map(
            (
                dayName,
                index
            ) => {
                const target =
                    new Date(
                        startOfWeek
                    );

                target.setDate(
                    startOfWeek.getDate() +
                    index
                );

                const targetDate =
                    target
                        .toISOString()
                        .slice(
                            0,
                            10
                        );

                const record =
                    records.find(
                        (item) =>
                            item.date ===
                            targetDate
                    );

                return {
                    day:
                        dayName,

                    date:
                        targetDate,

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
                        (
                            sum,
                            value
                        ) =>
                            sum + value,
                        0
                    ) /
                    values.length
                ).toFixed(1)
            )
            : null;

    return {
        days,
        average,
        count:
            values.length,
    };
}