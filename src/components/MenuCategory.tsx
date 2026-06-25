import { forwardRef } from "react";
import { MenuItem } from "./MenuItem";
import type { MenuCategoryData } from "@/lib/menu-data";

interface MenuCategoryProps {
  category: MenuCategoryData;
  activeDishId: string | null;
  onActivateDish: (id: string) => void;
}

/**
 * Gruppo di voci sotto un titolo di categoria.
 */
export const MenuCategory = forwardRef<HTMLElement, MenuCategoryProps>(
  function MenuCategory({ category, activeDishId, onActivateDish }, ref) {
    return (
      <section
        ref={ref}
        id={`cat-${category.id}`}
        data-category-id={category.id}
        aria-labelledby={`cat-title-${category.id}`}
        className="scroll-mt-32 py-12 md:py-16"
      >
        <header className="mb-6 flex items-baseline gap-4 md:mb-10">
          <span
            aria-hidden
            className="font-display text-3xl font-medium text-terracotta md:text-4xl"
          >
            {category.numeral}.
          </span>
          <h3
            id={`cat-title-${category.id}`}
            className="font-display font-semibold leading-tight text-ink"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {category.label}
          </h3>
        </header>

        <ul className="border-t border-ink/10">
          {category.dishes.map((dish) => (
            <MenuItem
              key={dish.id}
              dish={dish}
              isActive={dish.id === activeDishId}
              onActivate={onActivateDish}
            />
          ))}
        </ul>
      </section>
    );
  },
);
