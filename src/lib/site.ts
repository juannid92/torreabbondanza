/**
 * Dati canonici dell'attività.
 *
 * Unica fonte di verità per meta tag, dati strutturati e componenti UI:
 * se un recapito cambia, si modifica soltanto questo file.
 */

/**
 * Dominio di produzione.
 * Serve per canonical, og:url e per rendere assoluti gli URL delle immagini
 * social (Open Graph non accetta percorsi relativi).
 * Se il dominio definitivo dovesse essere diverso, si cambia solo questa riga.
 */
export const SITE_URL = "https://torreabbondanza.com";

/**
 * Google Tag ID (GA4 / Google Tag Gateway).
 * Configurabile tramite variabile d'ambiente `VITE_GOOGLE_TAG_ID` (es. G-XXXXXXXXXX)
 * oppure direttamente qui prima del deploy.
 */
const rawGoogleTagId =
  typeof import.meta !== "undefined"
    ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
        ?.VITE_GOOGLE_TAG_ID
    : undefined;

export const GOOGLE_TAG_ID: string = rawGoogleTagId?.trim() || "G-TORREABBONDANZA";

export const BUSINESS = {
  name: "Masseria Torre Abbondanza",
  legalName: "Masseria Torre Abbondanza - Società Agricola Semplice dei Fratelli Giunta",
  vatId: "IT06351980724",
  fiscalCode: "06351980724",
  rea: "BA - 479911",
  foundedYear: 2005,
  tagline: "La tavola e il galoppo, nel cuore della Murgia.",
  description:
    "Masseria del Settecento nel cuore della Murgia di Noci: tavola su prenotazione, cavalli Murgesi ed eventi in Puglia.",
  phone: "+39 338 483 4318",
  phoneTel: "+393384834318",
  whatsappNumber: "393384834318",
  whatsappUrl: "https://wa.me/393384834318",
  address: {
    line1: "Strada Vicinale per Massafra / SP 211",
    line2: "Zona E n. 49 — 70015 Noci (BA)",
    street: "Strada Vicinale per Massafra / SP 211, Zona E n. 49",
    locality: "Noci",
    region: "BA",
    postalCode: "70015",
    country: "IT",
  },
  // Coordinate GPS della sede operativa. Fonte: nodo OpenStreetMap 5580359729
  // (https://www.openstreetmap.org/node/5580359729), tag place=isolated_dwelling,
  // name=Masseria Torre Abbondanza. Geocodificate via Nominatim il 2026-10-17.
  // Usate per JSON-LD `geo` e link mappa.
  geo: { lat: 40.730579, lon: 17.1307539 },
  reviews: {
    tripadvisor: {
      url: "https://www.tripadvisor.it/Restaurant_Review-g1057217-d5960944-Reviews-Masseria_Torre_Abbondanza-Noci_Province_of_Bari_Puglia.html",
      ratingValue: 4.4,
      reviewCount: 213,
    },
    thefork: {
      url: "https://www.thefork.it/ristorante/masseria-torre-abbondanza-r201438",
      ratingValue: 9.7,
      reviewCount: 50,
    },
  },
  instagram: {
    url: "https://www.instagram.com/masseria_torre_abbondanza/",
    handle: "@masseria_torre_abbondanza",
  },
  facebook: {
    url: "https://www.facebook.com/MasseriaTorreAbbondanza",
    handle: "MasseriaTorreAbbondanza",
  },
} as const;

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: BUSINESS.address.street,
  addressLocality: BUSINESS.address.locality,
  addressRegion: BUSINESS.address.region,
  postalCode: BUSINESS.address.postalCode,
  addressCountry: BUSINESS.address.country,
} as const;

const GEO_COORDINATES = {
  "@type": "GeoCoordinates",
  latitude: BUSINESS.geo.lat,
  longitude: BUSINESS.geo.lon,
} as const;

const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.geo.lat},${BUSINESS.geo.lon}`;

/** Trasforma un percorso relativo generato da Vite in URL assoluto. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

/** Genera uno schema BreadcrumbList per migliorare i rich snippet nella SERP. */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Dati strutturati schema.org per la pagina Cucina (`@graph`: Restaurant + Menu + BreadcrumbList).
 */
export function buildKitchenJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${SITE_URL}/cucina#kitchen`,
        name: `${BUSINESS.name} — Cucina`,
        description:
          "Cucina pugliese su prenotazione per cerimonie ed eventi (minimo 20 ospiti, a partire da 50 euro a persona): antipasti di terra, primi fatti a mano, secondi della tradizione e dolci artigianali.",
        url: `${SITE_URL}/cucina`,
        image: [imageUrl],
        servesCuisine: ["Pugliese", "Cucina tradizionale italiana"],
        priceRange: "€€€",
        acceptsReservations: true,
        telephone: BUSINESS.phone,
        address: POSTAL_ADDRESS,
        geo: GEO_COORDINATES,
        hasMap: MAPS_HREF,
        sameAs: [BUSINESS.instagram.url, BUSINESS.facebook.url],
        hasMenu: {
          "@type": "Menu",
          name: "Menù stagionale su misura",
          description:
            "Composto su prenotazione con almeno due giorni di anticipo per gruppi da 20 persone; disponibili varianti vegetariane, vegane, senza glutine e menù bambini.",
          hasMenuSection: [
            {
              "@type": "MenuSection",
              name: "Antipasti di terra",
              description:
                "Olive fritte, salumi e formaggi locali, parmigiana, focaccia calda, purè di fave bianche e peperoni fritti.",
            },
            {
              "@type": "MenuSection",
              name: "Primi della casa",
              description:
                "Pasta fresca tirata a mano, cavatelli e orecchiette con ragù della domenica e funghi cardoncelli della Murgia.",
            },
            {
              "@type": "MenuSection",
              name: "Secondi",
              description:
                "Involtino di carne al sugo, carni selezionate e cotture lente al vino rosso pugliese con erbe spontanee.",
            },
            {
              "@type": "MenuSection",
              name: "Dolci fatti a mano",
              description:
                "Dolci artigianali della casa, tra cui tortino al cioccolato con fragole.",
            },
          ],
        },
      },
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "La Cucina", path: "/cucina" },
      ]),
    ],
  };
}

/**
 * Dati strutturati schema.org per la pagina Cavalli (`@graph`: LocalBusiness + Service + BreadcrumbList).
 */
export function buildHorsesJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/cavalli#horses`,
        name: `${BUSINESS.name} — Allevamento Cavalli Murgesi`,
        description:
          "Allevamento di cavalli Murgesi nella Murgia di Noci: soggetti iscritti al Registro Anagrafico (suffisso T.A.), esperienze equestri e Sfilata di Attacchi d'Epoca.",
        url: `${SITE_URL}/cavalli`,
        image: [imageUrl],
        telephone: BUSINESS.phone,
        address: POSTAL_ADDRESS,
        geo: GEO_COORDINATES,
        hasMap: MAPS_HREF,
        sameAs: [BUSINESS.instagram.url, BUSINESS.facebook.url],
      },
      {
        "@type": "Service",
        name: "Esperienze equestri e Attacchi d'Epoca con cavalli Murgesi",
        provider: { "@id": `${SITE_URL}/cavalli#horses` },
        areaServed: { "@type": "Place", name: "Murgia e Valle d'Itria, Puglia" },
        description:
          "Visite guidate in scuderia, passeggiate a cavallo tra gli ulivi e arrivo in carrozza d'epoca per matrimoni e cerimonie.",
      },
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "I Cavalli Murgesi", path: "/cavalli" },
      ]),
    ],
  };
}

/**
 * Dati strutturati schema.org per la pagina Eventi (`@graph`: EventVenue + BreadcrumbList).
 */
export function buildEventsJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EventVenue",
        "@id": `${SITE_URL}/eventi#venue`,
        name: `${BUSINESS.name} — Eventi & Matrimoni`,
        description:
          "Masseria del Settecento per matrimoni, cerimonie civili e simboliche, battesimi, compleanni e feste private nel cuore della Murgia di Noci.",
        url: `${SITE_URL}/eventi`,
        image: [imageUrl],
        telephone: BUSINESS.phone,
        maximumAttendeeCapacity: 250,
        address: POSTAL_ADDRESS,
        geo: GEO_COORDINATES,
        hasMap: MAPS_HREF,
        amenityFeature: [
          {
            "@type": "LocationFeatureSpecification",
            name: "Sala storica con volte in pietra del Settecento",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Corte esterna e giardino di ulivi secolari",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Cucina pugliese interna su misura",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Arrivo in carrozza d'epoca con cavalli Murgesi",
            value: true,
          },
        ],
        sameAs: [BUSINESS.instagram.url, BUSINESS.facebook.url],
      },
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Eventi e Matrimoni", path: "/eventi" },
      ]),
    ],
  };
}

/**
 * Dati strutturati schema.org completi per la Homepage (`@graph`: WebSite + Restaurant/EventVenue/LocalBusiness + FAQPage).
 */
export function buildRestaurantJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        description: BUSINESS.description,
        inLanguage: "it-IT",
        publisher: { "@id": `${SITE_URL}/#masseria` },
      },
      {
        "@type": ["Restaurant", "EventVenue", "LocalBusiness"],
        "@id": `${SITE_URL}/#masseria`,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        foundingDate: String(BUSINESS.foundedYear),
        vatID: BUSINESS.vatId,
        iso6523Code: BUSINESS.fiscalCode,
        description: BUSINESS.description,
        url: SITE_URL,
        telephone: BUSINESS.phone,
        image: [imageUrl],
        priceRange: "€€€",
        maximumAttendeeCapacity: 250,
        address: POSTAL_ADDRESS,
        geo: GEO_COORDINATES,
        hasMap: MAPS_HREF,
        servesCuisine: "Pugliese",
        acceptsReservations: true,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: BUSINESS.reviews.tripadvisor.ratingValue,
          reviewCount: BUSINESS.reviews.tripadvisor.reviewCount,
          bestRating: 5,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servizi Masseria Torre Abbondanza",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Matrimoni, cerimonie e feste private in masseria",
                url: `${SITE_URL}/eventi`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Cucina pugliese su prenotazione per gruppi (min. 20 persone)",
                url: `${SITE_URL}/cucina`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Allevamento, esperienze equestri e vendita cavalli Murgesi",
                url: `${SITE_URL}/cavalli`,
              },
            },
          ],
        },
        sameAs: [
          BUSINESS.instagram.url,
          BUSINESS.facebook.url,
          BUSINESS.reviews.tripadvisor.url,
          BUSINESS.reviews.thefork.url,
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Come funziona la prenotazione del ristorante alla Masseria Torre Abbondanza?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "La cucina apre su prenotazione per gruppi di almeno 20 persone con almeno due giorni di anticipo, componendo insieme un menù su misura della tradizione pugliese a partire da 50 euro a persona.",
            },
          },
          {
            "@type": "Question",
            name: "È possibile organizzare matrimoni, battesimi o feste private in masseria?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sì. La masseria del Settecento ospita matrimoni, cerimonie civili e simboliche, battesimi, compleanni, feste private e cene aziendali sia nella sala storica con volte in pietra sia nella corte esterna tra gli ulivi secolari.",
            },
          },
          {
            "@type": "Question",
            name: "Sono disponibili menù vegetariani, vegani, senza glutine o per bambini?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sì, su richiesta vengono preparate proposte dedicate vegetariane, vegane, gluten-free e menù per bambini in linea con le esigenze degli ospiti.",
            },
          },
          {
            "@type": "Question",
            name: "La masseria alleva e vende cavalli Murgesi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sì. La famiglia Giunta alleva in masseria cavalli Murgesi iscritti al Registro Anagrafico (suffisso T.A.), organizza passeggiate ed esperienze equestri, Sfilate di Attacchi d'Epoca ed effettua vendita con spedizione internazionale.",
            },
          },
          {
            "@type": "Question",
            name: "È possibile arrivare in carrozza d'epoca durante una cerimonia o matrimonio?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sì, su richiesta l'ingresso della cerimonia può aprirsi con una carrozza d'epoca trainata dai cavalli Murgesi dell'allevamento della masseria.",
            },
          },
          {
            "@type": "Question",
            name: "Dove si trova esattamente Masseria Torre Abbondanza?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Si trova in Strada Vicinale per Massafra — SP 211, Zona E n. 49, 70015 Noci (BA), nel cuore della Murgia dei Trulli e della Valle d'Itria, a circa 12 minuti da Putignano e Alberobello.",
            },
          },
        ],
      },
    ],
  };
}
