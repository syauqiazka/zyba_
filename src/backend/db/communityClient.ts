import { PrismaClient } from "@/generated/community-client";

const globalForCommunityDb = globalThis as unknown as {
  communityDb?: PrismaClient;
};

const dbUrl =
  process.env.DATABASE_URL_COMMUNITY ||
  process.env.DIRECT_URL_COMMUNITY;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL_COMMUNITY / DIRECT_URL_COMMUNITY belum diset."
  );
}

export const communityDb =
  globalForCommunityDb.communityDb ??
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
  globalForCommunityDb.communityDb = communityDb;
}