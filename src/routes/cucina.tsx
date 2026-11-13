import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { KitchenSection } from "@/components/KitchenSection";
import { MenuSection } from "@/components/MenuSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildKitchenJsonLd } from "@/lib/site";
import kitchenImg from "@/assets/kitchen-antipasti.jpg";

export const Route = createFileRoute("/cucina")({
  head: () => ({
    meta: [
      { title: "La Cucina - Torre Abbondanza" },
      {
        name: "description",
        content:
          "Tradizione pugliese e materie prime fresche del territorio. Menù su misura per cerimonie ed eventi alla Masseria Torre Abbondanza.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}cucina` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildKitchenJsonLd(absoluteUrl(kitchenImg))),
      },
    ],
  }),
  component: Cucina,
});

function Cucina() {
  useLenis();
  return (
    <main className="bg-background text-foreground">
      <SiteHeader />
      <KitchenSection />
      <MenuSection />
      <SiteFooter />
    </main>
  );
}
