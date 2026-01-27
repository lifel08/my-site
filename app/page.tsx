import Image from "next/image";
import Link from "next/link";

const ORANGE = "#ff6400";

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold tracking-tight transition hover:opacity-90"
      style={{
        backgroundColor: ORANGE,
        borderColor: ORANGE,
        color: "#ffffff",
        fill: ORANGE,
      }}
    >
      {children}
    </Link>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
    >
      {children}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
      {children}
    </h2>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-3 leading-relaxed text-neutral-700">{children}</div>
    </div>
  );
}

function FeatureCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex h-full flex-col">
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-neutral-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="space-y-6 lg:col-span-7">
          <header className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Web Analytics & SEO Consulting for small and growing businesses
            </h1>
            <p className="text-base leading-relaxed text-neutral-700 md:text-lg">
              I help teams build reliable, privacy-aware measurement and turn complex data into
              clear insights stakeholders can act on.
            </p>
          </header>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/services/web-analytics">Web Analytics</PrimaryButton>
            <PrimaryButton href="/services/seo-consulting">SEO Consulting</PrimaryButton>
            <SecondaryLink href="/content">Explore my Publications</SecondaryLink>
          </div>

          {/* FEATURE GRID */}
<div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-2">
  <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5">
    <div className="text-sm font-semibold tracking-tight">10+ years</div>
    <div className="mt-1 text-sm leading-relaxed text-neutral-700">
      Online marketing experience across analytics, SEO and performance marketing.
    </div>
  </div>

  <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5 sm:row-span-2">
    <div className="text-sm font-semibold tracking-tight">Languages</div>
    <div className="mt-1 text-sm leading-relaxed text-neutral-700">
      <p>
        I work confidently in multilingual environments and support international teams and projects. I also hold speaker assignments at events and conferences in these languages.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>
          <strong>Fluent:</strong> German, English and French
        </li>
        <li>
          <strong>Working knowledge:</strong> Spanish, Portuguese and Italian for comprehension and content work
        </li>
      </ul>
    </div>
  </div>

  <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5">
    <div className="text-sm font-semibold tracking-tight">Industries</div>
    <div className="mt-1 text-sm leading-relaxed text-neutral-700">
      Strong experience across consumer brands, eCommerce, B2B SaaS, lead-driven businesses and international non-profit organisations.
    </div>
  </div>
</div>
        </div>

        {/* PHOTO */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-neutral-200 bg-white p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src="/images/lisa_fellinger.jpg"
                alt="Lisa Fellinger"
                fill
                className="object-cover object-left"
                priority
              />
            </div>
            <div className="mt-3 px-2 pb-1 text-sm text-neutral-600">
              Lisa Fellinger · Web Analytics & SEO Consulting
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-3xl space-y-6">
        <SectionTitle>About</SectionTitle>
        <div className="space-y-4 leading-relaxed text-neutral-700">
          <p>
            I’m Lisa, a freelance Web Analytics consultant specialising in reliable tracking and measurement architectures.
            I work hands-on across GA4, GTM, BigQuery and Looker Studio.
            I help freelancers, startups and small to medium-sized businesses improve attribution, data quality and decision-making.
          </p>
          <p>
            My strength is translating complex topics into practical next steps for different stakeholders such as marketing, product, leadership and technical teams.
            I’m known for reliability, clear communication and a constructive working climate in complex team settings.
          </p>
        </div>
      </section>

      {/* USP / IMPACT */}
      <section className="space-y-6">
        <SectionTitle>How I create impact</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Clarity for every stakeholder">
            I break down complex analytics and SEO topics so decision-makers, marketers and technical teams share the same understanding and can move forward quickly.
          </Card>
          <Card title="Dependable execution">
            From setup to QA and documentation, I work with a structured approach so your tracking, reporting and recommendations remain stable and maintainable over time.
          </Card>
          <Card title="Collaboration on eye level">
            I value respectful communication and partnership so your team stays enabled and the work stays transparent.
          </Card>
        </div>
      </section>

      {/* SERVICES */}
      <section className="space-y-6">
        <SectionTitle>Services</SectionTitle>

<div className="grid gap-6 md:grid-cols-2">
  <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6">
    <div>
      <h3 className="text-xl font-semibold tracking-tight">Web Analytics</h3>
      <p className="mt-3 leading-relaxed text-neutral-700">
        I help you build a reliable measurement foundation that is privacy-aware, well documented and aligned with your business goals.
      </p>

      <ul className="mt-4 list-disc space-y-1 pl-6 text-neutral-700">
        <li>Measurement plan and event taxonomy</li>
        <li>GA4 and GTM setup and QA</li>
        <li>Consent-aware tracking</li>
        <li>Dashboards, reporting and insights</li>
        <li>Employee training and enablement for Web Analytics best practices</li>
      </ul>
    </div>

    <div className="mt-auto pt-6">
      <PrimaryButton href="/services/web-analytics">View Web Analytics</PrimaryButton>
    </div>
  </div>

  <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6">
    <div>
      <h3 className="text-xl font-semibold tracking-tight">SEO Consulting</h3>
      <p className="mt-3 leading-relaxed text-neutral-700">
        I help organisations build sustainable SEO growth through clear strategy, hands-on training and tight integration between search optimisation and analytics.
      </p>

      <ul className="mt-4 list-disc space-y-1 pl-6 text-neutral-700">
        <li>SEO strategy definition and prioritised execution roadmap</li>
        <li>Technical SEO audits translated into actionable business decisions</li>
        <li>Search performance measurement and analytics-driven insights</li>
        <li>Employee training and enablement for SEO best practices</li>
      </ul>
    </div>

    <div className="mt-auto pt-6">
      <PrimaryButton href="/services/seo-consulting">View SEO Consulting</PrimaryButton>
    </div>
  </div>
</div>

      </section>

      {/* CONTENT TEASER */}
      <section className="max-w-3xl space-y-6">
        <SectionTitle>Publications</SectionTitle>
        <p className="leading-relaxed text-neutral-700">
          I publish practical insights on LinkedIn and sometimes in-depth articles on analytics, SEO and privacy-aware measurement.
        </p>
        <div>
          <SecondaryLink href="/content">Go to My Publications</SecondaryLink>
        </div>
      </section>
    </div>
  );
}
