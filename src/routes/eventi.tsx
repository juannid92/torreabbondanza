import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { EventsSection } from "@/components/EventsSection";
import { SeasonsSection } from "@/components/SeasonsSection";
import { EventPostersTeaserSection } from "@/components/EventPostersTeaserSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildEventsJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import eventsImg from "@/assets/events-wedding.jpg";

const PAGE_TITLE = "Sala Ricevimenti e Matrimoni in Masseria nelle Murge — Torre Abbondanza | Noci";
const PAGE_DESCRIPTION =
  "Sala ricevimenti a Noci e location matrimoni in masseria nelle Murge e Valle d'Itria: sala storica del Settecento in pietra, corte tra gli ulivi, cerimonie, battesimi, feste private ed eventi aziendali.";

export const Route = createFileRoute("/eventi")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "sale ricevimento noci, sala ricevimenti noci, matrimoni masseria murge, matrimonio in masseria puglia, location matrimoni noci, location eventi valle d'itria, cerimonie battesimi masseria puglia, feste private murgia",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/eventi` },
      { property: "og:image", content: absoluteUrl(eventsImg) },
      {
        property: "og:image:alt",
        content: "Matrimoni ed eventi nella corte della Masseria Torre Abbondanza",
      },
      {
        property: "og:image:alt",
        content: "Matrimoni ed eventi nella corte della Masseria Torre Abbondanza",
      },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl(eventsImg) },
    ],
    links: buildHreflangLinks("/eventi"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildEventsJsonLd(absoluteUrl(eventsImg))),
      },
    ],
  }),
  component: Eventi,
});

function Eventi() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />
      <h1 className="sr-only">{PAGE_TITLE}</h1>
      <EventsSection />
      <SeasonsSection />
      <EventPostersTeaserSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
