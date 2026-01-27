// app/publications/page.tsx
import { getAllArticles, getLinkedInPosts } from "@/lib/content";
import { PublicationsClient } from "./PublicationsClient";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdBreadcrumb } from "@/lib/structured-data";

type FeedItem =
  | {
      type: "linkedin";
      title: string;
      date: string;
      description?: string;
      url: string;
      image?: string;
    }
  | { type: "article"; title: string; date: string; description?: string; slug: string };

function sortByDateDesc(items: FeedItem[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const title = "Publications | Lisa Fellinger";
const description = "Selected LinkedIn posts and longer articles on web analytics and SEO.";

export const metadata = buildMetadata({
  title,
  description,
  path: "/publications",
  type: "website",
  // ogImage: "/og/publications.jpg", // optional
});

export default function ContentHubPage() {
  const articles = getAllArticles();
  const linkedIn = getLinkedInPosts();

  const feed = sortByDateDesc([
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

  const initial = feed.slice(0, 12);

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <div className="space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold">Publications</h1>
          <p className="text-lg text-neutral-700">Selected LinkedIn posts and longer articles.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Latest</h2>

          <PublicationsClient
            initialItems={initial}
            initialNextOffset={initial.length}
            initialHasMore={initial.length < feed.length}
          />
        </section>
      </div>
    </>
  );
}
