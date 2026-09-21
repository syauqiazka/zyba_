import { PrismaClient } from "@/generated/account-client";
const g = globalThis as unknown as { accountDb: PrismaClient | undefined };
export const accountDb = g.accountDb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.accountDb = accountDb;
