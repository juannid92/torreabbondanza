import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Instagram, Facebook, ArrowUp, ArrowRight, Phone, Mail, MapPin, Globe } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------- Dati reali ---------------- */
const PHONE = "+39 338 483 4318";
const PHONE_TEL = "+393384834318";
const EMAIL = "info@torreabbondanza.com";
const SITE = "torreabbondanza.com";
const ADDRESS_LINE1 = "Strada Vicinale per Massafra / SP 211";
const ADDRESS_LINE2 = "Zona E n. 49 — 70015 Noci (BA)";
const IG_URL = "https://www.instagram.com/masseria_torre_abbondanza/";
const IG_HANDLE = "@masseria_torre_abbondanza";
const FB_URL = "https://www.facebook.com/MasseriaTorreAbbondanza";

const NAV: { label: string; href: string }[] = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Storia", href: "#storia" },
  { label: "Il Luogo", href: "#luogo" },
  { label: "Cucina", href: "#cucina" },
  { label: "I Sapori", href: "#menu" },
  { label: "I Cavalli", href: "#cavalli" },
  { label: "Eventi", href: "#eventi" },
  { label: "Esperienze", href: "#stagioni" },
  { label: "Galleria", href: "#galleria" },
  { label: "Recensioni", href: "#recensioni" },
  { label: "Contatti", href: "#visita" },
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

/* ---------------- Back to Top ---------------- */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => smoothScrollTo("#top")}
          aria-label="Torna su"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center",
            "rounded-full border border-ivory/30 bg-[color:var(--murgese)]/85 text-ivory backdrop-blur",
            "hover:bg-terracotta hover:border-terracotta transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Claim oversized ---------------- */
function ClosingClaim() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const lines = ref.current!.querySelectorAll<HTMLElement>("[data-mask-line] > span");
      if (reduced) {
        gsap.set(lines, { yPercent: 0, opacity: 1 });
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
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="max-w-5xl">
      <p className="text-[11px] tracking-[0.28em] uppercase text-ivory/55 mb-6">
        12 — Chiusura
      </p>
      <h2
        className="font-display font-medium leading-[0.98] tracking-tight"
        style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}
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
      <p
        className="mt-6 font-display italic text-ivory/70"
        style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.5rem)" }}
      >
        La tavola e il galoppo, nel cuore della Murgia.
      </p>
    </div>
  );
}

/* ---------------- Footer ---------------- */
export function SiteFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const year = new Date().getFullYear();

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
          {/* A) Claim */}
          <div id="footer-claim">
            <ClosingClaim />

            <div className="mt-10">
              <MagneticButton
                variant="pill-solid"
                onClick={() => smoothScrollTo("#visita")}
                ariaLabel="Richiedi la tua occasione — vai ai contatti"
              >
                Richiedi la tua occasione
              </MagneticButton>
            </div>
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
                Masseria del Settecento immersa nella Murgia di Noci.
                Tavola su prenotazione, cavalli Murgesi e occasioni rare.
              </p>
            </div>

            {/* Naviga */}
            <nav data-foot-col aria-label="Footer">
              <h3 className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Naviga
              </h3>
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
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a
                    href={`mailto:${EMAIL}`}
                    className="hover:text-ivory transition-colors break-all"
                  >
                    {EMAIL}
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
              {/* altri canali DA CONFERMARE */}

              <button
                type="button"
                onClick={() => smoothScrollTo("#visita")}
                className="group mt-8 inline-flex items-center gap-2 text-sm tracking-[0.14em] uppercase text-ivory hover:text-gold transition-colors"
              >
                Richiedi la tua occasione
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* C) Sottofooter legale */}
          <div className="relative z-10 mt-16 border-t border-ivory/10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-ivory/55">
            <p>
              © {year} Masseria Torre Abbondanza — Tutti i diritti riservati.
              <span className="mx-2 text-ivory/25">·</span>
              P.IVA <span className="text-ivory/40">XXXXXXXXXXX</span>
              {/* DA CONFERMARE P.IVA e ragione sociale */}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a href="#" className="hover:text-ivory transition-colors">
                  Privacy Policy
                </a>
                {/* pagina DA CREARE/COLLEGARE */}
              </li>
              <li>
                <a href="#" className="hover:text-ivory transition-colors">
                  Cookie Policy
                </a>
                {/* pagina DA CREARE/COLLEGARE */}
              </li>
            </ul>
            <p className="text-ivory/55">
              Design &amp; sviluppo —{" "}
              <a href="#" className="text-ivory/70 hover:text-gold transition-colors">
                Samantha
              </a>
            </p>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
