import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lisa Fellinger – Web Analytics & SEO Consulting",
  description: "Freelance Web Analytics and SEO Consulting.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* LinkedIn-like page background */}
      <body className="min-h-screen bg-[#F4F2EE] text-neutral-900">
        {/* Keep header white like LinkedIn top bar */}
        <header className="border-b border-neutral-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              Lisa Fellinger
            </Link>

            <div className="flex items-center gap-6 text-sm text-neutral-700">
              <Link
                className="hover:text-neutral-900"
                href="/services/web-analytics"
              >
                Web Analytics
              </Link>
              <Link
                className="hover:text-neutral-900"
                href="/services/seo-consulting"
              >
                SEO Consulting
              </Link>
              <Link
                className="hover:text-neutral-900"
                href="/publications"
              >
                Publications
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">
          {children}
        </main>

        {/* Keep footer white for a clean base */}
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
