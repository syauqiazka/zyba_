import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "shinomiya@zyba.app" },
    update: {},
    create: {
      email: "shinomiya@zyba.app",
      passwordHash: "demo-hash-ganti-dengan-bcrypt-asli",
      name: "Shinomiya",
      zybaScore: 80,
      onboardingCompleted: true,
      plan: "FREE",
      notificationPref: {
        create: { companionNotif: true, wellnessNotif: true, communityNotif: false },
      },
    },
  });

  await prisma.moodEntry.createMany({
    data: [
      { userId: user.id, mood: "NEUTRAL" },
      { userId: user.id, mood: "HAPPY" },
      { userId: user.id, mood: "SAD" },
    ],
  });

  console.log("Seed selesai untuk user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
