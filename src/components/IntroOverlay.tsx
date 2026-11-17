import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INTRO_STORAGE_KEY = "torreabbondanza.introSeen";
const INTRO_FALLBACK_MS = 10_800;
const FADE_DURATION_MS = 700;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Intro animata full-screen basata su MP4 HD senza audio (`/intro-video.mp4`).
 * Mostrata una volta per sessione all'ingresso sulla Home, senza flash del sito
 * sottostante (coordinata con `html.intro-pending` in __root.tsx).
 */
export function IntroOverlay() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setFading(true);
    document.documentElement.classList.remove("intro-pending");
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* sessionStorage non disponibile */
    }
    ScrollTrigger.refresh(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.setTimeout(() => {
      setMounted(false);
    }, FADE_DURATION_MS);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.documentElement.classList.remove("intro-pending");
      return;
    }

    try {
      if (sessionStorage.getItem(INTRO_STORAGE_KEY) === "1") {
        document.documentElement.classList.remove("intro-pending");
        return;
      }
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* noop */
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Rimuove intro-pending solo dopo che l'overlay z-[80] è già dipinto sullo schermo
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.remove("intro-pending");
      ScrollTrigger.refresh(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        dismiss();
      });
    }

    const fallbackTimer = window.setTimeout(() => {
      dismiss();
    }, INTRO_FALLBACK_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallbackTimer);
      document.documentElement.classList.remove("intro-pending");
    };
  }, [mounted, dismiss]);

  if (!mounted) return null;

  return (
    <div
      data-intro-overlay
      role="region"
      aria-label="Intro Masseria Torre Abbondanza"
      className={`fixed inset-0 z-[80] touch-none overscroll-none select-none overflow-hidden bg-murgese transition-opacity duration-700 ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/intro-video.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden
        onEnded={dismiss}
        onError={dismiss}
        className="h-full w-full object-contain md:object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--murgese) 55%, transparent), transparent)",
        }}
      />

      <button
        type="button"
        onClick={dismiss}
        className="fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ivory/25 bg-[color:var(--murgese)]/75 px-5 py-2.5 text-eyebrow text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span>Salta intro</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
