import { createFileRoute } from "@tanstack/react-router";
import { IntroOverlay } from "@/components/IntroOverlay";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSoglia } from "@/components/HeroSoglia";
import { ManifestoSection } from "@/components/ManifestoSection";
import { StorySection } from "@/components/StorySection";
import { PlaceSection } from "@/components/PlaceSection";
import { KitchenSection } from "@/components/KitchenSection";
import { MenuSection } from "@/components/MenuSection";
import { EventPostersTeaserSection } from "@/components/EventPostersTeaserSection";
import { HorsesSection } from "@/components/HorsesSection";
import { EventsSection } from "@/components/EventsSection";
import { SeasonsSection } from "@/components/SeasonsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import heroImage from "@/assets/hero-masseria.jpg";
import { BUSINESS, SITE_URL, absoluteUrl, buildRestaurantJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";

const HOME_TITLE = `${BUSINESS.name} — Ristorante, Agriturismo e Sala Ricevimenti | Noci, Puglia`;
const HOME_DESCRIPTION =
  "Masseria e agriturismo del Settecento a Noci (BA), nelle Murge: ristorante pugliese per pranzo della domenica e gruppi, sala ricevimenti per matrimoni ed eventi, allevamento cavalli Murgesi.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      {
        name: "keywords",
        content:
          "masseria torre abbondanza, masseria noci, agriturismo noci, agriturismo noci pranzo, ristoranti noci, sale ricevimento noci, sala ricevimenti noci, matrimoni masseria murge, matrimonio in masseria puglia, location eventi valle d'itria, cavalli murgesi noci",
      },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: absoluteUrl(heroImage) },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl(heroImage) },
    ],
    links: buildHreflangLinks("/"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildRestaurantJsonLd(absoluteUrl(heroImage))),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <IntroOverlay />
      <SiteHeader />
      <HeroSoglia />
      <ManifestoSection />
      <StorySection />
      <PlaceSection />
      <KitchenSection />
      <MenuSection />
      <EventPostersTeaserSection />
      <HorsesSection />
      <EventsSection />
      <SeasonsSection />
      <TestimonialsSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
