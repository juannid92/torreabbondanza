import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ArchFrameProps {
  src: string;
  alt: string;
  videoSrc?: string;
}

/**
 * Finestra ad arco a tutto sesto:
 * lati verticali dritti + sommità semicircolare.
 * Ottenuta con border-radius asimmetrico (ellisse top adattata a box ~3:4).
 * Intro: la soglia "si apre" dal basso verso l'alto (clip-path inset animato).
 */
export function ArchFrame({ src, alt, videoSrc }: ArchFrameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLImageElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // border-radius: orizzontale 50% (semicerchio sui lati),
  // verticale 38% (≈ width/2 di un box 3:4) → arco a tutto sesto coerente.
  const archRadius = "50% 50% 0 0 / 38% 38% 0 0";

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(revealRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(innerRef.current, { scale: 1, opacity: 1 });
        // niente autoplay video, mostra solo il poster (foto statica)
        if (videoRef.current) {
          gsap.set(videoRef.current, { opacity: 0 });
        }
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

      // Ken Burns loop sulla foto (poster) — leggero
      gsap.to(innerRef.current, {
        scale: 1.04,
        x: 6,
        y: -4,
        duration: 3.0,
        ease: "sine.inOut",
        delay: 1.8,
      });

      // Foto → video: dopo ~1.6s avvia il video e crossfade morbido
      if (videoRef.current) {
        const v = videoRef.current;
        gsap.set(v, { opacity: 0, scale: 1.02, transformOrigin: "center center" });
        const play = () => {
          v.play().catch(() => {
            /* autoplay potrebbe essere bloccato: resta la foto */
          });
        };
        gsap.delayedCall(1.5, play);
        gsap.to(v, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.6,
        });
        gsap.to(v, {
          scale: 1.0,
          duration: 1.6,
          ease: "power3.out",
          delay: 1.6,
        });
        // Ken Burns continuo sul video (coerente con il vecchio)
        gsap.to(v, {
          scale: 1.05,
          duration: 16,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 3.5,
        });
      }

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
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, wrapRef);

    return () => ctx.revert();
  }, [videoSrc]);

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
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={src}
            muted
            loop
            playsInline
            preload="auto"
            aria-label={alt}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            style={{ opacity: 0 }}
          />
        )}
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
