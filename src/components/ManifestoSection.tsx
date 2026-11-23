import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sezione 01 — "Il Tempo Lento"
 * Manifesto editoriale con ingresso fluido riga per riga allo scroll.
 */

type AccentTone = "warm" | "deep";
type Token = { text: string; accent?: boolean; tone?: AccentTone };

// Due registri cromatici: warm = terracotta (Tavola), deep = nero Murgese (Cavalli).
const WARM = "var(--terracotta)";
const DEEP = "var(--color-murgese, #15110F)";

// Righe del manifesto. Layout broken grid via LINE_INDENT.
const LINES: Token[][] = [
  [
    { text: "C'è" },
    { text: "un" },
    { text: "luogo" },
    { text: "dove" },
    { text: "la" },
    { text: "pietra", accent: true, tone: "warm" },
    { text: "racconta" },
    { text: "tre" },
    { text: "secoli," },
  ],
  [
    { text: "dove" },
    { text: "la" },
    { text: "terra", accent: true, tone: "warm" },
    { text: "dona" },
    { text: "i" },
    { text: "suoi" },
    { text: "frutti" },
    { text: "e" },
    { text: "ogni" },
    { text: "tavola", accent: true, tone: "warm" },
    { text: "diventa" },
    { text: "una" },
    { text: "festa," },
  ],
  [
    { text: "e" },
    { text: "dove" },
    { text: "i" },
    { text: "cavalli", accent: true, tone: "deep" },
    { text: "Murgesi" },
    { text: "corrono" },
    { text: "liberi" },
    { text: "come" },
    { text: "un" },
    { text: "tempo." },
  ],
  [
    { text: "Qui" },
    { text: "il" },
    { text: "tempo", accent: true, tone: "warm" },
    { text: "rallenta," },
    { text: "l'accoglienza" },
    { text: "è" },
    { text: "di" },
    { text: "famiglia,", accent: true, tone: "warm" },
  ],
  [
    { text: "e" },
    { text: "l'" },
    { text: "abbondanza", accent: true, tone: "warm" },
    { text: "non" },
    { text: "è" },
    { text: "quantità" },
    { text: "—" },
  ],
  [
    { text: "è" },
    { text: "la" },
    { text: "generosità" },
    { text: "di" },
    { text: "un" },
    { text: "gesto" },
    { text: "antico" },
  ],
  [
    { text: "e" },
    { text: "la" },
    { text: "nobiltà" },
    { text: "di" },
    { text: "un" },
    { text: "galoppo", accent: true, tone: "deep" },
    { text: "che" },
    { text: "dura" },
    { text: "da" },
    { text: "sempre." },
  ],
];

// Indent per riga (broken grid).
const LINE_INDENT = [0, 1, 2, 0, 2, 1, 3];

export function ManifestoSection() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const arcPathRef = useRef<SVGPathElement | null>(null);
  const signatureRef = useRef<HTMLDivElement | null>(null);
  const eyebrowTextRef = useRef<HTMLSpanElement | null>(null);

  const lines = useMemo<Token[][]>(() => {
    if (i18n.language === "it") return LINES;
    const trLines = t("manifesto.lines", { returnObjects: true }) as string[];
    if (!Array.isArray(trLines) || !trLines.length) return LINES;
    return trLines.map((lineStr) => {
      const parts = lineStr.includes(" ") ? lineStr.split(/\s+/) : Array.from(lineStr);
      return parts.map((text) => ({ text }));
    });
  }, [t, i18n.language]);

  const fullText = useMemo(
    () =>
      lines
        .map((l) =>
          l
            .map((tok) => tok.text)
            .join(l[0]?.text.length === 1 && !l.some((x) => x.text.length > 1) ? "" : " "),
        )
        .join(" "),
    [lines],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const section = sectionRef.current;
    if (!section) return;

    const lineEls = linesRef.current.filter(Boolean);

    if (reduced) {
      gsap.set([eyebrowTextRef.current, signatureRef.current, ...lineEls], { opacity: 1, y: 0 });
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Ingresso eyebrow + filetto
      gsap.from(eyebrowTextRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      gsap.from(ruleRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      // Ingresso editoriale morbido riga per riga (senza blocco scroll / karaoke)
      if (lineEls.length > 0) {
        gsap.fromTo(
          lineEls,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // Firma fade-in
      if (signatureRef.current) {
        gsap.fromTo(
          signatureRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.45,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          },
        );
      }

      // Arco-eco draw lungo lo scroll naturale
      if (arcPathRef.current) {
        const len = arcPathRef.current.getTotalLength();
        gsap.set(arcPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(arcPathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 40%",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [i18n.language]);

  linesRef.current = [];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="manifesto-title"
      className="relative w-full overflow-hidden bg-ivory text-ink"
    >
      {/* Grain coerente con hero */}
      <div className="grain-overlay" aria-hidden />

      {/* Arco-eco decorativo (richiamo all'hero) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute right-[6vw] top-[14%] hidden md:block"
        width="420"
        height="560"
        viewBox="0 0 420 560"
        fill="none"
        style={{ opacity: 0.5, zIndex: 0 }}
      >
        <path
          ref={arcPathRef}
          d="M20 540 L20 230 Q20 20 210 20 Q400 20 400 230 L400 540"
          stroke="var(--stone)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* H2 semanticamente presente ma visivamente nascosto */}
      <h2 id="manifesto-title" className="sr-only">
        Manifesto — Il Tempo Lento
      </h2>

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-6 py-24 md:px-12 md:py-36 lg:px-20">
        {/* Eyebrow + filetto */}
        <div className="flex items-center gap-4">
          <span ref={eyebrowTextRef} className="text-eyebrow text-ink/70">
            {t("manifesto.eyebrow")}
          </span>
          <span
            ref={ruleRef}
            aria-hidden
            className="block h-px w-32 bg-ink/40 md:w-48"
            style={{ transformOrigin: "left center" }}
          />
        </div>

        {/* Manifesto */}
        <div className="relative mt-12 md:mt-16">
          {/* Testo accessibile (screen reader) */}
          <p className="sr-only">{fullText}</p>

          {/* Blocco visivo (aria-hidden) — broken grid */}
          <blockquote
            aria-hidden
            className="font-display font-normal leading-[1.22] text-ink"
            style={{
              fontSize: "clamp(1.5rem, 3.6vw, 3rem)",
              maxWidth: "min(70ch, 85%)",
            }}
          >
            {lines.map((line, li) => {
              const isCjk = line.length > 3 && line.every((tok) => tok.text.length <= 2);
              const indent = LINE_INDENT[li] ?? 0;
              const desktopPad = ["0", "8%", "16%", "24%"][indent];
              return (
                <span
                  key={li}
                  ref={(el) => {
                    if (el) linesRef.current[li] = el;
                  }}
                  className="block will-change-transform"
                  style={{
                    paddingLeft: desktopPad,
                    marginTop: li === 0 ? 0 : "0.18em",
                  }}
                >
                  {line.map((tok, ti) => (
                    <span key={`${li}-${ti}`}>
                      <span
                        className={tok.accent ? "font-display italic" : undefined}
                        style={{
                          color: tok.accent ? (tok.tone === "deep" ? DEEP : WARM) : undefined,
                          fontSize: tok.accent ? "1.08em" : undefined,
                        }}
                      >
                        {tok.text}
                      </span>
                      {!isCjk && ti < line.length - 1 ? " " : ""}
                    </span>
                  ))}
                </span>
              );
            })}
          </blockquote>

          {/* Firma */}
          <div ref={signatureRef} className="mt-12 flex justify-end md:mt-14">
            <span className="text-eyebrow text-ink/60">— {t("manifesto.signature")}</span>
          </div>
        </div>
      </div>

      {/* Sfumatura di uscita: avorio → pietra (continuità con Sez. 02) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--stone))",
        }}
      />
    </section>
  );
}
