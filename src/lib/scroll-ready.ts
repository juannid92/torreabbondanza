import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let initialised = false;

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
      document.documentElement.classList.add("js-ready");
      // doppio refresh: uno subito, uno dopo un frame per assestare.
      ScrollTrigger.refresh(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })
    .catch(() => {
      document.documentElement.classList.add("js-ready");
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