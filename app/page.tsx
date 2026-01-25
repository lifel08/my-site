import Image from "next/image";
import Link from "next/link";

const ORANGE = "#ff6400";

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: ORANGE,
  borderColor: ORANGE,
  color: "#ffffff",
  fill: ORANGE,
};

const primaryButtonHoverStyle: React.CSSProperties = {
  backgroundColor: ORANGE,
  borderColor: ORANGE,
  color: "#ffffff",
  fill: ORANGE,
  opacity: 0.92,
};

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
        backgroundColor: "#ff6400",
        borderColor: "#ff6400",
        color: "#ffffff",
        fill: "#FF6400",
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
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{children}</h2>
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
      <div className="mt-3 text-neutral-700 leading-relaxed">{children}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-6">
          <header className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Web Analytics & SEO consulting for small and growing businesses
            </h1>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
              I help teams build reliable, privacy-aware measurement and turn complex data into
              clear insights stakeholders can act on.
            </p>
          </header>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/services/web-analytics">Web Analytics</PrimaryButton>
            <PrimaryButton href="/services/seo-consulting">SEO Consulting</PrimaryButton>
            <SecondaryLink href="/content">Explore my Publications</SecondaryLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold tracking-tight">10+ years</div>
              <div className="mt-1 text-sm text-neutral-700">
                Online marketing experience across analytics, SEO, and performance.
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold tracking-tight">Stakeholder clarity</div>
              <div className="mt-1 text-sm text-neutral-700">
                I simplify complex topics for different audiences—technical and non-technical.
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold tracking-tight">Reliable delivery</div>
              <div className="mt-1 text-sm text-neutral-700">
                Structured execution, QA, and documentation you can trust.
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-sm font-semibold tracking-tight">Collaborative style</div>
              <div className="mt-1 text-sm text-neutral-700">
                Calm, respectful work in complex team settings—always on eye level.
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-neutral-200 bg-white p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
              {/* Replace /images/lisa.jpg with your actual image path */}
              <Image
                src="/images/lisa.jpg"
                alt="Lisa Fellinger"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-3 px-2 pb-1 text-sm text-neutral-600">
              Lisa Fellinger · Web Analytics & SEO Consulting
            </div>
          </div>
          <div className="mt-3 text-xs text-neutral-500">
            Tip: place your photo at <code className="rounded bg-neutral-100 px-1">public/images/lisa.jpg</code>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-3xl space-y-6">
        <SectionTitle>About</SectionTitle>
        <div className="space-y-4 text-neutral-700 leading-relaxed">
          <p>
            I’m Lisa, a freelance Web Analytics consultant specialising in reliable tracking and measurement architectures. 
            I work hands-on across GA4, GTM, BigQuery and Looker Studio. Helping freelancers, startups and small to medium-sized businesses improve attribution, data quality and decision-making through clear, actionable insights.
          </p>
          <p>
            My strength is translating complex topics into practical next steps for different
            stakeholders: marketing, product, leadership and technical teams. I’m known for
            reliability, clear communication and creating a constructive working climate, especially
            in complex team settings.
          </p>
        </div>
      </section>

      {/* USP / IMPACT */}
      <section className="space-y-6">
        <SectionTitle>How I create impact</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Clarity for every stakeholder">
            I break down complex analytics and SEO topics so that decision-makers, marketers and
            technical teams share the same understanding and can move forward quickly.
          </Card>
          <Card title="Dependable execution">
            From setup to QA and documentation, I work with a structured approach so your tracking,
            reporting and recommendations remain stable and maintainable over time.
          </Card>
          <Card title="Collaboration on eye level">
            I value respectful communication and partnership. My goal is to enable your brand and team. Not to
            create a black box.
          </Card>
        </div>
      </section>

      {/* SERVICES */}
      <section className="space-y-6">
        <SectionTitle>Services</SectionTitle>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-tight">Web Analytics</h3>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              I help you build a reliable measurement foundation: privacy-aware, cleanly documented              and aligned with business goals.
              and aligned with your business goals.
            </p>

            <ul className="mt-4 list-disc space-y-1 pl-6 text-neutral-700">
              <li>Measurement plan & event taxonomy</li>
              <li>GA4 + GTM setup and QA</li>
              <li>Consent-aware tracking</li>
              <li>Dashboards, reporting and insights</li>
            </ul>

            <div className="mt-6">
              <PrimaryButton href="/services/web-analytics">View Web Analytics</PrimaryButton>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-tight">SEO Consulting</h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I help organisations build sustainable SEO growth through clear strategy,
                hands-on training and a tight integration between search optimisation and analytics.
              </p>

              <ul className="mt-4 list-disc space-y-1 pl-6 text-neutral-700">
                <li>SEO strategy definition and prioritised execution roadmap</li>
                <li>Technical SEO audits translated into actionable business decisions</li>
                <li>Search performance measurement and analytics-driven insights</li>
                <li>Employee training and enablement for SEO best practices</li>
              </ul>

            <div className="mt-6">
              <PrimaryButton href="/services/seo-consulting">View SEO Consulting</PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="max-w-3xl space-y-6">
        <SectionTitle>Languages</SectionTitle>
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            I work confidently in multilingual environments and can support international teams and
            projects.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Fluent:</strong> German, English, French</li>
            <li><strong>Working knowledge:</strong> Spanish, Italian, Portuguese (comprehension and content work)</li>
          </ul>
        </div>
      </section>

      {/* CONTENT TEASER */}
      <section className="max-w-3xl space-y-6">
        <SectionTitle>Publications</SectionTitle>
        <p className="text-neutral-700 leading-relaxed">
         I publish practical insights on LinkedIn and sometimes in-depth articles on analytics, SEO and privacy-aware measurement. 
         From time to time, I also share here personal reflections on freelancing and working remotely.
        </p>
        <div>
          <SecondaryLink href="/content">Go to My Publications</SecondaryLink>
        </div>
      </section>
    </div>
  );
}
