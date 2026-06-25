import { useEffect, useRef } from "react";
import gsap from "gsap";

interface KineticMarqueeProps {
  items: string[];
  separator?: string;
  /** Secondi per un ciclo completo. Default 40. */
  duration?: number;
}

/**
 * Striscia kinetica infinita. Due copie identiche affiancate,
 * GSAP anima xPercent da 0 a -50 in loop lineare.
 */
export function KineticMarquee({ items, separator = "✦", duration = 40 }: KineticMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });
    }, trackRef);
    return () => ctx.revert();
  }, [duration]);

  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((label) => (
        <span key={label} className="inline-flex items-center gap-10">
          <span className="text-eyebrow text-ink/80">{label}</span>
          <span aria-hidden className="text-terracotta text-base">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full overflow-hidden border-y border-ink/15 py-4"
      aria-hidden
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row}
        {row}
      </div>
    </div>
  );
}
