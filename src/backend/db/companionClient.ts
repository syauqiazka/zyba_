import { PrismaClient } from "@/generated/companion-client";

const globalForCompanionDb = globalThis as unknown as {
  companionDb?: PrismaClient;
};

const dbUrl =
  process.env.DATABASE_URL_COMPANION ||
  process.env.DIRECT_URL_COMPANION;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL_COMPANION / DIRECT_URL_COMPANION belum diset."
  );
}

function withPoolConfig(url: string, limit = 5): string {
  if (url.includes("connection_limit=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connection_limit=${limit}&pool_timeout=10`;
}

export const companionDb =
  globalForCompanionDb.companionDb ??
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

globalForCompanionDb.companionDb = companionDb;