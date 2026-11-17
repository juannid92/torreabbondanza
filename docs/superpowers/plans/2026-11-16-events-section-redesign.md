# Events Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan immediately. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite EventsSection.tsx from scratch with a vertical cinematic scroll layout, replacing the horizontal dolly and procedural lights with GSAP ScrollTrigger animations and CSS-only ambient effects.

**Architecture:** 4 vertical scenes: (1) full-screen opener with ken-burns + mask-reveal titles, (2) pinned scroll with sticky night photo + occasion cards entering via clip-path, (3) carriage parallax section, (4) CTA. No Three.js (not installed; CSS gradient noise replaces the shader). All existing images reused. Backup at `EventsSection.backup.tsx`.

**Tech Stack:** React, GSAP + ScrollTrigger, Tailwind CSS v4, CSS @keyframes (no new dependencies).

**Spec:** Design doc approved in conversation (Approccio A: scroll verticale cinematografico). User said "fai tu" — full creative freedom within the masseria/luxury editorial style.

## Global Constraints

- Reuse all 6 existing event images: `events-space-day.jpg`, `events-space-night.jpg`, `events-table-pano.jpg`, `events-carriage.jpg`, `events-ceremony.jpg`, `events-wedding.jpg`
- Keep all 7 OCCASIONS copy text unchanged
- Keep MagneticButton CTA linking to `#contatti`
- `prefers-reduced-motion: reduce` must disable all animations
- Build must pass with zero errors
- Mobile-first: no horizontal scroll, no dolly
- No new npm dependencies
- Push immediately after each task

## Review Focus

1. **Mobile layout**: occasion cards must stack vertically without horizontal overflow — verify at 375px width
2. **Clip-path animation performance**: clip-path transitions can cause repaints — verify with `will-change: clip-path` and test on low-end device
3. **Sticky image z-index**: night image must stay behind scrolling cards without flickering — verify z-index stacking context
4. **Ken-burns infinite loop**: yoyo animation must not snap at reversal point — verify seamless transition
5. **Reduced motion fallback**: all animated elements must be visible and static when reduced motion is active — verify with DevTools emulation

---

### Task 1: Scaffold new EventsSection structure with Scene 1 (Opener)

**Files:**
- Modify: `src/components/EventsSection.tsx` (full rewrite)

**Interfaces:**
- Consumes: `dayImg`, `nightImg`, `tablePanoImg`, `carriageImg`, `ceremonyImg`, `weddingImg` imports; `MagneticButton` component; `splitWords` from `@/lib/split-text`; `observeRevealElements` from `@/lib/scroll-ready`
- Produces: Complete EventsSection component with 4-scene vertical layout

- [ ] **Step 1: Write complete EventsSection.tsx with Scene 1 only (opener)**

Replace entire file content. Scene 1: full-screen `dayImg` with ken-burns (scale 1.02→1.1, xPercent 0→-2, duration 22s, yoyo infinite), bottom gradient overlay, eyebrow "07 — Eventi & Matrimoni", title "Quando la masseria si accende" with mask-reveal per word (splitWords, stagger 0.06, ease power3.out), italic "accende" in var(--gold). Include all imports, OCCASIONS const, and empty placeholders for Scenes 2-4.

Key structure:
```tsx
// Imports: dayImg, nightImg, tablePanoImg, carriageImg, ceremonyImg, weddingImg
// OCCASIONS array (unchanged from backup)
// EventsSection component with rootRef, useEffect for GSAP context
// Scene 1: h-[100svh] relative overflow-hidden, dayImg absolute inset-0 object-cover
// Ken-burns: gsap.fromTo(openerImg, {scale:1.02, xPercent:0}, {scale:1.1, xPercent:-2, duration:22, ease:"none", repeat:-1, yoyo:true})
// Title mask-reveal: splitWords + ScrollTrigger start:"top 85%" once:true
// Scenes 2-4: empty divs with data attributes as placeholders
```

- [ ] **Step 2: Verify build passes**

Run: `cd /home/giovannimacina/Progetti/torreabbondanza && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 3: Commit Scene 1**

```bash
cd /home/giovannimacina/Progetti/torreabbondanza && git add src/components/EventsSection.tsx && git commit -m "feat(events): rewrite section with cinematic opener (Scene 1)

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" && git push origin main
```

---

### Task 2: Add Scene 2 (Pinned Occasions with Sticky Image + Clip-Path Cards)

**Files:**
- Modify: `src/components/EventsSection.tsx`

**Interfaces:**
- Consumes: Scene 1 structure from Task 1, `nightImg`, OCCASIONS array, `splitWords`
- Produces: Pinned scroll section with sticky left image and right-scrolling occasion cards

- [ ] **Step 1: Implement Scene 2 JSX and GSAP logic**

Desktop (≥768px): container with `min-h-[100svh]`, pinned via ScrollTrigger. Left 45% = sticky `nightImg` (object-cover, absolute, z-0). Right 55% = flex-col of occasion cards. Each card: `clip-path: polygon(0 0, 100% 0, 100% 0, 0 0)` → `polygon(0 0, 100% 0, 100% 100%, 0 100%)` on scroll enter. Card title: mask-reveal with splitWords. Card phrase: fade-up delay 0.15s. Crossfade dayImg→nightImg scrubbed across first 20% of pin.

Mobile (<768px): nightImg above cards (not sticky), cards full-width vertical stack, same clip-path animation triggered by vertical scroll.

GSAP matchMedia for desktop/mobile split. Pin duration = cards.length * 60vh.

- [ ] **Step 2: Verify build passes**

Run: `cd /home/giovannimacina/Progetti/torreabbondanza && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 3: Commit Scene 2**

```bash
cd /home/giovannimacina/Progetti/torreabbondanza && git add src/components/EventsSection.tsx && git commit -m "feat(events): add pinned occasions scene with clip-path reveals (Scene 2)

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" && git push origin main
```

---

### Task 3: Add Scene 3 (Carriage Parallax) + Scene 4 (CTA) + Ambient CSS Effects

**Files:**
- Modify: `src/components/EventsSection.tsx`

**Interfaces:**
- Consumes: Scenes 1-2 from Tasks 1-2, `carriageImg`, `MagneticButton`
- Produces: Complete section with all 4 scenes and ambient background effects

- [ ] **Step 1: Implement Scene 3 (carriage parallax)**

Two-column grid (md:grid-cols-12). Left col-span-5: eyebrow "Un dettaglio d'eccezione", title "L'arrivo con gli attacchi d'epoca" with mask-reveal, description paragraph. Right col-span-7: figure with carriageImg, parallax yPercent -5→5 scrub true. Gradient overlay on image bottom. Background gradient from --murgese to --ivory.

- [ ] **Step 2: Implement Scene 4 (CTA closure)**

bg-ivory. Max-w-7xl container. Left: heading "Raccontateci la vostra occasione. Accenderemo la masseria per voi." with italic "Accenderemo" in terracotta. Right: MagneticButton href="#contatti" variant="pill-solid". Bottom gradient transition to olive for next section.

- [ ] **Step 3: Add CSS ambient effects (replaces Three.js shader)**

Add inline `<style>` block with:
- `@keyframes grain-drift`: subtle translate + opacity shift for noise texture
- `.ambient-noise`: fixed pseudo-element with CSS conic-gradient noise (warm murgese/gold/black tones), opacity 0.08, pointer-events-none, z-0, covering Scene 2 only
- Reduced motion: disable all keyframe animations, set clip-path to full reveal, set ken-burns to static scale 1.05

- [ ] **Step 4: Verify build passes**

Run: `cd /home/giovannimacina/Progetti/torreabbondanza && npx vite build 2>&1 | tail -5`
Expected: `✓ built in` without errors

- [ ] **Step 5: Final commit and push**

```bash
cd /home/giovannimacina/Progetti/torreabbondanza && git add src/components/EventsSection.tsx && git commit -m "feat(events): complete section rewrite with carriage, CTA, and ambient effects

Full vertical cinematic scroll replacing horizontal dolly.
Scenes: opener ken-burns, pinned occasions with clip-path,
carriage parallax, CTA closure. CSS noise replaces Three.js shader.

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" && git push origin main
```

---

### Task 4: Cleanup and Remove Backup

**Files:**
- Delete: `src/components/EventsSection.backup.tsx`

- [ ] **Step 1: Remove backup file**

```bash
cd /home/giovannimacina/Progetti/torreabbondanza && rm src/components/EventsSection.backup.tsx && git add -u src/components/EventsSection.backup.tsx && git commit -m "chore(events): remove backup after successful rewrite

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" && git push origin main
```

---

## Execution Notes

- This is a full rewrite of a 942-line component — execute tasks sequentially, each building on the previous
- Visual verification on localhost after each task is essential (no automated tests for visual layout)
- If clip-path animation causes jank, fall back to opacity+translateY with same timing
- The CSS noise effect is intentionally subtle (opacity 0.08) — increase only if visually invisible
- All 6 event images exist in src/assets/ and are already optimized