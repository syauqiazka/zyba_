import type { MetadataRoute } from "next";
import { accountDb } from "@/backend/db/accountClient";
import { getResourceSlug } from "@/lib/resourceSlug";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jhic.zyba.my.id";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources = await accountDb.resource.findMany({
    select: {
      title: true,
      createdAt: true,
      isPro: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const publicResources = resources.filter(
    (resource) => !resource.isPro
  );

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/resources`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...publicResources.map((resource) => ({
      url: `${siteUrl}/resources/${getResourceSlug(resource.title)}`,
      lastModified: resource.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
