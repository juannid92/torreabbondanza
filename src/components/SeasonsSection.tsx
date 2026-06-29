import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
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
          background: `linear-gradient(180deg, color-mix(in oklab, ${stage.palette.bg} 25%, transparent) 0%, color-mix(in oklab, ${stage.palette.bg} 70%, transparent) 60%, ${stage.palette.bg} 100%)`,
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
      aria-hidden={false}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-20">
        <div className="md:col-span-12">
          <p
            data-stage-eyebrow
            className="text-eyebrow mb-3"
            style={{ color: `color-mix(in oklab, ${stage.palette.fg} 65%, transparent)` }}
          >
            {String(stage.index + 1).padStart(2, "0")} / 04 · La stagione {stage.label.toLowerCase()}
          </p>
          <h3
            data-stage-title
            className="font-display font-medium leading-[0.9]"
            style={{
              fontSize: "clamp(3rem, 11vw, 9rem)",
              color: stage.palette.fg,
              letterSpacing: "-0.02em",
            }}
          >
            <span data-title-word style={{ display: "inline-block" }}>{stage.label}</span>{" "}
            <em
              data-title-word
              style={{ display: "inline-block", color: stage.palette.accent, fontStyle: "italic" }}
            >
              {stage.italic}
            </em>
          </h3>
          <p
            data-stage-kicker
            className="font-display mt-6 max-w-2xl text-lg italic leading-relaxed md:text-xl"
            style={{ color: `color-mix(in oklab, ${stage.palette.fg} 85%, transparent)` }}
          >
            {stage.kicker}
          </p>
        </div>

        <div className="pointer-events-auto md:col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {stage.experiences.map((exp) => (
            <figure
              key={exp.title}
              data-stage-exp
              className="flex flex-col gap-4"
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
                  style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.55rem)", color: stage.palette.fg }}
                >
                  {exp.title}
                </h4>
                <p
                  className="max-w-md text-sm leading-relaxed md:text-base"
                  style={{ color: `color-mix(in oklab, ${stage.palette.fg} 78%, transparent)` }}
                >
                  {exp.text}
                </p>
                <span className="sr-only">{/* DA CONFERMARE col cliente: formula, periodi, prezzi */}</span>
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
                color: "color-mix(in oklab, var(--season-fg, #2A2622) 70%, transparent)",
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

function StaticFallback() {
  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      {STAGES.map((s) => (
        <article
          key={s.key}
          className="relative overflow-hidden rounded-[14px]"
          style={{ background: s.palette.bg, color: s.palette.fg }}
        >
          <img
            src={s.bg}
            alt={s.bgAlt}
            loading="lazy"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative grid grid-cols-1 gap-8 p-8 md:grid-cols-12 md:gap-10 md:p-12">
            <div className="md:col-span-5">
              <p
                className="text-eyebrow mb-3"
                style={{ color: `color-mix(in oklab, ${s.palette.fg} 60%, transparent)` }}
              >
                {String(s.index + 1).padStart(2, "0")} · {s.label}
              </p>
              <h3
                className="font-display font-medium leading-[0.95]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                {s.label}{" "}
                <em style={{ color: s.palette.accent, fontStyle: "italic" }}>{s.italic}</em>
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
                      style={{ fontSize: "1.2rem" }}
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
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const stage = root.querySelector<HTMLElement>("[data-pin-stage]");
      if (!stage) return;

      const bgs = gsap.utils.toArray<HTMLElement>("[data-stage-bg]", stage);
      const contents = gsap.utils.toArray<HTMLElement>("[data-stage-content]", stage);
      const dots = gsap.utils.toArray<HTMLElement>("[data-prog-dot]", root);
      const labels = gsap.utils.toArray<HTMLElement>("[data-prog-label]", root);

      if (bgs[0]) gsap.set(bgs[0], { opacity: 1 });
      if (contents[0]) gsap.set(contents[0], { opacity: 1 });

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
        end: () => `+=${window.innerHeight * (isMobile ? 2.5 : 4)}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress * (STAGES.length - 1);
          const i = Math.min(STAGES.length - 2, Math.floor(p));
          const f = Math.min(1, Math.max(0, p - i));

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

          const a = STAGES[i].palette;
          const b = STAGES[i + 1].palette;
          root.style.setProperty("--season-bg", mixHex(a.bg, b.bg, f));
          root.style.setProperty("--season-fg", mixHex(a.fg, b.fg, f));
          root.style.setProperty("--season-accent", mixHex(a.accent, b.accent, f));

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
            l.style.opacity = k === dominant ? "1" : "0.5";
          });
        },
      });

      // Reveal kinetic ad ogni stage
      contents.forEach((c, idx) => {
        const titleWords = c.querySelectorAll<HTMLElement>("[data-title-word]");
        const kicker = c.querySelector<HTMLElement>("[data-stage-kicker]");
        const exps = c.querySelectorAll<HTMLElement>("[data-stage-exp]");

        gsap.set(titleWords, { yPercent: 110 });
        if (kicker) gsap.set(kicker, { opacity: 0, y: 14 });
        gsap.set(exps, { y: 30, opacity: 0 });

        const tl = gsap.timeline({ paused: true });
        tl.to(titleWords, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        });
        if (kicker) {
          tl.to(kicker, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.3);
        }
        tl.to(exps, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.4);

        const enterT = idx / (STAGES.length - 1);
        ScrollTrigger.create({
          trigger: stage,
          start: () =>
            `top+=${Math.max(0, enterT * window.innerHeight * (isMobile ? 2.5 : 4) - 100)} top`,
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
          once: true,
        });
      });
    }, root);

    return () => ctx.revert();
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

      {/* Ciclo pinnato — desktop */}
      <div
        data-pin-stage
        className="relative block h-[100svh] w-full overflow-hidden"
      >
        {STAGES.map((s) => (
          <StageBackground key={`bg-${s.key}`} stage={s} />
        ))}
        <SeasonProgress />
        {STAGES.map((s) => (
          <StageContent key={`ct-${s.key}`} stage={s} />
        ))}
      </div>

      {/* Fallback statico solo per reduced-motion */}
      <div className="hidden motion-reduce:block">
        <StaticFallback />
      </div>

      {/* Chiusura — transizione morbida verso Galleria */}
      <div
        className="relative"
        style={{
          background: STAGES[3].palette.bg,
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