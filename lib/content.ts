import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "publications", "articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  youtubeId?: string;
};

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      description: data.description ? String(data.description) : undefined,
      youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
    };
  });

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleSource(slug: string): { meta: ArticleMeta; mdx: string } {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
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
