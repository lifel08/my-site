// lib/seo.ts
import type { Metadata } from "next";

export const site = {
  name: "Lisa Fellinger",
  domain: "https://lfellinger.com",
  locale: "en_GB",
  twitterHandle: undefined as string | undefined, // optional: "@..."
  defaultOgImage: "/images/apple-touch-icon.png", // 1200x630
  sameAs: [
     "https://www.linkedin.com/in/lifel/",
  ] as string[],
};

export function absoluteUrl(path: string) {
  if (!path) return site.domain;
  return `${site.domain}${path.startsWith("/") ? path : `/${path}`}`;
}

type BaseMetaInput = {
  title: string;
  description: string;
  path: string; // "/web-analytics"
  ogImage?: string; // "/og/xyz.jpg"
  type?: "website" | "article";
  index?: boolean;
  follow?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
  index = true,
  follow = true,
}: BaseMetaInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImage ?? site.defaultOgImage);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      ...(site.twitterHandle ? { creator: site.twitterHandle } : {}),
    },
  };
}
