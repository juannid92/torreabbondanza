import type { ReactNode } from "react";
import { ArchVignette } from "./ArchVignette";
import { GhostYear } from "./GhostYear";

export interface StoryPanelData {
  eyebrow?: string;
  ghost: string;
  title: ReactNode;
  body: ReactNode;
  image?: { src: string; alt: string };
  isOpening?: boolean;
  cta?: ReactNode;
  note?: ReactNode;
  tone?: "warm" | "deep";
}

interface StoryPanelProps {
  data: StoryPanelData;
  index: number;
  total: number;
}

/**
 * Singolo capitolo della storia. Layout adattivo:
 * - desktop: pannello a 100vw, vignetta + colonna testo
 * - mobile: layout verticale (vedi container parent)
 */
export function StoryPanel({ data, index }: StoryPanelProps) {
  const { eyebrow, ghost, title, body, image, isOpening, cta, note, tone = "warm" } = data;
  const eyebrowColor = tone === "deep" ? "text-ink/70" : "text-terracotta";

  return (
    <article
      data-panel
      data-panel-index={index}
      className="relative flex h-[100svh] w-screen shrink-0 items-center"
    >
      {/* Ghost year sullo sfondo */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <GhostYear tone={tone}>{ghost}</GhostYear>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col items-center justify-center gap-4 px-5 pt-16 pb-20 sm:gap-6 md:flex-row md:items-center md:justify-between md:gap-16 md:px-12 md:py-[10vh] lg:px-20">
        {isOpening ? (
          <div className="flex w-full max-w-[820px] flex-col gap-5 md:gap-8">
            {eyebrow ? (
              <span data-panel-eyebrow className="text-eyebrow text-ink/70">
                {eyebrow}
              </span>
            ) : null}
            <h2
              data-panel-title
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
            <p
              data-panel-body
              className="max-w-[55ch] font-display text-ink/75"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.4rem)", lineHeight: 1.5 }}
            >
              {body}
            </p>
            {cta ? <div data-panel-cta>{cta}</div> : null}
          </div>
        ) : (
          <>
            {/* Vignetta arco — ridimensionata su mobile per vedersi sempre intera nel pannello 100svh */}
            {image ? (
              <div className="w-full max-w-[190px] sm:max-w-[250px] md:max-w-[420px] lg:max-w-[480px]">
                <ArchVignette src={image.src} alt={image.alt} eager={false} tone={tone} />
              </div>
            ) : null}

            {/* Colonna testo */}
            <div className="flex w-full max-w-[520px] flex-col gap-2.5 sm:gap-3.5 md:gap-5">
              {eyebrow ? (
                <span
                  data-panel-eyebrow
                  className={`text-eyebrow ${eyebrowColor}`}
                  style={tone === "deep" ? { color: "var(--murgese)" } : undefined}
                >
                  {eyebrow}
                </span>
              ) : null}
              <h3
                data-panel-title
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(1.5rem, 3.4vw, 3rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.015em",
                }}
              >
                {title}
              </h3>
              <p
                data-panel-body
                className="font-sans text-ink/80"
                style={{ fontSize: "clamp(0.86rem, 1.1vw, 1.1rem)", lineHeight: 1.55 }}
              >
                {body}
              </p>
              {note ? <p className="text-eyebrow text-ink/50">{note}</p> : null}
              {cta ? (
                <div data-panel-cta className="pt-1 md:pt-2">
                  {cta}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
