# Fix MURGESE Section Visual Duplication

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan immediately. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminare la duplicazione visiva dello sfondo e delle etichette nella sezione MURGESE (MOMENTO C) di HorsesSection.tsx.

**Architecture:** Il problema è causato dal parallax GSAP applicato a un singolo layer di sfondo completo (`murgesePrairieBg`). Quando l'immagine è una foto completa (non layer separati), il movimento `y` e `scale` del parallax crea un effetto "ghosting/doppio" perché l'immagine si sposta rispetto al contenitore overflow-hidden. La soluzione è: (1) rimuovere il parallax dal layer di sfondo unico, (2) applicare un overlay gradient per uniformare i toni con il resto della sezione, (3) verificare che le micro-etichette non abbiano animazioni duplicate.

**Tech Stack:** React, GSAP + ScrollTrigger, Framer Motion, Tailwind CSS v4.

**Spec:** User request urgente (2026-11-16). Sito live con problemi visivi.

## Global Constraints

- Nessuna modifica alla maschera di testo MURGESE (deve mantenere `murgeseRiderImg` come background-clip)
- L'erba SVG in primo piano deve mantenere l'animazione sway
- Le micro-etichette devono apparire una sola volta ciascuna
- Build deve passare con zero errori
- Push immediato dopo fix

## Review Focus

1. **Parallax su sfondo unico**: il parallax GSAP su un'immagine completa crea ghosting — verificare che il layer di sfondo sia escluso dall'animazione parallax
2. **Overlay gradient mancante**: la foto reale potrebbe avere toni diversi dal resto della sezione — verificare che un overlay gradient/color-mix unifichi i colori
3. **Micro-etichette duplicate**: le etichette potrebbero renderizzarsi due volte se ci sono doppi cicli map o stati React duplicati — verificare che MICRO_LABELS.map() sia chiamato una sola volta
4. **Grain-overlay globale**: il grain-overlay sulla sezione intera potrebbe interagire con lo sfondo creando artefatti — verificare opacità appropriata
5. **Erba SVG sopra lo sfondo**: l'erba SVG deve coprire correttamente il bordo inferiore della foto senza creare linee di taglio visibili

---

### Task 1: Rimuovere parallax dal layer di sfondo unico e aggiungere overlay gradient

**Files:**
- Modify: `src/components/HorsesSection.tsx:374-389` (sfondo layer)
- Modify: `src/components/HorsesSection.tsx:135-156` (parallax setup)

**Interfaces:**
- Consumes: `murgesePrairieBg` import, `prairieSceneRef`, GSAP context
- Produces: sfondo statico con overlay gradient, parallax limitato a erba SVG e scritta MURGESE

- [ ] **Step 1: Aggiungere attributo data-no-parallax al layer di sfondo**

Nel JSX di MOMENTO C (linea ~376), aggiungere `data-no-parallax` al div dello sfondo per escluderlo dal ciclo parallax:

```tsx
<div
  data-p-layer
  data-no-parallax
  data-speed="0"
  data-scale-boost="0"
  className="absolute inset-0"
  style={{ willChange: "auto" }}
>
```

- [ ] **Step 2: Filtrare i layer no-parallax nel setup GSAP**

Nel useEffect (linea ~138), modificare il querySelectorAll per escludere i layer con `data-no-parallax`:

```typescript
prairie.querySelectorAll<HTMLElement>("[data-p-layer]:not([data-no-parallax])").forEach((layer) => {
```

- [ ] **Step 3: Aggiungere overlay gradient sopra lo sfondo**

Subito dopo il div dell'immagine di sfondo, aggiungere un overlay per uniformare i toni:

```tsx
{/* Overlay gradient per uniformare toni con sezione */}
<div
  aria-hidden
  className="pointer-events-none absolute inset-0"
  style={{
    background: "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 30%, transparent) 0%, transparent 40%, color-mix(in oklab, var(--murgese) 50%, transparent) 100%)",
  }}
/>
```

- [ ] **Step 4: Verificare build**

Run: `cd /home/giovannimacina/Progetti/torreabbondanza && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` senza errori

- [ ] **Step 5: Commit e push immediato**

```bash
cd /home/giovannimacina/Progetti/torreabbondanza && git add src/components/HorsesSection.tsx && git commit -m "fix(horses): rimuovi parallax da sfondo MURGESE e aggiungi overlay gradient

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git push origin main
```

---

## Execution Notes

- Questo è un fix urgente su sito live — eseguire immediatamente con approccio Native
- Non servono test TDD per questo fix visivo — la verifica è il build + visual check su localhost
- Dopo il push, verificare su localhost:8080 che la duplicazione sia risolta prima di dichiarare completamento