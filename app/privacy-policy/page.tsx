// app/privacy-policy/page.tsx
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdBreadcrumb } from "@/lib/structured-data";

const title = "Privacy Policy | Lisa Fellinger";
const description =
  "Information about data processing, cookies, consent management and your rights under the GDPR.";

export const metadata = buildMetadata({
  title,
  description,
  path: "/privacy-policy",
  type: "website",
});

export default function PrivacyPolicyPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <article className="max-w-none space-y-6">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-neutral-600">Last updated: 20 November 2026</p>

        <h2 className="pt-4 text-xl font-semibold">1. Controller</h2>
        <p className="leading-relaxed">
          Lisa Fellinger<br />
          Zum Breijpott 15<br />
          47533 Kleve<br />
          Germany<br />
          Email:{" "}
          <span className="break-all">
            lisa [at] lfellinger [dot] com
          </span>
        </p>

        <h2 className="pt-4 text-xl font-semibold">2. Overview</h2>
        <p className="leading-relaxed">
          This Privacy Policy explains how personal data is processed when you visit this
          website. Personal data is any data that can be used to identify you personally.
          We process personal data in accordance with the General Data Protection Regulation
          (GDPR) and applicable German data protection laws.
        </p>

        <h2 className="pt-4 text-xl font-semibold">3. Hosting</h2>
        <p className="leading-relaxed">
          This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
          United States. When you visit the website, server log files (such as IP address,
          date and time of access, browser type and operating system) may be processed to
          ensure the security, stability, and technical operation of the website.
        </p>
        <p className="leading-relaxed">
          The processing of this data is based on Art. 6(1)(f) GDPR (legitimate interest in
          the secure and reliable operation of the website). Vercel processes data on our
          behalf as a processor. Because Vercel is based in the United States, data may be
          transferred to or accessed from outside the European Economic Area. Transfers are
          covered by the safeguards described in section 13.
        </p>

        <h2 className="pt-4 text-xl font-semibold">
          4. Cookies &amp; Consent Management
        </h2>
        <p className="leading-relaxed">
          This website uses Cookiebot as a consent management platform to obtain and manage
          user consent for the use of cookies and similar technologies. Only technically
          necessary cookies are set without consent.
        </p>
        <p className="leading-relaxed">
          You can give, refuse, or withdraw your consent at any time via the consent banner.
          The legal basis for processing data based on consent is Art. 6(1)(a) GDPR.
        </p>

        <h2 className="pt-4 text-xl font-semibold">5. Google Analytics 4</h2>
        <p className="leading-relaxed">
          If you have given your consent, this website uses Google Analytics 4, a web
          analytics service provided by Google Ireland Limited. Google Analytics is used
          to analyze how visitors use the website and to improve its content and usability.
        </p>
        <p className="leading-relaxed">
          Google Analytics processes usage data such as page views, interactions, and
          technical information (e.g. browser, operating system). IP addresses are processed
          in a truncated form where technically possible.
        </p>
        <p className="leading-relaxed">
          The use of Google Analytics takes place exclusively on the basis of your consent
          pursuant to Art. 6(1)(a) GDPR. You can withdraw your consent at any time via the
          consent settings.
        </p>

        <h2 className="pt-4 text-xl font-semibold">6. Google BigQuery</h2>
        <p className="leading-relaxed">
          As part of our analytics setup, data collected via Google Analytics may be exported
          to Google BigQuery for advanced analysis. This data is used exclusively for
          statistical evaluation and improvement of the website.
        </p>
        <p className="leading-relaxed">
          The data stored in BigQuery is not merged with other data sources and is processed
          only in aggregated or pseudonymized form. The legal basis for this processing is
          your consent pursuant to Art. 6(1)(a) GDPR.
        </p>

        <h2 className="pt-4 text-xl font-semibold">7. Google Tag Manager</h2>
        <p className="leading-relaxed">
          This website uses Google Tag Manager. Google Tag Manager does not process personal
          data itself but is used to manage and deploy other tools (such as analytics and UX
          tools) in accordance with your consent preferences.
        </p>

        <h2 className="pt-4 text-xl font-semibold">8. Microsoft Clarity</h2>
        <p className="leading-relaxed">
          If you have given your consent, this website uses Microsoft Clarity, a UX analytics
          tool provided by Microsoft Corporation. Microsoft Clarity helps us understand how
          users interact with the website through aggregated usage data, heatmaps, and
          session recordings.
        </p>
        <p className="leading-relaxed">
          Microsoft Clarity processes interaction data such as mouse movements, scrolling,
          and page interactions. Personal data is masked or pseudonymized where possible.
          The legal basis for processing is your consent pursuant to Art. 6(1)(a) GDPR.
        </p>

        <h2 className="pt-4 text-xl font-semibold">9. YouTube Content</h2>
        <p className="leading-relaxed">
          This website may embed videos from YouTube using the privacy-enhanced mode
          (youtube-nocookie.com). When you view a video, YouTube may process personal data.
          Such processing only takes place after you have given your consent.
        </p>

        <h2 className="pt-4 text-xl font-semibold">10. PostHog</h2>
        <p className="leading-relaxed">
          With your consent, we use PostHog to analyse website usage, improve usability, and
          investigate technical problems. The provider is PostHog Inc., 2261 Market Street
          #4008, San Francisco, CA 94114, United States.
        </p>

        <h3 className="pt-3 text-lg font-medium">Website analytics, heatmaps, and error tracking</h3>
        <p className="leading-relaxed">
          PostHog processes page views, website interactions, technical browser and device
          information, pseudonymous browser and session identifiers, and browser error
          details. Cookies and similar browser storage may be used to associate interactions
          with a browser.
        </p>
        <p className="leading-relaxed">
          We record events when visitors successfully submit the contact form or load
          additional publications. These custom events include the selected service category
          or the number of publications loaded. They do not include the name, email address,
          or message entered in the contact form.
        </p>
        <p className="leading-relaxed">
          We also use heatmaps to visualise patterns in clicks, mouse or touch positions,
          and scrolling. This helps us understand which parts of the website visitors
          interact with. Browser error tracking helps us identify and investigate technical
          failures.
        </p>

        <h3 className="pt-3 text-lg font-medium">Session replay</h3>
        <p className="leading-relaxed">
          We use session replay to reconstruct interactions within this website, such as
          clicks, scrolling, and navigation, to investigate usability issues.
        </p>
        <p className="leading-relaxed">
          Form input values are masked in recordings. Ordinary page text and images are not
          masked. Browser console messages and network request metadata, including timing
          information, may also be captured for troubleshooting. Capture of request and
          response headers and bodies, as well as canvas content, is disabled.
        </p>
        <p className="leading-relaxed">
          Pseudonymous identifiers may associate recordings and browser errors with the
          corresponding browser or session. These identifiers do not directly identify
          visitors by name.
        </p>

        <h3 className="pt-3 text-lg font-medium">Consent and withdrawal</h3>
        <p className="leading-relaxed">
          PostHog browser analytics, heatmaps, browser error tracking, and session recording
          are activated only after you grant Statistics consent through Cookiebot. The legal
          basis is Art. 6(1)(a) GDPR and, where applicable, § 25(1) TDDDG.
        </p>
        <p className="leading-relaxed">
          You can refuse or withdraw consent at any time through the cookie settings.
          Withdrawal stops further consent-based collection without affecting the
          lawfulness of processing carried out before withdrawal.
        </p>

        <h3 className="pt-3 text-lg font-medium">Technical contact-form logs</h3>
        <p className="leading-relaxed">
          Separately, we send limited server-side contact-form logs to PostHog to monitor
          reliability and troubleshoot failures. These contain fixed status messages
          indicating email-request acceptance, email-sending errors, or rate limiting,
          together with the endpoint and technical log metadata.
        </p>
        <p className="leading-relaxed">
          The added log messages do not contain contact-form names, email addresses, or
          enquiry text. This processing is based on Art. 6(1)(f) GDPR and our legitimate
          interest in maintaining a reliable contact form.
        </p>

        <h3 className="pt-3 text-lg font-medium">Hosting and retention</h3>
        <p className="leading-relaxed">
          We use PostHog Cloud EU, with hosting in Frankfurt, Germany.
        </p>
        <p className="leading-relaxed">
          Session recordings are retained for 30 days. Analytics events and associated
          metadata are retained under PostHog's Free-plan retention period of one year.
          Separate server-side contact-form logs are retained for 14 days.
        </p>

        <h3 className="pt-3 text-lg font-medium">Recipients and international transfers</h3>
        <p className="leading-relaxed">
          PostHog processes website data on our behalf as a processor. Its data processing
          terms provide for international-transfer safeguards, including the EU-U.S. Data
          Privacy Framework and, where applicable, EU Standard Contractual Clauses. EU
          hosting does not by itself exclude all processing or access outside the European
          Economic Area.
        </p>
        <p className="leading-relaxed">
          Further information is available in{" "}
          <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">
            PostHog's privacy policy
          </a>
          .
        </p>

        <h2 className="pt-4 text-xl font-semibold">11. Contact</h2>
        <p className="leading-relaxed">
          If you contact us by email or via the contact form, we process the data you send us
          (for example your name, email address, and the content of your message) together
          with technical data needed to deliver the message, in order to handle your request.
        </p>
        <p className="leading-relaxed">
          The legal basis is Art. 6(1)(b) GDPR where your request relates to a contract or
          pre-contractual measures, and otherwise Art. 6(1)(f) GDPR (our legitimate interest
          in answering enquiries).
        </p>

        <h3 className="pt-3 text-lg font-medium">Service providers involved</h3>
        <p className="leading-relaxed">
          Messages sent through the contact form or to the address lisa@lfellinger.com pass
          through the following service providers, which process data on our behalf:
        </p>
        <ul className="list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            <strong>Cloudflare Turnstile</strong> (Cloudflare, Inc., United States) protects the
            contact form against spam and automated abuse. It checks technical browser
            information when the form is used. The legal basis is Art. 6(1)(f) GDPR (our
            legitimate interest in securing the form); where the check is technically
            necessary to provide the form you requested, § 25(2) no. 2 TDDDG applies.
          </li>
          <li>
            <strong>Resend</strong> (Resend, Inc., United States) sends the email that delivers
            your contact-form message to us, and sends our replies from the address
            lisa@lfellinger.com.
          </li>
          <li>
            <strong>ImprovMX</strong> (ImprovMX Incorporated, United States) receives emails sent
            to lisa@lfellinger.com and forwards them to our mailbox. This includes messages
            delivered by the contact form. According to the provider, technical data about
            forwarded emails is kept for troubleshooting for 7 days and then deleted.
          </li>
          <li>
            <strong>Google Gmail</strong> (Google Ireland Limited, for users in the EEA) is the
            mailbox in which we receive and store your messages.
          </li>
        </ul>
        <p className="leading-relaxed">
          Some of these providers are located in or may access data from the United States.
          Transfers are covered by the safeguards described in section 13.
        </p>

        <h3 className="pt-3 text-lg font-medium">Retention</h3>
        <p className="leading-relaxed">
          We delete your message once your request has been fully handled, unless statutory
          retention obligations require us to keep it longer (for example for business
          correspondence relevant to tax or commercial law). Forwarding services only
          transmit messages to our mailbox; they are not used by us for long-term storage.
        </p>

        <h2 className="pt-4 text-xl font-semibold">12. Your Rights</h2>
        <p className="leading-relaxed">
          You have the right to request access, rectification, erasure, restriction of
          processing, data portability, and to object to processing of your personal data.
          You also have the right to lodge a complaint with a supervisory authority.
        </p>

        <h2 className="pt-4 text-xl font-semibold">13. International transfers</h2>
        <p className="leading-relaxed">
          Some of the service providers named in this Privacy Policy are based in the United
          States or may process data outside the European Economic Area. Where this is the
          case, transfers rely on an adequacy decision (EU-U.S. Data Privacy Framework, where
          the provider is certified), on EU Standard Contractual Clauses, or on other
          safeguards permitted under Chapter V GDPR. Where providers offer them, we have
          concluded data processing agreements pursuant to Art. 28 GDPR.
        </p>
      </article>
    </>
  );
}