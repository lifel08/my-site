// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";

const SITE_URL = "https://lfellinger.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/seo-consulting",
    "/web-analytics",
    "/publications",
    "/imprint",
    "/privacy-policy",
  ];

  const articles = getAllArticles();

  const staticEntries = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

const articleEntries = articles
  // Exclude noindex articles
  .filter((article) => article.slug !== "example-article")
  .map((article) => ({
    url: `${SITE_URL}/publications/${article.slug}`,
    lastModified: new Date(
      (article as any).updatedAt ?? article.date ?? Date.now()
    ),
  }));


  return [...staticEntries, ...articleEntries];
}
