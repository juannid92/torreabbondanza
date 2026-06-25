import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/lib/split-text";
import { ArchFrame } from "./ArchFrame";
import { KineticMarquee } from "./KineticMarquee";
import { VerticalWord } from "./VerticalWord";
import { MagneticButton } from "./MagneticButton";
import heroImg from "@/assets/hero-masseria.jpg";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "RISTORANTE",
  "RICEVIMENTI",
  "MATRIMONI",
  "MASSERIA DEL '700",
  "CUCINA PUGLIESE",
  "MURGIA · NOCI",
];

/**
 * Hero "La Soglia" — composizione editoriale a griglia spezzata.
 * - Arco asimmetrico a destra contiene il media.
 * - "ABBONDANZA" stratificata su 2 piani (dietro + frammento davanti).
 * - "TORRE" verticale a sinistra.
 * - Parallax depth allo scroll, marquee kinetico in fondo.
 */
export function HeroSoglia() {
  const root = useRef<HTMLElement>(null);

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

      if (reduced) {
        gsap.set(
          [back, front, torre, ...meta, subtitle, ...ctas, scrollCue],
          { opacity: 1, y: 0, clipPath: "inset(0%)" },
        );
        return;
      }

      // Split "ABBONDANZA" per lettere (back e front sincronizzati)
      const splitBack = new SplitText(back, { type: "chars" });
      const splitFront = new SplitText(front, { type: "chars" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // t=0.5 ABBONDANZA back (mask reveal lettera-per-lettera)
      tl.set([splitBack.chars, splitFront.chars], { yPercent: 110 }, 0)
        .to(splitBack.chars, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.5)
        // t=0.9 frammento front sincronizzato (stesso movimento)
        .to(splitFront.chars, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.9)
        // t=1.0 TORRE verticale: clip-reveal dall'alto verso il basso
        .fromTo(
          torre,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
          1.0,
        )
        // t=1.2 metadati + filetti
        .fromTo(
          meta,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          1.2,
        )
        // t=1.4 sottotitolo
        .fromTo(
          subtitle,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.4,
        )
        // t=1.6 CTA (back.out)
        .fromTo(
          ctas,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "back.out(1.4)" },
          1.6,
        )
        // t=1.9 scroll cue
        .fromTo(
          scrollCue,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.9,
        );

      // Parallax depth
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap
          .timeline()
          .to(back, { yPercent: -5, ease: "none" }, 0)
          .to(front, { yPercent: -18, ease: "none" }, 0)
          .to(torre, { yPercent: -25, opacity: 0, ease: "none" }, 0)
          .to(meta, { yPercent: -30, opacity: 0, ease: "none" }, 0),
      });

      // Marquee + scroll cue fade-out rapido nei primi 12%
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
      aria-label="Masseria Torre Abbondanza — apertura"
    >
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* H1 semantico per SEO/a11y, visualmente nascosto */}
      <h1 className="sr-only">Torre Abbondanza — Masseria del XVIII secolo, Noci, Puglia</h1>

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

      {/* === Layer 1: ABBONDANZA back (watermark dietro l'arco) === */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-start top-[62%] md:top-[38%]"
        style={{ transform: "translateY(-50%)" }}
      >
        <span
          data-abbondanza-back
          className="block font-display font-bold leading-[0.85] text-ink/[0.12] whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(3.2rem, 18vw, 16rem)",
            marginLeft: "-3vw",
            letterSpacing: "-0.04em",
          }}
        >
          ABBONDANZA
        </span>
      </div>


      {/* === Layer 2: Arch frame === */}
      <div
        className="absolute z-20 left-1/2 top-[6%] h-[48vh] w-[68vw] -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[6%] md:top-[8%] md:h-[min(74vh,720px)] md:w-[min(46vw,540px)]"
      >
        <ArchFrame
          src={heroImg}
          alt="La facciata in pietra della Masseria Torre Abbondanza al tramonto dorato, con archi storici e ulivi della Murgia."
        />
      </div>


      {/* === Layer 3: ABBONDANZA front (frammento terracotta, davanti all'arco) — solo desktop === */}
      <div
        className="pointer-events-none absolute inset-x-0 z-30 hidden md:flex justify-start"
        style={{
          top: "38%",
          transform: "translateY(-50%)",
          clipPath: "polygon(48% 0, 62% 0, 62% 100%, 48% 100%)",
        }}
      >
        <span
          data-abbondanza-front
          aria-hidden
          className="block font-display font-bold leading-[0.85] text-terracotta whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(4rem, 18vw, 16rem)",
            marginLeft: "-3vw",
            letterSpacing: "-0.04em",
          }}
        >
          ABBONDANZA
        </span>
      </div>


      {/* === Layer 4: TORRE verticale a sinistra === */}
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
      <div
        data-meta
        className="absolute left-6 z-40 hidden md:flex flex-col gap-1 text-eyebrow text-ink/70"
        style={{ top: "78%" }}
      >
        <span>Noci · Puglia</span>
        <span className="text-ink/50">Est. XVIII sec.</span>
      </div>

      {/* TORRE kicker orizzontale su mobile */}
      <div
        className="absolute left-6 right-6 z-30 md:hidden"
        style={{ top: "12%" }}
      >
        <span
          data-torre
          className="block font-display font-semibold text-ink"
          style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)", letterSpacing: "-0.02em" }}
        >
          TORRE
        </span>
      </div>

      {/* === Sottotitolo + CTA === */}
      <div
        className="absolute left-6 right-6 z-40 flex flex-col gap-7 md:left-24 md:right-auto md:max-w-[520px]"
        style={{ bottom: "13%" }}
      >
        <p
          data-subtitle
          className="font-sans text-base md:text-lg leading-relaxed text-ink/85"
        >
          Tre secoli di pietra, terra e ospitalità. Ristorante, ricevimenti e
          matrimoni nel cuore della Murgia.
        </p>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div data-cta>
            <MagneticButton variant="link" href="#prenota" ariaLabel="Prenota un tavolo">
              Prenota un tavolo
            </MagneticButton>
          </div>
          <div data-cta>
            <MagneticButton variant="pill" href="#eventi" ariaLabel="Eventi e matrimoni">
              Eventi & Matrimoni
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* === Scroll cue (basso destra) === */}
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

      {/* === Marquee in fondo === */}
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
