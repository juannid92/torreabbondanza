import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ArchFrameProps {
  src: string;
  alt: string;
}

/**
 * Finestra ad arco a tutto sesto (rettangolo verticale + arco in cima).
 * - clip-path SVG referenziato via url(#archMask)
 * - intro: l'arco "si disegna" rivelandosi dal basso verso l'alto
 * - loop: micro Ken Burns dell'immagine interna
 * - parallax: l'immagine si muove in direzione opposta al frame allo scroll
 */
export function ArchFrame({ src, alt }: ArchFrameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLImageElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(revealRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(innerRef.current, { scale: 1, opacity: 1 });
        return;
      }

      // Intro: clip-path inset si apre dal basso (la "soglia" si apre)
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

      // Immagine: scale-in
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

      // Parallax: frame sale, immagine interna scende (depth)
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
      {/* SVG mask con arco a tutto sesto */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="archMask" clipPathUnits="objectBoundingBox">
            {/* Rettangolo verticale 3:4, parte alta arco semicircolare */}
            <path d="M 0,0.5 A 0.5,0.5 0 0 1 1,0.5 L 1,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={revealRef}
        className="relative h-full w-full will-change-[clip-path]"
        style={{ clipPath: "url(#archMask)" }}
      >
        {/* Filetto doppio interno: ottenuto con due bordi/box-shadow su un overlay */}
        <img
          ref={innerRef}
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        {/* Velatura calda per integrazione cromatica */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--ink) 8%, transparent) 0%, transparent 30%, color-mix(in oklab, var(--ink) 22%, transparent) 100%)",
          }}
        />
        {/* Doppio filetto interno (dettaglio editoriale) */}
        <div
          aria-hidden
          className="absolute inset-3 pointer-events-none"
          style={{
            border: "1px solid color-mix(in oklab, var(--ivory) 35%, transparent)",
            clipPath: "url(#archMask)",
          }}
        />
        {/* Sostituire con media reale del cliente:
            <video autoPlay muted playsInline loop poster={src}
              className="absolute inset-0 h-full w-full object-cover">
              <source src="/media/masseria.mp4" type="video/mp4" />
            </video>
        */}
      </div>
      {/* Ombra calda esterna (segue la forma) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "url(#archMask)",
          boxShadow: "0 60px 120px -40px color-mix(in oklab, var(--ink) 55%, transparent)",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
