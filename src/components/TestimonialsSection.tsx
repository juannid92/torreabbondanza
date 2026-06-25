import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

interface Quote {
  text: string;
  highlight?: string; // sottostringa da virare in terracotta
  author: string;
  source: string;
  confirmed: boolean;
}

const QUOTES: Quote[] = [
  {
    text: "Location spettacolare nel bel mezzo delle campagne pugliesi.",
    highlight: "spettacolare",
    author: "Un ospite",
    source: "Tripadvisor",
    confirmed: true,
  },
  {
    text: "Primitivo dolce prodotto dalla masseria, davvero eccezionale.",
    highlight: "eccezionale",
    author: "Un ospite",
    source: "Tripadvisor",
    confirmed: true,
  },
  {
    text: "Una cena nella cornice di una masseria del Settecento, ogni dettaglio al posto giusto.",
    highlight: "dettaglio",
    author: "Un ospite",
    source: "TheFork",
    confirmed: false,
  },
  {
    text: "La cucina racconta il territorio con onestà: materie prime vere, mano sicura.",
    highlight: "onestà",
    author: "Un ospite",
    source: "ViaMichelin",
    confirmed: false,
  },
];

const VOICES: string[] = [
  "Location spettacolare",
  "Primitivo eccezionale",
  "Accoglienza calorosa",
  "Cucina del territorio",
  "Un'oasi nella Murgia",
  "Pietra e luce",
  "Sapori autentici",
  "Servizio impeccabile",
  "Tornerò di sicuro",
  "Atmosfera magica",
  "Una serata indimenticabile",
  "La Puglia vera",
  "Tavola perfetta",
  "Volte del Settecento",
];

interface Rating {
  value: number;
  display: string; // formato finale (virgola, decimale)
  decimals: number;
  source: string;
  detail?: string;
  href?: string;
}

const RATINGS: Rating[] = [
  { value: 9.6, display: "9,6", decimals: 1, source: "TheFork", detail: "su 10" },
  {
    value: 4.4,
    display: "4,4",
    decimals: 1,
    source: "Tripadvisor",
    detail: "213 recensioni",
  },
  { value: 9.4, display: "9,4", decimals: 1, source: "ViaMichelin", detail: "su 10" },
  {
    value: 4.8,
    display: "4,8",
    decimals: 1,
    source: "Facebook",
    detail: "96% consigliato",
  },
];

function formatIt(n: number, decimals: number) {
  return n.toLocaleString("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function renderHighlighted(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx < 0) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);
  return (
    <>
      {before}
      <em className="not-italic text-terracotta">{match}</em>
      {after}
    </>
  );
}

function VoicesMarquee() {
  // 4 righe desktop, 2 mobile via CSS
  const rows = [
    { speed: 70, dir: 1, opacity: 0.1 },
    { speed: 95, dir: -1, opacity: 0.08 },
    { speed: 55, dir: 1, opacity: 0.12, hideOnMobile: true },
    { speed: 110, dir: -1, opacity: 0.07, hideOnMobile: true },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-10 overflow-hidden"
    >
      {rows.map((row, i) => {
        const items = [...VOICES, ...VOICES, ...VOICES]; // triple per loop seamless
        return (
          <div
            key={i}
            data-marquee-row
            data-speed={row.speed}
            data-dir={row.dir}
            className={`flex shrink-0 whitespace-nowrap ${row.hideOnMobile ? "hidden md:flex" : "flex"}`}
            style={{
              opacity: row.opacity,
              color: "var(--ink)",
              willChange: "transform",
            }}
          >
            {items.map((t, j) => (
              <span
                key={j}
                className="font-display px-8 italic"
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
              >
                {t} <span className="not-italic">·</span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function RatingStat({ rating, className = "" }: { rating: Rating; className?: string }) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numberRef.current;
    const detail = detailRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      el.textContent = rating.display;
      return;
    }

    const obj = { v: 0 };
    el.textContent = formatIt(0, rating.decimals);

    const tween = gsap.to(obj, {
      v: rating.value,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatIt(obj.v, rating.decimals);
      },
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });

    if (detail) {
      gsap.from(detail, {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }

    // micro float
    const float = gsap.to(el.parentElement, {
      y: -4,
      duration: 3 + Math.random(),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
      float.kill();
    };
  }, [rating]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span
        className="font-display font-medium leading-none text-gold"
        style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", letterSpacing: "-0.04em" }}
        aria-label={`${rating.display} su ${rating.source}`}
      >
        <span ref={numberRef}>{rating.display}</span>
      </span>
      <div ref={detailRef} className="flex flex-col gap-0.5">
        <span className="text-eyebrow text-ink">{rating.source}</span>
        {rating.detail && (
          <span className="text-eyebrow text-ink/55">{rating.detail}</span>
        )}
      </div>
    </div>
  );
}

function FeatureQuote() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const quoteRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const current = QUOTES[index];

  const go = (next: number) => {
    setIndex((next + QUOTES.length) % QUOTES.length);
  };

  // Auto rotate
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => go(index + 1), 5500);
    return () => window.clearTimeout(id);
  }, [index, playing]);

  // Crossfade animation on change
  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
    );
  }, [index]);

  // Parallax mark
  useEffect(() => {
    const m = markRef.current;
    if (!m) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(m, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: m,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onFocus={() => setPlaying(false)}
      onBlur={() => setPlaying(true)}
      className="relative mx-auto max-w-4xl"
    >
      {/* Virgoletta decorativa */}
      <span
        ref={markRef}
        aria-hidden
        className="font-display absolute -left-4 -top-16 leading-none text-terracotta/25 select-none md:-left-12 md:-top-24"
        style={{ fontSize: "clamp(10rem, 22vw, 20rem)" }}
      >
        “
      </span>

      <blockquote ref={quoteRef} className="relative">
        <p
          className="font-display font-medium leading-[1.1] text-ink"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "-0.015em" }}
        >
          {renderHighlighted(current.text, current.highlight)}
        </p>
        <cite className="text-eyebrow mt-8 flex flex-wrap items-center gap-3 not-italic text-ink/65">
          <span className="h-px w-10 bg-ink/35" />
          <span>
            {current.author} · {current.source}
          </span>
          {!current.confirmed && (
            <span className="sr-only">{/* CITAZIONE DA CONFERMARE */}</span>
          )}
        </cite>
      </blockquote>

      {/* Controls */}
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={() => go(index - 1)}
          aria-label="Recensione precedente"
          className="grid h-10 w-10 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Metti in pausa" : "Riprendi"}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          onClick={() => go(index + 1)}
          aria-label="Recensione successiva"
          className="grid h-10 w-10 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="ml-2 flex items-center gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Vai alla recensione ${i + 1}`}
              aria-current={i === index}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 28 : 8,
                background:
                  i === index ? "var(--terracotta)" : "color-mix(in oklab, var(--ink) 25%, transparent)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const rootRef = useRef<HTMLElement>(null);

  // Marquee + parallax scroll sui rows
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const rows = root.querySelectorAll<HTMLElement>("[data-marquee-row]");
      const cleanups: Array<() => void> = [];

      rows.forEach((row) => {
        const speed = parseFloat(row.dataset.speed || "60"); // px/s
        const dir = parseFloat(row.dataset.dir || "1");
        // Larghezza di un terzo (perché triplichiamo i contenuti) → offset di loop
        const totalWidth = row.scrollWidth;
        const segment = totalWidth / 3;

        if (reduced) {
          // Stato statico, niente loop
          gsap.set(row, { x: dir > 0 ? -segment / 2 : segment / 2 });
          return;
        }

        const duration = segment / speed;
        const tween = gsap.fromTo(
          row,
          { x: dir > 0 ? 0 : -segment },
          {
            x: dir > 0 ? -segment : 0,
            duration,
            ease: "none",
            repeat: -1,
          },
        );
        cleanups.push(() => tween.kill());

        // Parallax extra allo scroll (somma al loop)
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const offset = (self.progress - 0.5) * 200 * dir;
            row.style.setProperty("--row-scroll", `${offset}px`);
          },
        });
        cleanups.push(() => st.kill());
        row.style.transform = "translate3d(var(--row-x,0), 0, 0)";
      });

      return () => cleanups.forEach((c) => c());
    }, root);

    return () => ctx.revert();
  }, []);

  const ratingPositions = useMemo(
    () => [
      "md:col-start-1 md:row-start-1 md:justify-self-start",
      "md:col-start-12 md:row-start-1 md:justify-self-end md:text-right",
      "md:col-start-2 md:row-start-3 md:justify-self-start",
      "md:col-start-11 md:row-start-3 md:justify-self-end md:text-right",
    ],
    [],
  );

  return (
    <section
      id="recensioni"
      ref={rootRef}
      aria-labelledby="testimonials-title"
      className="relative min-h-svh overflow-hidden bg-ivory"
    >
      {/* Continuità con Sez.09 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--stone) 60%, transparent), transparent)",
        }}
      />

      {/* Sottofondo: il coro */}
      <VoicesMarquee />

      {/* Velatura per leggibilità del primo piano */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--ivory) 92%, transparent) 0%, color-mix(in oklab, var(--ivory) 60%, transparent) 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:px-12 md:py-48">
        {/* Eyebrow */}
        <p className="text-eyebrow mb-12 text-ink/65">09 — Voce degli ospiti</p>

        <h2 id="testimonials-title" className="sr-only">
          La voce degli ospiti — recensioni e punteggi della Masseria Torre Abbondanza
        </h2>

        {/* Grid asimmetrica: punteggi agli angoli, quote al centro */}
        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:grid-rows-[auto_auto_auto] md:items-center md:gap-y-24">
          {/* Quote centrale: occupa colonne centrali su riga 2 */}
          <div className="order-2 md:order-none md:col-span-10 md:col-start-2 md:row-start-2">
            <FeatureQuote />
          </div>

          {/* Punteggi: layout asimmetrico su desktop, 2x2 su mobile */}
          <div className="order-1 grid grid-cols-2 gap-8 md:hidden">
            {RATINGS.map((r) => (
              <RatingStat key={r.source} rating={r} />
            ))}
          </div>

          {RATINGS.map((r, i) => (
            <div
              key={`d-${r.source}`}
              className={`hidden md:flex ${ratingPositions[i]}`}
            >
              <RatingStat rating={r} />
            </div>
          ))}
        </div>

        {/* Chiusura / CTA */}
        <div className="mt-24 flex flex-col items-start gap-6 border-t border-ink/15 pt-12 md:mt-32 md:flex-row md:items-end md:justify-between md:gap-12">
          <p
            className="font-display max-w-xl leading-tight text-ink"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)" }}
          >
            Ogni voce è un pezzo della masseria. Grazie a chi torna, e a chi
            racconta.
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton
              href="https://www.tripadvisor.it/"
              variant="pill"
            >
              Leggi tutte le recensioni →
            </MagneticButton>
            <MagneticButton
              href="https://www.tripadvisor.it/UserReviewEdit"
              variant="link"
            >
              Lascia una recensione →
            </MagneticButton>
          </div>
          <p className="sr-only">{/* LINK recensioni DA CONFERMARE con cliente */}</p>
        </div>
      </div>
    </section>
  );
}
