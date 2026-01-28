// lib/structured-data.ts
import { absoluteUrl, site } from "./seo";

export function jsonLdPerson() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.domain}/#person`,
    name: site.name,
    url: site.domain,
    jobTitle: "Web Analytics & SEO Training and Consulting",
    image: absoluteUrl("/images/lisa_fellinger.jpg"),
    ...(site.sameAs?.length ? { sameAs: site.sameAs } : {}),
    knowsAbout: [
      "Web Analytics",
      "GA4",
      "Google Tag Manager",
      "Measurement",
      "SEO",
      "Consent Mode",
      "BigQuery",
      "Looker Studio",
      "Server-side tagging",
    ],
    areaServed: ["Germany", "Europe", "Remote"],
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.domain}/#organization`,
    name: site.name,
    url: site.domain,
    ...(site.sameAs?.length ? { sameAs: site.sameAs } : {}),
  };
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}/#website`,
    url: site.domain,
    name: site.name,
    publisher: {
      "@id": `${site.domain}/#person`,
    },
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
      "@id": `${site.domain}/#person`,
      name: site.name,
      url: site.domain,
    },
  };
}

export function jsonLdArticle(input: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    image: input.image
      ? [absoluteUrl(input.image)]
      : [absoluteUrl(site.defaultOgImage)],
    author: {
      "@type": "Person",
      "@id": `${site.domain}/#person`,
      name: site.name,
      url: site.domain,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${site.domain}/#organization`,
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
