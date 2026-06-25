import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

import heroImg from "@/assets/hero-masseria.jpg";
import placeMasseria from "@/assets/place-masseria.png";
import placeOlives from "@/assets/place-olives.png";
import storyPietra from "@/assets/story-pietra.jpg";
import storyOrigini from "@/assets/story-origini.jpg";
import storyFamiglia from "@/assets/story-famiglia.jpg";
import storyOggi from "@/assets/story-oggi.jpg";
import kitchenAntipasti from "@/assets/kitchen-antipasti.jpg";
import kitchenPrimi from "@/assets/kitchen-primi.jpg";
import kitchenSecondi from "@/assets/kitchen-secondi.jpg";
import kitchenDolci from "@/assets/kitchen-dolci.jpg";
import kitchenWine from "@/assets/kitchen-wine.jpg";
import eventsHall from "@/assets/events-hall.jpg";
import eventsGarden from "@/assets/events-garden.jpg";
import eventsWedding from "@/assets/events-wedding.jpg";
import eventsPrivate from "@/assets/events-private.jpg";
import eventsKitchen from "@/assets/events-kitchen.jpg";
import seasonEquestrian from "@/assets/season-equestrian.jpg";

type Category =
  | "all"
  | "masseria"
  | "interni"
  | "cucina"
  | "eventi"
  | "murgia";

type Shape = "arch" | "rect";
type Span = { col: number; row: number };

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: Exclude<Category, "all">;
  shape: Shape;
  span: Span; // desktop span (cols su 12, rows su track 220px)
  speed: number; // parallax: -1 (lento), 1 (veloce)
}

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "Tutto" },
  { id: "masseria", label: "La Masseria" },
  { id: "interni", label: "Gli Interni" },
  { id: "cucina", label: "La Cucina" },
  { id: "eventi", label: "Eventi & Matrimoni" },
  { id: "murgia", label: "La Murgia" },
];

// Placeholder editoriale — le immagini reali saranno fornite dal cliente.
// {/* IMMAGINE DA FORNIRE */}
const IMAGES: GalleryImage[] = [
  {
    id: "g01",
    src: heroImg,
    alt: "Facciata della Masseria Torre Abbondanza al tramonto",
    caption: "La facciata · ora dorata",
    category: "masseria",
    shape: "arch",
    span: { col: 5, row: 3 },
    speed: -0.4,
  },
  {
    id: "g02",
    src: storyPietra,
    alt: "Dettaglio del muro a secco in pietra calcarea",
    caption: "Pietra · dettaglio",
    category: "masseria",
    shape: "rect",
    span: { col: 4, row: 2 },
    speed: 0.3,
  },
  {
    id: "g03",
    src: kitchenPrimi,
    alt: "Orecchiette fatte a mano impiattate",
    caption: "Orecchiette · cucina",
    category: "cucina",
    shape: "rect",
    span: { col: 3, row: 2 },
    speed: 0.6,
  },
  {
    id: "g04",
    src: eventsHall,
    alt: "Sala interna con volte storiche apparecchiata per un evento",
    caption: "La sala · volte del '700",
    category: "interni",
    shape: "arch",
    span: { col: 4, row: 3 },
    speed: -0.2,
  },
  {
    id: "g05",
    src: placeOlives,
    alt: "Ulivi secolari nella campagna della masseria",
    caption: "Ulivi secolari",
    category: "murgia",
    shape: "rect",
    span: { col: 5, row: 2 },
    speed: 0.5,
  },
  {
    id: "g06",
    src: eventsWedding,
    alt: "Sposi sotto un arco fiorito al tramonto",
    caption: "Matrimonio · al tramonto",
    category: "eventi",
    shape: "rect",
    span: { col: 3, row: 3 },
    speed: -0.3,
  },
  {
    id: "g07",
    src: storyOrigini,
    alt: "Vista d'epoca della masseria, archivio storico",
    caption: "Origini · archivio",
    category: "masseria",
    shape: "rect",
    span: { col: 4, row: 2 },
    speed: 0.4,
  },
  {
    id: "g08",
    src: kitchenAntipasti,
    alt: "Tavolo apparecchiato con antipasti della tradizione",
    caption: "Antipasti · tradizione",
    category: "cucina",
    shape: "arch",
    span: { col: 3, row: 3 },
    speed: 0.2,
  },
  {
    id: "g09",
    src: storyFamiglia,
    alt: "Ritratto familiare nella corte della masseria",
    caption: "La famiglia",
    category: "interni",
    shape: "rect",
    span: { col: 5, row: 2 },
    speed: -0.5,
  },
  {
    id: "g10",
    src: seasonEquestrian,
    alt: "Cavalli Murgesi al galoppo nella campagna",
    caption: "Cavalli Murgesi",
    category: "murgia",
    shape: "rect",
    span: { col: 7, row: 3 },
    speed: 0.3,
  },
  {
    id: "g11",
    src: kitchenWine,
    alt: "Calice di vino Primitivo controluce",
    caption: "Primitivo · calice",
    category: "cucina",
    shape: "rect",
    span: { col: 3, row: 2 },
    speed: 0.6,
  },
  {
    id: "g12",
    src: eventsGarden,
    alt: "Giardino della masseria con ulivi al tramonto",
    caption: "Giardino · tramonto",
    category: "eventi",
    shape: "arch",
    span: { col: 4, row: 3 },
    speed: -0.4,
  },
  {
    id: "g13",
    src: placeMasseria,
    alt: "La masseria vista dalla campagna",
    caption: "Veduta · campagna",
    category: "masseria",
    shape: "rect",
    span: { col: 5, row: 2 },
    speed: 0.4,
  },
  {
    id: "g14",
    src: kitchenSecondi,
    alt: "Secondo di carne impiattato con verdure",
    caption: "Secondi",
    category: "cucina",
    shape: "rect",
    span: { col: 4, row: 2 },
    speed: -0.3,
  },
  {
    id: "g15",
    src: storyOggi,
    alt: "Dettaglio contemporaneo degli interni della masseria",
    caption: "Oggi · dettaglio",
    category: "interni",
    shape: "rect",
    span: { col: 3, row: 2 },
    speed: 0.5,
  },
  {
    id: "g16",
    src: eventsPrivate,
    alt: "Tavolata privata di sera sotto luci sospese",
    caption: "Evento privato",
    category: "eventi",
    shape: "rect",
    span: { col: 5, row: 3 },
    speed: 0.2,
  },
  {
    id: "g17",
    src: kitchenDolci,
    alt: "Dolce della tradizione con mandorle e miele",
    caption: "Dolci",
    category: "cucina",
    shape: "arch",
    span: { col: 3, row: 2 },
    speed: -0.5,
  },
  {
    id: "g18",
    src: eventsKitchen,
    alt: "Chef impiatta nella cucina della masseria",
    caption: "Cucina su misura",
    category: "eventi",
    shape: "rect",
    span: { col: 4, row: 2 },
    speed: 0.4,
  },
];

const ARCH_RADIUS = "50% 50% 0 0 / 38% 38% 0 0";

function GalleryFilter({
  active,
  onChange,
}: {
  active: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtra galleria per tema"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      {FILTERS.map((f) => {
        const isActive = f.id === active;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f.id)}
            className="text-eyebrow shrink-0 rounded-full border px-4 py-2 transition-colors"
            style={{
              borderColor: isActive
                ? "var(--terracotta)"
                : "color-mix(in oklab, var(--ink) 18%, transparent)",
              background: isActive ? "var(--terracotta)" : "transparent",
              color: isActive ? "var(--ivory)" : "var(--ink)",
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function GalleryItem({
  image,
  index,
  total,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onOpen: (id: string) => void;
}) {
  const isArch = image.shape === "arch";
  return (
    <button
      data-gallery-item
      data-id={image.id}
      data-speed={image.speed}
      onClick={() => onOpen(image.id)}
      className="group relative block w-full overflow-hidden text-left"
      style={{
        gridColumn: `span ${image.span.col}`,
        gridRow: `span ${image.span.row}`,
        borderRadius: isArch ? ARCH_RADIUS : "2px",
        border: "1px solid color-mix(in oklab, var(--ink) 12%, transparent)",
        background: "var(--stone)",
        willChange: "transform",
      }}
      aria-label={`Apri immagine ${index + 1} di ${total}: ${image.caption}`}
    >
      <div
        data-gallery-clip
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: isArch ? ARCH_RADIUS : "2px",
          clipPath: "inset(100% 0 0 0)",
          willChange: "clip-path",
        }}
      >
        <img
          data-gallery-img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[115%] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ top: "-7.5%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100"
        >
          <Expand className="h-4 w-4" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="font-display text-base italic text-ivory drop-shadow">
            {image.caption}
          </span>
          <span className="text-eyebrow text-ivory/85">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </button>
  );
}

function ImmersiveLightbox({
  images,
  openId,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  openId: string | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const archRef = useRef<HTMLDivElement>(null);

  const index = openId ? images.findIndex((i) => i.id === openId) : -1;
  const current = index >= 0 ? images[index] : null;

  const goPrev = useCallback(() => {
    if (index < 0) return;
    const next = (index - 1 + images.length) % images.length;
    onNavigate(images[next].id);
  }, [index, images, onNavigate]);

  const goNext = useCallback(() => {
    if (index < 0) return;
    const next = (index + 1) % images.length;
    onNavigate(images[next].id);
  }, [index, images, onNavigate]);

  // Keyboard
  useEffect(() => {
    if (!current) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, onClose, goPrev, goNext]);

  // Body scroll lock + focus
  useEffect(() => {
    if (!current) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [current]);

  // Preload adjacents
  useEffect(() => {
    if (!current) return;
    const prev = images[(index - 1 + images.length) % images.length];
    const next = images[(index + 1) % images.length];
    [prev, next].forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  }, [current, index, images]);

  // Arch reveal on open / change
  useEffect(() => {
    if (!current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = archRef.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { clipPath: "inset(0% 0 0 0)", opacity: 1 });
      return;
    }
    gsap.fromTo(
      el,
      { clipPath: "inset(100% 0 0 0)", opacity: 0.6 },
      { clipPath: "inset(0% 0 0 0)", opacity: 1, duration: 0.7, ease: "power3.out" },
    );
  }, [current?.id]);

  // Focus trap
  const onTrap = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !overlayRef.current) return;
    const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Swipe mobile
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchX.current = null;
  };

  if (!current) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Immagine: ${current.caption}`}
      onKeyDown={onTrap}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:px-12 md:py-10 animate-in fade-in duration-200"
      style={{ background: "color-mix(in oklab, var(--ink) 92%, #1a0f08)" }}
    >
      {/* Header controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 md:px-10 md:py-6">
        <span className="text-eyebrow text-ivory/70">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Chiudi galleria"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Prev */}
      <button
        onClick={goPrev}
        aria-label="Immagine precedente"
        className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory hover:text-ink md:left-8"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Arch image */}
      <figure className="flex max-h-[82vh] w-full max-w-5xl flex-col items-center gap-4">
        <div
          ref={archRef}
          className="relative w-full overflow-hidden"
          style={{
            borderRadius: ARCH_RADIUS,
            aspectRatio: "4 / 5",
            maxHeight: "72vh",
            border: "1px solid color-mix(in oklab, var(--ivory) 25%, transparent)",
            boxShadow: "0 60px 120px -40px rgba(0,0,0,0.6)",
          }}
        >
          <img
            key={current.id}
            src={current.src}
            alt={current.alt}
            className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-300"
          />
        </div>
        <figcaption className="flex w-full items-center justify-center gap-3 text-center">
          <span className="font-display text-lg italic text-ivory md:text-xl">
            {current.caption}
          </span>
        </figcaption>
      </figure>

      {/* Next */}
      <button
        onClick={goNext}
        aria-label="Immagine successiva"
        className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory hover:text-ink md:right-8"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

export function GallerySection() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Category>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const originRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? IMAGES : IMAGES.filter((i) => i.category === filter)),
    [filter],
  );

  // Mount animations + parallax
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const items = grid.querySelectorAll<HTMLElement>("[data-gallery-item]");
      items.forEach((item, i) => {
        const clip = item.querySelector<HTMLElement>("[data-gallery-clip]");
        const img = item.querySelector<HTMLElement>("[data-gallery-img]");
        const speed = parseFloat(item.dataset.speed || "0");

        if (reduced) {
          gsap.set(clip, { clipPath: "inset(0% 0 0 0)" });
          return;
        }

        gsap.to(clip, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.9,
          ease: "power3.out",
          delay: (i % 6) * 0.06,
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: speed * 8 },
            {
              yPercent: speed * -8,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    }, grid);

    return () => ctx.revert();
  }, [filter]);

  // FLIP on filter change
  const prevFilter = useRef<Category>(filter);
  useEffect(() => {
    if (prevFilter.current === filter) return;
    prevFilter.current = filter;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    const items = grid.querySelectorAll<HTMLElement>("[data-gallery-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 20, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        stagger: { amount: 0.4, from: "start" },
      },
    );
  }, [filter]);

  const handleOpen = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-gallery-item][data-id="${id}"]`);
    originRef.current = el;
    setOpenId(id);
  };

  const handleClose = () => {
    setOpenId(null);
    requestAnimationFrame(() => {
      originRef.current?.focus();
    });
  };

  return (
    <section
      ref={rootRef}
      id="galleria"
      aria-labelledby="gallery-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità con sez.08 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, #C97A3F 12%, transparent), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 md:px-12 md:pt-40 md:pb-16">
        <p className="text-eyebrow text-ink/65">08 — Galleria</p>
        <h2
          id="gallery-title"
          className="font-display mt-6 max-w-4xl font-medium leading-[0.95] text-ink"
          style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
        >
          Il muro delle <em className="text-terracotta">immagini</em>
        </h2>
        <p className="font-display mt-6 max-w-xl text-lg italic text-ink/75 md:text-xl">
          Pietra, luce, tavola e festa: la masseria nei suoi dettagli.
        </p>

        <div className="mt-12 flex items-center justify-between gap-6">
          <GalleryFilter active={filter} onChange={setFilter} />
          <span className="text-eyebrow hidden text-ink/55 md:inline">
            {String(visible.length).padStart(2, "0")} immagini
          </span>
        </div>
      </div>

      {/* Il muro */}
      <div className="mx-auto max-w-7xl px-6 pb-32 md:px-12 md:pb-48">
        <div
          ref={gridRef}
          className="grid auto-rows-[clamp(110px,18vw,220px)] grid-cols-2 gap-3 md:grid-cols-12 md:gap-5"
        >
          {visible.map((img, i) => (
            <GalleryItem
              key={img.id}
              image={img}
              index={i}
              total={visible.length}
              onOpen={handleOpen}
            />
          ))}
        </div>

        {/* Chiusura */}
        <div className="mt-20 flex flex-col items-start gap-6 border-t border-ink/15 pt-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <p
            className="font-display max-w-xl leading-tight text-ink"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)" }}
          >
            Altri scorci, ogni giorno, sul nostro profilo Instagram.
          </p>
          <MagneticButton
            href="https://instagram.com/masseria_torre_abbondanza"
            variant="pill"
          >
            Seguici su Instagram →
          </MagneticButton>
        </div>
      </div>

      <ImmersiveLightbox
        images={visible}
        openId={openId}
        onClose={handleClose}
        onNavigate={setOpenId}
      />
    </section>
  );
}
