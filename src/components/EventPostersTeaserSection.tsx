import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { EVENT_POSTERS, PHONE_HREF, PosterFlyerVisual } from "@/components/EventPostersShowcase";

const FEATURED_POSTERS = [EVENT_POSTERS[0], EVENT_POSTERS[4], EVENT_POSTERS[1]];

/**
 * Sezione editoriale di anteprima dedicata alle Locandine Eventi & Menù della Masseria:
 * mostra 3 locandine in evidenza con tasti diretti WhatsApp / Chiama e rimanda alla
 * pagina completa `/locandine`.
 */
export function EventPostersTeaserSection() {
  return (
    <section
      id="locandine-eventi"
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
        {/* Intestazione sezione con rimando principale a /locandine */}
        <div className="flex flex-col gap-8 border-b border-ivory/15 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-eyebrow text-gold">Locandine Eventi & Menù della Masseria</span>
            <h2
              id="posters-teaser-title"
              className="mt-4 font-display font-semibold leading-[1.02] text-ivory"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.8rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Scopri le <em className="italic text-gold">locandine dei menù</em> e prenota subito
            </h2>
            <p className="mt-5 font-display text-lg leading-relaxed text-ivory/75">
              Domeniche in famiglia, festività, ponti di primavera e cene in corte: consulta tutte
              le locandine aggiornate dei nostri menù fissi o su misura, e prenota direttamente con
              un clic su WhatsApp o telefonicamente.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/locandine"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-terracotta px-7 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-ivory shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] transition-colors hover:bg-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>Vedi tutte le locandine e i menù</span>
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

        {/* Griglia 3 locandine in evidenza */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURED_POSTERS.map((poster) => (
            <article
              key={poster.id}
              className="flex flex-col rounded-xl border border-ivory/15 bg-ivory/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-gold/45"
            >
              <PosterFlyerVisual poster={poster} aspectClassName="aspect-[4/5]" />

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
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={PHONE_HREF}
                    aria-label={`Chiama per prenotare ${poster.title}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ivory/30 px-3 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-ivory transition-colors hover:border-gold hover:text-gold"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>Chiama</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
