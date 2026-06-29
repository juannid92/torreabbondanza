import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import dayImg from "@/assets/events-space-day.jpg";
import nightImg from "@/assets/events-space-night.jpg";
import tablePanoImg from "@/assets/events-table-pano.jpg";
import carriageImg from "@/assets/events-carriage.jpg";

/* -------------------------------------------------------------------------- */
/* Costanti: punti luce delle "lucine" (3 stringhe ad arco)                   */
/* -------------------------------------------------------------------------- */
type Light = { x: number; y: number; r: number; delay: number };

const r3 = (n: number) => Math.round(n * 1000) / 1000;

function buildLightStrings(): Light[] {
  const lights: Light[] = [];
  // 3 stringhe ad arco: x in [4..96]%, y centrata su 3 fasce
  const strings = [
    { yBase: 26, yAmp: -10, count: 22 },
    { yBase: 36, yAmp: -8, count: 26 },
    { yBase: 48, yAmp: -6, count: 20 },
  ];
  let order = 0;
  const totalLights = strings.reduce((s, st) => s + st.count, 0);
  strings.forEach((s, si) => {
    for (let i = 0; i < s.count; i++) {
      const t = i / (s.count - 1);
      const x = 4 + t * 92;
      const arc = Math.sin(t * Math.PI);
      const y = s.yBase + s.yAmp * arc;
      // ordine di accensione semi-random per evitare onda perfetta
      const baseDelay = order / totalLights;
      const jitter = ((si * 7 + i * 11) % 13) / 13 - 0.5;
      lights.push({
        x: r3(x),
        y: r3(y),
        r: r3(2.6 + (si === 1 ? 0.6 : 0)),
        delay: r3(Math.min(0.95, Math.max(0, baseDelay + jitter * 0.04))),
      });
      order++;
    }
  });
  return lights;
}

/* -------------------------------------------------------------------------- */
/* Occasioni — Momento C                                                       */
/* -------------------------------------------------------------------------- */
const OCCASIONS = [
  { word: "MATRIMONI", phrase: "Il sì sotto gli ulivi, la festa che non finisce." },
  { word: "CERIMONIE", phrase: "Civili, simboliche: i riti che vi somigliano." },
  { word: "BATTESIMI", phrase: "Le prime feste di famiglia, al riparo della pietra." },
  { word: "COMPLEANNI", phrase: "Gli anni che contano, candele e brindisi sotto le stelle." },
  { word: "FESTE PRIVATE", phrase: "Aziendali, intime, a sorpresa: la masseria è vostra." },
] as const;

/* -------------------------------------------------------------------------- */
/* Sezione                                                                     */
/* -------------------------------------------------------------------------- */
export function EventsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const lights = useMemo(buildLightStrings, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ---------- Titoli con mask-reveal per parola ---------- */
      const titles = root.querySelectorAll<HTMLElement>("[data-mask-title]");
      titles.forEach((title) => {
        const words = splitWords(title);
        gsap.set(words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: title,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(words, {
              yPercent: 0,
              duration: reduced ? 0.2 : 1.1,
              ease: "power3.out",
              stagger: reduced ? 0 : 0.06,
            });
          },
        });
      });

      /* ---------- Opener title: mask-reveal manuale (rispetta l'accento) ---------- */
      const openerWords = root.querySelectorAll<HTMLElement>("[data-opener-word]");
      if (openerWords.length) {
        gsap.set(openerWords, { yPercent: 110 });
        gsap.to(openerWords, {
          yPercent: 0,
          duration: reduced ? 0.2 : 1.1,
          ease: "power3.out",
          stagger: reduced ? 0 : 0.08,
          delay: 0.2,
        });
      }

      /* ---------- Blocchi in dissolvenza ---------- */
      const fades = root.querySelectorAll<HTMLElement>("[data-fade]");
      gsap.set(fades, { opacity: 0, y: 20 });
      fades.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.3 : 0.9,
              ease: "power3.out",
            });
          },
        });
      });

      if (reduced) return;

      /* ---------- MOMENTO A — ken burns lento sulla foto giorno ---------- */
      const openerImg = root.querySelector<HTMLElement>("[data-opener-img]");
      if (openerImg) {
        gsap.fromTo(
          openerImg,
          { scale: 1.02, xPercent: 0 },
          { scale: 1.1, xPercent: -2, duration: 22, ease: "none", repeat: -1, yoyo: true },
        );
      }

      /* ---------- MOMENTO B — Si accende (pinned scrub) ---------- */
      const bScene = root.querySelector<HTMLElement>("[data-scene-b]");
      const bSticky = root.querySelector<HTMLElement>("[data-scene-b-sticky]");
      const nightLayer = root.querySelector<HTMLElement>("[data-night-layer]");
      const skyLayer = root.querySelector<HTMLElement>("[data-sky-layer]");
      const lightEls = root.querySelectorAll<HTMLElement>("[data-light]");
      const candleEls = root.querySelectorAll<HTMLElement>("[data-candle]");
      const bokehLayer = root.querySelector<HTMLElement>("[data-bokeh-layer]");
      const kineticB = root.querySelector<HTMLElement>("[data-kinetic-b]");

      if (bScene && bSticky && nightLayer && skyLayer) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bScene,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
        // Cielo: giorno → crepuscolo → notte profonda
        tl.fromTo(
          skyLayer,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 1 },
          0,
        );
        // Night image crossfade
        tl.fromTo(
          nightLayer,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 1 },
          0.15,
        );
        // Lucine: stagger lungo l'arco (0.25 .. 0.85)
        lightEls.forEach((el) => {
          const delay = parseFloat(el.dataset.delay ?? "0");
          const at = 0.25 + delay * 0.6;
          tl.to(el, { opacity: 1, scale: 1, duration: 0.04, ease: "power2.out" }, at);
        });
        // Candele: ultime ad accendersi (0.7 .. 0.95)
        candleEls.forEach((el, i) => {
          tl.to(el, { opacity: 1, duration: 0.04, ease: "power2.out" }, 0.7 + (i / candleEls.length) * 0.25);
        });
        // Bokeh che cresce
        if (bokehLayer) {
          tl.fromTo(bokehLayer, { opacity: 0 }, { opacity: 0.9, duration: 1, ease: "none" }, 0.35);
        }
        // Kinetic word parallax verticale
        if (kineticB) {
          tl.fromTo(
            kineticB,
            { yPercent: 30, opacity: 0 },
            { yPercent: -30, opacity: 0.95, ease: "none", duration: 1 },
            0,
          );
        }
      }

      /* ---------- MOMENTO C — Dolly orizzontale ---------- */
      const cScene = root.querySelector<HTMLElement>("[data-scene-c]");
      const cTrack = root.querySelector<HTMLElement>("[data-scene-c-track]");
      const cBg = root.querySelector<HTMLElement>("[data-scene-c-bg]");
      const cMid = root.querySelector<HTMLElement>("[data-scene-c-mid]");
      const cFg = root.querySelector<HTMLElement>("[data-scene-c-fg]");
      const cOccs = root.querySelectorAll<HTMLElement>("[data-occasion]");

      if (cScene && cTrack) {
        const trackWidth = cTrack.scrollWidth;
        const distance = trackWidth - window.innerWidth;

        const trackTween = gsap.to(cTrack, {
          x: () => -distance,
          ease: "none",
          scrollTrigger: {
            trigger: cScene,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 0.4,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        // Parallax inverso sui layer
        if (cBg) {
          gsap.to(cBg, {
            x: () => -distance * 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: cScene,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });
        }
        if (cMid) {
          gsap.to(cMid, {
            x: () => -distance * 0.6,
            ease: "none",
            scrollTrigger: {
              trigger: cScene,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });
        }
        if (cFg) {
          gsap.to(cFg, {
            x: () => -distance * 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: cScene,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });
        }
        // Reveal kinetic delle occasioni
        cOccs.forEach((occ) => {
          const word = occ.querySelector<HTMLElement>("[data-occ-word]");
          const phrase = occ.querySelector<HTMLElement>("[data-occ-phrase]");
          if (!word || !phrase) return;
          const wordChars = splitWords(word);
          gsap.set(wordChars, { yPercent: 110 });
          gsap.set(phrase, { opacity: 0, y: 20 });
          ScrollTrigger.create({
            trigger: occ,
            containerAnimation: trackTween,
            start: "left center",
            end: "right center",
            onEnter: () => {
              gsap.to(wordChars, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.05 });
              gsap.to(phrase, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
            },
            once: true,
            horizontal: true,
          });
        });
      }

      /* ---------- MOMENTO D — parallax carrozza ---------- */
      const carriage = root.querySelector<HTMLElement>("[data-carriage-img]");
      if (carriage) {
        gsap.fromTo(
          carriage,
          { yPercent: -5, scale: 1.06 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: carriage,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="eventi"
      ref={rootRef}
      aria-labelledby="events-title"
      className="relative bg-ivory"
    >
      <h2 id="events-title" className="sr-only">
        Eventi e matrimoni alla Masseria Torre Abbondanza
      </h2>

      {/* ====================================================================
          MOMENTO A — "Lo spazio che attende"
          alba che sale dal nero del pilastro Cavalli
      ==================================================================== */}
      <div className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden">
        {/* Risalita dal nero Murgese: gradient in alto */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-56"
          style={{
            background:
              "linear-gradient(180deg, var(--murgese) 0%, color-mix(in oklab, var(--murgese) 50%, transparent) 35%, transparent 100%)",
          }}
        />
        <img
          data-opener-img
          src={dayImg}
          alt="Cortile della masseria all'ora dorata, lunga tavola di legno in attesa sotto gli ulivi"
          width={1920}
          height={1280}
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          style={{ willChange: "transform" }}
        />
        {/* Velatura per leggibilità */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, transparent 25%, color-mix(in oklab, var(--ink) 30%, transparent) 65%, color-mix(in oklab, var(--ink) 70%, transparent) 100%)",
          }}
        />

        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-6 pb-20 md:px-12 md:pb-28">
          <p data-fade className="text-eyebrow text-ivory/85">
            07 — Eventi & Matrimoni
          </p>
          <h3
            aria-label="Quando la masseria si accende"
            className="mt-6 font-display font-semibold leading-[1.02] text-ivory"
            style={{
              fontSize: "clamp(2.4rem, 7vw, 6.4rem)",
              letterSpacing: "-0.025em",
              maxWidth: "18ch",
            }}
          >
            {["Quando", "la", "masseria", "si", "accende"].map((w, i, arr) => {
              const isAccent = w === "accende";
              return (
                <span
                  key={i}
                  aria-hidden
                  className="inline-block overflow-hidden align-top"
                  style={{ paddingBottom: "0.16em" }}
                >
                  <span
                    data-opener-word
                    className={`inline-block ${isAccent ? "italic" : ""}`}
                    style={{
                      willChange: "transform",
                      color: isAccent ? "var(--gold)" : undefined,
                    }}
                  >
                    {w}
                    {i < arr.length - 1 ? "\u00A0" : ""}
                  </span>
                </span>
              );
            })}
          </h3>
          <p
            data-fade
            className="mt-8 max-w-2xl font-display text-lg italic leading-snug text-ivory/85 md:text-2xl"
          >
            Cerimonie, matrimoni e feste private in una masseria del Settecento:
            spazi che vivono solo per le grandi occasioni.
          </p>
          <div data-fade className="mt-10 flex items-center gap-3 text-eyebrow text-ivory/65">
            <span aria-hidden className="block h-px w-10 bg-ivory/50" />
            continua a scorrere
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOMENTO B — "Si accende" (pinned scrub)
      ==================================================================== */}
      <div data-scene-b className="relative h-[320vh]">
        <div
          data-scene-b-sticky
          className="sticky top-0 isolate h-screen w-full overflow-hidden bg-murgese"
        >
          {/* Layer giorno (base) */}
          <img
            src={dayImg}
            alt=""
            aria-hidden
            loading="lazy"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Layer notte (crossfade) */}
          <img
            data-night-layer
            src={nightImg}
            alt="Lo stesso cortile della masseria di notte, tavole apparecchiate e lucine accese tra gli ulivi"
            loading="lazy"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0, willChange: "opacity" }}
          />
          {/* Overlay cielo notte */}
          <div
            data-sky-layer
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0,
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 75%, #0b1a3a) 0%, color-mix(in oklab, var(--murgese) 35%, transparent) 55%, transparent 100%)",
              willChange: "opacity",
            }}
          />

          {/* Lucine SVG */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id="bulb-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFE7B0" stopOpacity="1" />
                <stop offset="40%" stopColor="#F2B95C" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#A9802E" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bulb-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF6D8" stopOpacity="1" />
                <stop offset="100%" stopColor="#F2B95C" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Cavi a stringa: 3 archi sottili */}
            {[
              "M 4 26 Q 50 16 96 26",
              "M 4 36 Q 50 28 96 36",
              "M 4 48 Q 50 42 96 48",
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(247,243,236,0.18)"
                strokeWidth="0.12"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {lights.map((l, i) => (
              <g
                key={i}
                data-light
                data-delay={l.delay}
                style={{ opacity: 0, transform: "scale(0.6)", transformOrigin: `${l.x}% ${l.y}%`, transformBox: "fill-box", willChange: "opacity, transform" }}
              >
                <circle cx={l.x} cy={l.y} r={l.r * 3} fill="url(#bulb-glow)" />
                <circle cx={l.x} cy={l.y} r={l.r * 1.4} fill="url(#bulb-core)" />
                <circle cx={l.x} cy={l.y} r={l.r * 0.45} fill="#FFFBE6" />
              </g>
            ))}
          </svg>

          {/* Candele (8 punti in basso) */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[16%] z-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                data-candle
                className="absolute block"
                style={{
                  left: `${6 + (i / 11) * 88}%`,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 50% 45%, #FFF3BE 0%, #F2B95C 35%, rgba(169,128,46,0) 75%)",
                  filter: "blur(1px)",
                  opacity: 0,
                  animation: `candle-flicker ${1.8 + (i % 5) * 0.3}s ease-in-out ${i * 0.1}s infinite`,
                  willChange: "opacity, transform",
                }}
              />
            ))}
          </div>

          {/* Bokeh caldo */}
          <div
            data-bokeh-layer
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ opacity: 0, willChange: "opacity" }}
          >
            {Array.from({ length: 14 }).map((_, i) => {
              const seed = (i * 37) % 100;
              const x = (seed * 1.7) % 100;
              const y = 10 + (seed * 0.6) % 65;
              const size = 80 + (seed % 5) * 24;
              const opacity = 0.18 + (seed % 7) * 0.05;
              return (
                <span
                  key={i}
                  className="absolute block rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(255,213,138,0.9) 0%, rgba(255,213,138,0) 70%)",
                    opacity,
                    transform: `translate(-50%, -50%)`,
                    animation: `bokeh-drift ${10 + (i % 5) * 3}s ease-in-out ${i * 0.4}s infinite`,
                  }}
                />
              );
            })}
          </div>

          {/* Tipografia kinetic */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <span
              data-kinetic-b
              className="select-none font-display font-semibold tracking-[-0.05em] text-ivory/0"
              style={{
                fontSize: "clamp(7rem, 22vw, 22rem)",
                lineHeight: 0.85,
                color: "color-mix(in oklab, var(--ivory) 22%, transparent)",
                mixBlendMode: "overlay",
                willChange: "transform, opacity",
              }}
            >
              FESTA
            </span>
          </div>

          {/* Etichetta del momento */}
          <div className="absolute inset-x-0 bottom-10 z-30 mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 md:bottom-16 md:px-12">
            <p
              className="font-display italic text-ivory"
              style={{
                fontSize: "clamp(1.1rem, 1.6vw, 1.6rem)",
                textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                maxWidth: "32ch",
              }}
            >
              Scorri: la luce arriva, le candele si accendono, la tavola si
              apparecchia.
            </p>
            <span
              className="hidden text-eyebrow text-ivory/70 md:inline-flex"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              giorno → notte
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOMENTO C — Dolly orizzontale dentro la festa
      ==================================================================== */}
      <div
        data-scene-c
        className="relative h-screen overflow-hidden bg-murgese"
        style={{ contain: "paint" }}
      >
        {/* Layer parallax di sfondo: panorama tavola */}
        <div
          data-scene-c-bg
          className="absolute inset-y-0 left-0 -z-10"
          style={{
            width: "200%",
            backgroundImage: `url(${tablePanoImg})`,
            backgroundSize: "auto 110%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "left center",
            opacity: 0.95,
            willChange: "transform",
          }}
        />
        {/* Velatura per leggibilità */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 55%, transparent) 0%, transparent 35%, color-mix(in oklab, var(--murgese) 70%, transparent) 100%)",
          }}
        />
        {/* Lucine midground (parallax intermedio) */}
        <div
          data-scene-c-mid
          className="absolute inset-y-0 left-0 -z-10"
          style={{ width: "180%", willChange: "transform" }}
        >
          {Array.from({ length: 40 }).map((_, i) => {
            const x = (i / 39) * 100;
            const y = 15 + ((i * 13) % 7) * 2;
            return (
              <span
                key={i}
                className="absolute block rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 10,
                  height: 10,
                  background:
                    "radial-gradient(circle, rgba(255,228,170,0.95) 0%, rgba(255,228,170,0) 70%)",
                  filter: "blur(0.5px)",
                  animation: `candle-flicker ${2 + (i % 4) * 0.4}s ease-in-out ${i * 0.07}s infinite`,
                }}
              />
            );
          })}
        </div>

        {/* Track orizzontale con le occasioni */}
        <div
          data-scene-c-track
          className="absolute inset-y-0 left-0 z-10 flex items-center"
          style={{ willChange: "transform" }}
        >
          {/* Padding iniziale */}
          <div className="w-[20vw] flex-shrink-0" />

          {/* Eyebrow di apertura del momento C */}
          <div className="w-[50vw] flex-shrink-0 pr-12">
            <p className="text-eyebrow text-ivory/65">II · Dentro la festa</p>
            <p
              className="mt-6 font-display font-medium italic text-ivory"
              style={{
                fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)",
                lineHeight: 1.15,
                maxWidth: "22ch",
                textShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              Camminate dentro la tavola lunga: ogni occasione ha il suo passo.
            </p>
          </div>

          {OCCASIONS.map((occ) => (
            <article
              key={occ.word}
              data-occasion
              className="relative flex w-[80vw] flex-shrink-0 items-center justify-center px-[8vw]"
              style={{ minHeight: "60vh" }}
            >
              <div className="flex max-w-full flex-col items-start gap-6">
                <h3
                  data-occ-word
                  className="font-display font-semibold leading-[0.95] tracking-[-0.04em] text-ivory"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 9rem)",
                    textShadow:
                      "0 6px 30px rgba(0,0,0,0.55), 0 0 60px rgba(242,185,92,0.25)",
                  }}
                >
                  {occ.word}
                </h3>
                <p
                  data-occ-phrase
                  className="max-w-md font-display text-lg italic leading-snug text-ivory/85 md:text-xl"
                  style={{ textShadow: "0 3px 18px rgba(0,0,0,0.5)" }}
                >
                  {occ.phrase}
                </p>
              </div>
            </article>
          ))}

          {/* Chiusura: spazi */}
          <div className="flex w-[80vw] flex-shrink-0 items-center px-[8vw]">
            <div className="flex max-w-md flex-col gap-5">
              <p className="text-eyebrow text-gold">Gli spazi</p>
              <p
                className="font-display italic text-ivory"
                style={{
                  fontSize: "clamp(1.4rem, 2.2vw, 2.1rem)",
                  lineHeight: 1.2,
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                La <span className="text-gold">sala storica</span> sotto le volte
                del Settecento e il <span className="text-gold">giardino</span> di
                ulivi: due cornici, una sola accoglienza.
              </p>
              <p className="text-eyebrow text-ivory/55">
                {/* DA CONFERMARE: capienze e dettagli tecnici */}
              </p>
            </div>
          </div>

          {/* Padding finale */}
          <div className="w-[20vw] flex-shrink-0" />
        </div>

        {/* Foreground bokeh (parallax veloce) */}
        <div
          data-scene-c-fg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{ width: "220%", willChange: "transform" }}
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const x = (i / 15) * 100;
            const y = 30 + ((i * 17) % 50);
            const size = 90 + (i % 4) * 40;
            return (
              <span
                key={i}
                className="absolute block rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(255,213,138,0.45) 0%, rgba(255,213,138,0) 70%)",
                  filter: "blur(2px)",
                  opacity: 0.55,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          MOMENTO D — Tocco equestre discreto
      ==================================================================== */}
      <aside
        aria-labelledby="events-carriage-title"
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--murgese) 0%, color-mix(in oklab, var(--murgese) 96%, var(--ink)) 50%, var(--ivory) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-40">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
            <figure
              data-fade
              className="relative overflow-hidden shadow-soft md:col-span-7"
              style={{
                borderRadius: "10px",
                border: "1px solid color-mix(in oklab, var(--ivory) 18%, transparent)",
                aspectRatio: "4 / 3",
              }}
            >
              <img
                data-carriage-img
                src={carriageImg}
                alt="Carrozza d'epoca trainata da cavalli Murgesi neri all'ingresso della masseria all'ora dorata"
                loading="lazy"
                width={1280}
                height={960}
                className="absolute inset-0 h-[112%] w-full object-cover"
                style={{ top: "-6%", willChange: "transform" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--murgese) 60%, transparent))",
                }}
              />
            </figure>

            <div data-fade className="flex flex-col gap-6 md:col-span-5">
              <span
                className="text-eyebrow"
                style={{ color: "color-mix(in oklab, var(--ivory) 75%, transparent)" }}
              >
                Un dettaglio d'eccezione
              </span>
              <h3
                id="events-carriage-title"
                data-mask-title
                className="font-display font-medium leading-[1.08] text-ivory"
                style={{
                  fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                  letterSpacing: "-0.015em",
                }}
              >
                L'arrivo con gli attacchi d'epoca
              </h3>
              <p className="max-w-md font-display text-base italic leading-relaxed text-ivory/80 md:text-lg">
                Per chi lo desidera, la cerimonia può aprirsi con un arrivo
                d'eccezione: una carrozza d'epoca trainata dai nostri cavalli{" "}
                <span style={{ color: "var(--gold)" }}>Murgesi</span>. Una
                scenografia rara, sobria, profondamente del territorio.
              </p>
              <p className="text-eyebrow text-ivory/55">
                {/* DA CONFERMARE: servizio attacchi su richiesta */}
                Servizio su richiesta
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          CTA — chiusura calda
      ==================================================================== */}
      <div className="relative bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-6 py-28 md:flex-row md:items-end md:justify-between md:gap-16 md:px-12 md:py-36">
          <div data-fade className="max-w-2xl">
            <p
              className="font-display font-medium leading-[1.1] text-ink"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Raccontateci la vostra occasione.{" "}
              <em className="text-terracotta">Accenderemo</em> la masseria per
              voi.
            </p>
          </div>
          <div data-fade className="flex w-full flex-shrink-0 md:w-auto">
            <MagneticButton href="#contatti" variant="pill-solid" className="w-full md:w-auto">
              Richiedi informazioni per il tuo evento →
            </MagneticButton>
          </div>
        </div>

        {/* Uscita morbida verso Sez. 08 */}
        <div
          aria-hidden
          className="pointer-events-none h-32"
          style={{
            background:
              "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--olive) 14%, transparent))",
          }}
        />
      </div>

      {/* Keyframes locali per flicker candele e bokeh */}
      <style>{`
        @keyframes candle-flicker {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          25% { opacity: 1; transform: scale(1.08); }
          50% { opacity: 0.7; transform: scale(0.94); }
          75% { opacity: 0.95; transform: scale(1.04); }
        }
        @keyframes bokeh-drift {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-14px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-candle], [data-light] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}