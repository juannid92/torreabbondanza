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
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
import horseApparition from "@/assets/horse-apparition.jpg";
import horseGallop from "@/assets/horse-gallop.jpg";
import horsesTradition from "@/assets/horses-tradition.jpg";
import storyCavalli from "@/assets/story-cavalli-murgesi.jpg";
import heroCavallo from "@/assets/hero-cavallo-murgese.jpg";
import seasonAttacchi from "@/assets/season-exp-summer-attacchi.jpg";
import seasonWinterHorses from "@/assets/season-exp-winter-horses.jpg";

type Soul = "warm" | "dark";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  soul: Soul;
  // posizione nello spazio 3D (normalizzata)
  x: number; // -1 .. 1 (relativa alla viewport)
  y: number; // -1 .. 1
  z: number; // 0 (vicina) .. 1 (lontana)
  w: number; // larghezza in vmin
  ratio: number; // aspect ratio (w/h)
}

// Set bilanciato 50/50 (caldo ↔ nero Murgese), alternato lungo Z
// {/* DA CONFERMARE: foto reali del cliente */}
const IMAGES: GalleryImage[] = [
  // Z lontano → vicino, alternato W/D/W/D...
  { id: "g01", src: heroImg, alt: "Facciata della masseria al tramonto", caption: "La facciata · ora dorata", soul: "warm", x: -0.55, y: -0.25, z: 0.98, w: 34, ratio: 16 / 10 },
  { id: "g02", src: horseApparition, alt: "Cavallo Murgese in luce radente", caption: "Apparizione · Murgese", soul: "dark", x: 0.5, y: 0.22, z: 0.92, w: 30, ratio: 4 / 5 },
  { id: "g03", src: storyOrigini, alt: "Vista d'epoca della masseria", caption: "Origini · archivio", soul: "warm", x: 0.35, y: -0.38, z: 0.84, w: 26, ratio: 3 / 2 },
  { id: "g04", src: horseGallop, alt: "Cavallo Murgese al galoppo nella prateria", caption: "Galoppo · prateria", soul: "dark", x: -0.45, y: 0.35, z: 0.78, w: 32, ratio: 16 / 9 },
  { id: "g05", src: eventsWedding, alt: "Sposi al tramonto tra gli ulivi", caption: "Matrimonio · ulivi", soul: "warm", x: 0.6, y: -0.05, z: 0.7, w: 24, ratio: 3 / 4 },
  { id: "g06", src: storyCavalli, alt: "Cavalli Murgesi nella corte storica", caption: "Stirpe · corte", soul: "dark", x: -0.62, y: 0.05, z: 0.62, w: 28, ratio: 4 / 3 },
  { id: "g07", src: kitchenPrimi, alt: "Orecchiette fatte a mano", caption: "Orecchiette · tradizione", soul: "warm", x: 0.1, y: 0.42, z: 0.55, w: 22, ratio: 1 },
  { id: "g08", src: horsesTradition, alt: "Attacchi d'epoca con cavalli Murgesi", caption: "Attacchi d'epoca", soul: "dark", x: 0.55, y: -0.45, z: 0.48, w: 30, ratio: 16 / 10 },
  { id: "g09", src: eventsHall, alt: "Sala storica apparecchiata", caption: "La sala · volte del '700", soul: "warm", x: -0.5, y: -0.4, z: 0.4, w: 28, ratio: 3 / 2 },
  { id: "g10", src: seasonEquestrian, alt: "Cavalli al pascolo nella Murgia", caption: "Pascolo · Murgia", soul: "dark", x: -0.15, y: 0.45, z: 0.34, w: 34, ratio: 16 / 9 },
  { id: "g11", src: kitchenAntipasti, alt: "Antipasti della tradizione pugliese", caption: "Antipasti · convivio", soul: "warm", x: 0.5, y: 0.3, z: 0.28, w: 22, ratio: 4 / 5 },
  { id: "g12", src: heroCavallo, alt: "Ritratto di un cavallo Murgese", caption: "Ritratto · Murgese", soul: "dark", x: -0.55, y: -0.15, z: 0.22, w: 26, ratio: 3 / 4 },
  { id: "g13", src: eventsGarden, alt: "Giardino della masseria al tramonto", caption: "Giardino · tramonto", soul: "warm", x: 0.35, y: -0.35, z: 0.16, w: 30, ratio: 16 / 10 },
  { id: "g14", src: seasonAttacchi, alt: "Sfilata di attacchi d'epoca in estate", caption: "Sfilata · estate", soul: "dark", x: -0.4, y: 0.4, z: 0.12, w: 28, ratio: 16 / 9 },
  { id: "g15", src: kitchenWine, alt: "Calice di Primitivo controluce", caption: "Primitivo · calice", soul: "warm", x: 0.62, y: 0.08, z: 0.07, w: 20, ratio: 4 / 5 },
  { id: "g16", src: seasonWinterHorses, alt: "Cavalli Murgesi nel paesaggio invernale", caption: "Inverno · stirpe", soul: "dark", x: -0.55, y: -0.05, z: 0.03, w: 26, ratio: 4 / 3 },
  // Sfondo distante: secondaria larga
  { id: "g17", src: placeOlives, alt: "Ulivi secolari nella campagna", caption: "Ulivi secolari", soul: "warm", x: 0.0, y: 0.05, z: 1.0, w: 60, ratio: 16 / 9 },
  { id: "g18", src: placeMasseria, alt: "La masseria vista dalla campagna", caption: "Veduta · campagna", soul: "warm", x: -0.2, y: -0.5, z: 0.45, w: 24, ratio: 3 / 2 },
  { id: "g19", src: storyPietra, alt: "Muro a secco in pietra calcarea", caption: "Pietra · muro a secco", soul: "warm", x: 0.0, y: -0.45, z: 0.25, w: 22, ratio: 1 },
  { id: "g20", src: kitchenSecondi, alt: "Secondo della tradizione murgiana", caption: "Secondi", soul: "warm", x: 0.18, y: 0.0, z: 0.5, w: 20, ratio: 4 / 5 },
  { id: "g21", src: storyFamiglia, alt: "Ritratto familiare nella corte", caption: "La famiglia", soul: "warm", x: -0.25, y: 0.25, z: 0.18, w: 22, ratio: 3 / 4 },
  { id: "g22", src: eventsPrivate, alt: "Tavolata privata sotto luci sospese", caption: "Festa · luci", soul: "warm", x: 0.42, y: 0.45, z: 0.4, w: 26, ratio: 16 / 10 },
  { id: "g23", src: kitchenDolci, alt: "Dolce della tradizione con mandorle", caption: "Dolci · mandorle", soul: "warm", x: -0.15, y: -0.1, z: 0.6, w: 18, ratio: 1 },
  { id: "g24", src: eventsKitchen, alt: "Chef impiatta in cucina", caption: "Cucina su misura", soul: "warm", x: 0.0, y: 0.35, z: 0.88, w: 22, ratio: 3 / 2 },
  { id: "g25", src: storyOggi, alt: "Dettaglio contemporaneo degli interni", caption: "Oggi · dettaglio", soul: "warm", x: -0.35, y: -0.05, z: 0.5, w: 22, ratio: 4 / 5 },
];

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
            borderRadius: "10px",
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
