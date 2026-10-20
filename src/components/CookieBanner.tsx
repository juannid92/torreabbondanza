import { useEffect, useState } from "react";
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
  window.dispatchEvent(
    new CustomEvent<Categories>("cookie-consent-change", { detail: categories }),
  );
}

export type CookieBannerHandle = {
  openPreferences: () => void;
};

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={panel}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          initial={reduced ? { opacity: 1 } : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none px-3 pb-3 md:px-6 md:pb-6"
        >
          <div className="pointer-events-auto mx-auto w-full max-w-4xl rounded-lg border border-stone/40 bg-ivory/95 backdrop-blur-md shadow-[0_-16px_48px_-16px_color-mix(in_oklab,var(--ink)_35%,transparent)]">
            {panel === "banner" ? (
              <BannerView
                onAccept={acceptAll}
                onCustomize={() => setPanel("prefs")}
                onClose={rejectAll}
              />
            ) : (
              <PrefsView onSave={savePrefs} onClose={() => setOpen(false)} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Banner ---------------- */
function BannerView({
  onAccept,
  onCustomize,
  onClose,
}: {
  onAccept: () => void;
  onCustomize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-4 p-4 pr-10 md:p-6 md:pr-12 md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="flex items-start gap-3 md:flex-1">
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink"
        >
          <Cookie className="h-4 w-4" />
        </span>
        <div>
          <h2
            id="cookie-banner-title"
            className="font-display text-base font-semibold text-ink md:text-lg"
          >
            Informativa sui cookie tecnici
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink/80 md:text-sm">
            Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento e non
            impiega cookie di profilazione o tracciamento. Per i dettagli consulta la{" "}
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
            .
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 md:shrink-0">
        <button
          type="button"
          onClick={onCustomize}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[11px] tracking-[0.16em] uppercase text-ink transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Dettagli
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2 text-[11px] tracking-[0.16em] uppercase text-ivory transition-colors hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <Check className="h-3.5 w-3.5" />
          Ho capito
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi informativa cookie"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-stone/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------- Pannello Preferenze ---------------- */
function PrefsView({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
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
        Stato dei cookie sul sito
      </h2>
      <p className="mt-2 text-sm text-ink/80">
        Ai sensi del Provvedimento del Garante per la protezione dei dati personali del 10 giugno
        2021, questo sito utilizza soltanto cookie tecnici strettamente necessari all'erogazione del
        servizio.
      </p>

      <ul className="mt-5 grid gap-3">
        <CookieRow
          name="Cookie tecnici (sempre attivi)"
          description="Necessari al funzionamento della rete di distribuzione e alla sicurezza del sito (Cloudflare). Non profilano l'utente."
          required
          checked
        />
        <CookieRow
          name="Cookie analitici e di marketing (assenti)"
          description="Questo sito non installa cookie analitici di terze parti né pixel pubblicitari o di profilazione."
          required
          checked={false}
        />
      </ul>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink/60">
          Per approfondire consulta la{" "}
          <Link to="/cookie" className="underline hover:text-terracotta">
            Cookie Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase text-ivory transition-colors hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <Check className="h-3.5 w-3.5" />
          Chiudi e salva
        </button>
      </div>
    </div>
  );
}

function CookieRow({
  name,
  description,
  checked,
  required,
}: {
  name: string;
  description: string;
  checked: boolean;
  required?: boolean;
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
          readOnly
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
