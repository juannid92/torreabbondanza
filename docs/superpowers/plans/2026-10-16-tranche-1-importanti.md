# Piano di fix — Tranche 1 (I1, I2, I3, I4, I5) del code review statico

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Risolvere i 5 task "importanti" (I1–I5) del report di code review statico del 2026-10-16, in modo atomico, con review per task e commit separati.

**Architecture:** Ogni task è un fix indipendente di scope ridotto (1-2 file, <50 righe di diff). Niente nuove dipendenze, niente refactor, niente cambi estetici. Ponytail mode: commentare solo il "why".

**Tech Stack:** TanStack Start 1.167.50, React 19, TypeScript 5.8, ESLint flat config, GSAP 3.15, Vitest 2.1.

**Spec:** `/home/giovannimacina/KravMaga Putignano/torreabbondanza/docs/superpowers/reports/2026-10-16-static-code-review.md` (autorità per "cosa fixare"). Vedere Allegato A in fondo a questo piano per i 5 estratti completi.

## Global Constraints

- **No estetica:** nessun cambio visibile lato utente. Fix solo dove il report lo richiede esplicitamente.
- **Typecheck obbligatorio:** `npx tsc --noEmit` deve restare pulito dopo ogni fix.
- **Test obbligatori:** `npm test` deve restare 11/11 verdi (contact-message + contact-submit).
- **Commit hygiene:** un commit per task, messaggio che cita l'ID del task (I1, I2, …), termina con `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- **Cronologia git intatta:** no force push, no rebase su commit pushed, no amend su commit pushed. Il branch è connesso a Lovable.
- **Linguaggio:** commenti e messaggi di commit in italiano (codice e identificatori restano in inglese).
- **Ponytail:** minimo codice, no over-engineering, no astrazione inutile, niente nuovi file se non strettamente necessari.
- **Commenti:** spiega solo il "why" non il "what". Una riga per commento, di solito.

## Review Focus

Cose che i test automatici non coprono ma che un essere umano noterebbe:

1. **I1 / `contact-submit.functions.ts`** — la regola ESLint `no-restricted-imports` bandisce esplicitamente `server-only` di Next.js. La nota nel config dice "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts`…". Vanno considerati entrambi i workaround: (a) rinominare il file, (b) sostituire con `@tanstack/react-start/server-only` se esiste. Verificare se `@tanstack/react-start` esporta un equivalente.
2. **I3 / `ArchFrame.tsx`** — il reveal deve rispettare `prefers-reduced-motion`; se aggiungiamo scrollTrigger, va aggiunto anche il check per il motion preference.
3. **I5 / `StorySection.tsx`** — l'alt text è in italiano e va corretto per descrivere fedelmente l'asset (un SVG stilizzato), non una foto.

---

## Task 1: Fix ESLint error — `server-only` import bandito (I1)

**File:**
- Modify: `src/lib/contact-submit.functions.ts` (rinominare o sostituire import)
- Eventualmente Modify: `src/routes/index.tsx` (se cambia il path dell'import)
- Test: `src/lib/contact-submit.test.ts` (deve continuare a importare e passare)

**Interfacce:**
- Consumes: l'oggetto `submitContact` esportato da `contact-submit.functions.ts` viene importato da `src/components/VisitSection.tsx` riga 9. Il rinominamento del file non deve rompere quella import.
- Produce: la regola `no-restricted-imports` in `eslint.config.js` non deve più segnalare questo file.

**Step 1: Verifica se `@tanstack/react-start` offre un equivalente a `server-only`.**

Comando: `grep -r "server-only" node_modules/@tanstack/react-start/ 2>/dev/null | head -5` o `cat node_modules/@tanstack/react-start/package.json | grep -i "server"`.

Atteso: se esiste `@tanstack/react-start/server-only` o simile, useremo quello. Altrimenti, rinominiamo il file in `contact-submit.functions.server.ts` come suggerisce il commento in `eslint.config.js`.

**Step 2: Decidi e applica il fix.**

Se esiste un equivalente (`@tanstack/react-start/server-only`):
- Sostituisci `import "server-only";` con `import "@tanstack/react-start/server-only";`

Altrimenti (più probabile):
- Rinomina `src/lib/contact-submit.functions.ts` → `src/lib/contact-submit.functions.server.ts` con `git mv`
- Aggiorna l'import in `src/components/VisitSection.tsx` riga 9
- Aggiorna l'import in `src/lib/contact-submit.test.ts` riga 19
- Rimuovi la riga `import "server-only";`

**Step 3: Verifica.**

```bash
npx tsc --noEmit    # deve passare
npm test            # 11/11 devono restare verdi
npm run lint 2>&1 | grep -A 1 "contact-submit"  # questo specifico errore non deve più apparire
```

Atteso: typecheck pulito, 11/11 test verdi, zero errori ESLint su questo file.

**Step 4: Commit.**

```bash
git add <file modificati/aggiunti>
git commit -m "fix(lint): rimuovi import 'server-only' bandito da eslint (I1)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 2: Fix ESLint error — `any` type in `globalThis.env` (I1)

**File:**
- Modify: `src/lib/contact-submit.functions.ts` (o il nuovo nome del file se rinominato nel Task 1) alla riga che contiene `(globalThis as any).env`

**Interfacce:**
- Consumes: nessuno (fix locale)
- Produce: zero errori ESLint `no-explicit-any` su questo file. Il codice deve continuare a funzionare su Cloudflare Workers (dove `globalThis.env` esiste) e in Node (dove `process.env` esiste).

**Step 1: Trova la riga esatta.**

Comando: `grep -n "globalThis as any" src/lib/contact-submit.functions.ts`

Atteso: una riga che legge `const env = (globalThis as any).env ?? process.env;`

**Step 2: Sostituisci con tipo esplicito.**

Cambia:
```ts
const env = (globalThis as any).env ?? process.env;
```

In:
```ts
const env: Record<string, string | undefined> =
  ((globalThis as { env?: Record<string, string | undefined> }).env ?? process.env) as Record<string, string | undefined>;
```

Oppure, se il rinominamento in Task 1 è avvenuto, adatta il path.

**Step 3: Verifica.**

```bash
npx tsc --noEmit
npm test
npm run lint 2>&1 | grep "globalThis"  # non deve apparire
```

Atteso: typecheck pulito, test verdi, nessun errore su `globalThis`.

**Step 4: Commit.**

```bash
git add src/lib/contact-submit.functions.ts
git commit -m "fix(lint): tipo esplicito per globalThis.env (I1)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 3: Fix ESLint error — `let timer` → `const timer` in EventsSection (I1)

**File:**
- Modify: `src/components/EventsSection.tsx` alla riga 38 circa (`let timer` → `const timer`)

**Interfacce:**
- Consumes: nessuno
- Produce: zero errori ESLint `prefer-const` su questo file.

**Step 1: Trova la riga.**

Comando: `grep -n "let timer" src/components/EventsSection.tsx`

**Step 2: Conferma che non viene riassegnato.**

Comando: `grep -n "timer\s*=" src/components/EventsSection.tsx`

Atteso: solo la dichiarazione iniziale. Se vedi riassegnazioni, lascia `let` e aggiungi un commento di soppressione con `// eslint-disable-next-line prefer-const`.

**Step 3: Cambia `let timer` in `const timer`.**

**Step 4: Verifica e committa.**

```bash
npx tsc --noEmit
npm test
git add src/components/EventsSection.tsx
git commit -m "fix(lint): prefer-const in EventsSection (I1)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 4: Fix commento ArchFrame border-radius (I2)

**File:**
- Modify: `src/components/ArchFrame.tsx` righe 25-27 (commento accanto a `archRadius`)

**Interfacce:**
- Consumes: nessuno
- Produce: il commento è ora coerente con la realtà. Nessun cambiamento al codice.

**Step 1: Leggi il commento attuale.**

Comando: `sed -n '20,30p' src/components/ArchFrame.tsx`

**Step 2: Sostituisci il commento.**

Il commento attuale dice qualcosa come "verticale 38% (≈ width/2 di un box 3:4)". La matematica corretta per un border-radius ellittico con `38% 38% 0 0` in un box 3:4 è: l'arco copre il 38% del lato (height/2.67, non width/2). Correggerlo in:

```ts
// Raggio ellittico dell'arco: il 38% sui lati orizzontali e verticali
// genera un arco coerente con un box 3:4 (≈ height/2.67).
```

Oppure un testo equivalente, purché la matematica sia corretta.

**Step 3: Verifica e committa.**

```bash
npx tsc --noEmit
git add src/components/ArchFrame.tsx
git commit -m "docs(ArchFrame): correggi matematica del commento border-radius (I2)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 5: Fix ArchFrame reveal — aggiungi scrollTrigger + reduced-motion (I3)

**File:**
- Modify: `src/components/ArchFrame.tsx` (l'animazione `gsap.fromTo` su `clipPath` che attualmente parte al mount)

**Interfacce:**
- Consumes: `useReducedMotion()` da framer-motion è già importato nel codebase se serve (verifica); in alternativa `window.matchMedia`.
- Produce: il reveal `clipPath` parte quando la finestra entra in viewport, non al mount. Rispetta `prefers-reduced-motion`.

**Step 1: Leggi il componente.**

Comando: `sed -n '40,70p' src/components/ArchFrame.tsx`

**Step 2: Identifica l'animazione `gsap.fromTo` su `clipPath`.**

Dovrebbe essere la transizione che fa "aprire" la finestra. Attualmente ha `gsap.delayedCall` o parte al mount senza `scrollTrigger`.

**Step 3: Aggiungi lo scrollTrigger e il check reduced-motion.**

Prima della `gsap.fromTo`, prendi il valore:
```ts
const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

Sostituisci l'animazione esistente con:
```ts
if (!reduced) {
  gsap.fromTo(
    el,
    { clipPath: "inset(45% 50% 45% 50% round 50% 50% 0 0 / 38% 38% 0 0)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 50% 50% 0 0 / 38% 38% 0 0)",
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );
}
```

Adatta `el` al riferimento corretto. Se il reveal attualmente si applica a più elementi, mantieni la logica esistente ma aggiungi `scrollTrigger` a ogni `gsap.fromTo`.

**Step 4: Aggiungi `gsap.registerPlugin(ScrollTrigger)` se non già fatto nel file.**

Comando: `grep -n "registerPlugin" src/components/ArchFrame.tsx`

**Step 5: Verifica e committa.**

```bash
npx tsc --noEmit
npm test
git add src/components/ArchFrame.tsx
git commit -m "fix(ArchFrame): reveal della soglia su scrollTrigger + reduced-motion (I3)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 6: Fix ArchFrame video autoplay silent failure (I4)

**File:**
- Modify: `src/components/ArchFrame.tsx` (la chiamata `videoRef.current.play().catch(() => {})`)

**Interfacce:**
- Consumes: nessuno
- Produce: in dev, un warning in console se il video fallisce a partire. In prod, comportamento identico a oggi (silent).

**Step 1: Trova la riga.**

Comando: `grep -n ".play().catch" src/components/ArchFrame.tsx`

**Step 2: Sostituisci con un catch che logga in dev.**

Cambia:
```ts
videoRef.current.play().catch(() => {});
```

In:
```ts
videoRef.current.play().catch((e) => {
  // In dev, logga il motivo del fallimento (autoplay bloccato, codec,
  // URL 404). In prod resta silenzioso: la foto statica fa da fallback.
  if (import.meta.env.DEV) console.warn("[ArchFrame] video autoplay failed:", e);
});
```

**Step 3: Verifica e committa.**

```bash
npx tsc --noEmit
git add src/components/ArchFrame.tsx
git commit -m "fix(ArchFrame): log dev su autoplay video fallito (I4)

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Task 7: Fix StorySection alt text alessio-cura.svg (I5)

**File:**
- Modify: `src/components/StorySection.tsx` (l'`alt` text e/o la stringa importata)
- Verify: `src/assets/alessio-cura.svg` esiste ed è effettivamente un SVG stilizzato, non una foto

**Step 1: Trova l'alt text attuale.**

Comando: `grep -n "alessio-cura\|fotografia in bianco" src/components/StorySection.tsx`

**Step 2: Conferma l'asset.**

Comando: `file src/assets/alessio-cura.svg` o `head -c 200 src/assets/alessio-cura.svg`

Atteso: è un `<svg>`, non un raster.

**Step 3: Correggi l'alt text.**

Il commento interno menziona: il file è 247KB ed è un SVG stilizzato, non una foto. L'alt text attuale dice "fotografia in bianco e nero" — errato.

Sostituisci con qualcosa di aderente all'asset, ad esempio:
```ts
alt="Illustrazione stilizzata di un cavallo Murgese e del mandriano, in bianco e nero"
```

Se l'asset mostra altro, adatta. Il principio: l'alt deve descrivere l'asset reale, non quello che l'autore avrebbe voluto.

**Step 4: Verifica e committa.**

```bash
npx tsc --noEmit
git add src/components/StorySection.tsx
git commit -m "fix(StorySection): correggi alt text di alessio-cura.svg (I5)

L'asset è un'illustrazione SVG stilizzata, non una fotografia.
Aggiornato l'alt per descrivere fedelmente il contenuto.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Allegato A — Estratto del report per I1–I5

> ### I1 — ESLint: 3 errori reali (525 restanti sono `prettier/prettier`)
> - **Cosa:** `tsc --noEmit` è pulito, ma `eslint .` segnala:
>   1. `src/lib/contact-submit.functions.ts:1:1` — `'server-only' import is restricted from being used` (esplicitamente bandito in `eslint.config.js`)
>   2. `src/lib/contact-submit.functions.ts:128:32` — `Unexpected any` in `(globalThis as any).env`
>   3. `src/components/EventsSection.tsx:38:11` — `'timer' is never reassigned. Use 'const' instead`
> - **Dove:** vedi sopra
> - **Impatto:** il build passa (ESLint non blocca), ma il check `pnpm lint` (o `npm run lint`) fallisce e la regola esiste apposta. La regola su `server-only` è un promemoria esplicito: il package Next.js non funziona con TanStack Start.
> - **Decisione:** rinominare `contact-submit.functions.ts` in `contact-submit.functions.server.ts` o sostituire l'import con `@tanstack/react-start/server-only`. Cambiare `(globalThis as any).env` in tipo `Record<string, string | undefined>`. Sostituire `let timer` con `const timer`.
>
> ### I2 — ArchFrame: commento del border-radius sbagliato
> - **Cosa:** il commento dice `verticale 38% (≈ width/2 di un box 3:4)`. Per un box 3:4 (largo:alto = 3:4), `width/2` sarebbe 50% del lato corto, ma height/2 è 50% del lato lungo. La formula reale è `38% ≈ height/2.67`. Il valore è corretto per l'arco, la spiegazione no.
> - **Dove:** [src/components/ArchFrame.tsx:25-27](src/components/ArchFrame.tsx#L25-L27)
> - **Decisione:** correggere il commento in `(≈ height/2.67 per un box 3:4)`. Facoltativo.
>
> ### I3 — ArchFrame: il reveal di apertura non ha `scrollTrigger`
> - **Cosa:** `gsap.fromTo` su `clipPath` parte al mount, non quando la finestra entra in viewport. Se l'ArchFrame è usato in sezioni sotto la fold (es. StorySection), la soglia si "apre" prima che l'utente la veda, perdendo l'effetto.
> - **Dove:** [src/components/ArchFrame.tsx:43-58](src/components/ArchFrame.tsx#L43-L58)
> - **Impatto:** bug UX se la finestra è montata fuori vista iniziale. Attualmente sembra ok perché ArchFrame è usato solo in StorySection e parte alta dell'hero.
> - **Decisione:** aggiungere uno `ScrollTrigger.create({ start: "top 80%" })` o almeno `immediateRender: false`. Aggiungere test per comportamento reduced-motion.
>
> ### I4 — ArchFrame: video autoplay con `.catch(() => {})` silenzioso
> - **Cosa:** se il video non carica (404, codec, CSP), l'utente vede solo la foto statica senza sapere perché.
> - **Dove:** [src/components/ArchFrame.tsx:74-78](src/components/ArchFrame.tsx#L74-L78)
> - **Decisione:** logging in dev (`console.warn`) + telemetria. Per ora accettabile in prod.
>
> ### I5 — StorySection: `alessio-cura.svg` referenziato con alt text "fotografia in bianco e nero"
> - **Cosa:** l'`<img>` ha `alt: "Alessio accompagna un cavallo... fotografia in bianco e nero"` ma è un file `.svg` stilizzato vettoriale (247KB), non una foto.
> - **Dove:** [src/components/StorySection.tsx:8,86](src/components/StorySection.tsx#L8)
> - **Decisione:** correggere l'alt o sostituire con foto reale.
