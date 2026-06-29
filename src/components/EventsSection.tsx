import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicOpener } from "./CinematicOpener";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import weddingImg from "@/assets/events-wedding.jpg";
import privateImg from "@/assets/events-private.jpg";
import ceremonyImg from "@/assets/events-ceremony.jpg";
import hallImg from "@/assets/events-hall.jpg";
import gardenImg from "@/assets/events-garden.jpg";
import carriageImg from "@/assets/events-carriage.jpg";

interface Occasion {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  align: "left" | "right";
}

const OCCASIONS: Occasion[] = [
  {
    id: "matrimoni",
    eyebrow: "I · Matrimoni",
    title: "Il giorno che ricorderete",
    body:
      "Nella cornice di una masseria del Settecento, il sì si pronuncia tra muri di pietra calda, ulivi secolari e un cielo che, sulla Murgia, sembra non finire mai. Cerimonia in giardino, ricevimento nella sala storica o sotto le luci sospese tra gli alberi.",
    image: weddingImg,
    alt: "Sposi sotto un arco fiorito al tramonto nella masseria",
    align: "right",
  },
  {
    id: "ricevimenti",
    eyebrow: "II · Ricevimenti",
    title: "La festa che cuciamo per voi",
    body:
      "Dal piccolo numero a venti, ai grandi ricevimenti, l'accoglienza è familiare e la regia su misura. La cucina nasce dalla terra, i vini sono quelli di casa, gli allestimenti si adattano a voi, dentro e fuori.",
    image: privateImg,
    alt: "Tavolata privata di sera sotto luci sospese tra gli ulivi",
    align: "left",
  },
  {
    id: "ricorrenze",
    eyebrow: "III · Battesimi & compleanni",
    title: "Le ricorrenze di famiglia",
    body:
      "Battesimi, comunioni, compleanni importanti, anniversari. Le occasioni che si raccontano per anni meritano un luogo che le ricordi: tavole imperiali sotto gli ulivi, candele al tramonto, il tempo che rallenta.",
    image: ceremonyImg,
    alt: "Tavolata familiare apparecchiata in giardino, sotto agli ulivi all'ora dorata",
    align: "right",
  },
  {
    id: "feste-private",
    eyebrow: "IV · Feste private & aziendali",
    title: "Quando l'occasione chiama",
    body:
      "Cene private, feste stagionali, ricorrenze di lavoro: la masseria si apre per voi e si trasforma in quello che vi serve. Formati e servizi modulabili, una sola promessa — accoglienza vera.",
    image: hallImg,
    alt: "Sala interna della masseria con volte in pietra e tavole apparecchiate",
    align: "left",
  },
];

export function EventsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Titoli con mask-reveal per parola
      const titles = root.querySelectorAll<HTMLElement>("[data-mask-title]");
      titles.forEach((title) => {
        const words = splitWords(title);
        gsap.set(words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: title,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(words, {
              yPercent: 0,
              duration: reduced ? 0.2 : 1,
              ease: "power3.out",
              stagger: reduced ? 0 : 0.06,
            });
          },
        });
      });

      // Blocchi testo in dissolvenza
      const reveals = root.querySelectorAll<HTMLElement>("[data-fade]");
      gsap.set(reveals, { opacity: 0, y: 24 });
      reveals.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.3 : 0.9,
              ease: "power3.out",
            });
          },
        });
      });

      if (reduced) return;

      // Parallax per le immagini full-bleed delle occasioni
      const parallaxImgs = root.querySelectorAll<HTMLElement>("[data-occasion-image]");
      parallaxImgs.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.05 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Parallax sottile sulla foto carrozza
      const carriage = root.querySelector<HTMLElement>("[data-carriage-image]");
      if (carriage) {
        gsap.fromTo(
          carriage,
          { yPercent: -4, scale: 1.06 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: carriage,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="eventi"
      ref={rootRef}
      aria-labelledby="events-title"
      className="relative bg-ivory"
    >
      <h2 id="events-title" className="sr-only">
        Eventi e matrimoni alla Masseria Torre Abbondanza
      </h2>

      {/* MOMENTO A — Opener (risalita dal nero Murgese all'alba calda) */}
      <CinematicOpener />

      {/* MOMENTO B — Le occasioni: prosa editoriale + foto full-bleed con parallax */}
      <div className="relative">
        {OCCASIONS.map((occ, i) => {
          const isFirst = i === 0;
          const textOnLeft = occ.align === "left";
          return (
            <article
              key={occ.id}
              className={`relative ${isFirst ? "pt-24 md:pt-40" : "pt-20 md:pt-32"} pb-20 md:pb-32`}
            >
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-12">
                {/* Text */}
                <div
                  data-fade
                  className={`flex flex-col gap-6 ${
                    textOnLeft
                      ? "md:order-1 md:col-span-5"
                      : "md:order-2 md:col-span-5 md:col-start-8"
                  }`}
                >
                  <span className="text-eyebrow text-ink/60">{occ.eyebrow}</span>
                  <h3
                    data-mask-title
                    className="font-display font-semibold leading-[1.05] text-ink"
                    style={{
                      fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {occ.title}
                  </h3>
                  <p className="max-w-xl font-display text-lg leading-relaxed text-ink/80 md:text-xl">
                    {occ.body}
                  </p>
                </div>

                {/* Image */}
                <div
                  className={`relative overflow-hidden shadow-soft ${
                    textOnLeft
                      ? "md:order-2 md:col-span-6 md:col-start-7"
                      : "md:order-1 md:col-span-6"
                  }`}
                  style={{
                    borderRadius: "10px",
                    border: "1px solid color-mix(in oklab, var(--stone) 80%, transparent)",
                    aspectRatio: "4 / 3",
                  }}
                >
                  <img
                    data-occasion-image
                    src={occ.image}
                    alt={occ.alt}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="absolute inset-0 h-[112%] w-full object-cover"
                    style={{ top: "-6%", willChange: "transform" }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 65%, color-mix(in oklab, var(--ink) 22%, transparent))",
                    }}
                  />
                </div>
              </div>
            </article>
          );
        })}

        {/* Gli spazi — micro-row editoriale */}
        <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 md:pb-32">
          <div className="grid grid-cols-1 gap-10 border-t border-ink/15 pt-16 md:grid-cols-2 md:gap-12">
            <figure data-fade className="flex flex-col gap-5">
              <div
                className="relative overflow-hidden shadow-soft"
                style={{
                  borderRadius: "10px",
                  border: "1px solid color-mix(in oklab, var(--stone) 80%, transparent)",
                  aspectRatio: "5 / 4",
                }}
              >
                <img
                  src={gardenImg}
                  alt="Giardino della masseria con ulivi secolari al tramonto"
                  loading="lazy"
                  width={1280}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="flex flex-col gap-2">
                <span className="text-eyebrow text-ink/55">Il giardino</span>
                <p className="font-display text-lg italic text-ink/75 md:text-xl">
                  Ulivi secolari, muretti a secco, tramonti lunghi sulla Murgia.
                </p>
              </figcaption>
            </figure>
            <figure data-fade className="flex flex-col gap-5">
              <div
                className="relative overflow-hidden shadow-soft"
                style={{
                  borderRadius: "10px",
                  border: "1px solid color-mix(in oklab, var(--stone) 80%, transparent)",
                  aspectRatio: "5 / 4",
                }}
              >
                <img
                  src={hallImg}
                  alt="Sala interna della masseria con volte in pietra e tavole apparecchiate"
                  loading="lazy"
                  width={1280}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <figcaption className="flex flex-col gap-2">
                <span className="text-eyebrow text-ink/55">La sala storica</span>
                <p className="font-display text-lg italic text-ink/75 md:text-xl">
                  Volte settecentesche, luce calda, tavole imperiali al riparo
                  dal vento.
                </p>
              </figcaption>
            </figure>
          </div>
          {/* DA CONFERMARE: capienze e dettagli tecnici degli spazi */}
        </div>
      </div>

      {/* MOMENTO C — Tocco equestre discreto */}
      <aside
        aria-labelledby="events-carriage-title"
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--ivory) 0%, color-mix(in oklab, var(--murgese) 92%, var(--ink)) 28%, color-mix(in oklab, var(--murgese) 95%, var(--ink)) 72%, var(--ivory) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-40">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
            <figure
              data-fade
              className="relative overflow-hidden shadow-soft md:col-span-7"
              style={{
                borderRadius: "10px",
                border: "1px solid color-mix(in oklab, var(--ivory) 18%, transparent)",
                aspectRatio: "4 / 3",
              }}
            >
              <img
                data-carriage-image
                src={carriageImg}
                alt="Carrozza d'epoca trainata da cavalli Murgesi neri all'ingresso della masseria all'ora dorata"
                loading="lazy"
                width={1280}
                height={960}
                className="absolute inset-0 h-[112%] w-full object-cover"
                style={{ top: "-6%", willChange: "transform" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--murgese) 55%, transparent))",
                }}
              />
            </figure>

            <div data-fade className="flex flex-col gap-6 md:col-span-5">
              <span
                className="text-eyebrow"
                style={{ color: "color-mix(in oklab, var(--ivory) 75%, transparent)" }}
              >
                Un dettaglio d'eccezione
              </span>
              <h3
                id="events-carriage-title"
                data-mask-title
                className="font-display font-medium leading-[1.08] text-ivory"
                style={{
                  fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                  letterSpacing: "-0.015em",
                }}
              >
                L'arrivo con gli attacchi d'epoca
              </h3>
              <p className="max-w-md font-display text-base italic leading-relaxed text-ivory/80 md:text-lg">
                Per chi lo desidera, la cerimonia può aprirsi con un arrivo
                d'eccezione: una carrozza d'epoca trainata dai nostri cavalli{" "}
                <span style={{ color: "color-mix(in oklab, var(--ivory) 95%, var(--gold))" }}>
                  Murgesi
                </span>
                . Una scenografia rara, sobria, profondamente del territorio.
              </p>
              <p className="text-eyebrow text-ivory/55">
                {/* DA CONFERMARE: servizio attacchi su richiesta */}
                Servizio su richiesta
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOMENTO D — CTA finale */}
      <div className="relative bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-6 py-28 md:flex-row md:items-end md:justify-between md:gap-16 md:px-12 md:py-36">
          <div data-fade className="max-w-2xl">
            <p
              className="font-display font-medium leading-[1.1] text-ink"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Scriveteci la vostra occasione.{" "}
              <em className="text-terracotta">Cucieremo</em> l'esperienza
              attorno alle vostre persone.
            </p>
          </div>
          <div data-fade className="flex w-full flex-shrink-0 md:w-auto">
            <MagneticButton href="#contatti" variant="pill-solid" className="w-full md:w-auto">
              Richiedi informazioni per il tuo evento →
            </MagneticButton>
          </div>
        </div>

        {/* Uscita verso Sez. 08 — registro caldo */}
        <div
          aria-hidden
          className="pointer-events-none h-32"
          style={{
            background:
              "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--olive) 14%, transparent))",
          }}
        />
      </div>
    </section>
  );
}
