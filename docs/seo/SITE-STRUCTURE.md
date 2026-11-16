# Site Structure — Masseria Torre Abbondanza

> Generato: 2026-11-16 | Architettura URL + Internal Linking + Sitemap

## Current State (2026-11-16)

### Route Esistenti
```
/               ← Homepage (12 sezioni single-page)
/cucina         ← Cucina pugliese + MenuSection
/cavalli        ← Cavalli Murgesi + HorsesSection
/eventi         ← Eventi & Matrimoni + SeasonsSection
/privacy        ← Privacy policy
/cookie         ← Cookie policy
```

### Header Navigation (Aggiornato)
- La Masseria → /#luogo (anchor a PlaceSection)
- Cucina → /cucina
- Cavalli → /cavalli
- Eventi → /eventi
- Contatti → /#contatti (anchor a VisitSection)

### Anchor IDs nella Homepage
| Sezione | Componente | Anchor ID | Nav Link |
|---------|-----------|-----------|----------|
| Hero | HeroSoglia | — | — |
| Manifesto | ManifestoSection | — | — |
| Storia | StorySection | — | — |
| Luogo | PlaceSection | `#luogo` | ✅ La Masseria |
| Cucina | KitchenSection | — | — |
| Menu | MenuSection | — | — |
| Cavalli | HorsesSection | — | — |
| Eventi | EventsSection | `#eventi` | — |
| Stagioni | SeasonsSection | — | — |
| Testimonials | TestimonialsSection | — | — |
| Visita/Contatti | VisitSection | `#contatti` | ✅ Contatti |
| Footer | SiteFooter | — | — |

---

## Target Architecture (Phase 1-2 Complete)

### URL Hierarchy Completa
```
/                                   ← Homepage (Restaurant + Organization schema)
├── /la-masseria                    ← About/storia/founder (Organization schema) [PHASE 1]
├── /cucina                         ← Cucina pugliese (Restaurant schema) [EXISTING]
│   └── /cucina/menu                ← Menu dettagliato stagionale (Menu schema) [PHASE 2]
├── /cavalli                        ← Allevamento Murgesi (LocalBusiness schema) [EXISTING]
│   ├── /cavalli/vetrina            ← Vendita cavalli internazionale (ItemList + Product/Offer) [LIVE]
│   └── /cavalli/esperienze         ← Passeggiate, attacchi d'epoca (Service schema) [PHASE 2]
├── /cavalli                        ← Allevamento Murgesi (LocalBusiness schema) [EXISTING]
│   └── /cavalli/esperienze         ← Passeggiate, attacchi d'epoca (Service schema) [PHASE 2]
├── /eventi                         ← Eventi & matrimoni hub (EventVenue schema) [EXISTING]
│   ├── /eventi/matrimoni           ← Matrimoni in masseria (Event + Offer schema) [PHASE 2]
│   ├── /eventi/cerimonie           ← Battesimi, comunioni, cresime (Event schema) [PHASE 2]
│   └── /eventi/aziende             ← Corporate events, team building (Event schema) [PHASE 3]
├── /gallery                        ← Portfolio foto/video eventi (ImageGallery schema) [PHASE 1]
├── /dove-siamo                     ← Mappa, indicazioni, parcheggio (ContactPage schema) [PHASE 1]
├── /faq                            ← Domande frequenti (FAQPage schema) [PHASE 1]
├── /blog                           ← Content hub index (BlogPosting collection) [PHASE 1]
│   ├── /blog/storia-masseria-torre-abbondanza
│   ├── /blog/come-scegliere-location-matrimonio-puglia
│   ├── /blog/guida-matrimonio-masseria-puglia
│   ├── /blog/stagioni-masseria-quando-sposarsi
│   ├── /blog/cucina-tradizionale-pugliese-eventi
│   ├── /blog/cavalli-murgesi-storia-tradizioni
│   ├── /blog/location-matrimoni-valle-d-itria
│   ├── /blog/organizzare-battesimo-masseria
│   ├── /blog/eventi-aziendali-puglia-idee
│   ├── /blog/matrimonio-autunno-puglia
│   ├── /blog/evoluzione-masserie-pugliesi
│   └── /blog/capodanno-masseria-puglia
├── /privacy                        ← Privacy policy [EXISTING]
└── /cookie                         ← Cookie policy [EXISTING]
```

---

## Schema Markup Map

| Pagina | Primary Schema | Secondary Schema | Status |
|--------|---------------|-----------------|--------|
| `/` | Restaurant | Organization, AggregateRating | ✅ Live |
| `/la-masseria` | Organization | HistoricalLandmark | 🔲 Phase 1 |
| `/cucina` | Restaurant | Menu | ✅ Base |
| `/cucina/menu` | Menu | Restaurant | 🔲 Phase 2 |
| `/cavalli` | LocalBusiness | AnimalShelter | ✅ Base |
| `/cavalli/esperienze` | Service | LocalBusiness | 🔲 Phase 2 |
| `/eventi` | EventVenue | LocalBusiness | ✅ Base |
| `/eventi/matrimoni` | Event | Offer, EventVenue | 🔲 Phase 2 |
| `/eventi/cerimonie` | Event | EventVenue | 🔲 Phase 2 |
| `/eventi/aziende` | Event | EventVenue | 🔲 Phase 3 |
| `/gallery` | ImageGallery | BreadcrumbList | 🔲 Phase 1 |
| `/dove-siamo` | ContactPage | GeoCoordinates | 🔲 Phase 1 |
| `/faq` | FAQPage | LocalBusiness | 🔲 Phase 1 |
| `/blog/*` | BlogPosting | Article, BreadcrumbList | 🔲 Phase 1 |
| `/privacy` | WebPage | — | ✅ Live |
| `/cookie` | WebPage | — | ✅ Live |

---

## Internal Linking Matrix

### Header Navigation (5 voci)
| Label | URL | Type | Priority |
|-------|-----|------|----------|
| La Masseria | /#luogo | Anchor | High |
| Cucina | /cucina | Route | High |
| Cavalli | /cavalli | Route | High |
| Eventi | /eventi | Route | High |
| Contatti | /#contatti | Anchor | High |

### Footer Navigation (Proposta)
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
└── Eventi aziendali → /eventi/aziende

COLONNA 3: Eventi
├── Matrimoni → /eventi/matrimoni
├── Cerimonie → /eventi/cerimonie
├── Feste private → /eventi (anchor)
└── Prenota → /#contatti

COLONNA 4: Risorse
├── Blog → /blog
├── Recensioni → external (TripAdvisor/TheFork)
├── Privacy → /privacy
└── Cookie → /cookie
```

### Cross-Linking Contestuale (per pagina)
| Source Page | Links To | Anchor Text Example |
|-------------|----------|-------------------|
| `/` (home) | /eventi/matrimoni, /cucina, /cavalli | "scopri i nostri matrimoni", "la nostra cucina" |
| `/la-masseria` | /eventi, /cucina, /gallery | "organizza il tuo evento", "vedi le foto" |
| `/cucina` | /eventi/matrimoni, /cucina/menu | "menu per matrimoni", "il nostro menu completo" |
| `/cavalli` | /eventi, /cavalli/esperienze | "location per eventi", "prenota un'esperienza" |
| `/eventi` | /cucina, /cavalli, /gallery | "catering interno", "arrivo in carrozza", "foto eventi" |
| `/eventi/matrimoni` | /cucina/menu, /cavalli, /faq | "menu nuziale", "carrozza d'epoca", "domande frequenti" |
| `/gallery` | /eventi/matrimoni, /eventi/cerimonie | "matrimoni", "battesimi" |
| `/faq` | /eventi/matrimoni, /dove-siamo, /#contatti | "prenota una visita", "come raggiungerci" |
| `/blog/*` | Relevant service page + /#contatti | Contextual CTA in ogni post |

---

## Sitemap Structure

### Priority Assignment
| Priority | Pages | Rationale |
|----------|-------|-----------|
| 1.0 | `/` | Homepage, entry point principale |
| 0.9 | `/eventi`, `/eventi/matrimoni` | Core transactional pages |
| 0.8 | `/cucina`, `/cavalli`, `/la-masseria` | Primary service/about pages |
| 0.7 | `/eventi/cerimonie`, `/cucina/menu`, `/cavalli/esperienze` | Secondary service pages |
| 0.6 | `/gallery`, `/dove-siamo`, `/faq` | Support/conversion pages |
| 0.5 | `/blog/*` | Content hub, long-tail traffic |
| 0.3 | `/privacy`, `/cookie` | Legal, low SEO value |

### Change Frequency
| Frequency | Pages |
|-----------|-------|
| Weekly | `/blog/*`, GBP-linked pages |
| Monthly | `/eventi/*`, `/gallery` |
| Quarterly | `/cucina/menu` (seasonal updates) |
| Yearly | `/la-masseria`, `/faq`, `/dove-siamo` |
| Never | `/privacy`, `/cookie` |

### XML Sitemap Template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://torreabbondanza.com/</loc>
    <lastmod>2026-11-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://torreabbondanza.com/eventi</loc>
    <lastmod>2026-11-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- ... all other pages ... -->
</urlset>
```

---

## Breadcrumb Structure

### Pattern
```
Home > [Category] > [Page]
```

### Examples
| Page | Breadcrumb |
|------|-----------|
| `/la-masseria` | Home > La Masseria |
| `/cucina/menu` | Home > Cucina > Menu |
| `/eventi/matrimoni` | Home > Eventi > Matrimoni |
| `/cavalli/esperienze` | Home > Cavalli > Esperienze Equestri |
| `/blog/guida-matrimonio-masseria-puglia` | Home > Blog > Guida Matrimonio in Masseria Puglia |
| `/faq` | Home > FAQ |
| `/dove-siamo` | Home > Dove Siamo |

### Schema Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://torreabbondanza.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Eventi",
      "item": "https://torreabbondanza.com/eventi"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Matrimoni",
      "item": "https://torreabbondanza.com/eventi/matrimoni"
    }
  ]
}
```

---

## Mobile Navigation Considerations

### Hamburger Menu Structure
Same as desktop header (5 items) + expanded footer links on mobile:
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

### Click-to-Action
| Element | Action | Placement |
|---------|--------|-----------|
| WhatsApp button | `wa.me/393384834318` | Header CTA + sticky bottom mobile |
| Phone call | `tel:+393384834318` | /dove-siamo + /contatti |
| Directions | Google Maps link | /dove-siamo + footer |
| Email | `mailto:` | /contatti (future) |

---

## Technical Notes for Implementation

### TanStack Router File Convention
```
src/routes/
├── __root.tsx              ← Layout + SiteHeader + SiteFooter
├── index.tsx               ← /
├── la-masseria.tsx         ← /la-masseria [NEW]
├── cucina.tsx              ← /cucina [EXISTING]
├── cucina.menu.tsx         ← /cucina/menu [NEW - nested route]
├── cavalli.tsx             ← /cavalli [EXISTING]
├── cavalli.esperienze.tsx  ← /cavalli/esperienze [NEW - nested route]
├── eventi.tsx              ← /eventi [EXISTING]
├── eventi.matrimoni.tsx    ← /eventi/matrimoni [NEW - nested route]
├── eventi.cerimonie.tsx    ← /eventi/cerimonie [NEW - nested route]
├── eventi.aziende.tsx      ← /eventi/aziende [NEW - nested route]
├── gallery.tsx             ← /gallery [NEW]
├── dove-siamo.tsx          ← /dove-siamo [NEW]
├── faq.tsx                 ← /faq [NEW]
├── blog.tsx                ← /blog index [NEW]
├── blog.$slug.tsx          ← /blog/:slug dynamic [NEW]
├── privacy.tsx             ← /privacy [EXISTING]
└── cookie.tsx              ← /cookie [EXISTING]
```

### Meta Tag Template (per route)
```tsx
export const Route = createFileRoute("/la-masseria")({
  head: () => ({
    meta: [
      { title: "La Nostra Storia - Masseria Torre Abbondanza" },
      { name: "description", content: "..." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}la-masseria` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(schema) }],
  }),
  component: LaMasseria,
});
```

### Quality Gates
- ✅ No location page duplication (single location business)
- ✅ Every page has unique meta title + description
- ✅ Every service page has dedicated JSON-LD schema
- ✅ Canonical URL on every page
- ✅ H1 tag matches page title intent
- ✅ Alt text on all images (descriptive, keyword-aware)
- ✅ Internal links use descriptive anchor text (no "click here")
- ✅ Mobile responsive navigation
- ✅ Touch targets ≥ 44px
- ✅ No orphan pages (every page linked from nav or contextual links)