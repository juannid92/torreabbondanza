import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "link" | "pill";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * CTA magnetiche editoriali su sfondo chiaro.
 * - "link": testo maiuscoletto + underline che si disegna + freccia che scatta.
 * - "pill": pill outline sottile con wipe orizzontale interno.
 * Magnetic disattivato su touch e prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  variant = "link",
  href,
  onClick,
  className,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [isCoarse] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false,
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

  const magneticEnabled = !reduced && !isCoarse;

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (!magneticEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const strength = 0.3;
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-3 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-sm";

  const variants: Record<Variant, string> = {
    link: "text-ink uppercase tracking-[0.28em] text-xs font-medium py-2",
    pill: "px-7 py-3 rounded-full border border-ink/30 text-ink uppercase tracking-[0.24em] text-xs font-medium overflow-hidden",
  };

  const MotionEl = href ? motion.a : motion.button;

  return (
    <MotionEl
      // @ts-expect-error polymorphic ref
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={cn(base, variants[variant], className)}
    >
      {variant === "pill" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-ink/[0.06] transition-transform duration-500 ease-out group-hover:translate-x-0"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <motion.span
          aria-hidden
          className="inline-block"
          initial={false}
          whileHover={{}}
        >
          <svg
            width="18"
            height="10"
            viewBox="0 0 18 10"
            fill="none"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          >
            <path
              d="M1 5h15M12 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </motion.span>
      </span>
      {variant === "link" && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-6 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      )}
    </MotionEl>
  );
}
