import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { ScrollIndicator } from "./ScrollIndicator";
import heroImg from "@/assets/hero-masseria.jpg";

/* Split del titolo in parole per mask reveal */
function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="word-mask mr-[0.25em] last:mr-0">
          <span className="word-inner">{w}</span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        // Reduced motion: tutto già visibile con fade rapido
        gsap.set(".word-inner", { y: 0 });
        gsap.set(darkRef.current, { autoAlpha: 0 });
        gsap.from(
          [".hero-label", ".hero-eyebrow", ".hero-title", ".hero-sub", ".hero-cta", scrollRef.current],
          { opacity: 0, duration: 0.3, stagger: 0.05, ease: "power1.out" },
        );
        return;
      }

      // ============== INTRO TIMELINE ==============
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(darkRef.current, { autoAlpha: 0, duration: 1.0 }, 0)
        .from(mediaRef.current, { scale: 1.08, duration: 1.6, ease: "power2.out" }, 0.3)
        .from(
          ".hero-label-line",
          { scaleX: 0, transformOrigin: "left center", duration: 0.8 },
          0.5,
        )
        .from(
          ".hero-label-text",
          { y: 12, opacity: 0, duration: 0.7 },
          0.55,
        )
        .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.6 }, 0.7)
        .to(
          ".word-inner",
          { y: 0, duration: 0.9, stagger: 0.08, ease: "power4.out" },
          0.8,
        )
        .from(".hero-sub", { y: 16, opacity: 0, duration: 0.8 }, 1.4)
        .from(
          ".hero-cta",
          { y: 14, opacity: 0, duration: 0.7, stagger: 0.12, ease: "back.out(1.4)" },
          1.7,
        )
        .from(scrollRef.current, { opacity: 0, duration: 0.6 }, 2.0);

      // ============== KEN BURNS LOOP ==============
      gsap.to(mediaRef.current, {
        scale: 1.06,
        x: 8,
        y: -6,
        duration: 12,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      // ============== PARALLAX SCROLL ==============
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap
          .timeline()
          .to(mediaRef.current, { yPercent: 15, ease: "none" }, 0)
          .to(textRef.current, { y: -80, opacity: 0, ease: "none" }, 0)
          .to(overlayRef.current, { opacity: 0.75, ease: "none" }, 0),
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "10% top",
        scrub: true,
        animation: gsap.to(scrollRef.current, { opacity: 0, ease: "none" }),
      });

      return () => st.kill();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Masseria Torre Abbondanza"
      className="relative w-full overflow-hidden bg-ink"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Z-0: media background (immagine; sostituibile con <video>) */}
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        {/*
          SOSTITUIRE src con video/immagine reale del cliente:
          <video className="h-full w-full object-cover"
                 autoPlay muted loop playsInline
                 poster={heroImg} src="..." />
        */}
        <img
          src={heroImg}
          alt="Facciata in pietra calcarea della Masseria Torre Abbondanza al tramonto, con ulivi secolari in primo piano"
          className="h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1280}
        />
      </div>

      {/* Z-10: overlay gradiente + grain */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--ink) 60%, transparent) 0%, color-mix(in oklab, var(--ink) 30%, transparent) 35%, transparent 70%)",
          opacity: 1,
        }}
        aria-hidden
      />
      <div className="grain-overlay z-10" aria-hidden />

      {/* Dark veil iniziale per il reveal */}
      <div
        ref={darkRef}
        className="absolute inset-0 z-30 bg-ink"
        aria-hidden
      />

      {/* Z-20: contenuto */}
      <div className="relative z-20 flex h-full w-full flex-col">
        {/* Etichetta superiore */}
        <header className="hero-label flex items-center gap-4 px-6 pt-8 sm:px-12 sm:pt-10 lg:px-20">
          <span className="hero-label-line block h-px w-12 bg-ivory/60 sm:w-20" />
          <span className="hero-label-text text-eyebrow text-ivory/85">
            Noci · Puglia — Dal XVIII secolo
          </span>
        </header>

        {/* Blocco titolo */}
        <div
          ref={textRef}
          className="flex flex-1 items-center px-6 pb-32 sm:px-12 sm:pb-36 lg:px-20"
        >
          <div className="max-w-[42rem] will-change-transform">
            <p
              className="hero-eyebrow font-display italic text-terracotta"
              style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)" }}
            >
              Masseria
            </p>

            <h1
              className="hero-title mt-3 font-display font-semibold leading-[0.95] text-ivory"
              style={{
                fontSize: "clamp(2.75rem, 9vw, 7.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              <SplitWords text="Torre" className="block" />
              <SplitWords text="Abbondanza" className="block text-stone" />
            </h1>

            <p
              className="hero-sub mt-7 max-w-[40rem] font-sans text-ivory/85"
              style={{
                fontSize: "clamp(1rem, 1.35vw, 1.18rem)",
                lineHeight: 1.55,
              }}
            >
              Nel cuore della Murgia, dove la pietra racconta tre secoli e ogni
              tavola diventa una festa.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="hero-cta">
                <MagneticButton
                  variant="primary"
                  href="#prenota"
                  ariaLabel="Prenota un tavolo al ristorante"
                  className="w-full sm:w-auto"
                >
                  Prenota un tavolo
                </MagneticButton>
              </div>
              <div className="hero-cta">
                <MagneticButton
                  variant="secondary"
                  href="#eventi"
                  ariaLabel="Scopri eventi e matrimoni"
                  className="w-full sm:w-auto"
                >
                  Eventi &amp; Matrimoni
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 sm:bottom-10"
        >
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
