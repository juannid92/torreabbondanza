import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Cucina", href: "/cucina" },
  { label: "Cavalli", href: "/cavalli" },
  { label: "Eventi", href: "/eventi" },
] as const;

export function SiteHeader() {
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

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-[color:var(--murgese)]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <Link
          to="/"
          className={cn(
            "font-display text-lg font-semibold tracking-tight transition-colors",
            scrolled || mobileOpen ? "text-ivory" : "text-ink",
          )}
        >
          Torre Abbondanza
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principale">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm tracking-wide transition-colors hover:text-gold",
                  scrolled
                    ? "text-ivory/80"
                    : "text-ink/80",
                  isActive && "text-gold font-medium",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-widest uppercase transition-colors sm:inline-flex",
              scrolled || mobileOpen
                ? "bg-terracotta text-ivory hover:bg-gold hover:text-ink"
                : "bg-terracotta text-ivory hover:bg-gold hover:text-ink",
            )}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden",
              scrolled || mobileOpen
                ? "text-ivory hover:bg-ivory/10"
                : "text-ink hover:bg-ink/10",
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
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base tracking-wide transition-colors",
                    isActive
                      ? "bg-ivory/10 text-gold font-medium"
                      : "text-ivory/80 hover:bg-ivory/5 hover:text-ivory",
                  )}
                >
                  {item.label}
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
              Scrivici su WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}