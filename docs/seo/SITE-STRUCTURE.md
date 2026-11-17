# Site Structure — Masseria Torre Abbondanza (v2 Super Detailed)

> Generato: 2026-11-17 | Post-Hydrogen Fix | 8 route live + /cavalli/vetrina export
> Tech: React + TanStack Router + Vite + Nitro (SSG) | Hosting: Cloudflare Pages

---

## Current Live Routes (8 total as of 2026-11-17)

| Route | File | Component(s) | Schema | Status |
|-------|------|-------------|--------|--------|
| `/` | `src/routes/index.tsx` | HeroSoglia, ManifestoSection, StorySection, PlaceSection, KitchenSection, MenuSection, HorsesSection, EventsSection, SeasonsSection, TestimonialsSection, VisitSection, SiteFooter | Restaurant + Organization + AggregateRating | ✅ Live |
| `/cucina` | `src/routes/cucina.tsx` | SiteHeader, KitchenSection, MenuSection, SiteFooter | Restaurant | ✅ Live |
| `/cavalli` | `src/routes/cavalli.tsx` | SiteHeader, HorsesSection, SiteFooter | LocalBusiness | ✅ Live |
| `/cavalli/vetrina` | `src/routes/cavalli.vetrina.tsx` | SiteHeader, HorsesShowcase, SiteFooter | ItemList + Product/Offer (multilingual) | ✅ Live |
| `/eventi` | `src/routes/eventi.tsx` | SiteHeader, EventsSection, SeasonsSection, SiteFooter | EventVenue | ✅ Live |
| `/privacy` | `src/routes/privacy.tsx` | SiteHeader, PrivacyContent, SiteFooter | WebPage | ✅ Live |
| `/cookie` | `src/routes/cookie.tsx` | SiteHeader, CookieContent, SiteFooter | WebPage | ✅ Live |
| `__root` | `src/routes/__root.tsx` | RootShell (html/head/body), GTM, CookieBanner, Outlet | Global meta + consent mode | ✅ Live |

### Anchor IDs in Homepage Sections

| Section | Component | Anchor ID | Nav Link | Notes |
|---------|-----------|-----------|----------|-------|
| Hero | HeroSoglia | — | — | No anchor needed |
| Manifesto | ManifestoSection | — | — | No anchor needed |
| Storia | StorySection | — | — | No anchor needed |
| Luogo | PlaceSection | `#luogo` | ✅ La Masseria | Linked from header |
| Cucina | KitchenSection | — | — | Has dedicated /cucina route |
| Menu | MenuSection | — | — | Included in /cucina |
| Cavalli | HorsesSection | — | — | Has dedicated /cavalli route |
| Eventi | EventsSection | `#eventi` | — | Has dedicated /eventi route |
| Stagioni | SeasonsSection | — | — | Included in /eventi |
| Testimonials | TestimonialsSection | — | — | No anchor needed |
| Visita/Contatti | VisitSection | `#contatti` | ✅ Contatti | Linked from header |
| Footer | SiteFooter | — | — | Global footer |

---

## Target Architecture (32 pages by end of Year 1)

```
/                                       ← Homepage (Restaurant + Organization) [LIVE]
├── /la-masseria                        ← About/storia/founder/team (Organization + HistoricalLandmark) [PHASE 1]
├── /cucina                             ← Cucina pugliese (Restaurant) [LIVE]
│   └── /cucina/menu                    ← Menu stagionale dettagliato (Menu) [PHASE 2]
├── /cavalli                            ← Allevamento Murgesi (LocalBusiness) [LIVE]
│   ├── /cavalli/vetrina                ← Vendita internazionale cavalli (ItemList + Product/Offer) [LIVE]
│   └── /cavalli/esperienze             ← Passeggiate, attacchi, lezioni (Service) [PHASE 2]
├── /eventi                             ← Hub eventi & matrimoni (EventVenue) [LIVE]
│   ├── /eventi/matrimoni               ← Landing matrimoni (Event + Offer) [PHASE 2]
│   ├── /eventi/cerimonie               ← Battesimi, comunioni, cresime (Event) [PHASE 2]
│   └── /eventi/aziende                 ← Corporate, team building (Event) [PHASE 3]
├── /gallery                            ← Portfolio foto/video eventi (ImageGallery) [PHASE 1]
├── /dove-siamo                         ← Mappa, indicazioni, parcheggio (ContactPage + GeoCoordinates) [PHASE 1]
├── /faq                                ← Domande frequenti (FAQPage) [PHASE 1]
├── /blog                               ← Content hub index (BlogPosting collection) [PHASE 1]
│   ├── /blog/storia-masseria-torre-abbondanza
│   ├── /blog/guida-matrimonio-masseria-puglia
│   ├── /blog/periodo-migliore-matrimonio-puglia
│   ├── /blog/cucina-tradizionale-pugliese-eventi
│   ├── /blog/cavalli-murgesi-storia-caratteristiche
│   ├── /blog/location-matrimoni-valle-d-itria
│   ├── /blog/organizzare-battesimo-masseria
│   ├── /blog/eventi-aziendali-puglia-idee
│   ├── /blog/importare-cavallo-dall-italia
│   ├── /blog/capodanno-masseria-puglia
│   ├── /blog/dressage-cavallo-murgese
│   ├── /blog/attacchi-d-epoca-tradizione-pugliese
│   ├── /blog/storia-masserie-pugliesi
│   ├── /blog/tradizioni-equestri-puglia
│   └── /blog/evoluzione-masserie-pugliesi
├── /privacy                            ← Privacy policy [LIVE]
└── /cookie                             ← Cookie policy [LIVE]
```

---

## Schema Markup Map (Complete)

| Page | Primary Schema | Secondary Schema | Key Properties | Status | Validation |
|------|---------------|-----------------|----------------|--------|------------|
| `/` | Restaurant | Organization, AggregateRating | name, address, geo, servesCuisine, acceptsReservations, aggregateRating, sameAs | ✅ Live | GSC Rich Results |
| `/la-masseria` | Organization | HistoricalLandmark | foundingDate, founder, description, image, sameAs, url | 🔲 Phase 1 | Pending |
| `/cucina` | Restaurant | Menu | servesCuisine, hasMenu, acceptsReservations, telephone | ✅ Live | GSC Rich Results |
| `/cucina/menu` | Menu | Restaurant | hasMenuItem[], menuItem.name, menuItem.description, menuItem.offers | 🔲 Phase 2 | Pending |
| `/cavalli` | LocalBusiness | AnimalShelter | name, address, geo, telephone, openingHours, description | ✅ Live | GSC Rich Results |
| `/cavalli/vetrina` | ItemList | Product, Offer | itemListElement[], product.name, product.brand, offers.availability, offers.shippingDetails | ✅ Live | GSC Rich Results |
| `/cavalli/esperienze` | Service | LocalBusiness | serviceType, provider, areaServed, offers, description | 🔲 Phase 2 | Pending |
| `/eventi` | EventVenue | LocalBusiness | name, address, geo, capacity, amenities, telephone | ✅ Live | GSC Rich Results |
| `/eventi/matrimoni` | Event | Offer, EventVenue | eventName, eventAttendanceMode, offers.price, offers.availability, location | 🔲 Phase 2 | Pending |
| `/eventi/cerimonie` | Event | EventVenue | eventName, description, startDate (template), location | 🔲 Phase 2 | Pending |
| `/eventi/aziende` | Event | EventVenue | eventName, description, audience.businessAudience, location | 🔲 Phase 3 | Pending |
| `/gallery` | ImageGallery | BreadcrumbList | image[], caption, contentUrl, breadcrumb | 🔲 Phase 1 | Pending |
| `/dove-siamo` | ContactPage | GeoCoordinates, PostalAddress | geo.lat, geo.lon, address, telephone, openingHours | 🔲 Phase 1 | Pending |
| `/faq` | FAQPage | LocalBusiness | mainEntity[], question, acceptedAnswer.text | 🔲 Phase 1 | Pending |
| `/blog` | CollectionPage | BlogPosting (collection) | numberOfItems, itemListElement | 🔲 Phase 1 | Pending |
| `/blog/*` | BlogPosting | Article, BreadcrumbList | headline, author, datePublished, image, publisher, wordCount | 🔲 Phase 1+ | Per post |
| `/privacy` | WebPage | — | name, description, dateModified | ✅ Live | N/A |
| `/cookie` | WebPage | — | name, description, dateModified | ✅ Live | N/A |

### Schema Implementation Notes

**BreadcrumbList (all pages):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://torreabbondanza.com/" },
    { "@type": "ListItem", "position": 2, "name": "Cavalli", "item": "https://torreabbondanza.com/cavalli" },
    { "@type": "ListItem", "position": 3, "name": "Vetrina", "item": "https://torreabbondanza.com/cavalli/vetrina" }
  ]
}
```

**Product/Offer for /cavalli/vetrina (export-focused):**
```json
{
  "@type": "Product",
  "name": "Nero di Torre — Cavallo Murgese Stallone",
  "brand": { "@type": "Brand", "name": "Masseria Torre Abbondanza" },
  "category": "Cavallo Murgese",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "EUR",
    "price": "0",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingDestination": [
        { "@type": "DefinedRegion", "addressCountry": "IT" },
        { "@type": "DefinedRegion", "addressCountry": "DE" },
        { "@type": "DefinedRegion", "addressCountry": "FR" },
        { "@type": "DefinedRegion", "addressCountry": "ES" },
        { "@type": "DefinedRegion", "addressCountry": "GB" },
        { "@type": "DefinedRegion", "addressCountry": "RU" },
        { "@type": "DefinedRegion", "addressCountry": "CN" },
        { "@type": "DefinedRegion", "addressCountry": "KZ" }
      ]
    }
  }
}
```

**FAQPage for /faq:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto costa organizzare un matrimonio alla Masseria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I prezzi variano in base al numero di ospiti, alla stagione e ai servizi scelti..."
      }
    }
  ]
}
```

---

## Header Navigation (5 voci, already implemented)

| Label | URL | Type | SEO Anchor Text | Priority |
|-------|-----|------|-----------------|----------|
| La Masseria | `/#luogo` | Anchor (PlaceSection) | "masseria torre abbondanza" | High |
| Cucina | `/cucina` | Route | "cucina tradizionale pugliese" | High |
| Cavalli | `/cavalli` | Route | "cavalli murgesi allevamento" | High |
| Eventi | `/eventi` | Route | "eventi e matrimoni puglia" | High |
| Contatti | `/#contatti` | Anchor (VisitSection) | "contatti masseria torre abbondanza" | High |

### Mobile Hamburger Menu
Same 5 items as desktop + expanded footer links on mobile:
- La Masseria
- Cucina
- Cavalli
- Eventi
- Contatti
- ---
- Gallery
- FAQ
- Dove Siamo
- Blog
- Vendita Cavalli (/cavalli/vetrina)

---

## Footer Navigation (Proposed Structure)

```
COLONNA 1: La Masseria
├── La nostra storia → /la-masseria
├── Dove siamo → /dove-siamo
├── Gallery → /gallery
└── FAQ → /faq

COLONNA 2: Servizi
├── Cucina pugliese → /cucina
├── Menu stagionale → /cucina/menu
├── Cavalli Murgesi → /cavalli
├── Esperienze equestri → /cavalli/esperienze
└── Vendita cavalli → /cavalli/vetrina

COLONNA 3: Eventi
├── Matrimoni → /eventi/matrimoni
├── Cerimonie → /eventi/cerimonie
├── Feste private → /eventi (anchor #eventi)
├── Eventi aziendali → /eventi/aziende
└── Prenota una visita → /#contatti

COLONNA 4: Risorse
├── Blog → /blog
├── Recensioni → TripAdvisor (external)
├── TheFork → TheFork (external)
├── Privacy Policy → /privacy
└── Cookie Policy → /cookie
```

---

## Internal Linking Matrix

### Cross-Linking per Pagina

| Source Page | Links To | Anchor Text Example | Context |
|-------------|----------|-------------------|---------|
| `/` home | /eventi/matrimoni | "matrimoni in masseria Puglia" | EventsSection CTA |
| `/` home | /cucina | "scopri la nostra cucina" | KitchenSection link |
| `/` home | /cavalli/vetrina | "cavalli Murgesi in vendita" | HorsesSection link |
| `/` home | /la-masseria | "la nostra storia" | StorySection link |
| `/la-masseria` | /eventi | "organizza il tuo evento" | CTA after history |
| `/la-masseria` | /cucina | "la nostra cucina tradizionale" | Food heritage section |
| `/la-masseria` | /gallery | "vedi le foto della masseria" | Visual gallery link |
| `/la-masseria` | /cavalli | "i nostri cavalli Murgesi" | Equestrian heritage |
| `/cucina` | /eventi/matrimoni | "menu per matrimoni" | Wedding catering CTA |
| `/cucina` | /cucina/menu | "menu completo stagionale" | Menu detail link |
| `/cavalli` | /cavalli/vetrina | "cavalli in vendita" | Sales showcase CTA |
| `/cavalli` | /eventi | "location per eventi con cavalli" | Events with horses |
| `/cavalli` | /cavalli/esperienze | "esperienze equestri" | Riding experiences |
| `/cavalli/vetrina` | /cavalli | "il nostro allevamento" | Breeding info link |
| `/cavalli/vetrina` | /eventi/matrimoni | "matrimoni con carrozza d'epoca" | Wedding carriage link |
| `/cavalli/vetrina` | /faq | "domande frequenti" | Export/shipping FAQ |
| `/eventi` | /cucina | "catering interno" | Food service link |
| `/eventi` | /cavalli | "arrivo in carrozza d'epoca" | Horse carriage link |
| `/eventi` | /gallery | "foto dei nostri eventi" | Portfolio link |
| `/eventi` | /eventi/matrimoni | "matrimoni" | Wedding sub-page |
| `/eventi/matrimoni` | /cucina/menu | "menu nuziale" | Wedding menu link |
| `/eventi/matrimoni` | /cavalli/vetrina | "carrozza d'epoca con Murgesi" | Horse carriage upsell |
| `/eventi/matrimoni` | /faq | "domande frequenti matrimoni" | Wedding FAQ |
| `/eventi/matrimoni` | /gallery | "foto matrimoni" | Wedding portfolio |
| `/gallery` | /eventi/matrimoni | "matrimoni" | Category filter link |
| `/gallery` | /eventi/cerimonie | "battesimi e cerimonie" | Category filter link |
| `/gallery` | /cavalli | "cavalli Murgesi" | Category filter link |
| `/faq` | /eventi/matrimoni | "prenota una visita per il tuo matrimonio" | Wedding CTA |
| `/faq` | /dove-siamo | "come raggiungere la masseria" | Directions link |
| `/faq` | /cavalli/vetrina | "informazioni vendita cavalli" | Export inquiry link |
| `/faq` | /#contatti | "contattaci per qualsiasi domanda" | General contact CTA |
| `/blog/*` | Relevant service page | Contextual keyword link | In-content link |
| `/blog/*` | /#contatti | "richiedi informazioni" | End-of-post CTA |

---

## Sitemap Structure

### Priority Assignment

| Priority | Pages | Rationale |
|----------|-------|-----------|
| 1.0 | `/` | Homepage, primary entry point |
| 0.9 | `/eventi`, `/eventi/matrimoni`, `/cavalli/vetrina` | Core transactional + unique export page |
| 0.8 | `/cucina`, `/cavalli`, `/la-masseria` | Primary service/about pages |
| 0.7 | `/eventi/cerimonie`, `/cucina/menu`, `/cavalli/esperienze`, `/eventi/aziende` | Secondary service pages |
| 0.6 | `/gallery`, `/dove-siamo`, `/faq` | Support/conversion pages |
| 0.5 | `/blog`, `/blog/*` | Content hub, long-tail traffic |
| 0.3 | `/privacy`, `/cookie` | Legal pages, low SEO value |

### Change Frequency

| Frequency | Pages | Reason |
|-----------|-------|--------|
| Weekly | `/blog/*` | New posts published monthly, but index updates weekly |
| Monthly | `/eventi/*`, `/gallery`, `/cavalli/vetrina` | Content updates, new photos, horse availability |
| Quarterly | `/cucina/menu` | Seasonal menu changes |
| Yearly | `/la-masseria`, `/faq`, `/dove-siamo`, `/cavalli/esperienze` | Stable content, occasional updates |
| Never | `/privacy`, `/cookie` | Legal pages, rarely change |

### XML Sitemap Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://torreabbondanza.com/</loc>
    <lastmod>2026-11-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://torreabbondanza.com/eventi</loc>
    <lastmod>2026-11-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://torreabbondanza.com/cavalli/vetrina</loc>
    <lastmod>2026-11-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- ... all other pages following priority/frequency rules above ... -->
</urlset>
```

**Note:** Nitro auto-generates sitemap during build. Verify output in `.output/public/sitemap.xml` after each deploy. Submit to GSC via Sitemaps report.

---

## TanStack Router File Convention

```
src/routes/
├── __root.tsx                  ← Layout + SiteHeader + SiteFooter + GTM + CookieBanner [LIVE]
├── index.tsx                   ← / homepage [LIVE]
├── la-masseria.tsx             ← /la-masseria [PHASE 1]
├── cucina.tsx                  ← /cucina [LIVE]
├── cucina.menu.tsx             ← /cucina/menu (nested route) [PHASE 2]
├── cavalli.tsx                 ← /cavalli [LIVE]
├── cavalli.vetrina.tsx         ← /cavalli/vetrina [LIVE]
├── cavalli.esperienze.tsx      ← /cavalli/esperienze (nested route) [PHASE 2]
├── eventi.tsx                  ← /eventi [LIVE]
├── eventi.matrimoni.tsx        ← /eventi/matrimoni (nested route) [PHASE 2]
├── eventi.cerimonie.tsx        ← /eventi/cerimonie (nested route) [PHASE 2]
├── eventi.aziende.tsx          ← /eventi/aziende (nested route) [PHASE 3]
├── gallery.tsx                 ← /gallery [PHASE 1]
├── dove-siamo.tsx              ← /dove-siamo [PHASE 1]
├── faq.tsx                     ← /faq [PHASE 1]
├── blog.tsx                    ← /blog index [PHASE 1]
├── blog.$slug.tsx              ← /blog/:slug dynamic route [PHASE 1]
├── privacy.tsx                 ← /privacy [LIVE]
└── cookie.tsx                  ← /cookie [LIVE]
```

### Route Meta Tag Template

```tsx
export const Route = createFileRoute("/la-masseria")({
  head: () => ({
    meta: [
      { title: "La Nostra Storia - Masseria Torre Abbondanza" },
      { name: "description", content: "Storia della Masseria Torre Abbondanza dal Settecento a oggi..." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}la-masseria` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(schema) }],
  }),
  component: LaMasseria,
});
```

---

## hreflang Strategy for /cavalli/vetrina (Export International)

### Languages Supported

| Language | Code | Target Market | Content Adaptation |
|----------|------|--------------|-------------------|
| Italiano | it | Italia | Default language, full content |
| English | en | EU, UK, US, AU | Full translation of key sections |
| Русский | ru | Russia, CIS | Key sections + export documentation |
| 中文 | zh | China, Asia | Key sections + export documentation |
| Deutsch | de | Germany, Austria, CH | Key sections |
| Français | fr | France, Belgium, CH | Key sections |

### Implementation Approach

**Option A (Recommended): Single page with multilingual sections**
- Keep single `/cavalli/vetrina` URL
- Add language toggle UI (JS-based content switching)
- Use `<link rel="alternate" hreflang="xx" href="...">` pointing to same URL with query param or hash
- Simpler to maintain, no duplicate content risk

**Option B: Separate URLs per language**
- `/cavalli/vetrina` (IT default)
- `/cavalli/vetrina/en` (English)
- `/cavalli/vetrina/ru` (Russian)
- `/cavalli/vetrina/zh` (Chinese)
- Requires TanStack Router nested routes + separate content files
- Better for geo-targeted SERP but more maintenance

**Recommendation:** Start with Option A (single page, JS toggle). Upgrade to Option B if export leads justify the effort (Phase 3 evaluation).

### hreflang Tags (for Option A with query params)

```html
<link rel="alternate" hreflang="it" href="https://torreabbondanza.com/cavalli/vetrina?lang=it" />
<link rel="alternate" hreflang="en" href="https://torreabbondanza.com/cavalli/vetrina?lang=en" />
<link rel="alternate" hreflang="ru" href="https://torreabbondanza.com/cavalli/vetrina?lang=ru" />
<link rel="alternate" hreflang="zh" href="https://torreabbondanza.com/cavalli/vetrina?lang=zh" />
<link rel="alternate" hreflang="de" href="https://torreabbondanza.com/cavalli/vetrina?lang=de" />
<link rel="alternate" hreflang="fr" href="https://torreabbondanza.com/cavalli/vetrina?lang=fr" />
<link rel="alternate" hreflang="x-default" href="https://torreabbondanza.com/cavalli/vetrina" />
```

---

## Click-to-Action Elements

| Element | Action | Placement | Tracking |
|---------|--------|-----------|----------|
| WhatsApp button | `wa.me/393384834318` | Header CTA + sticky bottom mobile + every service page | GTM event: whatsapp_click |
| Phone call | `tel:+393384834318` | /dove-siamo + /contatti + footer | GTM event: phone_click |
| Directions | Google Maps link | /dove-siamo + footer | GTM event: directions_click |
| Email | `mailto:info@torreabbondanza.com` | /contatti (future) + /cavalli/vetrina | GTM event: email_click |
| Horse inquiry (WhatsApp) | Pre-filled message per horse | /cavalli/vetrina cards | GTM event: horse_inquiry_{id} |
| Booking request | WhatsApp pre-filled | /eventi/matrimoni, /eventi/cerimonie | GTM event: booking_request |

---

## Quality Gates

### Must-Have for Every New Page

- [ ] Unique meta title (<60 chars) + meta description (<155 chars)
- [ ] Canonical URL tag
- [ ] H1 tag matching page intent
- [ ] Schema markup validated via Rich Results Test
- [ ] BreadcrumbList schema included
- [ ] Alt text on all images (descriptive, keyword-aware)
- [ ] Internal links: minimum 3 contextual links from related pages
- [ ] Mobile responsive (tested on 375px width)
- [ ] Touch targets ≥44px for all interactive elements
- [ ] No horizontal scroll
- [ ] Prefers-reduced-motion respected (GSAP animations disabled)
- [ ] Added to XML sitemap (auto via Nitro)
- [ ] Added to /llms.txt (manual update)
- [ ] Added to SiteFooter navigation (if applicable)

### Content Quality Standards

- [ ] Service pages: minimum 800 words unique content
- [ ] Blog pillar posts: minimum 2.000 words
- [ ] Blog support posts: minimum 1.000 words
- [ ] Original photography (no stock photos unless explicitly labeled)
- [ ] E-E-A-T signals: author bio, credentials, experience proof
- [ ] CTA on every page (WhatsApp, email, or phone)
- [ ] No orphan pages (every page linked from nav or contextual links)

---

## Technical Notes

### Performance Targets by Page Type

| Page Type | LCP Target | Image Budget | JS Budget |
|-----------|-----------|--------------|-----------|
| Homepage | <1.5s | <800KB total | <150KB |
| Service pages | <1.8s | <500KB total | <100KB |
| Blog posts | <2.0s | <400KB total | <80KB |
| Gallery | <2.5s | <1.5MB (lazy loaded) | <120KB |
| /cavalli/vetrina | <2.0s | <600KB total | <100KB |

### Image Optimization Checklist

- [ ] WebP format for all images (Nitro auto-converts)
- [ ] Responsive srcset with 3 breakpoints (mobile, tablet, desktop)
- [ ] Lazy loading (`loading="lazy"`) for below-fold images
- [ ] Eager loading (`loading="eager"`) for hero/LCP images only
- [ ] Width/height attributes set (prevents CLS)
- [ ] Descriptive alt text (not "image1.jpg")
- [ ] EXIF data preserved for original photos (geotag for local SEO)

### Font Loading Strategy

- Self-hosted fonts in `src/assets/fonts/`
- `font-display: swap` in CSS
- Preload critical fonts in `<head>`
- No external font requests (zero Google Fonts dependency)

---

*Documento generato il 2026-11-17. Aggiornare ogni volta che una nuova route viene aggiunta al sito. Review quarterly.*