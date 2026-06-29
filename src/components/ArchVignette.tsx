import { forwardRef } from "react";

interface ArchVignetteProps {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
  tone?: "warm" | "deep";
}

/**
 * Vignetta dentro finestra ad arco a tutto sesto — callback all'hero.
 * L'immagine interna è esposta via data-arch-image per parallax esterno.
 */
export const ArchVignette = forwardRef<HTMLDivElement, ArchVignetteProps>(
  function ArchVignette({ src, alt, eager = false, className = "", tone = "warm" }, ref) {
    const isDeep = tone === "deep";
    const accent = isDeep ? "var(--murgese)" : "var(--stone)";
    const shadow = isDeep
      ? "0 30px 80px -40px color-mix(in oklab, var(--murgese) 65%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--ivory) 55%, transparent)"
      : "0 30px 80px -40px color-mix(in oklab, var(--ink) 45%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--ivory) 60%, transparent)";
    return (
      <div
        ref={ref}
        data-arch
        data-arch-tone={tone}
        className={`relative overflow-hidden bg-stone shadow-soft ${className}`}
        style={{
          borderRadius: "50% 50% 0 0 / 38% 38% 0 0",
          border: `1px solid ${accent}`,
          boxShadow: shadow,
          aspectRatio: "3 / 4",
        }}
      >
        <div
          data-arch-reveal
          className="absolute inset-0"
          style={{ clipPath: "inset(0 0 0 0)", willChange: "clip-path" }}
        >
          <img
            data-arch-image
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            width={1024}
            height={1366}
            className="absolute inset-0 h-[115%] w-full object-cover"
            style={{ top: "-7.5%", willChange: "transform" }}
          />
        </div>
      </div>
    );
  },
);
