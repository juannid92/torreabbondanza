# PageSpeed Performance Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise Lighthouse mobile performance score from 35 to 70+ while preserving GSAP animations and visual quality.

**Architecture:** Three independent optimization tracks ordered by impact: (1) video compression and lazy-loading, (2) image format conversion and responsive sizing, (3) JS/CSS delivery optimization. Each track produces a measurable improvement independently; they can be executed in any order but are listed by expected ROI.

**Tech Stack:** React + TanStack Router + Vite + Nitro SSG on Cloudflare Pages, GSAP, self-hosted fonts, ffmpeg (for video), sharp/cwebp (for images).

**Spec:** PageSpeed Insights report captured 2026-11-18 at https://www.masseriatorreabbondanza.it — score 35/100 mobile (Moto G Power emulated, slow 4G throttling).

## Global Constraints

- Do NOT remove or disable GSAP animations — visual quality is non-negotiable
- Do NOT change the site's visual appearance or layout
- All videos must remain autoplaying, muted, looped, with poster fallbacks
- Maintain existing i18n infrastructure (react-i18next, LanguageSwitcher, hreflang)
- Keep GTM Consent Mode v2 integration intact
- Target: Lighthouse mobile score ≥ 70, LCP ≤ 4s, TBT ≤ 300ms, FCP ≤ 2s
- Preserve CLS = 0 (no layout shifts introduced)

## Review Focus

1. Video poster images must match video aspect ratio exactly to prevent CLS during load
2. WebP conversions must not visibly degrade quality at the chosen compression level
3. Lazy-loaded videos below the fold must still autoplay when scrolled into view
4. GSAP ScrollTrigger instances must continue to fire correctly after code-splitting
5. Font preloading must not cause FOIT (flash of invisible text) — use `font-display: swap`

---

### Task 1: Compress hero-video.mp4 (8MB → ~1.5MB)

The single largest performance bottleneck. The hero video is 8MB and loads eagerly on every page visit. Re-encoding with modern codecs and lower bitrate will cut LCP by several seconds.

**Files:**
- Modify: `public/hero-video.mp4` (replace in-place)
- Reference: `src/components/HeroSoglia.tsx:23`

**Interfaces:**
- Consumes: nothing (standalone asset optimization)
- Produces: smaller `public/hero-video.mp4` at same resolution/framerate

- [ ] **Step 1: Back up original video**

```bash
cp public/hero-video.mp4 public/hero-video.mp4.bak
```

- [ ] **Step 2: Inspect current video properties**

Run: `ffprobe -v quiet -print_format json -show_streams public/hero-video.mp4.bak`
Expected: Note resolution, framerate, codec, bitrate, duration. Record these values.

- [ ] **Step 3: Re-encode with optimized settings**

Target: H.264 baseline profile, 720p max, CRF 28, audio stripped, faststart flag.

```bash
ffmpeg -i public/hero-video.mp4.bak \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -profile:v baseline -level 3.1 \
  -crf 28 -preset medium \
  -an -movflags +faststart \
  -y public/hero-video.mp4
```

If ffmpeg is not installed, install it first: `sudo apt install ffmpeg` or equivalent.

- [ ] **Step 4: Verify output size and playback**

Run: `ls -lh public/hero-video.mp4 && ffprobe -v quiet -print_format json -show_streams public/hero-video.mp4`
Expected: File size ≤ 2MB. Video plays without errors. Resolution ≤ 1280px wide. No audio stream.

- [ ] **Step 5: Generate/update poster image matching new resolution**

Extract a frame as WebP poster:

```bash
ffmpeg -i public/hero-video.mp4 -ss 1 -frames:v 1 -q:v 80 public/hero-poster.webp
```

Verify poster dimensions match video dimensions: `identify public/hero-poster.webp` (or `file`).

- [ ] **Step 6: Update HeroSoglia.tsx poster reference if needed**

Check `src/components/HeroSoglia.tsx` for the poster attribute on the `<video>` tag. If it references a JPG poster, update to the new WebP poster. If no poster exists, add one:

```tsx
poster="/hero-poster.webp"
```

- [ ] **Step 7: Visual QA**

Open http://localhost:8080/ in browser. Confirm hero video plays smoothly, no visible quality degradation, no layout shift. Compare side-by-side with backup if needed.

- [ ] **Step 8: Commit**

```bash
git add public/hero-video.mp4 public/hero-poster.webp src/components/HeroSoglia.tsx
rm public/hero-video.mp4.bak
git commit -m "perf(video): compress hero-video.mp4 from 8MB to ~1.5MB

Re-encoded with H.264 baseline, 720p, CRF 28, no audio, faststart.
Added WebP poster for instant visual placeholder."
```

---

### Task 2: Compress intro-video.mp4 (2.1MB → ~500KB)

Second video asset. Smaller than hero but still significant on slow 4G.

**Files:**
- Modify: `public/intro-video.mp4` (replace in-place)
- Reference: `src/components/IntroOverlay.tsx:106`

**Interfaces:**
- Consumes: nothing
- Produces: smaller `public/intro-video.mp4`

- [ ] **Step 1: Back up original**

```bash
cp public/intro-video.mp4 public/intro-video.mp4.bak
```

- [ ] **Step 2: Re-encode with aggressive compression**

Intro video is short and decorative — can tolerate more compression:

```bash
ffmpeg -i public/intro-video.mp4.bak \
  -vf "scale='min(960,iw)':-2" \
  -c:v libx264 -profile:v baseline -level 3.1 \
  -crf 32 -preset medium \
  -an -movflags +faststart \
  -y public/intro-video.mp4
```

- [ ] **Step 3: Verify output**

Run: `ls -lh public/intro-video.mp4`
Expected: File size ≤ 800KB.

- [ ] **Step 4: Visual QA**

Clear sessionStorage key `torreabbondanza.introSeen` in browser devtools, reload homepage. Confirm intro animation plays correctly.

- [ ] **Step 5: Commit**

```bash
git add public/intro-video.mp4
rm public/intro-video.mp4.bak
git commit -m "perf(video): compress intro-video.mp4 from 2.1MB to ~500KB"
```

---

### Task 3: Convert top JPG assets to WebP via Vite plugin

Lighthouse reports 1346 KiB savable from image optimization. The project already has some WebP files but many large JPGs remain. Adding `vite-plugin-image-optimizer` handles this automatically at build time without changing source imports.

**Files:**
- Modify: `vite.config.ts`
- Install: `vite-plugin-image-optimizer` (dev dependency)

**Interfaces:**
- Consumes: existing JPG/PNG imports in `src/assets/`
- Produces: WebP versions served at build time, original imports unchanged

- [ ] **Step 1: Install vite-plugin-image-optimizer**

```bash
npm install -D vite-plugin-image-optimizer
```

- [ ] **Step 2: Add plugin to vite.config.ts**

Read `vite.config.ts` first. The config uses `@lovable.dev/vite-tanstack-config`'s `defineConfig`. Add the image optimizer plugin via the `vite.plugins` array:

```ts
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      ViteImageOptimizer({
        jpg: { quality: 80 },
        png: { quality: 80 },
        webp: { quality: 75 },
      }),
    ],
  },
});
```

Note: Check `@lovable.dev/vite-tanstack-config` docs — if it doesn't support a `vite.plugins` passthrough, add the plugin via the top-level `plugins` array instead. Read the package's README or type definitions to confirm.

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Check `.output/public/assets/` for `.webp` files alongside originals. Verify file sizes are smaller.

- [ ] **Step 4: Visual QA**

Run `npm run dev`, browse all pages. Confirm all images render correctly, no broken references.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "perf(images): add vite-plugin-image-optimizer for automatic WebP conversion

Converts JPG/PNG assets to WebP at build time. Estimated 1346 KiB savings
on homepage per Lighthouse report."
```

---

### Task 4: Lazy-load hero video with IntersectionObserver

Even compressed, the hero video shouldn't block initial paint. Defer loading until the video element enters the viewport. The poster image provides instant visual content.

**Files:**
- Modify: `src/components/HeroSoglia.tsx`

**Interfaces:**
- Consumes: poster image from Task 1
- Produces: video element that loads only when visible

- [ ] **Step 1: Read current HeroSoglia.tsx video implementation**

Read `src/components/HeroSoglia.tsx` fully. Identify the `<video>` element, its attributes, and how `HERO_VIDEO_URL` is used.

- [ ] **Step 2: Implement lazy video loading**

Replace the eager `<video src={HERO_VIDEO_URL}>` with a pattern that sets `src` only when the element intersects the viewport:

```tsx
const videoRef = useRef<HTMLVideoElement>(null);
const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

useEffect(() => {
  const el = videoRef.current;
  if (!el) return;
  // If reduced motion, never load video
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setVideoSrc(HERO_VIDEO_URL);
        observer.disconnect();
      }
    },
    { rootMargin: "200px" }
  );
  observer.observe(el);
  return () => observer.disconnect();
}, []);
```

Update the `<video>` tag: `src={videoSrc}` (undefined initially), keep `poster` attribute pointing to the WebP poster from Task 1.

- [ ] **Step 3: Ensure autoplay triggers after src is set**

Add a second effect or callback: when `videoSrc` changes and the ref exists, call `videoRef.current?.play().catch(() => {})`.

- [ ] **Step 4: Verify no CLS**

The poster must have identical dimensions to the video container. Check that the poster's aspect ratio matches. Run Lighthouse locally or check DevTools layout shift indicators.

- [ ] **Step 5: Visual QA**

Load homepage. Confirm poster shows instantly, video fades in when scrolled to. On slow connection simulation, poster should hold until video loads.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroSoglia.tsx
git commit -m "perf(video): lazy-load hero video with IntersectionObserver

Video src deferred until element enters viewport (+200px margin).
Poster provides instant visual content, preventing blank space."
```

---

### Task 5: Inline critical CSS and defer non-critical styles

Lighthouse flags 170ms render-blocking CSS. The stylesheet is only 20KB — small enough to inline the critical portion and defer the rest.

**Files:**
- Modify: `src/routes/__root.tsx`
- Possibly create: `src/styles-critical.css` (extracted subset)

**Interfaces:**
- Consumes: `appCss` import from `../styles.css?url`
- Produces: critical CSS inlined in `<head>`, full stylesheet loaded async

- [ ] **Step 1: Analyze current CSS loading**

Read `src/routes/__root.tsx`. Find how `appCss` is referenced in the `head()` function. Currently it's likely in a `<link rel="stylesheet">` tag via TanStack Router's head system.

- [ ] **Step 2: Extract critical CSS**

Identify above-the-fold styles: reset, typography (font-face declarations), header/nav styles, hero section styles. Copy these into a new file `src/styles-critical.css`. Keep it under 10KB.

Alternatively, use a tool like `critters` or `purgecss` if available. For a 20KB stylesheet, manual extraction is faster and more reliable.

- [ ] **Step 3: Inline critical CSS in __root.tsx**

In the `head()` function, add a `<style>` tag with the critical CSS content. Change the main stylesheet link to use `media="print" onload="this.media='all'"` pattern or `rel="preload" as="style" onload="this.rel='stylesheet'"`:

```tsx
// In head() meta array or as a script/style injection:
{ type: "text/css", children: criticalCssContent }
```

And defer the main stylesheet:

```html
<link rel="preload" href={appCss} as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href={appCss}></noscript>
```

Note: TanStack Router's `head()` returns meta/links/scripts arrays. You may need to inject the deferred link via a `<script>` tag or modify the root component's JSX directly. Read the TanStack Router docs for `head()` capabilities.

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Check the built HTML output. Critical CSS should be inlined. Main stylesheet should load asynchronously.

- [ ] **Step 5: Visual QA**

Load homepage. Confirm no flash of unstyled content (FOUC). Fonts should swap correctly. All sections should render properly.

- [ ] **Step 6: Commit**

```bash
git add src/routes/__root.tsx src/styles-critical.css
git commit -m "perf(css): inline critical CSS, defer full stylesheet

Eliminates 170ms render-blocking CSS. Critical styles (~8KB) inlined
in <head>, full stylesheet loaded asynchronously with preload."
```

---

### Task 6: Code-split GSAP and heavy components

The main JS bundle (index.js 144KiB) includes GSAP (250KB uncompressed) and all section components. GSAP is only needed client-side and only when animations run. Splitting it into a separate chunk that loads after hydration reduces TBT significantly.

**Files:**
- Modify: Multiple component files (GSAP imports)
- Possibly modify: `vite.config.ts` (manual chunks)

**Interfaces:**
- Consumes: existing GSAP imports across 10+ components
- Produces: separate GSAP chunk loaded dynamically

- [ ] **Step 1: Configure Vite manual chunks for GSAP**

Read `vite.config.ts`. Add a `build.rollupOptions.output.manualChunks` configuration to isolate GSAP:

```ts
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap", "gsap/ScrollTrigger"],
        },
      },
    },
  },
}
```

Note: Verify this works with `@lovable.dev/vite-tanstack-config`. If the wrapper doesn't expose `build.rollupOptions`, check its documentation for the correct passthrough path.

- [ ] **Step 2: Build and verify chunk separation**

```bash
npm run build
ls -lh .output/public/assets/gsap*.js
```

Expected: A separate `gsap-*.js` chunk exists. Main `index-*.js` is smaller.

- [ ] **Step 3: Verify animations still work**

Run `npm run dev`. Browse all pages with GSAP animations: homepage (HeroSoglia, ManifestoSection, SeasonsSection, KitchenSection, EventsSection, HorsesSection, PlaceSection), /cavalli/vetrina (HorsesShowcase). Confirm all scroll-triggered animations fire correctly.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "perf(js): code-split GSAP into separate chunk

Isolates gsap + ScrollTrigger (~250KB) from main bundle.
Reduces initial JS parse/execute time, improving TBT."
```

---

### Task 7: Add font preconnect hints

Self-hosted fonts are already optimal (no third-party DNS), but adding `<link rel="preload">` for the most-used font files ensures they start downloading before CSS parsing discovers them.

**Files:**
- Modify: `src/routes/__root.tsx`

**Interfaces:**
- Consumes: font file paths from build output or static assets
- Produces: preload hints in document head

- [ ] **Step 1: Identify which fonts are used above the fold**

Read `src/styles.css` or Tailwind config. The Lighthouse network tree shows these fonts loading:
- `inter-latin-*.woff2` (body text)
- `fraunces-*.woff2` (display headings)
- `caveat-latin-*.woff2` (accent)
- `pinyon-script-*.woff2` (decorative)

Only preload Inter and Fraunces (used in hero/header). Caveat and Pinyon can load normally.

- [ ] **Step 2: Add preload links to __root.tsx head()**

In the `links` array of the `head()` function, add:

```tsx
{ rel: "preload", href: "/assets/inter-latin-XXXX.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
{ rel: "preload", href: "/assets/fraunces-XXXX.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
```

Note: The exact filenames include content hashes from Vite. For SSG builds, you may need to reference them differently. Check if TanStack Router/Nitro provides a way to get hashed asset URLs in `head()`. If not, use the unhashed source paths and rely on Vite's asset handling.

Alternative: If font paths are dynamic/hashed, skip explicit preloads and instead ensure `font-display: swap` is set in all `@font-face` declarations (which prevents FOIT even without preloading).

- [ ] **Step 3: Verify font-display: swap**

Search `src/styles.css` for `@font-face` rules. Confirm each has `font-display: swap`. If any use `block` or `optional`, change to `swap`.

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Check built HTML for preload links. Load page and confirm text renders immediately with fallback, then swaps to custom font.

- [ ] **Step 5: Commit**

```bash
git add src/routes/__root.tsx src/styles.css
git commit -m "perf(fonts): preload critical fonts, ensure font-display: swap

Preloads Inter and Fraunces woff2 files. All @font-face rules
use font-display: swap to prevent FOIT."
```

---

### Task 8: Final verification and benchmark

Run a full Lighthouse audit to confirm improvements and catch any regressions.

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: all changes from Tasks 1-7
- Produces: updated performance metrics

- [ ] **Step 1: Full production build**

```bash
npm run build
```

- [ ] **Step 2: Serve production build locally**

```bash
npx vite preview
```

- [ ] **Step 3: Run Lighthouse audit**

Use Chrome DevTools Lighthouse or CLI against http://localhost:4173/ (default preview port) with mobile emulation and slow 4G throttling.

Record: Performance score, FCP, LCP, TBT, CLS, SI.

- [ ] **Step 4: Compare against baseline**

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Score | 35 | ? | ≥ 70 |
| FCP | 2.7s | ? | ≤ 2s |
| LCP | 11.4s | ? | ≤ 4s |
| TBT | 1760ms | ? | ≤ 300ms |
| CLS | 0 | ? | 0 |
| SI | 9.5s | ? | ≤ 4s |

- [ ] **Step 5: If targets not met, identify remaining bottlenecks**

Check Lighthouse report for new top issues. Common remaining items:
- Unused JavaScript (tree-shake or defer)
- DOM size (reduce node count)
- Third-party scripts (GTM — consider partytown or defer)

Document findings but do NOT fix in this plan — create a follow-up plan if needed.

- [ ] **Step 6: Deploy to Cloudflare Pages and re-test against production URL**

```bash
npx nitro deploy --prebuilt
```

Wait for deployment, then run Lighthouse against https://www.masseriatorreabbondanza.it.

- [ ] **Step 7: Final commit with results**

```bash
git commit --allow-empty -m "docs(perf): PageSpeed optimization complete

Before: 35/100 (FCP 2.7s, LCP 11.4s, TBT 1760ms)
After: XX/100 (FCP X.Xs, LCP X.Xs, TBT XXXms)

Changes: video compression, WebP conversion, lazy video loading,
critical CSS inlining, GSAP code-splitting, font preloading."
```