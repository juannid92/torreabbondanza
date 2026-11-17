import { Outlet, createFileRoute, useMatch } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { HorsesSection } from "@/components/HorsesSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildHorsesJsonLd } from "@/lib/site";
import murgeseImg from "@/assets/murgese-studio.jpg";

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
    links: [{ rel: "canonical", href: `${SITE_URL}/cavalli` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildHorsesJsonLd(absoluteUrl(murgeseImg))),
      },
    ],
  }),
  component: Cavalli,
});

function Cavalli() {
  useLenis();
  const vetrinaMatch = useMatch({ from: "/cavalli/vetrina", shouldThrow: false });

  if (vetrinaMatch) {
    return <Outlet />;
  }

  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />
      <HorsesSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
