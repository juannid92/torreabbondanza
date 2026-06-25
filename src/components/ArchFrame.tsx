import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ArchFrameProps {
  src: string;
  alt: string;
}

/**
 * Finestra ad arco a tutto sesto:
 * lati verticali dritti + sommità semicircolare.
 * Ottenuta con border-radius asimmetrico (ellisse top adattata a box ~3:4).
 * Intro: la soglia "si apre" dal basso verso l'alto (clip-path inset animato).
 */
export function ArchFrame({ src, alt }: ArchFrameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLImageElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // border-radius: orizzontale 50% (semicerchio sui lati),
  // verticale 38% (≈ width/2 di un box 3:4) → arco a tutto sesto coerente.
  const archRadius = "50% 50% 0 0 / 38% 38% 0 0";

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(revealRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(innerRef.current, { scale: 1, opacity: 1 });
        return;
      }

      // Intro: la soglia si disegna dal basso verso l'alto
      gsap.fromTo(
        revealRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.inOut",
          delay: 0.1,
        },
      );

      gsap.fromTo(
        innerRef.current,
        { scale: 1.12 },
        { scale: 1, duration: 1.6, ease: "power3.out", delay: 0.1 },
      );

      // Ken Burns loop
      gsap.to(innerRef.current, {
        scale: 1.05,
        x: 6,
        y: -4,
        duration: 14,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      });

      // Parallax depth
      gsap.to(wrapRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(innerRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      {/* Ombra calda esterna che segue la forma dell'arco */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          borderRadius: archRadius,
          boxShadow:
            "0 60px 120px -30px color-mix(in oklab, var(--ink) 55%, transparent), 0 20px 40px -20px color-mix(in oklab, var(--ink) 35%, transparent)",
        }}
      />

      {/* Reveal wrapper (animato in intro con clip-path inset) */}
      <div
        ref={revealRef}
        className="relative h-full w-full overflow-hidden will-change-[clip-path]"
        style={{
          borderRadius: archRadius,
          // Bordo pietra che segue il profilo dell'arco
          boxShadow:
            "inset 0 0 0 1.5px #E7DDCF, inset 0 0 0 4px color-mix(in oklab, #E7DDCF 35%, transparent)",
        }}
      >
        <img
          ref={innerRef}
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        {/* Velatura calda */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--ink) 8%, transparent) 0%, transparent 30%, color-mix(in oklab, var(--ink) 28%, transparent) 100%)",
          }}
        />
        {/* Doppio filetto interno editoriale */}
        <div
          aria-hidden
          className="absolute inset-3 pointer-events-none"
          style={{
            border: "1px solid color-mix(in oklab, #E7DDCF 45%, transparent)",
            borderRadius: archRadius,
          }}
        />
      </div>
    </div>
  );
}
