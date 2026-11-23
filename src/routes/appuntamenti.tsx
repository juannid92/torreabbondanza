import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { EVENT_POSTERS, EventPostersShowcase } from "@/components/EventPostersShowcase";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { BUSINESS, SITE_URL, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import saporiConvivioImg from "@/assets/sapori-convivio.jpg";

const PAGE_TITLE =
  "Appuntamenti a Tavola — Menù delle Ricorrenze & Convivi | Masseria Torre Abbondanza";
const PAGE_DESCRIPTION =
  "Scopri gli Appuntamenti a Tavola della Masseria Torre Abbondanza a Noci (Puglia): pranzi della domenica, menù delle festività (Pasqua, 1° Maggio, Natale), cene d'estate in corte e convivi stagionali. Prenota via WhatsApp o telefono.";
const OG_IMAGE = absoluteUrl(saporiConvivioImg);

function extractMinPrice(priceLabel: string): number {
  const match = priceLabel.match(/\d+/);
  return match ? Number(match[0]) : 50;
}

const appointmentsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/appuntamenti#webpage`,
      url: `${SITE_URL}/appuntamenti`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "it-IT",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#masseria` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
      },
      mainEntity: { "@id": `${SITE_URL}/appuntamenti#list` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/appuntamenti#list`,
      name: "Appuntamenti a Tavola — Menù & Ricorrenze | Masseria Torre Abbondanza",
      description: PAGE_DESCRIPTION,
      url: `${SITE_URL}/appuntamenti`,
      numberOfItems: EVENT_POSTERS.length,
      itemListElement: EVENT_POSTERS.map((poster, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Menu",
          "@id": `${SITE_URL}/appuntamenti#${poster.id}`,
          name: poster.title,
          description:
            poster.courses.length > 0
              ? `${poster.subtitle}. ${poster.period} (${poster.price}): ${poster.highlight}.`
              : `${poster.subtitle}. ${poster.period} (${poster.price}).`,
          url: `${SITE_URL}/appuntamenti#${poster.id}`,
          image: absoluteUrl(poster.image),
          inLanguage: "it-IT",
          ...(poster.courses.length > 0
            ? {
                hasMenuSection: poster.courses.map((course) => ({
                  "@type": "MenuSection",
                  name: course.label,
                  description: course.dishes,
                })),
              }
            : {}),
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "EUR",
              minPrice: extractMinPrice(poster.price),
            },
            availability: "https://schema.org/InStock",
            url: poster.whatsappUrl,
            seller: {
              "@type": "Restaurant",
              "@id": `${SITE_URL}/#masseria`,
              name: BUSINESS.name,
              telephone: BUSINESS.phone,
            },
          },
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/appuntamenti#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Come si prenota un Appuntamento a Tavola alla Masseria Torre Abbondanza?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Ogni appuntamento in calendario si prenota direttamente via WhatsApp o telefono al numero ${BUSINESS.phone} con almeno 2 giorni di anticipo, indicando il numero di ospiti e il menù scelto.`,
          },
        },
        {
          "@type": "Question",
          name: "Quanto costano i menù delle festività e i pranzi della domenica?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le proposte partono da 50 euro a persona per i pranzi della domenica e le sere d'estate in corte, da 55 euro per i convivi di primavera e autunno, e da 60 euro per le festività principali come Pasqua, Pasquetta, Immacolata e Natale, con vino locale, acqua e caffè inclusi.",
          },
        },
        {
          "@type": "Question",
          name: "Sono disponibili varianti per intolleranze, ospiti vegetariani o bambini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sì, su richiesta al momento della prenotazione prepariamo varianti vegetariane, vegane, senza glutine e menù dedicati ai bambini per tutti gli appuntamenti a tavola.",
          },
        },
      ],
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Appuntamenti a Tavola", path: "/appuntamenti" },
    ]),
  ],
};

export const Route = createFileRoute("/appuntamenti")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "appuntamenti a tavola masseria torre abbondanza, menu eventi masseria noci, pranzo domenica masseria puglia, menu natale pasqua masseria, pranzo 1 maggio murgia, cene estive masseria valle d'itria, prenotazione menu masseria",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/appuntamenti` },
      { property: "og:image", content: OG_IMAGE },
      {
        property: "og:image:alt",
        content: "Tavola imbandita per gli Appuntamenti a Tavola alla Masseria Torre Abbondanza",
      },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: buildHreflangLinks("/appuntamenti"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(appointmentsSchema),
      },
    ],
  }),
  component: Appuntamenti,
});

function Appuntamenti() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />
      <EventPostersShowcase />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
