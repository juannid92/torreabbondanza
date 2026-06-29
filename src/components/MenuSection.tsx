import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import convivioImg from "@/assets/sapori-convivio.jpg";

const KINETIC_WORDS: { label: string; tone: "warm" | "ink"; size: string; offset: string }[] = [
  { label: "convivio", tone: "warm", size: "clamp(3.2rem, 9vw, 8.5rem)", offset: "left" },
  { label: "tradizione", tone: "ink", size: "clamp(2.6rem, 7vw, 6.5rem)", offset: "right" },
  { label: "su misura", tone: "warm", size: "clamp(3rem, 8.5vw, 8rem)", offset: "left" },
  { label: "occasione", tone: "ink", size: "clamp(2.6rem, 7vw, 6.5rem)", offset: "right" },
];

export function MenuSection() {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Titolo: mask-reveal per parola
      root.querySelectorAll<HTMLElement>("[data-menu-title]").forEach((el) => {
        const words = splitWords(el);
        gsap.set(words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (reduced) {
              gsap.set(words, { yPercent: 0 });
              return;
            }
            gsap.to(words, {
              yPercent: 0,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.06,
            });
          },
        });
      });

      // Intro generico
      const intro = root.querySelectorAll<HTMLElement>("[data-menu-intro]");
      gsap.set(intro, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(intro, {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.3 : 0.9,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });

      // Parallax foto + Ken Burns
      const img = imageRef.current;
      const scene = sceneRef.current;
      if (img && scene && !reduced) {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.22,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Parole kinetic: mask-reveal per lettera + parallax layering
      root.querySelectorAll<HTMLElement>("[data-kinetic]").forEach((el) => {
        const words = splitWords(el);
        gsap.set(words, { yPercent: 105 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            if (reduced) {
              gsap.set(words, { yPercent: 0 });
              return;
            }
            gsap.to(words, {
              yPercent: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.05,
            });
          },
        });

        if (!reduced) {
          const speed = Number(el.dataset.speed ?? "0.15");
          gsap.fromTo(
            el,
            { y: 80 * speed },
            {
              y: -80 * speed,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      });

      // Racconto: reveal per riga
      root.querySelectorAll<HTMLElement>("[data-prose] > *").forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 22 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.3 : 0.9,
              ease: "power3.out",
              delay: reduced ? 0 : i * 0.05,
            });
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="menu"
      ref={rootRef}
      aria-labelledby="menu-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità cromatica dalla Sez.05 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--stone) 55%, transparent), transparent)",
        }}
      />
      <div aria-hidden className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-40">
        {/* Testata */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <p data-menu-intro className="text-eyebrow text-ink/70">
              05 — I sapori
            </p>
            <h2
              id="menu-title"
              data-menu-title
              className="mt-6 overflow-hidden font-display font-semibold leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.6rem, 7vw, 6rem)",
                letterSpacing: "-0.028em",
              }}
            >
              La tavola su <em className="text-terracotta">misura</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:pt-10">
            <p
              data-menu-intro
              className="font-display text-lg italic leading-snug text-ink/75 md:text-xl"
            >
              Niente carta da sfogliare: una cucina pugliese della tradizione
              che si compone insieme, su misura per la tua occasione.
            </p>
          </div>
        </div>
      </div>

      {/* Scena cinematografica: foto grande + parole kinetic in layering */}
      <div
        ref={sceneRef}
        className="relative mt-20 md:mt-28"
        style={{ paddingTop: "8vh", paddingBottom: "10vh" }}
      >
        <div className="relative mx-auto max-w-[1500px] px-4 md:px-10">
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "12px",
              aspectRatio: "16 / 10",
              boxShadow: "0 40px 80px -40px color-mix(in oklab, var(--ink) 45%, transparent)",
            }}
          >
            <img
              ref={imageRef}
              src={convivioImg}
              alt="Lunga tavola della masseria imbandita all'ora dorata: ospiti che condividono il cibo, candele e ceramiche pugliesi"
              loading="lazy"
              width={1600}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ willChange: "transform" }}
            />
            {/* Velatura per leggibilità delle parole sovrapposte */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 30% 80%, color-mix(in oklab, var(--ink) 35%, transparent), transparent 60%), linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--ink) 45%, transparent))",
              }}
            />
          </div>

          {/* Parole kinetic in layering — desktop: alcune sovrapposte alla foto, altre fuori */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden md:block"
          >
            {/* convivio — sovrapposto in basso a sinistra */}
            <div
              className="absolute"
              style={{ left: "4%", bottom: "8%" }}
            >
              <div className="overflow-hidden">
                <span
                  data-kinetic
                  data-speed="0.25"
                  className="block font-display italic"
                  style={{
                    fontSize: KINETIC_WORDS[0].size,
                    color: "var(--ivory)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.95,
                    mixBlendMode: "screen",
                  }}
                >
                  convivio
                </span>
              </div>
            </div>

            {/* su misura — sovrapposto a metà destra */}
            <div
              className="absolute"
              style={{ right: "5%", top: "12%" }}
            >
              <div className="overflow-hidden text-right">
                <span
                  data-kinetic
                  data-speed="0.4"
                  className="block font-display italic"
                  style={{
                    fontSize: KINETIC_WORDS[2].size,
                    color: "var(--terracotta)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.95,
                  }}
                >
                  su misura
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fascia parole-eco fuori dalla foto, sotto */}
        <div className="relative mx-auto mt-10 hidden max-w-[1500px] px-10 md:block">
          <div className="grid grid-cols-12 items-end gap-8">
            <div className="col-span-5 overflow-hidden">
              <span
                data-kinetic
                data-speed="0.18"
                className="block font-display"
                style={{
                  fontSize: KINETIC_WORDS[1].size,
                  color: "var(--ink)",
                  letterSpacing: "-0.035em",
                  lineHeight: 0.9,
                }}
              >
                tradizione
              </span>
            </div>
            <div className="col-span-7 overflow-hidden text-right">
              <span
                data-kinetic
                data-speed="0.3"
                className="block font-display italic"
                style={{
                  fontSize: KINETIC_WORDS[3].size,
                  color: "var(--terracotta)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.9,
                }}
              >
                occasione
              </span>
            </div>
          </div>
        </div>

        {/* Mobile: parole sotto la foto, stack */}
        <div className="mt-8 flex flex-col gap-2 px-6 md:hidden">
          {KINETIC_WORDS.map((w) => (
            <div key={w.label} className="overflow-hidden">
              <span
                data-kinetic
                className="block font-display italic"
                style={{
                  fontSize: w.size,
                  color: w.tone === "warm" ? "var(--terracotta)" : "var(--ink)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                }}
              >
                {w.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Racconto editoriale del modello — prosa, non numeri */}
      <div className="mx-auto max-w-5xl px-6 pt-12 md:px-12 md:pt-20">
        <div
          data-prose
          className="flex flex-col gap-8 md:gap-10"
        >
          <p
            className="font-display text-ink"
            style={{
              fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)",
              lineHeight: 1.35,
              letterSpacing: "-0.012em",
            }}
          >
            La masseria apre la sua cucina per le{" "}
            <em className="text-terracotta">grandi occasioni</em> — cerimonie,
            battesimi, compleanni, matrimoni.
          </p>
          <p
            className="font-sans text-ink/80"
            style={{
              fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
              lineHeight: 1.6,
            }}
          >
            Ogni menù nasce da un accordo, pensato insieme. Per sedervi alla
            nostra tavola bastano una compagnia di almeno{" "}
            <em className="not-italic font-display italic text-terracotta">venti persone</em>,{" "}
            <em className="not-italic font-display italic text-terracotta">due giorni</em>{" "}
            di anticipo e una proposta che parte da{" "}
            <em className="not-italic font-display italic text-terracotta">cinquanta euro</em>{" "}
            a persona. Il resto — i sapori, il ritmo, i dettagli — lo
            scegliamo con voi.
          </p>
          <p
            className="text-eyebrow text-ink/55"
            style={{ letterSpacing: "0.18em" }}
          >
            Veg · Vegan · Gluten-free · Menù bambini — su richiesta
          </p>
        </div>

        {/* CTA */}
        <div className="mt-14 flex md:mt-20">
          <MagneticButton href="#contatti" variant="pill-solid">
            Richiedi il tuo menù →
          </MagneticButton>
        </div>
      </div>

      {/* Ponte verso il pilastro dei Cavalli: vira al nero Murgese */}
      <div className="relative mt-28 md:mt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--murgese) 18%, transparent) 60%, color-mix(in oklab, var(--murgese) 45%, transparent))",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-20 md:px-12 md:pb-40 md:pt-32">
          <p
            data-menu-intro
            className="font-display italic"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)",
              lineHeight: 1.25,
              color: "var(--murgese)",
              letterSpacing: "-0.015em",
            }}
          >
            Finita la tavola, resta il galoppo.{" "}
            <a
              href="#cavalli"
              className="not-italic underline-offset-4 transition-colors hover:underline"
              style={{ color: "var(--murgese)" }}
            >
              I cavalli Murgesi →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
