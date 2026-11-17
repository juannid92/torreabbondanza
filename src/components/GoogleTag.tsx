import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { GOOGLE_TAG_ID } from "@/lib/site";

const CONSENT_STORAGE_KEY = "torreabbondanza.cookieConsent";

type ConsentCategories = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    __gtagInitialized?: boolean;
  }
}

/**
 * Invia un evento personalizzato al Google Tag (solo se inizializzato).
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

function updateGtagConsent(categories: ConsentCategories): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: categories.analytics ? "granted" : "denied",
    ad_storage: categories.marketing ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
  });
}

function readStoredConsent(): ConsentCategories | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version?: number; categories?: ConsentCategories };
    if (parsed.version !== 1 || !parsed.categories) return null;
    return parsed.categories;
  } catch {
    return null;
  }
}

/**
 * Carica e gestisce il Google Tag (gtag.js) con Google Consent Mode v2:
 * - Imposta il consenso di default su `denied` prima del caricamento dello script
 * - Legge e applica eventuali preferenze già salvate da `CookieBanner`
 * - Si aggiorna in tempo reale all'evento `cookie-consent-change`
 * - Traccia le page view SPA su cambio route e i click su WhatsApp / Telefono / Form
 */
export function GoogleTag() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.__gtagInitialized) {
      window.__gtagInitialized = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };

      // Google Consent Mode v2 — tutto negato finché l'utente non accetta
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        wait_for_update: 500,
      });

      const stored = readStoredConsent();
      if (stored) {
        updateGtagConsent(stored);
      }

      window.gtag("js", new Date());
      window.gtag("config", GOOGLE_TAG_ID, {
        anonymize_ip: true,
        send_page_view: false,
      });

      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_TAG_ID)}`;
        document.head.appendChild(script);
      }
    }

    const onConsentChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentCategories>).detail;
      if (detail) {
        updateGtagConsent(detail);
      }
    };

    const onOutboundOrFormClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/") || href.includes("whatsapp.com")) {
        trackEvent("generate_lead", {
          event_category: "engagement",
          method: "whatsapp",
          link_url: href,
        });
      } else if (href.startsWith("tel:")) {
        trackEvent("generate_lead", {
          event_category: "engagement",
          method: "phone",
          link_url: href,
        });
      }
    };

    const onFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement | null;
      if (form && form.closest("#contatti")) {
        trackEvent("generate_lead", {
          event_category: "engagement",
          method: "contact_form",
        });
      }
    };

    window.addEventListener("cookie-consent-change", onConsentChange);
    document.addEventListener("click", onOutboundOrFormClick, { passive: true });
    document.addEventListener("submit", onFormSubmit, { passive: true });

    return () => {
      window.removeEventListener("cookie-consent-change", onConsentChange);
      document.removeEventListener("click", onOutboundOrFormClick);
      document.removeEventListener("submit", onFormSubmit);
    };
  }, []);

  // Traccia page_view SPA su ogni navigazione di TanStack Router
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const pagePath = `${location.pathname}${location.searchStr ?? ""}${location.hash ?? ""}`;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.searchStr, location.hash]);

  return null;
}
