import { NextResponse } from "next/server";
import { getAllArticles, getLinkedInPosts } from "@/lib/content";

type FeedItem =
  | { type: "linkedin"; title: string; date: string; description?: string; url: string; image?: string }
  | { type: "article"; title: string; date: string; description?: string; slug: string };

function sortByDateDesc(items: FeedItem[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function getFeed(): FeedItem[] {
  const articles = getAllArticles();
  const linkedIn = getLinkedInPosts();

  return sortByDateDesc([
    ...linkedIn.map((p) => ({
      type: "linkedin" as const,
      title: p.title,
      date: p.date,
      description: p.description,
      url: p.url,
      image: (p as any).image as string | undefined,
    })),
    ...articles.map((a) => ({
      type: "article" as const,
      slug: a.slug,
      title: a.title,
      date: a.date,
      description: a.description,
    })),
  ]);
}

export const runtime = "nodejs";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, Number(searchParams.get("offset") ?? "0"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "12")));

  const feed = getFeed();
  const items = feed.slice(offset, offset + limit);

  return NextResponse.json({
    items,
    total: feed.length,
    nextOffset: offset + items.length,
    hasMore: offset + items.length < feed.length,
  });
}
