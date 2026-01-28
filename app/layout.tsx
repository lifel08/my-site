import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lisa Fellinger | Web Analytics, Tracking & SEO Measurement",
  description:
    "Web analytics and SEO consulting focused on reliable tracking and clean data. Hands-on GA4 and GTM setups that support real business decisions.",
  alternates: {
    canonical: "https://lfellinger.com/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const UC_SETTINGS_ID = "nzA5dDjdnKUHRF";
const GTM_ID = "GTM-N7MRKHQZ";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* --- Google Consent Mode v2 (Advanced) DEFAULTS: must run BEFORE GTM --- */}
        <Script
          id="consent-mode-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Advanced Consent Mode: allow tags to load, but default everything to denied
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                // Small delay so CMP can update quickly before tags act on default
                wait_for_update: 500
              });
            `,
          }}
        />

        {/* Usercentrics Autoblocker */}
        <Script
          id="usercentrics-autoblocker"
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          strategy="beforeInteractive"
        />

        {/* Usercentrics CMP UI */}
        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id={UC_SETTINGS_ID}
          strategy="beforeInteractive"
        />

        {/* Google Tag Manager (container only; governed by consent) */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>

      <body className="min-h-screen bg-[#F4F2EE] text-neutral-900">
        {/* GTM (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Keep header white like LinkedIn top bar */}
        <header className="border-b border-neutral-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              Lisa Fellinger
            </Link>

            <div className="flex items-center gap-6 text-sm text-neutral-700">
              <Link className="hover:text-neutral-900" href="/web-analytics">
                Web Analytics
              </Link>
              <Link className="hover:text-neutral-900" href="/seo-consulting">
                SEO Consulting
              </Link>
              <Link className="hover:text-neutral-900" href="/publications">
                Publications
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>

        <footer className="mt-24 border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-neutral-600 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Lisa Fellinger</div>
            <nav className="flex gap-4">
              <a
                className="text-blue-700 hover:text-blue-800 underline underline-offset-4"
                href="/imprint"
              >
                Imprint
              </a>
              <a
                className="text-blue-700 hover:text-blue-800 underline underline-offset-4"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
