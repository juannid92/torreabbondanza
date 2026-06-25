import { useState, type FocusEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { DIET_LABEL, type MenuDish } from "@/lib/menu-data";

interface MenuItemProps {
  dish: MenuDish;
  isActive: boolean;
  onActivate: (id: string) => void;
}

/**
 * Voce della carta: nome + leader dots + prezzo, descrizione che si espande.
 */
export function MenuItem({ dish, isActive, onActivate }: MenuItemProps) {
  const [expanded, setExpanded] = useState(false);
  const open = isActive || expanded;

  const handleEnter = (_: MouseEvent | FocusEvent) => {
    onActivate(dish.id);
  };

  return (
    <li
      className="group relative border-b border-ink/10 last:border-b-0"
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={open}
        className="w-full py-5 text-left transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:py-6"
        style={{ transform: open ? "translateX(6px)" : "translateX(0)" }}
      >
        <div className="flex items-baseline gap-3">
          <h4
            className={`font-display text-xl font-medium leading-snug transition-colors md:text-2xl ${
              open ? "text-terracotta" : "text-ink"
            }`}
          >
            {dish.name}
            {dish.signature && (
              <span
                className="ml-3 align-middle text-eyebrow text-gold"
                aria-label="Consigliato dallo chef"
              >
                ★ signature
              </span>
            )}
          </h4>

          {/* leader dots */}
          <span
            aria-hidden
            className="hidden flex-1 translate-y-[-3px] border-b border-dotted border-ink/30 transition-opacity sm:block"
            style={{ opacity: open ? 1 : 0.5 }}
          />

          {dish.price && (
            <span
              className="text-eyebrow whitespace-nowrap text-ink/70"
              aria-label={`Prezzo indicativo ${dish.price} euro`}
            >
              {dish.price} €{/* DA CONFERMARE */}
            </span>
          )}
        </div>

        <motion.div
          initial={false}
          animate={{
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          <p className="mt-3 max-w-prose font-display text-base italic text-ink/70 md:text-lg">
            {dish.description}
          </p>

          {dish.diet && dish.diet.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Note dietetiche">
              {dish.diet.map((d) => (
                <li
                  key={d}
                  className="text-eyebrow rounded-full border border-olive/40 px-2.5 py-1 text-olive"
                >
                  {DIET_LABEL[d]}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </button>
    </li>
  );
}
