// app/seo-consulting/page.tsx
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdBreadcrumb, jsonLdService } from "@/lib/structured-data";

const title = "SEO & AI Visibility Consulting | Strategy, Audits & Training";
const description =
  "Technical SEO and AI search consulting focused on strategy, analytics and complex challenges. Audits and insights that drive better decisions.";

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
            Technical SEO and AI search strategy, audits and guidance
          </h1>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            I help teams improve visibility across search engines and AI-powered experiences.
            Through technical audits, data insights, workshops and strategic guidance, I turn
            complex findings into clear priorities and actionable decisions, connecting SEO, AI
            visibility and measurement to make their expertise easier to discover and reference.
            <a
              href="#contact-form"
              className="ml-1 font-semibold text-[#ff6400] underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Please contact me.
            </a>
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
                SEO & AI Visibility Audits with clear priorities
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I conduct technical and strategic audits across SEO and AI visibility, with a clear focus on impact and feasibility. 
                Findings are translated into prioritised, actionable recommendations covering core SEO fundamentals as well as how content, entities and technical signals are understood and surfaced in AI-powered search.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                SEO & AI Visibility - strategy and roadmap definition
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I support organisations in shaping SEO and AI visibility strategies that align with business goals, internal capabilities and broader marketing priorities. 
                The resulting roadmaps account for search journeys that increasingly span traditional results, AI-generated summaries and recommendation-driven experiences.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Team training and workshops
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
              Through tailored workshops and training in English, German and French, I help marketing, product and content teams build a shared understanding of SEO, AI visibility and search decision-making. 
              My background in analytics, tracking and paid marketing adds a broader traffic acquisition perspective, helping teams understand how channels interact and how performance should be measured. 
              I also cover practical ways to make content easier for generative systems to interpret and reference without sacrificing editorial quality.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                Connecting SEO, AI Visibility and analytics
              </h3>
              <p className="mt-3 text-neutral-700 leading-relaxed">
                I help teams connect SEO and AI visibility data with their wider analytics and reporting setup. 
                This involves assessing emerging data sources, integrating relevant signals into existing dashboards and defining measurement approaches that are both practical and credible.
                By combining AI visibility indicators with traffic, engagement, branded demand and conversion data, I help teams build a clearer and more complete picture of search performance.
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
             Conducted comprehensive, data-driven search performance audits for enterprise and mid-sized organisations across traditional SEO and AI visibility. 
             Synthesised technical, content, analytics and visibility insights into prioritised recommendations that supported decision-making and defined the next stages of the search roadmap.
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
              <strong>Context:</strong> understanding your organisation, goals and current Search (SEO / AI) setup.
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
        <section id="contact-form" className="max-w-3xl space-y-6">
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