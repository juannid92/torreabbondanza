import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Images,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { scrollToSection } from "@/hooks/use-lenis";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import weddingImg from "@/assets/events-wedding.jpg";
import tablePanoImg from "@/assets/events-table-pano.jpg";
import imperialTableImg from "@/assets/story-oggi.jpg";
import stoneCourtImg from "@/assets/story-pietra.jpg";
import nightCourtImg from "@/assets/events-space-night.jpg";
import facadeImg from "@/assets/story-calce-pietra.jpg";
import horseRideImg from "@/assets/primavera-alessio/primavera-esperienza.webp";
import carriageImg from "@/assets/events-carriage.jpg";
import horsePortalImg from "@/assets/horses-tradition.jpg";
import dessertImg from "@/assets/kitchen-dolci.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* Dati delle 7 Occasioni                                                     */
/* -------------------------------------------------------------------------- */
interface EventGalleryFrame {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface EventOccasion {
  id: string;
  indexLabel: string;
  title: string;
  shortTitle: string;
  formValue:
    | "matrimonio"
    | "cerimonia"
    | "battesimo"
    | "compleanno"
    | "festa-privata"
    | "altro"
    | "esperienza-equestre";
  spaces: string;
  phrase: string;
  description: string;
  highlights: readonly string[];
  ambientTint: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  gallery: readonly EventGalleryFrame[];
}

const EVENTS_DATA: readonly EventOccasion[] = [
  {
    id: "matrimoni",
    indexLabel: "01",
    title: "Matrimoni",
    shortTitle: "Matrimoni",
    formValue: "matrimonio",
    spaces: "Corte degli Ulivi · Sala del '700",
    phrase: "Il sì sotto gli ulivi, la festa che non finisce.",
    description:
      "Ricevimenti fino a 250 ospiti tra la corte esterna in pietra bianca, il pergolato estivo in cannicciato e la sala storica del Settecento.",
    highlights: [
      "Corte degli ulivi e sala storica con volte e travi del Settecento",
      "Cucina pugliese interna con menù su misura (varianti vegetariane, vegane, gluten-free e bimbi)",
      "Possibilità di ingresso in carrozza d'epoca con i nostri cavalli Murgesi",
    ],
    ambientTint: "rgba(181, 103, 58, 0.24)",
    image: weddingImg,
    imageAlt:
      "Tavoli tondi imbanditi con candele e fiori bianchi sotto il pergolato in cannicciato e gli archi in pietra della masseria",
    width: 948,
    height: 801,
    gallery: [
      {
        src: weddingImg,
        alt: "Ricevimento nuziale nella corte storica della Masseria Torre Abbondanza",
        caption: "Banchetto sotto il pergolato e gli archi della corte",
        width: 948,
        height: 801,
      },
      {
        src: tablePanoImg,
        alt: "Sala interna illuminata con travi in legno e centrotavola floreali",
        caption: "Sala storica del '700 preparata a festa",
        width: 1008,
        height: 541,
      },
      {
        src: carriageImg,
        alt: "Carrozza d'epoca trainata da un cavallo Murgese nero davanti alla facciata",
        caption: "Arrivo degli sposi con gli attacchi d'epoca su richiesta",
        width: 968,
        height: 957,
      },
    ],
  },
  {
    id: "cerimonie",
    indexLabel: "02",
    title: "Cerimonie",
    shortTitle: "Cerimonie",
    formValue: "cerimonia",
    spaces: "Arcate in Pietra · Giardino",
    phrase: "Civili, simboliche: i riti che vi somigliano.",
    description:
      "Comunioni, cresime, promesse e cerimonie civili o simboliche accolte tra le arcate storiche e il verde della Murgia di Noci.",
    highlights: [
      "Spazi dedicati al rito all'aperto tra gli archi e le pietre settecentesche",
      "Pranzi e cene su prenotazione per gruppi da 20 fino a 250 ospiti",
      "Coordinamento diretto con la famiglia Giunta dal primo sopralluogo alla tavola",
    ],
    ambientTint: "rgba(169, 128, 46, 0.22)",
    image: stoneCourtImg,
    imageAlt:
      "Corte settecentesca con portico ad archi bianchi, coppi in terracotta e grandi vasi di agrumi",
    width: 924,
    height: 541,
    gallery: [
      {
        src: stoneCourtImg,
        alt: "Corte ad archi della masseria in pietra imbiancata a calce",
        caption: "Le arcate in pietra e i vasi di agrumi della corte",
        width: 924,
        height: 541,
      },
      {
        src: weddingImg,
        alt: "Allestimento elegante sotto il pergolato in legno e cannicciato",
        caption: "Allestimento tavoli per cerimonie all'aperto",
        width: 948,
        height: 801,
      },
      {
        src: imperialTableImg,
        alt: "Tavola lunga imperiale nella sala principale della masseria",
        caption: "Tavola lunga nella sala interna per le grandi famiglie",
        width: 1200,
        height: 1120,
      },
    ],
  },
  {
    id: "battesimi",
    indexLabel: "03",
    title: "Battesimi",
    shortTitle: "Battesimi",
    formValue: "battesimo",
    spaces: "Sala Storica · Tavola Imperiale",
    phrase: "Le prime feste di famiglia, al riparo della pietra.",
    description:
      "Una lunga tavola raccolta attorno ai nuovi arrivati, con cucina espressa della tradizione pugliese e portate dedicate ai più piccoli.",
    highlights: [
      "Sala accogliente in tutte le stagioni con ampi tavoli conviviali",
      "Menù stagionale dai 50 euro a persona con varianti dedicate ai bambini",
      "Cortile tranquillo e sicuro immerso nella campagna di Noci",
    ],
    ambientTint: "rgba(181, 103, 58, 0.19)",
    image: imperialTableImg,
    imageAlt:
      "Sala interna con tavola lunga imperiale apparecchiata con candele, runner e tovagliato bianco",
    width: 1200,
    height: 1120,
    gallery: [
      {
        src: imperialTableImg,
        alt: "Tavola imperiale apparecchiata nella sala settecentesca",
        caption: "La tavola unica di famiglia al centro della sala",
        width: 1200,
        height: 1120,
      },
      {
        src: stoneCourtImg,
        alt: "Cortile esterno protetto dalle mura bianche della masseria",
        caption: "La corte interna per il benvenuto agli ospiti",
        width: 924,
        height: 541,
      },
      {
        src: tablePanoImg,
        alt: "Vista panoramica della sala interna con luce calda e travi a vista",
        caption: "Vista completa della sala tra travi e lunette ad arco",
        width: 1008,
        height: 541,
      },
    ],
  },
  {
    id: "compleanni",
    indexLabel: "04",
    title: "Compleanni",
    shortTitle: "Compleanni",
    formValue: "compleanno",
    spaces: "Sala Storica · Corte Serale",
    phrase: "Gli anni che contano, candele e brindisi sotto le stelle.",
    description:
      "Diciottesimi, feste di laurea, trent'anni e ricorrenze speciali: tavola su misura, vini del territorio, dolci fatti a mano e spazio alla musica.",
    highlights: [
      "Menù costruito insieme con almeno 2 giorni di anticipo (min. 20 ospiti)",
      "Dolci artigianali della casa e brindisi nella sala calda o nella corte serale",
      "Ambiente autentico e riservato lontano dal rumore cittadino",
    ],
    ambientTint: "rgba(169, 128, 46, 0.24)",
    image: tablePanoImg,
    imageAlt:
      "Panoramica della sala ricevimenti illuminata con lampadario floreale e tavoli tondi imbanditi",
    width: 1008,
    height: 541,
    gallery: [
      {
        src: tablePanoImg,
        alt: "Sala ricevimenti illuminata con tavoli tondi e drappeggi",
        caption: "Sala interna con illuminazione calda serale",
        width: 1008,
        height: 541,
      },
      {
        src: nightCourtImg,
        alt: "Tavola sotto l'ulivo illuminato nella corte di sera",
        caption: "Brindisi notturni sotto l'ulivo nella corte",
        width: 864,
        height: 900,
      },
      {
        src: dessertImg,
        alt: "Tortino al cioccolato artigianale guarnito con fragole fresche",
        caption: "I dolci artigianali preparati nella cucina interna",
        width: 960,
        height: 675,
      },
    ],
  },
  {
    id: "feste-private",
    indexLabel: "05",
    title: "Feste Private",
    shortTitle: "Feste Private",
    formValue: "festa-privata",
    spaces: "Corte Serale · Uso Esclusivo",
    phrase: "Aziendali, intime, a sorpresa: la masseria è vostra.",
    description:
      "Cene aziendali, rimpatriate, anniversari e serate su invito: l'intera cornice della masseria dedicata esclusivamente al vostro gruppo.",
    highlights: [
      "Prenotazione dedicata a gruppi a partire da 20 persone",
      "Scelta tra cena nella sala interna o serata nella corte tra gli ulivi",
      "Parcheggio interno e posizione comoda tra Noci, Alberobello e Putignano",
    ],
    ambientTint: "rgba(169, 128, 46, 0.2)",
    image: nightCourtImg,
    imageAlt: "Corte della masseria illuminata di notte sotto l'ulivo con tavola preparata",
    width: 864,
    height: 900,
    gallery: [
      {
        src: nightCourtImg,
        alt: "La corte esterna illuminata di sera con tavola e ulivo secolare",
        caption: "L'ulivo e la corte di pietra alla luce della sera",
        width: 864,
        height: 900,
      },
      {
        src: tablePanoImg,
        alt: "Interno caldo della sala storica pronto per una cena privata",
        caption: "Sala storica per cene aziendali ed eventi privati",
        width: 1008,
        height: 541,
      },
      {
        src: imperialTableImg,
        alt: "Tavola conviviale lunga apparecchiata con bicchieri e candele",
        caption: "Tavolata conviviale unica su misura",
        width: 1200,
        height: 1120,
      },
    ],
  },
  {
    id: "la-masseria",
    indexLabel: "06",
    title: "La Masseria",
    shortTitle: "La Masseria",
    formValue: "altro",
    spaces: "Dimora del '700 · Noci, Murgia",
    phrase:
      "La cornice: pietra, ulivi, cortile, lunga tavola. Scegliete il momento, noi facciamo il resto.",
    description:
      "Una masseria storica del Settecento con sala interna, corte imbiancata a calce, cucina di famiglia e scuderie di cavalli Murgesi nella Murgia barese.",
    highlights: [
      "Architettura rurale pugliese autentica conservata dalla famiglia Giunta",
      "Possibilità di integrare esperienze in scuderia o pranzi della tradizione",
      "Consulenza diretta per qualsiasi ricorrenza o progetto su misura",
    ],
    ambientTint: "rgba(107, 114, 80, 0.25)",
    image: facadeImg,
    imageAlt:
      "Muri a calce, corte, pilastri in pietra e tetti in terracotta della Masseria Torre Abbondanza a Noci",
    width: 1024,
    height: 767,
    gallery: [
      {
        src: facadeImg,
        alt: "Architettura esterna in pietra a calce e tetti in terracotta della Masseria Torre Abbondanza",
        caption: "Muri a calce, pilastri in pietra e tetti in terracotta della Masseria",
        width: 1024,
        height: 767,
      },
      {
        src: stoneCourtImg,
        alt: "Corte interna ad archi con tegole in terracotta e piante di agrumi",
        caption: "Il portico in pietra bianca lungo la corte",
        width: 924,
        height: 541,
      },
      {
        src: weddingImg,
        alt: "La corte allestita per un grande ricevimento tra cannicciato e archi",
        caption: "La masseria allestita nei giorni di festa",
        width: 948,
        height: 801,
      },
    ],
  },
  {
    id: "esperienza-equestre",
    indexLabel: "07",
    title: "Esperienza Equestre",
    shortTitle: "Equitazione",
    formValue: "esperienza-equestre",
    spaces: "Allevamento Murgesi · Attacchi d'Epoca",
    phrase: "Cavalli Murgesi al pascolo, passeggiate e attacchi d'epoca tra i muretti a secco.",
    description:
      "Visite alle scuderie dell'allevamento Torre Abbondanza (Registro Anagrafico T.A.), passeggiate tra gli ulivi e arrivi in carrozza d'epoca.",
    highlights: [
      "Cavalli Murgesi e muli Martinesi allevati direttamente in masseria",
      "Passeggiate guidate lungo i sentieri rurali e visite in scuderia su prenotazione",
      "Sfilata di Attacchi d'Epoca e ingresso in carrozza per cerimonie",
    ],
    ambientTint: "rgba(181, 103, 58, 0.22)",
    image: horseRideImg,
    imageAlt:
      "Cavaliere in sella a un cavallo Murgese dal manto nero morello lungo il pascolo delimitato dai muretti a secco",
    width: 1500,
    height: 998,
    gallery: [
      {
        src: horseRideImg,
        alt: "Cavallo Murgese al passo nei pascoli della Masseria Torre Abbondanza",
        caption: "Passeggiate equestri tra pascoli e muretti a secco",
        width: 1500,
        height: 998,
      },
      {
        src: carriageImg,
        alt: "Carrozza tradizionale trainata dal cavallo Murgese nel piazzale della masseria",
        caption: "Gli attacchi d'epoca guidati davanti alla facciata",
        width: 968,
        height: 957,
      },
      {
        src: horsePortalImg,
        alt: "Cavallo Murgese nero posizionato simmetricamente davanti al portale storico ad arco",
        caption: "Esemplari T.A. nel cortile padronale della masseria",
        width: 1800,
        height: 1198,
      },
    ],
  },
] as const;

interface SpaceShowcaseItem {
  id: "sala" | "corte";
  title: string;
  subtitle: string;
  description: string;
  colSpanClass: string;
  views: readonly [EventGalleryFrame, EventGalleryFrame];
}

const SPACES_SHOWCASE: readonly SpaceShowcaseItem[] = [
  {
    id: "sala",
    title: "La Sala Storica del '700",
    subtitle: "Capienza fino a 250 ospiti · Tutta la stagione",
    description:
      "Travi a vista, archi in pietra e luce calda per lunghi tavoli imperiali o tavoli tondi curati dal nostro staff di cucina.",
    colSpanClass: "lg:col-span-7",
    views: [
      {
        src: tablePanoImg,
        alt: "Sala interna principale con travi in legno, lampadario floreale e tavoli apparecchiati",
        caption: "Vista panoramica · Luce calda & tavoli tondi",
        width: 1008,
        height: 541,
      },
      {
        src: imperialTableImg,
        alt: "Tavola lunga imperiale al centro della sala settecentesca della masseria",
        caption: "Allestimento imperiale · Tavola unica",
        width: 1200,
        height: 1120,
      },
    ],
  },
  {
    id: "corte",
    title: "La Corte & Gli Ulivi",
    subtitle: "Pergolato in cannicciato · Ricevimenti all'aperto",
    description:
      "Pietra imbiancata a calce, arcate settecentesche e serate estive tra gli ulivi secolari della Murgia.",
    colSpanClass: "lg:col-span-5",
    views: [
      {
        src: stoneCourtImg,
        alt: "Cortile con portico ad archi bianchi e tegole pugliesi di giorno",
        caption: "La corte di giorno · Archi & pietra viva",
        width: 924,
        height: 541,
      },
      {
        src: nightCourtImg,
        alt: "Corte della masseria illuminata di notte sotto il grande ulivo",
        caption: "La corte di sera · Sotto l'ulivo",
        width: 864,
        height: 900,
      },
    ],
  },
] as const;

function buildEventWhatsAppUrl(eventTitle: string): string {
  const text = `Ciao Masseria Torre Abbondanza, vorrei informazioni e disponibilità per organizzare: ${eventTitle}.`;
  return `${BUSINESS.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

function requestEventInForm(formValue: EventOccasion["formValue"]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("masseria:select-occasion", { detail: { kind: formValue } }),
  );
  scrollToSection("#contatti");
}

/* -------------------------------------------------------------------------- */
/* Sotto-componente Desktop: Lama Fotografica Espandibile                     */
/* -------------------------------------------------------------------------- */
interface DesktopBladeProps {
  occasion: EventOccasion;
  index: number;
  isActive: boolean;
  reduced: boolean;
  onActivate: () => void;
  onScheduleHoverActivate: () => void;
  onCancelHoverActivate: () => void;
  onOpenDetail: () => void;
}

function DesktopBlade({
  occasion,
  index,
  isActive,
  reduced,
  onActivate,
  onScheduleHoverActivate,
  onCancelHoverActivate,
  onOpenDetail,
}: DesktopBladeProps) {
  const { t } = useTranslation();
  const bladeRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 130, damping: 22, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 130, damping: 22, mass: 0.5 });

  const handlePointerMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isActive || reduced || !bladeRef.current) return;
    const rect = bladeRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(normX * -14);
    pointerY.set(normY * -10);
  };

  const resetParallax = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  useEffect(() => {
    if (!isActive) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [isActive, pointerX, pointerY]);

  return (
    <motion.article
      ref={bladeRef}
      data-event-blade
      onMouseEnter={onScheduleHoverActivate}
      onMouseLeave={() => {
        onCancelHoverActivate();
        resetParallax();
      }}
      onMouseMove={handlePointerMove}
      animate={{ flexGrow: isActive ? 4.85 : 0.62 }}
      transition={
        reduced ? { duration: 0.01 } : { type: "spring", stiffness: 205, damping: 28, mass: 0.9 }
      }
      style={{ flexBasis: 0, minWidth: isActive ? 380 : 68 }}
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border transition-colors duration-300",
        isActive
          ? "border-gold/55 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]"
          : "border-ivory/15 hover:border-ivory/35",
      )}
    >
      {/* Sfondo fotografico reale con parallasse puntatore su lama attiva */}
      <motion.img
        src={occasion.image}
        alt={occasion.imageAlt}
        width={occasion.width}
        height={occasion.height}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        style={isActive && !reduced ? { x: smoothX, y: smoothY, scale: 1.07 } : { scale: 1.04 }}
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-[filter] duration-500",
          isActive ? "brightness-95" : "brightness-[0.52] group-hover:brightness-[0.72]",
        )}
      />

      {/* Scrim calibrato ad alto contrasto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: isActive
            ? "linear-gradient(180deg, rgba(21,17,15,0.22) 0%, rgba(21,17,15,0.18) 38%, rgba(21,17,15,0.92) 100%)"
            : "linear-gradient(180deg, rgba(21,17,15,0.62) 0%, rgba(21,17,15,0.45) 45%, rgba(21,17,15,0.88) 100%)",
        }}
      />

      {!isActive ? (
        <button
          type="button"
          onClick={onActivate}
          aria-pressed={false}
          aria-label={`Apri ${occasion.title}: ${occasion.phrase}`}
          className="relative z-10 flex h-full w-full cursor-pointer flex-col items-center justify-between px-2 py-6 text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
        >
          <span className="font-sans text-xs font-medium tracking-[0.2em] text-gold tabular-nums">
            {occasion.indexLabel}
          </span>
          <span className="font-display text-xl font-medium tracking-[-0.015em] whitespace-nowrap text-ivory/90 transition-colors duration-300 group-hover:text-gold [writing-mode:vertical-rl] rotate-180">
            {occasion.title}
          </span>
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-ivory/35 transition-transform duration-300 group-hover:scale-125 group-hover:bg-gold"
          />
        </button>
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-between p-7 xl:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="font-sans text-xs font-medium tracking-[0.22em] text-gold tabular-nums">
              {occasion.indexLabel} / 07
            </span>
            <span className="rounded-full border border-ivory/25 bg-murgese/75 px-3.5 py-1 text-[11px] font-medium tracking-[0.14em] uppercase text-ivory/90">
              {occasion.spaces}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={occasion.id}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={
                reduced ? { duration: 0.01 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-xl"
            >
              <h3
                className="font-display font-semibold tracking-[-0.025em] text-ivory"
                style={{ fontSize: "clamp(2rem, 3.3vw, 3.25rem)", lineHeight: 1.02 }}
              >
                {occasion.title}
              </h3>
              <p className="mt-3 font-display text-lg italic leading-snug text-gold xl:text-xl">
                {occasion.phrase}
              </p>
              <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-ivory/85">
                {occasion.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => requestEventInForm(occasion.formValue)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase text-ivory transition-colors hover:bg-gold hover:text-murgese focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span>{t("events.reqBtn")}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onOpenDetail}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-ivory/35 bg-murgese/75 px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span>{t("events.detailsBtn")}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Sotto-componente Mobile: Mazzo Fotografico 3D Tattile                      */
/* -------------------------------------------------------------------------- */
interface MobileDeckProps {
  events: readonly EventOccasion[];
  activeIndex: number;
  reduced: boolean;
  onSelectIndex: (idx: number) => void;
  onStep: (delta: 1 | -1) => void;
  onOpenDetail: (occ: EventOccasion) => void;
}

function MobileTactileDeck({
  events,
  activeIndex,
  reduced,
  onSelectIndex,
  onStep,
  onOpenDetail,
}: MobileDeckProps) {
  const { t } = useTranslation();
  const pillStripRef = useRef<HTMLDivElement>(null);
  const pillButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const didUserInteractRef = useRef(false);

  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-180, 0, 180], [-7, 0, 7]);
  const dragOpacityFade = useTransform(dragX, [-240, 0, 240], [0.82, 1, 0.82]);

  useEffect(() => {
    dragX.set(0);
  }, [activeIndex, dragX]);

  // Centra orizzontalmente il solo contenitore pillole SOLO dopo un'interazione utente
  useEffect(() => {
    if (!didUserInteractRef.current) return;
    const container = pillStripRef.current;
    const pill = pillButtonsRef.current[activeIndex];
    if (!container || !pill) return;
    const targetLeft = pill.offsetLeft - container.clientWidth / 2 + pill.clientWidth / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduced ? "auto" : "smooth",
    });
  }, [activeIndex, reduced]);

  const handleSelect = (idx: number) => {
    didUserInteractRef.current = true;
    onSelectIndex(idx);
  };

  const handleStep = (delta: 1 | -1) => {
    didUserInteractRef.current = true;
    onStep(delta);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -55 || info.velocity.x < -380) {
      handleStep(1);
    } else if (info.offset.x > 55 || info.velocity.x > 380) {
      handleStep(-1);
    }
  };

  const layers = [2, 1, 0] as const;

  return (
    <div className="lg:hidden">
      {/* Barra pillole rapide */}
      <div
        ref={pillStripRef}
        role="tablist"
        aria-label="Seleziona il tipo di evento"
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((occ, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={occ.id}
              ref={(el) => {
                pillButtonsRef.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(idx)}
              className={cn(
                "relative min-h-[44px] flex-shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                isActive
                  ? "border-terracotta text-ivory"
                  : "border-ivory/20 bg-ivory/[0.03] text-ivory/75 hover:border-ivory/40 hover:text-ivory",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-events-pill"
                  transition={
                    reduced ? { duration: 0.01 } : { type: "spring", stiffness: 320, damping: 28 }
                  }
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-terracotta"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">
                <span className={cn("tabular-nums", isActive ? "text-ivory/90" : "text-gold")}>
                  {occ.indexLabel}
                </span>
                <span>{occ.shortTitle}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Mazzo fotografico 3D impilato */}
      <div className="relative mx-auto mt-4 h-[500px] w-full max-w-[440px] px-5 sm:h-[530px]">
        {layers.map((offset) => {
          const itemIndex = (activeIndex + offset) % events.length;
          const occ = events[itemIndex];
          const isFront = offset === 0;
          const zIndex = 30 - offset * 10;
          const restScale = offset === 0 ? 1 : offset === 1 ? 0.94 : 0.88;
          const restY = offset === 0 ? 0 : offset === 1 ? 14 : 28;
          const restRotate = offset === 0 ? 0 : offset === 1 ? 1.8 : -2;
          const restOpacity = offset === 0 ? 1 : offset === 1 ? 0.72 : 0.42;

          return (
            <motion.article
              key={occ.id}
              style={{
                zIndex,
                x: isFront ? dragX : 0,
                rotate: isFront && !reduced ? dragRotate : restRotate,
                opacity: isFront && !reduced ? dragOpacityFade : restOpacity,
              }}
              initial={false}
              animate={{
                scale: restScale,
                y: restY,
                rotate: restRotate,
                opacity: restOpacity,
              }}
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness: 250, damping: 26, mass: 0.85 }
              }
              drag={isFront && !reduced ? "x" : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.85}
              onDragEnd={isFront ? handleDragEnd : undefined}
              aria-hidden={!isFront}
              className={cn(
                "absolute inset-x-5 top-0 h-[468px] overflow-hidden rounded-2xl border shadow-[0_26px_55px_-20px_rgba(0,0,0,0.9)] sm:h-[496px]",
                isFront
                  ? "touch-pan-y cursor-grab border-gold/45 active:cursor-grabbing"
                  : "pointer-events-none border-ivory/15",
              )}
            >
              <img
                src={occ.image}
                alt={occ.imageAlt}
                width={occ.width}
                height={occ.height}
                loading={isFront || offset === 1 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(21,17,15,0.28) 0%, rgba(21,17,15,0.22) 34%, rgba(21,17,15,0.94) 100%)",
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-sans text-xs font-medium tracking-[0.2em] text-gold tabular-nums">
                    {occ.indexLabel} / 07
                  </span>
                  <span className="rounded-full border border-ivory/25 bg-murgese/80 px-3 py-1 text-[10px] font-medium tracking-[0.12em] uppercase text-ivory/90">
                    {occ.spaces}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.025em] text-ivory">
                    {occ.title}
                  </h3>
                  <p className="mt-2 font-display text-base italic leading-snug text-gold">
                    {occ.phrase}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ivory/85 sm:text-sm">
                    {occ.description}
                  </p>

                  {isFront && (
                    <div
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      className="mt-4 flex flex-wrap items-center gap-2.5"
                    >
                      <button
                        type="button"
                        onClick={() => requestEventInForm(occ.formValue)}
                        className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-ivory transition-colors hover:bg-gold hover:text-murgese focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <span>{t("events.reqShortBtn")}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDetail(occ)}
                        className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-full border border-ivory/35 bg-murgese/80 px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <span>{t("events.detailsBtn")}</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Controlli mazzo */}
      <div className="mx-auto mt-4 flex max-w-[440px] items-center justify-between px-5">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          aria-label="Evento precedente"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="text-center">
          <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase tabular-nums">
            {events[activeIndex].indexLabel} / 07
          </p>
          <p className="mt-0.5 text-[11px] text-ivory/65">{t("events.swipeHint")}</p>
        </div>

        <button
          type="button"
          onClick={() => handleStep(1)}
          aria-label="Evento successivo"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scheda Espansa Cinematografica (Desktop Modal / Mobile Bottom-Sheet)       */
/* -------------------------------------------------------------------------- */
interface EventDetailSheetProps {
  occasion: EventOccasion | null;
  reduced: boolean;
  onClose: () => void;
}

function EventDetailSheet({ occasion, reduced, onClose }: EventDetailSheetProps) {
  const { t } = useTranslation();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setGalleryIndex(0);
  }, [occasion?.id]);

  useEffect(() => {
    if (!occasion) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [occasion, onClose]);

  const activePhoto = occasion ? (occasion.gallery[galleryIndex] ?? occasion.gallery[0]) : null;

  return (
    <AnimatePresence>
      {occasion && activePhoto && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-detail-title"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={reduced ? { duration: 0.01 } : { duration: 0.24 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-murgese/85 p-0 md:items-center md:p-8"
        >
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-ivory/15 bg-murgese text-ivory shadow-[0_32px_90px_-16px_rgba(0,0,0,0.95)] md:grid md:max-h-[88vh] md:grid-cols-12 md:rounded-2xl"
          >
            {/* Colonna foto multi-scatto */}
            <div className="relative flex flex-col justify-between bg-ink/30 md:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[420px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={activePhoto.src}
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    width={activePhoto.width}
                    height={activePhoto.height}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                    transition={reduced ? { duration: 0.01 } : { duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
                  style={{
                    background: "linear-gradient(180deg, transparent 0%, rgba(21,17,15,0.9) 100%)",
                  }}
                />
                <p className="absolute bottom-3 left-4 right-4 text-xs text-ivory/85 md:bottom-4 md:left-6">
                  {activePhoto.caption}
                </p>
              </div>

              {/* Miniature selettore galleria */}
              <div className="flex items-center gap-2 border-t border-ivory/10 bg-murgese px-4 py-3 md:px-6">
                {occasion.gallery.map((frame, idx) => {
                  const selected = idx === galleryIndex;
                  return (
                    <button
                      key={frame.src + idx}
                      type="button"
                      onClick={() => setGalleryIndex(idx)}
                      aria-label={`Foto ${idx + 1}: ${frame.caption}`}
                      aria-pressed={selected}
                      className={cn(
                        "relative h-12 w-16 cursor-pointer overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        selected
                          ? "border-gold opacity-100 ring-1 ring-gold"
                          : "border-ivory/20 opacity-60 hover:opacity-95",
                      )}
                    >
                      <img
                        src={frame.src}
                        alt=""
                        width={frame.width}
                        height={frame.height}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
                <span className="ml-auto text-[11px] text-ivory/65 tabular-nums">
                  {galleryIndex + 1} / {occasion.gallery.length}
                </span>
              </div>
            </div>

            {/* Colonna dettagli e prenotazione */}
            <div className="flex flex-col justify-between overflow-y-auto p-6 md:col-span-5 md:p-8">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium tracking-[0.2em] text-gold uppercase tabular-nums">
                    {occasion.indexLabel} · {occasion.spaces}
                  </span>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Chiudi scheda evento"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <h3
                  id="event-detail-title"
                  className="mt-4 font-display text-3xl font-semibold tracking-[-0.025em] text-ivory"
                >
                  {occasion.title}
                </h3>
                <p className="mt-2 font-display text-base italic text-gold">{occasion.phrase}</p>
                <p className="mt-4 text-sm leading-relaxed text-ivory/85">{occasion.description}</p>

                <ul className="mt-5 space-y-2.5 border-t border-ivory/10 pt-5 text-sm text-ivory/85">
                  {occasion.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 space-y-2.5 border-t border-ivory/10 pt-5">
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={buildEventWhatsAppUrl(occasion.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-ivory transition-colors hover:bg-gold hover:text-murgese focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>{t("events.whatsapp")}</span>
                  </a>
                  <a
                    href={`tel:${BUSINESS.phoneTel}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-ivory/25 bg-ivory/[0.04] px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>{t("events.call")}</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const value = occasion.formValue;
                    onClose();
                    requestEventInForm(value);
                  }}
                  className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/45 px-4 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-gold transition-colors hover:bg-gold hover:text-murgese focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span>{t("events.fillForm")}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Sezione Principale: EventsSection (#eventi)                                */
/* -------------------------------------------------------------------------- */
export function EventsSection() {
  const { t, i18n } = useTranslation();
  const rootRef = useRef<HTMLElement>(null);

  const events = useMemo(() => {
    const translated = t("events.items", { returnObjects: true }) as
      | Array<{
          title?: string;
          shortTitle?: string;
          spaces?: string;
          phrase?: string;
          description?: string;
          highlights?: string[];
        }>
      | undefined;
    return EVENTS_DATA.map((item, idx) => {
      const tr = Array.isArray(translated) ? translated[idx] : undefined;
      if (!tr) return item;
      return {
        ...item,
        title: tr.title ?? item.title,
        shortTitle: tr.shortTitle ?? item.shortTitle,
        spaces: tr.spaces ?? item.spaces,
        phrase: tr.phrase ?? item.phrase,
        description: tr.description ?? item.description,
        highlights: tr.highlights ?? item.highlights,
      };
    });
  }, [t, i18n.language]);

  const localizedSpaces = useMemo(() => {
    return SPACES_SHOWCASE.map((space) => {
      if (space.id === "sala") {
        return {
          ...space,
          title: t("events.spaces.salaTitle"),
          subtitle: t("events.spaces.salaSubtitle"),
          description: t("events.spaces.salaDesc"),
          views: [
            { ...space.views[0], caption: t("events.spaces.salaV1") },
            { ...space.views[1], caption: t("events.spaces.salaV2") },
          ] as const,
        };
      }
      return {
        ...space,
        title: t("events.spaces.corteTitle"),
        subtitle: t("events.spaces.corteSubtitle"),
        description: t("events.spaces.corteDesc"),
        views: [
          { ...space.views[0], caption: t("events.spaces.corteV1") },
          { ...space.views[1], caption: t("events.spaces.corteV2") },
        ] as const,
      };
    });
  }, [t, i18n.language]);
  const desktopStageRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [detailOccasion, setDetailOccasion] = useState<EventOccasion | null>(null);
  const [spaceViews, setSpaceViews] = useState<{ sala: 0 | 1; corte: 0 | 1 }>({
    sala: 0,
    corte: 0,
  });

  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);

  const cancelHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const scheduleHoverActivate = useCallback(
    (idx: number) => {
      cancelHoverTimer();
      hoverTimerRef.current = window.setTimeout(() => {
        setActiveIndex(idx);
      }, 90);
    },
    [cancelHoverTimer],
  );

  const stepActive = useCallback((delta: 1 | -1) => {
    setActiveIndex((prev) => (prev + delta + EVENTS_DATA.length) % EVENTS_DATA.length);
  }, []);

  useEffect(() => () => cancelHoverTimer(), [cancelHoverTimer]);

  // GSAP ScrollTrigger: ingresso a sipario sulle lame desktop + contro-parallasse dittico attacchi
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const carriageLead = root.querySelector<HTMLElement>("[data-carriage-lead]");
      const carriageCompanion = root.querySelector<HTMLElement>("[data-carriage-companion]");
      const carriageBand = root.querySelector<HTMLElement>("[data-carriage-band]");

      if (carriageBand && carriageLead && carriageCompanion) {
        gsap.fromTo(
          carriageLead,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: carriageBand,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.fromTo(
          carriageCompanion,
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: carriageBand,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      mm.add("(min-width: 1024px)", () => {
        const blades = root.querySelectorAll<HTMLElement>("[data-event-blade]");
        const stage = desktopStageRef.current;
        if (blades.length && stage) {
          gsap.fromTo(
            blades,
            { clipPath: "inset(10% 0% 0% 0% round 12px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              duration: 0.85,
              stagger: 0.055,
              ease: "power3.out",
              immediateRender: false,
              clearProps: "clipPath",
              scrollTrigger: {
                trigger: stage,
                start: "top 86%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleStageKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepActive(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepActive(-1);
    }
  };

  const activeOccasion = events[activeIndex];

  return (
    <section
      id="eventi"
      ref={rootRef}
      aria-labelledby="events-heading"
      className="relative text-foreground"
    >
      {/* ====================================================================
          ATTO 1 — Testata chiara su --ivory (garantisce contrasto su /eventi)
      ==================================================================== */}
      <div className="bg-ivory pt-28 pb-10 text-ink md:pt-36 md:pb-14">
        <div className="mx-auto max-w-[1520px] px-5 md:px-8 xl:px-12">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2
                id="events-heading"
                className="font-display font-semibold tracking-[-0.03em] text-ink text-balance"
                style={{ fontSize: "clamp(2.35rem, 4.9vw, 4.5rem)", lineHeight: 0.98 }}
              >
                {t("events.headingStart")}{" "}
                <em className="font-medium italic text-terracotta">{t("events.headingAccent")}</em>
              </h2>
              <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink/75 md:text-lg">
                {t("events.subheading")}
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-4 border-t border-ink/15 pt-5 lg:col-span-5">
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink/60">
                  {t("events.stat1Label")}
                </dt>
                <dd className="mt-1 font-display text-base font-medium text-ink tabular-nums md:text-lg">
                  {t("events.stat1Value")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink/60">
                  {t("events.stat2Label")}
                </dt>
                <dd className="mt-1 font-display text-base font-medium text-ink md:text-lg">
                  {t("events.stat2Value")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink/60">
                  {t("events.stat3Label")}
                </dt>
                <dd className="mt-1 font-display text-base font-medium text-ink md:text-lg">
                  {t("events.stat3Value")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ATTO 2 — Palcoscenico scuro --murgese: 7 Lame Desktop + Mazzo 3D Mobile
      ==================================================================== */}
      <div className="relative overflow-hidden bg-murgese py-12 text-ivory md:py-16 xl:py-20">
        {/* Alone cromatico reattivo all'evento attivo */}
        <motion.div
          aria-hidden
          animate={{
            background: `radial-gradient(ellipse 70% 55% at 50% 35%, ${activeOccasion.ambientTint}, transparent 72%)`,
          }}
          transition={reduced ? { duration: 0.01 } : { duration: 0.65, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0"
        />

        <div className="relative z-10">
          {/* DESKTOP (lg+): 7 Lame Espandibili */}
          <div
            ref={desktopStageRef}
            onKeyDown={handleStageKeyDown}
            aria-label="I sette eventi della Masseria Torre Abbondanza"
            className="mx-auto hidden max-w-[1520px] px-8 lg:block xl:px-12"
          >
            <div className="flex h-[70vh] min-h-[550px] max-h-[720px] gap-2.5">
              {events.map((occ, idx) => (
                <DesktopBlade
                  key={occ.id}
                  occasion={occ}
                  index={idx}
                  isActive={idx === activeIndex}
                  reduced={reduced}
                  onActivate={() => setActiveIndex(idx)}
                  onScheduleHoverActivate={() => scheduleHoverActivate(idx)}
                  onCancelHoverActivate={cancelHoverTimer}
                  onOpenDetail={() => setDetailOccasion(occ)}
                />
              ))}
            </div>

            {/* Barra di selezione rapida & tastiera */}
            <div className="mt-5 flex items-center justify-between gap-6 border-t border-ivory/10 pt-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {events.map((occ, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={cn(
                        "relative cursor-pointer rounded-full px-3.5 py-2 text-xs font-medium tracking-[0.1em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        isActive ? "text-murgese" : "text-ivory/70 hover:text-ivory",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="desktop-events-rail"
                          transition={
                            reduced
                              ? { duration: 0.01 }
                              : { type: "spring", stiffness: 320, damping: 30 }
                          }
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-gold"
                        />
                      )}
                      <span className="relative z-10 inline-flex items-center gap-1.5">
                        <span className="tabular-nums opacity-80">{occ.indexLabel}</span>
                        <span>{occ.shortTitle}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepActive(-1)}
                  aria-label="Evento precedente"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => stepActive(1)}
                  aria-label="Evento successivo"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE (< lg): Mazzo 3D Tattile + Barra Pillole */}
          <MobileTactileDeck
            events={events}
            activeIndex={activeIndex}
            reduced={reduced}
            onSelectIndex={setActiveIndex}
            onStep={stepActive}
            onOpenDetail={setDetailOccasion}
          />

          {/* ==================================================================
              ATTO 3 — Trittico Bento Asimmetrico: Spazi & Attacchi d'Epoca
          ================================================================== */}
          <div className="mx-auto mt-16 max-w-[1520px] px-5 md:mt-24 md:px-8 xl:px-12">
            {/* Riga 1: Spazi con toggle reale Giorno/Sera & Panoramica/Imperiale */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {localizedSpaces.map((space) => {
                const viewIndex = spaceViews[space.id];
                const frame = space.views[viewIndex];
                const toggleView = () =>
                  setSpaceViews((prev) => ({
                    ...prev,
                    [space.id]: prev[space.id] === 0 ? 1 : 0,
                  }));

                return (
                  <article
                    key={space.id}
                    className={cn(
                      "flex flex-col overflow-hidden rounded-2xl border border-ivory/15 bg-ivory/[0.03]",
                      space.colSpanClass,
                    )}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.img
                          key={frame.src}
                          src={frame.src}
                          alt={frame.alt}
                          width={frame.width}
                          height={frame.height}
                          loading="lazy"
                          decoding="async"
                          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                          transition={
                            reduced
                              ? { duration: 0.01 }
                              : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
                          }
                          className="h-full w-full object-cover"
                        />
                      </AnimatePresence>
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(21,17,15,0.88) 100%)",
                        }}
                      />
                      <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-3 md:inset-x-6 md:bottom-4">
                        <span className="text-xs font-medium text-ivory/90">{frame.caption}</span>
                        <button
                          type="button"
                          onClick={toggleView}
                          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-ivory/30 bg-murgese/80 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          <Images className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t("events.changeView")}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
                      <div>
                        <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ivory">
                          {space.title}
                        </h3>
                        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ivory/80">
                          {space.description}
                        </p>
                      </div>
                      <p className="mt-4 border-t border-ivory/10 pt-3 text-xs tracking-[0.14em] uppercase text-gold">
                        {space.subtitle}
                      </p>
                    </div>
                  </article>
                );
              })}

              {/* Riga 2: Dittico Equestre — L'arrivo con gli attacchi d'epoca */}
              <aside
                data-carriage-band
                aria-labelledby="events-carriage-title"
                className="overflow-hidden rounded-2xl border border-ivory/15 bg-ivory/[0.03] lg:col-span-12"
              >
                <div className="grid grid-cols-1 items-center gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-12">
                  <div className="grid grid-cols-12 items-end gap-4 lg:col-span-7">
                    <figure
                      data-carriage-lead
                      className="col-span-7 overflow-hidden rounded-xl border border-ivory/15"
                    >
                      <img
                        src={carriageImg}
                        alt="Carrozza d'epoca trainata da un cavallo Murgese nero davanti alla masseria"
                        width={968}
                        height={957}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/4.2] h-full w-full object-cover"
                      />
                    </figure>
                    <figure
                      data-carriage-companion
                      className="col-span-5 overflow-hidden rounded-xl border border-ivory/15"
                    >
                      <img
                        src={horsePortalImg}
                        alt="Cavallo Murgese nero posizionato davanti al portale storico della masseria"
                        width={1800}
                        height={1198}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3.6] h-full w-full object-cover"
                      />
                    </figure>
                  </div>

                  <div className="flex flex-col gap-5 lg:col-span-5">
                    <h3
                      id="events-carriage-title"
                      className="font-display font-semibold tracking-[-0.02em] text-ivory"
                      style={{ fontSize: "clamp(1.75rem, 2.9vw, 2.5rem)", lineHeight: 1.06 }}
                    >
                      {t("events.carriageTitle")}
                    </h3>
                    <p className="max-w-[65ch] font-display text-lg italic leading-relaxed text-gold">
                      {t("events.carriageQuote")}
                    </p>
                    <p className="max-w-[65ch] text-sm leading-relaxed text-ivory/80 md:text-base">
                      {t("events.carriageBody")}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-ivory/10 pt-5">
                      <span className="text-xs font-medium tracking-[0.16em] uppercase text-ivory/75">
                        {t("events.carriageBadge")}
                      </span>
                      <a
                        href="/cavalli"
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium tracking-[0.16em] uppercase text-gold transition-colors hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <span>{t("events.carriageLink")}</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ATTO 4 — Chiusura CTA su --ivory & transizione verso Sez. 08
      ==================================================================== */}
      <div className="bg-ivory text-ink">
        <div className="mx-auto flex max-w-[1520px] flex-col items-start justify-between gap-10 px-5 py-20 md:flex-row md:items-end md:px-8 md:py-28 xl:px-12">
          <div className="max-w-2xl">
            <h3
              className="font-display font-semibold tracking-[-0.025em] text-ink text-balance"
              style={{ fontSize: "clamp(1.7rem, 3.1vw, 2.6rem)", lineHeight: 1.08 }}
            >
              {t("events.closingStart")}{" "}
              <em className="font-medium italic text-terracotta">{t("events.closingAccent")}</em>
            </h3>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs font-medium tracking-[0.14em] uppercase text-ink/75">
              <a
                href={BUSINESS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <MessageCircle className="h-4 w-4 text-terracotta" aria-hidden="true" />
                <span>{t("events.whatsappDirect")}</span>
              </a>
              <a
                href={`tel:${BUSINESS.phoneTel}`}
                className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <Phone className="h-4 w-4 text-terracotta" aria-hidden="true" />
                <span className="tabular-nums">{BUSINESS.phone}</span>
              </a>
            </div>
          </div>

          <div className="flex w-full flex-shrink-0 flex-wrap gap-4 md:w-auto">
            <MagneticButton href="#contatti" variant="pill-solid" className="w-full md:w-auto">
              {t("events.ctaAvailability")}
            </MagneticButton>
            <MagneticButton href="/appuntamenti" variant="pill" className="w-full md:w-auto">
              {t("events.ctaAppointments")}
            </MagneticButton>
          </div>
        </div>

        {/* Uscita morbida verso Sez. 08 (SeasonsSection) */}
        <div
          aria-hidden
          className="pointer-events-none h-28"
          style={{
            background:
              "linear-gradient(180deg, var(--ivory), color-mix(in oklab, var(--olive) 14%, transparent))",
          }}
        />
      </div>

      {/* Scheda Espansa Cinematografica (Desktop Split Modal / Mobile Bottom Sheet) */}
      <EventDetailSheet
        occasion={detailOccasion}
        reduced={reduced}
        onClose={() => setDetailOccasion(null)}
      />
    </section>
  );
}
