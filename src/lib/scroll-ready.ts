import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let initialised = false;

const REVEAL_SELECTOR = "[data-reveal]";

export function observeRevealElements(root: ParentNode = document): () => void {
  if (typeof window === "undefined") return () => undefined;

  const elements = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
  if (!elements.length) return () => undefined;

  const pending = new Set(elements);

  const reveal = (el: HTMLElement) => {
    el.classList.add("in-view");
    el.removeAttribute("data-reveal-pending");
    pending.delete(el);
  };

  const isInRevealZone = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return rect.top <= vh * 0.92 && rect.bottom >= vh * 0.04;
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    elements.forEach(reveal);
    return () => undefined;
  }

  elements.forEach((el) => {
    if (!el.classList.contains("in-view")) {
      el.setAttribute("data-reveal-pending", "true");
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        reveal(el);
        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  elements.forEach((el) => observer.observe(el));

  let raf = 0;
  const checkVisible = () => {
    raf = 0;
    pending.forEach((el) => {
      if (!document.documentElement.contains(el)) {
        pending.delete(el);
        return;
      }
      if (!isInRevealZone(el)) return;
      reveal(el);
      observer.unobserve(el);
    });
  };

  const scheduleCheck = () => {
    if (raf) return;
    raf = requestAnimationFrame(checkVisible);
  };

  scheduleCheck();
  window.addEventListener("scroll", scheduleCheck, { passive: true });
  window.addEventListener("resize", scheduleCheck);
  window.addEventListener("orientationchange", scheduleCheck);
  window.addEventListener("load", scheduleCheck, { once: true });

  // Fail-safe: se l'observer non scatta per desync/layout, nessun contenuto resta vuoto.
  const fallback = window.setTimeout(() => {
    elements.forEach(reveal);
    observer.disconnect();
  }, 1800);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.clearTimeout(fallback);
    window.removeEventListener("scroll", scheduleCheck);
    window.removeEventListener("resize", scheduleCheck);
    window.removeEventListener("orientationchange", scheduleCheck);
    window.removeEventListener("load", scheduleCheck);
    observer.disconnect();
  };
}

/**
 * Inizializza una sola volta i fix globali per ScrollTrigger su mobile/desktop:
 * - ignora il resize dovuto alla barra indirizzi iOS
 * - aspetta fonts + immagini per fare il primo refresh "vero"
 * - rifresha al resize (debounced) e su orientationchange
 * - aggiunge `js-ready` su <html> così la CSS può eventualmente garantire
 *   contenuti visibili come fallback
 */
export function initScrollReady(): void {
  if (typeof window === "undefined" || initialised) return;
  initialised = true;

  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.classList.add("js-ready");

  const refresh = () => ScrollTrigger.refresh();

  const waitImages = async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        // prova decode() con fallback su onload
        return img
          .decode?.()
          .catch(() => {
            return new Promise<void>((res) => {
              const done = () => res();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
            });
          }) ?? new Promise<void>((res) => {
            const done = () => res();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          });
      }),
    );
  };

  const waitFonts = async () => {
    try {
      await (document as Document & { fonts?: { ready: Promise<void> } }).fonts?.ready;
    } catch {
      /* noop */
    }
  };

  // Primo refresh "veloce" sul prossimo frame, così i trigger sono almeno calcolati.
  requestAnimationFrame(refresh);

  // Secondo refresh dopo che fonts + immagini sono pronti: questo è quello
  // che risolve i pin/scrub calcolati prima del layout finale.
  Promise.all([waitFonts(), waitImages()])
    .then(() => {
      // doppio refresh: uno subito, uno dopo un frame per assestare.
      ScrollTrigger.refresh(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })
    .catch(() => {
      ScrollTrigger.refresh(true);
    });

  // Fallback: se "load" tarda perché ci sono asset esterni, rifresha comunque.
  window.addEventListener("load", () => ScrollTrigger.refresh(true), { once: true });

  // Debounced refresh su resize/orientation
  let t: ReturnType<typeof setTimeout> | null = null;
  const scheduleRefresh = () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      ScrollTrigger.refresh();
      t = null;
    }, 180);
  };
  window.addEventListener("resize", scheduleRefresh);
  window.addEventListener("orientationchange", scheduleRefresh);
}