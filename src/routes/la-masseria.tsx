import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VisitSection } from "@/components/VisitSection";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, BUSINESS, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import masseriaNobg from "@/assets/place-masseria-nobg.webp";
import heroMasseria from "@/assets/hero-masseria.jpg";

const laMasseriaSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/la-masseria#org`,
      name: BUSINESS.name,
      legalName: BUSINESS.legalName,
      foundingDate: String(BUSINESS.foundedYear),
      vatID: BUSINESS.vatId,
      description:
        "Masseria del Settecento nel cuore della Murgia di Noci, Puglia. Gestita dalla famiglia Giunta dal 2005: ristorante su prenotazione, eventi e allevamento cavalli Murgesi.",
      url: `${SITE_URL}/la-masseria`,
      logo: absoluteUrl(masseriaNobg),
      image: [absoluteUrl(heroMasseria)],
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.locality,
        addressRegion: BUSINESS.address.region,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: BUSINESS.address.country,
      },
      sameAs: [
        BUSINESS.instagram.url,
        BUSINESS.facebook.url,
        BUSINESS.reviews.tripadvisor.url,
        BUSINESS.reviews.thefork.url,
      ],
    },
    {
      "@type": "HistoricalLandmark",
      name: "Masseria Torre Abbondanza",
      description:
        "Complesso rurale del XVIII secolo nella Murgia dei Trulli, con corte in pietra, sala storica a volte e giardino di ulivi secolari.",
      yearBuilt: "XVIII secolo",
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "La Masseria", path: "/la-masseria" },
    ]),
  ],
};

export const Route = createFileRoute("/la-masseria")({
  head: () => ({
    meta: [
      { title: "La Nostra Storia — Masseria Torre Abbondanza" },
      {
        name: "description",
        content:
          "Storia della Masseria Torre Abbondanza dal Settecento a oggi: la famiglia Giunta, la corte in pietra, gli ulivi secolari e i cavalli Murgesi nel cuore della Murgia di Noci.",
      },
      {
        name: "keywords",
        content:
          "storia masseria torre abbondanza, masseria settecento noci, famiglia giunta noci, masseria storica murgia dei trulli, dimora storica puglia",
      },
      { property: "og:title", content: "La Nostra Storia — Masseria Torre Abbondanza" },
      {
        property: "og:description",
        content:
          "Masseria del Settecento nella Murgia dei Trulli. Storia, tradizione e ospitalità pugliese dal 2005.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/la-masseria` },
      { property: "og:image", content: absoluteUrl(heroMasseria) },
      {
        property: "og:image:alt",
        content: "Facciata storica della Masseria Torre Abbondanza a Noci",
      },
      { name: "twitter:title", content: "La Nostra Storia — Masseria Torre Abbondanza" },
      {
        name: "twitter:description",
        content:
          "Masseria del Settecento nella Murgia dei Trulli. Storia, tradizione e ospitalità pugliese dal 2005.",
      },
      { name: "twitter:image", content: absoluteUrl(heroMasseria) },
    ],
    links: buildHreflangLinks("/la-masseria"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(laMasseriaSchema) }],
  }),
  component: LaMasseria,
});

function LaMasseria() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />

      {/* Hero con foto facciata scontornata */}
      <section className="relative overflow-hidden bg-[#0a0908] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <span className="text-eyebrow text-terracotta">Dal Settecento a oggi</span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ivory md:text-5xl lg:text-6xl">
                La Masseria Torre Abbondanza
              </h1>
              <p className="mt-6 font-display text-lg leading-relaxed text-ivory/80 md:text-xl">
                Un complesso rurale del XVIII secolo immerso nella Murgia dei Trulli, dove la storia
                della pietra incontra l'ospitalità della famiglia Giunta.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={masseriaNobg}
                alt="Facciata della Masseria Torre Abbondanza, complesso rurale del Settecento nella Murgia di Noci"
                loading="eager"
                decoding="async"
                className="max-h-[500px] w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Storia */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:px-12 md:py-28">
        <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">
          Una storia di terra e tradizione
        </h2>
        <div className="mt-8 space-y-6 font-display text-base leading-relaxed text-ink/80 md:text-lg">
          <p>
            Masseria Torre Abbondanza nasce come complesso rurale nel cuore della Murgia dei Trulli,
            tra Noci e Alberobello. Le sue mura in pietra bianca raccontano secoli di vita
            contadina, quando le masserie erano il centro pulsante dell'economia agricola pugliese.
          </p>
          <p>
            Dal 2005, la <strong>famiglia Giunta</strong> ha trasformato questo luogo in un punto di
            riferimento per l'ospitalità autentica: la sala storica con volte in pietra del
            Settecento accoglie matrimoni e cerimonie, la cucina propone i sapori della tradizione
            pugliese su prenotazione, e l'allevamento di cavalli Murgesi mantiene viva una delle
            razze più antiche d'Italia.
          </p>
          <p>
            Oggi la masseria vive di due anime in equilibrio: la tavola e il galoppo, la pietra e la
            terra, la memoria e l'accoglienza. Ogni ospite che varca la soglia entra in una storia
            che continua.
          </p>
        </div>
      </section>

      {/* Numeri chiave */}
      <section className="bg-stone-100 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12">
          {[
            { label: "Anno di fondazione", value: "XVIII sec." },
            { label: "Gestione familiare", value: `Dal ${BUSINESS.foundedYear}` },
            { label: "Capacità eventi", value: "Fino a 250 ospiti" },
            { label: "Razza allevata", value: "Cavallo Murgese" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-display text-2xl font-semibold text-terracotta md:text-3xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm uppercase tracking-wider text-ink/50">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:px-12">
        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">Vieni a trovarci</h2>
        <p className="mt-4 font-display text-ink/70">
          Prenota una visita alla masseria o scopri i nostri servizi per eventi, cucina e cavalli.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-terracotta"
          >
            Contattaci su WhatsApp
          </a>
          <a
            href="/eventi"
            className="inline-flex items-center justify-center rounded-full border border-ink/20 px-8 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:border-terracotta hover:text-terracotta"
          >
            Scopri gli eventi
          </a>
        </div>
      </section>

      <VisitSection />
      <SiteFooter />
    </main>
  );
}
