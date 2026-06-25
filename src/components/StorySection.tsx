import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StoryPanel, type StoryPanelData } from "./StoryPanel";
import storyOrigini from "@/assets/story-origini.jpg";
import storyPietra from "@/assets/story-pietra.jpg";
import storyFamiglia from "@/assets/story-famiglia.jpg";
import storyOggi from "@/assets/story-oggi.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PANELS: StoryPanelData[] = [
  {
    eyebrow: "03 — La Storia",
    ghost: "MCMXVIII",
    title: (
      <>
        Tre secoli di <em className="font-display italic text-terracotta">pietra</em>
      </>
    ),
    body: (
      <>Dove ogni muro a calce custodisce una memoria.</>
    ),
    isOpening: true,
    cta: (
      <span className="text-eyebrow text-ink/60">scorri →</span>
    ),
  },
  {
    eyebrow: "Capitolo I — Le origini",
    ghost: "1700",
    title: <>Un presidio nella Murgia</>,
    body: (
      <>
        Nel cuore del XVIII secolo, tra gli ulivi e il bianco di Noci,
        la masseria nasce come presidio rurale: pietra su pietra, alzata
        per custodire raccolti, bestie e famiglie sotto un unico tetto.
      </>
    ),
    image: { src: storyOrigini, alt: "Facciata in pietra della masseria settecentesca al tramonto" },
    note: <>Data esatta da confermare</>,
  },
  {
    eyebrow: "Capitolo II — La materia",
    ghost: "PIETRA",
    title: <>La calce, la pietra, la luce</>,
    body: (
      <>
        Archi a tutto sesto, muri a calce che respirano, tetti in
        terracotta che si scaldano nel pomeriggio: l'architettura rurale
        pugliese non è decoro, è clima. Il bianco riflette la luce, la
        pietra trattiene il fresco.
      </>
    ),
    image: { src: storyPietra, alt: "Dettaglio di arco in pietra e tetto in terracotta su muro a calce" },
  },
  {
    eyebrow: "Capitolo III — La famiglia",
    ghost: "FAMIGLIA",
    title: <>L'accoglienza come gesto antico</>,
    body: (
      <>
        Da generazioni la conduzione è familiare: entusiasmo, ricerca e
        gusto si tramandano insieme al pane sulla tavola. L'ospite non è
        cliente — è invitato a una festa che dura da sempre.
      </>
    ),
    image: { src: storyFamiglia, alt: "Tavola conviviale sotto un arco in pietra, candele accese" },
    note: <>Nomi e generazioni da confermare</>,
  },
  {
    eyebrow: "Capitolo IV — Oggi",
    ghost: "OGGI",
    title: <>Una tavola che continua</>,
    body: (
      <>
        Oggi la masseria è ristorante, sala ricevimenti e luogo di
        matrimoni: la stessa pietra di tre secoli fa accoglie esperienze
        nuove, nel cuore della Murgia.
      </>
    ),
    image: { src: storyOggi, alt: "Sala ristorante a volte in pietra della masseria oggi" },
    cta: (
      <a
        href="#next-04"
        className="group inline-flex items-center gap-2 text-eyebrow text-terracotta transition-opacity hover:opacity-70"
      >
        Scopri la cucina
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    ),
  },
];

export function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<SVGPathElement | null>(null);
  const markersRef = useRef<(SVGCircleElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = PANELS.length;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (reduced || isMobile) {
      // Layout verticale statico: niente pin orizzontale.
      gsap.set(track, { x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
      const distance = () => track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (panels.length - 1), duration: 0.3, ease: "power2.inOut" },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (panels.length - 1));
            setActiveIndex(idx);
          },
        },
      });

      tl.to(track, { x: () => -distance(), ease: "none" });

      // Linea-timeline: si disegna in sync con l'avanzamento
      if (timelineRef.current) {
        const len = timelineRef.current.getTotalLength();
        gsap.set(timelineRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(timelineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        });
      }

      // Per ogni pannello: arch reveal + parallax interno
      panels.forEach((panel) => {
        const arch = panel.querySelector<HTMLElement>("[data-arch-reveal]");
        const img = panel.querySelector<HTMLElement>("[data-arch-image]");
        const eyebrow = panel.querySelector<HTMLElement>("[data-panel-eyebrow]");
        const title = panel.querySelector<HTMLElement>("[data-panel-title]");
        const body = panel.querySelector<HTMLElement>("[data-panel-body]");
        const ghost = panel.querySelector<HTMLElement>("[data-ghost]");

        if (arch) {
          gsap.fromTo(
            arch,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "power3.out",
              duration: 1.1,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
        if (img) {
          gsap.fromTo(
            img,
            { xPercent: 8 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
        if (ghost) {
          gsap.fromTo(
            ghost,
            { xPercent: 15, opacity: 0.04 },
            {
              xPercent: -15,
              opacity: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }

        const reveals = [eyebrow, title, body].filter(Boolean) as HTMLElement[];
        if (reveals.length) {
          gsap.fromTo(
            reveals,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left 65%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="storia"
      aria-labelledby="story-title"
      className="relative w-full overflow-hidden bg-stone text-ink"
      style={{ minHeight: "100svh" }}
    >
      <div className="grain-overlay" aria-hidden />

      <h2 id="story-title" className="sr-only">La storia — Tre secoli di pietra</h2>

      {/* Traccia orizzontale (desktop) / colonna verticale (mobile) */}
      <div
        ref={trackRef}
        className="flex h-[100svh] w-max flex-row max-md:h-auto max-md:w-full max-md:flex-col"
        style={{ willChange: "transform" }}
      >
        {PANELS.map((p, i) => (
          <StoryPanel key={i} data={p} index={i} total={total} />
        ))}
      </div>

      {/* Linea-timeline + marker (desktop only) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 hidden px-12 md:block lg:px-20">
        <svg
          viewBox="0 0 1000 20"
          preserveAspectRatio="none"
          className="h-5 w-full"
          aria-hidden
        >
          <path
            d="M 0 10 L 1000 10"
            stroke="color-mix(in oklab, var(--ink) 18%, transparent)"
            strokeWidth="1"
            fill="none"
          />
          <path
            ref={timelineRef}
            d="M 0 10 L 1000 10"
            stroke="var(--terracotta)"
            strokeWidth="1.5"
            fill="none"
          />
          {PANELS.map((_, i) => {
            const cx = (1000 / (total - 1)) * i;
            const active = i <= activeIndex;
            return (
              <circle
                key={i}
                ref={(el) => {
                  markersRef.current[i] = el;
                }}
                cx={cx}
                cy={10}
                r={active ? 5 : 3}
                fill={active ? "var(--terracotta)" : "var(--ivory)"}
                stroke="var(--ink)"
                strokeWidth="1"
                style={{ transition: "r 0.3s ease, fill 0.3s ease" }}
              />
            );
          })}
        </svg>
      </div>

      {/* Indicatore di progresso (desktop) */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 md:block">
        <span className="text-eyebrow text-ink/70 tabular-nums">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Sfumatura di uscita verso Sez.04 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--olive) 25%, var(--stone)))",
        }}
      />
    </section>
  );
}
