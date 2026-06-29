import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/lib/split-text";
import { KineticMarquee } from "./KineticMarquee";
import { VerticalWord } from "./VerticalWord";
import { MagneticButton } from "./MagneticButton";
import sogliaImg from "@/assets/hero-soglia-unica.jpg";
import sogliaVideoAsset from "@/assets/hero-soglia-unica.mp4.asset.json";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "CAVALLI MURGESI",
  "RISTORANTE",
  "ALLEVAMENTO",
  "CERIMONIE & MATRIMONI",
  "ATTACCHI D'EPOCA",
  "CUCINA PUGLIESE",
  "MASSERIA DEL '700",
  "MURGIA · NOCI",
];

/**
 * Hero "La Soglia delle Due Anime" — dittico di archi gemelli.
 * Arco A (sx) = LA TAVOLA · Arco B (dx) = I CAVALLI.
 * Stessa dimensione, equità visiva e di movimento.
 * "ABBONDANZA" attraversa entrambi gli archi (back watermark + frammento terracotta davanti).
 * "TORRE" verticale a sinistra; connettore "&" centrale; due CTA di pari peso.
 */
export function HeroSoglia() {
  const root = useRef<HTMLElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const back = root.current!.querySelector<HTMLElement>("[data-abbondanza-back]")!;
      const front = root.current!.querySelector<HTMLElement>("[data-abbondanza-front]")!;
      const torre = root.current!.querySelector<HTMLElement>("[data-torre]")!;
      const meta = root.current!.querySelectorAll<HTMLElement>("[data-meta]");
      const subtitle = root.current!.querySelector<HTMLElement>("[data-subtitle]")!;
      const ctas = root.current!.querySelectorAll<HTMLElement>("[data-cta]");
      const scrollCue = root.current!.querySelector<HTMLElement>("[data-scroll-cue]")!;
      const media = root.current!.querySelector<HTMLElement>("[data-media]")!;
      const poster = posterRef.current;
      const video = videoRef.current;

      if (reduced) {
        gsap.set(
          [back, front, torre, ...meta, subtitle, ...ctas, scrollCue],
          { opacity: 1, y: 0, clipPath: "inset(0%)" },
        );
        if (poster) gsap.set(poster, { opacity: 1, scale: 1 });
        if (video) gsap.set(video, { opacity: 0 });
        return;
      }

      // === Media full-bleed: foto (poster) → video con crossfade ===
      if (poster) {
        gsap.fromTo(
          poster,
          { scale: 1.04 },
          { scale: 1.0, duration: 1.5, ease: "power3.out" },
        );
      }
      if (video) {
        gsap.set(video, { opacity: 0, scale: 1.02, transformOrigin: "center center" });
        gsap.delayedCall(1.5, () => {
          video.play().catch(() => {
            /* autoplay bloccato: resta la foto */
          });
        });
        gsap.to(video, { opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.6 });
        gsap.to(video, { scale: 1.0, duration: 1.6, ease: "power3.out", delay: 1.6 });
        // Ken Burns continuo sul video
        gsap.to(video, {
          scale: 1.05,
          duration: 16,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 3.5,
        });
      }

      // Split "ABBONDANZA" per lettere (back e front sincronizzati)
      const splitBack = new SplitText(back, { type: "chars" });
      const splitFront = new SplitText(front, { type: "chars" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.set([splitBack.chars, splitFront.chars], { yPercent: 110 }, 0)
        .to(splitBack.chars, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.5)
        .to(splitFront.chars, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.9)
        .fromTo(
          torre,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
          1.0,
        );

      tl.fromTo(
          meta,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          1.2,
        )
        .fromTo(
          subtitle,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.4,
        )
        // t=1.6 CTA — quasi simultanee per non gerarchizzare (equità)
        .fromTo(
          ctas,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "back.out(1.4)" },
          1.6,
        )
        .fromTo(
          scrollCue,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.9,
        );

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap
          .timeline()
          .to(media, { yPercent: 12, ease: "none" }, 0)
          .to(back, { y: -40, ease: "none" }, 0)
          .to(front, { y: -120, ease: "none" }, 0)
          .to(torre, { yPercent: -25, opacity: 0, ease: "none" }, 0)
          .to(meta, { yPercent: -30, opacity: 0, ease: "none" }, 0)
          .to(subtitle, { opacity: 0, ease: "none" }, 0)
          .to(ctas, { opacity: 0, ease: "none" }, 0),
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "12% top",
        scrub: true,
        animation: gsap
          .timeline()
          .to("[data-marquee]", { opacity: 0, y: 20, ease: "none" }, 0)
          .to(scrollCue, { opacity: 0, ease: "none" }, 0),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden bg-ivory text-ink"
      style={{ height: "100svh", minHeight: "640px" }}
      aria-label="Masseria Torre Abbondanza — la soglia delle due anime"
    >
      {/* === Layer 0 (z-0): MEDIA FULL-BLEED — foto → video === */}
      {/* MEDIA REALE DEL CLIENTE: ripresa cinematografica full-screen che inquadra
          insieme la masseria del '700 e i cavalli Murgesi nella Murgia all'ora dorata.
          Foto come poster + video mp4/webm muto in loop. */}
      <div data-media className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={posterRef}
          src={sogliaImg}
          alt="La masseria del Settecento e i cavalli Murgesi insieme nella campagna della Murgia all'ora dorata."
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        <video
          ref={videoRef}
          src={sogliaVideoAsset.url}
          poster={sogliaImg}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ opacity: 0 }}
        />
      </div>

      {/* === Layer 1 (z-[1]): Overlay caldo per leggibilità === */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 45%, transparent 0%, transparent 38%, rgba(247,243,236,0.18) 70%, rgba(247,243,236,0.35) 100%)",
        }}
      />
      {/* Protezione alto-sinistra (TORRE + metadati) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, rgba(247,243,236,0.55) 0%, rgba(247,243,236,0.25) 22%, transparent 45%)",
        }}
      />
      {/* Protezione basso-sinistra (sottotitolo + CTA + marquee) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(20deg, rgba(247,243,236,0.62) 0%, rgba(247,243,236,0.32) 28%, transparent 55%)",
        }}
      />
      {/* Vignettatura calda + grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(140% 100% at 50% 50%, transparent 55%, color-mix(in oklab, var(--ink) 18%, transparent) 100%)",
        }}
      />
      <div className="grain-overlay z-[2]" />

      <h1 className="sr-only">
        Torre Abbondanza — Masseria del XVIII secolo a Noci, Puglia: ristorante, cerimonie e allevamento di cavalli Murgesi
      </h1>

      {/* === Metadati editoriali === */}
      <div
        data-meta
        className="absolute left-6 top-6 z-40 flex items-center gap-3 md:left-10 md:top-8"
      >
        <span className="block h-px w-10 bg-terracotta" />
        <span className="text-eyebrow text-terracotta italic" style={{ fontStyle: "italic" }}>
          Masseria
        </span>
      </div>
      <div
        data-meta
        className="absolute right-6 top-6 z-40 text-eyebrow text-ink/70 md:right-10 md:top-8"
      >
        40.72° N — 17.13° E
      </div>

      {/* === Layer 10: ABBONDANZA back — watermark sopra il video === */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-3 md:bottom-[18%] bottom-[6%]"
      >
        <span
          data-abbondanza-back
          className="block max-w-full font-display font-bold leading-[0.85] text-ink/20 whitespace-nowrap select-none text-center"
          style={{
            fontSize: "clamp(1.6rem, 8.6vw, 15rem)",
            letterSpacing: "-0.04em",
          }}
        >
          ABBONDANZA
        </span>
      </div>

      {/* === Layer 30: ABBONDANZA accento terracotta — sopra il watermark === */}
      <div
        className="pointer-events-none absolute inset-x-0 z-30 flex justify-center px-3 md:bottom-[18%] bottom-[6%]"
      >
        <span
          data-abbondanza-front
          aria-hidden
          className="block max-w-full font-display font-bold leading-[0.85] text-terracotta whitespace-nowrap select-none text-center"
          style={{
            fontSize: "clamp(1.6rem, 8.6vw, 15rem)",
            letterSpacing: "-0.04em",
            mixBlendMode: "normal",
          }}
        >
          ABBONDANZA
        </span>
      </div>

      {/* === Layer 5 (z-30): TORRE verticale a sinistra === */}
      <div
        data-torre
        className="absolute left-6 z-30 hidden md:block"
        style={{ top: "14%", height: "62%" }}
      >
        <VerticalWord
          className=""
          children="TORRE"
        />
      </div>

      {/* Etichette luogo · epoca · allevamento: in alto, sopra il dittico */}
      <div
        data-meta
        className="absolute left-0 right-0 z-40 hidden md:flex justify-center gap-6 text-eyebrow text-ink/70"
        style={{ top: "6%" }}
      >
        <span>Noci · Puglia</span>
        <span className="text-ink/40">·</span>
        <span className="text-ink/50">Est. XVIII sec.</span>
        <span className="text-ink/40">·</span>
        <span style={{ color: "var(--murgese)" }}>Allevamento Murgese</span>
      </div>

      {/* TORRE kicker + meta su mobile */}
      <div
        className="absolute left-6 right-6 z-30 md:hidden"
        style={{ top: "7%" }}
      >
        <span
          data-torre
          className="block font-display font-semibold text-ink"
          style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          TORRE
        </span>
        <div data-meta className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-eyebrow text-ink/60">
          <span>Noci · Puglia</span>
          <span>·</span>
          <span>Est. XVIII sec.</span>
          <span>·</span>
          <span style={{ color: "var(--murgese)" }}>Allevamento Murgese</span>
        </div>
      </div>

      {/* === Sottotitolo + CTA (equità: due pill di pari peso + link terziario) === */}
      <div
        className="absolute left-6 right-6 z-40 flex flex-col gap-5 md:gap-6 md:left-24 md:right-auto md:max-w-[560px] bottom-[14%] md:bottom-[8%]"
      >
        <p
          data-subtitle
          className="font-sans text-base md:text-lg leading-relaxed text-ink/85"
        >
          Due anime, una masseria del Settecento: la cucina di Puglia per eventi
          e cerimonie e l'antica arte dei cavalli Murgesi, nel cuore della Murgia.
        </p>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div data-cta className="w-full sm:w-auto">
            <MagneticButton
              variant="pill-solid"
              href="#eventi"
              ariaLabel="Tavola, eventi e cerimonie"
              className="w-full sm:w-auto justify-center"
            >
              Tavola &amp; Cerimonie
            </MagneticButton>
          </div>
          <div data-cta className="w-full sm:w-auto">
            <MagneticButton
              variant="pill-murgese"
              href="#cavalli"
              ariaLabel="Allevamento e attività con i cavalli Murgesi"
              className="w-full sm:w-auto justify-center"
            >
              I Cavalli Murgesi
            </MagneticButton>
          </div>
        </div>
        <div className="-mt-1">
          <div data-cta>
            <MagneticButton variant="link" href="#prenota" ariaLabel="Prenota un tavolo">
              Prenota un tavolo
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        data-scroll-cue
        className="absolute right-6 z-50 hidden flex-col items-center gap-3 md:flex"
        style={{ bottom: "13%" }}
      >
        <span
          className="text-eyebrow text-ink/60"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Scorri
        </span>
        <span
          aria-hidden
          className="block h-12 w-px origin-top animate-[scrollLine_2.2s_ease-in-out_infinite] bg-ink/40"
        />
      </div>

      <div
        data-marquee
        className="absolute inset-x-0 bottom-0 z-50 bg-ivory/70 backdrop-blur-[2px]"
      >
        <KineticMarquee items={MARQUEE_ITEMS} />
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}
