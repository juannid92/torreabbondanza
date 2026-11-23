import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, LANGUAGE_FLAGS, LANGUAGE_LABELS, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = (i18n.language || "it") as Language;
  const flag = LANGUAGE_FLAGS[current] ?? "🇮🇹";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeLang = (lng: Language) => {
    void i18n.changeLanguage(lng);
    try {
      window.localStorage.setItem("i18nextLng", lng);
    } catch {
      /* ignore storage errors */
    }
    // Update URL query param without reload
    const url = new URL(window.location.href);
    if (lng === "it") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lng);
    }
    window.history.replaceState({}, "", url.toString());
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Cambia lingua"
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2 py-1 text-sm transition-colors hover:bg-white/10",
        )}
      >
        <span className="text-base leading-none">{flag}</span>
        <span className="hidden uppercase sm:inline">{current}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Lingue disponibili"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-stone/80 bg-white p-1 text-ink shadow-2xl ring-1 ring-black/5"
        >
          {SUPPORTED_LANGUAGES.map((lng) => {
            const isSelected = lng === current;
            return (
              <li key={lng}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => changeLang(lng)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-stone/40 font-semibold text-terracotta"
                      : "text-ink hover:bg-stone/50 hover:text-ink",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{LANGUAGE_FLAGS[lng]}</span>
                    <span className="text-ink">{LANGUAGE_LABELS[lng]}</span>
                  </span>
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-terracotta flex-shrink-0"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
