import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxLayer } from "./ParallaxLayer";
import { FloatingDatum } from "./FloatingDatum";
import { StylizedMap } from "./StylizedMap";
import skyImg from "@/assets/place-sky.jpg";
import hillsImg from "@/assets/place-hills.png";
import olivesImg from "@/assets/place-olives.png";
import masseriaImg from "@/assets/place-masseria.png";
import horsesImg from "@/assets/place-horses.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MAP_URL = "https://www.google.com/maps?q=40.728664,17.132612";

export function PlaceSection() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scene = sceneRef.current;
    if (!scene) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]", scene);

      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed ?? "0");
        const scaleBoost = parseFloat(layer.dataset.scaleBoost ?? "0");
        // y: layer lenti scendono di più al ribasso. Range complessivo ~ -150..+150
        const yShift = speed * 180;
        gsap.fromTo(
          layer,
          { yPercent: -yShift * 0.3, scale: 1 },
          {
            yPercent: yShift * 0.5,
            scale: 1 + scaleBoost,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Title mask reveal per parole
      const title = titleRef.current;
      if (title) {
        const words = title.querySelectorAll<HTMLElement>("[data-word-inner]");
        gsap.fromTo(
          words,
          { yPercent: 110 },
          {
            yPercent: 0,
            ease: "power3.out",
            duration: 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, scene);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="luogo"
      aria-labelledby="place-title"
      className="relative w-full bg-ivory text-ink"
    >
      {/* Continuità cromatica dalla Sez.03 (pietra/olive) verso natura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-32"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--olive) 25%, var(--stone)), transparent)",
        }}
      />

      {/* MOMENTO A — Scena di profondità */}
      <div
        ref={sceneRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* L1 Sfondo gradient + foto cielo */}
        <ParallaxLayer speed={1} zIndex={1}>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--ivory) 70%, var(--gold) 30%), color-mix(in oklab, var(--ivory) 92%, var(--olive) 8%))",
            }}
          />
          <img
            src={skyImg}
            alt=""
            aria-hidden
            loading="lazy"
            width={1920}
            height={1024}
            className="absolute inset-x-0 top-0 h-[70%] w-full object-cover opacity-80 mix-blend-multiply"
          />
        </ParallaxLayer>

        {/* L2 Colline lontane */}
        <ParallaxLayer speed={0.7} zIndex={2}>
          <img
            src={hillsImg}
            alt=""
            aria-hidden
            loading="lazy"
            width={1920}
            height={700}
            className="absolute inset-x-0 bottom-[30%] h-[35%] w-full object-cover object-bottom opacity-40"
            style={{ filter: "blur(1px) saturate(0.8)" }}
          />
          {/* Banda colline supplementare per profondità */}
          <div
            className="absolute inset-x-0 bottom-[28%] h-[18%]"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--olive) 35%, transparent), transparent)",
            }}
          />
        </ParallaxLayer>

        {/* L3 Masseria — quasi neutra, punto fermo */}
        <ParallaxLayer speed={0.1} scaleBoost={0.05} zIndex={3}>
          <img
            src={masseriaImg}
            alt="Masseria Torre Abbondanza nel paesaggio della Murgia"
            loading="lazy"
            width={1408}
            height={1024}
            className="absolute bottom-[18%] left-1/2 w-[58%] max-w-[760px] -translate-x-1/2 object-contain drop-shadow-[0_30px_60px_color-mix(in_oklab,var(--ink)_30%,transparent)] md:left-[58%] md:w-[48%]"
          />
        </ParallaxLayer>

        {/* L3.5 Cavalli Murgesi al pascolo — piano intermedio tra muretti e masseria */}
        {/* presenza reale di cavalli al pascolo presso la masseria: DA CONFERMARE */}
        <ParallaxLayer speed={-0.15} scaleBoost={0.06} zIndex={4}>
          <img
            src={horsesImg}
            alt="Silhouette di cavalli Murgesi dal manto corvino al pascolo nella Murgia"
            loading="lazy"
            width={1920}
            height={768}
            className="absolute inset-x-0 bottom-[14%] h-[28%] w-full object-contain object-bottom opacity-90 md:left-[2%] md:w-[62%]"
            style={{ filter: "drop-shadow(0 18px 20px color-mix(in oklab, var(--ink) 25%, transparent))" }}
          />
        </ParallaxLayer>

        {/* L4 Ulivi ai lati */}
        <ParallaxLayer speed={-0.3} scaleBoost={0.08} zIndex={5}>
          <img
            src={olivesImg}
            alt=""
            aria-hidden
            loading="lazy"
            width={1920}
            height={900}
            className="absolute inset-x-0 bottom-[6%] h-[60%] w-full object-cover opacity-90"
          />
        </ParallaxLayer>

        {/* L5 Muretto a secco (CSS band) */}
        <ParallaxLayer speed={-0.6} scaleBoost={0.12} zIndex={6}>
          <div
            className="absolute inset-x-0 bottom-0 h-[14%]"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--stone) 90%, var(--ink) 10%), color-mix(in oklab, var(--stone) 70%, var(--ivory) 30%) 60%, transparent)",
              boxShadow:
                "inset 0 8px 16px -8px color-mix(in oklab, var(--ink) 30%, transparent), inset 0 -2px 0 0 color-mix(in oklab, var(--ink) 25%, transparent)",
            }}
          />
          {/* Texture pietre */}
          <svg
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[14%] w-full opacity-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {Array.from({ length: 60 }).map((_, i) => {
              const x = (i % 20) * 60 + ((Math.floor(i / 20) % 2) * 30);
              const y = 30 + Math.floor(i / 20) * 28;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={50 + (i % 3) * 6}
                  height={22}
                  rx={4}
                  fill="color-mix(in oklab, var(--stone) 60%, var(--ink) 40%)"
                  stroke="color-mix(in oklab, var(--ink) 35%, transparent)"
                  strokeWidth="0.8"
                />
              );
            })}
          </svg>
        </ParallaxLayer>

        {/* Overlay testuale */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pt-[14vh] md:px-12 lg:px-20">
            <span className="text-eyebrow text-ink/70">03 — Il luogo</span>
            <h2
              id="place-title"
              ref={titleRef}
              className="mt-4 font-display text-ink"
              style={{
                fontSize: "clamp(2.6rem, 7vw, 6.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              <span className="word-mask">
                <span data-word-inner className="word-inner">Nel&nbsp;</span>
              </span>
              <span className="word-mask">
                <span data-word-inner className="word-inner">respiro&nbsp;</span>
              </span>
              <span className="word-mask">
                <span data-word-inner className="word-inner">della&nbsp;</span>
              </span>
              <span className="word-mask">
                <span data-word-inner className="word-inner italic text-terracotta">Murgia</span>
              </span>
            </h2>
            <p
              className="mt-6 max-w-[44ch] font-display text-ink/80"
              style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.4rem)", lineHeight: 1.5 }}
            >
              Un punto di quiete tra ulivi secolari e muretti a secco,
              dove pascolano i cavalli Murgesi e il paesaggio diventa silenzio.
            </p>
          </div>
        </div>

        {/* FloatingDatum desktop — sparsi e asimmetrici */}
        <div className="pointer-events-none absolute inset-0 z-25 hidden md:block">
          <FloatingDatum className="left-[6%] top-[18%]" delay={0.4}>
            40.72° N — 17.13° E
          </FloatingDatum>
          <FloatingDatum className="right-[8%] top-[24%]" delay={0.6} amplitude={8} duration={7}>
            Murgia dei Trulli · altopiano
          </FloatingDatum>
          <FloatingDatum className="right-[14%] top-[58%]" delay={0.9} duration={5}>
            Noci (BA) · Puglia
          </FloatingDatum>
          <FloatingDatum
            className="left-[10%] top-[64%]"
            style={{ color: "var(--color-murgese, #15110F)" }}
            delay={1.1}
            amplitude={5}
            duration={8}
          >
            Terra del cavallo Murgese
          </FloatingDatum>
          <FloatingDatum
            className="left-[8%] top-[44%]"
            style={{ color: "color-mix(in oklab, var(--olive) 75%, var(--ink) 25%)" }}
            delay={1.3}
            amplitude={6}
            duration={9}
          >
            Ulivi · pietra · cavalli
          </FloatingDatum>
        </div>

        {/* Lista compatta mobile */}
        <ul
          aria-label="Coordinate e contesto"
          className="absolute bottom-[18%] left-1/2 z-25 grid w-[88%] max-w-[420px] -translate-x-1/2 grid-cols-1 gap-2 text-center md:hidden"
        >
          {[
            { t: "40.72° N — 17.13° E", deep: false },
            { t: "Murgia dei Trulli · altopiano", deep: false },
            { t: "Noci (BA) · Puglia", deep: false },
            { t: "Terra del cavallo Murgese", deep: true },
            { t: "Ulivi · pietra · cavalli", deep: false },
          ].map(({ t, deep }) => (
            <li
              key={t}
              className="text-eyebrow"
              style={{ color: deep ? "var(--color-murgese, #15110F)" : "color-mix(in oklab, var(--ink) 75%, transparent)" }}
            >
              {t}
            </li>
          ))}
        </ul>

        {/* Sfumatura di uscita verso MOMENTO B */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-24"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--ivory))",
          }}
        />
      </div>

      {/* MOMENTO B — Mappa stilizzata */}
      <div className="relative w-full px-6 py-[14vh] md:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          {/* Mappa */}
          <div className="relative">
            <div
              className="relative rounded-sm bg-ivory p-4 md:p-6"
              style={{
                boxShadow:
                  "0 30px 80px -50px color-mix(in oklab, var(--ink) 40%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--ink) 12%, transparent)",
              }}
            >
              <StylizedMap />
            </div>
            <span className="mt-3 block text-eyebrow text-ink/55">
              Taccuino · Murgia dei Trulli
            </span>
          </div>

          {/* Info reali */}
          <div className="flex flex-col gap-6">
            <span className="text-eyebrow text-terracotta">Come raggiungerci</span>
            <h3
              className="font-display text-ink"
              style={{
                fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              A pochi minuti da Noci,
              <br />
              <span className="italic text-olive">tra gli ulivi della Valle d'Itria.</span>
            </h3>
            <address className="not-italic font-sans text-ink/80" style={{ lineHeight: 1.7 }}>
              Strada Vicinale per Massafra — SP 211
              <br />
              Zona E n. 49, 70015 Noci (BA)
            </address>
            <p className="font-sans text-ink/65" style={{ fontSize: "0.95rem", lineHeight: 1.65 }}>
              Nel cuore della Murgia, terra di masserie e di cavalli.
              <br />
              A breve distanza da Noci, Alberobello e dalla Valle d'Itria.
              {/* Distanze esatte DA CONFERMARE */}
            </p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Apri la posizione su Google Maps in una nuova scheda"
              className="group inline-flex w-fit items-center gap-3 border-b border-ink/30 pb-1 text-eyebrow text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Apri in mappa
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Transizione verso Sez.05 — toni più caldi/gastronomici */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--terracotta) 12%, var(--ivory)))",
          }}
        />
      </div>
    </section>
  );
}
