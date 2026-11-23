import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarDays, MessageCircle, Phone, Search, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import {
  EVENT_POSTERS,
  PHONE_HREF,
  PosterFlyerVisual,
  type EventPoster,
} from "@/components/EventPostersShowcase";

const SUNDAY_POSTER = EVENT_POSTERS.find((p) => p.id === "pranzo-domenica-murgia")!;
const CHRONOLOGICAL_FLYER_IDS = [
  "immacolata-8-dicembre",
  "natale-25-dicembre",
  "santo-stefano-26-dicembre",
  "capodanno-1-gennaio",
] as const;
const FEATURED_POSTERS = CHRONOLOGICAL_FLYER_IDS.map(
  (id) => EVENT_POSTERS.find((poster) => poster.id === id)!,
);

/**
 * Sezione editoriale di anteprima dedicata alle Locandine Eventi & Menù della Masseria:
 * mostra 3 locandine in evidenza con tasti diretti WhatsApp / Chiama e rimanda alla
 * pagina completa `/locandine`.
 */
export function EventPostersTeaserSection() {
  const { t } = useTranslation();
  const [openPoster, setOpenPoster] = useState<EventPoster | null>(null);

  // Lightbox: chiusura con Esc e blocco dello scroll della pagina
  useEffect(() => {
    if (!openPoster) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPoster(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openPoster]);

  return (
    <section
      id="appuntamenti-tavola"
      aria-labelledby="posters-teaser-title"
      className="relative overflow-hidden bg-[color:var(--murgese)] py-24 text-ivory md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(50% 55% at 15% 15%, color-mix(in oklab, var(--terracotta) 28%, transparent), transparent 70%), radial-gradient(45% 50% at 88% 85%, color-mix(in oklab, var(--gold) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Intestazione sezione con rimando principale a /appuntamenti */}
        <div className="flex flex-col gap-8 border-b border-ivory/15 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-eyebrow text-gold">{t("postersTeaser.eyebrow")}</span>
            <h2
              id="posters-teaser-title"
              className="mt-4 font-display font-semibold leading-[1.02] text-ivory"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.8rem)",
                letterSpacing: "-0.025em",
              }}
            >
              {t("postersTeaser.titleStart")}{" "}
              <em className="italic text-gold">{t("postersTeaser.titleAccent")}</em>{" "}
              {t("postersTeaser.titleEnd")}
            </h2>
            <p className="mt-5 font-display text-lg leading-relaxed text-ivory/75">
              {t("postersTeaser.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/appuntamenti"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-terracotta px-7 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-ivory shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] transition-colors hover:bg-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>{t("postersTeaser.ctaAll")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/30 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{BUSINESS.phone}</span>
            </a>
          </div>
        </div>

        {/* 1. In primo piano: Il Pranzo della Domenica */}
        <article className="mt-12 grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-gold/30 bg-ivory/[0.06] p-5 backdrop-blur-sm md:grid-cols-12 md:gap-8 md:p-6">
          <div className="md:col-span-4 lg:col-span-3">
            <PosterFlyerVisual
              poster={SUNDAY_POSTER}
              aspectClassName="aspect-[4/3] md:aspect-[4/5]"
            />
          </div>
          <div className="flex flex-col md:col-span-8 lg:col-span-9">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.18em] uppercase text-gold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {SUNDAY_POSTER.period}
              </span>
              <span>{SUNDAY_POSTER.price}</span>
              <span className="text-ivory/60">· {SUNDAY_POSTER.minGuests}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-ivory md:text-3xl">
              {SUNDAY_POSTER.title}
            </h3>
            <p className="mt-2 max-w-2xl font-display text-base italic text-ivory/80">
              {SUNDAY_POSTER.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={SUNDAY_POSTER.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-ivory transition-colors hover:bg-gold hover:text-ink"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>{t("postersTeaser.whatsapp")}</span>
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/30 px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>{t("postersTeaser.call")}</span>
              </a>
            </div>
          </div>
        </article>

        {/* 2. A seguire in ordine temporale: le 4 locandine ufficiali */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_POSTERS.map((poster) => (
            <article
              key={poster.id}
              className="flex flex-col rounded-xl border border-ivory/15 bg-ivory/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-gold/45"
            >
              <button
                type="button"
                onClick={() => setOpenPoster(poster)}
                aria-label={`Ingrandisci e leggi la locandina: ${poster.title}`}
                className="group/zoom relative block w-full cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <PosterFlyerVisual poster={poster} aspectClassName="aspect-[4/5]" />
                <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-ivory/95 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-ink shadow-md transition-colors group-hover/zoom:bg-gold">
                  <Search className="h-3 w-3" />
                  Leggi menù
                </span>
              </button>

              <div className="flex flex-1 flex-col pt-5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-gold">
                  <span>{poster.period}</span>
                  <span>{poster.price}</span>
                </div>

                <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-ivory">
                  {poster.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/75">{poster.highlight}</p>

                <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
                  <a
                    href={poster.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Prenota su WhatsApp: ${poster.title}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-terracotta px-3 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-ivory transition-colors hover:bg-gold hover:text-ink"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{t("postersTeaser.whatsapp")}</span>
                  </a>
                  <a
                    href={PHONE_HREF}
                    aria-label={`Chiama per prenotare ${poster.title}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ivory/30 px-3 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{t("postersTeaser.call")}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox: locandina ingrandita e leggibile */}
      {openPoster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openPoster.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--murgese)]/92 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setOpenPoster(null)}
        >
          <div
            className="relative flex max-h-full w-full max-w-3xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenPoster(null)}
              aria-label="Chiudi locandina"
              className="absolute -top-1 right-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 bg-ink/70 text-ivory transition-colors hover:border-gold hover:text-gold sm:-top-2 sm:-right-2"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={openPoster.posterImage ?? openPoster.image}
              alt={openPoster.imageAlt}
              className="mt-10 max-h-[72vh] w-auto max-w-full rounded-lg bg-[#fbf8f1] object-contain shadow-2xl sm:mt-8 sm:max-h-[78vh]"
            />

            <div className="flex w-full flex-wrap items-center justify-center gap-3">
              <a
                href={openPoster.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-ivory transition-colors hover:bg-gold hover:text-ink"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>{t("postersTeaser.whatsapp")}</span>
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/35 px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>{t("postersTeaser.call")}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
