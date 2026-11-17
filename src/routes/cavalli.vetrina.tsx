import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { HorsesShowcase } from "@/components/HorsesShowcase";
import { VisitSection } from "@/components/VisitSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, BUSINESS } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/* Schema JSON-LD: Product + Offer per vendita cavalli (SEO internazionale)   */
/* -------------------------------------------------------------------------- */
const horsesForSaleSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Cavalli Murgesi in vendita — Torre Abbondanza",
  description:
    "Allevamento e vendita cavalli Murgesi iscritti al Registro Anagrafico. Export disponibile in Europa, Russia, Cina e worldwide.",
  url: `${SITE_URL}/cavalli/vetrina`,
  numberOfItems: 3,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "Nero di Torre — Cavallo Murgese Stallone",
        description:
          "Stallone Murgese morello, nato 2019, 165 cm. Dressage base, attacchi d'epoca. Pedigree certificato.",
        brand: { "@type": "Brand", name: "Masseria Torre Abbondanza" },
        category: "Cavallo Murgese",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "EUR",
          price: "0", // Su richiesta — prezzo non pubblico
          priceValidUntil: "2027-12-31",
          seller: {
            "@type": "Organization",
            name: BUSINESS.name,
            telephone: BUSINESS.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: BUSINESS.address.street,
              addressLocality: BUSINESS.address.locality,
              addressRegion: BUSINESS.address.region,
              postalCode: BUSINESS.address.postalCode,
              addressCountry: BUSINESS.address.country,
            },
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: [
              { "@type": "DefinedRegion", addressCountry: "IT" },
              { "@type": "DefinedRegion", addressCountry: "DE" },
              { "@type": "DefinedRegion", addressCountry: "FR" },
              { "@type": "DefinedRegion", addressCountry: "ES" },
              { "@type": "DefinedRegion", addressCountry: "GB" },
              { "@type": "DefinedRegion", addressCountry: "RU" },
              { "@type": "DefinedRegion", addressCountry: "CN" },
              { "@type": "DefinedRegion", addressCountry: "KZ" },
            ],
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "Baio Antico — Cavallo Murgese Castrone",
        description:
          "Castrone Murgese baio scuro, nato 2017, 162 cm. Attacchi d'epoca avanzati, sella, campagna.",
        brand: { "@type": "Brand", name: "Masseria Torre Abbondanza" },
        category: "Cavallo Murgese",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "EUR",
          price: "0",
          priceValidUntil: "2027-12-31",
          seller: {
            "@type": "Organization",
            name: BUSINESS.name,
            telephone: BUSINESS.phone,
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Product",
        name: "Ombra del Sud — Cavallo Murgese Giumenta",
        description:
          "Giumenta Murgese morella, nata 2020, 160 cm. Dressage elementare, potenziale sportivo.",
        brand: { "@type": "Brand", name: "Masseria Torre Abbondanza" },
        category: "Cavallo Murgese",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "EUR",
          price: "0",
          priceValidUntil: "2027-12-31",
          seller: {
            "@type": "Organization",
            name: BUSINESS.name,
            telephone: BUSINESS.phone,
          },
        },
      },
    },
  ],
};

export const Route = createFileRoute("/cavalli/vetrina")({
  head: () => ({
    meta: [
      { title: "Vendita Cavalli Murgesi — Torre Abbondanza | Murgese Horses for Sale" },
      {
        name: "description",
        content:
          "Allevamento e vendita cavalli Murgesi iscritti al Registro Anagrafico. Soggetti per dressage, attacchi d'epoca e turismo equestre. Export in Europa, Russia, Cina. Video, foto e pedigree disponibili.",
      },
      {
        name: "keywords",
        content:
          "cavalli murgesi vendita, murgese horse for sale, купить мурадскую лошадь, 穆尔杰斯马出售, cavalli puglia, allevamento murgese, export horses italy",
      },
      { property: "og:title", content: "Vendita Cavalli Murgesi — Torre Abbondanza" },
      {
        property: "og:description",
        content:
          "Murgese horses for sale. Registered breeding stock. EU, Russia, China export available.",
      },
      { property: "og:type", content: "product.group" },
      { property: "og:url", content: `${SITE_URL}/cavalli/vetrina` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cavalli/vetrina` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(horsesForSaleSchema),
      },
    ],
  }),
  component: CavalliVetrina,
});

function CavalliVetrina() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />
      <HorsesShowcase />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
