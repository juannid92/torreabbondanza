# Torre Abbondanza — Piano Completo Sito

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completare, ottimizzare e validare il sito torreabbondanza.com per la consegna di martedì 17 novembre 2026.

**Architecture:** Il sito è un'app React SSR con TanStack Router + Vite/Nitro, deploy su Cloudflare Workers. Le sezioni sono componenti monolitici con animazioni GSAP/ScrollTrigger. I dati canonici vivono in `src/lib/site.ts`. Le route dedicate (`/cucina`, `/cavalli`, `/eventi`) riutilizzano gli stessi componenti della home.

**Tech Stack:** React 19, TanStack Router, TanStack Query, GSAP + ScrollTrigger, Framer Motion, Tailwind CSS v4, Supabase (auth/storage), Lenis (smooth scroll), Nitro/Cloudflare Workers.

**Spec:** Analisi completa del codebase corrente (2026-11-13). Build produzione ✓ (638ms, zero errori). Route tree modificato (`src/routeTree.gen.ts` M).

## Global Constraints

- Dominio produzione: `https://torreabbondanza.com` (src/lib/site.ts:14)
- Lingua interfaccia: italiano; meta tag `og:locale: it_IT` (__root.tsx:90)
- Font self-hosted via @fontsource (nessuna richiesta esterna a Google Fonts)
- Smooth scroll: Lenis obbligatorio su ogni route (hook `useLenis()`)
- Reduced motion: tutti i componenti GSAP devono rispettare `prefers-reduced-motion: reduce`
- Immagini: sempre `loading="lazy"`, `width`/`height` espliciti, `alt` descrittivo in italiano
- Video hero: solo MP4 muted autoplay loop playsInline preload="auto"
- Contatti: WhatsApp + telefono come unici canali diretti (no form email pubblico)
- Dati strutturati: JSON-LD Restaurant nella home, canonical su ogni route
- Cookie/GDPR: banner + preferenze cookie persistenti (CustomEvent `open-cookie-preferences`)
- Deploy target: Cloudflare Workers via Nitro (`npx nitro deploy --prebuilt`)
- Branch protetta: main → Lovable sync. Mai force-push/rebase su commit già pushati (AGENTS.md)
- Deadline: martedì 17 novembre 2026

## Review Focus

1. **Navigazione cross-route**: i link anchor (#cucina, #cavalli, ecc.) funzionano nella home ma puntano a ID che non esistono nelle route dedicate (/cucina, /cavalli, /eventi) — verificare fallback o navigazione corretta.
2. **Video hero caricamento**: il video `/hero-video.mp4` ha `preload="auto"` — verificare dimensione file e impatto LCP su mobile 3G.
3. **GSAP cleanup**: ogni componente registra ScrollTrigger e timeline — verificare che `ctx.revert()` sia chiamato correttamente su unmount e route change per prevenire memory leak.
4. **Immagini duplicate**: `murgese-studio.jpg` è usata in 4 contesti diversi in HorsesSection (apparition, prateria cielo, prateria colline, tradizione) — verificare che le immagini siano appropriate per ciascun contesto o se servono asset distinti.
5. **SEO route dedicate**: le route /cucina, /cavalli, /eventi hanno meta tag ma mancano di JSON-LD specifici e di Open Graph image dedicate — verificare copertura SEO completa.

---

### Task 1: Verificare e correggere il route tree generato

**Files:**
- Modify: `src/routeTree.gen.ts` (attualmente modified in working tree)

**Interfaces:**
- Consumes: configurazione route da `src/routes/*.tsx`
- Produces: albero route corretto per TanStack Router

- [ ] **Step 1: Rigenerare il route tree**

Run: `cd "/home/giovannimacina/Progetti/torreabbondanza (Copia)" && npx tsr generate`
Expected: output conferma generazione, exit code 0

- [ ] **Step 2: Verificare che il build passi con il nuovo route tree**

Run: `npx vite build 2>&1 | tail -5`
Expected: `✓ built in` senza errori

- [ ] **Step 3: Commit**

```bash
git add src/routeTree.gen.ts
git commit -m "chore: rigenera route tree dopo aggiunta route dedicate"
```

---

### Task 2: Aggiungere header di navigazione persistente alle route dedicate

**Files:**
- Create: `src/components/SiteHeader.tsx`
- Modify: `src/routes/cucina.tsx`
- Modify: `src/routes/cavalli.tsx`
- Modify: `src/routes/eventi.tsx`

**Interfaces:**
- Consumes: `BUSINESS` da `@/lib/site`, `Link` da `@tanstack/react-router`
- Produces: `<SiteHeader />` — componente header responsive con logo, nav link alle route dedicate + anchor home, CTA WhatsApp

- [ ] **Step 1: Creare SiteHeader.tsx**

Componente con:
- Logo testuale "Torre Abbondanza" linkato a `/`
- Nav desktop: Cucina, Cavalli, Eventi (Link to="/cucina" etc.) + Home (anchor #top)
- Mobile: hamburger menu con stessa nav
- CTA WhatsApp fissa a destra
- Background trasparente → solido on scroll (IntersectionObserver)
- Rispetta reduced motion

- [ ] **Step 2: Integrare SiteHeader nelle route dedicate**

Aggiungere `<SiteHeader />` come primo figlio di `<main>` in cucina.tsx, cavalli.tsx, eventi.tsx.

- [ ] **Step 3: Verificare build**

Run: `npx vite build 2>&1 | tail -5`
Expected: ✓ built

- [ ] **Step 4: Commit**

```bash
git add src/components/SiteHeader.tsx src/routes/cucina.tsx src/routes/cavalli.tsx src/routes/eventi.tsx
git commit -m "feat: aggiungi header navigazione persistente alle route dedicate"
```

---

### Task 3: Aggiungere JSON-LD specifici alle route dedicate

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/routes/cucina.tsx`
- Modify: `src/routes/cavalli.tsx`
- Modify: `src/routes/eventi.tsx`

**Interfaces:**
- Consumes: `BUSINESS`, `SITE_URL`, `absoluteUrl` da `@/lib/site`
- Produces: `buildKitchenJsonLd()`, `buildHorsesJsonLd()`, `buildEventsJsonLd()` — funzioni che ritornano oggetti schema.org

- [ ] **Step 1: Aggiungere builder JSON-LD in site.ts**

```typescript
export function buildKitchenJsonLd(imageUrl: string) {
  // @type: Restaurant, servesCuisine: Pugliese, acceptsReservations: true
}

export function buildHorsesJsonLd(imageUrl: string) {
  // @type: LocalBusiness, additionalType: HorseBreeding, description from BUSINESS
}

export function buildEventsJsonLd(imageUrl: string) {
  // @type: EventVenue, capacity, availableService
}
```

- [ ] **Step 2: Integrare JSON-LD nelle head delle route dedicate**

Ogni route aggiunge `scripts: [{ type: "application/ld+json", children: JSON.stringify(buildXxxJsonLd(...)) }]` alla propria `head()`.

- [ ] **Step 3: Verificare build**

Run: `npx vite build 2>&1 | tail -5`
Expected: ✓ built

- [ ] **Step 4: Commit**

```bash
git add src/lib/site.ts src/routes/cucina.tsx src/routes/cavalli.tsx src/routes/eventi.tsx
git commit -m "feat(seo): aggiungi JSON-LD specifici alle route dedicate"
```

---

### Task 4: Ottimizzare asset video hero e immagini critiche

**Files:**
- Verify: `public/hero-video.mp4`
- Assets: `src/assets/hero-masseria.jpg`, `src/assets/murgese-studio.jpg`

**Interfaces:**
- Consumes: asset esistenti
- Produces: report dimensioni + eventuale versione ottimizzata

- [ ] **Step 1: Misurare dimensioni asset critici**

Run: `ls -lh public/hero-video.mp4 src/assets/hero-masseria.jpg src/assets/murgese-studio.jpg`
Expected: output con dimensioni file

- [ ] **Step 2: Se video > 5MB, creare versione web-optimized**

Se necessario, generare versione ridotta con ffmpeg (bitrate target 1.5Mbps, 1080p max, codec H.264 baseline).

- [ ] **Step 3: Aggiungere poster image al video hero**

In HeroSoglia.tsx, aggiungere attributo `poster={heroImage}` al tag `<video>` per evitare flash bianco durante il caricamento.

- [ ] **Step 4: Verificare build e dimensioni output**

Run: `npx vite build 2>&1 | grep -E "(hero|video|gzip)"`
Expected: chunk sizes ragionevoli

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf: ottimizza video hero e aggiungi poster image"
```

---

### Task 5: Verificare e migliorare accessibilità (WCAG 2.2 AA)

**Files:**
- Modify: `src/components/HeroSoglia.tsx`
- Modify: `src/components/KitchenSection.tsx`
- Modify: `src/components/HorsesSection.tsx`
- Modify: `src/components/EventsSection.tsx`
- Modify: `src/components/SiteFooter.tsx`

**Interfaces:**
- Consumes: componenti esistenti
- Produces: markup accessibile conforme WCAG 2.2 AA

- [ ] **Step 1: Audit aria-label e ruoli mancanti**

Verificare che ogni sezione abbia `aria-labelledby` corretto, che i bottoni icona abbiano `aria-label`, che le immagini decorative abbiano `aria-hidden="true"` e `alt=""`.

- [ ] **Step 2: Verificare contrasto colori**

Controllare che i testi con `text-ivory/70`, `text-ink/60` e simili abbiano rapporto contrasto ≥ 4.5:1 rispetto allo sfondo. Aggiustare opacità minime dove necessario.

- [ ] **Step 3: Verificare focus visible**

Tutti gli elementi interattivi (link, bottoni, MagneticButton) devono avere `focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2`.

- [ ] **Step 4: Verificare skip-to-content**

Aggiungere link "Vai al contenuto principale" come primo elemento focusabile in __root.tsx.

- [ ] **Step 5: Test con prefers-reduced-motion**

Verificare che tutte le animazioni GSAP e Framer Motion si disattivino correttamente quando `prefers-reduced-motion: reduce` è attivo.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "a11y: migliora conformità WCAG 2.2 AA su tutte le sezioni"
```

---

### Task 6: Validare SEO tecnica completa

**Files:**
- Verify: `src/routes/__root.tsx`
- Verify: `src/routes/index.tsx`
- Verify: `src/routes/cucina.tsx`, `cavalli.tsx`, `eventi.tsx`, `privacy.tsx`, `cookie.tsx`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: route esistenti, SITE_URL
- Produces: robots.txt, sitemap.xml, meta tag completi

- [ ] **Step 1: Generare sitemap.xml dinamico o statico**

Elencare tutte le URL pubbliche: /, /cucina, /cavalli, /eventi, /privacy, /cookie. Includere lastmod, changefreq, priority.

- [ ] **Step 2: Creare robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://torreabbondanza.com/sitemap.xml
```

- [ ] **Step 3: Verificare meta tag OG/Twitter su tutte le route**

Ogni route dedicata deve avere og:title, og:description, og:image specifici (non ereditati dal root).

- [ ] **Step 4: Verificare canonical URL**

Ogni route ha `<link rel="canonical">` corretto con SITE_URL + path.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/sitemap.xml src/routes/
git commit -m "feat(seo): aggiungi sitemap, robots.txt e valida meta tag"
```

---

### Task 7: Performance audit e ottimizzazione bundle

**Files:**
- Verify: output build `.output/`
- Config: `vite.config.ts` (se esiste), `app.config.ts`

**Interfaces:**
- Consumes: build output
- Produces: report performance + eventuali ottimizzazioni

- [ ] **Step 1: Analizzare dimensioni chunk SSR**

I chunk maggiori sono:
- `@tanstack/react-router`: 651 kB (137 kB gzip)
- `framer-motion`: 366 kB (96 kB gzip)
- `gsap`: 251 kB (66 kB gzip)
- `@supabase/auth-js+tslib`: 321 kB (65 kB gzip)

Verificare se framer-motion è necessario o se le animazioni possono essere migrate a GSAP puro (riduzione ~96 kB gzip).

- [ ] **Step 2: Verificare code splitting route**

Le route dedicate dovrebbero essere lazy-loaded. Verificare che i chunk SSR separati esistano per ciascuna route.

- [ ] **Step 3: Ottimizzare import GSAP**

Verificare che i componenti importino solo i plugin necessari (`gsap`, `ScrollTrigger`) e non l'intero bundle GSAP.

- [ ] **Step 4: Commit eventuali ottimizzazioni**

```bash
git add -A
git commit -m "perf: ottimizza bundle size e code splitting"
```

---

### Task 8: Test end-to-end flussi utente critici

**Files:**
- Test: flussi navigazionali
- Verify: tutte le route

**Interfaces:**
- Consumes: sito completo
- Produces: report test E2E

- [ ] **Step 1: Avviare preview server**

Run: `npx vite preview` (in background)

- [ ] **Step 2: Testare flusso Home → Sezione Cucina → WhatsApp**

Navigare /, scrollare a #cucina, cliccare CTA WhatsApp → verifica apertura wa.me con messaggio precompilato.

- [ ] **Step 3: Testare flusso /cavalli → esperienza equestre → contatti**

Navigare /cavalli, verificare rendering HorsesSection, cliccare CTA → verifica scroll a #contatti o redirect.

- [ ] **Step 4: Testare flusso /eventi → richiesta informazioni**

Navigare /eventi, verificare dolly orizzontale (desktop) / layout verticale (mobile), cliccare CTA finale.

- [ ] **Step 5: Testare responsive mobile (375px)**

Verificare che tutte le sezioni renderizzino correttamente a viewport mobile, che il menu hamburger funzioni, che la barra concierge appaia dopo lo scroll.

- [ ] **Step 6: Testare cookie banner e preferenze**

Verificare che il banner appaia al primo visit, che le preferenze siano salvate, che il bottone "Preferenze cookie" nel footer riapra il pannello.

- [ ] **Step 7: Documentare risultati test**

Creare nota con esiti e screenshot se necessario.

- [ ] **Step 8: Commit fix eventuali**

```bash
git add -A
git commit -m "fix: risolvi problemi emersi dai test E2E"
```

---

### Task 9: Preparazione deploy e validazione finale

**Files:**
- Verify: `.output/` build output
- Verify: `.wrangler/deploy/config.json`
- Config: environment variables Cloudflare

**Interfaces:**
- Consumes: build produzione
- Produces: deploy pronto per Cloudflare Workers

- [ ] **Step 1: Verificare build produzione pulito**

Run: `rm -rf .output && npx vite build`
Expected: ✓ built senza warning

- [ ] **Step 2: Verificare wrangler config**

Run: `cat .wrangler/deploy/config.json`
Expected: nome worker, compatibility_date, routes configurate

- [ ] **Step 3: Verificare variabili ambiente necessarie**

Supabase URL/key, eventuali secret per auth middleware. Confermare che siano configurate nel dashboard Cloudflare.

- [ ] **Step 4: Preview locale pre-deploy**

Run: `npx vite preview` → test rapido smoke test su localhost:4173

- [ ] **Step 5: Deploy (previa approvazione)**

Run: `npx nitro deploy --prebuilt`
Expected: deploy completato, URL live confermato

- [ ] **Step 6: Validazione post-deploy**

Verificare su dominio live: homepage, route dedicate, meta tag, JSON-LD, performance Lighthouse.

- [ ] **Step 7: Commit finale e tag**

```bash
git tag v1.0.0-2026-11-17
git push origin main --tags
```

---

## Timeline per Martedì 17 Novembre 2026

| Giorno | Task | Priorità |
|--------|------|----------|
| Ven 14 | Task 1 (route tree), Task 2 (header), Task 3 (JSON-LD) | Alta |
| Sab 15 | Task 4 (asset), Task 5 (accessibilità) | Alta |
| Dom 16 | Task 6 (SEO), Task 7 (performance) | Media |
| Lun 17 AM | Task 8 (test E2E), fix eventuali | Alta |
| Lun 17 PM | Task 9 (deploy + validazione) | Critica |
| Mar 17 | Buffer per imprevisti, validazione finale | Critica |

## Note per l'esecutore

- Il build attuale passa in 638ms con zero errori — mantenere questo stato.
- `src/routeTree.gen.ts` è attualmente modified: Task 1 va eseguito per primo.
- Le animazioni GSAP sono pervasive: qualsiasi modifica ai componenti richiede verifica del cleanup.
- `murgese-studio.jpg` è riutilizzata in 4 contesti in HorsesSection: valutare se servono asset dedicati per prateria/cielo/colline.
- Il footer contiene FloatingConciergeAndTop: verificare che non interferisca con le route dedicate.
- Supabase è integrato per auth/storage: verificare che le env vars siano configurate prima del deploy.