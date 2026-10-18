import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { ParallaxLayer } from "./ParallaxLayer";
import antipastiImg from "@/assets/kitchen-antipasti.jpg";
import primiImg from "@/assets/kitchen-primi.jpg";
import secondiImg from "@/assets/kitchen-secondi.jpg";
import dolciImg from "@/assets/kitchen-dolci.jpg";

const WA_PHONE = "393384834318";
const WA_MSG = encodeURIComponent(
  "Ciao, vorrei informazioni su menù e prezzi per un gruppo di almeno 20 persone. Data orientativa: ___.",
);
const WA_HREF = `https://wa.me/${WA_PHONE}?text=${WA_MSG}`;

// Foto evocative della tavola: riuso le 4 immagini di portata in un layout
// "mood board" 2x2 invece di sequenza alternata. Niente prezzi, niente elenco
// piatti, niente caption a hover. La sezione rimanda a wa.me.
const MOOD: { src: string; alt: string }[] = [
  {
    src: antipastiImg,
    alt: "Antipasti pugliesi: tagliere di focaccia, salumi, formaggi e olive",
  },
  { src: primiImg, alt: "Primo piatto: nido di linguine con ragù di carne e funghi" },
  { src: secondiImg, alt: "Secondo: brasato di carne al vino su purè con timo fresco" },
  { src: dolciImg, alt: "Dolce della casa: fetta di cheesecake all'amaretto" },
];

const SERVICE_TAGS = [
  "Solo su prenotazione",
  "Per cerimonie ed eventi",
  "Menù su misura",
  "Veg · Vegan · Gluten-free",
];

export function KitchenSection() {
  const rootRef = useRef<HTMLElement>(null);
  const moodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>("[data-intro]");
      gsap.set(intro, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(intro, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });

      // Mood board: reveal + parallax leggero delle 4 foto
      const tiles = moodRef.current?.querySelectorAll<HTMLElement>("[data-mood-tile]");
      if (tiles && tiles.length) {
        gsap.set(tiles, { opacity: 0, y: 60, scale: 0.96 });
        ScrollTrigger.create({
          trigger: moodRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(tiles, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              stagger: 0.12,
            });
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cucina"
      ref={rootRef}
      aria-labelledby="kitchen-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità cromatica dalla Sez.04 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--olive) 8%, transparent), transparent)",
        }}
      />
      <div aria-hidden className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-40">
        {/* Intro */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p data-intro className="text-eyebrow text-ink/70">
              04 — La cucina
            </p>
            <h2
              id="kitchen-title"
              data-intro
              className="mt-6 font-display font-semibold leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              La <em className="text-terracotta">terra</em> in tavola
            </h2>
          </div>

          <div className="flex flex-col gap-6 md:col-span-5 md:pt-6">
            <p data-intro className="font-sans text-base leading-relaxed text-ink/80 md:text-lg">
              Tradizione pugliese e materie prime fresche del territorio, attraversate da un tocco
              creativo. La nostra cucina apre su prenotazione: ogni menù viene composto su misura,
              pensato per cerimonie, eventi e grandi occasioni.
            </p>

            <p
              data-intro
              className="font-display text-lg italic leading-snug text-ink/70 md:text-xl"
            >
              La stessa Murgia che alleva i <span style={{ color: "var(--murgese)" }}>cavalli</span>{" "}
              e piega gli ulivi arriva, ogni giorno, nel piatto.
            </p>

            <ul data-intro className="flex flex-wrap gap-2" aria-label="Servizi della cucina">
              {SERVICE_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="text-eyebrow rounded-full border border-ink/15 px-3 py-1.5 text-ink/70"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filetto */}
        <div aria-hidden className="mt-16 h-px w-full bg-ink/15 md:mt-24" />

        {/* Mood board 2x2: foto evocative della tavola, niente prezzi */}
        <div
          ref={moodRef}
          className="mt-16 grid grid-cols-2 gap-3 md:mt-24 md:grid-cols-4 md:gap-4"
          aria-label="La tavola della masseria"
        >
          {MOOD.map((m, i) => (
            <ParallaxLayer key={i} speed={i % 2 === 0 ? -0.15 : 0.15} zIndex={1}>
              <figure
                data-mood-tile
                className="relative overflow-hidden rounded-sm shadow-soft"
                style={{ aspectRatio: "3 / 4" }}
              >
                <img
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            </ParallaxLayer>
          ))}
        </div>

        {/* Messaggio + CTA: menù e prezzi su richiesta per gruppi ≥20 */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:mt-24 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p
              data-intro
              className="font-display text-2xl italic leading-snug text-ink md:text-3xl"
            >
              La carta cambia con le stagioni e con la materia disponibile.
            </p>
            <p
              data-intro
              className="mt-4 font-sans text-base leading-relaxed text-ink/75 md:text-lg"
            >
              Menù e prezzi si definiscono insieme, su richiesta, per{" "}
              <strong className="text-ink">gruppi di almeno 20 ospiti</strong>: cerimonie, eventi
              privati, cene aziendali, matrimoni. Scrivici su WhatsApp con la data e il numero di
              persone: prepariamo una proposta su misura.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:col-span-5 md:items-end md:justify-end">
            <MagneticButton href={WA_HREF} variant="pill" target="_blank" rel="noopener noreferrer">
              Scrivici su WhatsApp →
            </MagneticButton>
            <p className="text-eyebrow text-ink/55">Risposta in giornata · senza impegno</p>
          </div>
        </div>
      </div>

      {/* Ponte verso il pilastro equestre */}
      <div className="mx-auto max-w-7xl px-6 pb-32 md:px-12 md:pb-40">
        <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-lg italic text-ink/65 md:text-xl">
            L'altra anima della masseria.
          </p>
          <MagneticButton
            href="#cavalli"
            variant="link"
            ariaLabel="L'altra anima: i cavalli Murgesi"
          >
            <span style={{ color: "var(--murgese)" }}>I cavalli Murgesi →</span>
          </MagneticButton>
        </div>
      </div>

      {/* Uscita verso Sez.06 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--stone) 60%, transparent))",
        }}
      />
    </section>
  );
}
