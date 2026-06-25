import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Instagram, Facebook, ArrowUp, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHONE = "+39 338 483 4318";
const PHONE_TEL = "+393384834318";
const EMAIL = "info@torreabbondanza.com";
const ADDRESS = "Strada Vicinale per Massafra / SP 211, Zona E n. 49, 70015 Noci (BA)";
const IG = "https://www.instagram.com/masseria_torre_abbondanza/";
const FB = "https://www.facebook.com/MasseriaTorreAbbondanza";

const NAV: { label: string; href: string }[] = [
  { label: "Storia", href: "#storia" },
  { label: "Il Luogo", href: "#luogo" },
  { label: "La Cucina", href: "#cucina" },
  { label: "La Carta", href: "#menu" },
  { label: "Eventi & Matrimoni", href: "#eventi" },
  { label: "Galleria", href: "#galleria" },
  { label: "Visita", href: "#visita" },
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

/* ---------------- Giant Wordmark ---------------- */
function GiantWordmark() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !ref.current) return;

    const ctx = gsap.context(() => {
      const letters = ref.current!.querySelectorAll<HTMLElement>("[data-letter]");
      gsap.fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.05,
          scrollTrigger: { trigger: ref.current, start: "top 90%" },
        },
      );
      gsap.to(ref.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const letters = "ABBONDANZA".split("");

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none relative mt-20 md:mt-28 w-full overflow-hidden"
    >
      <div
        className="flex justify-center leading-[0.78] font-display font-medium tracking-[-0.04em] select-none"
        style={{
          fontSize: "clamp(4.5rem, 18vw, 18rem)",
          color: "color-mix(in oklab, var(--ivory) 12%, transparent)",
          WebkitTextStroke: "1px color-mix(in oklab, var(--ivory) 22%, transparent)",
          translate: "0 18%",
        }}
      >
        {letters.map((l, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              data-letter
              className={cn(
                "inline-block",
                i === 4 && "text-terracotta/70",
              )}
              style={i === 4 ? { WebkitTextStroke: "0" } : undefined}
            >
              {l}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
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
            "rounded-full border border-ivory/30 bg-ink/85 text-ivory backdrop-blur",
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

/* ---------------- Footer Nav ---------------- */
function FooterNav() {
  return (
    <nav aria-label="Footer" className="grid gap-3">
      {NAV.map((n) => (
        <a
          key={n.href}
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
      ))}
    </nav>
  );
}

/* ---------------- Footer ---------------- */
export function SiteFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !footerRef.current) return;

    const ctx = gsap.context(() => {
      const titleWords = footerRef.current!.querySelectorAll<HTMLElement>("[data-greet]");
      gsap.fromTo(
        titleWords,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.06,
          scrollTrigger: { trigger: footerRef.current, start: "top 80%" },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-foot-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-ink text-ivory"
    >
      {/* Transizione morbida dall'avorio della Sez.11 → ink (tramonto) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, var(--ivory) 0%, color-mix(in oklab, var(--ink) 35%, var(--ivory)) 35%, var(--ink) 100%)",
        }}
      />

      <div className="relative pt-40 md:pt-52 pb-10">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          {/* Riga di saluto + CTA */}
          <div className="max-w-3xl">
            <p className="text-[11px] tracking-[0.28em] uppercase text-ivory/55 mb-6">
              11 — Arrivederci
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-tight">
              <span className="inline-block overflow-hidden align-bottom">
                <span data-greet className="inline-block">Vi&nbsp;</span>
              </span>
              <span className="inline-block overflow-hidden align-bottom">
                <span data-greet className="inline-block">aspettiamo,&nbsp;</span>
              </span>
              <span className="inline-block overflow-hidden align-bottom">
                <span data-greet className="inline-block">sotto&nbsp;</span>
              </span>
              <span className="inline-block overflow-hidden align-bottom">
                <span data-greet className="inline-block">l'</span>
              </span>
              <span className="inline-block overflow-hidden align-bottom">
                <span data-greet className="inline-block italic text-gold">ultima luce&nbsp;</span>
              </span>
              <span className="inline-block overflow-hidden align-bottom">
                <span data-greet className="inline-block">della Murgia.</span>
              </span>
            </h2>

            <div data-foot-reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <button
                type="button"
                onClick={() => smoothScrollTo("#visita")}
                className="group inline-flex items-center gap-2 text-sm tracking-[0.14em] uppercase text-ivory hover:text-gold transition-colors"
              >
                Prenota un tavolo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => smoothScrollTo("#visita")}
                className="group inline-flex items-center gap-2 text-sm tracking-[0.14em] uppercase text-ivory hover:text-gold transition-colors"
              >
                Richiedi un evento
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Griglia informativa */}
          <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-4 border-t border-ivory/10 pt-14">
            {/* Contatti */}
            <div data-foot-reveal>
              <p className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Contatti
              </p>
              <ul className="space-y-4 text-sm text-ivory/80">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <span className="leading-relaxed">{ADDRESS}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a href={`tel:${PHONE_TEL}`} className="hover:text-ivory transition-colors">
                    {PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a href={`mailto:${EMAIL}`} className="hover:text-ivory transition-colors break-all">
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            {/* Naviga */}
            <div data-foot-reveal>
              <p className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Naviga
              </p>
              <FooterNav />
            </div>

            {/* Seguici */}
            <div data-foot-reveal>
              <p className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Seguici
              </p>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href={IG} target="_blank" rel="noopener noreferrer"
                    aria-label="Instagram Masseria Torre Abbondanza"
                    className="group inline-flex items-center gap-3 text-ivory/80 hover:text-ivory transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition-transform group-hover:scale-105 group-hover:border-gold">
                      <Instagram className="h-4 w-4" />
                    </span>
                    @masseria_torre_abbondanza
                  </a>
                </li>
                <li>
                  <a
                    href={FB} target="_blank" rel="noopener noreferrer"
                    aria-label="Facebook Masseria Torre Abbondanza"
                    className="group inline-flex items-center gap-3 text-ivory/80 hover:text-ivory transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition-transform group-hover:scale-105 group-hover:border-gold">
                      <Facebook className="h-4 w-4" />
                    </span>
                    MasseriaTorreAbbondanza
                  </a>
                </li>
              </ul>
            </div>

            {/* Orari */}
            <div data-foot-reveal>
              <p className="text-[11px] tracking-[0.22em] uppercase text-ivory/55 mb-5">
                Orari {/* DA CONFERMARE */}
              </p>
              <dl className="space-y-3 text-sm text-ivory/80">
                <div>
                  <dt className="text-ivory/55 text-xs tracking-[0.12em] uppercase">À la carte</dt>
                  <dd>Venerdì – Domenica</dd>
                  <dd className="text-ivory/65">Pranzo · Cena</dd>
                </div>
                <div>
                  <dt className="text-ivory/55 text-xs tracking-[0.12em] uppercase">Eventi</dt>
                  <dd>Su prenotazione, tutti i giorni</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Giant Wordmark */}
          <GiantWordmark />

          {/* Barra crediti */}
          <div className="relative z-10 mt-12 border-t border-ivory/10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-ivory/55">
            <p>
              © {year} Masseria Torre Abbondanza · P.IVA{" "}
              <span className="text-ivory/40">XXXXXXXXXXX</span>
              {/* DA CONFERMARE P.IVA */}
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
