import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import antipastiImg from "@/assets/kitchen-antipasti.jpg";
import primiImg from "@/assets/kitchen-primi.jpg";
import secondiImg from "@/assets/kitchen-secondi.jpg";
import dolciImg from "@/assets/kitchen-dolci.jpg";

const WA_PHONE = "393384834318";
const TEL_HREF = "tel:+393384834318";
const WA_MSG = encodeURIComponent(
  "Ciao, vorrei informazioni su menù e prezzi per un gruppo di almeno 20 persone. Data orientativa: ___.",
);
const WA_HREF = `https://wa.me/${WA_PHONE}?text=${WA_MSG}`;

interface CourseItem {
  numeral: string;
  course: string;
  oversizedWord: string;
  dishTitle: string;
  description: string;
  src: string;
  alt: string;
  align: "left" | "right";
}

const COURSES: CourseItem[] = [
  {
    numeral: "I",
    course: "Antipasti di terra",
    oversizedWord: "ANTIPASTI",
    dishTitle: "Carrellata della tradizione pugliese",
    description:
      "Olive fritte, salumi e formaggi locali, parmigiana, focaccia calda, purè di fave bianche e peperoni fritti. Una carrellata generosa che apre il pasto come un racconto del territorio.",
    src: antipastiImg,
    alt: "Antipasti pugliesi: tagliere di focaccia, salumi, formaggi e olive",
    align: "right",
  },
  {
    numeral: "II",
    course: "Primi della casa",
    oversizedWord: "PRIMI",
    dishTitle: "Nido di linguine, carne e funghi",
    description:
      "Primi di terra e di mare nella tradizione pugliese. Il piatto simbolo della masseria: il nido di linguine con ragù di carne e funghi cardoncelli della Murgia.",
    src: primiImg,
    alt: "Primo piatto: nido di linguine con ragù di carne e funghi",
    align: "left",
  },
  {
    numeral: "III",
    course: "Secondi",
    oversizedWord: "SECONDI",
    dishTitle: "Brasato di carne al vino",
    description:
      "Carni selezionate della tradizione, cotture lente al vino rosso pugliese e profumi di erbe spontanee. Una memoria di campagna che torna in tavola.",
    src: secondiImg,
    alt: "Secondo: brasato di carne al vino su purè con timo fresco",
    align: "right",
  },
  {
    numeral: "IV",
    course: "Dolci fatti a mano",
    oversizedWord: "DOLCI",
    dishTitle: "Cheesecake all'amaretto",
    description:
      "Dolci della casa preparati artigianalmente per ogni ricorrenza. La cheesecake all'amaretto chiude il convivio con equilibrio e dolcezza.",
    src: dolciImg,
    alt: "Dolce della casa: fetta di cheesecake all'amaretto",
    align: "left",
  },
];

const SERVICE_TAGS = [
  "Solo su prenotazione",
  "Per cerimonie ed eventi",
  "Menù su misura",
  "Veg · Vegan · Gluten-free",
];

export function KitchenSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>("[data-intro]");
      gsap.set(intro, { opacity: 0, y: 30 });
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

      // Reveal fluido per ciascuna delle 4 portate (Antipasti, Primi, Secondi, Dolci)
      const rows = root.querySelectorAll<HTMLElement>("[data-course-row]");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cucina"
      ref={rootRef}
      aria-labelledby="kitchen-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità cromatica dalla Sez.04 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--olive) 8%, transparent), transparent)",
        }}
      />
      <div aria-hidden className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-40">
        {/* Intro */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p data-intro className="text-eyebrow text-ink/70">
              04 — La cucina
            </p>
            <h2
              id="kitchen-title"
              data-intro
              className="mt-6 font-display font-semibold leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              La <em className="text-terracotta">terra</em> in tavola
            </h2>
          </div>

          <div className="flex flex-col gap-6 md:col-span-5 md:pt-6">
            <p data-intro className="font-sans text-base leading-relaxed text-ink/80 md:text-lg">
              Tradizione pugliese e materie prime fresche del territorio, attraversate da un tocco
              creativo. La nostra cucina apre su prenotazione: ogni menù viene composto su misura,
              pensato per cerimonie, eventi e grandi occasioni.
            </p>

            <p
              data-intro
              className="font-display text-lg italic leading-snug text-ink/70 md:text-xl"
            >
              La stessa Murgia che alleva i <span style={{ color: "var(--murgese)" }}>cavalli</span>{" "}
              e piega gli ulivi arriva, ogni giorno, nel piatto.
            </p>

            <ul data-intro className="flex flex-wrap gap-2" aria-label="Servizi della cucina">
              {SERVICE_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="text-eyebrow rounded-full border border-ink/15 px-3 py-1.5 text-ink/70"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filetto */}
        <div aria-hidden className="mt-16 h-px w-full bg-ink/15 md:mt-24" />

        {/* Sequenza completa delle 4 portate: I Antipasti, II Primi, III Secondi, IV Dolci */}
        <div
          className="mt-16 divide-y divide-ink/10 md:mt-24"
          aria-label="Le quattro portate della masseria"
        >
          {COURSES.map((item) => {
            const isLeft = item.align === "left";
            return (
              <article
                key={item.numeral}
                data-course-row
                className="group grid grid-cols-1 items-center gap-8 py-12 md:grid-cols-12 md:gap-12 md:py-20"
              >
                {/* Immagine portata */}
                <figure
                  className={`relative overflow-hidden rounded-sm shadow-soft md:row-start-1 ${
                    isLeft ? "md:col-start-1 md:col-end-8" : "md:col-start-6 md:col-end-13"
                  }`}
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <figcaption className="absolute bottom-4 left-4 rounded-sm bg-ivory/92 px-3.5 py-1.5 text-eyebrow text-ink shadow-sm backdrop-blur-sm md:bottom-6 md:left-6">
                    {item.dishTitle}
                  </figcaption>
                </figure>

                {/* Testo portata */}
                <div
                  className={`flex flex-col gap-5 md:row-start-1 ${
                    isLeft
                      ? "md:col-start-8 md:col-end-13 md:pl-4"
                      : "md:col-start-1 md:col-end-6 md:pr-4"
                  }`}
                >
                  <div className="inline-flex items-center gap-3 text-eyebrow text-terracotta">
                    <span className="font-display text-base italic">{item.numeral}</span>
                    <span aria-hidden className="h-px w-8 bg-terracotta/50" />
                    <span>{item.course}</span>
                  </div>

                  <h3
                    className="font-display font-semibold leading-[0.92] text-ink transition-colors duration-500 group-hover:text-terracotta"
                    style={{
                      fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {item.oversizedWord}
                  </h3>

                  <p className="font-display text-xl italic text-ink/90">{item.dishTitle}</p>

                  <p className="max-w-md font-sans text-base leading-relaxed text-ink/80 md:text-lg">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Messaggio + CTA: menù e prezzi su richiesta per gruppi ≥20 */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:mt-24 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p
              data-intro
              className="font-display text-2xl italic leading-snug text-ink md:text-3xl"
            >
              La carta cambia con le stagioni e con la materia disponibile.
            </p>
            <p
              data-intro
              className="mt-4 font-sans text-base leading-relaxed text-ink/75 md:text-lg"
            >
              Menù e prezzi si definiscono insieme, su richiesta, per{" "}
              <strong className="text-ink">gruppi di almeno 20 ospiti</strong>: cerimonie, eventi
              privati, cene aziendali, matrimoni. Scrivici su WhatsApp con la data e il numero di
              persone: prepariamo una proposta su misura.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:col-span-5 md:items-end md:justify-end">
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <MagneticButton
                href={WA_HREF}
                variant="pill"
                target="_blank"
                rel="noopener noreferrer"
              >
                Scrivici su WhatsApp →
              </MagneticButton>
              <MagneticButton href={TEL_HREF} variant="link">
                Oppure chiama +39 338 483 4318
              </MagneticButton>
            </div>
            <p className="text-eyebrow text-ink/55">Risposta in giornata · senza impegno</p>
          </div>
        </div>
      </div>

      {/* Ponte verso il pilastro equestre */}
      <div className="mx-auto max-w-7xl px-6 pb-32 md:px-12 md:pb-40">
        <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-lg italic text-ink/65 md:text-xl">
            L'altra anima della masseria.
          </p>
          <MagneticButton
            href="#cavalli"
            variant="link"
            ariaLabel="L'altra anima: i cavalli Murgesi"
          >
            <span style={{ color: "var(--murgese)" }}>I cavalli Murgesi →</span>
          </MagneticButton>
        </div>
      </div>

      {/* Uscita verso Sez.06 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--stone) 60%, transparent))",
        }}
      />
    </section>
  );
}
