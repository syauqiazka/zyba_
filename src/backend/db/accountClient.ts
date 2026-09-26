import { PrismaClient } from "@/generated/account-client";

const g = globalThis as unknown as { accountDb: PrismaClient | undefined };

const dbUrl =
  process.env.DATABASE_URL_ACCOUNT ||
  process.env.DIRECT_URL_ACCOUNT ||
  process.env.DATABASE_URL;

export const accountDb =
  g.accountDb ??
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: { url: dbUrl },
          },
        }
      : undefined
  );

g.accountDb = accountDb;

