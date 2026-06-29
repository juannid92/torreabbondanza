import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DishBlock } from "./DishBlock";
import { MagneticButton } from "./MagneticButton";
import antipastiImg from "@/assets/kitchen-antipasti.jpg";
import primiImg from "@/assets/kitchen-primi.jpg";
import secondiImg from "@/assets/kitchen-secondi.jpg";
import dolciImg from "@/assets/kitchen-dolci.jpg";

const SERVICE_TAGS = [
  "Alla carta ven–dom",
  "Menù su misura",
  "Veg / Vegan / Gluten-free",
  "Menù bambini",
];

export function KitchenSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>("[data-intro]");
      gsap.set(intro, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(intro, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cucina"
      ref={rootRef}
      aria-labelledby="kitchen-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità cromatica dalla Sez.04 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--olive) 8%, transparent), transparent)",
        }}
      />
      <div aria-hidden className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-40">
        {/* Intro */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p data-intro className="text-eyebrow text-ink/70">
              04 — La cucina
            </p>
            <h2
              id="kitchen-title"
              data-intro
              className="mt-6 font-display font-semibold leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              La <em className="text-terracotta">terra</em> in tavola
            </h2>
          </div>

          <div className="flex flex-col gap-6 md:col-span-5 md:pt-6">
            <p
              data-intro
              className="font-sans text-base leading-relaxed text-ink/80 md:text-lg"
            >
              Tradizione pugliese e materie prime fresche del territorio,
              attraversate da un tocco creativo. Ogni menù può essere costruito
              su misura: dall'incontro intimo alla grande festa.
            </p>

            {/* Fil rouge d'equità — ponte testuale verso l'anima equestre */}
            <p
              data-intro
              className="font-display text-lg italic leading-snug text-ink/70 md:text-xl"
            >
              La stessa Murgia che alleva i{" "}
              <span style={{ color: "var(--murgese)" }}>cavalli</span> e piega
              gli ulivi arriva, ogni giorno, nel piatto.
            </p>

            <ul
              data-intro
              className="flex flex-wrap gap-2"
              aria-label="Servizi della cucina"
            >
              {SERVICE_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="text-eyebrow rounded-full border border-ink/15 px-3 py-1.5 text-ink/70 transition-colors hover:border-terracotta/50 hover:text-terracotta"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filetto */}
        <div aria-hidden className="mt-16 h-px w-full bg-ink/15 md:mt-24" />

        {/* Portate */}
        <div className="group">
          <DishBlock
            numeral="I"
            course="Antipasti di terra"
            oversizedWord="ANTIPASTI"
            description="Olive fritte, salumi e formaggi locali, parmigiana, focaccia, purè di fave bianche, peperoni fritti. Una carrellata che apre il pasto come un racconto del territorio."
            caption="Carrellata di antipasti — degustazione dello chef"
            imageSrc={antipastiImg}
            imageAlt="Tagliere di antipasti pugliesi: focaccia, salumi, formaggi, olive e purè di fave"
            align="right"
          />
          <DishBlock
            numeral="II"
            course="Primi"
            oversizedWord="PRIMI"
            description="Primi di terra e di mare nella tradizione pugliese. Il signature: il nido di linguine con carne e funghi — un piatto che ferma il tempo."
            caption="Nido di linguine, carne e funghi"
            imageSrc={primiImg}
            imageAlt="Nido di linguine con ragù di carne e funghi su piatto in ceramica rustica"
            align="left"
          />
          <DishBlock
            numeral="III"
            course="Secondi"
            oversizedWord="SECONDI"
            description="Carni della tradizione, cotture lente, materie prime locali. Il brasato di carne è la firma: una memoria di campagna che torna in tavola."
            caption="Brasato di carne al vino"
            imageSrc={secondiImg}
            imageAlt="Brasato di carne in salsa scura su purè, con rametto di timo"
            align="right"
          />
          <DishBlock
            numeral="IV"
            course="Dolci"
            oversizedWord="DOLCI"
            description="Dolci della casa, fatti a mano. La cheesecake all'amaretto chiude il pasto con la dolcezza giusta — un'ultima carezza."
            caption="Cheesecake all'amaretto"
            imageSrc={dolciImg}
            imageAlt="Fetta di cheesecake all'amaretto con caramello e briciole di amaretti"
            align="left"
          />
        </div>
      </div>

      {/* Chiusura / CTA */}
      <div className="mx-auto max-w-7xl px-6 pb-32 md:px-12 md:pb-40">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p
            className="font-display text-xl italic leading-snug text-ink/70 md:max-w-md md:text-2xl"
          >
            La carta cambia con le stagioni e con la materia disponibile.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <MagneticButton
              href="#"
              variant="link"
              ariaLabel="Scarica il menù (link da confermare)"
            >
              {/* DA CONFERMARE link menu */}
              Scarica il menù →
            </MagneticButton>
            <MagneticButton href="#contatti" variant="pill">
              Prenota un tavolo →
            </MagneticButton>
            {/* Ponte verso il pilastro equestre */}
            <MagneticButton
              href="#cavalli"
              variant="link"
              ariaLabel="L'altra anima: i cavalli Murgesi"
            >
              <span style={{ color: "var(--murgese)" }}>
                L'altra anima: i cavalli Murgesi →
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Uscita verso Sez.06 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--stone) 60%, transparent))",
        }}
      />
    </section>
  );
}
