import { PrismaClient } from "@/generated/companion-client";
const g = globalThis as unknown as { companionDb: PrismaClient | undefined };
export const companionDb = g.companionDb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.companionDb = companionDb;
