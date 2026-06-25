import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PathPanelProps {
  index: number;
  eyebrow: string;
  title: string;
  phrase: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  isDimmed: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export function PathPanel({
  index,
  eyebrow,
  title,
  phrase,
  bullets,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  isDimmed,
  onFocus,
  onBlur,
}: PathPanelProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const frame = root.querySelector<HTMLElement>("[data-arch-frame]");
      const reveals = root.querySelectorAll<HTMLElement>("[data-panel-reveal]");

      gsap.set(reveals, { opacity: 0, y: 24 });
      if (frame) gsap.set(frame, { clipPath: "inset(100% 0 0 0)" });

      ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (frame) {
            gsap.to(frame, {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.1,
              ease: "power3.inOut",
              delay: index * 0.15,
            });
          }
          gsap.to(reveals, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.25 + index * 0.15,
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [index]);

  return (
    <motion.article
      ref={rootRef}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocusCapture={onFocus}
      onBlurCapture={onBlur}
      animate={{
        opacity: isDimmed ? 0.55 : 1,
        filter: isDimmed ? "blur(1.5px)" : "blur(0px)",
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-8"
    >
      {/* Arch image */}
      <div
        data-arch-frame
        className="relative overflow-hidden bg-stone shadow-soft"
        style={{
          borderRadius: "50% 50% 0 0 / 38% 38% 0 0",
          border: "1px solid var(--stone)",
          boxShadow:
            "0 30px 80px -40px color-mix(in oklab, var(--ink) 45%, transparent)",
          aspectRatio: "3 / 4",
          willChange: "clip-path",
        }}
      >
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          width={1024}
          height={1366}
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ scale: isDimmed ? 1 : 1.04 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 60%, color-mix(in oklab, var(--ink) 35%, transparent))",
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-5">
        <span data-panel-reveal className="text-eyebrow text-ink/65">
          {eyebrow}
        </span>
        <h3
          data-panel-reveal
          className="font-display font-semibold leading-[1.05] text-ink"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>
        <p
          data-panel-reveal
          className="max-w-md font-display text-lg italic leading-snug text-ink/75 md:text-xl"
        >
          {phrase}
        </p>
        <ul data-panel-reveal className="flex flex-col gap-2 text-base text-ink/75">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-2 inline-block h-px w-4 flex-shrink-0 bg-terracotta"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <a
          data-panel-reveal
          href={ctaHref}
          className="text-eyebrow group/cta mt-3 inline-flex w-fit items-center gap-3 border-b border-ink pb-1 text-ink transition-colors hover:text-terracotta hover:border-terracotta focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          {ctaLabel}
          <svg
            width="18"
            height="10"
            viewBox="0 0 18 10"
            fill="none"
            className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1.5"
          >
            <path
              d="M1 5h15M12 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}

// Hook helper for focus management (avoid prop drilling in section)
export function useFocusedPath(): [number | null, (i: number | null) => void] {
  return useState<number | null>(null);
}
