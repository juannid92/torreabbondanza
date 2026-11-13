import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { EventsSection } from "@/components/EventsSection";
import { SeasonsSection } from "@/components/SeasonsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildEventsJsonLd } from "@/lib/site";
import eventsImg from "@/assets/events-space-day.jpg";

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
    <main className="bg-background text-foreground">
      <SiteHeader />
      <EventsSection />
      <SeasonsSection />
      <SiteFooter />
    </main>
  );
}
