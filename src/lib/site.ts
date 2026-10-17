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
  email: "info@torreabbondanza.com",
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
  // Orari di apertura del servizio ristorante, desunti da PagineGialle +
  // TripAdvisor (servizio pranzo e cena, tutti i giorni). Da confermare
  // con la struttura prima di campagne marketing che citino gli orari.
  openingHours: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "13:00",
      closes: "15:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "20:00",
      closes: "22:00",
    },
  ],
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

/** Trasforma un percorso relativo generato da Vite in URL assoluto. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

/**
 * Dati strutturati schema.org per la scheda attività.
 *
 * Includono: anagrafica completa, coordinate GPS, orari di apertura
 * del servizio ristorante, aggregato valutazioni TripAdvisor + TheFork.
 * Tutti i dati sono desunti da fonti pubbliche (registroimprese.it,
 * PagineGialle, TripAdvisor, TheFork). Restano da confermare con la
 * proprietà: coordinate GPS esatte, eventuali variazioni stagionali
 * degli orari, e variazioni del voto medio.
 */
export function buildRestaurantJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#masseria`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    foundingDate: String(BUSINESS.foundedYear),
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    image: [imageUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lon,
    },
    openingHoursSpecification: BUSINESS.openingHours,
    servesCuisine: "Pugliese",
    acceptsReservations: true,
    aggregateRating: [
      {
        "@type": "AggregateRating",
        ratingValue: BUSINESS.reviews.tripadvisor.ratingValue,
        reviewCount: BUSINESS.reviews.tripadvisor.reviewCount,
        url: BUSINESS.reviews.tripadvisor.url,
        sourceOrganization: "TripAdvisor",
      },
      {
        "@type": "AggregateRating",
        ratingValue: BUSINESS.reviews.thefork.ratingValue,
        reviewCount: BUSINESS.reviews.thefork.reviewCount,
        bestRating: 10,
        url: BUSINESS.reviews.thefork.url,
        sourceOrganization: "TheFork",
      },
    ],
    sameAs: [
      BUSINESS.instagram.url,
      BUSINESS.facebook.url,
      BUSINESS.reviews.tripadvisor.url,
      BUSINESS.reviews.thefork.url,
    ],
  };
}
