import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import antipastiImg from "@/assets/kitchen-antipasti.jpg";
import primiImg from "@/assets/kitchen-primi.jpg";
import secondiImg from "@/assets/kitchen-secondi.jpg";
import dolciImg from "@/assets/kitchen-dolci.jpg";

interface DishExample {
  id: string;
  course: string;
  name: string;
  description: string;
  image: string;
  alt: string;
}

const EXAMPLES: DishExample[] = [
  {
    id: "antipasti",
    course: "Antipasti di terra",
    name: "Carrellata della tradizione",
    description:
      "Olive fritte, salumi e formaggi locali, parmigiana, focaccia, purè di fave bianche, peperoni fritti.",
    image: antipastiImg,
    alt: "Tagliere di antipasti pugliesi: focaccia, salumi, formaggi, olive e purè di fave",
  },
  {
    id: "primi",
    course: "Primo signature",
    name: "Nido di linguine, carne e funghi",
    description:
      "Linguine intrecciate a nido, ragù bianco di carne e funghi: il piatto-firma della casa.",
    image: primiImg,
    alt: "Nido di linguine con ragù di carne e funghi",
  },
  {
    id: "secondi",
    course: "Secondo",
    name: "Brasato della tradizione",
    description:
      "Cottura lenta, riduzione di vino del territorio, memoria di campagna.",
    image: secondiImg,
    alt: "Brasato di carne in salsa scura su purè",
  },
  {
    id: "dolci",
    course: "Dolce della casa",
    name: "Cheesecake all'amaretto",
    description:
      "Crema morbida, amaretti croccanti, caramello: l'ultima carezza del pasto.",
    image: dolciImg,
    alt: "Fetta di cheesecake all'amaretto con caramello",
  },
];

interface Datum {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const DATA: Datum[] = [
  { value: 48, suffix: "H", label: "Preavviso minimo per prenotare" },
  { value: 20, suffix: "", label: "Persone minimo a tavola" },
  { value: 50, prefix: "€\u2009", suffix: "", label: "A persona, menù su misura da concordare" },
];

function CountUp({ datum }: { datum: Datum }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = String(datum.value);
      return;
    }
    const obj = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          n: datum.value,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
        });
      },
    });
    return () => st.kill();
  }, [datum.value]);

  return (
    <span className="tabular-nums">
      {datum.prefix}
      <span ref={ref}>0</span>
      {datum.suffix}
    </span>
  );
}

export function MenuSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(EXAMPLES[0].id);
  const active = EXAMPLES.find((e) => e.id === activeId) ?? EXAMPLES[0];

  // Intro reveal
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>("[data-menu-intro]");
      gsap.set(intro, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(intro, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });

      const data = root.querySelectorAll<HTMLElement>("[data-datum]");
      gsap.set(data, { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: data[0],
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(data, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
          });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="menu"
      ref={rootRef}
      aria-labelledby="menu-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità cromatica dalla Sez.05 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--stone) 50%, transparent), transparent)",
        }}
      />
      <div aria-hidden className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-40">
        {/* Testata */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p data-menu-intro className="text-eyebrow text-ink/70">
              05 — I sapori
            </p>
            <h2
              id="menu-title"
              data-menu-intro
              className="mt-6 font-display font-semibold leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              La tavola su <em className="text-terracotta">misura</em>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-6">
            <p
              data-menu-intro
              className="font-display text-lg italic leading-snug text-ink/75 md:text-xl"
            >
              Niente carta: una cucina pugliese pensata e composta per la tua
              occasione, dal primo assaggio all'ultimo dolce.
            </p>
          </div>
        </div>

        {/* Filetto */}
        <div aria-hidden className="mt-16 h-px w-full bg-ink/15 md:mt-24" />

        {/* B) Cosa portiamo in tavola */}
        <div data-menu-intro className="mt-16 md:mt-24">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <h3
              className="font-display text-ink"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.1,
              }}
            >
              Cosa portiamo in tavola
            </h3>
            <p className="text-eyebrow text-ink/55">
              Esempi della nostra cucina · il menù si compone insieme
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-12 md:gap-16">
            {/* Lista esempi */}
            <ul className="flex flex-col divide-y divide-ink/10 md:col-span-7">
              {EXAMPLES.map((ex) => {
                const isActive = ex.id === activeId;
                return (
                  <li key={ex.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(ex.id)}
                      onFocus={() => setActiveId(ex.id)}
                      onClick={() => setActiveId(ex.id)}
                      aria-pressed={isActive}
                      className="group flex w-full flex-col gap-2 py-6 text-left transition-colors md:py-8"
                    >
                      <span className="text-eyebrow text-ink/55">
                        {ex.course}
                      </span>
                      <span
                        className={`font-display leading-snug transition-colors ${
                          isActive ? "text-terracotta" : "text-ink"
                        }`}
                        style={{
                          fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)",
                          letterSpacing: "-0.012em",
                        }}
                      >
                        {ex.name}
                      </span>
                      <span className="max-w-xl font-sans text-base leading-relaxed text-ink/70">
                        {ex.description}
                      </span>
                      {/* Mobile-only thumbnail */}
                      <span
                        aria-hidden
                        className="mt-3 block overflow-hidden md:hidden"
                        style={{ borderRadius: "10px", aspectRatio: "4 / 3" }}
                      >
                        <img
                          src={ex.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Vetrina sticky con crossfade */}
            <aside
              aria-hidden
              className="sticky top-28 hidden h-fit md:col-span-5 md:block"
            >
              <div
                className="relative overflow-hidden bg-stone shadow-soft"
                style={{
                  borderRadius: "10px",
                  border: "1px solid var(--stone)",
                  aspectRatio: "4 / 5",
                }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={active.id}
                    src={active.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, color-mix(in oklab, var(--ink) 55%, transparent))",
                  }}
                />
              </div>
              <div className="mt-5 px-1">
                <span className="text-eyebrow text-ink/55">{active.course}</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 font-display text-xl italic leading-snug text-ink md:text-2xl"
                  >
                    {active.name}
                  </motion.p>
                </AnimatePresence>
              </div>
            </aside>
          </div>
        </div>

        {/* Filetto */}
        <div aria-hidden className="mt-20 h-px w-full bg-ink/15 md:mt-28" />

        {/* C) Come funziona */}
        <div className="mt-16 md:mt-24">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <h3
              data-menu-intro
              className="font-display text-ink"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.1,
              }}
            >
              Come funziona
            </h3>
            <p data-menu-intro className="text-eyebrow text-ink/55">
              La tavola su prenotazione
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-16">
            {DATA.map((d) => (
              <div
                key={d.label}
                data-datum
                className="flex flex-col gap-4 border-t border-ink/20 pt-6"
              >
                <div
                  className="font-display font-semibold leading-none text-ink"
                  style={{
                    fontSize: "clamp(3.4rem, 7vw, 6rem)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  <CountUp datum={d} />
                </div>
                <p className="max-w-[22ch] font-sans text-base leading-snug text-ink/70 md:text-lg">
                  {d.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-12 md:items-center md:gap-12">
            <p className="font-display text-lg italic leading-snug text-ink/75 md:col-span-7 md:text-xl">
              La masseria apre la cucina per cerimonie, battesimi, compleanni,
              matrimoni ed eventi. Ogni menù si concorda su misura.
            </p>
            <ul
              className="flex flex-wrap gap-2 md:col-span-5 md:justify-end"
              aria-label="Opzioni di menù"
            >
              {["Veg / Vegan / Gluten-free", "Menù bambini"].map((tag) => (
                <li
                  key={tag}
                  className="text-eyebrow rounded-full border border-ink/15 px-3 py-1.5 text-ink/70"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 md:mt-16 md:flex-row md:items-center md:justify-between">
            <span className="text-eyebrow text-ink/55">
              Prenotazione almeno 48 ore prima · minimo 20 persone · da € 50 a
              persona
            </span>
            <MagneticButton href="#contatti" variant="pill-solid">
              Richiedi il tuo menù →
            </MagneticButton>
          </div>
        </div>

        {/* Ponte verso Cavalli (Murgese) */}
        <div className="mt-24 md:mt-32">
          <p
            className="font-display italic text-ink/65"
            style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1.4 }}
          >
            Finita la tavola, resta l'altra anima:{" "}
            <a
              href="#cavalli"
              className="not-italic underline-offset-4 transition-colors hover:underline"
              style={{ color: "var(--murgese)" }}
            >
              i cavalli →
            </a>
          </p>
        </div>
      </div>

      {/* Uscita: vira al nero Murgese per consegnare al pilastro equestre */}
      <div className="pb-32 md:pb-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--murgese) 22%, transparent))",
        }}
      />
    </section>
  );
}
