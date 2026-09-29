import { PrismaClient } from "@/generated/account-client";

const globalForAccountDb = globalThis as unknown as {
  accountDb?: PrismaClient;
};

const dbUrl =
  process.env.DATABASE_URL_ACCOUNT ||
  process.env.DIRECT_URL_ACCOUNT;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL_ACCOUNT / DIRECT_URL_ACCOUNT belum diset."
  );
}

export const accountDb =
  globalForAccountDb.accountDb ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForAccountDb.accountDb = accountDb;
}