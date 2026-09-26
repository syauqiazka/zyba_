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

export async function runWithPrisma<T>(queryFn: () => Promise<T>, timeoutMs = 3000): Promise<T | null> {
  let timer: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => {
      resolve(null);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([
      queryFn(),
      timeoutPromise,
    ]);
    return result;
  } catch (err) {
    console.warn("[runWithPrisma] Query failed:", err);
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

