import ContactForm from "@/components/ContactForm";

export default function SEOConsultingPage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          SEO strategy, audits and team enablement
        </h1>
        <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
          I help teams understand what matters in SEO, how to prioritise work and how to connect
          search performance with analytics through audits, workshops and strategic guidance.
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
              act on.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-tight">
              SEO strategy and roadmap definition
            </h3>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              I support organisations in defining SEO strategies and roadmaps that align with
              business goals, internal capabilities and other marketing channels.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-tight">
              Team training and workshops
            </h3>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              Through tailored workshops and training sessions, I help marketing, product and
              content teams build a shared understanding of SEO principles and decision-making.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-tight">
              Connecting SEO and analytics
            </h3>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              I help teams link SEO efforts with analytics and reporting, so performance discussions
              are based on data, not assumptions.
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
            providing clear recommendations for internal teams.
          </li>
          <li>
            Designed and delivered SEO workshops for marketing, product and content teams, focusing
            on practical decision-making and shared understanding.
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
            “Lisa combined deep SEO expertise with a highly structured and independent way of
            working. She supported teams through clear prioritisation, strong communication and a
            very collaborative leadership style.”
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
            <strong>Assessment:</strong> audits and analysis with a focus on relevance and impact.
          </li>
          <li>
            <strong>Alignment:</strong> workshops and discussions to build shared understanding and
            priorities.
          </li>
          <li>
            <strong>Guidance:</strong> ongoing strategic support and review as teams implement
            changes.
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
          your current setup, I am happy to discuss your situation.
        </p>
         {/* ContactForm*/}
        <ContactForm
          messagePlaceholder="Briefly describe your context or question"
          defaultSubject="SEO Consulting"
        />
      </section>
    </div>
  );
}
