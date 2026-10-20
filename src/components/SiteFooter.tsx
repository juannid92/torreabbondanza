import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Instagram,
  Facebook,
  ArrowUp,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Share2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS, SITE_URL } from "@/lib/site";
import closingArchImg from "@/assets/puledri-fattrici/cavallo-penombra.webp";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------- Dati reali ---------------- */
const PHONE = BUSINESS.phone;
const PHONE_TEL = BUSINESS.phoneTel;
const WHATSAPP_URL = BUSINESS.whatsappUrl;
const WHATSAPP_DIRECT_CTA = `${BUSINESS.whatsappUrl}?text=${encodeURIComponent(
  "Ciao Masseria Torre Abbondanza, vorrei ricevere informazioni per organizzare un'occasione da voi.",
)}`;
const SITE = "torreabbondanza.com";
const ADDRESS_LINE1 = BUSINESS.address.line1;
const ADDRESS_LINE2 = BUSINESS.address.line2;
const IG_URL = BUSINESS.instagram.url;
const IG_HANDLE = BUSINESS.instagram.handle;
const FB_URL = BUSINESS.facebook.url;

// [K1] Rimosso "Manifesto": nessuna sezione con id="manifesto" in tutto il sito.
// Le altre voci sono state riallacciate: #stagioni → #esperienze, #visita → #contatti.
const NAV: { label: string; href: string }[] = [
  { label: "Storia", href: "#storia" },
  { label: "Il Luogo", href: "#luogo" },
  { label: "Cucina", href: "#cucina" },
  { label: "I Sapori", href: "#menu" },
  { label: "I Cavalli", href: "#cavalli" },
  { label: "Eventi", href: "#eventi" },
  { label: "Esperienze", href: "#esperienze" },
  { label: "Recensioni", href: "#recensioni" },
  { label: "Contatti", href: "#contatti" },
];

function smoothScrollTo(href: string) {
  if (href === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------- Condivisione nativa iOS / WhatsApp ---------------- */
async function shareMasseria(onCopied?: () => void) {
  const shareUrl = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  const shareText =
    "Guarda Masseria Torre Abbondanza a Noci (Puglia): una masseria del Settecento tra tavola su prenotazione, eventi e cavalli Murgesi.";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: "Masseria Torre Abbondanza — Noci, Puglia",
        text: shareText,
        url: shareUrl,
      });
      return;
    } catch {
      // Utente ha annullato il menu nativo: non fare nulla
      return;
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      onCopied?.();
    } catch {
      // ignore clipboard error
    }
  }

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
  window.open(waShare, "_blank", "noopener,noreferrer");
}

/* ---------------- Barra Concierge Fluttuante + Back to Top ---------------- */
function FloatingConciergeAndTop() {
  const [pastHero, setPastHero] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Nasconde la barra concierge quando l'utente è già sul form #contatti o nel footer
    const targets = [
      document.getElementById("contatti"),
      document.getElementById("footer-claim"),
    ].filter(Boolean) as Element[];

    const visibleMap = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleMap.set(entry.target, entry.isIntersecting);
        });
        setNearBottom(Array.from(visibleMap.values()).some(Boolean));
      },
      { threshold: 0.08 },
    );

    targets.forEach((t) => io.observe(t));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const showConcierge = pastHero && !nearBottom;

  const handleShare = () => {
    void shareMasseria(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <>
      {/* Barra Concierge Mobile (iPhone / Smartphone) — stile Boutique Hotel */}
      <AnimatePresence>
        {showConcierge && (
          <motion.div
            key="mobile-concierge"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-1.5 rounded-full border border-gold/40 bg-[color:var(--murgese)]/95 p-1.5 text-ivory shadow-[0_16px_40px_-10px_rgba(20,14,10,0.65)] backdrop-blur-md md:hidden"
            aria-label="Contatto rapido Masseria"
          >
            <a
              href={WHATSAPP_DIRECT_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase text-ivory transition-colors active:scale-[0.98]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase text-ivory transition-colors active:scale-[0.98]"
            >
              <Phone className="h-3.5 w-3.5 text-gold" />
              <span>Chiama</span>
            </a>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Condividi la Masseria"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-ivory/85 transition-colors hover:text-gold active:scale-95"
            >
              {copied ? <Check className="h-4 w-4 text-gold" /> : <Share2 className="h-4 w-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pillola Concierge Desktop (in basso a sinistra durante lo scroll) */}
      <AnimatePresence>
        {showConcierge && (
          <motion.div
            key="desktop-concierge"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-6 z-40 hidden items-center gap-1 rounded-full border border-gold/35 bg-[color:var(--murgese)]/90 p-1.5 pl-4 text-ivory shadow-[0_16px_40px_-12px_rgba(20,14,10,0.55)] backdrop-blur-md md:inline-flex"
            aria-label="Contatto rapido Concierge"
          >
            <span className="mr-2 inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-ivory/75">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              Su prenotazione
            </span>
            <a
              href={WHATSAPP_DIRECT_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3.5 py-2 text-[11px] tracking-[0.14em] uppercase text-ivory transition-colors hover:bg-terracotta/90"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] tracking-[0.14em] uppercase text-ivory/90 transition-colors hover:bg-ivory/10 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5 text-gold" />
              <span>{PHONE}</span>
            </a>
            <button
              type="button"
              onClick={handleShare}
              title="Invia la Masseria a chi ami"
              aria-label="Invia la Masseria a chi ami"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ivory/75 transition-colors hover:bg-ivory/10 hover:text-gold"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-gold" />
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top */}
      <AnimatePresence>
        {pastHero && (
          <motion.button
            type="button"
            onClick={() => smoothScrollTo("#top")}
            aria-label="Torna su"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed right-4 z-50 inline-flex h-11 w-11 items-center justify-center md:bottom-6 md:right-6 md:h-12 md:w-12",
              showConcierge ? "bottom-20" : "bottom-6",
              "rounded-full border border-ivory/30 bg-[color:var(--murgese)]/85 text-ivory backdrop-blur transition-all",
              "hover:bg-terracotta hover:border-terracotta",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- 12 — Il Congedo ("L'Ultimo Arco" + Firma Famiglia Giunta) ---------------- */
function ClosingClaim() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [sharedCopied, setSharedCopied] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const lines = ref.current!.querySelectorAll<HTMLElement>("[data-mask-line] > span");
      const arch = ref.current!.querySelector<HTMLElement>("[data-closing-arch]");
      if (reduced) {
        gsap.set(lines, { yPercent: 0, opacity: 1 });
        if (arch) gsap.set(arch, { y: 0, opacity: 1, scale: 1 });
        return;
      }
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        },
      );
      if (arch) {
        gsap.fromTo(
          arch,
          { y: 36, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 80%" },
          },
        );
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  const onShareClick = () => {
    void shareMasseria(() => {
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 3000);
    });
  };

  return (
    <div ref={ref} className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
      {/* Colonna sinistra: Sigillo, Claim, Firma Famiglia Giunta e Azioni Dirette */}
      <div>
        <div className="mb-7 inline-flex items-center gap-3.5">
          <span
            aria-hidden
            className="inline-flex h-11 w-9 items-center justify-center rounded-t-full border border-gold/45 bg-ivory/[0.04] font-display text-sm italic text-gold shadow-inner"
          >
            TA
          </span>
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-ivory/60">11 — Il Congedo</p>
            <p className="text-xs italic font-display text-gold/85">
              Contrada Murgia · Agro di Noci
            </p>
          </div>
        </div>

        <h2
          className="font-display font-medium leading-[0.96] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 6.8vw, 5.8rem)" }}
        >
          <span data-mask-line className="block overflow-hidden">
            <span className="inline-block">
              Due <span className="italic text-terracotta">anime</span>,
            </span>
          </span>
          <span data-mask-line className="block overflow-hidden">
            <span className="inline-block">
              una sola{" "}
              <span
                className="italic"
                style={{ color: "color-mix(in oklab, var(--ivory) 90%, var(--gold) 40%)" }}
              >
                terra
              </span>
              .
            </span>
          </span>
        </h2>

        {/* Saluto firmato dalla Famiglia Giunta */}
        <blockquote className="mt-8 max-w-xl border-l border-gold/40 pl-5">
          <p
            className="font-display italic leading-relaxed text-ivory/85"
            style={{ fontSize: "clamp(1.1rem, 1.55vw, 1.4rem)" }}
          >
            «Le porte della nostra corte si aprono a chi cerca il tempo lento della Murgia, il
            sapore sincero della terra e il passo fiero dei nostri Murgesi. Vi aspettiamo in
            masseria.»
          </p>
          <footer className="mt-3 flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-gold">
            <span>— Famiglia Giunta</span>
            <span aria-hidden className="text-ivory/30">
              ·
            </span>
            <span className="text-ivory/55">Dal Settecento a oggi</span>
          </footer>
        </blockquote>

        {/* Azioni dirette: WhatsApp immediato, Chiamata e Condivisione */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={WHATSAPP_DIRECT_CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-terracotta px-7 py-4 text-xs font-medium tracking-[0.18em] uppercase text-ivory shadow-lg transition-all duration-300 hover:bg-gold hover:text-ink"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Scrivici su WhatsApp</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-ivory/30 bg-ivory/[0.04] px-6 py-4 text-xs font-medium tracking-[0.18em] uppercase text-ivory transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            <Phone className="h-4 w-4 text-gold" />
            <span>Chiama {PHONE}</span>
          </a>
        </div>

        {/* Idea 3: Invia la Masseria a chi ami */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onShareClick}
            className="group inline-flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase text-ivory/70 transition-colors hover:text-gold"
          >
            {sharedCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-gold" />
                <span className="text-gold">Link copiato · Inoltralo su WhatsApp a chi ami</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-gold transition-transform group-hover:scale-110" />
                <span>Invia la Masseria a chi ami →</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Colonna destra: "L'Ultimo Arco" — chiude il cerchio visivo aperto nella Hero */}
      <div data-closing-arch className="mx-auto w-full max-w-[380px] lg:mr-0">
        <div className="relative rounded-t-full rounded-b-2xl border border-gold/35 bg-ivory/[0.03] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-xl">
            <img
              src={closingArchImg}
              alt="Cavallo Murgese nella penombra dell'arco in pietra a Masseria Torre Abbondanza"
              loading="lazy"
              width={760}
              height={1013}
              className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(28, 20, 14, 0.88) 0%, rgba(28, 20, 14, 0.2) 45%, transparent 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center">
              <p className="text-[10px] tracking-[0.26em] uppercase text-gold/90">
                40.73° N — 17.13° E · Noci (BA)
              </p>
              <p className="mt-1.5 font-display text-base italic text-ivory/95">
                «Dove la pietra del Settecento incontra il galoppo.»
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Footer ---------------- */
export function SiteFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const year = new Date().getFullYear();

  // [GDPR] Hook per riaprire il pannello preferenze cookie da qualsiasi punto.
  const openCookiePreferences = useCallback(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const cols = footerRef.current!.querySelectorAll<HTMLElement>("[data-foot-col]");
      if (reduced) {
        gsap.set(cols, { y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        cols,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: footerRef.current, start: "top 75%" },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      aria-labelledby="footer-claim"
      className="relative w-full overflow-hidden text-ivory"
      style={{ backgroundColor: "var(--murgese)" }}
    >
      {/* Transizione morbida dall'avorio dei Contatti → Murgese */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, var(--ivory) 0%, color-mix(in oklab, var(--murgese) 55%, var(--ivory)) 55%, var(--murgese) 100%)",
        }}
      />
      {/* Grain leggera */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96 0 0 0 0 0.93 0 0 0 0 0.85 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative pt-40 md:pt-52 pb-10">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          {/* A) Claim + L'Ultimo Arco */}
          <div id="footer-claim">
            <ClosingClaim />
          </div>

          {/* B) Griglia recapiti & navigazione */}
          <div className="mt-24 grid gap-12 md:grid-cols-2 lg:grid-cols-4 border-t border-ivory/10 pt-14">
            {/* Masseria */}
            <div data-foot-col>
              <p className="font-display text-2xl leading-tight tracking-tight">
                Masseria
                <br />
                <span className="italic text-gold">Torre Abbondanza</span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-ivory/70">
                Masseria del Settecento immersa nella Murgia di Noci. Tavola su prenotazione,
                cavalli Murgesi e occasioni rare.
              </p>
            </div>

            {/* Naviga */}
            <nav data-foot-col aria-label="Footer">
              <h3 className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">Naviga</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      onClick={(e) => {
                        e.preventDefault();
                        smoothScrollTo(n.href);
                      }}
                      className="group inline-flex w-fit items-center text-sm tracking-[0.04em] text-ivory/75 hover:text-ivory transition-colors"
                    >
                      <span className="relative">
                        {n.label}
                        <span
                          aria-hidden
                          className="absolute left-0 -bottom-0.5 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contatti */}
            <div data-foot-col>
              <h3 className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Contatti
              </h3>
              <ul className="space-y-4 text-sm text-ivory/80">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <span className="leading-relaxed">
                    {ADDRESS_LINE1}
                    <br />
                    {ADDRESS_LINE2}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a href={`tel:${PHONE_TEL}`} className="hover:text-ivory transition-colors">
                    {PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ivory transition-colors"
                  >
                    WhatsApp · {PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a
                    href={`https://${SITE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ivory transition-colors"
                  >
                    {SITE}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div data-foot-col>
              <h3 className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Seguici
              </h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Masseria Torre Abbondanza"
                    className="group inline-flex items-center gap-3 text-ivory/80 hover:text-ivory transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition-all duration-300 group-hover:scale-105 group-hover:border-gold group-hover:bg-ivory/5">
                      <Instagram className="h-4 w-4" />
                    </span>
                    {IG_HANDLE}
                  </a>
                </li>
                <li>
                  <a
                    href={FB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Masseria Torre Abbondanza"
                    className="group inline-flex items-center gap-3 text-ivory/80 hover:text-ivory transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition-all duration-300 group-hover:scale-105 group-hover:border-gold group-hover:bg-ivory/5">
                      <Facebook className="h-4 w-4" />
                    </span>
                    MasseriaTorreAbbondanza
                  </a>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => smoothScrollTo("#contatti")}
                className="group mt-8 inline-flex items-center gap-2 text-sm tracking-[0.14em] uppercase text-ivory hover:text-gold transition-colors"
              >
                Richiedi la tua occasione
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* C) Sottofooter legale */}
          <div className="relative z-10 mt-16 border-t border-ivory/10 pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-ivory/55">
            <p>
              © {year} {BUSINESS.legalName ?? BUSINESS.name} — Tutti i diritti riservati.
              <span className="mx-2 text-ivory/25">·</span>
              P.IVA {BUSINESS.vatId?.replace(/^IT/, "") ?? "06351980724"}
              <span className="mx-2 text-ivory/25">·</span>
              REA {BUSINESS.rea ?? "BA - 479911"}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link to="/privacy" className="hover:text-ivory transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie" className="hover:text-ivory transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="hover:text-ivory transition-colors"
                >
                  Preferenze cookie
                </button>
              </li>
            </ul>
            <p className="text-ivory/55">
              Design &amp; direzione creativa —{" "}
              <span className="text-ivory/80">Giovanni Macina</span>
            </p>
          </div>
        </div>
      </div>

      <FloatingConciergeAndTop />
    </footer>
  );
}
