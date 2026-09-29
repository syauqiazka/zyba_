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

export const companionDb =
  globalForCompanionDb.companionDb ??
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
  globalForCompanionDb.companionDb = companionDb;
}