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
  "Scopri gli Appuntamenti a Tavola della Masseria Torre Abbondanza a Noci (Puglia): pranzi della domenica, menù delle festività, cene d'estate in corte e convivi stagionali. Prenota via WhatsApp o telefono.";

const appointmentsSchema = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: poster.title,
          description: `${poster.period} (${poster.price}): ${poster.courses
            .map((c) => `${c.label}: ${c.dishes}`)
            .join(" · ")}`,
          url: `${SITE_URL}/appuntamenti#${poster.id}`,
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Restaurant",
              name: BUSINESS.name,
              telephone: BUSINESS.phone,
            },
          },
        },
      })),
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
          "appuntamenti a tavola masseria torre abbondanza, menu eventi masseria noci, pranzo domenica masseria puglia, menu natale pasqua masseria, prenotazione menu masseria",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/appuntamenti` },
      { property: "og:image", content: absoluteUrl(saporiConvivioImg) },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl(saporiConvivioImg) },
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
