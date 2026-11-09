import { createFileRoute } from "@tanstack/react-router";
import { EventsSection } from "@/components/EventsSection";
import { SeasonsSection } from "@/components/SeasonsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/eventi")({
  head: () => ({
    meta: [
      { title: "Eventi e Matrimoni - Torre Abbondanza" },
      {
        name: "description",
        content:
          "Matrimoni, cerimonie e feste private nella masseria del Settecento. Esperienze stagionali tra natura e tradizione pugliese.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}eventi` }],
  }),
  component: Eventi,
});

function Eventi() {
  useLenis();
  return (
    <main className="bg-background text-foreground">
      <EventsSection />
      <SeasonsSection />
      <SiteFooter />
    </main>
  );
}
