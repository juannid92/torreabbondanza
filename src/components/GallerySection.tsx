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
  const sceneRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const [isReduced, setIsReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setIsReduced(mqMotion.matches);
      setIsMobile(mqMobile.matches);
    };
    sync();
    mqMotion.addEventListener("change", sync);
    mqMobile.addEventListener("change", sync);
    return () => {
      mqMotion.removeEventListener("change", sync);
      mqMobile.removeEventListener("change", sync);
    };
  }, []);

  // 3D camera dolly: avanza Z dell'intera scena durante lo scroll pinnato.
  useEffect(() => {
    if (isReduced || isMobile) return;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const sticky = stickyRef.current;
    if (!scene || !camera || !sticky) return;

    const ctx = gsap.context(() => {
      // Range di dolly: la scena traslerà in Z da Zstart (lontana) a Zend (vicina).
      // Il valore positivo "avanza" la camera dentro la scena (le foto crescono).
      const Zstart = 0;
      const Zend = 2600; // unità: px (compatibili con perspective)

      gsap.set(camera, { z: Zstart });

      gsap.to(camera, {
        z: Zend,
        ease: "none",
        scrollTrigger: {
          trigger: sticky,
          start: "top top",
          end: "+=350%",
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Per ciascuna foto: didascalia in fade quando il piano è vicino alla camera.
      const items = scene.querySelectorAll<HTMLElement>("[data-plane]");
      items.forEach((plane) => {
        const caption = plane.querySelector<HTMLElement>("[data-caption]");
        const img = plane.querySelector<HTMLElement>("[data-img]");
        const baseZ = parseFloat(plane.dataset.basez || "0"); // negativa: lontana
        if (caption) gsap.set(caption, { opacity: 0, y: 8 });

        ScrollTrigger.create({
          trigger: sticky,
          start: "top top",
          end: "+=350%",
          scrub: true,
          onUpdate: (self) => {
            // Z effettiva = baseZ + cameraZ (cameraZ è positivo e cresce)
            const cameraZ = Zstart + (Zend - Zstart) * self.progress;
            const effective = baseZ + cameraZ;
            // "Distanza" dalla camera (focal plane a 0)
            const dist = -effective; // positivo se ancora davanti, negativo se passata
            const absDist = Math.abs(dist);
            // Fuoco: nitida fra -200 e 400, sfocata oltre
            const blur =
              dist > 400
                ? Math.min(8, (dist - 400) / 180)
                : dist < -200
                  ? Math.min(10, (-dist - 200) / 120)
                  : 0;
            if (img) img.style.filter = blur ? `blur(${blur.toFixed(2)}px)` : "none";
            // Opacità: appare arrivando e svanisce passando oltre
            const opacity =
              dist > 1800
                ? Math.max(0, 1 - (dist - 1800) / 600)
                : dist < -400
                  ? Math.max(0, 1 + (dist + 400) / 300)
                  : 1;
            plane.style.opacity = opacity.toFixed(3);
            // Didascalia visibile solo in primo piano (focus window)
            if (caption) {
              const inFocus = absDist < 250 ? 1 : 0;
              caption.style.opacity = inFocus.toString();
              caption.style.transform = `translateY(${inFocus ? 0 : 8}px)`;
            }
          },
        });
      });
    }, sceneRef);

    return () => ctx.revert();
  }, [isReduced, isMobile]);

  // Hover tilt 3D (desktop, non-reduced)
  useEffect(() => {
    if (isReduced || isMobile) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const planes = scene.querySelectorAll<HTMLElement>("[data-plane]");
    const handlers: Array<() => void> = [];
    planes.forEach((plane) => {
      const card = plane.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - rect.left) / rect.width - 0.5;
        const dy = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(-dy * 8).toFixed(2)}deg) rotateY(${(dx * 10).toFixed(2)}deg) scale(1.04)`;
      };
      const onLeave = () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => handlers.forEach((fn) => fn());
  }, [isReduced, isMobile]);

  // Fallback fade-in (mobile / reduced)
  useEffect(() => {
    if (!isReduced && !isMobile) return;
    const root = fallbackRef.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-fallback-item]");
    if (isReduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: (i % 4) * 0.05,
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [isReduced, isMobile]);

  const handleOpen = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-plane][data-id="${id}"], [data-fallback-item][data-id="${id}"]`);
    originRef.current = el;
    setOpenId(id);
  };

  const handleClose = () => {
    setOpenId(null);
    requestAnimationFrame(() => {
      originRef.current?.focus();
    });
  };

  const useImmersive = !isReduced && !isMobile;

  return (
    <section
      ref={rootRef}
      id="galleria"
      aria-labelledby="gallery-title"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, #15110F 18%, var(--ivory)) 0%, var(--ivory) 28%, var(--ivory) 72%, color-mix(in oklab, #15110F 10%, var(--ivory)) 100%)",
      }}
    >
      {/* Continuità con sez.08 (inverno scuro → spazio profondo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, #15110F 35%, transparent), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 md:px-12 md:pt-40 md:pb-16">
        <p className="text-eyebrow text-ink/65">09 — Galleria</p>
        <h2
          id="gallery-title"
          className="font-display mt-6 max-w-4xl font-medium leading-[0.95] text-ink"
          style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
        >
          Le due <em className="text-terracotta">anime</em>{" "}
          <span style={{ color: "var(--murgese, #15110F)" }}>in profondità</span>
        </h2>
        <p className="font-display mt-6 max-w-xl text-lg italic text-ink/75 md:text-xl">
          Pietra calda e stirpe nera, tavola e galoppo: scorri per entrare nella scena.
        </p>
      </div>

      {/* Spazio immersivo 3D */}
      {useImmersive ? (
        <div
          ref={stickyRef}
          className="relative h-screen w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--ivory) 92%, #15110F) 0%, color-mix(in oklab, var(--ivory) 60%, #15110F) 70%, color-mix(in oklab, #15110F 85%, var(--ivory)) 100%)",
            perspective: "1300px",
            perspectiveOrigin: "50% 50%",
          }}
          aria-label="Galleria immersiva — scorri per avanzare nello spazio"
        >
          {/* Bagliore caldo centrale (light bloom) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(40% 30% at 50% 55%, color-mix(in oklab, #C97A3F 22%, transparent), transparent 70%)",
              mixBlendMode: "soft-light",
            }}
          />
          {/* Grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              mixBlendMode: "multiply",
            }}
          />

          <div
            ref={sceneRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={cameraRef}
              className="absolute left-1/2 top-1/2"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {IMAGES.map((img) => {
                // baseZ: lontane = molto negative; vicine = ~ -100..-300
                const baseZ = -(300 + img.z * 2400);
                // offset X/Y in vmin → px reali
                const xPx = `calc(${img.x * 42}vmin)`;
                const yPx = `calc(${img.y * 30}vmin)`;
                const wVmin = img.w;
                const hVmin = img.w / img.ratio;
                const isDark = img.soul === "dark";
                return (
                  <div
                    key={img.id}
                    data-plane
                    data-id={img.id}
                    data-basez={baseZ}
                    className="absolute"
                    style={{
                      left: 0,
                      top: 0,
                      transform: `translate3d(${xPx}, ${yPx}, ${baseZ}px) translate(-50%, -50%)`,
                      transformStyle: "preserve-3d",
                      willChange: "transform, opacity",
                    }}
                  >
                    <button
                      data-card
                      onClick={() => handleOpen(img.id)}
                      aria-label={`Apri immagine: ${img.caption}`}
                      className="group relative block cursor-pointer overflow-hidden text-left transition-transform duration-200 ease-out"
                      style={{
                        width: `${wVmin}vmin`,
                        height: `${hVmin}vmin`,
                        borderRadius: "10px",
                        border: isDark
                          ? "1px solid color-mix(in oklab, #15110F 60%, transparent)"
                          : "1px solid color-mix(in oklab, var(--ivory) 60%, transparent)",
                        boxShadow: isDark
                          ? "0 30px 80px -30px rgba(0,0,0,0.7)"
                          : "0 30px 80px -30px rgba(181,103,58,0.45)",
                        background: isDark ? "#15110F" : "var(--stone, #E7DDCF)",
                        transformOrigin: "center",
                      }}
                    >
                      <img
                        data-img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        style={{ display: "block" }}
                      />
                      {isDark && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, transparent 55%, rgba(21,17,15,0.55) 100%)",
                          }}
                        />
                      )}
                    </button>
                    <div
                      data-caption
                      className="pointer-events-none absolute left-0 right-0 -bottom-7 text-center"
                      style={{
                        transition: "opacity .25s ease, transform .25s ease",
                      }}
                    >
                      <span
                        className="text-eyebrow rounded-full px-3 py-1"
                        style={{
                          background: isDark
                            ? "color-mix(in oklab, #15110F 80%, transparent)"
                            : "color-mix(in oklab, var(--ivory) 90%, transparent)",
                          color: isDark ? "var(--ivory)" : "var(--ink)",
                          letterSpacing: "0.14em",
                        }}
                      >
                        {img.caption}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hint scroll */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <span className="text-eyebrow text-ink/55">Scorri per avanzare ↓</span>
          </div>
        </div>
      ) : (
        <div
          ref={fallbackRef}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 pb-24 md:grid-cols-3 md:gap-5 md:px-12"
        >
          {IMAGES.map((img) => {
            const isDark = img.soul === "dark";
            return (
              <button
                key={img.id}
                data-fallback-item
                data-id={img.id}
                onClick={() => handleOpen(img.id)}
                className="group relative overflow-hidden text-left"
                style={{
                  borderRadius: "10px",
                  aspectRatio: `${img.ratio}`,
                  background: isDark ? "#15110F" : "var(--stone, #E7DDCF)",
                  border: isDark
                    ? "1px solid color-mix(in oklab, #15110F 60%, transparent)"
                    : "1px solid color-mix(in oklab, var(--ink) 12%, transparent)",
                }}
                aria-label={`Apri immagine: ${img.caption}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span
                  className="text-eyebrow absolute left-2 bottom-2 rounded-full px-2 py-1"
                  style={{
                    background: isDark
                      ? "color-mix(in oklab, #15110F 80%, transparent)"
                      : "color-mix(in oklab, var(--ivory) 90%, transparent)",
                    color: isDark ? "var(--ivory)" : "var(--ink)",
                  }}
                >
                  {img.caption}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Chiusura — uscita verso Recensioni */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 md:px-12 md:pt-24 md:pb-40">
        <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <p
            className="font-display max-w-xl leading-tight text-ink"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)" }}
          >
            Due anime, uno sguardo solo. Altri scorci sul nostro Instagram.
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
        images={IMAGES}
        openId={openId}
        onClose={handleClose}
        onNavigate={setOpenId}
      />
    </section>
  );
}
