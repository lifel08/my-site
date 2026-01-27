// lib/structured-data.ts
import { absoluteUrl, site } from "./seo";

export function jsonLdPerson() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.domain,
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.domain,
  };
}

export function jsonLdBreadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function jsonLdService(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Person",
      name: site.name,
      url: site.domain,
    },
  };
}

export function jsonLdArticle(input: {
  headline: string;
  description: string;
  path: string; // "/publications/slug"
  datePublished?: string; // ISO
  dateModified?: string; // ISO
  image?: string; // "/og/..."
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    image: input.image ? [absoluteUrl(input.image)] : [absoluteUrl("/og/default.jpg")],
    author: {
      "@type": "Person",
      name: site.name,
      url: site.domain,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
