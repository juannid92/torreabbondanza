import { createFileRoute } from "@tanstack/react-router";
import { HeroSoglia } from "@/components/HeroSoglia";
import { ManifestoSection } from "@/components/ManifestoSection";
import { StorySection } from "@/components/StorySection";
import { PlaceSection } from "@/components/PlaceSection";
import { KitchenSection } from "@/components/KitchenSection";
import { MenuSection } from "@/components/MenuSection";
import { EventsSection } from "@/components/EventsSection";
import { SeasonsSection } from "@/components/SeasonsSection";
import { GallerySection } from "@/components/GallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { useLenis } from "@/hooks/use-lenis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Masseria Torre Abbondanza — Noci, Puglia" },
      {
        name: "description",
        content:
          "Masseria del XVIII secolo nel cuore della Murgia: ristorante, eventi e matrimoni a Noci, Puglia.",
      },
      { property: "og:title", content: "Masseria Torre Abbondanza" },
      {
        property: "og:description",
        content:
          "Nel cuore della Murgia, dove la pietra racconta tre secoli e ogni tavola diventa una festa.",
      },
      { property: "og:type", content: "website" },
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
      <EventsSection />
      <SeasonsSection />
      <GallerySection />
      <TestimonialsSection />
      <section id="next-11" className="min-h-screen w-full bg-ivory" />
    </main>
  );
}
