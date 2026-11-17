# Implementation Roadmap — Masseria Torre Abbondanza (v2 Super Detailed)

> Generato: 2026-11-17 | Timeline: Nov 2026 – Dec 2027
> Post-Hydrogen Fix | 8 route live | /cavalli/vetrina export page active

---

## Phase Overview

| Phase | Period | Focus | New Pages | Cumulative Pages | Key KPI |
|-------|--------|-------|-----------|------------------|---------|
| **1. Foundation** | W1-4 (Nov-Dec 2026) | Core pages + technical setup | 4 + 1 blog | 13 | GA4/GSC active, schema validated |
| **2. Expansion** | W5-12 (Jan-Mar 2027) | Landing pages + blog launch | 4 + 6 blog | 23 | 35 keyword top 10 |
| **3. Scale** | W13-24 (Apr-Sep 2027) | Link building + GEO + video | 1 + 6 blog | 30 | 80 keyword top 10, 5+ backlinks |
| **4. Authority** | M7-12 (Oct-Dec 2027) | Thought leadership + PR + 2028 plan | 0 + 2 blog | 32 | 180 keyword top 10, 10K visits/mo |

---

## Phase 1: Foundation (Weeks 1-4 / Nov 17 – Dec 14, 2026)

### Week 1 (Nov 17-23): Technical Setup + /la-masseria

| Day | Task | Owner | Hours | Deliverable | Dependencies | Status |
|-----|------|-------|-------|-------------|--------------|--------|
| Mon | GA4 property creation + GTM linking | Dev | 2h | GA4 receiving data from GTM | GTM already in __root.tsx | 🔲 |
| Mon | GSC property verification (DNS or HTML tag) | Dev | 1h | Property verified in GSC | Domain access | 🔲 |
| Tue | XML sitemap generation (Nitro auto-generates) + submit to GSC | Dev | 1h | Sitemap indexed | Build pipeline | 🔲 |
| Tue | robots.txt audit: ensure /privacy and /cookie are noindex if needed | Dev | 1h | Crawl directives optimized | Nitro config | 🔲 |
| Wed | /la-masseria: content brief (storia, founder bio, timeline, foto d'epoca) | Owner | 4h | Content draft approved | Owner availability | 🔲 |
| Thu | /la-masseria: route creation + Organization + HistoricalLandmark schema | Dev | 6h | Page live at /la-masseria | Content draft | 🔲 |
| Fri | /la-masseria: QA (mobile, accessibility, schema validation via Rich Results Test) | Dev | 2h | Validated and indexed request submitted | Page live | 🔲 |

**W1 Total:** 17 hours | **Deliverables:** GA4+GSC active, /la-masseria live

### Week 2 (Nov 24-30): /dove-siamo + /faq

| Day | Task | Owner | Hours | Deliverable | Dependencies | Status |
|-----|------|-------|-------|-------------|--------------|--------|
| Mon | /dove-siamo: Google Maps embed + driving directions from Bari/Brindisi/Taranto | Dev | 3h | Map + directions drafted | None | 🔲 |
| Mon | /dove-siamo: parking info, public transport options, GPS coordinates display | Owner | 2h | Full location content | Owner knowledge | 🔲 |
| Tue | /dove-siamo: route creation + ContactPage + GeoCoordinates schema | Dev | 3h | Page live at /dove-siamo | Content complete | 🔲 |
| Wed | /faq: compile top 20 questions from GBP Q&A, WhatsApp history, competitor FAQs | Owner | 3h | FAQ list with answers drafted | Historical data | 🔲 |
| Thu | /faq: accordion UI implementation + FAQPage schema (mainEntity array) | Dev | 5h | Page live at /faq | FAQ content | 🔲 |
| Fri | Cross-linking: add /la-masseria, /dove-siamo, /faq to SiteFooter navigation | Dev | 2h | Footer nav updated with 3 new links | Pages live | 🔲 |

**W2 Total:** 18 hours | **Deliverables:** /dove-siamo + /faq live, footer nav updated

### Week 3 (Dec 1-7): /gallery + BreadcrumbList Schema

| Day | Task | Owner | Hours | Deliverable | Dependencies | Status |
|-----|------|-------|-------|-------------|--------------|--------|
| Mon | /gallery: collect 50+ photos from past events (matrimoni, cerimonie, cavalli, cucina, esterni) | Owner | 4h | Photo archive organized by category | Past event archives | 🔲 |
| Tue | /gallery: image optimization (WebP conversion, responsive srcset, descriptive alt text) | Dev | 4h | All images <300KB, responsive | Photo archive | 🔲 |
| Wed | /gallery: masonry/grid layout with lightbox + category filter tabs | Dev | 4h | Responsive gallery UI complete | Optimized images | 🔲 |
| Wed | /gallery: ImageGallery schema implementation | Dev | 2h | Structured data validated | Gallery UI | 🔲 |
| Thu | BreadcrumbList schema: implement on ALL 12 existing pages (/, /cucina, /cavalli, /cavalli/vetrina, /eventi, /la-masseria, /dove-siamo, /faq, /gallery, /privacy, /cookie, /blog) | Dev | 4h | Breadcrumbs visible + structured data on every page | All pages accessible | 🔲 |
| Fri | /gallery: publish + mobile test + schema validation | Dev+Owner | 2h | Page live and validated | All components ready | 🔲 |

**W3 Total:** 20 hours | **Deliverables:** /gallery live, BreadcrumbList on all pages

### Week 4 (Dec 8-14): Blog Infrastructure + First Post + GBP Optimization

| Day | Task | Owner | Hours | Deliverable | Dependencies | Status |
|-----|------|-------|-------|-------------|--------------|--------|
| Mon | Blog infrastructure: /blog route + BlogPosting template + index page with cards | Dev | 6h | /blog route functional, template reusable | TanStack Router | 🔲 |
| Tue | Blog post #1 draft: "La storia di Masseria Torre Abbondanza: dal Settecento a oggi" (2.000 words) | Owner | 4h | Draft with photos, founder quotes, timeline | Owner knowledge + archives | 🔲 |
| Wed | Blog post #1: SEO optimization (meta, internal links, alt text) + BlogPosting schema + publish | Dev | 4h | Post live at /blog/storia-masseria-torre-abbondanza | Draft approved | 🔲 |
| Thu | GBP: upload 20+ new photos (interni, esterni, cibo, cavalli, eventi) + update description with keywords + set winter hours | Owner | 4h | GBP fully optimized for winter season | Photo archive | 🔲 |
| Fri | Core Web Vitals baseline: measure LCP/INP/CLS on all pages (mobile + desktop) via PSI | Dev | 2h | CWV-BASELINE.md created in docs/seo/ | All pages live | 🔲 |
| Fri | /llms.txt update: add new pages (/la-masseria, /dove-siamo, /faq, /gallery, /blog/*) | Dev | 1h | AI crawlers can discover new content | Pages live | 🔲 |

**W4 Total:** 21 hours | **Deliverables:** /blog live, first post published, GBP optimized, CWV baseline

### Phase 1 Completion Checklist

- [ ] 13 pagine live e indicizzate (8 esistenti + /la-masseria + /dove-siamo + /faq + /gallery + /blog index)
- [ ] GA4 receiving data from GTM (verify in Realtime report)
- [ ] GSC property verified + sitemap submitted + coverage report clean
- [ ] Schema markup validated on all 13 pages via Rich Results Test
- [ ] BreadcrumbList schema present on all pages
- [ ] GBP optimized: 20+ new photos, keyword-rich description, winter hours set
- [ ] 1 blog post published with BlogPosting schema
- [ ] Core Web Vitals baseline documented in docs/seo/CWV-BASELINE.md
- [ ] /llms.txt updated with all new URLs
- [ ] SiteFooter navigation includes links to all new pages

---

## Phase 2: Expansion (Weeks 5-12 / Jan 6 – Mar 28, 2027)

### Month 2 (January 2027): Transactional Landing Pages + Blog Pillars

| Week | Task | Keyword Target | Word Count | Schema | Owner | Hours | Deliverable |
|------|------|---------------|------------|--------|-------|-------|-------------|
| W5 | /eventi/matrimoni landing page creation | matrimonio in masseria puglia | 2.000 | Event + Offer | Dev+Owner | 14h | Page live with full wedding content, pricing range, CTA |
| W6 | /eventi/cerimonie landing page creation | battesimo in masseria puglia | 1.500 | Event | Dev+Owner | 10h | Page live with ceremony types, packages, testimonials |
| W7 | Blog #2: "Guida completa al matrimonio in masseria in Puglia" | matrimonio in masseria puglia guida | 2.500 | BlogPosting | Owner+Dev | 12h | Pillar post with checklist, timeline, budget tips |
| W8 | Blog #3: "Le 4 stagioni della masseria: quando è il momento migliore?" | periodo migliore matrimonio puglia | 1.500 | BlogPosting | Owner+Dev | 8h | Seasonal guide with pros/cons per season, photo examples |

**January Total:** 44 hours | **Deliverables:** 2 landing pages + 2 blog pillar posts

### Month 3 (February 2027): Service Pages + E-E-A-T Content

| Week | Task | Keyword Target | Word Count | Schema | Owner | Hours | Deliverable |
|------|------|---------------|------------|--------|-------|-------|-------------|
| W9 | /cucina/menu dettagliato stagionale | menu matrimonio pugliese tradizionale | 1.000 | Menu | Dev+Owner | 8h | Seasonal menu with antipasti, primi, secondi, dolci, wine pairing |
| W10 | /cavalli/esperienze (passeggiate, attacchi, lezioni) | passeggiate a cavallo murgia | 1.500 | Service | Dev+Owner | 10h | Experience catalog with pricing, duration, difficulty, booking CTA |
| W11 | Blog #4: "Cucina tradizionale pugliese per eventi: il nostro menù tipo" | catering matrimonio puglia | 2.000 | BlogPosting | Owner+Dev | 10h | Menu deep dive with ingredient sourcing, chef bio, dietary options |
| W12 | Blog #5: "Cavalli Murgesi: storia, carattere e tradizioni equestri" | razza cavallo murgese caratteristiche | 2.000 | BlogPosting | Owner+Dev | 10h | Breed encyclopedia with registry info, temperament, training, export |

**February Total:** 38 hours | **Deliverables:** 2 service pages + 2 E-E-A-T blog posts

### Month 4 (March 2027): Local SEO Push + Internal Linking + Review System

| Week | Task | Keyword Target | Word Count | Schema | Owner | Hours | Deliverable |
|------|------|---------------|------------|--------|-------|-------|-------------|
| W13 | Blog #6: "Location matrimoni Valle d'Itria: guida alle masserie autentiche" | location matrimoni valle d'itria | 2.500 | BlogPosting | Owner+Dev | 12h | Territory guide with TA positioned as authentic choice |
| W14 | Blog #7: "Come organizzare un battesimo in masseria: checklist completa" | organizzare battesimo masseria | 1.200 | BlogPosting | Owner+Dev | 8h | Practical checklist with timeline, vendor list, budget |
| W15 | Internal linking audit: verify every page has 3+ contextual links + footer nav complete | — | — | — | Dev | 4h | Link matrix spreadsheet + fixes applied |
| W16 | Local citations audit: NAP consistency check on PagineGialle, TripAdvisor, TheFork, Yelp, Apple Maps | — | — | — | Owner | 4h | NAP audit report + corrections submitted |
| W16 | Review generation: create post-event email/WhatsApp template for review requests | — | — | — | Owner | 3h | Template ready for deployment |
| W16 | Phase 2 KPI review: GSC/GA4/GBP data analysis + strategy adjustment | — | — | — | Dev+Owner | 2h | Phase 2 report with adjustments |

**March Total:** 33 hours | **Deliverables:** 2 blog posts + internal linking complete + NAP verified + review system

### Phase 2 Completion Checklist

- [ ] 23 pagine live e indicizzate (+10 vs Phase 1)
- [ ] 4 landing pages transactional live (/matrimoni, /cerimonie, /menu, /esperienze)
- [ ] 7 blog posts pubblicati (1 Phase 1 + 6 Phase 2)
- [ ] 35+ keyword in top 10 (GSC Performance report)
- [ ] Internal linking matrix complete (every page linked from 3+ sources)
- [ ] NAP consistent across top 5 directories (audit report saved)
- [ ] Review generation template deployed (post-event automation active)
- [ ] LCP <1.8s achieved on mobile (PSI measurement)
- [ ] Phase 2 KPI report completed with course corrections documented

---

## Phase 3: Scale (Weeks 13-24 / Apr 1 – Sep 30, 2027)

### Quarter 2 (April-June 2027): Link Building + Video + Advanced Content

| Month | Task | Keyword Target | Hours | Deliverable | Owner |
|-------|------|---------------|-------|-------------|-------|
| Apr W1-2 | Wedding planner outreach: identify 5 targets, personalized pitch emails, follow-up | — | 10h | 2-3 partnerships activated (backlink + referral agreement) | Owner |
| Apr W3 | Blog #8: "Eventi aziendali in Puglia: idee originali in masseria" | team building puglia location | 8h | Corporate events content live | Owner+Dev |
| Apr W4 | Blog #9: "Come importare un cavallo dall'Italia: guida completa export" | export cavalli italia procedura | 10h | Export guide with CITES, vet certs, logistics, multilingual | Owner+Dev |
| May W1-2 | Video tour virtuale: production day (masseria interiors, exteriors, horses, kitchen, event spaces) | — | 16h | Raw footage captured | Owner+Videomaker |
| May W3 | Video editing + YouTube upload + embed in /la-masseria + /gallery + VideoObject schema | — | 6h | Video live with structured data | Dev |
| May W4 | GEO optimization: AI search citation baseline (test 20 queries in ChatGPT + Perplexity) | — | 6h | Baseline report: which queries mention TA, which don't | Dev |
| Jun W1 | Food blogger collaboration: invite 2-3 local food bloggers for complimentary dinner + review | — | 8h | Reviews + social posts + backlinks secured | Owner |
| Jun W2 | Blog #10: "Capodanno in masseria Puglia: perché scegliere una festa autentica" | capodanno masseria puglia | 8h | Seasonal transactional content live | Owner+Dev |
| Jun W3 | Advanced schema: Offer (pricing ranges), AggregateRating (reviews), HowTo (export procedure) | — | 6h | Rich snippets eligibility expanded | Dev |
| Jun W4 | Mid-year SEO audit: full KPI comparison vs baseline + strategy adjustment document | — | 4h | Mid-year report with H2 2027 adjustments | Dev+Owner |

**Q2 Total:** 82 hours | **Deliverables:** 2-3 backlinks, video tour live, GEO baseline, 3 blog posts, advanced schema, mid-year report

### Quarter 3 (July-September 2027): Peak Season + Niche Content + hreflang

| Month | Task | Keyword Target | Hours | Deliverable | Owner |
|-------|------|---------------|-------|-------------|-------|
| Jul W1 | Blog #11: "Dressage con cavallo Murgese: allenamento e tradizione" | dressage murgese allenamento | 8h | Niche E-E-A-T content live | Owner+Dev |
| Jul W2-3 | GBP peak season: 2x/week posting + real event photos (with couple permission) | — | 4h | GBP engagement maximized during wedding season | Owner |
| Jul W4 | Review volume push: deploy post-event follow-up automation (email + WhatsApp) | — | 4h | Review generation systematized | Owner |
| Aug W1 | Performance optimization: image compression audit, code splitting, font loading optimization | — | 8h | LCP improved, bundle size reduced | Dev |
| Aug W2 | Blog #12: "Attacchi d'epoca in Puglia: storia e tradizione equestre" | attacchi d'epoca puglia storia | 10h | Unique niche content (zero competition) | Owner+Dev |
| Aug W3 | hreflang tags: implement on /cavalli/vetrina for IT/EN/RU/ZH/DE/FR | — | 6h | International SEO signals active | Dev |
| Aug W4 | Press outreach: pitch 3 wedding magazines (Vogue Sposa, Sposi Magazine, Elle Spose) | — | 6h | Media pitches sent with press kit | Owner |
| Sep W1 | /eventi/aziende landing page creation | eventi aziendali puglia location | 10h | Corporate events page live with Event schema | Dev+Owner |
| Sep W2 | Blog #13 (bonus): "Storia delle masserie pugliesi: da agricoltura a ospitalità" | evoluzione masserie puglia | 10h | Thought leadership content live | Owner+Dev |
| Sep W3-4 | Q3 SEO audit + Q4 planning + 2028 strategy prep | — | 8h | Q3 report + Q4/2028 plan drafted | Dev+Owner |

**Q3 Total:** 74 hours | **Deliverables:** hreflang live, /eventi/aziende page, 3 blog posts, performance improved, press outreach, Q3 report

### Phase 3 Completion Checklist

- [ ] 30 pagine live e indicizzate (+7 vs Phase 2)
- [ ] 13 blog posts totali
- [ ] 80+ keyword in top 10 (GSC)
- [ ] 5+ quality backlinks acquired (wedding planners, bloggers, press)
- [ ] Video tour embedded + VideoObject schema validated
- [ ] hreflang tags live on /cavalli/vetrina (6 languages)
- [ ] AI search citation baseline measured + tracked quarterly
- [ ] Advanced schema (Offer, AggregateRating, HowTo) validated
- [ ] 100+ new Google reviews (cumulative growth since Phase 1)
- [ ] LCP <1.5s maintained on mobile
- [ ] Mid-year + Q3 audit reports completed

---

## Phase 4: Authority (Months 7-12 / Oct 1 – Dec 31, 2027)

### Quarter 4 (October-December 2027): Thought Leadership + 2028 Planning

| Month | Task | Keyword Target | Hours | Deliverable | Owner |
|-------|------|---------------|-------|-------------|-------|
| Oct W1 | Thought leadership: "L'evoluzione delle masserie pugliesi: da agricoltura a ospitalità" (2.500w) | storia masserie pugliesi | 12h | Authority content with historical research, citations | Owner+Dev |
| Oct W2 | Niche authority: "Tradizioni equestri in Puglia: gli attacchi d'epoca e i Murgesi" (1.800w) | tradizioni equestri puglia | 10h | Unique content reinforcing horse export positioning | Owner+Dev |
| Oct W3 | PR follow-up: track media mentions, send additional assets, nurture relationships | — | 4h | Coverage report + relationship pipeline | Owner |
| Oct W4 | Year-in-review GBP post + holiday content push (Capodanno, Natale) | — | 3h | Community engagement + seasonal traffic | Owner |
| Nov W1 | Keyword research refresh 2028: new opportunities, lost rankings, emerging trends, AI query analysis | — | 4h | Updated keyword map for 2028 | Dev |
| Nov W2 | Content calendar Q1-Q2 2028: topics, keywords, publishing schedule, resource allocation | — | 6h | Editorial plan approved by owner | Owner+Dev |
| Nov W3 | Competitor analysis refresh: new entrants, strategy shifts, gap updates, SERP feature changes | — | 4h | Updated competitor report | Dev |
| Nov W4 | Budget/resource planning 2028: hours, tools, external costs, videographer, PR agency evaluation | — | 4h | Resource allocation approved | Owner |
| Dec W1 | Annual SEO audit completo: all KPIs vs Year 1 targets, wins, losses, learnings | — | 6h | Annual report with data-driven insights | Dev+Owner |
| Dec W2 | Team retrospective: what worked, what didn't, process improvements for 2028 | — | 4h | Retrospective document with action items | Dev+Owner |
| Dec W3 | Holiday content: Capodanno last-minute push + seasonal social posts + GBP updates | — | 4h | Holiday engagement maximized | Owner |
| Dec W4 | 2028 kickoff prep: tasks assigned, deadlines set, tools renewed, contracts signed | — | 4h | 2028 ready to execute from Jan 1 | Dev+Owner |

**Q4 Total:** 65 hours | **Deliverables:** 2 thought leadership posts, 2028 strategy complete, annual report, retrospective

### Phase 4 / Year 1 Completion Checklist

- [ ] 32+ pagine live e indicizzate
- [ ] 15 blog posts totali
- [ ] 180+ keyword in top 10
- [ ] 10.000+ organic visits/month (GA4)
- [ ] 5+ quality backlinks from relevant sites (DA 30+)
- [ ] 500+ total reviews (Google + TripAdvisor + TheFork combined)
- [ ] Top 5 local pack for "matrimonio in masseria Puglia"
- [ ] AI search citations appearing in ChatGPT/Perplexity for 5+ target queries
- [ ] 40+ export leads (EU/RU/CN) generated via /cavalli/vetrina (GA4 event tracking)
- [ ] 2028 strategy document approved with budget, calendar, and KPI targets
- [ ] Annual audit report + retrospective document archived in docs/seo/

---

## Resource Requirements Summary

### Human Resources (Weekly Average by Phase)

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Notes |
|------|---------|---------|---------|---------|-------|
| Developer (part-time) | 15h/wk | 12h/wk | 10h/wk | 8h/wk | Decreases as infrastructure stabilizes |
| Owner (content + GBP) | 10h/wk | 10h/wk | 12h/wk | 8h/wk | Peaks during content-heavy phases |
| Videographer (one-time) | — | — | 16h total | — | Q2 only, video tour production |
| Wedding planner partners | — | — | 5h total | 5h/qtr | Ongoing relationship management |
| Food bloggers (one-time) | — | — | 8h total | — | Q2-Q3 collaboration |

### Tools & Budget (Annual Estimate)

| Tool | Cost | Purpose | Required? |
|------|------|---------|-----------|
| Google Search Console | Free | Rankings, indexation, impressions | ✅ Yes |
| GA4 | Free | Traffic, conversions, behavior | ✅ Yes |
| Google Business Profile | Free | Local SEO, reviews, insights | ✅ Yes |
| Ubersuggest Pro (optional) | €29/mo | Keyword research, competitor tracking | 🟡 Optional |
| Screaming Frog (free tier) | Free (500 URL) | Technical audits | ✅ Yes |
| Canva Pro (optional) | €12/mo | Social graphics, GBP post images | 🟡 Optional |
| Mailchimp (free tier) | Free (500 contacts) | Email list building, review automation | 🟡 Optional |
| Videographer (one-time) | €800-1.500 | Professional video tour | 🟡 Recommended Q2 |
| Press kit design (one-time) | €200-400 | Media outreach materials | 🟡 Optional Q3 |
| **Total optional annual** | **€492-2.388** | | |

---

## Risk Mitigation by Phase

| Phase | Primary Risk | Probability | Impact | Mitigation | Contingency |
|-------|-------------|-------------|--------|------------|-------------|
| 1 | Delayed page creation (owner bandwidth) | Medium | High | Prioritize /la-masseria + /faq first (highest SEO impact); batch content weekends | Reduce to 3 pages if needed, defer /gallery to Phase 2 |
| 2 | Content quality inconsistency | Medium | Medium | Use competitor top 3 as quality benchmark; AI drafting assistance for first drafts | Hire freelance writer for 2-3 pillar posts if owner overwhelmed |
| 3 | Link building rejection / low response rate | High | Medium | Focus on genuine partnerships (offer value, not just link ask); personalize every pitch | Expand to 10 targets if 5 don't respond; try directory listings as backup |
| 3 | Video production delays | Medium | Low | Use placeholder professional stock footage temporarily; reschedule rather than rush | Skip video in Phase 3, move to Phase 4 if budget/timing fails |
| 4 | Algorithm update impact | Medium | High | Diversify traffic sources (social, email, referral, direct); E-E-A-T foundation protects against most updates | Audit immediately post-update; adjust content strategy within 2 weeks |
| All | Seasonal traffic drops (Nov-Feb) | High | Medium | Evergreen content (export horses, breed info, territory guides) maintains baseline; off-season event promotion (Capodanno, corporate) | Accept seasonal dip; focus on content production during low season for peak season payoff |
| All | Owner bandwidth limits | High | Medium | Batch content production (dedicate 1 weekend/month); AI drafting assistance; prioritize revenue-impacting pages first | Defer blog posts to maintain service page quality; reduce frequency to biweekly |
| All | Export regulations change (Russia/Cina) | Low | High | Quarterly regulatory monitoring; veterinary/legal consultant on retainer for export documentation | Pause export marketing for affected markets; pivot to EU-only messaging |

---

## Success Metrics Dashboard (Monthly Review Template)

```
MONTH: ___ / 2027    PHASE: ___

ORGANIC TRAFFIC
├── Sessions: ___/month (target: ___ by end of phase)
├── Users: ___/month
├── Bounce rate: ___% (target: <45%)
└── Avg. session duration: ___ (target: >2min)

KEYWORD RANKINGS
├── Top 3: ___ keywords (Δ vs last month: ___)
├── Top 10: ___ keywords (target: ___ by end of phase)
├── Top 20: ___ keywords
└── Total impressions: ___/month (Δ: ___%)

INDEXATION
├── Indexed pages: ___ (target: ___ by end of phase)
├── Coverage errors: ___ (fix within 2 weeks)
└── Sitemap status: OK / Error

LOCAL SEO
├── GBP views: ___/month (Δ: ___%)
├── GBP calls: ___/month
├── GBP directions: ___/month
└── New Google reviews: ___/month (target: 8-10/month)

EXPORT LEADS (/cavalli/vetrina)
├── Page sessions: ___/month
├── WhatsApp clicks: ___/month
├── Email inquiries: ___/month
├── Video calls scheduled: ___/month
└── Export leads (RU/CN): ___/month

CONVERSIONS (ALL PAGES)
├── WhatsApp clicks (total): ___/month
├── Phone calls (tracked via GTM): ___/month
└── Form submissions: ___/month

CORE WEB VITALS (MOBILE)
├── LCP: ___s (target: <1.5s by Phase 3)
├── INP: ___ms (target: <50ms)
└── CLS: ___ (target: <0.03)

CONTENT PRODUCED THIS MONTH
├── Pages published: ___
├── Blog posts published: ___
├── GBP posts: ___
├── Photos added to gallery: ___
└── Videos published: ___

BACKLINKS ACQUIRED THIS MONTH
├── New referring domains: ___
├── Quality links (DA 30+): ___
└── Anchor text distribution: branded ___%, exact ___%, generic ___%

AI SEARCH VISIBILITY
├── ChatGPT citations (out of 20 test queries): ___
├── Perplexity citations (out of 20 test queries): ___
└── New queries where TA appears: ___

NOTES / ISSUES / ADJUSTMENTS
_________________________________________________
_________________________________________________
```

---

*Documento generato il 2026-11-17. Aggiornare mensilmente con dati reali. Review quarterly con owner + dev. Annual audit ogni dicembre.*