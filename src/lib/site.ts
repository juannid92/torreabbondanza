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
 * Volutamente NON includono orari di apertura, coordinate geografiche,
 * fascia di prezzo e partita IVA: vanno aggiunti solo con dati confermati
 * dalla proprietà, perché dati strutturati inesatti danneggiano il
 * posizionamento invece di aiutarlo.
 */
export function buildRestaurantJsonLd(imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#masseria`,
    name: BUSINESS.name,
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
    servesCuisine: "Pugliese",
    acceptsReservations: true,
    sameAs: [BUSINESS.instagram.url, BUSINESS.facebook.url],
  };
}
