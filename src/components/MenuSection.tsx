import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CategoryNav } from "./CategoryNav";
import { MenuCategory } from "./MenuCategory";
import { StickyArchPreview } from "./StickyArchPreview";
import { MagneticButton } from "./MagneticButton";
import { MENU } from "@/lib/menu-data";

export function MenuSection() {
  const rootRef = useRef<HTMLElement>(null);
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());

  const [activeCategoryId, setActiveCategoryId] = useState<string>(MENU[0].id);
  const [activeDishId, setActiveDishId] = useState<string | null>(
    MENU[0].dishes[0]?.id ?? null,
  );

  const activeCategory = useMemo(
    () => MENU.find((c) => c.id === activeCategoryId) ?? MENU[0],
    [activeCategoryId],
  );

  const activeDish = useMemo(() => {
    for (const cat of MENU) {
      const d = cat.dishes.find((dd) => dd.id === activeDishId);
      if (d) return d;
    }
    return activeCategory.dishes[0] ?? null;
  }, [activeDishId, activeCategory]);

  // Scroll-spy: detecta categoria attiva e auto-seleziona primo piatto al cambio
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const triggers: ScrollTrigger[] = [];
    MENU.forEach((cat) => {
      const el = categoryRefs.current.get(cat.id);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveCategoryId((prev) => {
              if (prev !== cat.id) {
                setActiveDishId(cat.dishes[0]?.id ?? null);
              }
              return cat.id;
            });
          }
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Intro reveal
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const intro = root.querySelectorAll<HTMLElement>("[data-menu-intro]");
      gsap.set(intro, { opacity: 0, y: 24 });
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

  const handleSelectCategory = (id: string) => {
    const el = categoryRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="menu"
      ref={rootRef}
      aria-labelledby="menu-title"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Continuità cromatica dalla Sez.05 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--stone) 50%, transparent), transparent)",
        }}
      />
      <div aria-hidden className="grain-overlay" />

      <div className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-40">
        {/* Testata */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p data-menu-intro className="text-eyebrow text-ink/70">
              05 — I sapori
            </p>
            <h2
              id="menu-title"
              data-menu-intro
              className="mt-6 font-display font-semibold leading-[1.02] text-ink"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              La <em className="text-terracotta">Carta</em>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-6">
            <ul
              data-menu-intro
              className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-ink/70"
              aria-label="Note di servizio"
            >
              <li className="text-eyebrow">Alla carta ven–dom · pranzo e cena</li>
              <li className="text-eyebrow">≈ 30 € à la carte{/* DA CONFERMARE */}</li>
              <li className="text-eyebrow">Menù ≈ 45–50 €{/* DA CONFERMARE */}</li>
            </ul>
          </div>
        </div>

        {/* Nav categorie */}
        <div data-menu-intro className="mt-12 md:mt-16">
          <CategoryNav
            activeCategory={activeCategoryId}
            onSelect={handleSelectCategory}
          />
        </div>

        {/* Grid split */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            {MENU.map((cat) => (
              <MenuCategory
                key={cat.id}
                ref={(el) => {
                  if (el) categoryRefs.current.set(cat.id, el);
                  else categoryRefs.current.delete(cat.id);
                }}
                category={cat}
                activeDishId={activeDishId}
                onActivateDish={setActiveDishId}
              />
            ))}
          </div>

          <div className="md:col-span-5">
            <StickyArchPreview
              dish={activeDish}
              categoryLabel={activeCategory.label}
            />
          </div>
        </div>

        {/* Chiusura */}
        <div className="mt-20 flex flex-col items-start gap-6 border-t border-ink/15 pt-12 md:flex-row md:items-center md:justify-between md:pt-16">
          <p className="max-w-md font-display text-xl italic leading-snug text-ink/70 md:text-2xl">
            La carta cambia con le stagioni. Per menù su misura, parla con noi.
          </p>
          <div className="flex flex-wrap gap-6">
            <MagneticButton
              href="#"
              variant="link"
              ariaLabel="Scarica la carta completa (link da confermare)"
            >
              {/* DA CONFERMARE link carta */}
              Scarica la carta →
            </MagneticButton>
            <MagneticButton href="#contatti" variant="pill">
              Prenota un tavolo →
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Uscita verso Sez.07 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--terracotta) 12%, transparent))",
        }}
      />
      <div className="pb-32 md:pb-40" />
    </section>
  );
}
