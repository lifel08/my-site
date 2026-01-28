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

        <h2 className="pt-4 text-xl font-semibold">1. Controller</h2>
        <p className="leading-relaxed">
          Lisa Fellinger<br />
          Zum Breijpott 15<br />
          47533 Kleve<br />
          Germany<br />
          Email:{" "}
          <span className="break-all">
            lisafellinger.consulting [at] gmail [dot] com
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
          This website is hosted by a professional hosting provider. When you visit the
          website, server log files (such as IP address, date and time of access, browser
          type and operating system) may be processed to ensure the security, stability,
          and technical operation of the website.
        </p>
        <p className="leading-relaxed">
          The processing of this data is based on Art. 6(1)(f) GDPR (legitimate interest in
          the secure and reliable operation of the website).
        </p>

        <h2 className="pt-4 text-xl font-semibold">
          4. Cookies &amp; Consent Management
        </h2>
        <p className="leading-relaxed">
          This website uses a consent management platform (Usercentrics) to obtain and manage
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

        <h2 className="pt-4 text-xl font-semibold">10. Contact</h2>
        <p className="leading-relaxed">
          If you contact us by email or via a contact form, your data will be processed to
          handle your request. The legal basis for this processing is Art. 6(1)(b) GDPR
          (performance of a contract or pre-contractual measures).
        </p>

        <h2 className="pt-4 text-xl font-semibold">11. Your Rights</h2>
        <p className="leading-relaxed">
          You have the right to request access, rectification, erasure, restriction of
          processing, data portability, and to object to processing of your personal data.
          You also have the right to lodge a complaint with a supervisory authority.
        </p>
      </article>
    </>
  );
}
