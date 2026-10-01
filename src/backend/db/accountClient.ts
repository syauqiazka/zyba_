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

function withPoolConfig(url: string, limit = 5): string {
  if (url.includes("connection_limit=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connection_limit=${limit}&pool_timeout=10`;
}

export const accountDb =
  globalForAccountDb.accountDb ??
  new PrismaClient({
    datasources: {
      db: {
        url: withPoolConfig(dbUrl, 5),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

globalForAccountDb.accountDb = accountDb;