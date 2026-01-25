import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lisa Fellinger – Web Analytics & SEO Consulting",
  description: "Freelance Web Analytics and SEO Consulting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
<header className="border-b border-neutral-200 bg-white">
  <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <Link href="/" className="font-semibold tracking-tight">
      Lisa Fellinger
    </Link>

    <div className="flex items-center gap-6 text-sm text-neutral-700">
      <Link className="hover:text-neutral-900" href="/services/web-analytics">Web Analytics</Link>
      <Link className="hover:text-neutral-900" href="/services/seo-consulting">SEO Consulting</Link>
      <Link className="hover:text-neutral-900" href="/publications">Publications</Link>
    </div>
  </nav>
</header>


        <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>

<footer className="mt-24 border-t border-neutral-200 bg-white">
  <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-neutral-600 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>© {new Date().getFullYear()} Lisa Fellinger</div>
    <nav className="flex gap-4">
      <a className="text-blue-700 hover:text-blue-800 underline underline-offset-4" href="/imprint">Imprint</a>
      <a className="text-blue-700 hover:text-blue-800 underline underline-offset-4" href="/privacy-policy">Privacy Policy</a>
    </nav>
  </div>
</footer>

      </body>
    </html>
  );
}
