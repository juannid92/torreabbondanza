import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { EventsSection } from "@/components/EventsSection";
import { SeasonsSection } from "@/components/SeasonsSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildEventsJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import eventsImg from "@/assets/events-space-day.jpg";

const PAGE_TITLE = "Eventi, Matrimoni e Cerimonie — Masseria Torre Abbondanza | Noci, Puglia";
const PAGE_DESCRIPTION =
  "Matrimoni, cerimonie civili e simboliche, battesimi e feste private in una masseria del Settecento tra sala storica in pietra e uliveto secolare nella Murgia.";

export const Route = createFileRoute("/eventi")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "matrimonio in masseria puglia, location matrimoni noci, location eventi valle d'itria, cerimonie battesimi masseria puglia, feste private murgia",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/eventi` },
      { property: "og:image", content: absoluteUrl(eventsImg) },
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
      <EventsSection />
      <SeasonsSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
