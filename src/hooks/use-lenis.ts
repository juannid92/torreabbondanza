import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initScrollReady } from "@/lib/scroll-ready";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/**
 * Scroll morbido verso un'ancora o in cima alla pagina.
 * Usa Lenis su desktop quando attivo, altrimenti lo scroll nativo del browser.
 * Se la sezione richiesta non è presente nella pagina corrente (es. sottopagine),
 * reindirizza automaticamente all'ancora sulla Home (`/#id`).
 */
export function scrollToSection(target: string): void {
  if (typeof window === "undefined") return;

  const lenis = window.__lenis;
  if (target === "#top") {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  const id = target.replace(/^\/?#/, "");
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) {
    window.location.assign(`/#${id}`);
    return;
  }

  if (lenis) {
    lenis.scrollTo(el);
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Inizializza Lenis su desktop e sincronizza con GSAP ScrollTrigger.
 * Su dispositivi touch (mobile/tablet senza puntatore fine) lascia lo scroll
 * nativo puro al compositor thread per evitare competizione col main thread.
 * Gestisce anche i click sulle ancore `#...` cross-page in modo uniforme.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inizializza i fix globali di ScrollTrigger (refresh dopo fonts/immagini,
    // resize debounce, ignoreMobileResize). Va eseguito SEMPRE.
    initScrollReady();

    // Gestione delegata click su ancore: scorre in pagina se il target esiste,
    // oppure reindirizza a /#id se ci si trova su una pagina dedicata.
    const onAnchorClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href === "/#") return;

      if (href.startsWith("/#")) {
        const id = href.slice(2);
        if (!document.getElementById(id)) {
          // Lascia gestire la navigazione al router (es. <Link to="/" hash="...">)
          return;
        }
      }

      e.preventDefault();
      scrollToSection(href);
    };
    document.addEventListener("click", onAnchorClick);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarseOnly =
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(pointer: fine)").matches;

    if (reduced || isCoarseOnly) {
      window.__lenis = null;
      return () => {
        document.removeEventListener("click", onAnchorClick);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    ScrollTrigger.refresh(true);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      if (window.__lenis === lenis) {
        window.__lenis = null;
      }
    };
  }, []);

  return lenisRef;
}
