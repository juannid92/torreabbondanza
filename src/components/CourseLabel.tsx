interface CourseLabelProps {
  numeral: string;
  label: string;
  className?: string;
}

/**
 * Etichetta numerica della portata (I. ANTIPASTI, II. PRIMI…).
 */
export function CourseLabel({ numeral, label, className = "" }: CourseLabelProps) {
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span className="font-display text-2xl font-medium text-terracotta md:text-3xl">
        {numeral}.
      </span>
      <span className="text-eyebrow text-ink/70">{label}</span>
    </div>
  );
}
