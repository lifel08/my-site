import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ✅ Flat structure: publications/*.mdx
const PUBLICATIONS_DIR = path.join(process.cwd(), "publications");
const LINKEDIN_FILE = path.join(process.cwd(), "publications", "linkedin.json");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  youtubeId?: string;
};

function assertSafeSlug(slug: string) {
  // Flat slugs only (no nested paths)
  if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    throw new Error("NOT_FOUND");
  }
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(PUBLICATIONS_DIR)) return [];

  const files = fs
    .readdirSync(PUBLICATIONS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(PUBLICATIONS_DIR, filename), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      description: data.description ? String(data.description) : undefined,
      youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
    };
  });

  return articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getArticleSource(slug: string): { meta: ArticleMeta; mdx: string } {
  assertSafeSlug(slug);

  const filePath = path.join(PUBLICATIONS_DIR, `${slug}.mdx`);

  // Optional debug (remove later)
  console.log("Slug:", slug);
  console.log("Looking for:", filePath);
  console.log("Exists?", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) throw new Error("NOT_FOUND");

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      description: data.description ? String(data.description) : undefined,
      youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
    },
    mdx: content,
  };
}

export type LinkedInMeta = {
  type: "linkedin";
  title: string;
  date: string; // ISO YYYY-MM-DD
  description?: string;
  url: string;
  image?: string;
};

export function getLinkedInPosts(): LinkedInMeta[] {
  if (!fs.existsSync(LINKEDIN_FILE)) return [];

  const raw = fs.readFileSync(LINKEDIN_FILE, "utf8");
  const data = JSON.parse(raw) as unknown;

  if (!Array.isArray(data)) return [];

  return data
    .filter(
      (x: any) =>
        typeof x?.url === "string" &&
        typeof x?.title === "string" &&
        typeof x?.date === "string"
    )
    .map((x: any) => ({
      type: "linkedin" as const,
      title: String(x.title),
      date: String(x.date),
      description: x.description ? String(x.description) : undefined,
      url: String(x.url),
      image: x.image ? String(x.image) : undefined,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export type FeedItem =
  | {
      type: "linkedin";
      title: string;
      date: string;
      description?: string;
      url: string;
      image?: string;
    }
  | {
      type: "article";
      title: string;
      date: string;
      description?: string;
      slug: string;
    };

export function getPublicationsFeed(): FeedItem[] {
  const linkedIn = getLinkedInPosts().map((p) => ({
    type: "linkedin" as const,
    title: p.title,
    date: p.date,
    description: p.description,
    url: p.url,
    image: p.image,
  }));

  const articles = getAllArticles().map((a) => ({
    type: "article" as const,
    slug: a.slug,
    title: a.title,
    date: a.date,
    description: a.description,
  }));

  return [...linkedIn, ...articles].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );
}
