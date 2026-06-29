export type GhostTone = "warm" | "deep";

interface GhostYearProps {
  children: string;
  className?: string;
  tone?: GhostTone;
}

/**
 * Numeral/parola fantasma posto dietro il pannello. Decorativo.
 */
export function GhostYear({ children, className = "", tone = "warm" }: GhostYearProps) {
  const color = tone === "deep" ? "var(--murgese)" : "var(--ink)";
  return (
    <span
      data-ghost
      data-ghost-tone={tone}
      aria-hidden
      className={`pointer-events-none select-none font-display font-semibold leading-none ${className}`}
      style={{
        fontSize: "clamp(8rem, 22vw, 22rem)",
        letterSpacing: "-0.04em",
        opacity: tone === "deep" ? 0.1 : 0.08,
        whiteSpace: "nowrap",
        willChange: "transform",
        color,
      }}
    >
      {children}
    </span>
  );
}
