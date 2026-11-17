import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, BUSINESS, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import placeMasseria from "@/assets/place-masseria-new.jpg";

const doveSiamoSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/dove-siamo#page`,
      name: "Dove Siamo — Masseria Torre Abbondanza",
      description:
        "Come raggiungere Masseria Torre Abbondanza a Noci (BA): indicazioni stradali da Bari, Brindisi, Taranto, parcheggio e coordinate GPS.",
      url: `${SITE_URL}/dove-siamo`,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/dove-siamo#biz`,
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.locality,
        addressRegion: BUSINESS.address.region,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: BUSINESS.address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: BUSINESS.geo.lat,
        longitude: BUSINESS.geo.lon,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "09:00",
          closes: "22:00",
        },
      ],
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Dove Siamo", path: "/dove-siamo" },
    ]),
  ],
};

export const Route = createFileRoute("/dove-siamo")({
  head: () => ({
    meta: [
      { title: "Dove Siamo — Masseria Torre Abbondanza | Come Raggiungerci" },
      {
        name: "description",
        content:
          "Come arrivare a Masseria Torre Abbondanza a Noci (BA): indicazioni da Bari, Brindisi, Taranto, Alberobello. Coordinate GPS, mappa e parcheggio gratuito.",
      },
      { property: "og:title", content: "Dove Siamo — Masseria Torre Abbondanza" },
      {
        property: "og:description",
        content:
          "Indicazioni stradali, mappa e coordinate GPS per raggiungere la masseria nel cuore della Murgia di Noci.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/dove-siamo` },
      { property: "og:image", content: absoluteUrl(placeMasseria) },
    ],
    links: buildHreflangLinks("/dove-siamo"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(doveSiamoSchema) }],
  }),
  component: DoveSiamo,
});

function DoveSiamo() {
  useLenis();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.geo.lat},${BUSINESS.geo.lon}`;

  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 py-20 md:px-12 md:py-28">
        <span className="text-eyebrow text-terracotta">Come raggiungerci</span>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
          Dove siamo
        </h1>
        <p className="mt-6 font-display text-lg leading-relaxed text-ink/70 md:text-xl">
          Masseria Torre Abbondanza si trova nel cuore della Murgia dei Trulli, a pochi minuti da
          Noci, Alberobello e Putignano.
        </p>

        {/* Indirizzo e contatti */}
        <div className="mt-12 rounded-xl border border-ink/10 bg-stone-50 p-8">
          <h2 className="font-display text-xl font-medium text-ink">Indirizzo</h2>
          <p className="mt-3 font-display text-base leading-relaxed text-ink/80">
            {BUSINESS.address.line1}
            <br />
            {BUSINESS.address.line2}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-terracotta"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Apri in Google Maps
            </a>
            <a
              href={`tel:${BUSINESS.phoneTel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Chiama {BUSINESS.phone}
            </a>
          </div>
        </div>

        {/* Indicazioni stradali */}
        <div className="mt-12 space-y-8">
          <h2 className="font-display text-2xl font-medium text-ink">Indicazioni stradali</h2>

          <div className="space-y-6 font-display text-base leading-relaxed text-ink/80">
            <div>
              <h3 className="font-semibold text-ink">Da Bari (55 km, ~50 min)</h3>
              <p className="mt-2">
                Prendere la SS16 sud verso Brindisi → uscita Noci → seguire SP211 per Massafra →
                Strada Vicinale per Massafra, Zona E n. 49.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Da Brindisi (65 km, ~55 min)</h3>
              <p className="mt-2">
                Prendere la SS16 nord verso Bari → uscita Noci → seguire SP211 per Massafra → Strada
                Vicinale per Massafra, Zona E n. 49.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Da Taranto (45 km, ~40 min)</h3>
              <p className="mt-2">
                Prendere la SS172 dir verso Martina Franca → proseguire su SP211 per Noci → Strada
                Vicinale per Massafra, Zona E n. 49.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Da Alberobello (12 km, ~15 min)</h3>
              <p className="mt-2">
                Seguire SP211 per Noci → Strada Vicinale per Massafra, Zona E n. 49.
              </p>
            </div>
          </div>
        </div>

        {/* Coordinate GPS */}
        <div className="mt-12 rounded-xl border border-ink/10 bg-stone-50 p-6">
          <h2 className="font-display text-lg font-medium text-ink">Coordinate GPS</h2>
          <p className="mt-2 font-mono text-sm text-ink/70">
            Lat: {BUSINESS.geo.lat} · Lon: {BUSINESS.geo.lon}
          </p>
          <p className="mt-2 text-xs text-ink/50">
            Utilizzabili per navigatori satellitari e app di navigazione offline.
          </p>
        </div>

        {/* Parcheggio */}
        <div className="mt-8">
          <h2 className="font-display text-xl font-medium text-ink">Parcheggio</h2>
          <p className="mt-3 font-display text-base leading-relaxed text-ink/80">
            Ampio parcheggio gratuito all'interno della proprietà, accessibile direttamente dalla
            strada vicinale. Spazi riservati per ospiti con mobilità ridotta.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
