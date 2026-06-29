import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import winterBg from "@/assets/season-winter.jpg";
import springBg from "@/assets/season-spring.jpg";
import summerBg from "@/assets/season-may.jpg";
import autumnBg from "@/assets/season-autumn.jpg";
import expSpringRide from "@/assets/season-exp-spring-ride.jpg";
import expSummerAttacchi from "@/assets/season-exp-summer-attacchi.jpg";
import expAutumnOlives from "@/assets/season-exp-autumn-olives.jpg";
import expWinterHorses from "@/assets/season-exp-winter-horses.jpg";
import expSummerNight from "@/assets/events-space-night.jpg";
import expAutumnTable from "@/assets/kitchen-antipasti.jpg";
import expWinterCamino from "@/assets/kitchen-primi.jpg";
import expSpringPicnic from "@/assets/events-carriage.jpg";

type SeasonKey = "spring" | "summer" | "autumn" | "winter";
type Soul = "equestre" | "tavola";

interface SeasonStage {
  key: SeasonKey;
  index: number;
  label: string;
  italic: string;
  kicker: string;
  bg: string;
  bgAlt: string;
  palette: { bg: string; fg: string; accent: string };
  experiences: {
    soul: Soul;
    title: string;
    text: string;
    image: string;
    alt: string;
  }[];
}

const STAGES: SeasonStage[] = [
  {
    key: "spring",
    index: 0,
    label: "Primavera",
    italic: "in fiore",
    kicker:
      "La campagna si risveglia: ulivi in fiore, terra che respira, passi lenti tra i muretti a secco.",
    bg: springBg,
    bgAlt: "Ulivi della Murgia in primavera con fiori bianchi e luce nuova",
    palette: { bg: "#EFE9DC", fg: "#2A2E22", accent: "#6B7250" },
    experiences: [
      {
        soul: "equestre",
        title: "A cavallo tra gli ulivi in fiore",
        text:
          "Passeggiate nei sentieri della masseria con i Murgesi: il passo lento dei cavalli e il bianco delle fioriture lungo i filari.",
        image: expSpringRide,
        alt: "Cavalieri al passo tra ulivi in fiore della Murgia",
      },
      {
        soul: "tavola",
        title: "Risveglio nel verde",
        text:
          "Pranzi e picnic all'aperto fra ulivi e prato nuovo: pane, erbe selvatiche, formaggi della tradizione pugliese.",
        image: expSpringPicnic,
        alt: "Tavola apparecchiata nel giardino della masseria in primavera",
      },
    ],
  },
  {
    key: "summer",
    index: 1,
    label: "Estate",
    italic: "sotto le stelle",
    kicker:
      "Le sere si fanno lunghe, l'oro bruciato si posa su pietra e tavola: la masseria si apre alla festa.",
    bg: summerBg,
    bgAlt: "Tavola estiva sotto le stelle nella corte della masseria",
    palette: { bg: "#E8C98A", fg: "#241C0F", accent: "#A9802E" },
    experiences: [
      {
        soul: "tavola",
        title: "Cene ed eventi sotto le stelle",
        text:
          "Lucine, candele e tavole lunghe negli spazi aperti: matrimoni, cene private e cerimonie nella corte settecentesca.",
        image: expSummerNight,
        alt: "Tavola illuminata da lucine e candele nella corte di notte",
      },
      {
        soul: "equestre",
        title: "Sfilata di Attacchi d'Epoca",
        text:
          "I Murgesi e i muli Martinesi in parata con le carrozze d'epoca: una scenografia viva che attraversa la campagna.",
        image: expSummerAttacchi,
        alt: "Sfilata di attacchi d'epoca con cavalli Murgesi al tramonto",
      },
    ],
  },
  {
    key: "autumn",
    index: 2,
    label: "Autunno",
    italic: "della raccolta",
    kicker:
      "Terracotta e ruggine: si rientra in masseria con il profumo del frantoio e i sapori che fanno casa.",
    bg: autumnBg,
    bgAlt: "Paesaggio della Murgia in autunno con toni terracotta e ulivi maturi",
    palette: { bg: "#3A2317", fg: "#F0E1CB", accent: "#C97A3F" },
    experiences: [
      {
        soul: "tavola",
        title: "Raccolta delle olive e frantoio",
        text:
          "Si scende fra gli ulivi a raccogliere, poi al frantoio per assaggiare l'olio nuovo: la liturgia della terra di Puglia.",
        image: expAutumnOlives,
        alt: "Raccolta delle olive in autunno con cesto in vimini",
      },
      {
        soul: "tavola",
        title: "Degustazioni della tradizione",
        text:
          "Verdure di campo, paste fatte a mano, formaggi e vini del territorio: un racconto del raccolto, intorno alla tavola.",
        image: expAutumnTable,
        alt: "Antipasti pugliesi della tradizione su tavola di legno",
      },
    ],
  },
  {
    key: "winter",
    index: 3,
    label: "Inverno",
    italic: "intorno al fuoco",
    kicker:
      "La Murgia si fa essenziale: pietra e nero, il camino acceso, i cavalli che ne abitano il silenzio.",
    bg: winterBg,
    bgAlt: "Murgia invernale fra muretti a secco e cielo basso",
    palette: { bg: "#15110F", fg: "#E7DDCF", accent: "#A9802E" },
    experiences: [
      {
        soul: "tavola",
        title: "Il camino e la cucina della tradizione",
        text:
          "Sere lente sotto le volte in pietra, piatti di stagione cucinati lentamente: orecchiette, legumi, carni al fuoco.",
        image: expWinterCamino,
        alt: "Piatti caldi della tradizione invernale pugliese serviti accanto al camino",
      },
      {
        soul: "equestre",
        title: "I cavalli nella Murgia spoglia",
        text:
          "I Murgesi nei pascoli d'inverno fra muretti a secco e nebbia bassa: la Murgia nella sua forma più nuda e nera.",
        image: expWinterHorses,
        alt: "Cavalli Murgesi neri in un pascolo invernale della Murgia",
      },
    ],
  },
];

const MURGESE = "#15110F";
const SOUL_ACCENT: Record<Soul, string> = {
  equestre: MURGESE,
  tavola: "#B5673A",
};
const SOUL_LABEL: Record<Soul, string> = {
  equestre: "Anima equestre",
  tavola: "Anima della tavola",
};

function StageBackground({ stage }: { stage: SeasonStage }) {
  return (
    <div
      data-stage-bg
      data-stage={stage.key}
      className="absolute inset-0"
      style={{ opacity: 0, willChange: "opacity" }}
      aria-hidden
    >
      <img
        src={stage.bg}
        alt=""
        loading="lazy"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(1.05)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${stage.palette.bg} 30%, transparent) 0%, color-mix(in oklab, ${stage.palette.bg} 70%, transparent) 60%, ${stage.palette.bg} 100%)`,
        }}
      />
    </div>
  );
}

function StageContent({ stage }: { stage: SeasonStage }) {
  return (
    <article
      data-stage-content
      data-stage={stage.key}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity: 0, willChange: "opacity, transform" }}
      aria-hidden
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-24">
        {/* Label oversize */}
        <div className="md:col-span-12">
          <p
            className="text-eyebrow mb-3"
            style={{ color: `color-mix(in oklab, ${stage.palette.fg} 65%, transparent)` }}
          >
            {String(stage.index + 1).padStart(2, "0")} / 04 · La stagione {stage.label.toLowerCase()}
          </p>
          <h3
            data-stage-title
            className="font-display font-medium leading-[0.9]"
            style={{
              fontSize: "clamp(3rem, 11vw, 9.5rem)",
              color: stage.palette.fg,
              letterSpacing: "-0.02em",
            }}
          >
            <span>{stage.label}</span>{" "}
            <em style={{ color: stage.palette.accent, fontStyle: "italic" }}>{stage.italic}</em>
          </h3>
          <p
            className="font-display mt-6 max-w-2xl text-lg italic leading-relaxed md:text-xl"
            style={{ color: `color-mix(in oklab, ${stage.palette.fg} 85%, transparent)` }}
          >
            {stage.kicker}
          </p>
        </div>

        {/* Esperienze in equilibrio */}
        <div className="pointer-events-auto md:col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {stage.experiences.map((exp, i) => (
            <figure
              key={exp.title}
              data-stage-exp
              className="group flex flex-col gap-4"
              style={{ transform: "translateY(20px)", opacity: 0 }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: "10px",
                  aspectRatio: "5 / 4",
                  border: `1px solid color-mix(in oklab, ${stage.palette.fg} 18%, transparent)`,
                  boxShadow: `0 30px 70px -40px color-mix(in oklab, ${stage.palette.fg} 55%, transparent)`,
                }}
              >
                <img
                  src={exp.image}
                  alt={exp.alt}
                  loading="lazy"
                  width={1024}
                  height={820}
                  className="absolute inset-0 h-[112%] w-full object-cover"
                  style={{ top: "-6%" }}
                />
                <span
                  className="text-eyebrow absolute left-4 top-4 rounded-full px-3 py-1"
                  style={{
                    background: SOUL_ACCENT[exp.soul],
                    color: exp.soul === "equestre" ? "#E7DDCF" : "#F7F3EC",
                    letterSpacing: "0.2em",
                    fontSize: "0.6rem",
                  }}
                >
                  {SOUL_LABEL[exp.soul]}
                </span>
              </div>
              <figcaption className="flex flex-col gap-2">
                <h4
                  className="font-display font-medium leading-tight"
                  style={{
                    fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)",
                    color: stage.palette.fg,
                  }}
                >
                  {exp.title}
                </h4>
                <p
                  className="max-w-md text-sm leading-relaxed md:text-base"
                  style={{
                    color: `color-mix(in oklab, ${stage.palette.fg} 78%, transparent)`,
                  }}
                >
                  {exp.text}
                </p>
                <span className="sr-only">
                  {/* DA CONFERMARE col cliente: formula, periodi, prezzi */}
                </span>
                {i === 0 ? null : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </article>
  );
}

function SeasonProgress() {
  return (
    <aside
      data-progress
      className="pointer-events-none absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 md:flex md:right-10"
      aria-hidden
    >
      <ol className="flex flex-col gap-5">
        {STAGES.map((s) => (
          <li key={s.key} className="flex items-center gap-3">
            <span
              data-prog-dot
              data-stage={s.key}
              className="block h-[10px] w-[10px] rounded-full border"
              style={{
                borderColor: "color-mix(in oklab, var(--season-fg, #2A2622) 40%, transparent)",
                background: "transparent",
                transition: "background 0.4s ease, border-color 0.4s ease",
              }}
            />
            <span
              data-prog-label
              data-stage={s.key}
              className="text-eyebrow"
              style={{
                color: "color-mix(in oklab, var(--season-fg, #2A2622) 60%, transparent)",
                letterSpacing: "0.32em",
                opacity: 0.5,
                transition: "opacity 0.4s ease, color 0.4s ease",
              }}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function ReducedFallback() {
  return (
    <div className="flex flex-col gap-24 px-6 py-24 md:px-12">
      {STAGES.map((s) => (
        <article key={s.key} className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p
              className="text-eyebrow mb-3"
              style={{ color: `color-mix(in oklab, ${s.palette.fg} 60%, transparent)` }}
            >
              {String(s.index + 1).padStart(2, "0")} · {s.label}
            </p>
            <h3
              className="font-display font-medium leading-[0.95]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", color: s.palette.fg }}
            >
              {s.label} <em style={{ color: s.palette.accent }}>{s.italic}</em>
            </h3>
            <p
              className="font-display mt-4 italic"
              style={{ color: `color-mix(in oklab, ${s.palette.fg} 80%, transparent)` }}
            >
              {s.kicker}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:col-span-7 md:grid-cols-2">
            {s.experiences.map((exp) => (
              <figure key={exp.title} className="flex flex-col gap-3">
                <img
                  src={exp.image}
                  alt={exp.alt}
                  loading="lazy"
                  width={1024}
                  height={820}
                  className="w-full rounded-[10px] object-cover"
                  style={{ aspectRatio: "5 / 4" }}
                />
                <figcaption>
                  <p
                    className="text-eyebrow mb-1"
                    style={{ color: SOUL_ACCENT[exp.soul], letterSpacing: "0.2em" }}
                  >
                    {SOUL_LABEL[exp.soul]}
                  </p>
                  <h4
                    className="font-display font-medium"
                    style={{ fontSize: "1.25rem", color: s.palette.fg }}
                  >
                    {exp.title}
                  </h4>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: `color-mix(in oklab, ${s.palette.fg} 75%, transparent)` }}
                  >
                    {exp.text}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function SeasonsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const stage = root.querySelector<HTMLElement>("[data-pin-stage]");
      if (!stage) return;

      const bgs = gsap.utils.toArray<HTMLElement>("[data-stage-bg]", stage);
      const contents = gsap.utils.toArray<HTMLElement>("[data-stage-content]", stage);
      const dots = gsap.utils.toArray<HTMLElement>("[data-prog-dot]", root);
      const labels = gsap.utils.toArray<HTMLElement>("[data-prog-label]", root);

      // Inizializza prima stage visibile
      if (bgs[0]) gsap.set(bgs[0], { opacity: 1 });
      if (contents[0]) gsap.set(contents[0], { opacity: 1 });

      // Split del titolo grande per mask reveal
      contents.forEach((c) => {
        const t = c.querySelector<HTMLElement>("[data-stage-title]");
        if (t) {
          // Wrap inner spans for mask
          const spans = t.querySelectorAll<HTMLElement>("span, em");
          spans.forEach((s) => {
            s.style.display = "inline-block";
            s.style.willChange = "transform";
          });
        }
      });

      const setRootPalette = (p: SeasonStage["palette"]) => {
        root.style.setProperty("--season-bg", p.bg);
        root.style.setProperty("--season-fg", p.fg);
        root.style.setProperty("--season-accent", p.accent);
      };
      setRootPalette(STAGES[0].palette);

      const mixHex = (a: string, b: string, t: number) =>
        `color-mix(in oklab, ${a} ${Math.round((1 - t) * 100)}%, ${b})`;

      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress * (STAGES.length - 1);
          const i = Math.min(STAGES.length - 2, Math.floor(p));
          const f = Math.min(1, Math.max(0, p - i));

          // Crossfade bg + content (solo i due adiacenti)
          bgs.forEach((el, idx) => {
            let op = 0;
            if (idx === i) op = 1 - f;
            else if (idx === i + 1) op = f;
            el.style.opacity = op.toFixed(3);
          });
          contents.forEach((el, idx) => {
            let op = 0;
            let ty = 0;
            if (idx === i) {
              op = 1 - f;
              ty = -f * 24;
            } else if (idx === i + 1) {
              op = f;
              ty = (1 - f) * 24;
            }
            el.style.opacity = op.toFixed(3);
            el.style.transform = `translateY(${ty.toFixed(2)}px)`;
          });

          // Palette interpolata
          const a = STAGES[i].palette;
          const b = STAGES[i + 1].palette;
          root.style.setProperty("--season-bg", mixHex(a.bg, b.bg, f));
          root.style.setProperty("--season-fg", mixHex(a.fg, b.fg, f));
          root.style.setProperty("--season-accent", mixHex(a.accent, b.accent, f));

          // Progresso laterale
          const dominant = f < 0.5 ? STAGES[i].key : STAGES[i + 1].key;
          dots.forEach((d) => {
            const k = d.getAttribute("data-stage");
            const active = k === dominant;
            d.style.background = active
              ? "color-mix(in oklab, var(--season-fg) 85%, transparent)"
              : "transparent";
            d.style.borderColor = active
              ? "color-mix(in oklab, var(--season-fg) 85%, transparent)"
              : "color-mix(in oklab, var(--season-fg) 35%, transparent)";
          });
          labels.forEach((l) => {
            const k = l.getAttribute("data-stage");
            l.style.opacity = k === dominant ? "1" : "0.45";
          });
        },
      });

      // Mask-reveal del titolo a ogni cambio stage (snap-ish enter)
      contents.forEach((c, idx) => {
        const title = c.querySelector<HTMLElement>("[data-stage-title]");
        const kicker = c.querySelector<HTMLElement>(".font-display.italic");
        const exps = c.querySelectorAll<HTMLElement>("[data-stage-exp]");
        if (!title) return;

        const enterProgress = idx / (STAGES.length - 1);
        const tl = gsap.timeline({ paused: true });
        const wordSpans = title.querySelectorAll<HTMLElement>("span, em");
        gsap.set(wordSpans, { yPercent: 110 });
        gsap.set(exps, { y: 30, opacity: 0 });
        tl.to(wordSpans, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        });
        if (kicker) {
          gsap.set(kicker, { opacity: 0, y: 14 });
          tl.to(kicker, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.3);
        }
        tl.to(exps, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.4);

        ScrollTrigger.create({
          trigger: stage,
          start: () =>
            `+=${Math.max(0, enterProgress * window.innerHeight * 4 - window.innerHeight * 0.4)}`,
          end: () =>
            `+=${enterProgress * window.innerHeight * 4 + window.innerHeight * 0.4}`,
          onEnter: () => tl.play(),
          once: true,
        });
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="esperienze"
      ref={rootRef}
      aria-labelledby="seasons-title"
      className="relative"
      style={{
        background: "var(--season-bg, #EFE9DC)",
        color: "var(--season-fg, #2A2E22)",
        transition: "background 0.4s ease, color 0.4s ease",
      }}
    >
      {/* Intro tipografica */}
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-12 md:px-12 md:pt-40 md:pb-16">
        <p
          className="text-eyebrow mb-6"
          style={{ color: "color-mix(in oklab, var(--season-fg) 60%, transparent)" }}
        >
          08 — Esperienze & stagioni
        </p>
        <h2
          id="seasons-title"
          className="font-display max-w-5xl font-medium leading-[0.95]"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
        >
          Le <em style={{ color: "var(--season-accent)", fontStyle: "italic" }}>stagioni</em>{" "}
          della Murgia
        </h2>
        <p
          className="font-display mt-8 max-w-2xl text-lg italic md:text-xl"
          style={{ color: "color-mix(in oklab, var(--season-fg) 80%, transparent)" }}
        >
          Ogni stagione ha il suo gesto: a cavallo tra gli ulivi, intorno alla
          tavola, nel ritmo lento della Murgia.
        </p>
      </div>

      {/* Ciclo pinnato */}
      <div
        data-pin-stage
        className="relative hidden h-[100svh] w-full overflow-hidden md:block"
      >
        {STAGES.map((s) => (
          <StageBackground key={`bg-${s.key}`} stage={s} />
        ))}
        <SeasonProgress />
        {STAGES.map((s) => (
          <StageContent key={`ct-${s.key}`} stage={s} />
        ))}
      </div>

      {/* Mobile / reduced fallback */}
      <div className="md:hidden">
        <ReducedFallback />
      </div>

      {/* Chiusura — transizione morbida verso Galleria */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg, var(--season-bg, ${STAGES[3].palette.bg}) 0%, ${STAGES[3].palette.bg} 100%)`,
          color: STAGES[3].palette.fg,
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-24 md:flex-row md:items-end md:justify-between md:px-12 md:py-32">
          <p
            className="font-display max-w-2xl leading-tight"
            style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)" }}
          >
            L'anno alla masseria gira sempre: c'è una stagione che ti aspetta,
            con la sua festa e il suo passo.
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href="#eventi" variant="pill">
              Vedi gli eventi →
            </MagneticButton>
            <MagneticButton href="#contatti" variant="link">
              Scrivici →
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stub per evitare unused import quando split-text non serve a runtime
void splitWords;

type SeasonKey = "winter" | "spring" | "summer" | "autumn";

interface SeasonPalette {
  key: SeasonKey;
  label: string;
  bg: string;
  fg: string;
  accent: string;
  meta: string;
}

const PALETTES: Record<SeasonKey, SeasonPalette> = {
  winter: {
    key: "winter",
    label: "Inverno",
    bg: "#1B1916",
    fg: "#F2E8D5",
    accent: "#A9802E",
    meta: "rgba(242,232,213,0.6)",
  },
  spring: {
    key: "spring",
    label: "Primavera",
    bg: "#F7F3EC",
    fg: "#2A2622",
    accent: "#6B7250",
    meta: "rgba(42,38,34,0.6)",
  },
  summer: {
    key: "summer",
    label: "Estate",
    bg: "#EBD9C2",
    fg: "#2A2622",
    accent: "#B5673A",
    meta: "rgba(42,38,34,0.65)",
  },
  autumn: {
    key: "autumn",
    label: "Autunno",
    bg: "#2B1F16",
    fg: "#E7DDCF",
    accent: "#C97A3F",
    meta: "rgba(231,221,207,0.6)",
  },
};

interface EventEntryData {
  id: string;
  season: SeasonKey;
  period: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  side: "left" | "right";
}

const ENTRIES: EventEntryData[] = [
  {
    id: "capodanno",
    season: "winter",
    period: "Gennaio · Inverno",
    title: "Capodanno",
    description:
      "Sotto le volte in pietra, candele e tavole imperiali: la notte più lunga dell'anno diventa una festa che si ricorda.",
    image: winterImg,
    alt: "Tavola di Capodanno illuminata da candele sotto le volte in pietra della masseria",
    side: "right",
  },
  {
    id: "pasqua",
    season: "spring",
    period: "Aprile · Primavera",
    title: "Pasqua",
    description:
      "Il pranzo della tradizione pugliese, fra ulivi e luce nuova: agnello, fave, ricotta, il pane benedetto.",
    image: springImg,
    alt: "Tavola di Pasqua apparecchiata in giardino tra ulivi secolari",
    side: "left",
  },
  {
    id: "primo-maggio",
    season: "summer",
    period: "1° Maggio · Tarda primavera",
    title: "Primo Maggio",
    description:
      "Festa all'aperto: tavola lunga sotto gli ulivi, terracotta calda e profumo di rosmarino. La campagna si apre.",
    image: mayImg,
    alt: "Festa del primo maggio con tavolata all'aperto nella corte della masseria",
    side: "right",
  },
  {
    id: "feste-stagionali",
    season: "autumn",
    period: "Settembre — Novembre · Autunno",
    title: "Feste stagionali",
    description:
      "Vendemmia, raccolto, ricorrenze: l'anno si chiude con la luce dorata della Murgia e i sapori della terra.",
    image: autumnImg,
    alt: "Cesti di uva e spighe davanti alla masseria al tramonto in autunno",
    side: "left",
  },
];

const SEASON_GLYPHS: Record<SeasonKey, ReactElement> = {
  winter: (
    <g>
      <line x1="20" y1="6" x2="20" y2="34" />
      <line x1="6" y1="20" x2="34" y2="20" />
      <line x1="10" y1="10" x2="30" y2="30" />
      <line x1="30" y1="10" x2="10" y2="30" />
    </g>
  ),
  spring: (
    <g>
      <path d="M20 32 C 20 22, 12 18, 8 20 C 12 24, 16 26, 20 32 Z" />
      <path d="M20 32 C 20 22, 28 18, 32 20 C 28 24, 24 26, 20 32 Z" />
      <line x1="20" y1="32" x2="20" y2="14" />
    </g>
  ),
  summer: (
    <g>
      <line x1="20" y1="32" x2="20" y2="10" />
      <path d="M20 12 q -5 4 0 8 q 5 -4 0 -8" />
      <path d="M20 18 q -6 4 0 9 q 6 -4 0 -9" />
      <path d="M20 25 q -7 4 0 9 q 7 -4 0 -9" />
    </g>
  ),
  autumn: (
    <g>
      <path d="M20 8 C 10 14, 10 28, 20 34 C 30 28, 30 14, 20 8 Z" />
      <line x1="20" y1="10" x2="20" y2="34" />
      <line x1="20" y1="18" x2="14" y2="22" />
      <line x1="20" y1="22" x2="26" y2="26" />
    </g>
  ),
};

function SeasonMeter() {
  return (
    <aside
      data-season-meter
      className="pointer-events-none sticky top-1/2 z-20 hidden h-0 w-full -translate-y-1/2 md:block"
      aria-hidden
    >
      <div className="mx-auto flex max-w-7xl items-center justify-end px-6 md:px-12">
        <div
          className="flex flex-col items-center gap-4 rounded-full border px-3 py-5"
          style={{
            borderColor: "color-mix(in oklab, var(--seasons-fg, #2A2622) 25%, transparent)",
            background: "color-mix(in oklab, var(--seasons-bg, #F7F3EC) 70%, transparent)",
            backdropFilter: "blur(8px)",
            color: "var(--seasons-fg, #2A2622)",
            transition: "color 0.6s ease, background 0.6s ease, border-color 0.6s ease",
          }}
        >
          {/* Glifo */}
          <div className="relative h-10 w-10">
            {(Object.keys(PALETTES) as SeasonKey[]).map((k) => (
              <svg
                key={k}
                data-glyph={k}
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="absolute inset-0 h-10 w-10"
                style={{ opacity: k === "winter" ? 1 : 0, transition: "opacity 0.5s ease" }}
              >
                {SEASON_GLYPHS[k]}
              </svg>
            ))}
          </div>

          {/* Anello di progresso */}
          <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1.5"
            />
            <circle
              data-season-ring
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 16}
              strokeDashoffset={2 * Math.PI * 16}
            />
          </svg>

          {/* Label stagione (rotated) */}
          <div className="relative h-28 w-5">
            {(Object.keys(PALETTES) as SeasonKey[]).map((k) => (
              <span
                key={k}
                data-label={k}
                className="text-eyebrow absolute inset-0 flex items-center justify-center"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  opacity: k === "winter" ? 1 : 0,
                  transition: "opacity 0.5s ease",
                  letterSpacing: "0.42em",
                }}
              >
                {PALETTES[k].label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileSeasonBar() {
  return (
    <div
      data-mobile-bar
      className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-2 backdrop-blur md:hidden"
      style={{
        background: "color-mix(in oklab, var(--seasons-bg, #F7F3EC) 80%, transparent)",
        color: "var(--seasons-fg, #2A2622)",
        borderColor: "color-mix(in oklab, var(--seasons-fg, #2A2622) 15%, transparent)",
        transition: "color 0.6s ease, background 0.6s ease, border-color 0.6s ease",
      }}
      aria-hidden
    >
      <div className="relative h-6 w-6">
        {(Object.keys(PALETTES) as SeasonKey[]).map((k) => (
          <svg
            key={k}
            data-mglyph={k}
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="absolute inset-0 h-6 w-6"
            style={{ opacity: k === "winter" ? 1 : 0, transition: "opacity 0.5s ease" }}
          >
            {SEASON_GLYPHS[k]}
          </svg>
        ))}
      </div>
      <div className="relative h-4 flex-1 overflow-hidden">
        {(Object.keys(PALETTES) as SeasonKey[]).map((k) => (
          <span
            key={k}
            data-mlabel={k}
            className="text-eyebrow absolute inset-0 flex items-center"
            style={{ opacity: k === "winter" ? 1 : 0, transition: "opacity 0.5s ease" }}
          >
            {PALETTES[k].label}
          </span>
        ))}
      </div>
      <div
        className="h-[2px] w-24 overflow-hidden rounded-full"
        style={{ background: "color-mix(in oklab, currentColor 18%, transparent)" }}
      >
        <div
          data-mobile-progress
          className="h-full origin-left"
          style={{ background: "currentColor", transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}

function EventEntry({ entry, index }: { entry: EventEntryData; index: number }) {
  const isRight = entry.side === "right";
  return (
    <article
      data-entry
      data-season={entry.season}
      className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16"
    >
      {/* Immagine in arco */}
      <div
        className={`${isRight ? "md:order-2 md:col-span-6 md:col-start-7" : "md:order-1 md:col-span-6 md:col-start-1"}`}
      >
        <div
          data-entry-arch
          className="relative mx-auto w-full max-w-md overflow-hidden"
          style={{
            borderRadius: "50% 50% 0 0 / 38% 38% 0 0",
            border: "1px solid color-mix(in oklab, var(--seasons-fg, #2A2622) 18%, transparent)",
            aspectRatio: "3 / 4",
            boxShadow:
              "0 40px 90px -40px color-mix(in oklab, var(--seasons-fg, #2A2622) 55%, transparent)",
            clipPath: "inset(100% 0 0 0)",
            willChange: "clip-path",
            transition: "border-color 0.6s ease",
          }}
        >
          <img
            data-entry-img
            src={entry.image}
            alt={entry.alt}
            loading="lazy"
            width={1024}
            height={1366}
            className="absolute inset-0 h-[115%] w-full object-cover"
            style={{ top: "-7.5%", willChange: "transform" }}
          />
        </div>
      </div>

      {/* Testo */}
      <div
        className={`${isRight ? "md:order-1 md:col-span-5 md:col-start-1" : "md:order-2 md:col-span-5 md:col-start-8"} flex flex-col gap-5`}
      >
        <p
          data-entry-period
          className="text-eyebrow"
          style={{
            color: "color-mix(in oklab, var(--seasons-fg, #2A2622) 60%, transparent)",
            transition: "color 0.6s ease",
          }}
        >
          {String(index + 1).padStart(2, "0")} — {entry.period}
        </p>
        <h3
          data-entry-title
          className="font-display font-medium leading-[0.95]"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 5rem)",
            color: "var(--seasons-fg, #2A2622)",
            transition: "color 0.6s ease",
          }}
        >
          {entry.title}
        </h3>
        <p
          data-entry-desc
          className="font-display max-w-md text-lg italic md:text-xl"
          style={{
            color: "color-mix(in oklab, var(--seasons-fg, #2A2622) 80%, transparent)",
            transition: "color 0.6s ease",
          }}
        >
          {entry.description}
        </p>
        <div
          data-entry-rule
          className="mt-2 h-px w-24 origin-left"
          style={{
            background: "var(--seasons-accent, #B5673A)",
            transform: "scaleX(0)",
            transition: "background 0.6s ease",
          }}
        />
        <span className="sr-only">{/* DA CONFERMARE col cliente formula e date precise */}</span>
      </div>
    </article>
  );
}

function EquestrianBlock() {
  return (
    <section
      data-equestrian
      data-season="autumn"
      aria-labelledby="equestrian-title"
      className="relative mt-32 overflow-hidden md:mt-48"
    >
      <div
        className="relative h-[70svh] min-h-[480px] w-full overflow-hidden md:h-[85svh]"
        style={{ background: "#1B1410" }}
      >
        <img
          data-equestrian-img
          src={equestrianImg}
          alt="Cavalli Murgesi al galoppo nella campagna della Murgia al tramonto"
          loading="lazy"
          width={1920}
          height={1080}
          className="absolute inset-0 h-[125%] w-full object-cover"
          style={{ top: "-12.5%", willChange: "transform", opacity: 0.85 }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(27,20,16,0.55) 0%, rgba(27,20,16,0.15) 40%, rgba(27,20,16,0.85) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 md:px-12 md:pb-24">
          <p
            className="text-eyebrow mb-5"
            style={{ color: "rgba(231,221,207,0.7)" }}
          >
            Un legame con la terra
          </p>
          <h3
            id="equestrian-title"
            data-equestrian-title
            className="font-display max-w-4xl font-medium leading-[0.95] text-[#E7DDCF]"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)" }}
          >
            La tradizione <em className="text-[#C97A3F]">equestre</em> della Murgia
          </h3>
          <p
            className="font-display mt-6 max-w-2xl text-lg italic leading-relaxed text-[#E7DDCF]/85 md:text-xl"
          >
            Il cavallo Murgese è simbolo di questa terra. La masseria custodisce questo
            legame con passeggiate ed eventi a cavallo fra muretti a secco e ulivi
            secolari. {/* DA CONFERMARE attività e formule esatte */}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SeasonsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Init CSS vars (su root della sezione)
      gsap.set(root, {
        "--seasons-bg": PALETTES.winter.bg,
        "--seasons-fg": PALETTES.winter.fg,
        "--seasons-accent": PALETTES.winter.accent,
      } as gsap.TweenVars);

      const entries = gsap.utils.toArray<HTMLElement>("[data-entry]", root);
      const equestrian = root.querySelector<HTMLElement>("[data-equestrian]");

      // Reveal per ogni voce
      entries.forEach((entry) => {
        const arch = entry.querySelector<HTMLElement>("[data-entry-arch]");
        const img = entry.querySelector<HTMLImageElement>("[data-entry-img]");
        const title = entry.querySelector<HTMLElement>("[data-entry-title]");
        const desc = entry.querySelector<HTMLElement>("[data-entry-desc]");
        const period = entry.querySelector<HTMLElement>("[data-entry-period]");
        const rule = entry.querySelector<HTMLElement>("[data-entry-rule]");

        if (reduced) {
          gsap.set([arch], { clipPath: "inset(0% 0 0 0)" });
          gsap.set([title, desc, period], { opacity: 1, y: 0 });
          gsap.set(rule, { scaleX: 1 });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: entry, start: "top 75%", once: true },
        });
        tl.to(arch, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power3.out" }, 0)
          .from(period, { opacity: 0, y: 14, duration: 0.55, ease: "power2.out" }, 0.1)
          .from(title, { opacity: 0, y: 26, duration: 0.75, ease: "power3.out" }, 0.18)
          .from(desc, { opacity: 0, y: 18, duration: 0.7, ease: "power3.out" }, 0.32)
          .to(rule, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.45);

        // Parallax interno immagine
        gsap.to(img, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: entry, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Equestrian: parallax + reveal titolo
      if (equestrian) {
        const eqImg = equestrian.querySelector<HTMLElement>("[data-equestrian-img]");
        const eqTitle = equestrian.querySelector<HTMLElement>("[data-equestrian-title]");
        if (!reduced && eqImg) {
          gsap.to(eqImg, {
            yPercent: 18,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: equestrian,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        if (eqTitle) {
          gsap.from(eqTitle, {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: equestrian, start: "top 70%", once: true },
          });
        }
      }

      // Morphing cromatico stagionale lungo l'intera sezione
      // 4 keyframe equidistanti
      if (!reduced) {
        const keys: SeasonKey[] = ["winter", "spring", "summer", "autumn"];
        const morphTarget = { t: 0 };
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress * (keys.length - 1);
            const i = Math.min(keys.length - 2, Math.floor(p));
            const f = p - i;
            const a = PALETTES[keys[i]];
            const b = PALETTES[keys[i + 1]];
            const mix = (cA: string, cB: string) =>
              `color-mix(in oklab, ${cA} ${Math.round((1 - f) * 100)}%, ${cB})`;
            root.style.setProperty("--seasons-bg", mix(a.bg, b.bg));
            root.style.setProperty("--seasons-fg", mix(a.fg, b.fg));
            root.style.setProperty("--seasons-accent", mix(a.accent, b.accent));

            // Indicator: stagione "dominante"
            const dominant = f < 0.5 ? keys[i] : keys[i + 1];
            keys.forEach((k) => {
              root
                .querySelectorAll<HTMLElement>(`[data-glyph="${k}"], [data-mglyph="${k}"]`)
                .forEach((el) => (el.style.opacity = k === dominant ? "1" : "0"));
              root
                .querySelectorAll<HTMLElement>(`[data-label="${k}"], [data-mlabel="${k}"]`)
                .forEach((el) => (el.style.opacity = k === dominant ? "1" : "0"));
            });

            const ring = root.querySelector<SVGCircleElement>("[data-season-ring]");
            if (ring) {
              const C = 2 * Math.PI * 16;
              ring.style.strokeDashoffset = String(C * (1 - self.progress));
            }
            const mProg = root.querySelector<HTMLElement>("[data-mobile-progress]");
            if (mProg) mProg.style.transform = `scaleX(${self.progress})`;

            morphTarget.t = self.progress;
          },
        });
      } else {
        // Reduced motion: palette statica per voce
        entries.forEach((entry) => {
          const season = (entry.getAttribute("data-season") as SeasonKey) || "spring";
          const p = PALETTES[season];
          entry.style.setProperty("--seasons-bg", p.bg);
          entry.style.setProperty("--seasons-fg", p.fg);
          entry.style.setProperty("--seasons-accent", p.accent);
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="esperienze"
      ref={rootRef}
      aria-labelledby="seasons-title"
      className="relative overflow-hidden"
      style={{
        background: "var(--seasons-bg, #F7F3EC)",
        color: "var(--seasons-fg, #2A2622)",
        transition: "background 0.6s ease, color 0.6s ease",
      }}
    >
      <MobileSeasonBar />
      <SeasonMeter />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 md:px-12 md:pt-40 md:pb-20">
        <p
          className="text-eyebrow mb-6"
          style={{ color: "color-mix(in oklab, var(--seasons-fg) 60%, transparent)" }}
        >
          07 — Esperienze & stagioni
        </p>
        <h2
          id="seasons-title"
          className="font-display max-w-4xl font-medium leading-[0.95]"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
        >
          Il ciclo <em style={{ color: "var(--seasons-accent)" }}>dell'anno</em>
        </h2>
        <p
          className="font-display mt-8 max-w-xl text-lg italic md:text-xl"
          style={{ color: "color-mix(in oklab, var(--seasons-fg) 80%, transparent)" }}
        >
          Ogni stagione porta la sua festa, alla Masseria Torre Abbondanza.
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-32 px-6 pb-32 md:gap-56 md:px-12 md:pb-48">
        {ENTRIES.map((e, i) => (
          <EventEntry key={e.id} entry={e} index={i} />
        ))}
      </div>

      <EquestrianBlock />

      {/* Chiusura */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <div
          className="flex flex-col items-start gap-8 border-t pt-12 md:flex-row md:items-end md:justify-between"
          style={{
            borderColor: "color-mix(in oklab, var(--seasons-fg, #2A2622) 18%, transparent)",
          }}
        >
          <p
            className="font-display max-w-lg leading-tight"
            style={{
              fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
              color: "var(--seasons-fg)",
            }}
          >
            L'anno alla masseria non finisce mai: c'è sempre una stagione da
            celebrare insieme.
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href="#eventi" variant="pill">
              Scopri i prossimi eventi →
            </MagneticButton>
            <MagneticButton href="#contatti" variant="link">
              Contattaci →
            </MagneticButton>
          </div>
        </div>
        <p className="sr-only">{/* DA CONFERMARE link agenda eventi */}</p>
      </div>
    </section>
  );
}
