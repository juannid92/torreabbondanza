import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { EVENT_POSTERS, EventPostersShowcase } from "@/components/EventPostersShowcase";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { BUSINESS, SITE_URL, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import saporiConvivioImg from "@/assets/sapori-convivio.jpg";

const PAGE_TITLE = "Locandine Eventi e Menù in Masseria — Masseria Torre Abbondanza | Noci";
const PAGE_DESCRIPTION =
  "Scopri tutte le locandine degli eventi e dei menù della Masseria Torre Abbondanza a Noci (Puglia): pranzi della domenica, festività, cene d'estate e stagioni. Prenota subito via WhatsApp o telefono.";

const postersSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/locandine#list`,
      name: "Locandine Eventi e Menù — Masseria Torre Abbondanza",
      description: PAGE_DESCRIPTION,
      url: `${SITE_URL}/locandine`,
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
          url: `${SITE_URL}/locandine#${poster.id}`,
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
      { name: "Locandine Eventi & Menù", path: "/locandine" },
    ]),
  ],
};

export const Route = createFileRoute("/locandine")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "locandine masseria torre abbondanza, menu eventi masseria noci, pranzo domenica masseria puglia, menu natale pasqua masseria, prenotazione menu masseria",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/locandine` },
      { property: "og:image", content: absoluteUrl(saporiConvivioImg) },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl(saporiConvivioImg) },
    ],
    links: buildHreflangLinks("/locandine"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(postersSchema),
      },
    ],
  }),
  component: Locandine,
});

function Locandine() {
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
