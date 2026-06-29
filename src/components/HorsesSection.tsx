import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import apparitionImg from "@/assets/horse-apparition.jpg";
import gallopImg from "@/assets/horse-gallop.jpg";
import skyImg from "@/assets/horses-sky.jpg";
import hillsImg from "@/assets/horses-hills.png";
import grazingImg from "@/assets/horses-grazing.png";
import traditionImg from "@/assets/horses-tradition.jpg";

const MICRO_LABELS = [
  { text: "MANTO CORVINO", x: "8%", y: "22%", delay: 0.1 },
  { text: "RAZZA AUTOCTONA", x: "72%", y: "18%", delay: 0.3 },
  { text: "L'ANTICA MURGIA EQUESTRE", x: "12%", y: "78%", delay: 0.5 },
  { text: "STIRPE DI PUGLIA", x: "68%", y: "82%", delay: 0.7 },
];

export function HorsesSection() {
  const rootRef = useRef<HTMLElement>(null);
  const gallopSceneRef = useRef<HTMLDivElement>(null);
  const gallopImgRef = useRef<HTMLImageElement>(null);
  const gallopWordRef = useRef<HTMLSpanElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const prairieSceneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const isReduced =
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Mask-reveal titoli per parola
      root.querySelectorAll<HTMLElement>("[data-h-title]").forEach((el) => {
        const words = splitWords(el);
        gsap.set(words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 82%",
          once: true,
          onEnter: () => {
            if (isReduced) {
              gsap.set(words, { yPercent: 0 });
              return;
            }
            gsap.to(words, {
              yPercent: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.06,
            });
          },
        });
      });

      // Fade-in intros
      root.querySelectorAll<HTMLElement>("[data-h-fade]").forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: isReduced ? 0.3 : 0.9,
              delay: isReduced ? 0 : i * 0.04,
              ease: "power3.out",
            });
          },
        });
      });

      // Apparition: reveal in luce (alone caldo cresce)
      const apparition = root.querySelector<HTMLElement>("[data-h-apparition]");
      if (apparition && !isReduced) {
        gsap.fromTo(
          apparition,
          { opacity: 0.15, scale: 1.08 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            duration: 1.8,
            scrollTrigger: {
              trigger: apparition,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      }

      // MOMENTO B — Galoppo scroll-scrubbed: pin + traslazione orizzontale
      const gallopScene = gallopSceneRef.current;
      const gallopEl = gallopImgRef.current;
      const gallopWord = gallopWordRef.current;
      const dust = dustRef.current;
      if (gallopScene && gallopEl && !isReduced) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gallopScene,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.fromTo(
          gallopEl,
          { xPercent: -22, scale: 1.18 },
          { xPercent: 12, scale: 1.05, ease: "none" },
          0,
        );
        if (gallopWord) {
          tl.fromTo(
            gallopWord,
            { xPercent: 30 },
            { xPercent: -35, ease: "none" },
            0,
          );
        }
        if (dust) {
          tl.fromTo(
            dust,
            { opacity: 0, xPercent: -20 },
            { opacity: 1, xPercent: 25, ease: "none" },
            0,
          );
        }
      }

      // MOMENTO C — Prateria a piani: parallax dolly-in
      const prairie = prairieSceneRef.current;
      if (prairie && !isReduced) {
        prairie.querySelectorAll<HTMLElement>("[data-p-layer]").forEach((layer) => {
          const speed = Number(layer.dataset.speed ?? "0.2");
          const scale = Number(layer.dataset.scale ?? "0");
          gsap.fromTo(
            layer,
            { y: 80 * speed, scale: 1 + scale * 0.04 },
            {
              y: -80 * speed,
              scale: 1 + scale * 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: prairie,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });

        // Erba che ondeggia
        const grass = prairie.querySelector<HTMLElement>("[data-p-grass]");
        if (grass) {
          gsap.to(grass, {
            skewX: 2.2,
            transformOrigin: "bottom center",
            duration: 2.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="cavalli"
      ref={rootRef}
      aria-labelledby="cavalli-title"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--murgese)", color: "var(--ivory)" }}
    >
      <div aria-hidden className="grain-overlay" style={{ opacity: 0.08 }} />

      {/* ────────── MOMENTO A — L'APPARIZIONE ────────── */}
      <div className="relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-32 md:grid-cols-12 md:gap-10 md:px-12 md:pt-48">
          <div className="md:col-span-5">
            <p
              data-h-fade
              className="text-eyebrow"
              style={{ color: "color-mix(in oklab, var(--ivory) 65%, transparent)" }}
            >
              06 — I cavalli Murgesi
            </p>
            <h2
              id="cavalli-title"
              data-h-title
              className="mt-8 overflow-hidden font-display font-semibold leading-[0.95]"
              style={{
                fontSize: "clamp(3rem, 8.5vw, 7.5rem)",
                letterSpacing: "-0.03em",
                color: "var(--ivory)",
              }}
            >
              L&apos;anima <em className="text-terracotta">nera</em>
            </h2>
            <p
              data-h-fade
              className="mt-10 font-display italic"
              style={{
                fontSize: "clamp(1.15rem, 1.7vw, 1.55rem)",
                lineHeight: 1.45,
                color: "color-mix(in oklab, var(--ivory) 82%, transparent)",
                maxWidth: "34ch",
              }}
            >
              Nera come la notte di Puglia, antica come questa terra: la
              stirpe del cavallo Murgese vive nella Murgia da secoli.
            </p>
          </div>

          <div className="relative md:col-span-7">
            <div
              data-h-apparition
              className="relative overflow-hidden"
              style={{
                borderRadius: "12px",
                aspectRatio: "4 / 5",
                boxShadow:
                  "0 60px 140px -40px color-mix(in oklab, var(--gold) 40%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--ivory) 12%, transparent)",
              }}
            >
              <img
                src={apparitionImg}
                alt="Silhouette di un cavallo Murgese dal manto nero che emerge dalla penombra, criniera e collo illuminati da una luce calda radente"
                loading="lazy"
                width={1600}
                height={1800}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Alone caldo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 50% at 38% 55%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)",
                  mixBlendMode: "screen",
                }}
              />
              {/* Particelle di polvere */}
              {!reduced &&
                Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      left: `${(i * 73) % 100}%`,
                      top: `${(i * 41) % 100}%`,
                      width: 2 + (i % 3),
                      height: 2 + (i % 3),
                      backgroundColor: "color-mix(in oklab, var(--gold) 70%, transparent)",
                      filter: "blur(0.5px)",
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.1, 0.6, 0.1],
                    }}
                    transition={{
                      duration: 4 + (i % 4),
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ────────── MOMENTO B — IL GALOPPO (scroll-scrubbed) ────────── */}
      <div
        ref={gallopSceneRef}
        className="relative mt-32 h-screen w-full overflow-hidden md:mt-48"
        style={{
          backgroundColor: "color-mix(in oklab, var(--murgese) 92%, black)",
        }}
      >
        {/* Parola gigante in parallax controvento (z dietro) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span
            ref={gallopWordRef}
            className="font-display"
            style={{
              fontSize: "clamp(8rem, 28vw, 26rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "color-mix(in oklab, var(--gold) 22%, transparent)",
              whiteSpace: "nowrap",
              lineHeight: 0.9,
              willChange: "transform",
            }}
          >
            GALOPPO
          </span>
        </div>

        {/* Polvere/luce dietro il cavallo */}
        <div
          ref={dustRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 right-0"
          style={{
            background:
              "radial-gradient(40% 30% at 30% 60%, color-mix(in oklab, var(--gold) 28%, transparent), transparent 70%)",
            willChange: "transform, opacity",
          }}
        />

        {/* Cavallo che galoppa (scrubbed translateX) */}
        <img
          ref={gallopImgRef}
          src={gallopImg}
          alt="Cavallo Murgese al galoppo nella Murgia all'ora dorata, criniera al vento, polvere sollevata dagli zoccoli"
          loading="lazy"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ willChange: "transform" }}
        />

        {/* Velatura per leggibilità testo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 55%, transparent), transparent 30%, transparent 60%, color-mix(in oklab, var(--murgese) 75%, transparent))",
          }}
        />

        {/* Caption in basso */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 px-6 md:bottom-16 md:px-12">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <p
              className="text-eyebrow"
              style={{ color: "color-mix(in oklab, var(--ivory) 75%, transparent)" }}
            >
              Galoppo · Murgia · ora dorata
            </p>
            <p
              className="hidden font-display italic md:block"
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.25rem)",
                color: "color-mix(in oklab, var(--ivory) 85%, transparent)",
                maxWidth: "32ch",
                textAlign: "right",
              }}
            >
              Lo scroll diventa corsa.
            </p>
          </div>
        </div>
      </div>

      {/* ────────── MOMENTO C — LA PRATERIA ────────── */}
      <div
        ref={prairieSceneRef}
        className="relative mt-0 h-[110vh] w-full overflow-hidden"
      >
        {/* Cielo */}
        <div
          data-p-layer
          data-speed="0.05"
          data-scale-boost="0"
          className="absolute inset-0"
          style={{ willChange: "transform" }}
        >
          <img
            src={skyImg}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Colline */}
        <div
          data-p-layer
          data-speed="0.2"
          data-scale-boost="0.4"
          className="absolute inset-x-0 bottom-0 h-[70%]"
          style={{ willChange: "transform" }}
        >
          <img
            src={hillsImg}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom"
          />
        </div>

        {/* Cavalli al pascolo */}
        <div
          data-p-layer
          data-speed="0.35"
          data-scale-boost="0.7"
          className="absolute inset-x-0 bottom-[12%] h-[42%]"
          style={{ willChange: "transform" }}
        >
          <img
            src={grazingImg}
            alt="Cavalli Murgesi al pascolo nella prateria della Murgia all'ora dorata"
            loading="lazy"
            className="absolute inset-x-0 bottom-0 h-full w-full object-contain object-bottom"
          />
        </div>

        {/* Erba in primo piano (SVG sway) */}
        <div
          data-p-layer
          data-p-grass
          data-speed="0.55"
          data-scale-boost="1"
          className="absolute inset-x-0 bottom-0 h-[22%]"
          style={{ willChange: "transform" }}
        >
          <svg
            viewBox="0 0 1920 220"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B7250" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#15110F" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M0,220 L0,140 Q60,40 120,130 Q180,30 240,120 Q300,20 360,110 Q420,40 480,130 Q540,20 600,120 Q660,50 720,130 Q780,30 840,120 Q900,40 960,130 Q1020,20 1080,120 Q1140,50 1200,130 Q1260,30 1320,120 Q1380,40 1440,130 Q1500,20 1560,120 Q1620,50 1680,130 Q1740,30 1800,120 Q1860,40 1920,130 L1920,220 Z"
              fill="url(#grassGrad)"
            />
          </svg>
        </div>

        {/* Type-as-mask: MURGESE con prateria visibile dentro */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <span
            className="block font-display font-bold"
            style={{
              fontSize: "clamp(5rem, 22vw, 22rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
              backgroundImage: `url(${gallopImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              textShadow: "0 0 60px color-mix(in oklab, var(--murgese) 60%, transparent)",
            }}
          >
            MURGESE
          </span>
        </div>

        {/* Micro-etichette evocative */}
        {MICRO_LABELS.map((l) => (
          <motion.span
            key={l.text}
            className="pointer-events-none absolute text-eyebrow"
            style={{
              left: l.x,
              top: l.y,
              color: "color-mix(in oklab, var(--ivory) 80%, transparent)",
              letterSpacing: "0.32em",
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, delay: l.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="inline-flex items-center gap-2"
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 5 + l.delay * 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span
                aria-hidden
                className="block h-px w-6"
                style={{ backgroundColor: "color-mix(in oklab, var(--gold) 70%, transparent)" }}
              />
              {l.text}
            </motion.span>
          </motion.span>
        ))}
      </div>

      {/* ────────── MOMENTO D — LA TRADIZIONE ────────── */}
      <div className="relative mt-0 px-6 pb-40 pt-32 md:px-12 md:pb-56 md:pt-48">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6 md:order-2">
            <div
              data-h-fade
              className="relative overflow-hidden"
              style={{
                borderRadius: "12px",
                aspectRatio: "7 / 8",
                boxShadow:
                  "0 50px 120px -40px color-mix(in oklab, black 70%, transparent)",
              }}
            >
              <img
                src={traditionImg}
                alt="Carrozza d'epoca con due cavalli Murgesi nella tradizione equestre della Murgia, al tramonto presso la masseria"
                loading="lazy"
                width={1408}
                height={1216}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, color-mix(in oklab, var(--murgese) 55%, transparent))",
                }}
              />
            </div>
          </div>

          <div className="md:col-span-6 md:order-1">
            <p
              data-h-fade
              className="text-eyebrow"
              style={{ color: "color-mix(in oklab, var(--gold) 90%, transparent)" }}
            >
              La tradizione
            </p>
            <h3
              data-h-title
              className="mt-6 overflow-hidden font-display"
              style={{
                fontSize: "clamp(2rem, 4.2vw, 3.6rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.022em",
                color: "var(--ivory)",
              }}
            >
              La masseria custodisce la Murgia <em className="text-terracotta">equestre</em>.
            </h3>
            <p
              data-h-fade
              className="mt-8 font-display italic"
              style={{
                fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)",
                lineHeight: 1.55,
                color: "color-mix(in oklab, var(--ivory) 82%, transparent)",
              }}
            >
              Sfilata di Attacchi d&apos;Epoca, cavalli Murgesi e muli
              Martinesi: a Torre Abbondanza la tradizione equestre della
              Murgia non è memoria, è gesto vivo.
            </p>
            <p
              data-h-fade
              className="mt-6 text-sm leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--ivory) 65%, transparent)" }}
            >
              {/* DA CONFERMARE — se la masseria alleva direttamente
              Murgesi: nome allevamento, da quando, numero di capi. In
              alternativa: dettaglio esperienze/eventi equestri offerti agli
              ospiti (visite, scuderia aperta, passeggiate, attacchi). */}
              Esperienze equestri tra scuderia, pascolo e attacchi storici —
              su richiesta, in occasione di eventi e visite guidate alla
              masseria.
            </p>

            <div className="mt-12">
              <MagneticButton href="#contatti" variant="pill-murgese">
                Vivi l&apos;esperienza equestre →
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* ────────── USCITA — risalita verso il caldo ────────── */}
      <div
        aria-hidden
        className="relative h-48 w-full"
        style={{
          background:
            "linear-gradient(180deg, var(--murgese) 0%, color-mix(in oklab, var(--murgese) 55%, var(--terracotta)) 45%, color-mix(in oklab, var(--stone) 70%, var(--ivory)) 85%, var(--ivory) 100%)",
        }}
      />
    </section>
  );
}
