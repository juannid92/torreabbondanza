import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface FloatingDatumProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  amplitude?: number;
  duration?: number;
  withRule?: boolean;
}

/**
 * Micro-dato editoriale che galleggia. Testo reale per AT.
 */
export function FloatingDatum({
  children,
  className = "",
  style,
  delay = 0,
  amplitude = 6,
  duration = 6,
  withRule = true,
}: FloatingDatumProps) {
  return (
    <motion.div
      data-datum
      className={`pointer-events-none absolute flex items-center gap-2 text-eyebrow text-ink/80 ${className}`}
      style={style}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex items-center gap-2"
        animate={{ y: [0, -amplitude, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {withRule ? (
          <span aria-hidden className="block h-px w-6 bg-ink/40" />
        ) : null}
        <span className="whitespace-nowrap">{children}</span>
      </motion.div>
    </motion.div>
  );
}
