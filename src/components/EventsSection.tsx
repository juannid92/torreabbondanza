import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import { observeRevealElements } from "@/lib/scroll-ready";
import dayImg from "@/assets/events-space-day.jpg";
import nightImg from "@/assets/events-space-night.jpg";
import carriageImg from "@/assets/events-carriage.jpg";

/* -------------------------------------------------------------------------- */
/* Occasioni — copy invariato rispetto al backup                               */
/* -------------------------------------------------------------------------- */
const OCCASIONS = [
  {
    word: "ESPERIENZA EQUESTRE",
    phrase: "Cavalli Murgesi al pascolo, passeggiate e attacchi d'epoca tra i muretti a secco.",
  },
  {
    word: "LA MASSERIA",
    phrase:
      "La cornice: pietra, ulivi, cortile, lunga tavola. Scegliete il momento, noi facciamo il resto.",
  },
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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
      el.setAttribute("data-reveal", "soft");
    });
    const cleanupReveal = observeRevealElements(root);

    const ctx = gsap.context(() => {
      /* ---------- Mask-reveal per parola sui titoli ---------- */
      root.querySelectorAll<HTMLElement>("[data-mask-title]").forEach((title) => {
        const words = splitWords(title);
        ScrollTrigger.create({
          trigger: title,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.fromTo(
              words,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: reduced ? 0.2 : 1.1,
                ease: "power3.out",
                stagger: reduced ? 0 : 0.06,
                overwrite: true,
              },
            );
          },
        });
      });

      /* ---------- Opener: parole titolo iniziale ---------- */
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

      if (reduced) return;

      /* ---------- SCENA 1 — Ken burns sulla foto opener ---------- */
      const openerImg = root.querySelector<HTMLElement>("[data-opener-img]");
      if (openerImg) {
        gsap.fromTo(
          openerImg,
          { scale: 1.02, xPercent: 0 },
          { scale: 1.1, xPercent: -2, duration: 22, ease: "none", repeat: -1, yoyo: true },
        );
      }

      /* ---------- SCENA 2 — Crossfade giorno→notte + clip-path cards ---------- */
      const dayLayer = root.querySelector<HTMLElement>("[data-day-layer]");
      const nightLayer = root.querySelector<HTMLElement>("[data-night-layer]");
      const pinContainer = root.querySelector<HTMLElement>("[data-occasions-pin]");

      if (dayLayer && nightLayer && pinContainer) {
        gsap.set(dayLayer, { autoAlpha: 1 });
        gsap.set(nightLayer, { autoAlpha: 0 });

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinContainer,
              start: "top top",
              end: () => `+=${OCCASIONS.length * window.innerHeight * 0.7}`,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Crossfade day→night nei primi 20% del pin
          tl.to(dayLayer, { autoAlpha: 0, ease: "none" }, 0);
          tl.to(nightLayer, { autoAlpha: 1, ease: "none" }, 0);
        });
      }

      // Clip-path reveal per ogni card occasione (funziona su desktop e mobile)
      root.querySelectorAll<HTMLElement>("[data-occasion-card]").forEach((card) => {
        const word = card.querySelector<HTMLElement>("[data-occ-word]");
        const phrase = card.querySelector<HTMLElement>("[data-occ-phrase]");

        ScrollTrigger.create({
          trigger: card,
          start: "top 78%",
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.fromTo(
              card,
              { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
              {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: reduced ? 0.1 : 0.9,
                ease: "power3.out",
                overwrite: true,
              },
            );
            if (word) {
              const chars = splitWords(word);
              gsap.fromTo(
                chars,
                { yPercent: 110 },
                {
                  yPercent: 0,
                  duration: 0.9,
                  ease: "power3.out",
                  stagger: 0.05,
                  delay: 0.15,
                  overwrite: true,
                },
              );
            }
            if (phrase) {
              gsap.fromTo(
                phrase,
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power3.out",
                  delay: 0.3,
                  overwrite: true,
                },
              );
            }
          },
        });
      });

      /* ---------- SCENA 3 — Parallax carrozza ---------- */
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
              invalidateOnRefresh: true,
            },
          },
        );
      }
    }, root);

    return () => {
      ctx.revert();
      cleanupReveal();
    };
  }, []);

  return (
    <section id="eventi" ref={rootRef} aria-labelledby="events-title" className="relative bg-ivory">
      <h2 id="events-title" className="sr-only">
        Eventi e matrimoni alla Masseria Torre Abbondanza
      </h2>

      {/* ==================================================================== */}
      {/* SCENA 1 — Opener cinematografico                                      */}
      {/* ==================================================================== */}
      <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-murgese">
        <img
          data-opener-img
          src={dayImg}
          alt="Cortile della masseria all'ora dorata, lunga tavola di legno in attesa sotto gli ulivi"
          loading="lazy"
          decoding="async"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ willChange: "transform" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 40%, transparent) 0%, transparent 35%, color-mix(in oklab, var(--ink) 55%, transparent) 75%, color-mix(in oklab, var(--ink) 85%, transparent) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-20 md:px-12 md:pb-28">
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
                      {i < arr.length - 1 ? " " : ""}
                    </span>
                  </span>
                );
              })}
            </h3>
            <p
              data-fade
              className="mt-8 max-w-2xl font-display text-lg italic leading-snug text-ivory/85 md:text-2xl"
            >
              Cerimonie, matrimoni e feste private in una masseria del Settecento: spazi che vivono
              solo per le grandi occasioni.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SCENA 2 — Occasioni pinned (sticky night + cards clip-path)          */}
      {/* ==================================================================== */}
      <div
        data-occasions-pin
        className="relative min-h-[100svh] overflow-hidden bg-murgese"
        style={{ contain: "paint" }}
      >
        {/* Sticky image: day→night crossfade, dietro le cards */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            data-day-layer
            src={dayImg}
            alt=""
            loading="lazy"
            decoding="async"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ willChange: "opacity" }}
          />
          <img
            data-night-layer
            src={nightImg}
            alt="La masseria di notte, luci calde sotto gli ulivi"
            loading="lazy"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0, willChange: "opacity" }}
          />
          {/* Velatura per leggibilità cards */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 55%, transparent) 0%, color-mix(in oklab, var(--ink) 40%, transparent) 50%, color-mix(in oklab, var(--murgese) 65%, transparent) 100%)",
            }}
          />
          {/* CSS noise ambient (sostituisce Three.js shader) */}
          <div
            aria-hidden
            className="ambient-noise pointer-events-none absolute inset-0"
          />
        </div>

        {/* Cards che scorrono sopra lo sticky */}
        <div className="relative z-10 -mt-[100vh] flex flex-col">
          {/* Eyebrow introduttivo */}
          <div
            data-reveal="soft"
            className="flex min-h-[100svh] items-center px-6 md:px-12"
          >
            <div className="mx-auto w-full max-w-7xl">
              <p className="text-eyebrow text-ivory/65">I · Le occasioni</p>
              <p
                className="mt-6 max-w-xl font-display font-medium italic text-ivory"
                style={{
                  fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)",
                  lineHeight: 1.15,
                  textShadow: "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                Ogni festa ha il suo passo: scegliete l'occasione, la masseria si trasforma.
              </p>
            </div>
          </div>

          {/* Cards occasioni */}
          {OCCASIONS.map((occ) => (
            <article
              key={occ.word}
              data-occasion-card
              data-reveal="soft"
              className="flex min-h-[80svh] items-center px-6 py-16 md:px-12"
              style={{ willChange: "clip-path", clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            >
              <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6">
                <h3
                  data-occ-word
                  className="font-display font-semibold leading-[0.95] tracking-[-0.04em] text-ivory"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 9rem)",
                    textShadow: "0 6px 30px rgba(0,0,0,0.55), 0 0 60px rgba(242,185,92,0.25)",
                  }}
                >
                  {occ.word}
                </h3>
                <p
                  data-occ-phrase
                  className="max-w-md font-display text-lg italic leading-snug text-ivory/85 md:text-xl"
                  style={{
                    textShadow: "0 3px 18px rgba(0,0,0,0.5)",
                    opacity: 0,
                  }}
                >
                  {occ.phrase}
                </p>
              </div>
            </article>
          ))}

          {/* Chiusura: gli spazi */}
          <div
            data-reveal="soft"
            className="flex min-h-[80svh] items-center px-6 py-16 md:px-12"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
              <p className="text-eyebrow text-gold">Gli spazi</p>
              <p
                className="max-w-xl font-display italic text-ivory"
                style={{
                  fontSize: "clamp(1.4rem, 2.2vw, 2.1rem)",
                  lineHeight: 1.2,
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                La <span className="text-gold">sala storica</span> sotto le volte del Settecento e
                il <span className="text-gold">giardino</span> di ulivi: due cornici, una sola
                accoglienza.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SCENA 3 — Carrozza equestre (parallax)                                */}
      {/* ==================================================================== */}
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
                Per chi lo desidera, la cerimonia può aprirsi con un arrivo d'eccezione: una
                carrozza d'epoca trainata dai nostri cavalli{" "}
                <span style={{ color: "var(--gold)" }}>Murgesi</span>. Una scenografia rara, sobria,
                profondamente del territorio.
              </p>
              <p className="text-eyebrow text-ivory/55">Servizio su richiesta</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* SCENA 4 — CTA chiusura                                                */}
      {/* ==================================================================== */}
      <div className="relative bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-6 py-28 md:flex-row md:items-end md:justify-between md:gap-16 md:px-12 md:py-36">
          <div data-fade className="max-w-2xl">
            <p
              className="font-display font-medium leading-[1.1] text-ink"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Raccontateci la vostra occasione. <em className="text-terracotta">Accenderemo</em> la
              masseria per voi.
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

      {/* CSS ambient noise (replaces Three.js shader — subtle warm gradient noise) */}
      <style>{`
        .ambient-noise {
          opacity: 0.08;
          mix-blend-mode: overlay;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(242,185,92,0.55) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, rgba(169,128,46,0.45) 0%, transparent 55%),
            conic-gradient(from 180deg at 50% 50%, #3a2e20 0deg, #6b4a28 90deg, #2a1e14 180deg, #8c5a32 270deg, #3a2e20 360deg);
          animation: grain-drift 28s ease-in-out infinite;
        }
        @keyframes grain-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-2%, -1%) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-noise { animation: none !important; }
          [data-occasion-card] {
            clip-path: none !important;
            will-change: auto !important;
          }
          [data-occ-phrase] { opacity: 1 !important; transform: none !important; }
          [data-opener-img] { transform: scale(1.05) !important; }
          [data-day-layer], [data-night-layer] {
            will-change: auto !important;
          }
        }
      `}</style>
    </section>
  );
}