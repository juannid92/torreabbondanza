import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import wineImg from "@/assets/kitchen-wine.jpg";

/**
 * Highlight a tutta larghezza sul Primitivo di produzione propria.
 * Stacco cromatico scuro + citazione editoriale.
 */
export function WineHighlight() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const image = root.querySelector<HTMLElement>("[data-wine-image]");
      const words = root.querySelectorAll<HTMLElement>("[data-quote-word]");
      const meta = root.querySelectorAll<HTMLElement>("[data-wine-meta]");

      gsap.set(words, { opacity: 0, yPercent: 60 });
      gsap.set(meta, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(meta, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          });
          gsap.to(words, {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.05,
            delay: 0.3,
          });
        },
      });

      if (image) {
        gsap.to(image, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const quote =
    "Primitivo dolce prodotto dalla masseria, davvero eccezionale.".split(" ");

  return (
    <section
      ref={rootRef}
      aria-labelledby="wine-title"
      className="relative my-12 overflow-hidden md:my-20"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Image */}
        <div
          className="relative overflow-hidden md:col-span-6"
          style={{ minHeight: "60vh" }}
        >
          <img
            data-wine-image
            src={wineImg}
            alt="Calice di Primitivo della masseria versato sullo sfondo della vigna al tramonto"
            loading="lazy"
            width={1024}
            height={1024}
            className="absolute inset-0 h-[115%] w-full object-cover"
            style={{ top: "-7.5%", willChange: "transform" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, color-mix(in oklab, var(--ink) 50%, transparent))",
            }}
          />
        </div>

        {/* Text */}
        <div
          className="relative flex flex-col justify-center gap-8 px-6 py-16 text-ivory md:col-span-6 md:px-16 md:py-24"
        >
          <span data-wine-meta className="text-eyebrow text-ivory/60">
            05 · La cantina
          </span>

          <h3
            id="wine-title"
            data-wine-meta
            className="font-display font-semibold leading-[1.05] text-ivory"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Il nostro <em className="text-terracotta">Primitivo</em>
          </h3>

          <p
            data-wine-meta
            className="max-w-md font-sans text-base leading-relaxed text-ivory/80 md:text-lg"
          >
            Un vino di produzione propria, nato dalle vigne della masseria.
            Profondo, caldo, generoso come la terra che lo dona.
          </p>

          <blockquote
            className="relative max-w-lg border-l-2 border-terracotta pl-5"
            cite="recensione cliente"
          >
            <p
              className="font-display text-xl italic leading-snug text-ivory md:text-2xl"
              aria-label="Primitivo dolce prodotto dalla masseria, davvero eccezionale."
            >
              {quote.map((w, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-top"
                  style={{ paddingBottom: "0.18em" }}
                >
                  <span
                    data-quote-word
                    className="inline-block"
                    style={{ willChange: "transform" }}
                  >
                    {w}
                    {i < quote.length - 1 ? "\u00A0" : ""}
                  </span>
                </span>
              ))}
            </p>
            <footer data-wine-meta className="mt-4 text-eyebrow text-ivory/55">
              — Da una recensione {/* DA CONFERMARE attribuzione esatta */}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
