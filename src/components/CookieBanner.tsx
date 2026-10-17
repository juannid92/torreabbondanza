import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cookie, Settings2, X, Check } from "lucide-react";

/**
 * Banner cookie GDPR-compliant (Provv. Garante 10 giugno 2021 + art. 13 GDPR).
 *
 * Regole rispettate:
 * - Visibilità: compare al primo accesso, full-width in basso su mobile e desktop.
 * - Scelta esplicita: due pulsanti equivalenti ("Rifiuta" e "Accetta") + link
 *   "Personalizza" per la gestione puntuale. Nessun dark pattern.
 * - Granularità: cookie tecnici (sempre attivi, non richiedono consenso),
 *   cookie analitici / marketing (placeholder, oggi non presenti: marcati OFF).
 * - Revoca: il visitatore può riaprire il pannello in qualsiasi momento tramite
 *   l'azione "Preferenze cookie" presente nel footer e in qualsiasi punto
 *   della pagina tramite l'evento globale "open-cookie-preferences".
 * - Persistenza: localStorage "torreabbondanza.cookieConsent" con
 *   versione policy, timestamp e categorie; il banner ricompare se l'utente
 *   riapre le preferenze o se la versione di policy cambia.
 * - Skip automatico sulle pagine policy (/privacy, /cookie) per non disturbare
 *   chi sta già leggendo l'informativa.
 */

const STORAGE_KEY = "torreabbondanza.cookieConsent";
const POLICY_VERSION = 1;
const SKIP_PATHS = ["/privacy", "/cookie"];

type Categories = {
  necessary: true; // sempre true: cookie tecnici non disattivabili
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = {
  version: number;
  decidedAt: string; // ISO
  categories: Categories;
};

const DEFAULT_CATEGORIES: Categories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== POLICY_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(categories: Categories) {
  if (typeof window === "undefined") return;
  const payload: StoredConsent = {
    version: POLICY_VERSION,
    decidedAt: new Date().toISOString(),
    categories,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* localStorage disabilitato: il banner ricomparirà, accettabile */
  }
  // Notifica eventuali listener (es. blocco analytics)
  window.dispatchEvent(new CustomEvent<Categories>("cookie-consent-change", { detail: categories }));
}

export type CookieBannerHandle = {
  openPreferences: () => void;
};

export function useCookiePreferences() {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }, []);
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"banner" | "prefs">("banner");
  const [categories, setCategories] = useState<Categories>(DEFAULT_CATEGORIES);
  const reduced = useReducedMotion();

  // Mostra il banner al primo accesso, oppure se l'utente chiede le preferenze.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (SKIP_PATHS.includes(window.location.pathname)) return;

    const stored = readConsent();
    if (!stored) {
      setOpen(true);
      setPanel("banner");
    }

    const onOpenPrefs = () => {
      const current = readConsent();
      setCategories(current?.categories ?? DEFAULT_CATEGORIES);
      setPanel("prefs");
      setOpen(true);
    };
    window.addEventListener("open-cookie-preferences", onOpenPrefs);
    return () => window.removeEventListener("open-cookie-preferences", onOpenPrefs);
  }, []);

  const acceptAll = () => {
    const c: Categories = { necessary: true, analytics: true, marketing: true };
    setCategories(c);
    writeConsent(c);
    setOpen(false);
  };

  const rejectAll = () => {
    const c: Categories = { necessary: true, analytics: false, marketing: false };
    setCategories(c);
    writeConsent(c);
    setOpen(false);
  };

  const savePrefs = () => {
    writeConsent(categories);
    setOpen(false);
  };

  const toggle = (k: "analytics" | "marketing") =>
    setCategories((p) => ({ ...p, [k]: !p[k] }));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay leggero per concentrare l'attenzione sulle preferenze */}
          <motion.div
            key="overlay"
            initial={reduced ? { opacity: 0.3 } : { opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[59] bg-ink"
            aria-hidden
          />

          <motion.div
            key={panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-banner-title"
            initial={reduced ? { opacity: 1 } : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:px-6 md:pb-6"
          >
            <div className="mx-auto w-full max-w-5xl rounded-lg border border-stone/30 bg-ivory shadow-[0_-20px_60px_-20px_color-mix(in_oklab,var(--ink)_50%,transparent)]">
              {panel === "banner" ? (
                <BannerView
                  onAccept={acceptAll}
                  onReject={rejectAll}
                  onCustomize={() => setPanel("prefs")}
                  onClose={rejectAll}
                />
              ) : (
                <PrefsView
                  categories={categories}
                  onToggle={toggle}
                  onSave={savePrefs}
                  onAcceptAll={acceptAll}
                  onRejectAll={rejectAll}
                  onClose={() => setOpen(false)}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Banner ---------------- */
function BannerView({
  onAccept,
  onReject,
  onCustomize,
  onClose,
}: {
  onAccept: () => void;
  onReject: () => void;
  onCustomize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 p-5 md:p-7 md:flex-row md:items-start md:gap-8">
      <div className="flex items-start gap-3 md:flex-1">
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink"
        >
          <Cookie className="h-4 w-4" />
        </span>
        <div>
          <h2
            id="cookie-banner-title"
            className="font-display text-lg font-semibold text-ink md:text-xl"
          >
            Questo sito usa solo cookie tecnici
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/80 md:text-[15px]">
            Non utilizziamo cookie di profilazione, tracciamento o marketing, ma il provider di
            hosting (Cloudflare) può installare cookie tecnici necessari al funzionamento del
            sito. Per maggiori informazioni leggi la{" "}
            <Link
              to="/cookie"
              className="font-medium text-ink underline underline-offset-4 hover:text-terracotta"
            >
              Cookie Policy
            </Link>{" "}
            e la{" "}
            <Link
              to="/privacy"
              className="font-medium text-ink underline underline-offset-4 hover:text-terracotta"
            >
              Privacy Policy
            </Link>
            . Puoi modificare la tua scelta in qualsiasi momento dal footer (
            <em>Preferenze cookie</em>).
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-3">
        <button
          type="button"
          onClick={onCustomize}
          className="order-3 inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ink transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:order-1 md:px-5"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Personalizza
        </button>
        <button
          type="button"
          onClick={onReject}
          className="order-2 inline-flex items-center justify-center rounded-full border border-ink/30 bg-transparent px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ink transition-colors hover:border-ink hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          Rifiuta
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="order-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ivory transition-colors hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:order-3"
        >
          <Check className="h-3.5 w-3.5" />
          Accetta
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi informativa cookie (rifiuta)"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-stone/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------- Pannello Preferenze ---------------- */
function PrefsView({
  categories,
  onToggle,
  onSave,
  onAcceptAll,
  onRejectAll,
  onClose,
}: {
  categories: Categories;
  onToggle: (k: "analytics" | "marketing") => void;
  onSave: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative p-5 md:p-7">
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi preferenze cookie"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-stone/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <X className="h-4 w-4" />
      </button>

      <h2
        id="cookie-banner-title"
        className="font-display text-lg font-semibold text-ink md:text-xl"
      >
        Preferenze cookie
      </h2>
      <p className="mt-2 text-sm text-ink/80">
        Gestisci le categorie di cookie. I cookie tecnici sono necessari al funzionamento del
        sito e non possono essere disattivati. Le altre categorie sono opzionali.
      </p>

      <ul className="mt-5 grid gap-3">
        <CookieRow
          name="Cookie tecnici"
          description="Necessari al funzionamento del sito (bilanciamento, sicurezza). Non profilano l'utente."
          required
          checked
          onToggle={() => undefined}
        />
        <CookieRow
          name="Cookie analitici"
          description="Statistica anonima delle visite per migliorare il sito. Ad oggi non attivi su questo sito."
          checked={categories.analytics}
          onToggle={() => onToggle("analytics")}
        />
        <CookieRow
          name="Cookie di marketing"
          description="Profilazione e annunci personalizzati. Ad oggi non attivi su questo sito."
          checked={categories.marketing}
          onToggle={() => onToggle("marketing")}
        />
      </ul>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink/60">
          Per dettagli leggi la{" "}
          <Link to="/cookie" className="underline hover:text-terracotta">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onRejectAll}
            className="inline-flex items-center justify-center rounded-full border border-ink/30 bg-transparent px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ink transition-colors hover:border-ink hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Rifiuta tutti
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center justify-center rounded-full border border-ink/30 px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ink transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Salva preferenze
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ivory transition-colors hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <Check className="h-3.5 w-3.5" />
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
}

function CookieRow({
  name,
  description,
  checked,
  required,
  onToggle,
}: {
  name: string;
  description: string;
  checked: boolean;
  required?: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-md border border-stone/40 p-4">
      <div>
        <p className="font-medium text-ink">{name}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink/70">{description}</p>
      </div>
      <label className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={required}
          onChange={onToggle}
          className="peer sr-only"
          aria-label={name}
        />
        <span
          aria-hidden
          className="h-6 w-11 rounded-full bg-ink/15 transition-colors peer-checked:bg-terracotta peer-disabled:opacity-60"
        />
        <span
          aria-hidden
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-transform peer-checked:translate-x-5"
        />
      </label>
    </li>
  );
}
