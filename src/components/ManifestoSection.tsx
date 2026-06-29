import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sezione 02 — "Il Tempo Lento"
 * Manifesto editoriale con spotlight reading guidato dallo scroll (pin + scrub).
 */

type AccentTone = "warm" | "deep";
type Token = { text: string; accent?: boolean; tone?: AccentTone };

// Due registri cromatici: warm = terracotta (Tavola), deep = nero Murgese (Cavalli).
const WARM = "var(--terracotta)";
const DEEP = "var(--color-murgese, #15110F)";

// Righe del manifesto. Layout broken grid via LINE_INDENT.
const LINES: Token[][] = [
  [
    { text: "C'è" }, { text: "un" }, { text: "luogo" }, { text: "dove" },
    { text: "la" }, { text: "pietra", accent: true, tone: "warm" }, { text: "racconta" },
    { text: "tre" }, { text: "secoli," },
  ],
  [
    { text: "dove" }, { text: "la" }, { text: "terra", accent: true, tone: "warm" },
    { text: "dona" }, { text: "i" }, { text: "suoi" }, { text: "frutti" },
    { text: "e" }, { text: "ogni" }, { text: "tavola", accent: true, tone: "warm" },
    { text: "diventa" }, { text: "una" }, { text: "festa," },
  ],
  [
    { text: "e" }, { text: "dove" }, { text: "i" },
    { text: "cavalli", accent: true, tone: "deep" },
    { text: "Murgesi" }, { text: "corrono" }, { text: "liberi" },
    { text: "come" }, { text: "un" }, { text: "tempo." },
  ],
  [
    { text: "Qui" }, { text: "il" }, { text: "tempo", accent: true, tone: "warm" },
    { text: "rallenta," }, { text: "l'accoglienza" }, { text: "è" }, { text: "di" },
    { text: "famiglia,", accent: true, tone: "warm" },
  ],
  [
    { text: "e" }, { text: "l'" }, { text: "abbondanza", accent: true, tone: "warm" },
    { text: "non" }, { text: "è" }, { text: "quantità" }, { text: "—" },
  ],
  [
    { text: "è" }, { text: "la" }, { text: "generosità" }, { text: "di" },
    { text: "un" }, { text: "gesto" }, { text: "antico" },
  ],
  [
    { text: "e" }, { text: "la" }, { text: "nobiltà" }, { text: "di" }, { text: "un" },
    { text: "galoppo", accent: true, tone: "deep" },
    { text: "che" }, { text: "dura" }, { text: "da" }, { text: "sempre." },
  ],
];

// Indent per riga (broken grid).
const LINE_INDENT = [0, 1, 2, 0, 2, 1, 3];

// Full text per accessibilità.
const FULL_TEXT = LINES.map((l) => l.map((t) => t.text).join(" ")).join(" ");

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const blockquoteRef = useRef<HTMLQuoteElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const arcPathRef = useRef<SVGPathElement | null>(null);
  const signatureRef = useRef<HTMLDivElement | null>(null);
  const eyebrowTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const blockquote = blockquoteRef.current;
    if (!section || !stage || !blockquote) return;

    const words = wordsRef.current.filter(Boolean);

    if (reduced) {
      // Stato pieno, niente pin/scrub.
      gsap.set(words, { opacity: 1, color: "" });
      gsap.set([eyebrowTextRef.current, signatureRef.current], { opacity: 1, y: 0 });
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Ingresso eyebrow + filetto (prima del pin)
      gsap.from(eyebrowTextRef.current, {
        opacity: 0, y: 8, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(ruleRef.current, {
        scaleX: 0, transformOrigin: "left center",
        duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });

      // Arco-eco draw (sincronizzato allo scroll)
      if (arcPathRef.current) {
        const len = arcPathRef.current.getTotalLength();
        gsap.set(arcPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(arcPathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section, start: "top bottom", end: "bottom top", scrub: true,
          },
        });
      }

      // === Pin + spotlight reading + teleprompter ===
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      // Stato iniziale: tutte parole "futura"
      gsap.set(words, { opacity: 0.18, scale: 1 });

      // Calcolo offset teleprompter: trasla il blockquote per tenere la
      // riga attiva nella banda di lettura (~50% viewport).
      // Si rilegge ad ogni refresh (resize/font load).
      const computeOffset = () => {
        const textH = blockquote.scrollHeight;
        const bandH = window.innerHeight * 0.55;
        return Math.max(0, textH - bandH);
      };

      // Durata in scroll-px: proporzionale al numero di parole.
      const pxPerWord = isMobile ? 80 : 90;
      const exitPx = 600;
      const totalPx = words.length * pxPerWord + exitPx;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalPx}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Sequenza karaoke: ogni parola passa 0.18 → 1 → 0.55, in posizione assoluta.
      const stepIn = 0.6;
      const stepHold = 0.3;
      const stepOut = 0.5;
      const wordSlot = 1.0; // 1 "unità" per parola: scroll mappato 1:1

      words.forEach((w, i) => {
        const accent = w.dataset.accent === "true";
        const tone = w.dataset.tone as AccentTone | undefined;
        const activeColor = accent
          ? tone === "deep" ? DEEP : WARM
          : "var(--ink)";
        const at = i * wordSlot;
        tl.to(w, {
          opacity: 1,
          scale: 1.02,
          color: activeColor,
          duration: stepIn,
          ease: "power2.out",
        }, at);
        tl.to(w, {
          opacity: 0.55,
          scale: 1,
          duration: stepOut,
          ease: "power2.inOut",
        }, at + stepIn + stepHold);
      });

      const readingDuration = words.length * wordSlot;

      // Teleprompter: trasla il blockquote linearmente sulla stessa progress.
      tl.to(blockquote, {
        y: () => -computeOffset(),
        ease: "none",
        duration: readingDuration,
      }, 0);

      // Firma fade-in nel finale della lettura
      tl.from(signatureRef.current, {
        opacity: 0, y: 12, duration: 1.2, ease: "power2.out",
      }, readingDuration - 1.5);

      // Hold confortevole (~6% finale prima dell'uscita)
      const holdDuration = Math.max(0.6, readingDuration * 0.06);
      tl.to({}, { duration: holdDuration }, readingDuration);

      // Uscita morbida: fade + scale-out del manifesto prima di sganciare il pin
      tl.to(stage, {
        opacity: 0,
        scale: 0.98,
        duration: Math.max(1.5, readingDuration * 0.1),
        ease: "power2.in",
      }, readingDuration + holdDuration);
    }, section);

    return () => ctx.revert();
  }, []);

  let wordCounter = 0;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="manifesto-title"
      className="relative w-full overflow-hidden bg-ivory text-ink"
      style={{ minHeight: "100svh" }}
    >
      {/* Grain coerente con hero */}
      <div className="grain-overlay" aria-hidden />

      {/* Arco-eco decorativo (richiamo all'hero) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute right-[6vw] top-[18%] hidden md:block"
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
      <h2 id="manifesto-title" className="sr-only">Manifesto — Il Tempo Lento</h2>

      <div className="relative z-10 mx-auto flex h-[100svh] max-w-[1400px] flex-col px-6 pt-[10vh] pb-[8vh] md:px-12 lg:px-20">
        {/* Eyebrow + filetto */}
        <div className="flex items-center gap-4">
          <span ref={eyebrowTextRef} className="text-eyebrow text-ink/70">
            02 — Manifesto
          </span>
          <span
            ref={ruleRef}
            aria-hidden
            className="block h-px w-32 bg-ink/40 md:w-48"
            style={{ transformOrigin: "left center" }}
          />
        </div>

        {/* Manifesto */}
        <div
          ref={stageRef}
          className="relative mt-[6vh] flex-1 overflow-hidden"
          style={{ willChange: "opacity, transform" }}
        >
          {/* Testo accessibile (screen reader) */}
          <p className="sr-only">{FULL_TEXT}</p>

          {/* Blocco visivo (aria-hidden) — broken grid */}
          <blockquote
            ref={blockquoteRef}
            aria-hidden
            className="font-display font-normal leading-[1.2] text-ink"
            style={{
              fontSize: "clamp(1.5rem, 3.6vw, 3rem)",
              maxWidth: "min(70ch, 80%)",
              willChange: "transform",
            }}
          >
            {LINES.map((line, li) => {
              const indent = LINE_INDENT[li] ?? 0;
              // mobile: rientri ridotti
              const desktopPad = ["0", "8%", "16%", "24%"][indent];
              return (
                <span
                  key={li}
                  className="block"
                  style={{
                    paddingLeft: desktopPad,
                    marginTop: li === 0 ? 0 : "0.15em",
                  }}
                >
                  {line.map((tok, ti) => {
                    const idx = wordCounter++;
                    return (
                      <span key={`${li}-${ti}`}>
                        <span
                          ref={(el) => {
                            if (el) wordsRef.current[idx] = el;
                          }}
                          data-word
                          data-accent={tok.accent ? "true" : "false"}
                          data-tone={tok.tone ?? ""}
                          className={
                            tok.accent
                              ? "font-display italic"
                              : ""
                          }
                          style={{
                            display: "inline-block",
                            opacity: 0.18,
                            color: tok.accent
                              ? tok.tone === "deep" ? DEEP : WARM
                              : undefined,
                            fontSize: tok.accent ? "1.08em" : undefined,
                            willChange: "opacity, transform, color",
                          }}
                        >
                          {tok.text}
                        </span>
                        {ti < line.length - 1 ? " " : ""}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </blockquote>

          {/* Firma */}
          <div
            ref={signatureRef}
            className="mt-[8vh] flex justify-end md:absolute md:bottom-0 md:right-0 md:mt-0"
          >
            <span className="text-eyebrow text-ink/60">
              — Masseria Torre Abbondanza, Noci
            </span>
          </div>
        </div>
      </div>

      {/* Sfumatura di uscita: avorio → pietra (continuità con Sez. 03) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--stone))",
        }}
      />
    </section>
  );
}
