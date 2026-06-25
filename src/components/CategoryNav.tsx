import { useEffect, useState } from "react";
import { MENU } from "@/lib/menu-data";

interface CategoryNavProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

/**
 * Nav sticky delle categorie. Desktop: pillole verticali a colonna;
 * Mobile: barra orizzontale scrollabile di chip.
 */
export function CategoryNav({ activeCategory, onSelect }: CategoryNavProps) {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Categorie della carta"
      className={`sticky top-4 z-30 -mx-6 mb-8 px-6 transition-opacity duration-300 md:top-6 md:mx-0 md:mb-12 md:px-0 ${
        scrolledPast ? "opacity-100" : "opacity-95"
      }`}
    >
      <ul
        className="flex gap-1 overflow-x-auto rounded-full border border-ink/10 bg-ivory/85 p-1.5 backdrop-blur-md md:gap-2 md:p-2"
        style={{ scrollbarWidth: "none" }}
      >
        {MENU.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <li key={cat.id} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => onSelect(cat.id)}
                aria-current={isActive ? "true" : undefined}
                className={`text-eyebrow relative whitespace-nowrap rounded-full px-4 py-2 transition-colors md:px-5 md:py-2.5 ${
                  isActive
                    ? "bg-ink text-ivory"
                    : "text-ink/65 hover:text-ink"
                }`}
              >
                <span className="mr-1.5 font-display normal-case tracking-normal text-[0.7em] opacity-70">
                  {cat.numeral}.
                </span>
                {cat.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
