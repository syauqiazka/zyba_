import { PrismaClient } from "@/generated/community-client";

const globalForCommunityDb = globalThis as unknown as {
  communityDb?: PrismaClient;
};

const dbUrl =
  process.env.DATABASE_URL_COMMUNITY ||
  process.env.DIRECT_URL_COMMUNITY ||
  "postgresql://postgres:postgres@localhost:5432/zyba_community";

function withPoolConfig(url: string, limit = 10): string {
  if (url.includes("connection_limit=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  // pgbouncer=true enables Prisma's PgBouncer compatibility mode (needed for Neon pooler)
  const pgbouncer = url.includes("pgbouncer") ? "" : "&pgbouncer=true";
  return `${url}${sep}connection_limit=${limit}&pool_timeout=15${pgbouncer}`;
}

export const communityDb =
  globalForCommunityDb.communityDb ??
  new PrismaClient({
    datasources: {
      db: {
        url: withPoolConfig(dbUrl, 10),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

globalForCommunityDb.communityDb = communityDb;