import type { CSSProperties, ReactNode } from "react";

interface ParallaxLayerProps {
  speed: number; // 0 = neutro, 1 = molto lento (sfondo), -1 = veloce verso utente
  scaleBoost?: number; // accentua dolly-in
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Wrapper per un piano della scena. Espone data-speed/scale per ScrollTrigger.
 */
export function ParallaxLayer({
  speed,
  scaleBoost = 0,
  zIndex = 0,
  className = "",
  style,
  children,
}: ParallaxLayerProps) {
  return (
    <div
      data-parallax
      data-speed={speed}
      data-scale-boost={scaleBoost}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex, willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
