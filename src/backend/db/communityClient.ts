import { PrismaClient } from "@/generated/community-client";
const g = globalThis as unknown as { communityDb: PrismaClient | undefined };
export const communityDb = g.communityDb ?? new PrismaClient();
g.communityDb = communityDb;

