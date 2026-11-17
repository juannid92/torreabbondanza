import { useCallback, useEffect, useState } from "react";

const INTRO_STORAGE_KEY = "torreabbondanza.introSeen";
const INTRO_DURATION_MS = 10_000;
const FADE_DURATION_MS = 700;

/**
 * Intro animata full-screen basata su WebP animato senza audio (`/intro-video.webp`).
 * Viene mostrata una volta per sessione all'ingresso sulla Home, con chiusura
 * automatica al termine dei 10s o manuale tramite il pulsante "Salta intro".
 */
export function IntroOverlay() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);

  const dismiss = useCallback(() => {
    setFading(true);
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* sessionStorage non disponibile */
    }
    window.setTimeout(() => {
      setMounted(false);
    }, FADE_DURATION_MS);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    try {
      if (sessionStorage.getItem(INTRO_STORAGE_KEY) === "1") return;
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* noop */
    }

    setMounted(true);

    const timer = window.setTimeout(() => {
      dismiss();
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [dismiss]);

  if (!mounted) return null;

  return (
    <div
      role="region"
      aria-label="Intro Masseria Torre Abbondanza"
      className={`fixed inset-0 z-[80] overflow-hidden bg-murgese transition-opacity duration-700 ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/intro-video.webp"
        alt=""
        aria-hidden
        decoding="async"
        className="h-full w-full object-cover"
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
