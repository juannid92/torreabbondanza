import { Outlet, createFileRoute, useMatch } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { HorsesSection } from "@/components/HorsesSection";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildHorsesJsonLd } from "@/lib/site";
import murgeseImg from "@/assets/murgese-studio.jpg";

const PAGE_TITLE = "I Cavalli Murgesi — Allevamento ed Esperienze | Masseria Torre Abbondanza";
const PAGE_DESCRIPTION =
  "Allevamento cavalli Murgesi nella Murgia di Noci: soggetti iscritti al Registro Anagrafico (suffisso T.A.), esperienze equestri e Sfilata di Attacchi d'Epoca.";

export const Route = createFileRoute("/cavalli")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "cavalli murgesi noci, allevamento cavalli murgesi puglia, attacchi d'epoca murgia, passeggiate a cavallo valle d'itria, registro anagrafico murgese",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/cavalli` },
      { property: "og:image", content: absoluteUrl(murgeseImg) },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl(murgeseImg) },
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
