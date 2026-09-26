// Backward-compat: re-export accountDb as `prisma` so existing imports keep working.
// New code: import directly from accountClient / companionClient / communityClient.
import { PrismaClient } from "@/generated/account-client";

const globalForPrisma = globalThis as unknown as {
  accountDb: PrismaClient | undefined;
};

export const accountDb =
  globalForPrisma.accountDb ??
  new PrismaClient({
    log: ["error"],
  });

globalForPrisma.accountDb = accountDb;

export const prisma = accountDb;

let isDbOnline = true;
let lastDbCheck = 0;
const DB_RETRY_INTERVAL_MS = 30000;

export async function runWithPrisma<T>(queryFn: () => Promise<T>, timeoutMs = 250): Promise<T | null> {
  const now = Date.now();
  if (!isDbOnline && now - lastDbCheck < DB_RETRY_INTERVAL_MS) {
    return null;
  }

  let timer: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => {
      isDbOnline = false;
      lastDbCheck = Date.now();
      resolve(null);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([
      queryFn().then((res) => {
        isDbOnline = true;
        return res;
      }),
      timeoutPromise,
    ]);
    return result;
  } catch {
    isDbOnline = false;
    lastDbCheck = Date.now();
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

