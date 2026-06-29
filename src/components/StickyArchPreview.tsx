import { AnimatePresence, motion } from "framer-motion";
import type { MenuDish } from "@/lib/menu-data";

interface StickyArchPreviewProps {
  dish: MenuDish | null;
  categoryLabel: string;
}

/**
 * Anteprima sticky dentro finestra ad arco. Crossfade al cambio piatto.
 * Decorativa: il menù è completo anche senza.
 */
export function StickyArchPreview({ dish, categoryLabel }: StickyArchPreviewProps) {
  return (
    <aside
      aria-hidden
      className="sticky top-28 hidden h-fit md:block"
    >
      <motion.div
        className="relative overflow-hidden bg-stone shadow-soft"
        style={{
          borderRadius: "10px",
          border: "1px solid var(--stone)",
          boxShadow:
            "0 30px 80px -40px color-mix(in oklab, var(--ink) 45%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--ivory) 60%, transparent)",
          aspectRatio: "4 / 5",
        }}
        animate={{ scale: [1, 1.012, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="popLayout">
          {dish && (
            <motion.img
              key={dish.id}
              src={dish.image}
              alt=""
              loading="lazy"
              width={1024}
              height={1366}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>

        {/* gradient inferiore */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--ink) 55%, transparent))",
          }}
        />
      </motion.div>

      {/* Caption */}
      <div className="mt-6 flex flex-col gap-1 px-2">
        <span className="text-eyebrow text-ink/55">{categoryLabel}</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={dish?.id ?? "empty"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-xl italic leading-snug text-ink md:text-2xl"
          >
            {dish?.name ?? "Sfoglia la carta"}
            {dish?.signature && (
              <span className="ml-2 align-middle text-eyebrow not-italic text-gold">
                ★ consigliato
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </aside>
  );
}
