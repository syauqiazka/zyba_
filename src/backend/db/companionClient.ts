import { PrismaClient } from "@/generated/companion-client";

const g = globalThis as unknown as { companionDb: PrismaClient | undefined };

const dbUrl =
  process.env.DATABASE_URL_COMPANION ||
  process.env.DIRECT_URL_COMPANION ||
  process.env.DATABASE_URL;

export const companionDb =
  g.companionDb ??
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: { url: dbUrl },
          },
        }
      : undefined
  );

g.companionDb = companionDb;

