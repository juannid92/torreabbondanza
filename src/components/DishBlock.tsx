import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CourseLabel } from "./CourseLabel";

interface DishBlockProps {
  numeral: string;
  course: string;
  oversizedWord: string;
  description: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  align: "left" | "right";
}

/**
 * Blocco portata: parola oversized + immagine bleed in parallax + descrizione.
 * Alternanza sx/dx tramite prop `align`.
 */
export function DishBlock({
  numeral,
  course,
  oversizedWord,
  description,
  caption,
  imageSrc,
  imageAlt,
  align,
}: DishBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const word = root.querySelector<HTMLElement>("[data-oversized] [data-inner]");
      const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
      const image = root.querySelector<HTMLElement>("[data-dish-image]");
      const frame = root.querySelector<HTMLElement>("[data-dish-frame]");
      const meta = root.querySelectorAll<HTMLElement>("[data-meta]");

      // Letters mask reveal
      gsap.set(letters, { yPercent: 110 });
      gsap.set(meta, { opacity: 0, y: 24 });
      gsap.set(word, { color: "var(--ink)" });

      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(letters, {
            yPercent: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.04,
          });
          gsap.to(word, {
            color: "var(--terracotta)",
            duration: 1.2,
            delay: 0.3,
            ease: "power2.out",
          });
          gsap.to(meta, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.2,
          });
        },
      });

      // Image reveal mask
      if (frame && image) {
        gsap.set(frame, { clipPath: "inset(100% 0 0 0)" });
        ScrollTrigger.create({
          trigger: frame,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(frame, {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.1,
              ease: "power3.inOut",
            });
          },
        });
        // Parallax interno
        gsap.to(image, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const isLeft = align === "left";
  const letters = oversizedWord.split("");

  return (
    <div
      ref={rootRef}
      className="relative grid grid-cols-1 gap-10 py-20 md:grid-cols-12 md:gap-8 md:py-32"
    >
      {/* Image */}
      <div
        data-dish-frame
        className={`relative overflow-hidden rounded-sm shadow-soft md:row-start-1 ${
          isLeft
            ? "md:col-start-1 md:col-end-8"
            : "md:col-start-6 md:col-end-13"
        }`}
        style={{ aspectRatio: "4 / 3", willChange: "clip-path" }}
      >
        <img
          data-dish-image
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          width={1024}
          height={768}
          className="absolute inset-0 h-[118%] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
          style={{ top: "-9%", willChange: "transform" }}
        />
        {/* Hover caption */}
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-sm bg-ivory/90 px-3 py-1.5 text-eyebrow text-ink opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 md:bottom-6 md:left-6">
          {caption}
        </div>
      </div>

      {/* Text column */}
      <div
        className={`relative flex flex-col gap-6 md:row-start-1 md:self-center ${
          isLeft
            ? "md:col-start-8 md:col-end-13 md:pl-4 md:text-left"
            : "md:col-start-1 md:col-end-6 md:pr-4 md:text-left"
        }`}
      >
        <div data-meta>
          <CourseLabel numeral={numeral} label={course} />
        </div>

        <h3
          data-oversized
          aria-label={oversizedWord}
          className="font-display font-semibold leading-[0.9] text-ink"
          style={{
            fontSize: "clamp(3rem, 9vw, 7rem)",
            letterSpacing: "-0.03em",
          }}
        >
          <span data-inner className="inline-block">
            {letters.map((ch, i) => (
              <span
                key={i}
                aria-hidden
                className="inline-block overflow-hidden align-top"
                style={{ paddingBottom: "0.12em" }}
              >
                <span data-letter className="inline-block" style={{ willChange: "transform" }}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              </span>
            ))}
          </span>
        </h3>

        <p
          data-meta
          className="max-w-md font-sans text-base leading-relaxed text-ink/80 md:text-lg"
        >
          {description}
        </p>

        <p
          data-meta
          className="font-display text-sm italic text-ink/55"
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
