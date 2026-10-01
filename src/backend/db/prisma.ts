import { accountDb } from "./accountClient";

export { accountDb };
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

