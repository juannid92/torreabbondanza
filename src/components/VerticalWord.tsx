interface VerticalWordProps {
  children: string;
  className?: string;
}

/**
 * Parola verticale (writing-mode: vertical-rl + rotate 180 per leggibilità top→bottom).
 * Decorativa: non heading.
 */
export function VerticalWord({ children, className = "" }: VerticalWordProps) {
  return (
    <span
      aria-hidden
      className={`inline-block font-display font-semibold text-ink leading-none ${className}`}
      style={{
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}
