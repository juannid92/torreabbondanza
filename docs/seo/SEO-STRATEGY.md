# SEO Strategy — Masseria Torre Abbondanza

> Generato: 2026-11-16 | Template: local-service.md | Business: masseria luxury Puglia

## Executive Summary

Torre Abbondanza è una masseria del Settecento a Noci (BA) con tre linee di business: location per eventi/matrimoni, cucina tradizionale pugliese su prenotazione, e allevamento cavalli Murgesi con esperienze equestri. Il sito attuale è una SPA React con 3 route dedicate (/cucina, /cavalli, /eventi) + homepage single-page con 12 sezioni. L'header è stato aggiornato con 5 voci di navigazione SEO-oriented.

**Obiettivo primario:** Posizionamento locale (Puglia, Murgia, Valle d'Itria, Noci) + nazionale per keyword transactional ad alto intento (matrimoni in masseria Puglia, location eventi Valle d'Itria).

**KPI target a 12 mesi:**
| Metrica | Baseline | 3 Mesi | 6 Mesi | 12 Mesi |
|---------|----------|--------|--------|---------|
| Traffico organico mensile | ~200 | 800 | 2.500 | 6.000+ |
| Keyword in top 10 | ~5 | 25 | 60 | 120+ |
| Pagine indicizzate | ~4 | 12 | 25 | 40+ |
| Core Web Vitals (LCP) | ~2.5s | <2.0s | <1.8s | <1.5s |
| Recensioni Google aggregate | 213 (TA) | 250 | 300 | 400+ |

---

## 1. Discovery

### Business Profile
- **Tipo:** Local service business (event venue + restaurant + equestrian)
- **Target primario:** Coppie 28-45 anni per matrimoni (70% revenue)
- **Target secondario:** Famiglie per cerimonie/battesimi (20%), aziende per eventi privati (10%)
- **Geografia:** Locale (Noci, Alberobello, Locorotondo, Martina Franca) + Nazionale (Milano, Roma, Nord Italia per destination weddings)
- **Stagionalità:** Picco mar-ott (matrimoni), bassa nov-feb (cene aziendali, capodanno)
- **Conversione primaria:** Contatto WhatsApp / telefonata
- **Conversione secondaria:** Richiesta preventivo via form

### Current Site Assessment
- **Piattaforma:** React + TanStack Router + Vite + Nitro (SSG/SSR)
- **Route esistenti:** /, /cucina, /cavalli, /cavalli/vetrina, /eventi, /privacy, /cookie
- **Schema markup:** Restaurant (home), Restaurant (cucina), LocalBusiness (cavalli), ItemList+Product/Offer (cavalli/vetrina), EventVenue (eventi) ✅
- **Header nav:** 5 voci con anchor links ✅ (aggiornato 2026-11-16)
- **Mancanze critiche:** Nessuna pagina /about, /gallery, /faq, /blog, /contatti dedicata
- **Performance:** Immagini WebP ottimizzate, lazy loading attivo, GSAP animations

### Budget & Timeline
- **Budget:** Internal team (no agency esterna)
- **Timeline:** Phase 1 immediata (consegna sito funzionante domani), espansione graduale 6-12 mesi
- **Risorse:** 1 sviluppatore part-time, contenuti forniti dal proprietario

---

## 2. Competitive Landscape (Preliminare)

### Top Competitor Identificati
1. **Masseria Cimino** (Ceglie Messapica) — wedding venue premium
2. **Masseria Montenapoleone** (Peppoli) — luxury events + hotel
3. **Tenuta Monacelli** (Ceglie Messapica) — resort + eventi
4. **Masseria Li Foggi** (Ostuni) — boutique wedding venue
5. **Borgo Egnazia** (Savelletri) — luxury resort benchmark

### Gap Analysis Preliminare
| Elemento | Torre Abbondanza | Competitor Top | Gap |
|----------|-----------------|----------------|-----|
| Pagine dedicate servizi | 3 | 8-15 | 🔴 Critico |
| Blog/content hub | ❌ | ✅ 20+ articoli | 🔴 Critico |
| Gallery/portfolio eventi | ❌ | ✅ 50+ foto | 🔴 Critico |
| FAQ page | ❌ | ✅ | 🟡 Medio |
| About/team page | ❌ | ✅ | 🟡 Medio |
| Schema markup completo | Parziale | Completo | 🟡 Medio |
| GBP optimization | Base | Ottimizzato | 🟡 Medio |
| Review volume | 213 (TA) | 500+ (Google) | 🟡 Medio |

---

## 3. Architecture Design

### URL Hierarchy Proposta
```
/                              ← Homepage (Restaurant schema)
├── /la-masseria               ← About/storia (NEW - Organization schema)
├── /cucina                    ← Cucina pugliese (EXISTING - Restaurant schema)
│   └── /menu                  ← Menu dettagliato (NEW - Menu schema)
├── /cavalli                   ← Cavalli Murgesi (EXISTING - LocalBusiness schema)
│   └── /esperienze-equestri   ← Passeggiate, attacchi (NEW - Service schema)
├── /eventi                    ← Eventi & matrimoni (EXISTING - EventVenue schema)
│   ├── /matrimoni             ← Matrimoni in masseria (NEW - Event schema)
│   ├── /cerimonie             ← Battesimi, comunioni (NEW - Event schema)
│   └── /aziende               ← Eventi corporate (NEW - Event schema)
├── /gallery                   ← Portfolio foto/video (NEW - ImageGallery schema)
├── /dove-siamo                ← Mappa + indicazioni (NEW - ContactPage schema)
├── /faq                       ← Domande frequenti (NEW - FAQPage schema)
├── /blog                      ← Content hub (NEW - BlogPosting schema)
│   ├── /matrimonio-in-puglia-guida
│   ├── /stagioni-masseria
│   └── /cucina-tradizionale-pugliese
├── /privacy                   ← Privacy policy (EXISTING)
└── /cookie                    ← Cookie policy (EXISTING)
```

### Internal Linking Strategy
- **Header nav:** 5 voci principali (già implementato)
- **Footer:** Link a tutte le pagine di servizio + blog + legal
- **Cross-linking contestuale:** Ogni pagina servizio linka alle correlate (es. /eventi → /cucina, /cavalli)
- **Anchor text descrittivi:** "matrimoni in masseria Puglia" non "clicca qui"
- **Breadcrumb:** Implementare su tutte le sottopagine

### Sitemap Structure
- Priorità alta: /, /eventi, /cucina, /cavalli, /la-masseria
- Priorità media: /matrimoni, /cerimonie, /gallery, /dove-siamo
- Priorità bassa: /blog/*, /faq, /privacy, /cookie
- Quality gate: Nessuna pagina location duplicata (non applicabile — single location)

---

## 4. Content Strategy

### Content Pillars
1. **Matrimoni & Cerimonie** (transactional, high intent)
2. **Cucina Tradizionale Pugliese** (informational + transactional)
3. **Cavalli Murgesi & Esperienze** (niche, differentiator)
4. **Territorio & Stagioni** (local SEO, Valle d'Itria/Murgia)
5. **Storia & Tradizione** (E-E-A-T, heritage)

### Page Types & Counts
| Tipo | Esistenti | Da Creare | Totale |
|------|-----------|-----------|--------|
| Servizio principale | 3 | 0 | 3 |
| Sottoservizio | 0 | 4 | 4 |
| About/Team | 0 | 1 | 1 |
| Gallery | 0 | 1 | 1 |
| FAQ | 0 | 1 | 1 |
| Contatti/Dove | 0 | 1 | 1 |
| Blog post | 0 | 12 (Y1) | 12 |
| **Totale** | **3** | **20** | **23** |

### Blog Topics Prioritari (Anno 1)
| Quarter | Topic | Keyword Target | Intent |
|---------|-------|---------------|--------|
| Q1 | Guida completa matrimonio in masseria Puglia | matrimonio in masseria puglia | Transactional |
| Q1 | Le 4 stagioni della masseria: quando sposarsi | periodo migliore matrimonio puglia | Informational |
| Q2 | Cucina tradizionale pugliese per eventi | catering matrimonio puglia | Transactional |
| Q2 | Cavalli Murgesi: storia e tradizioni equestri | cavalli murgesi puglia | Informational |
| Q3 | Location matrimoni Valle d'Itria: guida | location matrimoni valle d'itria | Transactional |
| Q3 | Come organizzare un battesimo in masseria | battesimo in masseria puglia | Transactional |
| Q4 | Eventi aziendali in Puglia: idee originali | eventi aziendali puglia | Transactional |
| Q4 | Storia delle masserie pugliesi | storia masserie puglia | Informational |

### E-E-A-T Building Plan
- **Experience:** Foto reali eventi passati, testimonianze coppie sposate
- **Expertise:** Bio chef con credenziali, storico allevamento Murgesi
- **Authoritativeness:** Press mentions, collaborazioni wedding planner
- **Trust:** Recensioni verificate, certificazioni, trasparenza prezzi

---

## 5. Technical Foundation

### Performance Targets
| Metric | Current | Target 3M | Target 12M |
|--------|---------|-----------|------------|
| LCP | ~2.5s | <2.0s | <1.5s |
| FID/INP | ~100ms | <80ms | <50ms |
| CLS | ~0.05 | <0.05 | <0.02 |
| TTFB | ~400ms | <300ms | <200ms |

### Schema Markup Plan
| Pagina | Schema Type | Status |
|--------|-------------|--------|
| / | Restaurant + Organization | ✅ Parziale |
| /cucina | Restaurant + Menu | ✅ Base |
| /cavalli | LocalBusiness | ✅ Base |
| /eventi | EventVenue | ✅ Base |
| /la-masseria | Organization + HistoricalLandmark | 🔲 Da fare |
| /matrimoni | Event + Offer | 🔲 Da fare |
| /gallery | ImageGallery + BreadcrumbList | 🔲 Da fare |
| /faq | FAQPage | 🔲 Da fare |
| /dove-siamo | ContactPage + GeoCoordinates | 🔲 Da fare |
| /blog/* | BlogPosting + Article | 🔲 Da fare |

### AI Search Readiness (GEO)
- [x] NAP consistente (sito + GBP + social)
- [ ] Presenza su liste "best of" wedding venues Puglia
- [ ] Descrizione servizi quotabile in AI answers
- [ ] FAQ strutturata per domande comuni AI
- [ ] Monitoraggio citazioni ChatGPT/Perplexity

### Mobile-First Considerations
- Header responsive ✅
- Touch targets ≥44px ✅
- No horizontal scroll ✅
- Click-to-call WhatsApp ✅
- Directions link Google Maps 🔲 Da aggiungere

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Settimane 1-4) ← IN CORSO
- [x] Header navigazione SEO-completa
- [x] Route dedicate /cucina, /cavalli, /eventi
- [x] Schema markup base (Restaurant, LocalBusiness, EventVenue)
- [x] Performance ottimizzazione immagini WebP
- [ ] Pagina /la-masseria (About + storia)
- [ ] Pagina /dove-siamo (mappa + indicazioni)
- [ ] Pagina /faq (domande frequenti)
- [ ] Google Business Profile audit + ottimizzazione
- [ ] Analytics setup (GA4 + Search Console verification)

### Phase 2: Expansion (Settimane 5-12)
- [ ] Pagina /matrimoni (landing transactional)
- [ ] Pagina /cerimonie (battesimi, comunioni)
- [ ] Pagina /gallery (portfolio foto eventi)
- [ ] Blog launch con 4 articoli pillar
- [ ] Internal linking structure completa
- [ ] GBP posts settimanali + foto upload
- [ ] Review generation strategy

### Phase 3: Scale (Settimane 13-24)
- [ ] Pagina /esperienze-equestri
- [ ] Pagina /menu dettagliato
- [ ] 8 additional blog posts
- [ ] Link building outreach (wedding planners, travel bloggers)
- [ ] GEO optimization per AI search
- [ ] Advanced schema (FAQPage, BreadcrumbList, Offer)

### Phase 4: Authority (Mesi 7-12)
- [ ] Thought leadership content (storia masserie, tradizione equestre)
- [ ] PR/media mentions (wedding magazines, food blogs)
- [ ] Video content (tour virtuale, interviste)
- [ ] Continuous optimization based on GSC data
- [ ] Competitor monitoring + gap analysis quarterly

---

## Risk Mitigation

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Stagionalità traffico | Alta | Medio | Content evergreen + eventi invernali |
| Concorrenza Borgo Egnazia | Media | Alto | Nicchia "autentico vs luxury resort" |
| Dipendenza da piattaforma social | Media | Medio | Email list building + owned content |
| Review negative | Bassa | Alto | Response protocol + quality improvement |
| Algorithm update | Media | Medio | Diversificazione canali + E-E-A-T forte |

---

## Success Criteria

### Phase 1 Complete When:
- 6+ pagine live e indicizzate
- Schema markup validato su tutte le pagine
- GA4 + GSC configurati e traccianti
- GBP ottimizzato con 10+ foto nuove

### Phase 2 Complete When:
- 12+ pagine live
- 4+ blog posts pubblicati
- 50+ recensioni Google totali
- Top 20 per 10+ keyword target

### Year 1 Complete When:
- 20+ pagine live e indicizzate
- 12+ blog posts
- 100+ keyword in top 20
- 6.000+ visite organiche/mese
- 400+ recensioni aggregate