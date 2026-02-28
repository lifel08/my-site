import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";

// Client Component loads GTM after Consent Decision
import GtmOnCookiebotDecision from "./gtm-on-cookiebot-decision";

export const metadata: Metadata = {
  metadataBase: new URL("https://lfellinger.com"),
  title: "Lisa Fellinger | Web Analytics, Tracking & SEO Measurement",
  description:
    "Web Analytics and SEO Measurement focused on setups and training that support real business decisions.",
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
  openGraph: {
    type: "website",
    url: "https://lfellinger.com/",
    siteName: "Lisa Fellinger",
    title: "Lisa Fellinger | Web Analytics, Tracking & SEO Measurement",
    description:
      "Web Analytics and SEO Measurement focused on setups and training that support real business decisions.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lisa Fellinger – Web Analytics, Tracking & SEO Measurement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lisa Fellinger | Web Analytics, Tracking & SEO Measurement",
    description:
      "Web Analytics and SEO Measurement focused on setups and training that support real business decisions.",
    images: ["/images/og-image.png"],
  },
};

const UC_SETTINGS_ID = "nzA5dDjdnKUHRF";
const GTM_ID = "GTM-N7MRKHQZ";

type CMPMode = "USERCENTRICS" | "COOKIEBOT" | "NONE";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const nonce = headerStore.get("x-nonce") ?? undefined;
  const cmp = (process.env.NEXT_PUBLIC_CMP || "USERCENTRICS") as CMPMode;
  const cookiebotCbid = process.env.NEXT_PUBLIC_COOKIEBOT_CBID || "";

  return (
    <html lang="en">
      <head>
        {/* --- Google Consent Mode v2 (Advanced) DEFAULTS: may run before GTM --- */}
        <Script
          id="consent-mode-default"
          nonce={nonce}
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Advanced Consent Mode: default everything to denied
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />

        {/* --- CMP SWITCH: load exactly ONE CMP --- */}
        {cmp === "USERCENTRICS" && (
          <>
            <Script
              id="usercentrics-autoblocker"
              nonce={nonce}
              src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
              strategy="beforeInteractive"
            />
            <Script
              id="usercentrics-cmp"
              nonce={nonce}
              src="https://web.cmp.usercentrics.eu/ui/loader.js"
              data-settings-id={UC_SETTINGS_ID}
              strategy="beforeInteractive"
            />
          </>
        )}

        {cmp === "COOKIEBOT" && cookiebotCbid && (
          <Script
            id="Cookiebot"
            nonce={nonce}
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotCbid}
            data-blockingmode="auto"
            type="text/javascript"
            strategy="beforeInteractive"
          />
        )}
      </head>

      <body className="min-h-screen bg-[#F4F2EE] text-neutral-900">
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

        {/* GTM Loader (only for Cookiebot-Mode) */}
        {cmp === "COOKIEBOT" && cookiebotCbid && (
          <GtmOnCookiebotDecision
            nonce={nonce ?? ""}
            gtmId={GTM_ID}
            dataLayerName="dataLayer"
          />
        )}

        {/* Optional:Loader-Component for UC-Events. */}
      </body>
    </html>
  );
}