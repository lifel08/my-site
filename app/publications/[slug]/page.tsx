import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleSource } from "@/lib/content";
import { YouTube } from "@/components/YouTube";

const SITE_NAME = "Lisa Fellinger"; 
const SITE_URL = "https://lfellinger.com"; 

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = getArticleSource(slug);

    const title = `${meta.title} | ${SITE_NAME}`;
    const description =
      meta.description ?? `Read ${meta.title} on ${SITE_NAME}.`;
    const canonical = `${SITE_URL}/publications/${meta.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "article",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return {
      title: `Not found | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { meta, mdx } = getArticleSource(slug);

    return (
      <article className="prose max-w-none">
        <h1>{meta.title}</h1>
        <p className="text-sm text-neutral-600">{meta.date}</p>

        <MDXRemote
          source={mdx}
          components={{ YouTube }}
          options={{ scope: { frontmatter: meta } }}
        />
      </article>
    );
  } catch {
    return notFound();
  }
}
