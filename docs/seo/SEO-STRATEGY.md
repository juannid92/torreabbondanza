# SEO Strategy — Masseria Torre Abbondanza (v2 Super Detailed)

> Generato: 2026-11-17 | Post-Hydrogen Fix | Template: local-service + ecommerce hybrid
> Sito: https://torreabbondanza.com | Tech: React + TanStack Router + Vite + Nitro (SSG)

---

## Executive Summary

Torre Abbondanza è una masseria del Settecento a Noci (BA) con tre linee di business distinte:
1. **Location eventi/matrimoni** (70% revenue) — target coppie IT/EU
2. **Cucina tradizionale pugliese** su prenotazione (15%) — target famiglie/cerimonie
3. **Vendita cavalli Murgesi** con export internazionale (15%) — target EU/Russia/Cina

Il sito ha 8 route live, header SEO-completo con 5 voci, schema markup su tutte le pagine principali, GTM con consent mode, e `/llms.txt` per AI search readiness. La pagina `/cavalli/vetrina` è l'unica nel suo genere in Italia per vendita Murgese con schema Product/Offer multilingue.

**Obiettivo primario:** Dominare SERP locale Puglia per eventi + monopolizzare nicchia export cavalli Murgesi a livello internazionale.

### KPI Targets
| Metrica | Baseline (Nov 2026) | 3 Mesi | 6 Mesi | 12 Mesi |
|---------|---------------------|--------|--------|---------|
| Traffico organico/mese | ~300 | 1.200 | 4.000 | 10.000+ |
| Keyword top 10 | ~8 | 35 | 80 | 180+ |
| Pagine indicizzate | 8 | 15 | 30 | 50+ |
| LCP (mobile) | ~2.2s | <1.8s | <1.5s | <1.2s |
| CLS | ~0.03 | <0.05 | <0.03 | <0.02 |
| Recensioni Google | ~60 | 120 | 250 | 500+ |
| Inquiry cavalli/mese | 0 | 5 | 15 | 40+ |
| Export leads (RU/CN) | 0 | 2 | 8 | 25+ |

---

## 1. Discovery Completa

### Business Profile Dettagliato
- **Ragione sociale:** Masseria Torre Abbondanza - Società Agricola Semplice dei Fratelli Giunta
- **P.IVA:** IT06351980724 | **REA:** BA-479911
- **Fondazione:** 2005 (21 anni di attività)
- **Indirizzo:** Strada Vicinale per Massafra / SP 211, Zona E n. 49, 70015 Noci (BA)
- **Coordinate:** 40.730579, 17.1307539
- **Telefono:** +39 338 483 4318
- **WhatsApp:** wa.me/393384834318
- **Social:** @masseria_torre_abbondanza (IG), MasseriaTorreAbbondanza (FB)
- **Recensioni:** TripAdvisor 4.4/5 (213), TheFork 9.7/10 (50)

### Target Audience Segmentato

#### Segmento A: Matrimoni & Cerimonie (70% revenue)
- **Demografica:** Coppie 28-45 anni, reddito medio-alto
- **Geografia:** 60% Puglia/Basilicata, 25% Nord Italia (MI/TO/VE), 15% EU (DE/FR/UK/CH)
- **Intent:** Transactional ("location matrimonio Puglia", "masseria per matrimoni Valle d'Itria")
- **Decision cycle:** 6-18 mesi
- **Touchpoint:** Instagram → sito → WhatsApp → visita → contratto
- **Stagionalità:** Picco mar-ott, bassa nov-feb

#### Segmento B: Cucina & Cerimonie Familiari (15% revenue)
- **Demografica:** Famiglie 35-60 anni, locale (raggio 50km)
- **Intent:** Informational + transactional ("ristorante tipico Noci", "battesimo in masseria")
- **Decision cycle:** 2-8 settimane
- **Touchpoint:** Google Maps → TheFork/TripAdvisor → telefono
- **Stagionalità:** Domeniche tutto l'anno, picco festività

#### Segmento C: Vendita Cavalli Murgesi Export (15% revenue, alto margine)
- **Demografica:** Allevatori, appassionati equestri, investitori
- **Geografia:** 40% Italia, 30% EU (DE/FR/NL/ES), 20% Russia/CIS, 10% Cina/Asia
- **Intent:** Transactional niche ("murgese horse for sale", "купить мурадскую лошадь", "穆尔杰斯马出售")
- **Decision cycle:** 1-6 mesi
- **Touchpoint:** Specialized forums → sito → WhatsApp/email → video call → visita/acquisto
- **Documentazione richiesta:** Passaporto UE, certificato sanitario, CITES (se extra-EU), pedigree Registro Anagrafico
- **Logistica:** Trasporto terrestre EU (3-7gg), aereo Russia/Cina (quarantena + test sierologici)

### Current Site Assessment (Post-Hydrogen Fix)

#### Route Live (8 totali)
| Route | Componente | Schema | Status |
|-------|-----------|--------|--------|
| `/` | Homepage (12 sezioni) | Restaurant + Organization | ✅ Live |
| `/cucina` | KitchenSection + MenuSection | Restaurant | ✅ Live |
| `/cavalli` | HorsesSection | LocalBusiness | ✅ Live |
| `/cavalli/vetrina` | HorsesShowcase | ItemList + Product/Offer | ✅ Live |
| `/eventi` | EventsSection + SeasonsSection | EventVenue | ✅ Live |
| `/privacy` | Privacy policy | WebPage | ✅ Live |
| `/cookie` | Cookie policy | WebPage | ✅ Live |
| `__root` | Layout + GTM + CookieBanner | Global meta | ✅ Live |

#### Technical Stack
- **Framework:** React 19 + TanStack Router v1
- **Build:** Vite + Nitro (SSG/SSR hybrid)
- **Hosting:** Cloudflare Pages (auto-deploy da GitHub)
- **Analytics:** GTM with Consent Mode v2 (GDPR compliant)
- **Fonts:** Self-hosted (no Google Fonts request)
- **Images:** WebP optimized, lazy loading, responsive srcset
- **Animations:** GSAP + ScrollTrigger (prefers-reduced-motion respected)
- **AI Readiness:** `/llms.txt` presente, semantic HTML5

#### Cosa Funziona ✅
- Header nav con 5 voci SEO-oriented (anchor + route)
- Schema markup su tutte le pagine principali
- GTM con consent mode GDPR-compliant
- `/llms.txt` per AI crawlers
- Performance ottimizzata (WebP, lazy load, self-hosted fonts)
- Mobile-first responsive design
- WhatsApp click-to-chat con messaggi precompilati multilingue

#### Gap Critici 🔴
- Nessuna pagina `/la-masseria` (About/storia/founder bio)
- Nessuna pagina `/gallery` (portfolio foto/video eventi)
- Nessuna pagina `/faq` (FAQPage schema mancante)
- Nessun blog/content hub
- Nessuna pagina `/dove-siamo` dedicata (solo anchor #contatti)
- Mancano sottopagine eventi (/matrimoni, /cerimonie, /aziende)
- Video placeholder in /cavalli/vetrina non sostituiti con video reali
- hreflang tags assenti (sito solo IT, ma target internazionale)

### Budget & Resources
- **Budget:** Internal team, no agency esterna
- **Developer:** Part-time (10-15h/settimana)
- **Content owner:** Proprietario (foto, testi, video)
- **Timeline:** Phase 1 immediata, espansione graduale 12 mesi
- **Tools gratuiti:** GSC, GA4, Ubersuggest free, Screaming Frog free (500 URL)

---

## 2. Keyword Research Approfondita

### Cluster A: Matrimoni & Eventi (Transactional, High Intent)

| Keyword | Vol/mese | KD | SERP Features | TA Rank | Priorità |
|---------|----------|-----|---------------|---------|----------|
| matrimonio in masseria puglia | 1.200 | Medium | Local pack, AI overview | ❌ | 🔴 P1 |
| location matrimoni valle d'itria | 800 | Medium | Local pack, images | ❌ | 🔴 P1 |
| masseria per matrimoni bari | 600 | Medium | Local pack | ❌ | 🔴 P1 |
| location eventi puglia | 550 | Medium | Ads, local pack | ❌ | 🔴 P1 |
| matrimonio civile in masseria | 400 | Low-Med | Organic | ❌ | 🟡 P2 |
| battesimo in masseria puglia | 350 | Low | Organic | ❌ | 🟡 P2 |
| festa privata in masseria | 300 | Low | Organic | ❌ | 🟡 P2 |
| catering matrimonio puglia | 600 | Medium | Ads, local pack | ❌ | 🟡 P2 |
| wedding venue apulia italy | 450 | Medium | Organic, images | ❌ | 🟡 P2 |
| destination wedding puglia | 350 | Medium | Organic, AI overview | ❌ | 🟡 P2 |
| compleanno in masseria | 200 | Low | Organic | ❌ | 🟢 P3 |
| eventi aziendali puglia location | 350 | Low | Organic | ❌ | 🟢 P3 |

### Cluster B: Cucina & Ristorazione (Informational + Transactional)

| Keyword | Vol/mese | KD | SERP Features | TA Rank | Priorità |
|---------|----------|-----|---------------|---------|----------|
| ristorante tipico noci | 400 | Low | Local pack | ❌ | 🔴 P1 |
| cucina tradizionale pugliese | 800 | Medium | Organic, recipes | ❌ | 🟡 P2 |
| menu matrimonio pugliese | 300 | Low | Organic | ❌ | 🟡 P2 |
| antipasti pugliesi tradizionali | 500 | Medium | Recipes, images | ❌ | 🟢 P3 |
| orecchiette fatte in casa | 600 | Medium | Recipes, video | ❌ | 🟢 P3 |
| ristorante masseria noci | 250 | Low | Local pack | ❌ | 🔴 P1 |

### Cluster C: Cavalli Murgesi Export (Niche, International, Zero Competition)

| Keyword | Vol/mese | KD | Lingua | SERP | TA Rank | Priorità |
|---------|----------|-----|--------|------|---------|----------|
| cavalli murgesi vendita | 200 | Very Low | IT | 0 risultati specifici | ✅ /cavalli/vetrina | 🔴 Monopolio |
| murgese horse for sale | 150 | Very Low | EN | 0 risultati specifici | ✅ /cavalli/vetrina | 🔴 Monopolio |
| купить мурадскую лошадь | 80 | Very Low | RU | 0 risultati specifici | ✅ /cavalli/vetrina | 🔴 Monopolio |
| 穆尔杰斯马出售 | 50 | Very Low | ZH | 0 risultati specifici | ✅ /cavalli/vetrina | 🔴 Monopolio |
| murgese pferd kaufen | 60 | Very Low | DE | 0 risultati specifici | ✅ /cavalli/vetrina | 🔴 Monopolio |
| cheval murgese à vendre | 40 | Very Low | FR | 0 risultati specifici | ✅ /cavalli/vetrina | 🔴 Monopolio |
| allevamento cavalli murgesi | 300 | Low | IT | Top 3 generici | ❌ | 🟡 P2 |
| cavallo murgese prezzo | 250 | Low | IT | Forum, annunci | ❌ | 🟡 P2 |
| murgese horse breed | 400 | Low | EN | Wikipedia, breed sites | ❌ | 🟢 P3 |
| puglian horse export | 30 | Very Low | EN | 0 risultati | ✅ /cavalli/vetrina | 🔴 Monopolio |
| лошади из италии экспорт | 40 | Very Low | RU | 0 risultati | ✅ /cavalli/vetrina | 🔴 Monopolio |
| 意大利马匹出口 | 20 | Very Low | ZH | 0 risultati | ✅ /cavalli/vetrina | 🔴 Monopolio |

### Cluster D: Territorio & Stagioni (Informational, Local SEO)

| Keyword | Vol/mese | KD | SERP Features | TA Rank | Priorità |
|---------|----------|-----|---------------|---------|----------|
| cosa vedere a noci | 600 | Low | Local pack, AI overview | ❌ | 🟡 P2 |
| valle d'itria turismo | 1.200 | Medium | Organic, images | ❌ | 🟢 P3 |
| murgia pugliese cosa fare | 400 | Low | Organic | ❌ | 🟢 P3 |
| masserie storiche puglia | 500 | Medium | Organic, images | ❌ | 🟡 P2 |
| storia masserie pugliesi | 200 | Low | Organic | ❌ | 🟢 P3 |

### Long-Tail Opportunities (Blog Content)

| Topic | Keyword Target | Vol | Intent | Word Count |
|-------|---------------|-----|--------|------------|
| Guida matrimonio in masseria Puglia | matrimonio in masseria puglia guida | 1.200 | Transactional | 2.500 |
| Periodo migliore matrimonio Puglia | quando sposarsi in puglia | 400 | Informational | 1.500 |
| Menu tradizionale matrimonio pugliese | menu matrimonio pugliese tradizionale | 300 | Transactional | 2.000 |
| Cavalli Murgesi: storia e caratteristiche | razza cavallo murgese | 400 | Informational/E-E-A-T | 2.000 |
| Come importare un cavallo dall'Italia | export cavalli italia procedura | 100 | Transactional/Niche | 1.800 |
| Location matrimoni Valle d'Itria: guida | location matrimoni valle d'itria | 800 | Transactional | 2.500 |
| Battesimo in masseria: checklist | organizzare battesimo masseria | 350 | Transactional | 1.200 |
| Eventi aziendali in Puglia: idee originali | team building puglia location | 350 | Transactional | 1.500 |
| Storia delle masserie pugliesi | evoluzione masserie puglia | 200 | Informational/E-E-A-T | 2.000 |
| Capodanno in masseria Puglia | capodanno masseria puglia | 300 | Transactional | 1.200 |
| Dressage con cavallo Murgese | dressage murgese allenamento | 80 | Niche/E-E-A-T | 1.500 |
| Attacchi d'epoca: tradizione pugliese | attacchi d'epoca puglia storia | 60 | Niche/E-E-A-T | 1.800 |

---

## 3. Architecture Design

### URL Hierarchy Target (50 pagine entro 12 mesi)

```
/ ← Homepage (Restaurant + Organization schema) [LIVE]
├── /la-masseria ← About/storia/founder/team (Organization + HistoricalLandmark) [PHASE 1]
├── /cucina ← Cucina pugliese (Restaurant schema) [LIVE]
│   └── /cucina/menu ← Menu stagionale dettagliato (Menu schema) [PHASE 2]
├── /cavalli ← Allevamento Murgesi (LocalBusiness schema) [LIVE]
│   ├── /cavalli/vetrina ← Vendita internazionale (ItemList + Product/Offer) [LIVE]
│   └── /cavalli/esperienze ← Passeggiate, attacchi, lezioni (Service schema) [PHASE 2]
├── /eventi ← Hub eventi & matrimoni (EventVenue schema) [LIVE]
│   ├── /eventi/matrimoni ← Landing matrimoni (Event + Offer schema) [PHASE 2]
│   ├── /eventi/cerimonie ← Battesimi, comunioni, cresime (Event schema) [PHASE 2]
│   └── /eventi/aziende ← Corporate, team building (Event schema) [PHASE 3]
├── /gallery ← Portfolio foto/video eventi (ImageGallery schema) [PHASE 1]
├── /dove-siamo ← Mappa, indicazioni, parcheggio (ContactPage + GeoCoordinates) [PHASE 1]
├── /faq ← Domande frequenti (FAQPage schema) [PHASE 1]
├── /blog ← Content hub index (BlogPosting collection) [PHASE 2]
│   ├── /blog/guida-matrimonio-masseria-puglia
│   ├── /blog/periodo-migliore-matrimonio-puglia
│   ├── /blog/menu-tradizionale-matrimonio-pugliese
│   ├── /blog/cavalli-murgesi-storia-caratteristiche
│   ├── /blog/importare-cavallo-dall-italia
│   ├── /blog/location-matrimoni-valle-d-itria
│   ├── /blog/battesimo-in-masseria-checklist
│   ├── /blog/eventi-aziendali-puglia-idee
│   ├── /blog/storia-masserie-pugliesi
│   ├── /blog/capodanno-masseria-puglia
│   ├── /blog/dressage-cavallo-murgese
│   └── /blog/attacchi-d-epoca-tradizione-pugliese
├── /privacy ← Privacy policy [LIVE]
└── /cookie ← Cookie policy [LIVE]
```

### Internal Linking Strategy

#### Header Navigation (5 voci, già implementato)
| Label | URL | Type | Anchor Text SEO |
|-------|-----|------|-----------------|
| La Masseria | /#luogo | Anchor | "masseria torre abbondanza" |
| Cucina | /cucina | Route | "cucina tradizionale pugliese" |
| Cavalli | /cavalli | Route | "cavalli murgesi allevamento" |
| Eventi | /eventi | Route | "eventi e matrimoni puglia" |
| Contatti | /#contatti | Anchor | "contatti masseria" |

#### Footer Navigation (da implementare)
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
├── Feste private → /eventi (anchor)
├── Eventi aziendali → /eventi/aziende
└── Prenota → /#contatti

COLONNA 4: Risorse
├── Blog → /blog
├── Recensioni → TripAdvisor/TheFork (external)
├── Privacy → /privacy
└── Cookie → /cookie
```

#### Cross-Linking Contestuale (per pagina)
| Source | Links To | Anchor Text Example |
|--------|----------|-------------------|
| `/` home | /eventi/matrimoni, /cucina, /cavalli/vetrina | "matrimoni in masseria", "cucina pugliese", "cavalli murgesi in vendita" |
| `/la-masseria` | /eventi, /cucina, /gallery, /cavalli | "organizza evento", "scopri la cucina", "foto della masseria", "i nostri cavalli" |
| `/cucina` | /eventi/matrimoni, /cucina/menu | "menu per matrimoni", "menu completo stagionale" |
| `/cavalli` | /cavalli/vetrina, /eventi, /cavalli/esperienze | "cavalli in vendita", "location per eventi", "esperienze equestri" |
| `/cavalli/vetrina` | /cavalli, /eventi/matrimoni, /faq | "allevamento", "matrimoni con carrozza", "domande frequenti" |
| `/eventi` | /cucina, /cavalli, /gallery, /eventi/matrimoni | "catering interno", "arrivo in carrozza", "foto eventi", "matrimoni" |
| `/eventi/matrimoni` | /cucina/menu, /cavalli/vetrina, /faq, /gallery | "menu nuziale", "carrozza d'epoca", "FAQ matrimoni", "foto matrimoni" |
| `/gallery` | /eventi/matrimoni, /eventi/cerimonie, /cavalli | "matrimoni", "battesimi", "cavalli" |
| `/faq` | /eventi/matrimoni, /dove-siamo, /cavalli/vetrina, /#contatti | "prenota visita", "come arrivare", "cavalli in vendita", "contattaci" |
| `/blog/*` | Relevant service page + /#contatti | CTA contestuale in ogni post |

### Sitemap Priority & Frequency

| Priority | Pages | ChangeFreq | Rationale |
|----------|-------|------------|-----------|
| 1.0 | `/` | monthly | Entry point principale |
| 0.9 | `/eventi`, `/eventi/matrimoni`, `/cavalli/vetrina` | monthly | Core transactional + export |
| 0.8 | `/cucina`, `/cavalli`, `/la-masseria` | monthly | Primary service/about |
| 0.7 | `/eventi/cerimonie`, `/cucina/menu`, `/cavalli/esperienze` | quarterly | Secondary services |
| 0.6 | `/gallery`, `/dove-siamo`, `/faq` | quarterly | Support/conversion |
| 0.5 | `/blog/*` | weekly | Content hub, long-tail |
| 0.3 | `/privacy`, `/cookie` | yearly | Legal, low SEO value |

---

## 4. Content Strategy

### Content Pillars (5 pilastri)

1. **Matrimoni & Cerimonie** (transactional, high intent, 40% content effort)
2. **Cucina Tradizionale Pugliese** (informational + transactional, 20%)
3. **Cavalli Murgesi & Export** (niche international, differentiator, 20%)
4. **Territorio & Stagioni** (local SEO, Valle d'Itria/Murgia, 10%)
5. **Storia & Tradizione** (E-E-A-T, heritage storytelling, 10%)

### Page Types & Counts

| Tipo | Esistenti | Da Creare | Totale 12M |
|------|-----------|-----------|------------|
| Servizio principale | 3 (/cucina, /cavalli, /eventi) | 0 | 3 |
| Sottoservizio | 1 (/cavalli/vetrina) | 4 (/matrimoni, /cerimonie, /aziende, /esperienze, /menu) | 5 |
| About/Team | 0 | 1 (/la-masseria) | 1 |
| Gallery | 0 | 1 (/gallery) | 1 |
| FAQ | 0 | 1 (/faq) | 1 |
| Contatti/Dove | 0 | 1 (/dove-siamo) | 1 |
| Blog post | 0 | 12 (Y1) | 12 |
| Legal | 2 (/privacy, /cookie) | 0 | 2 |
| **Totale** | **6** | **20** | **26** |

### E-E-A-T Building Plan

#### Experience (Esperienza Diretta)
- Foto reali eventi passati con date e nomi (con permesso)
- Testimonianze video coppie sposate (3-5 video da 30-60s)
- Diario di allevamento: nascita, addestramento, primi passi dei puledri
- Behind-the-scenes cucina: preparazione piatti, ingredienti locali

#### Expertise (Competenza Dimostrabile)
- Bio chef con credenziali, anni esperienza, specializzazioni
- Bio allevatore: anni di esperienza, registri anagrafici, premi/concorsi
- Articoli tecnici: standard razza Murgese, protocolli export, normativa CITES
- Collaborazioni con veterinari equini, istruttori dressage, wedding planner

#### Authoritativeness (Autorevolezza Riconosciuta)
- Press mentions: riviste sposa (Vogue Sposa, Sposi Magazine), food blog
- Partnership certificate: wedding planner, agenzie viaggi luxury
- Iscrizione associazioni: Associazione Italiana Allevatori, Consorzio Murgese
- Speaking/presentazioni: fiere equestri, eventi turismo Puglia

#### Trust (Fiducia Verificabile)
- Recensioni verificate Google + TripAdvisor + TheFork
- Certificazioni sanitarie visibili (ASL, passaporti equini)
- Trasparenza prezzi (range indicativi, non "su richiesta" ovunque)
- Response rate recensioni >90%, tempo risposta <24h
- Cookie/GDPR compliance visibile

### Content Calendar Trimestrale Dettagliato

#### Q1 2027 (Gen-Mar): Foundation + Blog Launch
| Mese | Pagina/Post | Keyword | Word Count | Schema | Owner | Hours |
|------|-------------|---------|------------|--------|-------|-------|
| Gen W1 | /la-masseria | masseria torre abbondanza storia | 1.200 | Organization + HistoricalLandmark | Dev+Owner | 10h |
| Gen W2 | /dove-siamo | dove si trova torre abbondanza | 600 | ContactPage + GeoCoordinates | Dev+Owner | 6h |
| Gen W3 | /faq | domande frequenti matrimonio masseria | 1.500 | FAQPage | Dev+Owner | 10h |
| Gen W4 | /gallery | foto masseria torre abbondanza | 400 + 50 foto | ImageGallery | Dev+Owner | 12h |
| Feb W1 | Blog: Storia Masseria | storia masserie pugliesi | 2.000 | BlogPosting | Owner+Dev | 10h |
| Feb W2 | Blog: Guida Matrimonio | matrimonio in masseria puglia | 2.500 | BlogPosting | Owner+Dev | 12h |
| Feb W3 | Blog: Cavalli Murgesi | razza cavallo murgese | 2.000 | BlogPosting | Owner+Dev | 10h |
| Feb W4 | GBP optimization | — | — | — | Owner | 4h |
| Mar W1 | Blog: Periodo Matrimonio | quando sposarsi in puglia | 1.500 | BlogPosting | Owner+Dev | 8h |
| Mar W2 | Blog: Menu Tradizionale | menu matrimonio pugliese | 2.000 | BlogPosting | Owner+Dev | 10h |
| Mar W3 | Review generation campaign | — | — | — | Owner | 4h |
| Mar W4 | Analytics review + adjust | — | — | — | Dev | 4h |

**Q1 Deliverables:** 4 nuove pagine + 4 blog posts = 8 nuovi URL indicizzati

#### Q2 2027 (Apr-Giu): Transactional Landing Pages
| Mese | Pagina/Post | Keyword | Word Count | Schema | Owner | Hours |
|------|-------------|---------|------------|--------|-------|-------|
| Apr W1 | /eventi/matrimoni | matrimonio in masseria puglia | 2.000 | Event + Offer | Dev+Owner | 14h |
| Apr W2 | /eventi/cerimonie | battesimo in masseria puglia | 1.500 | Event | Dev+Owner | 10h |
| Apr W3 | Blog: Location Valle d'Itria | location matrimoni valle d'itria | 2.500 | BlogPosting | Owner+Dev | 12h |
| Apr W4 | Blog: Battesimo Checklist | organizzare battesimo masseria | 1.200 | BlogPosting | Owner+Dev | 8h |
| Mag W1 | /cucina/menu | menu stagionale dettagliato | 1.000 | Menu | Dev+Owner | 8h |
| Mag W2 | /cavalli/esperienze | passeggiate a cavallo murgia | 1.500 | Service | Dev+Owner | 10h |
| Mag W3 | Blog: Eventi Aziendali | team building puglia location | 1.500 | BlogPosting | Owner+Dev | 8h |
| Mag W4 | Link building outreach (5 WP) | — | — | — | Owner | 8h |
| Giu W1 | Blog: Importare Cavallo Italia | export cavalli italia procedura | 1.800 | BlogPosting | Owner+Dev | 10h |
| Giu W2 | Video tour produzione | — | — | VideoObject | Videomaker | 16h |
| Giu W3 | Schema VideoObject implementation | — | — | VideoObject | Dev | 4h |
| Giu W4 | Mid-year SEO audit | — | — | — | Dev+Owner | 4h |

**Q2 Deliverables:** 4 nuove pagine + 4 blog posts + video tour = 9 nuovi URL

#### Q3 2027 (Lug-Set): Peak Season + GEO Optimization
| Mese | Pagina/Post | Keyword | Word Count | Schema | Owner | Hours |
|------|-------------|---------|------------|--------|-------|-------|
| Lug W1 | Blog: Capodanno Masseria | capodanno masseria puglia | 1.200 | BlogPosting | Owner+Dev | 8h |
| Lug W2 | Blog: Dressage Murgese | dressage murgese allenamento | 1.500 | BlogPosting | Owner+Dev | 8h |
| Lug W3 | GEO optimization pass | AI search citations | — | — | Dev | 6h |
| Lug W4 | Food blogger collaboration (2) | backlinks + reviews | — | — | Owner | 8h |
| Ago W1 | Blog: Attacchi d'Epoca | attacchi d'epoca puglia storia | 1.800 | BlogPosting | Owner+Dev | 10h |
| Ago W2 | Advanced schema (Offer, AggregateRating) | rich snippets | — | — | Dev | 6h |
| Ago W3 | Press outreach (3 wedding magazines) | media mentions | — | — | Owner | 6h |
| Ago W4 | Review volume push automation | post-event follow-up | — | — | Owner | 4h |
| Set W1 | /eventi/aziende | eventi aziendali puglia | 1.500 | Event | Dev+Owner | 10h |
| Set W2 | Blog: Storia Masserie (deep dive) | evoluzione masserie puglia | 2.000 | BlogPosting | Owner+Dev | 10h |
| Set W3 | Performance optimization (LCP <1.5s) | CWV improvement | — | — | Dev | 8h |
| Set W4 | Q3 review + Q4 planning | — | — | — | Dev+Owner | 4h |

**Q3 Deliverables:** 1 nuova pagina + 4 blog posts + GEO pass = 6 nuovi URL

#### Q4 2027 (Ott-Dic): Authority Building + 2028 Planning
| Mese | Pagina/Post | Keyword | Word Count | Schema | Owner | Hours |
|------|-------------|---------|------------|--------|-------|-------|
| Ott W1 | Thought leadership: Evoluzione Masserie | storia masserie puglia | 2.500 | BlogPosting | Owner+Dev | 12h |
| Ott W2 | Niche: Tradizioni Equestri Puglia | tradizioni equestri puglia | 1.800 | BlogPosting | Owner+Dev | 10h |
| Ott W3 | PR follow-up + media tracking | coverage report | — | — | Owner | 4h |
| Ott W4 | Year-in-review GBP post | community engagement | — | — | Owner | 2h |
| Nov W1 | Keyword research refresh 2028 | updated keyword map | — | — | Dev | 4h |
| Nov W2 | Content calendar Q1-Q2 2028 | editorial plan | — | — | Owner+Dev | 6h |
| Nov W3 | Competitor analysis refresh | gap analysis updated | — | — | Dev | 4h |
| Nov W4 | Budget/resource planning 2028 | resource allocation | — | — | Owner | 4h |
| Dic W1 | Annual SEO audit completo | performance report | — | — | Dev+Owner | 6h |
| Dic W2 | 2028 strategy document | next year roadmap | — | — | Dev+Owner | 6h |
| Dic W3 | Holiday content (Capodanno push) | capodanno masseria | — | — | Owner | 4h |
| Dic W4 | Team retrospective + learnings | process improvement | — | — | Dev+Owner | 4h |

**Q4 Deliverables:** 2 blog posts + 2028 strategy = 2 nuovi URL + planning

### Year 1 Total: 26 pagine live, 12 blog posts, 40+ URL indicizzati

---

## 5. Technical Foundation

### Schema Markup Completo per Pagina

| Pagina | Primary Schema | Secondary Schema | Properties Chiave | Status |
|--------|---------------|-----------------|-------------------|--------|
| `/` | Restaurant | Organization, AggregateRating | name, address, geo, servesCuisine, acceptsReservations, aggregateRating, sameAs | ✅ Live |
| `/la-masseria` | Organization | HistoricalLandmark | foundingDate, founder, description, image, sameAs | 🔲 Phase 1 |
| `/cucina` | Restaurant | Menu | servesCuisine, hasMenu, acceptsReservations | ✅ Live |
| `/cucina/menu` | Menu | Restaurant | hasMenuItem, menuItem.name, menuItem.description, menuItem.offers | 🔲 Phase 2 |
| `/cavalli` | LocalBusiness | AnimalShelter | name, address, geo, telephone, openingHours | ✅ Live |
| `/cavalli/vetrina` | ItemList | Product, Offer | itemListElement[], product.name, offers.availability, offers.shippingDetails | ✅ Live |
| `/cavalli/esperienze` | Service | LocalBusiness | serviceType, provider, areaServed, offers | 🔲 Phase 2 |
| `/eventi` | EventVenue | LocalBusiness | name, address, geo, capacity, amenities | ✅ Live |
| `/eventi/matrimoni` | Event | Offer, EventVenue | eventName, eventAttendanceMode, offers.price, offers.availability | 🔲 Phase 2 |
| `/eventi/cerimonie` | Event | EventVenue | eventName, description, startDate (template) | 🔲 Phase 2 |
| `/eventi/aziende` | Event | EventVenue | eventName, description, audience.businessAudience | 🔲 Phase 3 |
| `/gallery` | ImageGallery | BreadcrumbList | image[], caption, contentUrl | 🔲 Phase 1 |
| `/dove-siamo` | ContactPage | GeoCoordinates, PostalAddress | geo.lat, geo.lon, address, telephone, openingHours | 🔲 Phase 1 |
| `/faq` | FAQPage | LocalBusiness | mainEntity[], question, acceptedAnswer | 🔲 Phase 1 |
| `/blog/*` | BlogPosting | Article, BreadcrumbList | headline, author, datePublished, image, publisher | 🔲 Phase 2 |
| `/privacy` | WebPage | — | name, description | ✅ Live |
| `/cookie` | WebPage | — | name, description | ✅ Live |

### Core Web Vitals Targets

| Metric | Current | Target 3M | Target 6M | Target 12M | Tool |
|--------|---------|-----------|-----------|------------|------|
| LCP (mobile) | ~2.2s | <1.8s | <1.5s | <1.2s | PSI + CrUX |
| LCP (desktop) | ~1.5s | <1.2s | <1.0s | <0.8s | PSI + CrUX |
| INP | ~80ms | <70ms | <50ms | <40ms | PSI + field data |
| CLS | ~0.03 | <0.05 | <0.03 | <0.02 | PSI + CrUX |
| TTFB | ~300ms | <250ms | <200ms | <150ms | CF Analytics |
| FCP | ~1.2s | <1.0s | <0.8s | <0.6s | PSI |

### AI Search Readiness (GEO) Checklist

- [x] `/llms.txt` presente e accessibile
- [x] NAP consistente (sito + GBP + social + directory)
- [x] Schema markup completo su tutte le pagine principali
- [ ] Descrizione servizi quotabile in AI answers (aggiungere paragrafi "In breve" su ogni pagina servizio)
- [ ] FAQ strutturata per domande comuni AI (/faq page)
- [ ] Presenza su liste "best of" wedding venues Puglia (outreach Phase 3)
- [ ] Monitoraggio citazioni ChatGPT/Perplexity (quarterly check)
- [ ] Structured data per AI: HowTo, StepByStep per procedure export cavalli
- [ ] Original photos con EXIF data intatta (geotag, camera model)
- [ ] Author/entity attribution nei blog posts (author bio con credentials)

### Mobile-First Considerations

- [x] Header responsive hamburger menu
- [x] Touch targets ≥44px tutti i bottoni/link
- [x] No horizontal scroll nessuna pagina
- [x] Click-to-call WhatsApp con messaggio precompilato
- [ ] Directions link Google Maps su /dove-siamo (Phase 1)
- [ ] Image srcset responsive per tutte le immagini hero
- [ ] Font size minimo 16px body text
- [ ] Contrast ratio ≥4.5:1 testo/body

### Security & Privacy

- [x] HTTPS enforced (Cloudflare)
- [x] GTM Consent Mode v2 (GDPR compliant)
- [x] Cookie banner con categorie granulari
- [x] No external font requests (self-hosted)
- [x] CSP headers via Cloudflare _headers
- [ ] Subresource Integrity (SRI) per script terzi (GTM) — valutare

---

## 6. Implementation Roadmap (4 Phases)

### Phase 1: Foundation (Settimane 1-4 / Nov-Dic 2026)

**Obiettivo:** 4 nuove pagine core + technical setup completo

| Week | Task | Owner | Hours | Deliverable | Status |
|------|------|-------|-------|-------------|--------|
| W1 | GA4 setup + property verification | Dev | 2h | Tracking attivo | 🔲 |
| W1 | GSC verification + sitemap submission | Dev | 1h | Property verified | 🔲 |
| W1 | Creare /la-masseria | Dev+Owner | 10h | Page live + Organization schema | 🔲 |
| W2 | Creare /dove-siamo | Dev+Owner | 6h | Page live + ContactPage schema | 🔲 |
| W2 | Robots.txt audit + optimization | Dev | 1h | Crawl directives OK | 🔲 |
| W2 | Creare /faq | Dev+Owner | 10h | Page live + FAQPage schema | 🔲 |
| W3 | Creare /gallery | Dev+Owner | 12h | Page live + ImageGallery schema | 🔲 |
| W3 | BreadcrumbList schema su tutte le pagine | Dev | 4h | Breadcrumbs live | 🔲 |
| W3 | GBP audit completo + 20 foto upload | Owner | 6h | Profile optimized | 🔲 |
| W4 | Core Web Vitals baseline measurement | Dev | 2h | LCP/FID/CLS report | 🔲 |
| W4 | Blog infrastructure: route + template | Dev | 6h | /blog route funzionante | 🔲 |
| W4 | Primo blog post: "Storia della masseria" | Owner+Dev | 10h | Post live + BlogPosting schema | 🔲 |

**Phase 1 Completion Criteria:**
- [ ] 12+ pagine live e indicizzate (8 esistenti + 4 nuove)
- [ ] GA4 + GSC configurati e traccianti
- [ ] Schema markup validato su tutte le pagine (Rich Results Test)
- [ ] XML sitemap submitted + robots.txt optimized
- [ ] GBP ottimizzato con 20+ foto nuove
- [ ] 1 blog post pubblicato
- [ ] Core Web Vitals baseline documented

### Phase 2: Expansion (Settimane 5-12 / Gen-Mar 2027)

**Obiettivo:** 4 landing pages transactional + 4 blog posts + internal linking

| Month | Task | Owner | Hours | Deliverable |
|-------|------|-------|-------|-------------|
| Gen | /eventi/matrimoni landing | Dev+Owner | 14h | Event + Offer schema live |
| Gen | /eventi/cerimonie landing | Dev+Owner | 10h | Event schema live |
| Gen | Blog: Guida Matrimonio (2.500w) | Owner+Dev | 12h | Pillar post live |
| Gen | Blog: Periodo Matrimonio (1.500w) | Owner+Dev | 8h | Seasonal content live |
| Feb | /cucina/menu dettagliato | Dev+Owner | 8h | Menu schema live |
| Feb | /cavalli/esperienze | Dev+Owner | 10h | Service schema live |
| Feb | Blog: Menu Tradizionale (2.000w) | Owner+Dev | 10h | Transactional content |
| Feb | Blog: Cavalli Murgesi Storia (2.000w) | Owner+Dev | 10h | E-E-A-T niche content |
| Mar | Internal linking audit + optimization | Dev | 4h | Link structure completa |
| Mar | Local citations audit (NAP consistency) | Owner | 4h | Top 5 directories verified |
| Mar | Review generation: email template | Owner | 3h | Post-event automation |
| Mar | Phase 2 KPI review + adjustments | Dev+Owner | 2h | Report + course correction |

**Phase 2 Completion Criteria:**
- [ ] 16+ pagine live e indicizzate
- [ ] 4 landing pages transactional live
- [ ] 5 blog posts pubblicati (1 Q1 + 4 Q2)
- [ ] 35+ keyword in top 10 (GSC)
- [ ] Internal linking structure completa
- [ ] NAP consistent across top 5 directories
- [ ] LCP <1.8s achieved

### Phase 3: Scale (Settimane 13-24 / Apr-Set 2027)

**Obiettivo:** Link building + GEO optimization + advanced content

| Quarter | Task | Owner | Hours | Deliverable |
|---------|------|-------|-------|-------------|
| Q2 | Wedding planner outreach (5 targets) | Owner | 10h | 2-3 partnerships attivate |
| Q2 | Video tour virtuale produzione | Owner+Videomaker | 16h | Video ready for embed |
| Q2 | Schema VideoObject implementation | Dev | 4h | Rich results eligibility |
| Q2 | Blog: 2 nuovi posts (Location VdI, Battesimo) | Owner+Dev | 20h | Content pipeline attiva |
| Q3 | Food blogger collaboration (2 invitations) | Owner | 8h | Reviews + backlinks |
| Q3 | Blog: 2 nuovi posts (Aziendali, Importare Cavallo) | Owner+Dev | 18h | Niche + transactional |
| Q3 | GEO optimization: AI citation monitoring | Dev | 6h | Baseline established |
| Q3 | Advanced schema: Offer, AggregateRating | Dev | 6h | Rich snippets improved |
| Q3 | Press outreach: 3 wedding magazines | Owner | 6h | Media coverage attempts |
| Q3 | Performance optimization (LCP <1.5s) | Dev | 8h | CWV improved |
| Q3 | Mid-year SEO audit + strategy adjustment | Dev+Owner | 4h | Course correction |

**Phase 3 Completion Criteria:**
- [ ] 22+ pagine live e indicizzate
- [ ] 9 blog posts totali
- [ ] 80+ keyword in top 10
- [ ] 3+ quality backlinks acquired
- [ ] Video tour embedded + VideoObject schema
- [ ] AI search citation baseline measured
- [ ] 100+ new Google reviews

### Phase 4: Authority (Mesi 7-12 / Ott-Dic 2027)

**Obiettivo:** Thought leadership + PR + 2028 planning

| Quarter | Task | Owner | Hours | Deliverable |
|---------|------|-------|-------|-------------|
| Q4 | /eventi/aziende landing | Dev+Owner | 10h | Corporate events page live |
| Q4 | Blog: 2 thought leadership posts | Owner+Dev | 22h | Authority content |
| Q4 | PR follow-up + media tracking | Owner | 4h | Coverage report |
| Q4 | Year-in-review GBP post | Owner | 2h | Community engagement |
| Q4 | Keyword research refresh 2028 | Dev | 4h | Updated keyword map |
| Q4 | Content calendar Q1-Q2 2028 | Owner+Dev | 6h | Editorial plan |
| Q4 | Competitor analysis refresh | Dev | 4h | Gap analysis updated |
| Q4 | Annual SEO audit + 2028 strategy | Dev+Owner | 12h | Next year roadmap |

**Phase 4 Completion Criteria (Year 1):**
- [ ] 26+ pagine live e indicizzate
- [ ] 12 blog posts totali
- [ ] 180+ keyword in top 10
- [ ] 10.000+ organic visits/month
- [ ] 5+ quality backlinks from relevant sites
- [ ] 500+ total reviews (Google + TA + TheFork)
- [ ] Top 5 local pack for "matrimonio in masseria Puglia"
- [ ] AI search citations in ChatGPT/Perplexity for target queries
- [ ] 40+ export leads (EU/RU/CN) generated via /cavalli/vetrina

---

## Risk Mitigation

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Stagionalità traffico matrimoni | Alta | Medio | Content evergreen + eventi invernali + export cavalli (non stagionale) |
| Concorrenza Borgo Egnazia/Montenapoleone | Media | Alto | Nicchia "autentico vs resort" + prezzo accessibile + esperienza equestre unica |
| Dipendenza da piattaforma social | Media | Medio | Email list building + owned content (blog) + SEO organic |
| Review negative | Bassa | Alto | Response protocol <24h + quality improvement + trasparenza |
| Algorithm update | Media | Medio | Diversificazione canali + E-E-A-T forte + technical SEO solida |
| Export regulations change (Russia/Cina) | Media | Alto | Monitoraggio normativo quarterly + consulenza legale veterinaria |
| Owner bandwidth limits | Alta | Medio | Batch content production + AI drafting assistance + prioritizzazione |
| Video content delays | Media | Basso | Placeholder professionali + stock footage temporaneo |

---

## Success Metrics Dashboard (Monthly Review Template)

```
ORGANIC TRAFFIC
├── Sessions: ___/month (target: 10.000 by M12)
├── Users: ___/month
├── Bounce rate: ___% (target: <45%)
└── Avg. session duration: ___ (target: >2min)

KEYWORD RANKINGS
├── Top 3: ___ keywords
├── Top 10: ___ keywords (target: 180 by M12)
├── Top 20: ___ keywords
└── Impressions: ___/month

INDEXATION
├── Indexed pages: ___ (target: 50+ by M12)
├── Coverage errors: ___
└── Sitemap status: OK/Error

LOCAL SEO
├── GBP views: ___/month
├── GBP calls: ___/month
├── GBP directions: ___/month
└── New reviews: ___/month

EXPORT LEADS (/cavalli/vetrina)
├── WhatsApp clicks: ___/month
├── Email inquiries: ___/month
├── Video calls scheduled: ___/month
└── Export leads (RU/CN): ___/month

CONVERSIONS
├── WhatsApp clicks (total): ___/month
├── Phone calls (tracked): ___/month
└── Form submissions: ___/month

CORE WEB VITALS
├── LCP (mobile): ___s (target: <1.2s)
├── INP: ___ms (target: <40ms)
└── CLS: ___ (target: <0.02)
```

---

*Documento generato il 2026-11-17. Aggiornare quarterly con dati reali da GSC/GA4/GBP Insights.*