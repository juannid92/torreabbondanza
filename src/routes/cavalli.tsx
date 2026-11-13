import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { HorsesSection } from "@/components/HorsesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/cavalli")({
  head: () => ({
    meta: [
      { title: "I Cavalli Murgesi - Torre Abbondanza" },
      {
        name: "description",
        content:
          "L'anima nera della Murgia: cavalli Murgesi, tradizione equestre e attacchi d'epoca alla Masseria Torre Abbondanza.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}cavalli` }],
  }),
  component: Cavalli,
});

function Cavalli() {
  useLenis();
  return (
    <main className="bg-background text-foreground">
      <SiteHeader />
      <HorsesSection />
      <SiteFooter />
    </main>
  );
}
