import { accountDb } from "@/backend/db/accountClient";
import { unstable_cache } from "next/cache";

export const getCachedBadges = unstable_cache(
  async () => {
    return accountDb.badge.findMany({
      orderBy: { xpReward: "asc" },
    });
  },
  ["all-badges-catalog"],
  { revalidate: 86400, tags: ["badges"] }
);
