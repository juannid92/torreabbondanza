import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { observeRevealElements } from "@/lib/scroll-ready";

interface GuestNote {
  text: string;
  signature: string;
  origin: string;
  soul: "tavola" | "cavalli";
  rotate: number; // deg
  offsetX: number; // %
  width: string; // tailwind/clamp width
  confirmed: boolean;
}

// {/* recensioni reali DA CONFERMARE col cliente */}
const NOTES: GuestNote[] = [
  {
    text: "Location spettacolare nel bel mezzo delle campagne pugliesi. Tornerò di sicuro.",
    signature: "Marta",
    origin: "Milano",
    soul: "tavola",
    rotate: -1.6,
    offsetX: -2,
    width: "max-w-[36ch]",
    confirmed: false,
  },
  {
    text: "All'alba, tra gli ulivi, i Murgesi al pascolo. Non avevo mai visto cavalli così neri e così quieti.",
    signature: "Étienne",
    origin: "Lione",
    soul: "cavalli",
    rotate: 1.4,
    offsetX: 6,
    width: "max-w-[38ch]",
    confirmed: false,
  },
  {
    text: "Il Primitivo della masseria, le orecchiette tirate a mano, una serata che non si dimentica.",
    signature: "Giorgia & Luca",
    origin: "Bologna",
    soul: "tavola",
    rotate: -0.8,
    offsetX: -6,
    width: "max-w-[40ch]",
    confirmed: false,
  },
  {
    text: "Ci siamo sposati qui. Le luci nel cortile, la pietra calda, la nostra tavola sotto il cielo della Murgia.",
    signature: "Chiara e Davide",
    origin: "Bari",
    soul: "tavola",
    rotate: 1.1,
    offsetX: 4,
    width: "max-w-[42ch]",
    confirmed: false,
  },
  {
    text: "Una passeggiata a cavallo tra muretti a secco e trulli: la Puglia che cercavamo, senza filtri.",
    signature: "The Hendersons",
    origin: "London",
    soul: "cavalli",
    rotate: -1.2,
    offsetX: -4,
    width: "max-w-[40ch]",
    confirmed: false,
  },
  {
    text: "Accoglienza vera, di famiglia. Ti senti ospite, non cliente.",
    signature: "Federica",
    origin: "Roma",
    soul: "tavola",
    rotate: 0.9,
    offsetX: 8,
    width: "max-w-[32ch]",
    confirmed: false,
  },
  {
    text: "Gli attacchi d'epoca, i muli Martinesi, i racconti di tre secoli di pietra. Un viaggio nel tempo.",
    signature: "Andrea",
    origin: "Torino",
    soul: "cavalli",
    rotate: -0.6,
    offsetX: -8,
    width: "max-w-[40ch]",
    confirmed: false,
  },
];

// {/* presenza piattaforme DA CONFERMARE */}
const PLATFORMS = ["TheFork", "Tripadvisor", "ViaMichelin", "Facebook"];

function GuestPage({ note, index }: { note: GuestNote; index: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const quote = root.querySelector<HTMLElement>("[data-handwrite]");
    const sign = root.querySelector<HTMLElement>("[data-signature]");
    const stroke = root.querySelector<SVGPathElement>("[data-stroke]");

    if (!quote || !sign) return;

    if (reduced) {
      gsap.set([quote, sign], { opacity: 1 });
      if (stroke) gsap.set(stroke, { strokeDashoffset: 0 });
      return;
    }

    let played = false;
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        if (played) return;
        played = true;

        if (stroke) {
          const len = stroke.getTotalLength();
          stroke.style.strokeDasharray = `${len}`;
          stroke.style.strokeDashoffset = `${len}`;
        }

        const tl = gsap.timeline();
        tl.fromTo(
          quote,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.6,
            ease: "power1.inOut",
            overwrite: true,
          },
        ).fromTo(
          sign,
          { y: 6 },
          { y: 0, duration: 0.5, ease: "power2.out", overwrite: true, immediateRender: false },
          "-=0.25",
        );

        if (stroke) {
          tl.to(stroke, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, "-=0.35");
        }
      },
    });

    // parallax leggero
    const pTween = gsap.to(root, {
      yPercent: index % 2 === 0 ? -6 : -10,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
          invalidateOnRefresh: true,
      },
    });

    return () => {
      trigger.kill();
      pTween.scrollTrigger?.kill();
      pTween.kill();
    };
  }, [index]);

  const accent =
    note.soul === "tavola"
      ? "var(--terracotta, #b65a3c)"
      : "var(--murgese, #15110F)";

  return (
    <figure
      ref={ref}
      data-reveal="soft"
      className={`relative ${note.width} mx-auto md:mx-0`}
      style={{
        transform: `rotate(${note.rotate}deg) translateX(${note.offsetX}%)`,
      }}
    >
      <blockquote>
        <p
          data-handwrite
          className="font-handwrite text-ink"
          style={{
            fontFamily: '"Caveat", "Segoe Script", cursive',
            fontWeight: 500,
            fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
            lineHeight: 1.25,
            letterSpacing: "0.005em",
            color: "var(--ink, #1a1410)",
            textShadow: "0 1px 0 rgba(0,0,0,0.02)",
          }}
        >
          {note.text}
        </p>
      </blockquote>
      <figcaption
        data-signature
        className="mt-3 flex items-end gap-3"
        style={{ color: accent }}
      >
        <span
          style={{
            fontFamily: '"Pinyon Script", "Caveat", cursive',
            fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
            lineHeight: 1,
          }}
        >
          {note.signature}
        </span>
        <svg
          data-stroke-wrap
          width="64"
          height="18"
          viewBox="0 0 64 18"
          aria-hidden
          className="mb-1 shrink-0"
        >
          <path
            data-stroke
            d="M2 12 C 12 2, 22 18, 34 8 S 56 14, 62 4"
            fill="none"
            stroke={accent}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink/55"
          style={{ paddingBottom: "0.15rem" }}
        >
          {note.origin}
        </span>
      </figcaption>
      {!note.confirmed && <span className="sr-only">{/* DA CONFERMARE */}</span>}
    </figure>
  );
}

export function TestimonialsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    return observeRevealElements(root);
  }, []);

  return (
    <section
      id="recensioni"
      ref={rootRef}
      aria-labelledby="guestbook-title"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #f3e8d6 0%, #ecdcc3 45%, #e2cda9 100%)",
        color: "var(--ink, #1a1410)",
      }}
    >
      {/* Continuità con la Galleria (ingresso): velo morbido dallo scuro al caldo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.12) 55%, transparent 100%)",
        }}
      />

      {/* Grain / carta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />
      {/* macchie carta calde */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 30% at 18% 22%, rgba(168,120,70,0.18), transparent 70%), radial-gradient(35% 28% at 82% 70%, rgba(80,40,20,0.14), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-44">
        {/* Eyebrow + titolo */}
        <p className="text-eyebrow mb-6 text-ink/70">10 — Il libro degli ospiti</p>
        <h2
          id="guestbook-title"
          className="mb-20 max-w-[18ch]"
          style={{
            fontFamily: '"Caveat", "Segoe Script", cursive',
            fontWeight: 600,
            fontSize: "clamp(2.6rem, 6.5vw, 5.6rem)",
            lineHeight: 1.05,
            color: "var(--ink, #1a1410)",
          }}
        >
          Le voci di chi è stato qui
        </h2>

        {/* Flusso pagine - layout asimmetrico */}
        <div className="relative grid grid-cols-1 gap-y-20 md:grid-cols-12 md:gap-y-28">
          {NOTES.map((n, i) => {
            // distribuzione asimmetrica desktop
            const layout = [
              "md:col-start-1 md:col-span-6",
              "md:col-start-8 md:col-span-5",
              "md:col-start-2 md:col-span-6",
              "md:col-start-7 md:col-span-6",
              "md:col-start-1 md:col-span-5",
              "md:col-start-8 md:col-span-4",
              "md:col-start-3 md:col-span-7",
            ];
            return (
              <div key={i} className={layout[i] ?? "md:col-span-6"}>
                <GuestPage note={n} index={i} />
              </div>
            );
          })}
        </div>

        {/* Sigillo qualitativo + piattaforme (zero numeri) */}
        <div className="mt-32 border-t border-ink/15 pt-12 text-center">
          <p
            style={{
              fontFamily: '"Caveat", "Segoe Script", cursive',
              fontSize: "clamp(1.8rem, 3.4vw, 3rem)",
              lineHeight: 1.1,
              color: "var(--ink, #1a1410)",
            }}
          >
            Tra le mete più amate della Murgia.
          </p>
          <ul
            className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
            aria-label="Presenza sulle piattaforme di recensione"
          >
            {PLATFORMS.map((p) => (
              <li
                key={p}
                className="text-eyebrow text-ink/60"
                style={{ letterSpacing: "0.22em" }}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Uscita verso Contatti: sfumatura calda */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--ivory, #f4ead6) 80%, transparent) 100%)",
        }}
      />
    </section>
  );
}
