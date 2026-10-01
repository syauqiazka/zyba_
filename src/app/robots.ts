import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jhic.zyba.my.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/assessment",
        "/daily-assessment",
        "/onboarding",
        "/settings",
        "/activity",
        "/achievements",
        "/companion",
        "/community",
        "/login",
        "/welcome",
        "/api",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
