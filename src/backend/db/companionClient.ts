import { PrismaClient } from "@/generated/companion-client";
const g = globalThis as unknown as { companionDb: PrismaClient | undefined };
export const companionDb = g.companionDb ?? new PrismaClient();
g.companionDb = companionDb;

