import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import eventsWedding from "@/assets/events-wedding.jpg";
import eventsCeremony from "@/assets/events-ceremony.jpg";
import eventsCarriage from "@/assets/events-carriage.jpg";
import eventsSpaceDay from "@/assets/events-space-day.jpg";
import eventsSpaceNight from "@/assets/events-space-night.jpg";
import eventsTablePano from "@/assets/events-table-pano.jpg";
import murgeseStudio from "@/assets/murgese-studio.jpg";
import murgeseRider from "@/assets/murgese-rider.jpg";
import murgeseTrotting from "@/assets/murgese-trotting.jpg";
import horseGallop from "@/assets/horse-gallop.jpg";
import horsesTradition from "@/assets/horses-tradition.jpg";
import kitchenAntipasti from "@/assets/kitchen-antipasti.jpg";
import kitchenPrimi from "@/assets/kitchen-primi.jpg";
import kitchenSecondi from "@/assets/kitchen-secondi.jpg";
import kitchenDolci from "@/assets/kitchen-dolci.jpg";
import placeMasseria from "@/assets/place-masseria-new.jpg";
import placeOlives from "@/assets/place-olives.webp";
import placeHills from "@/assets/place-hills.webp";

const GALLERY_IMAGES = [
  { src: eventsWedding, alt: "Matrimonio nella corte della masseria", category: "eventi" },
  { src: murgeseStudio, alt: "Cavallo Murgese morello in posa", category: "cavalli" },
  { src: kitchenAntipasti, alt: "Antipasti tradizionali pugliesi", category: "cucina" },
  {
    src: placeMasseria,
    alt: "Vista panoramica della Masseria Torre Abbondanza",
    category: "luogo",
  },
  {
    src: eventsCeremony,
    alt: "Cerimonia nella sala storica con volte in pietra",
    category: "eventi",
  },
  {
    src: murgeseRider,
    alt: "Cavaliere in sella a cavallo Murgese nella Murgia",
    category: "cavalli",
  },
  {
    src: kitchenPrimi,
    alt: "Orecchiette fatte a mano con ragù della domenica",
    category: "cucina",
  },
  {
    src: eventsCarriage,
    alt: "Arrivo in carrozza d'epoca trainata da cavalli Murgesi",
    category: "eventi",
  },
  { src: placeOlives, alt: "Giardino di ulivi secolari della masseria", category: "luogo" },
  { src: murgeseTrotting, alt: "Cavallo Murgese al trotto nel pascolo", category: "cavalli" },
  { src: kitchenSecondi, alt: "Involtino di carne al sugo della tradizione", category: "cucina" },
  { src: eventsSpaceDay, alt: "Sala eventi allestita per pranzo di nozze", category: "eventi" },
  { src: horseGallop, alt: "Cavallo Murgese al galoppo nella Murgia", category: "cavalli" },
  { src: kitchenDolci, alt: "Tortino al cioccolato artigianale", category: "cucina" },
  { src: eventsSpaceNight, alt: "Corte illuminata per evento serale", category: "eventi" },
  { src: placeHills, alt: "Colline della Murgia dei Trulli dalla masseria", category: "luogo" },
  {
    src: horsesTradition,
    alt: "Sfilata di Attacchi d'Epoca con cavalli Murgesi",
    category: "cavalli",
  },
  {
    src: eventsTablePano,
    alt: "Allestimento tavola per cerimonia in masseria",
    category: "eventi",
  },
] as const;

const gallerySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageGallery",
      "@id": `${SITE_URL}/gallery#gallery`,
      name: "Galleria Fotografica — Masseria Torre Abbondanza",
      description:
        "Foto della Masseria Torre Abbondanza: eventi, matrimoni, cucina pugliese, cavalli Murgesi e il luogo nella Murgia dei Trulli.",
      url: `${SITE_URL}/gallery`,
      image: GALLERY_IMAGES.map((img) => ({
        "@type": "ImageObject",
        contentUrl: absoluteUrl(img.src),
        caption: img.alt,
      })),
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Galleria", path: "/gallery" },
    ]),
  ],
};

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galleria Fotografica — Masseria Torre Abbondanza" },
      {
        name: "description",
        content:
          "Foto della Masseria Torre Abbondanza: matrimoni, cerimonie, cucina tradizionale pugliese, cavalli Murgesi e la corte del Settecento nella Murgia.",
      },
      {
        name: "keywords",
        content:
          "foto masseria torre abbondanza, galleria matrimoni masseria puglia, foto cavalli murgesi noci, immagini corte storica murgia, foto cucina pugliese",
      },
      { property: "og:title", content: "Galleria Fotografica — Masseria Torre Abbondanza" },
      {
        property: "og:description",
        content:
          "Scopri la masseria attraverso le immagini: eventi, cucina, cavalli e il paesaggio della Murgia dei Trulli.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/gallery` },
      { property: "og:image", content: absoluteUrl(eventsWedding) },
      { property: "og:image:alt", content: "Galleria fotografica della Masseria Torre Abbondanza" },
      { name: "twitter:title", content: "Galleria Fotografica — Masseria Torre Abbondanza" },
      {
        name: "twitter:description",
        content:
          "Scopri la masseria attraverso le immagini: eventi, cucina, cavalli e il paesaggio della Murgia dei Trulli.",
      },
      { name: "twitter:image", content: absoluteUrl(eventsWedding) },
    ],
    links: buildHreflangLinks("/gallery"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(gallerySchema) }],
  }),
  component: Gallery,
});

function Gallery() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <span className="text-eyebrow text-terracotta">Il nostro mondo in immagini</span>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
          Galleria fotografica
        </h1>
        <p className="mt-6 max-w-2xl font-display text-lg leading-relaxed text-ink/70 md:text-xl">
          Eventi, cucina, cavalli Murgesi e la bellezza della Murgia dei Trulli: scopri la Masseria
          Torre Abbondanza attraverso le immagini.
        </p>

        {/* Grid masonry-style */}
        <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY_IMAGES.map((img, i) => (
            <figure
              key={i}
              className="mb-4 break-inside-avoid overflow-hidden rounded-lg shadow-soft"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
              <figcaption className="mt-2 text-xs text-ink/50">{img.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
