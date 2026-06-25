import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicOpener } from "./CinematicOpener";
import { PathPanel } from "./PathPanel";
import { MagneticButton } from "./MagneticButton";
import weddingImg from "@/assets/events-wedding.jpg";
import privateImg from "@/assets/events-private.jpg";
import hallImg from "@/assets/events-hall.jpg";
import gardenImg from "@/assets/events-garden.jpg";
import kitchenImg from "@/assets/events-kitchen.jpg";

const SPACES = [
  {
    id: "sala",
    label: "La Sala",
    note: "Volte storiche del '700, luce calda e tavole imperiali.",
    image: hallImg,
    alt: "Sala interna della masseria con volte in pietra e tavole apparecchiate",
  },
  {
    id: "giardino",
    label: "Il Giardino",
    note: "Ulivi secolari, muretti a secco, tramonti lunghi sulla Murgia.",
    image: gardenImg,
    alt: "Giardino della masseria con ulivi secolari al tramonto",
  },
  {
    id: "cucina",
    label: "La cucina su misura",
    note: "Menù costruiti con voi, materia prima del territorio.",
    image: kitchenImg,
    alt: "Chef che impiatta un piatto su misura nella cucina della masseria",
  },
];

export function EventsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [focusedPath, setFocusedPath] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const spaces = root.querySelectorAll<HTMLElement>("[data-space]");
      const quoteWords = root.querySelectorAll<HTMLElement>("[data-quote-word]");
      const closing = root.querySelectorAll<HTMLElement>("[data-closing]");

      gsap.set(spaces, { opacity: 0, y: 30 });
      gsap.set(quoteWords, { opacity: 0, yPercent: 60 });
      gsap.set(closing, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: "[data-spaces-row]",
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(spaces, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
          });
        },
      });

      ScrollTrigger.create({
        trigger: "[data-closing-block]",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(quoteWords, {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.05,
          });
          gsap.to(closing, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.3,
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const quote = "Location spettacolare nel bel mezzo delle campagne pugliesi.".split(
    " ",
  );

  return (
    <section
      id="eventi"
      ref={rootRef}
      aria-labelledby="events-title"
      className="relative bg-ivory"
    >
      {/* Sr-only h2 (visual title già in opener) */}
      <h2 id="events-title" className="sr-only">
        Eventi e matrimoni alla Masseria Torre Abbondanza
      </h2>

      {/* MOMENTO A — Opener */}
      <CinematicOpener />

      {/* Continuità: dal tramonto si apre lo spazio chiaro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-40"
        style={{
          top: "100svh",
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--ink) 25%, transparent), transparent)",
        }}
      />

      {/* MOMENTO B — I due percorsi */}
      <div className="mx-auto max-w-7xl px-6 py-32 md:px-12 md:py-48">
        <div className="mb-16 flex max-w-2xl flex-col gap-5 md:mb-24">
          <p className="text-eyebrow text-ink/65">Due percorsi</p>
          <p
            className="font-display font-medium leading-[1.1] text-ink/85"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)" }}
          >
            Scegliete la cornice. Noi <em className="text-terracotta">cuciamo</em> l'esperienza
            attorno alle vostre persone.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12"
          onMouseLeave={() => setFocusedPath(null)}
        >
          <PathPanel
            index={0}
            eyebrow="I · Matrimoni"
            title="Il vostro giorno"
            phrase="Nella cornice di una masseria del Settecento, il sì che ricorderete sempre."
            bullets={[
              "Cerimonia civile e simbolica in giardino",
              "Ricevimento in sala e nei nostri spazi esterni",
              "Cucina su misura, vini della casa",
              "Capienza e servizi su richiesta /* DA CONFERMARE */",
            ]}
            ctaLabel="Immagina il tuo matrimonio →"
            ctaHref="#contatti"
            imageSrc={weddingImg}
            imageAlt="Sposi sotto un arco fiorito al tramonto nella masseria"
            isDimmed={focusedPath !== null && focusedPath !== 0}
            onFocus={() => setFocusedPath(0)}
            onBlur={() => setFocusedPath(null)}
          />
          <PathPanel
            index={1}
            eyebrow="II · Ricevimenti & Eventi privati"
            title="Ogni occasione, una festa"
            phrase="Compleanni, anniversari, celebrazioni di lavoro: la masseria si trasforma per voi."
            bullets={[
              "Cene private e feste stagionali",
              "Eventi aziendali e ricorrenze familiari",
              "Allestimenti su misura, dentro e fuori",
              "Formati e servizi modulabili /* DA CONFERMARE */",
            ]}
            ctaLabel="Organizza il tuo evento →"
            ctaHref="#contatti"
            imageSrc={privateImg}
            imageAlt="Tavolata privata di sera sotto luci sospese tra gli ulivi"
            isDimmed={focusedPath !== null && focusedPath !== 1}
            onFocus={() => setFocusedPath(1)}
            onBlur={() => setFocusedPath(null)}
          />
        </div>
      </div>

      {/* MOMENTO C — Gli spazi + citazione + CTA */}
      <div className="relative bg-stone/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{
            background:
              "linear-gradient(180deg, var(--ivory), transparent)",
          }}
        />

        <div className="mx-auto max-w-7xl px-6 py-32 md:px-12 md:py-40">
          {/* Spaces row */}
          <div
            data-spaces-row
            className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
          >
            {SPACES.map((s) => (
              <article key={s.id} data-space className="flex flex-col gap-5">
                <div
                  className="relative overflow-hidden bg-ivory shadow-soft"
                  style={{
                    borderRadius: "50% 50% 0 0 / 38% 38% 0 0",
                    border: "1px solid var(--stone)",
                    aspectRatio: "3 / 4",
                  }}
                >
                  <img
                    src={s.image}
                    alt={s.alt}
                    loading="lazy"
                    width={1024}
                    height={1366}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl font-medium text-ink md:text-2xl">
                    {s.label}
                  </h3>
                  <p className="font-display text-base italic text-ink/70">
                    {s.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Closing block: quote + CTA */}
          <div
            data-closing-block
            className="mt-24 flex flex-col items-start gap-12 border-t border-ink/15 pt-16 md:mt-32 md:flex-row md:items-end md:justify-between md:gap-16"
          >
            <blockquote className="relative max-w-2xl border-l-2 border-terracotta pl-6">
              <p
                className="font-display font-medium leading-[1.1] text-ink"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                aria-label="Location spettacolare nel bel mezzo delle campagne pugliesi."
              >
                <span aria-hidden>"</span>
                {quote.map((w, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden align-top"
                    style={{ paddingBottom: "0.16em" }}
                  >
                    <span
                      data-quote-word
                      className="inline-block"
                      style={{ willChange: "transform" }}
                    >
                      {w}
                      {i < quote.length - 1 ? "\u00A0" : ""}
                    </span>
                  </span>
                ))}
                <span aria-hidden>"</span>
              </p>
              <footer data-closing className="mt-4 text-eyebrow text-ink/55">
                — Da una recensione {/* DA CONFERMARE attribuzione */}
              </footer>
            </blockquote>

            <div data-closing className="flex flex-shrink-0">
              <MagneticButton href="#contatti" variant="pill">
                Raccontaci il tuo evento →
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Uscita verso Sez.08 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--olive) 14%, transparent))",
          }}
        />
      </div>
    </section>
  );
}
