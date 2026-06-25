import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Bottone con effetto magnetico (desktop only).
 * Su touch/mobile/reduced-motion: comportamento standard, solo hover/focus.
 */
export function MagneticButton({
  children,
  variant = "primary",
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
  const xLabel = useMotionValue(0);
  const yLabel = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });
  const lx = useSpring(xLabel, { stiffness: 200, damping: 18, mass: 0.3 });
  const ly = useSpring(yLabel, { stiffness: 200, damping: 18, mass: 0.3 });

  const magneticEnabled = !reduced && !isCoarse;

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (!magneticEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const strength = 0.35;
    x.set(relX * strength);
    y.set(relY * strength);
    xLabel.set(relX * 0.12);
    yLabel.set(relY * 0.12);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    xLabel.set(0);
    yLabel.set(0);
  };

  const base =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent will-change-transform";

  const variants: Record<Variant, string> = {
    primary:
      "bg-terracotta text-ivory hover:bg-gold focus-visible:ring-gold shadow-[var(--shadow-cta)]",
    secondary:
      "border border-ivory/70 text-ivory bg-transparent focus-visible:ring-ivory",
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
      whileHover={{ scale: magneticEnabled ? 1.03 : 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={cn(base, variants[variant], className)}
    >
      {variant === "secondary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-ivory/10 transition-transform duration-500 ease-out group-hover:translate-x-0"
        />
      )}
      <motion.span
        style={{ x: lx, y: ly }}
        className="relative z-10 inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </MotionEl>
  );
}
