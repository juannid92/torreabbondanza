interface GhostYearProps {
  children: string;
  className?: string;
}

/**
 * Numeral/parola fantasma posto dietro il pannello. Decorativo.
 */
export function GhostYear({ children, className = "" }: GhostYearProps) {
  return (
    <span
      data-ghost
      aria-hidden
      className={`pointer-events-none select-none font-display font-semibold leading-none text-ink ${className}`}
      style={{
        fontSize: "clamp(8rem, 22vw, 22rem)",
        letterSpacing: "-0.04em",
        opacity: 0.08,
        whiteSpace: "nowrap",
        willChange: "transform",
      }}
    >
      {children}
    </span>
  );
}
