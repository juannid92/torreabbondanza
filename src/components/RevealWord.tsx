import { forwardRef } from "react";

interface RevealWordProps {
  children: string;
  accent?: boolean;
}

/**
 * Singola parola del manifesto. Lo stato cromatico è guidato da GSAP via CSS variables
 * impostate sul parent (--word-progress 0..1) tramite un attributo data-index.
 * Qui esponiamo span con classi dedicate; l'animazione vera vive in ManifestoSection.
 */
export const RevealWord = forwardRef<HTMLSpanElement, RevealWordProps>(
  function RevealWord({ children, accent = false }, ref) {
    return (
      <span
        ref={ref}
        data-word
        data-accent={accent ? "true" : "false"}
        className={
          accent
            ? "manifesto-word manifesto-word--accent font-display italic"
            : "manifesto-word"
        }
        style={{ opacity: 0.18, display: "inline-block", willChange: "opacity, transform, color" }}
      >
        {children}
      </span>
    );
  },
);
