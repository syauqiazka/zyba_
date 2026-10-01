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

function withPoolConfig(url: string, limit = 5): string {
  if (url.includes("connection_limit=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connection_limit=${limit}&pool_timeout=10`;
}

export const communityDb =
  globalForCommunityDb.communityDb ??
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

globalForCommunityDb.communityDb = communityDb;