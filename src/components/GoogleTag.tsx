import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

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
  }
}

/**
 * Invia un evento personalizzato al dataLayer tramite `gtag`.
 */
function trackEvent(eventName: string, params?: Record<string, unknown>): void {
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
 * Sincronizza Google Consent Mode v2 con `CookieBanner`, traccia le navigazioni SPA
 * e invia gli eventi `generate_lead` verso Google Tag Manager (`gtm.js` in SSR `<head>`):
 * - Aggiorna in tempo reale il consenso all'evento `cookie-consent-change`
 * - Invia `page_view` sui cambi rotta SPA successivi al caricamento iniziale
 * - Traccia i click su WhatsApp / Telefono e l'invio del form `#contatti`
 */
export function GoogleTag() {
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fallback difensivo se il componente fosse montato senza lo script SSR in <head>
    if (typeof window.gtag !== "function") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
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

  // Traccia page_view SPA solo sui cambi di rotta successivi al caricamento SSR iniziale
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pagePath = `${location.pathname}${location.searchStr ?? ""}${location.hash ?? ""}`;
    if (previousPathRef.current === null) {
      previousPathRef.current = pagePath;
      return;
    }
    if (previousPathRef.current === pagePath) return;
    previousPathRef.current = pagePath;
    trackEvent("page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.searchStr, location.hash]);

  return null;
}
