// app/web-analytics/page.tsx
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdBreadcrumb, jsonLdService } from "@/lib/structured-data";

const title = "Web Analytics Consulting | Tracking, Measurement & Data Quality";
const description =
  "Structured web analytics consulting for  multi-market setups, privacy-aware tracking and relaunches. Hands-on GA4 and GTM implementation with strong focus on data quality and documentation.";

export const metadata = buildMetadata({
  title,
  description,
  path: "/web-analytics",
  type: "website",
  // ogImage: "/og/web-analytics.jpg", // optional
});

export default function WebAnalyticsPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Web Analytics", path: "/web-analytics" },
  ]);

  const service = jsonLdService({
    name: "Web Analytics Consulting",
    description,
    path: "/web-analytics",
  });

  return (
    <>
      {/* JSON-LD gets injected into <head> */}
      <JsonLd data={breadcrumb} />
      <JsonLd data={service} />

      <div className="space-y-16">
        {/* HERO */}
        <header className="max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Web Analytics with structure and clarity
          </h1>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            I design and implement tracking and measurement setups that are well-documented,
            privacy-aware and aligned with how teams actually work.
          </p>
        </header>

        {/* HOW I SUPPORT */}
        <section className="space-y-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How I support teams
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Websites and relaunches
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I support teams during website relaunches and migrations by designing tracking
                strategies early, validating implementations before go-live and ensuring measurement
                continuity afterwards.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                International and multi-market setups
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                For international organisations, I help establish shared tracking standards,
                documentation and governance models that work across regions and teams.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Privacy-aware and server-side tracking
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I design consent-aware tracking architectures, including server-side setups and
                conversion APIs, with a strong focus on data quality, compliance and sustainability.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Cross-team alignment
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I act as a reliable interface between marketing, product, engineering and leadership.
                Translating requirements into technically robust and understandable solutions.
              </p>
            </div>
          </div>
        </section>

        {/* SELECTED EXPERIENCE */}
        <section className="space-y-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Selected project experience
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-neutral-700 leading-relaxed">
            <li>
              Designed and validated tracking strategies for complex website relaunches, ensuring
              consistent measurement before and after go-live.
            </li>
            <li>
              Developed global tracking and measurement frameworks for international brands, including
              onboarding of regional teams and shared documentation.
            </li>
            <li>
              Implemented comprehensive GA4 and Google Tag Manager setups in close collaboration with
              marketing, IT and data teams.
            </li>
            <li>
              Built server-side tracking solutions and conversion APIs across major paid media
              platforms, with a strong focus on privacy and long-term maintainability.
            </li>
            <li>
              Supported internal analytics reviews by defining validation processes and improving how
              insights are communicated to stakeholders.
            </li>
          </ul>
        </section>

        {/* REFERENCE QUOTE */}
        <section className="max-w-3xl space-y-4">
          <blockquote className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-neutral-800 leading-relaxed italic">
              “Lisa distinguished herself through an exceptionally structured, proactive and
              solution-oriented way of working. She demonstrated outstanding communication and
              stakeholder management skills and was able to explain complex analytical and technical
              matters clearly and appropriately for different target groups.”
            </p>
            <footer className="mt-3 text-sm text-neutral-600">
              — Reference from a senior leadership role in an international digital consultancy
            </footer>
          </blockquote>
        </section>

        {/* WORKING MODEL */}
        <section className="space-y-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How we would work together
          </h2>

          <ol className="list-decimal pl-6 space-y-3 text-neutral-700 leading-relaxed">
            <li>
              <strong>Discovery:</strong> understanding your business goals, constraints and current
              measurement challenges.
            </li>
            <li>
              <strong>Architecture:</strong> defining a clear tracking and measurement setup aligned
              with your organisation.
            </li>
            <li>
              <strong>Implementation & QA:</strong> hands-on setup, validation and troubleshooting.
            </li>
            <li>
              <strong>Documentation & enablement:</strong> clear documentation and knowledge transfer
              for long-term independence.
            </li>
          </ol>
        </section>

        {/* CONTACT */}
        <section className="max-w-3xl space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Get in touch
          </h2>

          <p className="text-neutral-700 leading-relaxed">
            If you are looking for structured, reliable support with your web analytics setup, feel
            free to reach out. I am happy to discuss your situation and see whether we are a good fit.
          </p>

          <ContactForm
            messagePlaceholder="Briefly describe your context or question"
            defaultSubject="Web Analytics Consulting"
          />
        </section>
      </div>
    </>
  );
}
