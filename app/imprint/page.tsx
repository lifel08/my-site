export default function ImprintPage() {
  return (
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

      <section className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">VAT ID</h2>
        <p className="text-neutral-700 leading-relaxed">
          VAT identification number pursuant to §27 a of the German VAT Act: DE123456789
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Responsible for content pursuant to § 18 (2) MStV
        </h2>
        <p className="text-neutral-700 leading-relaxed">
          Lisa Fellinger · Address as above
        </p>
      </section>
    </article>
  );
}
