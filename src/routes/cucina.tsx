import { createFileRoute } from "@tanstack/react-router";
import { KitchenSection } from "@/components/KitchenSection";
import { MenuSection } from "@/components/MenuSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl } from "@/lib/site";

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
  }),
  component: Cucina,
});

function Cucina() {
  useLenis();
  return (
    <main className="bg-background text-foreground">
      <KitchenSection />
      <MenuSection />
      <SiteFooter />
    </main>
  );
}
