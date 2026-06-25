import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Mappa line-art in stile taccuino: Noci ↔ Massafra lungo la SP 211.
 * Segnaposto ad arco (callback identitario) sulla masseria.
 */
export function StylizedMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const markerRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = svg.querySelectorAll<SVGPathElement>("[data-draw]");

    if (reduced) {
      paths.forEach((p) => {
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
      });
      if (markerRef.current) gsap.set(markerRef.current, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: {
          trigger: svg,
          start: "top 80%",
          end: "bottom 50%",
          scrub: true,
        },
      });

      if (markerRef.current) {
        gsap.fromTo(
          markerRef.current,
          { opacity: 0, scale: 0.4, transformOrigin: "50% 100%" },
          {
            opacity: 1,
            scale: 1,
            ease: "back.out(2)",
            duration: 0.8,
            scrollTrigger: {
              trigger: svg,
              start: "top 50%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 420"
      className="h-auto w-full"
      role="img"
      aria-label="Mappa stilizzata tra Noci e Massafra lungo la SP 211"
    >
      {/* Bordo taccuino */}
      <rect
        x="6"
        y="6"
        width="588"
        height="408"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 30%, transparent)"
        strokeWidth="0.6"
        strokeDasharray="3 4"
      />

      {/* Reticolo leggero */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`gx-${i}`}
          x1={120 * (i + 1)}
          y1="6"
          x2={120 * (i + 1)}
          y2="414"
          stroke="color-mix(in oklab, var(--ink) 8%, transparent)"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <line
          key={`gy-${i}`}
          x1="6"
          y1={105 * (i + 1)}
          x2="594"
          y2={105 * (i + 1)}
          stroke="color-mix(in oklab, var(--ink) 8%, transparent)"
          strokeWidth="0.5"
        />
      ))}

      {/* SP 211 — strada principale */}
      <path
        data-draw
        d="M 90 110 C 180 140, 240 200, 310 220 S 460 290, 520 320"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Strade secondarie */}
      <path
        data-draw
        d="M 200 90 Q 260 160, 320 210"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 55%, transparent)"
        strokeWidth="1"
        strokeDasharray="1 0"
      />
      <path
        data-draw
        d="M 420 250 Q 470 230, 540 215"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 55%, transparent)"
        strokeWidth="1"
      />
      <path
        data-draw
        d="M 310 220 Q 280 280, 240 340"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 40%, transparent)"
        strokeWidth="0.8"
        strokeDasharray="3 3"
      />

      {/* Curve di livello (Murgia) */}
      <path
        data-draw
        d="M 60 270 Q 200 240, 380 280 T 580 250"
        fill="none"
        stroke="color-mix(in oklab, var(--terracotta) 40%, transparent)"
        strokeWidth="0.7"
      />
      <path
        data-draw
        d="M 80 330 Q 240 300, 400 340 T 580 310"
        fill="none"
        stroke="color-mix(in oklab, var(--terracotta) 30%, transparent)"
        strokeWidth="0.7"
      />

      {/* Punto Noci */}
      <g>
        <circle cx="90" cy="110" r="4" fill="var(--ink)" />
        <text
          x="100"
          y="106"
          fontFamily="var(--font-sans)"
          fontSize="11"
          letterSpacing="2"
          fill="var(--ink)"
        >
          NOCI
        </text>
        <text
          x="100"
          y="120"
          fontFamily="var(--font-sans)"
          fontSize="8"
          letterSpacing="1.5"
          fill="color-mix(in oklab, var(--ink) 60%, transparent)"
        >
          (BA)
        </text>
      </g>

      {/* Punto Massafra */}
      <g>
        <circle cx="520" cy="320" r="4" fill="var(--ink)" />
        <text
          x="470"
          y="340"
          fontFamily="var(--font-sans)"
          fontSize="11"
          letterSpacing="2"
          fill="var(--ink)"
        >
          MASSAFRA
        </text>
        <text
          x="470"
          y="354"
          fontFamily="var(--font-sans)"
          fontSize="8"
          letterSpacing="1.5"
          fill="color-mix(in oklab, var(--ink) 60%, transparent)"
        >
          (TA)
        </text>
      </g>

      {/* Etichetta SP 211 */}
      <g transform="translate(255 178) rotate(22)">
        <rect
          x="-22"
          y="-9"
          width="44"
          height="14"
          fill="var(--ivory)"
          stroke="var(--terracotta)"
          strokeWidth="0.8"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="9"
          letterSpacing="2"
          fill="var(--terracotta)"
        >
          SP 211
        </text>
      </g>

      {/* Bussola */}
      <g transform="translate(540 60)">
        <circle r="18" fill="none" stroke="var(--ink)" strokeWidth="0.6" />
        <path d="M 0 -14 L 4 0 L 0 14 L -4 0 Z" fill="var(--ink)" />
        <text
          x="0"
          y="-22"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="8"
          letterSpacing="2"
          fill="var(--ink)"
        >
          N
        </text>
      </g>

      {/* Segnaposto ad ARCO — Masseria (callback identitario) */}
      <g ref={markerRef} transform="translate(320 220)">
        <path
          d="M -14 4 L -14 -10 A 14 14 0 0 1 14 -10 L 14 4 Z"
          fill="var(--terracotta)"
          stroke="var(--ink)"
          strokeWidth="1"
        />
        <circle cx="0" cy="-4" r="4" fill="var(--ivory)" />
        <text
          x="20"
          y="0"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontSize="13"
          fill="var(--ink)"
        >
          Masseria
        </text>
        <text
          x="20"
          y="14"
          fontFamily="var(--font-sans)"
          fontSize="8"
          letterSpacing="2"
          fill="color-mix(in oklab, var(--ink) 65%, transparent)"
        >
          TORRE ABBONDANZA
        </text>
      </g>
    </svg>
  );
}
