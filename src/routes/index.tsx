import { createFileRoute } from "@tanstack/react-router";
import { HeroSoglia } from "@/components/HeroSoglia";
import { ManifestoSection } from "@/components/ManifestoSection";
import { StorySection } from "@/components/StorySection";
import { PlaceSection } from "@/components/PlaceSection";
import { KitchenSection } from "@/components/KitchenSection";
import { MenuSection } from "@/components/MenuSection";
import { HorsesSection } from "@/components/HorsesSection";
import { EventsSection } from "@/components/EventsSection";
import { GallerySection } from "@/components/GallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import heroImage from "@/assets/hero-masseria.jpg";
import { absoluteUrl, buildRestaurantJsonLd } from "@/lib/site";

// I meta tag comuni sono definiti una sola volta in __root.tsx.
// Qui resta solo ciò che è specifico della home: i dati strutturati.
export const Route = createFileRoute("/")({
  head: () => ({
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
    <main className="bg-background text-foreground">
      <HeroSoglia />
      <ManifestoSection />
      <StorySection />
      <PlaceSection />
      <KitchenSection />
      <MenuSection />
      <HorsesSection />
      {/* Eventi monta al suo interno la fascia "L'anno alla masseria"
          (ex sezione 08): le stagioni vivono dentro EventsSection. */}
      <EventsSection />
      <GallerySection />
      <TestimonialsSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
