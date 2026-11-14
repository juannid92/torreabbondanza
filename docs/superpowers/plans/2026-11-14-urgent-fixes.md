# Urgent Fixes — Cookie, PlaceSection, HorsesSection, SeasonsSection

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 4 urgent issues: GDPR cookie banner compliance, remove tower from PlaceSection image, fix overlapping images in HorsesSection MURGESE scene, and fix SeasonsSection timing bug + update autumn/winter content.

**Architecture:** Four independent fixes across four components. Task 1 (cookie) is a code-only change. Task 2 (tower removal) requires an image asset replacement. Task 3 (MURGESE overlap) is a layout/CSS fix replacing duplicate `murgeseStudioImg` references with distinct assets or removing redundant layers. Task 4 (seasons) is a GSAP timing fix + data array content update.

**Tech Stack:** React 19, GSAP + ScrollTrigger, Framer Motion, Tailwind CSS v4, TanStack Router.

**Spec:** User request (2026-11-14). Deadline: martedì 17 novembre 2026.

## Global Constraints

- Banner cookie must comply with Provvedimento Garante 10 giugno 2021 + art. 13 GDPR
- No force-push/rebase on pushed commits (AGENTS.md — Lovable sync)
- All animations must respect `prefers-reduced-motion: reduce`
- Images: always `loading="lazy"`, explicit `width`/`height`, descriptive `alt` in Italian
- Build must pass with zero errors after each task

## Review Focus

1. **Cookie banner legal compliance**: the current banner has "Ho capito" as primary CTA and "Dettagli" as secondary — verify this doesn't constitute a dark pattern under GDPR guidelines; the reject/close button (X) must be as prominent as accept.
2. **PlaceSection tower removal**: the user wants ONLY the tower removed from `place-masseria.webp` — this requires either image editing or asset replacement; verify the replacement doesn't break the parallax composition.
3. **HorsesSection MURGESE overlap**: three layers all use `murgeseStudioImg` (sky at line 379, hills at line 396, horses at line 413) creating visual confusion — verify the fix uses appropriate distinct images or removes redundant layers without breaking the parallax dolly effect.
4. **SeasonsSection timing bug**: the pin scroll distance uses `window.innerHeight * 4` but the `onUpdate` progress mapping may not distribute evenly across 4 stages — verify summer/autumn/winter backgrounds actually become visible during scroll.
5. **Seasons content accuracy**: new autumn/winter text must match the user's exact specifications — verify no residual "olive e frantoio" or "camino" content remains.

---

### Task 1: Fix Cookie Banner GDPR Compliance

**Files:**
- Modify: `src/components/CookieBanner.tsx`

**Interfaces:**
- Consumes: existing CookieBanner component structure
- Produces: GDPR-compliant banner with equivalent reject/accept prominence

- [ ] **Step 1: Analyze current compliance gaps**

Current issues identified in code review:
1. Primary CTA "Ho capito" (line 221) uses filled `bg-ink` style while "Dettagli" (line 210) uses outline — creates visual hierarchy favoring acceptance (dark pattern risk)
2. Close button X (line 225-232) is small and positioned absolutely top-right — not equivalent prominence to accept
3. Text says "non impiega cookie di profilazione o tracciamento" but doesn't explicitly state the user can refuse without consequence
4. No explicit "Rifiuta tutti" button with equal visual weight to "Accetta tutti"

- [ ] **Step 2: Rewrite BannerView buttons for equal prominence**

Replace the button group (lines 206-233) with three equally-prominent buttons:
- "Rifiuta tutti" — same size/style as accept, using outline or muted fill
- "Personalizza" — opens prefs panel
- "Accetta tutti" — filled style

Remove the X close button from BannerView (it stays in PrefsView only). The banner dismisses only via explicit choice.

Add to the text paragraph: "Puoi rifiutare i cookie non tecnici senza alcuna conseguenza per la navigazione."

- [ ] **Step 3: Verify build passes**

Run: `cd "/home/giovannimacina/Progetti/torreabbondanza (Copia)" && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 4: Commit**

```bash
git add src/components/CookieBanner.tsx
git commit -m "fix(cookie): rendi banner conforme al GDPR con pulsanti equivalenti

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Remove Tower from PlaceSection Masseria Image

**Files:**
- Asset: `src/assets/place-masseria.webp` (replace or edit)

**Interfaces:**
- Consumes: current `place-masseria.webp` showing masseria with tower
- Produces: version of the image with the tower removed/replaced

- [ ] **Step 1: Identify the tower in the current image**

Open `src/assets/place-masseria.webp` and identify which part of the structure is the tower that needs removal. Document the region.

- [ ] **Step 2: Replace or edit the image**

Option A (preferred): If an alternative photo of the masseria WITHOUT the tower exists in the assets folder or can be provided by the user, use it.
Option B: Use image editing (ffmpeg/ImageMagick) to crop or inpaint the tower region.
Option C: Ask the user for a replacement image if neither option works.

The replacement must maintain similar dimensions (1408×1024) and composition for the parallax layer.

- [ ] **Step 3: Verify the image renders correctly in context**

Run: `cd "/home/giovannimacina/Progetti/torreabbondanza (Copia)" && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 4: Commit**

```bash
git add src/assets/place-masseria.webp
git commit -m "fix(place): rimuovi torre dall'immagine della masseria

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Fix HorsesSection MURGESE Overlapping Images

**Files:**
- Modify: `src/components/HorsesSection.tsx:368-468` (MOMENTO C — LA PRATERIA)

**Interfaces:**
- Consumes: `murgeseStudioImg` (currently used for sky, hills, AND horses layers), `horses-grazing.webp`, `horses-hills.webp`, `horses-sky.jpg`
- Produces: visually coherent prairie scene with distinct layers

- [ ] **Step 1: Map the current layer problem**

Lines 368-468 define MOMENTO C (LA PRATERIA) with these layers ALL using `murgeseStudioImg`:
- Line 378-384: Sky layer → `murgeseStudioImg` (object-cover, full frame)
- Line 395-401: Hills layer → `murgeseStudioImg` (object-cover object-bottom)
- Line 412-417: Horses layer → `murgeseStudioImg` (object-contain object-bottom)

Plus the MURGESE text mask at line 456 also uses `murgeseStudioImg` as background-image.

Result: 4 copies of the same photo stacked with different crops = visual noise.

- [ ] **Step 2: Replace layers with appropriate distinct assets**

Available horse assets in `src/assets/`:
- `horses-sky.jpg` → use for sky layer (line 378)
- `horses-hills.webp` → use for hills layer (line 395)
- `horses-grazing.webp` → use for horses/pascolo layer (line 412)
- Keep `murgeseStudioImg` ONLY for the MURGESE text mask (line 456) — this is intentional design

Update imports at top of file to include the new assets. Update alt texts accordingly.

- [ ] **Step 3: Adjust layer positioning for visual coherence**

After swapping images, verify each layer's CSS classes still produce a coherent scene:
- Sky: `object-cover` filling upper portion
- Hills: `object-cover object-bottom` in mid-section
- Horses: `object-contain object-bottom` showing grazing silhouettes

Adjust `h-[70%]`, `bottom-[X%]`, `h-[42%]` values if needed to prevent overlap artifacts.

- [ ] **Step 4: Verify build passes**

Run: `cd "/home/giovannimacina/Progetti/torreabbondanza (Copia)" && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 5: Commit**

```bash
git add src/components/HorsesSection.tsx
git commit -m "fix(horses): sostituisci immagini duplicate nella scena MURGESE con asset distinti

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Fix SeasonsSection Timing Bug + Update Autumn/Winter Content

**Files:**
- Modify: `src/components/SeasonsSection.tsx`

**Interfaces:**
- Consumes: STAGES array (lines 40-149), GSAP ScrollTrigger pin logic (lines 427-547)
- Produces: working 4-stage seasonal cycle with updated autumn/winter content

#### Part A: Fix Timing Bug

- [ ] **Step 1: Diagnose the timing bug**

The pin scroll distance at line 452 is `window.innerHeight * 4` for desktop. The `onUpdate` handler (line 456) maps progress to stage index:
```
const p = self.progress * (STAGES.length - 1); // 0..3
const i = Math.min(STAGES.length - 2, Math.floor(p)); // 0..2
```

This means progress 0→0.33 = spring→summer, 0.33→0.66 = summer→autumn, 0.66→1.0 = autumn→winter. Each transition gets 1/3 of the scroll distance.

The kinetic reveal triggers at line 537-546 use `enterT = idx / (STAGES.length - 1)` which gives 0, 0.33, 0.66, 1.0. The last trigger at `enterT=1.0` fires at the very end of the pin — the winter content may never fully appear because the pin releases before the animation completes.

Fix: Change the pin end distance to `window.innerHeight * 5` (or adjust enterT calculation) so winter gets adequate scroll space. Also ensure the last stage's kinetic timeline plays reliably.

- [ ] **Step 2: Apply the timing fix**

Change line 452 from:
```typescript
end: () => `+=${window.innerHeight * (isMobile ? 2.5 : 4)}`,
```
to:
```typescript
end: () => `+=${window.innerHeight * (isMobile ? 3 : 5)}`,
```

Also update the enterT start calculation at line 541 to match:
```typescript
start: () => `top+=${Math.max(0, enterT * window.innerHeight * (isMobile ? 3 : 5) - 100)} top`,
```

- [ ] **Step 3: Verify the fix allows all 4 stages to display**

Run preview and scroll through the section confirming summer, autumn, and winter backgrounds and content all become visible.

#### Part B: Update Autumn Content

- [ ] **Step 4: Update autumn stage data (lines 95-121)**

Replace the autumn `experiences` array:

From:
- "Raccolta delle olive e frantoio" + "Degustazioni della tradizione"

To:
- Experience 1 (equestre): title "Passeggiate a cavallo e trekking", text about guided rides through autumn Murgia trails, nature trekking among changing foliage
- Experience 2 (tavola): title "Laboratorio culinario e degustazioni", text about hands-on cooking workshops with local products, tasting of typical Pugliese dishes prepared together

Update kicker (line 100-101) from "Terracotta e ruggine: si rientra in masseria con il profumo del frantoio..." to something about autumn colors, horse rides in nature, and culinary workshops.

Keep existing image assets (`expAutumnOlives` → rename variable to `expAutumnRide`, `expAutumnTable` stays) or reuse them with updated alt text.

#### Part C: Update Winter Content

- [ ] **Step 5: Update winter stage data (lines 122-148)**

Replace the winter `experiences` array:

From:
- "Il camino e la cucina della tradizione" + "I cavalli nella Murgia spoglia"

To:
- Experience 1 (tavola): title "Cene aziendali e laboratori culturali", text about corporate dinners, cultural workshops, creative gatherings in the stone vaults during winter
- Experience 2 (equestre): title "Progetti scuola ed eventi sociali", text about November school projects (morning to evening), educational programs, social events welcoming people "ai margini" — inclusion and community through the masseria's spaces

Update kicker (line 127-128) from "La Murgia si fa essenziale..." to something about winter as a season of gathering, culture, education, and social inclusion.

Keep existing image assets with updated alt text.

- [ ] **Step 6: Verify build passes**

Run: `cd "/home/giovannimacina/Progetti/torreabbondanza (Copia)" && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 7: Commit**

```bash
git add src/components/SeasonsSection.tsx
git commit -m "fix(seasons): correggi timing scroll e aggiorna contenuti autunno/inverno

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Execution Order

Tasks are independent and can execute in any order. Recommended sequence:
1. **Task 1** (cookie) — highest urgency (legal risk)
2. **Task 4** (seasons) — most complex code change, benefits from fresh context
3. **Task 3** (horses overlap) — straightforward asset swap
4. **Task 2** (tower removal) — may require user input for replacement image