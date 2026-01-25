import Link from "next/link";
import { getAllArticles } from "@/lib/content";

export default function ContentHubPage() {
  const articles = getAllArticles();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Publications</h1>
        <p className="text-lg text-neutral-700">
          LinkedIn posts and longer articles.
        </p>
      </header>

      <section className="rounded-2xl border p-6 space-y-3">
        <h2 className="text-2xl font-semibold">LinkedIn</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-700">
          <li>
            <a className="underline" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn posts will appear here.
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Articles</h2>

        <div className="grid gap-4">
          {articles.map((a) => (
            <article key={a.slug} className="rounded-2xl border p-6">
              <div className="text-sm text-neutral-600">{a.date}</div>
              <h3 className="mt-1 text-xl font-semibold">
                <Link className="underline" href={`/publications/${a.slug}`}>
                  {a.title}
                </Link>
              </h3>
              {a.description ? <p className="mt-2 text-neutral-700">{a.description}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
