// app/imprint/page.tsx
import { buildMetadata } from "@/lib/seo";
import { JsonLd, jsonLdBreadcrumb } from "@/lib/structured-data";

const title = "Imprint | Lisa Fellinger";
const description = "Legal notice and contact information.";

export const metadata = buildMetadata({
  title,
  description,
  path: "/imprint",
  type: "website",
});

export default function ImprintPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Home", path: "/" },
    { name: "Imprint", path: "/imprint" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />

      <article className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Imprint</h1>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Information pursuant to § 5 TMG
          </h2>
          <div className="text-neutral-700 leading-relaxed">
            <div>Lisa Fellinger</div>
            <div>Zum Breijpott 15</div>
            <div>47533 Kleve</div>
            <div>Germany</div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
          <p className="text-neutral-700 leading-relaxed">
            Email: lisafellinger.consulting [at] gmail [dot] com
          </p>
        </section>
{/* Add after registration
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">VAT ID</h2>
          <p className="text-neutral-700 leading-relaxed">
            VAT identification number pursuant to §27 a of the German VAT Act: DE123456789
          </p>
        </section>
*/}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Responsible for content pursuant to § 18 (2) MStV
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            Lisa Fellinger · Address as above
          </p>
        </section>
      </article>
    </>
  );
}
