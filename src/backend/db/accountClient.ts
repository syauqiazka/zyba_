import { PrismaClient } from "@/generated/account-client";
const g = globalThis as unknown as { accountDb: PrismaClient | undefined };
export const accountDb = g.accountDb ?? new PrismaClient();
g.accountDb = accountDb;

