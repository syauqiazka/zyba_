import { PrismaClient } from "@/generated/community-client";

const g = globalThis as unknown as { communityDb: PrismaClient | undefined };

const dbUrl =
  process.env.DATABASE_URL_COMMUNITY ||
  process.env.DIRECT_URL_COMMUNITY ||
  process.env.DATABASE_URL;

export const communityDb =
  g.communityDb ??
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: { url: dbUrl },
          },
        }
      : undefined
  );

g.communityDb = communityDb;

