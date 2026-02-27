// app/seo-consulting/page.tsx
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdBreadcrumb, jsonLdService } from "@/lib/structured-data";

const title = "SEO Consulting & Training | Strategy, Audits & Enablement";
const description =
  "SEO consulting and training focused on clear strategy, structured audits and measurable search performance. Practical, analytics-driven SEO explained so teams can apply it independently.";

export const metadata = buildMetadata({
  title,
  description,
  path: "/seo-consulting",
  type: "website",
  // ogImage: "/og/seo-consulting.jpg", // optional
});

export default function SEOConsultingPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Home", path: "/" },
    { name: "SEO Consulting", path: "/seo-consulting" },
  ]);

  const service = jsonLdService({
    name: "SEO Consulting",
    description,
    path: "/seo-consulting",
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
            SEO strategy, audits and team enablement
          </h1>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            I help teams understand what matters in SEO, how to prioritise work and how to connect
            search performance with analytics through audits, workshops and strategic guidance. I
            also support optimisation for generative AI search experiences, so your content and
            technical setup are easier to interpret, cite and surface in AI-powered answers (often
            referred to as GEO).
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
                SEO audits with clear priorities
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I conduct technical and strategic SEO audits that focus on impact and feasibility.
                Findings are translated into prioritised recommendations that teams can realistically
                act on. Covering classic SEO fundamentals as well as how content and entities are
                understood in AI-assisted search and answer engines.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                SEO strategy and roadmap definition
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I support organisations in defining SEO strategies and roadmaps that align with
                business goals, internal capabilities and other marketing channels. This includes
                planning for search journeys that increasingly blend classic results with AI-generated
                summaries and recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Team training and workshops
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                Through tailored workshops and training sessions, I help marketing, product and
                content teams build a shared understanding of SEO principles and decision-making.
                When useful, I also introduce practical ways to create content that is easier for
                generative systems to parse, attribute and reuse, without sacrificing editorial quality.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Connecting SEO and analytics
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I help teams link SEO efforts with analytics and reporting, so performance discussions
                are based on data, not assumptions. Where possible, I also help define measurement
                approaches for AI-driven discovery and referrals (for ex. changes in branded demand,
                content engagement and downstream conversions).
              </p>
            </div>
          </div>
        </section>

        {/* SELECTED EXPERIENCE */}
        <section className="space-y-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Selected experience
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-neutral-700 leading-relaxed">
            <li>
              Led SEO strategy consulting for enterprise and mid-sized organisations, coordinating and
              prioritising numerous SEO initiatives across technical, content and structural topics.
            </li>
            <li>
              Conducted in-depth SEO audits across e-commerce, SaaS, finance and B2B environments,
              providing clear recommendations for internal teams. Including improvements that support
              structured interpretation and attribution in generative AI answers.
            </li>
            <li>
              Designed and delivered SEO workshops for marketing, product and content teams, focusing
              on practical decision-making and shared understanding, as well as content patterns that
              improve findability and reusability in AI-assisted search experiences.
            </li>
            <li>
              Supported SEO considerations during website relaunches and migrations through reviews,
              guidance and validation
            </li>
            <li>
              Built SEO reporting and dashboards by integrating data from Search Console, analytics and
              third-party tools.
            </li>
          </ul>
        </section>

        {/* REFERENCE QUOTE */}
        <section className="max-w-3xl space-y-4">
          <blockquote className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-neutral-800 leading-relaxed italic">
              “With extensive SEO expertise and a strong didactic approach, Lisa successfully translates complex SEO concepts into clear, practical learning formats that teams can apply independently.”
            </p>
            <footer className="mt-3 text-sm text-neutral-600">
              — Reference from agency leadership, SEO consulting
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
              <strong>Context:</strong> understanding your organisation, goals and current SEO setup.
            </li>
            <li>
              <strong>Assessment:</strong> audits and analysis with a focus on relevance and impact,
              including opportunities for better machine understanding (structured data, entities and
              content architecture).
            </li>
            <li>
              <strong>Alignment:</strong> workshops and discussions to build shared understanding and
              priorities.
            </li>
            <li>
              <strong>Guidance:</strong> ongoing strategic support and review as teams implement
              changes. Covering both organic search fundamentals and improvements that help your
              content show up in AI-generated answers.
            </li>
          </ol>
        </section>

        {/* CONTACT */}
        <section className="max-w-3xl space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Get in touch
          </h2>

          <p className="text-neutral-700 leading-relaxed">
            If you are looking for strategic SEO support, team training or an external perspective on
            your current setup, including preparing your content and site signals for AI-powered search
            experiences, I am happy to discuss your situation.
          </p>

          <ContactForm
            messagePlaceholder="Briefly describe your context or question"
            defaultSubject="SEO Consulting"
          />
        </section>
      </div>
    </>
  );
}