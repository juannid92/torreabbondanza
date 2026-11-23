import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Menu, X, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import logoMasseria from "@/assets/logo-masseria.png";
import stemmaTorre from "@/assets/stemma-torre.png";

const NAV_ITEMS: {
  key: "masseria" | "cucina" | "appuntamenti" | "cavalli" | "eventi" | "contatti";
  to: "/" | "/cucina" | "/cavalli" | "/eventi" | "/appuntamenti";
  hash?: string;
}[] = [
  { key: "masseria", to: "/", hash: "luogo" },
  { key: "cucina", to: "/cucina" },
  { key: "appuntamenti", to: "/appuntamenti" },
  { key: "cavalli", to: "/cavalli" },
  { key: "eventi", to: "/eventi" },
  { key: "contatti", to: "/", hash: "contatti" },
];

export function SiteHeader() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const hideOnHeroTop = isHome && !scrolled && !mobileOpen;

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        hideOnHeroTop && "pointer-events-none -translate-y-2 opacity-0",
        scrolled || mobileOpen
          ? "bg-[color:var(--murgese)]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 md:px-12 md:py-3">
        {/* Logo + Stemma */}
        <Link
          to="/"
          aria-label="Masseria Torre Abbondanza — Home"
          className="flex shrink-0 items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-85"
        >
          <img
            src={logoMasseria}
            alt="Masseria Torre Abbondanza"
            className={cn(
              "h-9 w-auto object-contain transition-all duration-300 sm:h-11",
              (scrolled || mobileOpen) && "brightness-0 invert",
            )}
          />
          <img
            src={stemmaTorre}
            alt="Stemma Torre Abbondanza"
            className={cn(
              "h-9 w-auto object-contain transition-all duration-300 sm:h-11",
              (scrolled || mobileOpen) && "brightness-0 invert",
            )}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principale">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to && !item.hash;
            return (
              <Link
                key={item.key}
                to={item.to}
                hash={item.hash}
                className={cn(
                  "text-sm tracking-wide transition-colors hover:text-gold",
                  scrolled ? "text-ivory/80" : "text-ink/80",
                  isActive && "text-gold font-medium",
                )}
              >
                {t(`header.${item.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Language + Mobile toggle */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher className={cn(scrolled || mobileOpen ? "text-ivory" : "text-ink")} />
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-xs font-medium tracking-widest uppercase text-ivory transition-colors hover:bg-gold hover:text-ink sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={mobileOpen}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden",
              scrolled || mobileOpen ? "text-ivory hover:bg-ivory/10" : "text-ink hover:bg-ink/10",
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-ivory/10 bg-[color:var(--murgese)]/98 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-6" aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to && !item.hash;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  hash={item.hash}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base tracking-wide transition-colors",
                    isActive
                      ? "bg-ivory/10 text-gold font-medium"
                      : "text-ivory/80 hover:bg-ivory/5 hover:text-ivory",
                  )}
                >
                  {t(`header.${item.key}`)}
                </Link>
              );
            })}
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium tracking-widest uppercase text-ivory transition-colors hover:bg-gold hover:text-ink"
            >
              <MessageCircle className="h-4 w-4" />
              {t("header.whatsappFull")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
