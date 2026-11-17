import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "./MagneticButton";
import { splitWords } from "@/lib/split-text";
import { observeRevealElements } from "@/lib/scroll-ready";
import murgeseStudio from "@/assets/murgese-studio.jpg";
import murgeseRider from "@/assets/murgese-rider.jpg";
import murgeseTrotting from "@/assets/murgese-trotting.jpg";
import horseGallop from "@/assets/horse-gallop.jpg";
import horsesTradition from "@/assets/horses-tradition.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* Catalogo cavalli in vendita (dati placeholder — aggiornare con dati reali) */
/* -------------------------------------------------------------------------- */
const HORSES_FOR_SALE = [
  {
    id: "murgese-nero-01",
    name: "Nero di Torre",
    breed: "Cavallo Murgese",
    sex: "Stallone",
    birthYear: 2019,
    height: "165 cm",
    color: "Morello",
    pedigree: "Padre: Fulmine di Torre · Madre: Stella della Murgia",
    training: "Dressage base, attacchi d'epoca, passeggiata",
    temperament: "Docile, coraggioso, adatto ad amatori e professionisti",
    price: "Su richiesta / On request / По запросу",
    image: murgeseStudio,
    videoPlaceholder: true, // TODO: sostituire con URL video reale
  },
  {
    id: "murgese-baio-02",
    name: "Baio Antico",
    breed: "Cavallo Murgese",
    sex: "Castrone",
    birthYear: 2017,
    height: "162 cm",
    color: "Baio scuro",
    pedigree: "Padre: Re della Murgia · Madre: Luna Piena",
    training: "Attacchi d'epoca avanzati, sella, campagna",
    temperament: "Calmo, esperto, ideale per cerimonie e turismo equestre",
    price: "Su richiesta / On request / По запросу",
    image: murgeseRider,
    videoPlaceholder: true,
  },
  {
    id: "murgese-morello-03",
    name: "Ombra del Sud",
    breed: "Cavallo Murgese",
    sex: "Giumenta",
    birthYear: 2020,
    height: "160 cm",
    color: "Morello",
    pedigree: "Padre: Vento Nero · Madre: Rosa dei Trulli",
    training: "Dressage elementare, passeggiata, lavoro in piano",
    temperament: "Sensibile, elegante, potenziale sportivo",
    price: "Su richiesta / On request / По запросу",
    image: murgeseTrotting,
    videoPlaceholder: true,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Componente */
/* -------------------------------------------------------------------------- */
export function HorsesShowcase() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
      el.setAttribute("data-reveal", "soft");
    });
    const cleanupReveal = observeRevealElements(root);

    const ctx = gsap.context(() => {
      /* Mask-reveal titoli */
      root.querySelectorAll<HTMLElement>("[data-mask-title]").forEach((title) => {
        const words = splitWords(title);
        gsap.set(words, { yPercent: reduced ? 0 : 110 });
        ScrollTrigger.create({
          trigger: title,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to(words, {
              yPercent: 0,
              duration: reduced ? 0.2 : 0.65,
              ease: "power2.out",
              stagger: reduced ? 0 : 0.06,
              overwrite: true,
            });
          },
        });
      });

      if (reduced) return;

      /* Parallax hero image */
      const heroImg = root.querySelector<HTMLElement>("[data-hero-img]");
      if (heroImg) {
        gsap.fromTo(
          heroImg,
          { scale: 1.04, yPercent: -3 },
          {
            scale: 1.12,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: heroImg,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      /* Card reveal stagger */
      root.querySelectorAll<HTMLElement>("[data-horse-card]").forEach((card) => {
        gsap.set(card, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 82%",
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              overwrite: true,
            });
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      cleanupReveal();
    };
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="showcase-title" className="relative bg-ivory text-ink">
      {/* ================================================================ */}
      {/* HERO — Full-width cinematic opener */}
      {/* ================================================================ */}
      <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-murgese">
        <img
          data-hero-img
          src={horseGallop}
          alt="Cavallo Murgese nero al galoppo nella Murgia pugliese"
          loading="eager"
          decoding="async"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ willChange: "transform" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--murgese) 50%, transparent) 0%, transparent 40%, color-mix(in oklab, var(--ink) 70%, transparent) 85%, var(--ivory) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-28">
            <p data-fade className="text-eyebrow text-ivory/80">
              Allevamento & Vendita · Breeding & Sales · Разведение и продажа
            </p>
            <h1
              id="showcase-title"
              data-mask-title
              className="mt-6 overflow-hidden font-display font-semibold leading-[1.02] text-ivory"
              style={{
                fontSize: "clamp(2.4rem, 7vw, 5.8rem)",
                letterSpacing: "-0.025em",
                maxWidth: "16ch",
              }}
            >
              Cavalli Murgesi d'eccellenza
            </h1>
            <p
              data-fade
              className="mt-6 max-w-2xl font-display text-lg italic leading-snug text-ivory/85 md:text-xl"
            >
              Alleviamo e selezioniamo cavalli Murgesi dal 2005. Soggetti iscritti al Registro
              Anagrafico, addestrati per dressage, attacchi d'epoca e turismo equestre. Disponibili
              per acquisto in Italia e all'estero.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* INTRO — Breed description (multilingual) */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div data-fade className="md:col-span-5">
            <span className="text-eyebrow text-terracotta">La Razza · The Breed · Порода</span>
            <h2
              data-mask-title
              className="mt-4 overflow-hidden font-display font-medium leading-[1.08] text-ink"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              Il Cavallo Murgese: anima nera della Puglia
            </h2>
          </div>
          <div data-fade className="flex flex-col gap-6 md:col-span-7">
            <p className="font-display text-base leading-relaxed text-ink/80 md:text-lg">
              Il <strong>Cavallo Murgese</strong> è una razza autoctona pugliese, originaria
              dell'altopiano delle Murge tra Bari e Taranto. Riconosciuto ufficialmente nel 1926, è
              un cavallo mesomorfo dal mantello morello o baio scuro, noto per la sua resistenza, il
              carattere docile e l'eleganza naturale nei movimenti.
            </p>
            <p className="font-display text-base leading-relaxed text-ink/80 md:text-lg">
              Alla Masseria Torre Abbondanza alleviamo Murgesi da oltre vent'anni, selezionando
              soggetti con genealogie certificate, attitudine al lavoro in piano e agli attacchi
              d'epoca. Ogni cavallo è cresciuto allo stato semi-brado nei nostri pascoli di Noci,
              garantendo salute, temperamento equilibrato e conformità agli standard di razza.
            </p>
            <div className="mt-4 rounded-lg border border-ink/10 bg-murgese/5 p-6">
              <p className="text-sm font-medium uppercase tracking-widest text-terracotta">
                Export available · Экспорт доступен
              </p>
              <p className="mt-2 font-display text-sm leading-relaxed text-ink/70">
                We ship to EU, UK, Russia, China and worldwide. Health certificates, CITES
                documentation and transport logistics handled by our team. Video consultations
                available via WhatsApp or Zoom.
              </p>
              <p className="mt-2 font-display text-sm leading-relaxed text-ink/70">
                Осуществляем экспорт в ЕС, Великобританию, Россию, Китай и другие страны.
                Ветеринарные сертификаты, документация CITES и логистика транспортировки — наша
                забота. Видеоконсультации через WhatsApp или Zoom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* GALLERY — Photo grid */}
      {/* ================================================================ */}
      <div className="bg-murgese py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p data-fade className="text-eyebrow text-ivory/60">
            Galleria · Gallery · Галерея
          </p>
          <h2
            data-mask-title
            className="mt-4 overflow-hidden font-display font-medium leading-[1.08] text-ivory"
            style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
          >
            I nostri soggetti
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[murgeseStudio, murgeseRider, murgeseTrotting, horseGallop, horsesTradition].map(
              (src, i) => (
                <figure
                  key={i}
                  data-fade
                  className="group relative overflow-hidden rounded-lg shadow-soft"
                  style={{ aspectRatio: i === 0 || i === 3 ? "4 / 3" : "3 / 4" }}
                >
                  <img
                    src={src}
                    alt={`Cavallo Murgese — foto ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </figure>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* VIDEO SECTION — Placeholder for real video embeds */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <p data-fade className="text-eyebrow text-terracotta">
          Video · Видео
        </p>
        <h2
          data-mask-title
          className="mt-4 overflow-hidden font-display font-medium leading-[1.08] text-ink"
          style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
        >
          Guarda i nostri cavalli in movimento
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Video placeholder 1 */}
          <div
            data-fade
            className="relative overflow-hidden rounded-xl bg-murgese/10 shadow-soft"
            style={{ aspectRatio: "16 / 9" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-ivory shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 pl-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="font-display text-sm font-medium text-ink/60">
                  Video: Trotto e movimenti naturali
                </p>
                <p className="mt-1 text-xs text-ink/40">Coming soon · Скоро</p>
              </div>
            </div>
          </div>
          {/* Video placeholder 2 */}
          <div
            data-fade
            className="relative overflow-hidden rounded-xl bg-murgese/10 shadow-soft"
            style={{ aspectRatio: "16 / 9" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-ivory shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 pl-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="font-display text-sm font-medium text-ink/60">
                  Video: Attacchi d'epoca e dressage
                </p>
                <p className="mt-1 text-xs text-ink/40">Coming soon · Скоро</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CATALOGO — Horses for sale cards */}
      {/* ================================================================ */}
      <div className="bg-murgese py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p data-fade className="text-eyebrow text-ivory/60">
            In Vendita · For Sale · Продаются
          </p>
          <h2
            data-mask-title
            className="mt-4 overflow-hidden font-display font-medium leading-[1.08] text-ivory"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Soggetti disponibili
          </h2>
          <p
            data-fade
            className="mt-4 max-w-xl font-display text-base italic text-ivory/70 md:text-lg"
          >
            Tutti i nostri cavalli sono iscritti al Registro Anagrafico del Cavallo Murgese,
            vaccinati, sverminati e dotati di passaporto equino UE. Visite in sede e video-call su
            appuntamento.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            {HORSES_FOR_SALE.map((horse) => (
              <article
                key={horse.id}
                data-horse-card
                className="group flex flex-col overflow-hidden rounded-xl bg-ivory shadow-soft transition-shadow hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
                  <img
                    src={horse.image}
                    alt={`${horse.name} — Cavallo Murgese in vendita`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-terracotta px-3 py-1 text-xs font-bold uppercase tracking-widest text-ivory">
                    {horse.sex}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold text-ink">{horse.name}</h3>
                  <p className="mt-1 text-sm font-medium uppercase tracking-wider text-terracotta">
                    {horse.breed} · {horse.color}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink/70">
                    <div>
                      <dt className="text-xs uppercase text-ink/40">Anno</dt>
                      <dd>{horse.birthYear}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-ink/40">Altezza</dt>
                      <dd>{horse.height}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase text-ink/40">Genealogia</dt>
                      <dd className="text-xs leading-snug">{horse.pedigree}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase text-ink/40">Addestramento</dt>
                      <dd className="text-xs leading-snug">{horse.training}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase text-ink/40">Temperamento</dt>
                      <dd className="text-xs leading-snug">{horse.temperament}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-6">
                    <p className="text-sm font-semibold text-terracotta">{horse.price}</p>
                    <a
                      href={`https://wa.me/393384834318?text=${encodeURIComponent(`Buongiorno, sono interessato/a a ${horse.name} (${horse.id}). Vorrei ricevere maggiori informazioni. / Hello, I'm interested in ${horse.name}. Could you send me more details? / Здравствуйте, меня интересует ${horse.name}. Можете прислать подробности?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-terracotta"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Richiedi info · Inquire · Запросить
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* INFO & SHIPPING — International buyers */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div data-fade>
            <span className="text-eyebrow text-terracotta">
              Informazioni · Information · Информация
            </span>
            <h2
              data-mask-title
              className="mt-4 overflow-hidden font-display font-medium leading-[1.08] text-ink"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)" }}
            >
              Perché scegliere un Murgese di Torre Abbondanza
            </h2>
            <ul className="mt-6 space-y-4 font-display text-sm leading-relaxed text-ink/75 md:text-base">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                <span>
                  <strong>Genealogia certificata:</strong> tutti i soggetti iscritti al Registro
                  Anagrafico con pedigree tracciabile
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                <span>
                  <strong>Allevamento naturale:</strong> pascolo semi-brado nella Murgia,
                  alimentazione controllata, veterinario dedicato
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                <span>
                  <strong>Addestramento professionale:</strong> dressage, attacchi d'epoca, sella e
                  campagna con istruttori qualificati
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                <span>
                  <strong>Documentazione completa:</strong> passaporto UE, vaccinazioni, test
                  sanitari, certificato CITES se richiesto
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                <span>
                  <strong>Supporto post-vendita:</strong> consulenza alimentare, programmi di
                  addestramento, assistenza veterinaria iniziale
                </span>
              </li>
            </ul>
          </div>

          <div data-fade>
            <span className="text-eyebrow text-terracotta">
              Export & Shipping · Экспорт и доставка
            </span>
            <h2
              data-mask-title
              className="mt-4 overflow-hidden font-display font-medium leading-[1.08] text-ink"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)" }}
            >
              Spedizione internazionale
            </h2>
            <div className="mt-6 space-y-6">
              <div className="rounded-lg border border-ink/10 bg-murgese/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
                  Europa / Europe / Европа
                </p>
                <p className="mt-2 font-display text-sm leading-relaxed text-ink/70">
                  Trasporto terrestre certificato con scorte specializzate. Documentazione sanitaria
                  UE inclusa. Consegna in 3-7 giorni lavorativi dalla conferma.
                </p>
              </div>
              <div className="rounded-lg border border-ink/10 bg-murgese/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
                  Russia & CIS / Россия и СНГ
                </p>
                <p className="mt-2 font-display text-sm leading-relaxed text-ink/70">
                  Esperienza consolidata nell'export verso Russia, Kazakistan e paesi CSI. Gestione
                  completa documentazione veterinaria internazionale, quarantena e trasporto
                  aereo/terrestre.
                </p>
              </div>
              <div className="rounded-lg border border-ink/10 bg-murgese/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
                  China & Asia / 中国及亚洲 / Китай и Азия
                </p>
                <p className="mt-2 font-display text-sm leading-relaxed text-ink/70">
                  Protocollo export conforme alle normative cinesi. Quarantena pre-partenza, test
                  sierologici, accompagnamento veterinario durante il trasporto. Consulenza in
                  lingua mandarina disponibile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CTA FINALE */}
      {/* ================================================================ */}
      <div className="bg-murgese py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
          <h2
            data-mask-title
            className="overflow-hidden font-display font-medium leading-[1.08] text-ivory"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            Interessato a uno dei nostri cavalli?
          </h2>
          <p data-fade className="mt-4 font-display text-base italic text-ivory/70 md:text-lg">
            Scrivici per ricevere foto aggiornate, video, pedigree completo e preventivo
            personalizzato. Visite in masseria su appuntamento.
          </p>
          <div
            data-fade
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <MagneticButton
              href="https://wa.me/393384834318?text=Salve%2C%20vorrei%20informazioni%20sui%20cavalli%20Murgesi%20in%20vendita.%20Hello%2C%20I'd%20like%20info%20about%20Murgese%20horses%20for%20sale."
              variant="pill-solid"
              className="w-full sm:w-auto"
            >
              Contattaci su WhatsApp →
            </MagneticButton>
            <a
              href="mailto:info@masseriatorreabbondanza.it?subject=Informazioni%20vendita%20cavalli%20Murgesi"
              className="inline-flex w-full items-center justify-center rounded-full border border-ivory/30 px-8 py-4 text-sm font-medium tracking-wide text-ivory transition-colors hover:border-ivory hover:bg-ivory/10 sm:w-auto"
            >
              Scrivi un'email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
