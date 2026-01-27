// app/publications/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleSource } from "@/lib/content";
import { YouTube } from "@/components/YouTube";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdArticle, jsonLdBreadcrumb } from "@/lib/structured-data";

function isNotFoundError(err: unknown) {
  return err instanceof Error && err.message === "NOT_FOUND";
}

// ✅ Only this article gets noindex,follow
function isNoindexArticle(slug: string) {
  return slug === "example-article";
}

export async function generateMetadata({
  params,
}: {
  // Next 16: params can be async
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = getArticleSource(slug);

    const title = `${meta.title} | Lisa Fellinger`;
    const description =
      meta.description ?? `Read ${meta.title} on Lisa Fellinger.`;

    const ogImage = (meta as any).ogImage as string | undefined;

    return buildMetadata({
      title,
      description,
      path: `/publications/${meta.slug ?? slug}`,
      type: "article",
      // ✅ Force override for this one article
      ...(isNoindexArticle(meta.slug ?? slug)
        ? { index: false, follow: true }
        : {}),
      ...(ogImage ? { ogImage } : {}),
    });
  } catch (err) {
    if (isNotFoundError(err)) {
      return {
        title: "Not found | Lisa Fellinger",
        robots: { index: false, follow: false },
      };
    }

    console.error("generateMetadata error for slug:", slug, err);
    throw err;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let meta: any;
  let mdx: string;

  try {
    const res = getArticleSource(slug);
    meta = res.meta;
    mdx = res.mdx;
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    console.error("ArticlePage error for slug:", slug, err);
    throw err;
  }

  const path = `/publications/${meta.slug ?? slug}`;

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
    { name: meta.title, path },
  ]);

  const articleLd = jsonLdArticle({
    headline: meta.title,
    description: meta.description ?? "",
    path,
    datePublished: meta.date,
    dateModified: (meta as any).updatedAt ?? meta.date,
    image: (meta as any).ogImage,
  });

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={articleLd} />

      <article className="prose max-w-none">
        <h1>{meta.title}</h1>
        <p className="text-sm text-neutral-600">{meta.date}</p>

        <MDXRemote
          source={mdx}
          components={{ YouTube }}
          options={{ scope: { frontmatter: meta } }}
        />
      </article>
    </>
  );
}
