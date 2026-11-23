import { useEffect, useState } from "react";
import { CalendarDays, Check, Maximize2, MessageCircle, Phone, Users, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import saporiConvivioImg from "@/assets/sapori-convivio.jpg";
import seasonMayImg from "@/assets/season-may.jpg";
import eventsSpaceNightImg from "@/assets/events-space-night.jpg";
import seasonAutumnImg from "@/assets/season-exp-autumn-olives.jpg";
import eventsCeremonyImg from "@/assets/events-ceremony.jpg";
import seasonSpringImg from "@/assets/season-spring.jpg";

export type PosterCategory = "tutti" | "festivita" | "domenica" | "estate" | "autunno";

export interface PosterCourse {
  numeral: string;
  label: string;
  dishes: string;
}

export interface EventPoster {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<PosterCategory, "tutti">;
  categoryLabel: string;
  period: string;
  price: string;
  minGuests: string;
  image: string;
  imageAlt: string;
  /** Optional dedicated graphic flyer asset (replaces photographic poster layout if provided). */
  posterImage?: string;
  highlight: string;
  courses: readonly PosterCourse[];
  includes: string;
  whatsappUrl: string;
}

function makePosterWhatsAppUrl(title: string, period: string): string {
  const message = `Ciao Masseria Torre Abbondanza, vorrei informazioni per prenotare per l'appuntamento "${title}" (${period}).`;
  return `${BUSINESS.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export const PHONE_HREF = `tel:${BUSINESS.phoneTel}`;

export const POSTER_CATEGORIES: readonly { key: PosterCategory; label: string }[] = [
  { key: "tutti", label: "Tutti" },
  { key: "festivita", label: "Festività & Ricorrenze" },
  { key: "domenica", label: "Pranzi della Domenica" },
  { key: "estate", label: "Estate in Corte" },
  { key: "autunno", label: "Autunno & Inverno" },
];

export const EVENT_POSTERS: readonly EventPoster[] = [
  {
    id: "pranzo-domenica-murgia",
    title: "Il Pranzo della Domenica in Masseria",
    subtitle: "La tavola della tradizione pugliese tra ulivi e pietra viva",
    category: "domenica",
    categoryLabel: "Domenica & Feste",
    period: "Domeniche & Giorni Festivi",
    price: "da €50 a persona",
    minGuests: "Su prenotazione · gruppi min. 20 ospiti",
    image: saporiConvivioImg,
    imageAlt: "Tavola imbandita per il pranzo della domenica alla Masseria Torre Abbondanza",
    highlight: "Antipasti di terra · Orecchiette fatte a mano · Arrosti della Murgia",
    courses: [
      {
        numeral: "I",
        label: "Antipasti",
        dishes: "Antipasti della Masseria",
      },
      {
        numeral: "II",
        label: "Primi",
        dishes: "Orecchiette e strascinate fatte a mano al ragù della domenica",
      },
      {
        numeral: "III",
        label: "Secondi",
        dishes: "Arrosti misti della Murgia e involtino al sugo",
      },
      {
        numeral: "IV",
        label: "Dolci & Bevande",
        dishes: "Dolce della casa, vino locale, acqua e caffè",
      },
    ],
    includes: "Vino locale della Murgia, acqua e caffè inclusi · Varianti su richiesta",
    whatsappUrl: makePosterWhatsAppUrl(
      "Il Pranzo della Domenica in Masseria",
      "Domeniche & Giorni Festivi",
    ),
  },
  {
    id: "feste-primavera-maggio",
    title: "Convivio di Primavera & 1° Maggio",
    subtitle: "Profumi di campo, latticini freschi e brace nella corte storica",
    category: "festivita",
    categoryLabel: "Festività",
    period: "25 Aprile · 1° Maggio · Primavera",
    price: "da €55 a persona",
    minGuests: "Su prenotazione · gruppi min. 20 ospiti",
    image: seasonMayImg,
    imageAlt: "Corte fiorita di primavera alla Masseria Torre Abbondanza",
    highlight: "Latticini di Noci · Cavatelli alle erbette · Agnello al forno a legna",
    courses: [
      {
        numeral: "I",
        label: "Antipasti",
        dishes:
          "Selezione di latticini di Noci, salumi murgiani, frittini di campo e focaccia calda",
      },
      {
        numeral: "II",
        label: "Primi",
        dishes: "Cavatelli alle erbette spontanee e primo sale",
      },
      {
        numeral: "III",
        label: "Secondi",
        dishes: "Agnello e carni della Murgia al forno a legna con patate novelle",
      },
      {
        numeral: "IV",
        label: "Dolci & Rosoli",
        dishes: "Millefoglie artigianale e rosoli della masseria",
      },
    ],
    includes: "Vini del territorio e acqua inclusi · Passeggiata tra gli ulivi in fiore",
    whatsappUrl: makePosterWhatsAppUrl(
      "Convivio di Primavera & 1° Maggio",
      "25 Aprile · 1° Maggio · Primavera",
    ),
  },
  {
    id: "sere-estate-corte",
    title: "Sere d'Estate sotto le Lucine della Corte",
    subtitle: "Cene all'aperto tra candele, pietra antica e brezza della Murgia",
    category: "estate",
    categoryLabel: "Estate in Corte",
    period: "Giugno – Settembre · Cena in Corte",
    price: "da €50 a persona",
    minGuests: "Su prenotazione · gruppi min. 20 ospiti",
    image: eventsSpaceNightImg,
    imageAlt: "Corte della Masseria Torre Abbondanza illuminata dalle lucine estive la sera",
    highlight: "Burratina artigianale · Fagottini freschi · Tagliata murgiana alle erbe",
    courses: [
      {
        numeral: "I",
        label: "Antipasti",
        dishes: "Crudo di terra, burratina artigianale, verdure grigliate dell'orto e sfizi caldi",
      },
      {
        numeral: "II",
        label: "Primi",
        dishes: "Fagottini di pasta fresca ai profumi mediterranei",
      },
      {
        numeral: "III",
        label: "Secondi",
        dishes: "Tagliata murgiana alle erbe con contorni di stagione",
      },
      {
        numeral: "IV",
        label: "Dolci & Calici",
        dishes: "Semifreddo artigianale e calice sotto gli ulivi",
      },
    ],
    includes: "Allestimento serale in corte con lucine · Menù su misura per compagnie",
    whatsappUrl: makePosterWhatsAppUrl(
      "Sere d'Estate sotto le Lucine della Corte",
      "Giugno – Settembre · Cena in Corte",
    ),
  },
  {
    id: "sapori-autunno-olio-vino",
    title: "Tavola d'Autunno — Olio Nuovo & Funghi Cardoncelli",
    subtitle: "I sapori intensi della Murgia tra vendemmia, uliveto e camino",
    category: "autunno",
    categoryLabel: "Autunno & Inverno",
    period: "Ottobre – Novembre · Autunno in Murgia",
    price: "da €55 a persona",
    minGuests: "Su prenotazione · gruppi min. 20 ospiti",
    image: seasonAutumnImg,
    imageAlt: "Uliveto e sapori d'autunno alla Masseria Torre Abbondanza",
    highlight: "Olio extravergine nuovo · Tagliolini ai cardoncelli · Brasato al Primitivo",
    courses: [
      {
        numeral: "I",
        label: "Antipasti",
        dishes:
          "Bruschette con olio extravergine nuovo della masseria, cardoncelli gratinati e capocollo",
      },
      {
        numeral: "II",
        label: "Primi",
        dishes: "Tagliolini freschi ai funghi cardoncelli della Murgia",
      },
      {
        numeral: "III",
        label: "Secondi",
        dishes: "Brasato al Primitivo e bombette della tradizione",
      },
      {
        numeral: "IV",
        label: "Dolci d'Autunno",
        dishes: "Tortino caldo al cioccolato e caldarroste",
      },
    ],
    includes: "Degustazione olio nuovo e vini rossi pugliesi inclusi su richiesta",
    whatsappUrl: makePosterWhatsAppUrl(
      "Tavola d'Autunno — Olio Nuovo & Funghi Cardoncelli",
      "Ottobre – Novembre · Autunno in Murgia",
    ),
  },
  {
    id: "menu-immacolata-natale",
    title: "I Convivi delle Feste — Immacolata, Natale & Santo Stefano",
    subtitle: "Convivio invernale sotto le volte storiche riscaldate in pietra",
    category: "festivita",
    categoryLabel: "Festività",
    period: "8 Dicembre · 25–26 Dicembre · Capodanno",
    price: "da €60 a persona",
    minGuests: "Su prenotazione · gruppi e famiglie",
    image: eventsCeremonyImg,
    imageAlt: "Sala storica con volte in pietra allestita per le festività natalizie in masseria",
    highlight: "Pettole & baccalà · Lasagna bianca & ragù nobile · Arrosto delle Feste",
    courses: [
      {
        numeral: "I",
        label: "Antipasti",
        dishes:
          "Gran antipasto delle Feste tra caldi di pettole, baccalà, formaggi stagionati e salumi",
      },
      {
        numeral: "II",
        label: "Primi",
        dishes: "Lasagna bianca della tradizione e orecchiette al ragù nobile",
      },
      {
        numeral: "III",
        label: "Secondi",
        dishes: "Arrosto delle Feste a lunga cottura con contorni della Murgia",
      },
      {
        numeral: "IV",
        label: "Dolci delle Feste",
        dishes: "Dolci natalizi pugliesi, spumante e liquori della casa",
      },
    ],
    includes: "Cartellate, purceddhruzzi, vini selezionati e brindisi delle Feste inclusi",
    whatsappUrl: makePosterWhatsAppUrl(
      "I Convivi delle Feste — Immacolata, Natale & Santo Stefano",
      "8 Dicembre · 25–26 Dicembre · Capodanno",
    ),
  },
  {
    id: "pasqua-pasquetta-masseria",
    title: "Pranzo di Pasqua & Lunedì dell'Angelo",
    subtitle: "La festa della rinascita tra prato, cavalli Murgesi e grandi tavolate",
    category: "festivita",
    categoryLabel: "Festività",
    period: "Pasqua & Pasquetta in Masseria",
    price: "da €60 a persona",
    minGuests: "Su prenotazione · gruppi e famiglie",
    image: seasonSpringImg,
    imageAlt: "Pranzo di Pasqua e Pasquetta immerso nel verde della Masseria Torre Abbondanza",
    highlight: "Benedizione pasquale · Cavatelli ragù d'agnello · Pastiera artigianale",
    courses: [
      {
        numeral: "I",
        label: "Antipasti",
        dishes:
          "Benedizione pasquale pugliese, salumi, ricotta fresca, carciofi e rustici della tradizione",
      },
      {
        numeral: "II",
        label: "Primi",
        dishes: "Cavatelli fatti a mano al ragù di agnello e cardoncelli",
      },
      {
        numeral: "III",
        label: "Secondi",
        dishes: "Agnello della Murgia al forno con patate e lampascioni",
      },
      {
        numeral: "IV",
        label: "Dolci Pasquali",
        dishes: "Pastiera artigianale, colomba e moscato",
      },
    ],
    includes: "Possibilità di visita ai cavalli Murgesi in scuderia su richiesta",
    whatsappUrl: makePosterWhatsAppUrl(
      "Pranzo di Pasqua & Lunedì dell'Angelo",
      "Pasqua & Pasquetta in Masseria",
    ),
  },
] as const;

interface PosterFlyerVisualProps {
  poster: EventPoster;
  aspectClassName?: string;
  onExpand?: () => void;
  expanded?: boolean;
}

/**
 * Riproduce visivamente una locandina tipografica/fotografica della Masseria
 * (o mostra direttamente l'immagine grafica se `poster.posterImage` è valorizzato).
 */
export function PosterFlyerVisual({
  poster,
  aspectClassName = "aspect-[3/4]",
  onExpand,
  expanded = false,
}: PosterFlyerVisualProps) {
  const imageSrc = poster.posterImage ?? poster.image;

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-lg bg-[color:var(--murgese)] text-ivory shadow-soft",
        aspectClassName,
      )}
    >
      <img
        src={imageSrc}
        alt={poster.imageAlt}
        loading={expanded ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Vignetta editoriale scura per leggibilità tipografica da locandina */}
      {!poster.posterImage && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,17,15,0.88) 0%, rgba(21,17,15,0.52) 32%, rgba(21,17,15,0.68) 62%, rgba(21,17,15,0.95) 100%)",
          }}
        />
      )}

      {/* Doppio filetto ornamentale interno stile stampa d'epoca */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[4px] border border-gold/45"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-[2px] border border-ivory/20"
      />

      {!poster.posterImage && (
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
          {/* Header locandina */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-medium tracking-[0.26em] uppercase text-gold">
              Masseria Torre Abbondanza · Noci
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-ivory/25 bg-[color:var(--murgese)]/80 px-3 py-1 text-[10px] font-medium tracking-[0.18em] uppercase text-ivory/90 backdrop-blur-sm">
              <CalendarDays className="h-3 w-3 text-gold" />
              {poster.period}
            </span>
          </div>

          {/* Corpo menù stilizzato dentro la locandina */}
          <div className="my-auto flex flex-col items-center py-3 text-center">
            <h3
              className={cn(
                "font-display font-semibold leading-[1.05] text-ivory",
                expanded ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
              )}
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}
            >
              {poster.title}
            </h3>

            <div aria-hidden className="my-3 h-px w-16 bg-gold/65" />

            <ul className="w-full max-w-[30ch] space-y-1.5 text-left">
              {poster.courses.map((course) => (
                <li
                  key={course.numeral}
                  className={cn(
                    "flex items-baseline gap-2 leading-snug text-ivory/90",
                    expanded ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs",
                  )}
                >
                  <span className="shrink-0 font-display italic text-gold">{course.numeral}.</span>
                  <span className="line-clamp-2">{course.dishes}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer locandina con prezzo e pulsante zoom */}
          <div className="flex items-center justify-between gap-3 border-t border-ivory/15 pt-3">
            <span className="inline-flex items-center rounded-full bg-terracotta px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-ivory shadow-sm">
              {poster.price}
            </span>
            {onExpand && (
              <button
                type="button"
                onClick={onExpand}
                aria-label={`Apri dettaglio menù ${poster.title}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ivory/35 bg-[color:var(--murgese)]/85 px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Maximize2 className="h-3 w-3" />
                Dettaglio menù
              </button>
            )}
          </div>
        </div>
      )}

      {poster.posterImage && onExpand && (
        <button
          type="button"
          onClick={onExpand}
          aria-label={`Apri dettaglio menù ${poster.title}`}
          className="absolute right-5 bottom-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-ivory/35 bg-[color:var(--murgese)]/85 px-3.5 py-2 text-xs font-medium tracking-wider uppercase text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Dettaglio menù
        </button>
      )}
    </div>
  );
}

interface PosterContactButtonsProps {
  poster: EventPoster;
  className?: string;
}

/**
 * Coppia obbligatoria di pulsanti di prenotazione diretta presenti su ogni locandina:
 * 1) Prenota su WhatsApp (con messaggio precompilato sul menù specifico)
 * 2) Chiama per prenotare (+39 338 483 4318)
 */
export function PosterContactButtons({ poster, className }: PosterContactButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <a
        href={poster.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-ivory shadow-sm transition-colors hover:bg-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        <span>Prenota su WhatsApp</span>
      </a>
      <a
        href={PHONE_HREF}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/25 bg-ivory px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-ink transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
      >
        <Phone className="h-4 w-4 shrink-0 text-terracotta" />
        <span>Chiama per prenotare · {BUSINESS.phone}</span>
      </a>
    </div>
  );
}

export function EventPostersShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<PosterCategory>("tutti");
  const [expandedPoster, setExpandedPoster] = useState<EventPoster | null>(null);

  useEffect(() => {
    if (!expandedPoster) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedPoster(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedPoster]);

  const filteredPosters =
    selectedCategory === "tutti"
      ? EVENT_POSTERS
      : EVENT_POSTERS.filter((poster) => poster.category === selectedCategory);

  return (
    <section className="relative bg-ivory text-ink">
      {/* Introduzione editoriale in apertura */}
      <div className="relative overflow-hidden bg-[color:var(--murgese)] pb-20 pt-28 text-ivory md:pb-28 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 20%, color-mix(in oklab, var(--terracotta) 35%, transparent), transparent 70%), radial-gradient(50% 50% at 15% 80%, color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <p className="text-eyebrow text-gold">Appuntamenti a Tavola · Menù & Ricorrenze</p>
          <h1
            className="mt-4 max-w-4xl font-display font-semibold leading-[1.02] text-ivory"
            style={{
              fontSize: "clamp(2.3rem, 6vw, 5.2rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Appuntamenti <em className="italic text-gold">a tavola</em> e menù delle ricorrenze
          </h1>
          <p className="mt-6 max-w-2xl font-display text-lg leading-relaxed text-ivory/80 md:text-xl">
            I pranzi della domenica, le grandi festività in famiglia, le sere d'estate nella corte
            illuminata e i menù stagionali della Masseria Torre Abbondanza. Per ogni appuntamento
            puoi riservarci il tuo tavolo direttamente su WhatsApp o telefonicamente.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs tracking-wider uppercase text-ivory/75">
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-2">
              <Users className="h-3.5 w-3.5 text-gold" />
              Gruppi min. 20 ospiti · almeno 2 giorni prima
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-2">
              <Check className="h-3.5 w-3.5 text-gold" />
              Varianti Veg · Vegan · Gluten-Free · Bimbi
            </span>
          </div>
        </div>
      </div>

      {/* Filtri + Griglia Appuntamenti */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div
          className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6"
          role="group"
          aria-label="Filtra appuntamenti per periodo o occasione"
        >
          <div className="flex flex-wrap gap-2">
            {POSTER_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium tracking-[0.14em] uppercase transition-colors",
                    active
                      ? "bg-[color:var(--murgese)] text-ivory"
                      : "border border-ink/20 bg-transparent text-ink/75 hover:border-terracotta hover:text-terracotta",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs tracking-[0.16em] uppercase text-ink/55">
            {filteredPosters.length}{" "}
            {filteredPosters.length === 1 ? "proposta in programma" : "proposte in programma"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosters.map((poster) => (
            <article
              key={poster.id}
              className="flex flex-col overflow-hidden rounded-xl border border-ink/12 bg-background p-4 shadow-soft transition-shadow duration-300 hover:shadow-lg sm:p-5"
            >
              <PosterFlyerVisual
                poster={poster}
                aspectClassName="aspect-[3/4]"
                onExpand={() => setExpandedPoster(poster)}
              />

              <div className="flex flex-1 flex-col pt-5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-terracotta">
                  <span>{poster.categoryLabel}</span>
                  <span className="text-ink/55">{poster.minGuests}</span>
                </div>

                <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">
                  {poster.title}
                </h2>
                <p className="mt-1.5 font-display text-sm italic text-ink/75">{poster.subtitle}</p>

                <dl className="mt-4 space-y-2 border-y border-ink/10 py-4 text-sm">
                  {poster.courses.map((course) => (
                    <div key={course.numeral} className="grid grid-cols-[auto_1fr] gap-x-2.5">
                      <dt className="font-display font-semibold italic text-terracotta">
                        {course.label}:
                      </dt>
                      <dd className="font-sans text-ink/85">{course.dishes}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-3 text-xs leading-relaxed text-ink/65">
                  {poster.includes} · Menù Bambini, Vegetariani, Vegani e Senza Glutine su
                  richiesta.
                </p>

                <div className="mt-auto pt-5">
                  <PosterContactButtons poster={poster} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox per leggere la locandina ingrandita */}
      {expandedPoster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="poster-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--murgese)]/90 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setExpandedPoster(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gold/30 bg-ivory p-5 text-ink shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpandedPoster(null)}
              aria-label="Chiudi dettaglio menù"
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-ivory text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-6">
                <PosterFlyerVisual
                  poster={expandedPoster}
                  expanded
                  aspectClassName="aspect-[3/4]"
                />
              </div>

              <div className="flex flex-col md:col-span-6">
                <span className="text-eyebrow text-terracotta">{expandedPoster.period}</span>
                <h2
                  id="poster-modal-title"
                  className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl"
                >
                  {expandedPoster.title}
                </h2>
                <p className="mt-2 font-display text-base italic text-ink/75">
                  {expandedPoster.subtitle}
                </p>

                <div className="mt-4 inline-flex w-fit items-center rounded-full bg-terracotta/12 px-4 py-1.5 text-sm font-semibold text-terracotta">
                  {expandedPoster.price} · {expandedPoster.minGuests}
                </div>

                <dl className="mt-5 space-y-2.5 border-y border-ink/12 py-4 text-sm">
                  {expandedPoster.courses.map((course) => (
                    <div key={course.numeral}>
                      <dt className="font-display font-semibold text-ink">
                        {course.numeral}. {course.label}
                      </dt>
                      <dd className="text-ink/80">{course.dishes}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-3 text-xs text-ink/65">
                  {expandedPoster.includes} · Menù Bambini e varianti alimentari su misura.
                </p>

                <PosterContactButtons poster={expandedPoster} className="mt-6" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
