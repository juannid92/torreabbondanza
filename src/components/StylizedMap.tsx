import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Mappa illustrata in stile taccuino cartografico pugliese:
 * Noci ↔ Massafra lungo la SP 211, con i borghi della Murgia dei Trulli,
 * uliveti, muretti a secco, trulli e segnaposto ad arco sulla Masseria.
 */
export function StylizedMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const markerRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = svg.querySelectorAll<SVGPathElement>("[data-draw]");
    const pops = svg.querySelectorAll<SVGGElement>("[data-pop]");

    if (reduced) {
      paths.forEach((p) => {
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
      });
      pops.forEach((el) => gsap.set(el, { opacity: 1, scale: 1 }));
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
        stagger: 0.035,
        scrollTrigger: {
          trigger: svg,
          start: "top 82%",
          end: "bottom 48%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      if (pops.length > 0) {
        gsap.fromTo(
          pops,
          { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: svg,
              start: "top 68%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          },
        );
      }

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
              start: "top 52%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
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
      className="h-auto w-full select-none"
      role="img"
      aria-label="Mappa illustrata della Masseria Torre Abbondanza tra Noci, Alberobello e Massafra lungo la SP 211"
    >
      <defs>
        {/* Bagliore caldo per la carta */}
        <radialGradient id="mapPaperGlow" cx="52%" cy="52%" r="60%">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.10" />
          <stop offset="55%" stopColor="var(--stone)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--ivory)" stopOpacity="0" />
        </radialGradient>

        {/* Alone segnaposto */}
        <radialGradient id="masseriaHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--terracotta)" stopOpacity="0.28" />
          <stop offset="65%" stopColor="var(--gold)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--terracotta)" stopOpacity="0" />
        </radialGradient>

        {/* Texture punteggiata sottile per pascoli/campi */}
        <pattern id="pastureDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.7" fill="color-mix(in oklab, var(--olive) 22%, transparent)" />
          <circle
            cx="10"
            cy="10"
            r="0.55"
            fill="color-mix(in oklab, var(--terracotta) 14%, transparent)"
          />
        </pattern>
      </defs>

      {/* Sfondo caldo della mappa */}
      <rect x="0" y="0" width="600" height="420" fill="url(#mapPaperGlow)" />

      {/* Aree di pascolo e bosco murgiano */}
      <path
        d="M 18 230 Q 110 190, 210 245 T 370 295 Q 250 375, 110 385 Q 35 350, 18 230 Z"
        fill="url(#pastureDots)"
      />
      <path
        d="M 355 55 Q 455 30, 565 85 Q 580 165, 520 205 Q 415 190, 355 55 Z"
        fill="color-mix(in oklab, var(--olive) 6%, transparent)"
      />

      {/* Doppia cornice editoriale da taccuino */}
      <rect
        x="8"
        y="8"
        width="584"
        height="404"
        rx="3"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 28%, transparent)"
        strokeWidth="0.9"
      />
      <rect
        x="13"
        y="13"
        width="574"
        height="394"
        rx="2"
        fill="none"
        stroke="color-mix(in oklab, var(--gold) 50%, transparent)"
        strokeWidth="0.6"
        strokeDasharray="3 4"
      />

      {/* Angoli ornamentali */}
      {[
        "M 13 25 L 25 25 L 25 13",
        "M 575 13 L 575 25 L 587 25",
        "M 13 395 L 25 395 L 25 407",
        "M 575 407 L 575 395 L 587 395",
      ].map((d, i) => (
        <path
          key={`corner-${i}`}
          d={d}
          fill="none"
          stroke="color-mix(in oklab, var(--terracotta) 55%, transparent)"
          strokeWidth="1"
        />
      ))}

      {/* Reticolo cartografico leggero */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`gx-${i}`}
          x1={100 * (i + 1)}
          y1="13"
          x2={100 * (i + 1)}
          y2="407"
          stroke="color-mix(in oklab, var(--ink) 7%, transparent)"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <line
          key={`gy-${i}`}
          x1="13"
          y1={105 * (i + 1)}
          x2="587"
          y2={105 * (i + 1)}
          stroke="color-mix(in oklab, var(--ink) 7%, transparent)"
          strokeWidth="0.5"
        />
      ))}

      {/* Curve di livello (rilievi della Murgia) */}
      <path
        data-draw
        d="M 24 265 Q 150 230, 305 268 T 580 236"
        fill="none"
        stroke="color-mix(in oklab, var(--terracotta) 32%, transparent)"
        strokeWidth="0.75"
      />
      <path
        data-draw
        d="M 32 308 Q 185 276, 355 316 T 578 286"
        fill="none"
        stroke="color-mix(in oklab, var(--terracotta) 25%, transparent)"
        strokeWidth="0.65"
      />
      <path
        data-draw
        d="M 245 78 Q 370 54, 485 95 T 575 74"
        fill="none"
        stroke="color-mix(in oklab, var(--olive) 32%, transparent)"
        strokeWidth="0.7"
      />

      {/* Muretti a secco stilizzati */}
      <path
        data-draw
        d="M 155 215 L 210 226 L 235 218"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 35%, transparent)"
        strokeWidth="1.2"
        strokeDasharray="4 2.5"
        strokeLinecap="round"
      />
      <path
        data-draw
        d="M 345 182 L 395 170 L 430 176"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 35%, transparent)"
        strokeWidth="1.2"
        strokeDasharray="4 2.5"
        strokeLinecap="round"
      />

      {/* Strade secondarie e collegamenti Valle d'Itria */}
      {/* Da Putignano (Nord) a Noci */}
      <path
        data-draw
        d="M 182 44 Q 145 78, 102 122"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 45%, transparent)"
        strokeWidth="1.15"
        strokeDasharray="4 3"
      />
      {/* Da Noci verso Alberobello (Est) */}
      <path
        data-draw
        d="M 102 122 Q 250 112, 425 130"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 50%, transparent)"
        strokeWidth="1.2"
      />
      {/* Collegamento dalla Masseria verso Alberobello */}
      <path
        data-draw
        d="M 320 220 Q 375 175, 425 130"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 42%, transparent)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Da Alberobello verso Martina Franca */}
      <path
        data-draw
        d="M 425 130 Q 488 168, 535 215"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 45%, transparent)"
        strokeWidth="1.15"
      />
      {/* Strada vicinale verso sud-ovest (Mottola) */}
      <path
        data-draw
        d="M 320 220 Q 260 285, 195 352"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 38%, transparent)"
        strokeWidth="0.95"
        strokeDasharray="3 3"
      />

      {/* SP 211 — Strada provinciale principale (doppio tratto cartografico) */}
      <path
        data-draw
        d="M 102 122 C 185 148, 250 198, 320 220 S 445 288, 512 325"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        data-draw
        d="M 102 122 C 185 148, 250 198, 320 220 S 445 288, 512 325"
        fill="none"
        stroke="var(--ivory)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Alberelli d'ulivo stilizzati (Murgia) */}
      {[
        { x: 256, y: 248, s: 0.9 },
        { x: 274, y: 258, s: 0.72 },
        { x: 382, y: 212, s: 0.85 },
        { x: 138, y: 272, s: 0.8 },
        { x: 468, y: 246, s: 0.75 },
      ].map((tree, i) => (
        <g
          key={`olive-${i}`}
          data-pop
          transform={`translate(${tree.x} ${tree.y}) scale(${tree.s})`}
        >
          <path
            d="M 0 0 L 0 -9 M 0 -5 L -4 -8 M 0 -6 L 4 -9"
            stroke="color-mix(in oklab, var(--ink) 65%, transparent)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <ellipse
            cx="0"
            cy="-12"
            rx="8"
            ry="5.5"
            fill="color-mix(in oklab, var(--olive) 26%, var(--ivory))"
            stroke="var(--olive)"
            strokeWidth="0.9"
          />
        </g>
      ))}

      {/* Piccoli Trulli decorativi verso Alberobello */}
      {[
        { x: 392, y: 112, s: 0.85 },
        { x: 454, y: 146, s: 0.72 },
      ].map((trullo, i) => (
        <g
          key={`trullo-${i}`}
          data-pop
          transform={`translate(${trullo.x} ${trullo.y}) scale(${trullo.s})`}
        >
          <rect
            x="-6"
            y="-6"
            width="12"
            height="7"
            fill="var(--ivory)"
            stroke="color-mix(in oklab, var(--ink) 65%, transparent)"
            strokeWidth="0.9"
          />
          <path
            d="M -8 -6 L 0 -17 L 8 -6 Z"
            fill="color-mix(in oklab, var(--stone) 75%, var(--ivory))"
            stroke="color-mix(in oklab, var(--ink) 70%, transparent)"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <circle cx="0" cy="-18" r="1.2" fill="var(--terracotta)" />
        </g>
      ))}

      {/* Cartiglio titolo in alto a sinistra */}
      <g data-pop transform="translate(28 30)">
        <rect
          x="0"
          y="0"
          width="174"
          height="36"
          rx="2"
          fill="color-mix(in oklab, var(--ivory) 92%, var(--stone))"
          stroke="color-mix(in oklab, var(--ink) 25%, transparent)"
          strokeWidth="0.8"
        />
        <text
          x="10"
          y="14"
          fontFamily="var(--font-sans)"
          fontSize="7.5"
          letterSpacing="2"
          fill="var(--terracotta)"
        >
          MURGIA DEI TRULLI
        </text>
        <text
          x="10"
          y="27"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontSize="11.5"
          fill="var(--ink)"
        >
          Agro di Noci · Puglia
        </text>
      </g>

      {/* Borgo Putignano (Nord) */}
      <g data-pop>
        <circle cx="182" cy="44" r="3" fill="var(--ivory)" stroke="var(--ink)" strokeWidth="1.2" />
        <text
          x="191"
          y="46"
          fontFamily="var(--font-sans)"
          fontSize="8.5"
          letterSpacing="1.6"
          fill="color-mix(in oklab, var(--ink) 75%, transparent)"
        >
          PUTIGNANO
        </text>
        <text
          x="191"
          y="56"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fill="color-mix(in oklab, var(--ink) 50%, transparent)"
        >
          9 km · 12 min
        </text>
      </g>

      {/* Punto Noci */}
      <g data-pop>
        <circle cx="102" cy="122" r="5" fill="var(--ivory)" stroke="var(--ink)" strokeWidth="1.8" />
        <circle cx="102" cy="122" r="2" fill="var(--ink)" />
        <text
          x="52"
          y="112"
          fontFamily="var(--font-sans)"
          fontSize="11.5"
          fontWeight="600"
          letterSpacing="2.2"
          fill="var(--ink)"
        >
          NOCI
        </text>
        <text
          x="52"
          y="124"
          fontFamily="var(--font-sans)"
          fontSize="7.5"
          letterSpacing="1.4"
          fill="color-mix(in oklab, var(--ink) 58%, transparent)"
        >
          (BA)
        </text>
      </g>

      {/* Borgo Alberobello */}
      <g data-pop>
        <circle
          cx="425"
          cy="130"
          r="3.5"
          fill="var(--ivory)"
          stroke="var(--ink)"
          strokeWidth="1.3"
        />
        <text
          x="425"
          y="116"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="9"
          fontWeight="600"
          letterSpacing="1.6"
          fill="var(--ink)"
        >
          ALBEROBELLO
        </text>
        <text
          x="425"
          y="146"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fill="color-mix(in oklab, var(--ink) 55%, transparent)"
        >
          11 km · Trulli
        </text>
      </g>

      {/* Borgo Martina Franca */}
      <g data-pop>
        <circle cx="535" cy="215" r="3" fill="var(--ivory)" stroke="var(--ink)" strokeWidth="1.2" />
        <text
          x="526"
          y="206"
          textAnchor="end"
          fontFamily="var(--font-sans)"
          fontSize="8.5"
          letterSpacing="1.5"
          fill="color-mix(in oklab, var(--ink) 75%, transparent)"
        >
          MARTINA FRANCA
        </text>
        <text
          x="526"
          y="218"
          textAnchor="end"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fill="color-mix(in oklab, var(--ink) 50%, transparent)"
        >
          26 km
        </text>
      </g>

      {/* Punto Massafra */}
      <g data-pop>
        <circle
          cx="512"
          cy="325"
          r="4.5"
          fill="var(--ivory)"
          stroke="var(--ink)"
          strokeWidth="1.6"
        />
        <circle cx="512" cy="325" r="1.8" fill="var(--ink)" />
        <text
          x="498"
          y="347"
          textAnchor="end"
          fontFamily="var(--font-sans)"
          fontSize="10.5"
          fontWeight="600"
          letterSpacing="2"
          fill="var(--ink)"
        >
          MASSAFRA
        </text>
        <text
          x="498"
          y="359"
          textAnchor="end"
          fontFamily="var(--font-sans)"
          fontSize="7.5"
          letterSpacing="1.4"
          fill="color-mix(in oklab, var(--ink) 58%, transparent)"
        >
          (TA) · direzione Taranto
        </text>
      </g>

      {/* Etichetta SP 211 */}
      <g data-pop transform="translate(215 166) rotate(22)">
        <rect
          x="-24"
          y="-9"
          width="48"
          height="15"
          rx="2"
          fill="var(--ivory)"
          stroke="var(--terracotta)"
          strokeWidth="0.9"
        />
        <text
          x="0"
          y="1.5"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="1.8"
          fill="var(--terracotta)"
        >
          SP 211
        </text>
      </g>

      {/* Rosa dei Venti raffinata */}
      <g data-pop transform="translate(540 58)">
        <circle
          r="21"
          fill="color-mix(in oklab, var(--ivory) 85%, transparent)"
          stroke="color-mix(in oklab, var(--ink) 30%, transparent)"
          strokeWidth="0.6"
        />
        <circle
          r="16"
          fill="none"
          stroke="color-mix(in oklab, var(--gold) 55%, transparent)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        {/* Punte diagonali */}
        <path
          d="M -9 -9 L 0 -2 L 9 -9 L 2 0 L 9 9 L 0 2 L -9 9 L -2 0 Z"
          fill="color-mix(in oklab, var(--gold) 45%, transparent)"
        />
        {/* Punte cardinali */}
        <path
          d="M 0 -15 L 3.2 -3.2 L 15 0 L 3.2 3.2 L 0 15 L -3.2 3.2 L -15 0 L -3.2 -3.2 Z"
          fill="var(--ink)"
        />
        <path d="M 0 -15 L 3.2 -3.2 L 0 0 Z" fill="var(--terracotta)" />
        <text
          x="0"
          y="-24"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="8"
          fontWeight="600"
          letterSpacing="1.5"
          fill="var(--ink)"
        >
          N
        </text>
      </g>

      {/* Scala grafica & Coordinate GPS in basso a sinistra */}
      <g data-pop transform="translate(28 378)">
        <path
          d="M 0 0 L 0 4 L 40 4 L 40 0 M 80 0 L 80 4 L 40 4"
          fill="none"
          stroke="color-mix(in oklab, var(--ink) 60%, transparent)"
          strokeWidth="0.9"
        />
        <text
          x="0"
          y="-4"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fill="color-mix(in oklab, var(--ink) 55%, transparent)"
        >
          0
        </text>
        <text
          x="40"
          y="-4"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fill="color-mix(in oklab, var(--ink) 55%, transparent)"
        >
          5 km
        </text>
        <text
          x="80"
          y="-4"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fill="color-mix(in oklab, var(--ink) 55%, transparent)"
        >
          10 km
        </text>
        <text
          x="0"
          y="16"
          fontFamily="var(--font-sans)"
          fontSize="7"
          letterSpacing="1.2"
          fill="color-mix(in oklab, var(--ink) 50%, transparent)"
        >
          40°43&apos;50&quot;N · 17°07&apos;50&quot;E
        </text>
      </g>

      {/* Segnaposto ad ARCO — Masseria Torre Abbondanza (callback identitario) */}
      <g ref={markerRef} transform="translate(320 220)">
        {/* Alone morbido */}
        <circle cx="0" cy="-4" r="34" fill="url(#masseriaHalo)" />
        <circle
          cx="0"
          cy="-4"
          r="20"
          fill="none"
          stroke="color-mix(in oklab, var(--terracotta) 35%, transparent)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />

        {/* Arco in terracotta */}
        <path
          d="M -15 5 L -15 -10 A 15 15 0 0 1 15 -10 L 15 5 Z"
          fill="var(--terracotta)"
          stroke="var(--ink)"
          strokeWidth="1.2"
        />
        {/* Arco interno */}
        <path d="M -7 5 L -7 -7 A 7 7 0 0 1 7 -7 L 7 5 Z" fill="var(--ivory)" opacity="0.9" />
        <circle cx="0" cy="-4" r="2.5" fill="var(--terracotta)" />

        {/* Cartellino Masseria */}
        <g transform="translate(22 -14)">
          <rect
            x="-4"
            y="-12"
            width="126"
            height="34"
            rx="3"
            fill="color-mix(in oklab, var(--ivory) 96%, transparent)"
            stroke="color-mix(in oklab, var(--terracotta) 45%, transparent)"
            strokeWidth="0.8"
          />
          <text
            x="4"
            y="1"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fontSize="13.5"
            fontWeight="600"
            fill="var(--ink)"
          >
            Masseria
          </text>
          <text
            x="4"
            y="14"
            fontFamily="var(--font-sans)"
            fontSize="7.5"
            fontWeight="600"
            letterSpacing="1.8"
            fill="var(--terracotta)"
          >
            TORRE ABBONDANZA
          </text>
        </g>
      </g>
    </svg>
  );
}
