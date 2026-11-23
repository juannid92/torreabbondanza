import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { KitchenSection } from "@/components/KitchenSection";
import { MenuSection } from "@/components/MenuSection";
import { EventPostersTeaserSection } from "@/components/EventPostersTeaserSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildKitchenJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import kitchenImg from "@/assets/kitchen-antipasti.jpg";

const PAGE_TITLE = "La Cucina Pugliese su Prenotazione — Masseria Torre Abbondanza | Noci";
const PAGE_DESCRIPTION =
  "Tradizione pugliese e materie prime della Murgia: menù su misura da €50 a persona per gruppi di almeno 20 ospiti, cerimonie ed eventi a Noci (BA).";

export const Route = createFileRoute("/cucina")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "cucina pugliese noci, ristorante su prenotazione puglia, menu cerimonie masseria, pasta fatta a mano murgia, pranzo gruppi valle d'itria",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/cucina` },
      { property: "og:image", content: absoluteUrl(kitchenImg) },
      {
        property: "og:image:alt",
        content: "Cucina pugliese della tradizione alla Masseria Torre Abbondanza",
      },
      {
        property: "og:image:alt",
        content: "Cucina pugliese della tradizione alla Masseria Torre Abbondanza",
      },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl(kitchenImg) },
    ],
    links: buildHreflangLinks("/cucina"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildKitchenJsonLd(absoluteUrl(kitchenImg))),
      },
    ],
  }),
  component: Cucina,
});

function Cucina() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />
      <h1 className="sr-only">{PAGE_TITLE}</h1>
      <KitchenSection />
      <MenuSection />
      <EventPostersTeaserSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
