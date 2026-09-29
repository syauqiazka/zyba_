import { PrismaClient } from "../src/generated/account-client";

const databaseUrl =
    process.env.DATABASE_URL_ACCOUNT ||
    process.env.DIRECT_URL_ACCOUNT;

if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL_ACCOUNT / DIRECT_URL_ACCOUNT belum diset."
    );
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

const BADGES = [
    {
        key: "first_mood",
        name: "Mood Pertama",
        description: "Melakukan check-in mood untuk pertama kalinya.",
        category: "Wellness",
        icon: "Heart",
        xpReward: 10,
    },
    {
        key: "streak_3",
        name: "3 Hari Berturut",
        description: "Menjaga aktivitas wellness selama 3 hari berturut-turut.",
        category: "Streak",
        icon: "Flame",
        xpReward: 20,
    },
    {
        key: "streak_7",
        name: "7 Hari Berturut",
        description: "Menjaga aktivitas wellness selama 7 hari berturut-turut.",
        category: "Streak",
        icon: "Trophy",
        xpReward: 50,
    },
    {
        key: "first_companion",
        name: "Sapa ZYBA",
        description: "Mengirim pesan pertama kepada Companion ZYBA.",
        category: "Companion",
        icon: "MessageCircle",
        xpReward: 10,
    },
    {
        key: "first_community",
        name: "Penulis Pertama",
        description: "Membuat postingan pertama di Community.",
        category: "Sosial",
        icon: "Users",
        xpReward: 15,
    },
    {
        key: "journal_10",
        name: "10 Catatan Jiwa",
        description: "Membuat 10 catatan jurnal.",
        category: "Wellness",
        icon: "BookOpen",
        xpReward: 30,
    },
    {
        key: "first_breathing",
        name: "Napas Tenang",
        description: "Menyelesaikan latihan pernapasan pertama.",
        category: "Aktivitas",
        icon: "Wind",
        xpReward: 10,
    },
    {
        key: "deep_zen",
        name: "Deep Zen",
        description: "Menyelesaikan 5 latihan pernapasan.",
        category: "Spesial",
        icon: "Sparkles",
        xpReward: 40,
    },
    {
        key: "activity_first",
        name: "Langkah Pertama",
        description: "Menyelesaikan aktivitas fisik pertama.",
        category: "Aktivitas",
        icon: "Activity",
        xpReward: 10,
    },
];

async function main() {
    console.log("=== ZYBA BADGE SEED ===");

    for (const badge of BADGES) {
        const result = await prisma.badge.upsert({
            where: {
                key: badge.key,
            },
            update: {
                name: badge.name,
                description: badge.description,
                category: badge.category,
                icon: badge.icon,
                xpReward: badge.xpReward,
            },
            create: badge,
        });

        console.log(
            `OK  ${result.key} -> ${result.name}`
        );
    }

    const total = await prisma.badge.count();

    console.log("");
    console.log(`Total badge di database: ${total}`);
}

main()
    .catch((error) => {
        console.error("");
        console.error("BADGE SEED FAILED");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });