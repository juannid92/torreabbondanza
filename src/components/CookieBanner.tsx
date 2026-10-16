import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Banner informativo al primo accesso.
 *
 * Il sito non installa cookie opzionali (analytics, marketing, social): solo
 * cookie tecnici di Cloudflare (es. __cf_bm) che non richiedono consenso.
 * Per questo non c'è un banner "Accetta/Rifiuta" granulare: serve solo
 * un'informativa breve che si chiude e non ricompare.
 *
 * Persistenza: localStorage "torreabbondanza.cookieConsent" = "ack".
 * Skip automatico sulle pagine policy: il visitatore ha già letto l'informativa.
 */
const STORAGE_KEY = "torreabbondanza.cookieConsent";
const SKIP_PATHS = ["/privacy", "/cookie"];

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // SSR-safe: lato server non c'è localStorage né location.
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "ack") return;
    } catch {
      // localStorage può essere disabilitato: in quel caso il banner si
      // mostrerà a ogni navigazione. Accettabile come fallback.
    }
    if (SKIP_PATHS.includes(window.location.pathname)) return;
    setVisible(true);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "ack");
    } catch {
      /* noop: vedi sopra */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Informativa cookie"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:right-5 md:bottom-5 md:max-w-md"
        >
          <div className="relative rounded-lg border border-stone/30 bg-ivory/95 p-4 pr-10 shadow-[0_18px_50px_-20px_color-mix(in_oklab,var(--ink)_40%,transparent)] backdrop-blur">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Chiudi informativa cookie"
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-stone/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-[11px] tracking-[0.22em] uppercase text-ink/55">Cookie</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">
              Questo sito non utilizza cookie di profilazione o tracciamento. Vengono impiegati
              solo cookie tecnici del provider di hosting. Per i dettagli consulta la{" "}
              <Link
                to="/cookie"
                className="font-medium text-ink underline underline-offset-4 hover:text-terracotta"
              >
                Cookie Policy
              </Link>
              .
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-1.5 text-[11px] tracking-[0.18em] uppercase text-ink transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                Ho capito
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
