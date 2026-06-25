import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import openerImg from "@/assets/events-opener.jpg";

/**
 * Opener cinematografico full-bleed con ken burns lento + parallax + reveal frase.
 */
export function CinematicOpener() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-opener-word]");
      const meta = root.querySelectorAll<HTMLElement>("[data-opener-meta]");

      gsap.set(words, { yPercent: 110 });
      gsap.set(meta, { opacity: 0, y: 14 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(meta, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          });
          gsap.to(words, {
            yPercent: 0,
            duration: reduced ? 0.2 : 1.1,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.1,
            delay: 0.15,
          });
        },
      });

      if (reduced) return;

      // Ken burns
      const img = root.querySelector<HTMLElement>("[data-opener-image]");
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.0, xPercent: 0 },
          {
            scale: 1.08,
            xPercent: -2,
            duration: 18,
            ease: "none",
            repeat: -1,
            yoyo: true,
          },
        );
        gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const phrase = "Le feste della vita meritano un luogo che le ricordi.".split(" ");
  // Parole-accento in corsivo terracotta
  const accentSet = new Set(["feste", "ricordi."]);

  return (
    <div
      ref={rootRef}
      className="relative isolate flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden"
    >
      <img
        data-opener-image
        src={openerImg}
        alt="Tavolata di matrimonio all'ora dorata sotto un grande ulivo nella masseria"
        width={1920}
        height={1280}
        loading="eager"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ willChange: "transform" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--ink) 18%, transparent) 0%, transparent 35%, color-mix(in oklab, var(--ink) 55%, transparent) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 md:px-12 md:pb-24">
        <p data-opener-meta className="text-eyebrow text-ivory/80">
          06 — Eventi & Matrimoni
        </p>

        <h2
          aria-label="Le feste della vita meritano un luogo che le ricordi."
          className="mt-6 font-display font-semibold leading-[1.02] text-ivory"
          style={{
            fontSize: "clamp(2.4rem, 6.8vw, 6rem)",
            letterSpacing: "-0.025em",
            maxWidth: "20ch",
          }}
        >
          {phrase.map((w, i) => {
            const isAccent = accentSet.has(w);
            return (
              <span
                key={i}
                aria-hidden
                className="inline-block overflow-hidden align-top"
                style={{ paddingBottom: "0.14em" }}
              >
                <span
                  data-opener-word
                  className={`inline-block ${isAccent ? "italic text-terracotta" : ""}`}
                  style={{ willChange: "transform" }}
                >
                  {w}
                  {i < phrase.length - 1 ? "\u00A0" : ""}
                </span>
              </span>
            );
          })}
        </h2>

        <div
          data-opener-meta
          className="mt-10 flex items-center gap-3 text-eyebrow text-ivory/70"
        >
          <span aria-hidden className="block h-px w-10 bg-ivory/60" />
          scorri per scoprire
        </div>
      </div>
    </div>
  );
}
