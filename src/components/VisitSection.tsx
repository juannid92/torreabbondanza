import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Instagram, Phone, Mail, MapPin, Globe, Check, ArrowRight } from "lucide-react";
import { StylizedMap } from "@/components/StylizedMap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ADDRESS_LINE_1 = "Strada Vicinale per Massafra / SP 211";
const ADDRESS_LINE_2 = "Zona E n. 49 — 70015 Noci (BA)";
const ADDRESS_FULL = `${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`;
const PHONE = "+39 338 483 4318";
const PHONE_TEL = "+393384834318";
const EMAIL = "info@torreabbondanza.com";
const SITE = "torreabbondanza.com";
const SITE_URL = "https://torreabbondanza.com";
const IG_HANDLE = "@masseria_torre_abbondanza";
const IG_URL = "https://www.instagram.com/masseria_torre_abbondanza/";
const COORDS = { lat: 40.728664, lng: 17.132612 };
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`;
const APPLE_MAPS_URL = `https://maps.apple.com/?ll=${COORDS.lat},${COORDS.lng}&q=Masseria%20Torre%20Abbondanza`;

type FormStatus = "idle" | "loading" | "success" | "error";

/* ---------------- Field ---------------- */
interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  min?: string;
  autoComplete?: string;
  error?: string;
  children?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}

function Field({
  label, name, type = "text", required, textarea, rows = 3, min,
  autoComplete, error, children, value, onChange, hint,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const id = `f-${name}`;
  const errId = `${id}-err`;
  const filled = value.length > 0;
  const float = focused || filled || !!children;

  const baseClass =
    "peer w-full bg-transparent text-ink placeholder-transparent outline-none " +
    "border-b border-stone/80 px-0 pt-5 pb-2 text-base transition-colors duration-300 " +
    "focus:border-terracotta";

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 origin-left text-ink/55 transition-all duration-300",
          float ? "top-0 text-[11px] tracking-[0.18em] uppercase text-ink/70" : "top-6 text-base",
        )}
      >
        {label}{required && <span aria-hidden className="text-terracotta">*</span>}
      </label>

      {children ? (
        <div className="pt-5 pb-2 border-b border-stone/80 focus-within:border-terracotta transition-colors">
          {children}
        </div>
      ) : textarea ? (
        <textarea
          id={id} name={name} rows={rows} required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(baseClass, "resize-none")}
        />
      ) : (
        <input
          id={id} name={name} type={type} required={required} min={min}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
        />
      )}

      <span
        aria-hidden
        className={cn(
          "absolute left-0 bottom-0 h-px bg-terracotta transition-all duration-500",
          focused ? "w-full" : "w-0",
        )}
      />
      {hint && !error && (
        <p className="mt-2 text-xs text-ink/55">{hint}</p>
      )}
      {error && (
        <p id={errId} className="mt-2 text-xs text-[color:var(--destructive)]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- Submit ---------------- */
function SubmitButton({ status, label }: { status: FormStatus; label: string }) {
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.18;
    btnRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "";
  };

  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={status === "loading"}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "group relative inline-flex items-center gap-3 self-start will-change-transform",
        "rounded-full bg-ink text-ivory px-7 py-3.5 text-sm tracking-[0.16em] uppercase",
        "shadow-[var(--shadow-cta)] transition-[background-color,transform] duration-300",
        "hover:bg-terracotta focus-visible:bg-terracotta focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
        status === "loading" && "opacity-70 cursor-wait",
      )}
    >
      <span>{status === "loading" ? "Invio…" : label}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

/* ---------------- Feedback ---------------- */
function Feedback({ status, message }: { status: FormStatus; message: string }) {
  return (
    <div aria-live="polite" className="min-h-[1.5rem]">
      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.p
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 inline-flex items-center gap-2 text-sm text-olive"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-olive">
              <Check className="h-3 w-3" />
            </span>
            {message}
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm text-[color:var(--destructive)]"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Form unico — Occasioni ---------------- */
const OCCASIONS: { value: string; label: string; horse?: boolean }[] = [
  { value: "matrimonio", label: "Matrimonio" },
  { value: "cerimonia", label: "Cerimonia" },
  { value: "battesimo", label: "Battesimo" },
  { value: "compleanno", label: "Compleanno" },
  { value: "festa-privata", label: "Festa privata" },
  { value: "esperienza-equestre", label: "Esperienza equestre", horse: true },
  { value: "altro", label: "Altro" },
];

function OccasionForm() {
  const [v, setV] = useState({
    name: "", email: "", phone: "", kind: "", date: "", guests: "",
    message: "", consent: "", website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));

  const horseSelected = v.kind === "esperienza-equestre";

  function validate() {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Inserisci il tuo nome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email non valida.";
    if (!/^[\d +().\-/]{6,}$/.test(v.phone)) e.phone = "Numero non valido.";
    if (!v.kind) e.kind = "Scegli il tipo di occasione.";
    if (!v.message.trim()) e.message = "Raccontaci qualcosa.";
    if (v.consent !== "yes") e.consent = "È necessario il consenso privacy.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (v.website) return; // honeypot
    if (!validate()) return;
    setStatus("loading");
    try {
      /* INTEGRARE backend/email/CRM */
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setMsg("Grazie. Ti rispondiamo a breve per comporre insieme la tua occasione.");
    } catch {
      setStatus("error");
      setMsg("Qualcosa è andato storto. Riprova o scrivici a info@torreabbondanza.com.");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      {/* honeypot */}
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off"
        value={v.website} onChange={(e) => set("website")(e.target.value)}
        className="hidden" aria-hidden
      />

      <div data-field className="grid gap-7 md:grid-cols-2">
        <Field label="Nome e cognome" name="name" required autoComplete="name"
          value={v.name} onChange={set("name")} error={errors.name} />
        <Field label="Email" name="email" type="email" required autoComplete="email"
          value={v.email} onChange={set("email")} error={errors.email} />
      </div>

      <div data-field className="grid gap-7 md:grid-cols-2">
        <Field label="Telefono" name="phone" type="tel" required autoComplete="tel"
          value={v.phone} onChange={set("phone")} error={errors.phone} />
        <Field
          label="Tipo di occasione" name="kind" required
          value={v.kind} onChange={set("kind")} error={errors.kind}
        >
          <select
            id="f-kind"
            value={v.kind}
            onChange={(e) => set("kind")(e.target.value)}
            className={cn(
              "w-full bg-transparent outline-none text-base text-ink appearance-none",
              horseSelected && "text-[color:var(--murgese)]",
            )}
          >
            <option value="" disabled hidden />
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div data-field className="grid gap-7 md:grid-cols-2">
        <Field label="Data indicativa" name="date" type="date" min={today}
          value={v.date} onChange={set("date")} />
        <Field label="Numero ospiti" name="guests" type="number" min="1"
          value={v.guests} onChange={set("guests")} />
      </div>

      <div data-field>
        <Field label="Messaggio" name="message" textarea rows={4} required
          value={v.message} onChange={set("message")} error={errors.message}
          hint="Allergie, menù dedicati, esigenze particolari: scrivi tutto qui." />
      </div>

      <p data-field className="text-[11px] tracking-[0.18em] uppercase text-ink/55">
        veg · vegan · gluten-free · menù bambini disponibili su richiesta
      </p>

      <label data-field className="flex items-start gap-3 text-sm text-ink/75 cursor-pointer">
        <input
          type="checkbox"
          checked={v.consent === "yes"}
          onChange={(e) => set("consent")(e.target.checked ? "yes" : "")}
          aria-invalid={!!errors.consent}
          className="mt-1 h-4 w-4 accent-[color:var(--terracotta)]"
        />
        <span>
          Acconsento al trattamento dei dati secondo la{" "}
          <a href="#" className="underline underline-offset-4 hover:text-terracotta">
            privacy policy
          </a>
          .{errors.consent && (
            <span className="block mt-1 text-xs text-[color:var(--destructive)]">
              {errors.consent}
            </span>
          )}
        </span>
      </label>

      <div data-field>
        <SubmitButton status={status} label="Richiedi informazioni" />
      </div>
      <Feedback status={status} message={msg} />
    </form>
  );
}

/* ---------------- Recapiti — righe editoriali ---------------- */
interface ContactRowProps {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}
function ContactRow({ label, icon, children }: ContactRowProps) {
  return (
    <li data-field className="group grid grid-cols-[auto_1fr] items-start gap-5 py-5 border-b border-stone/40 last:border-b-0">
      <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone/60 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-ivory group-hover:border-terracotta">
        {icon}
      </span>
      <div>
        <p className="text-[11px] tracking-[0.22em] uppercase text-ink/55 mb-1.5">
          {label}
        </p>
        <div className="font-display text-[clamp(1.05rem,1.4vw,1.35rem)] leading-snug text-ink">
          {children}
        </div>
      </div>
    </li>
  );
}

/* ---------------- Section ---------------- */
export function VisitSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll<HTMLElement>("[data-word]");
        gsap.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.95, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-field]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 22, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
            delay: Math.min(i * 0.04, 0.4),
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });

      // Parallax dolce tra colonne
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax ?? 0);
        gsap.to(el, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Marker "atterra" + pulse
      if (markerRef.current && mapRef.current) {
        gsap.fromTo(
          markerRef.current,
          { y: -36, opacity: 0, scale: 0.6 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(2)",
            scrollTrigger: { trigger: mapRef.current, start: "top 80%" },
            onComplete: () => {
              gsap.to(markerRef.current, {
                scale: 1.08, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut",
              });
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contatti"
      aria-labelledby="visit-title"
      className="relative w-full bg-ivory text-ink py-24 md:py-32 overflow-hidden"
    >
      {/* Grain leggera */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, color-mix(in oklab, var(--terracotta) 40%, transparent), transparent 35%), radial-gradient(circle at 88% 82%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 40%)",
        }}
      />
      {/* Continuità con il libro degli ospiti — alone caldo in alto */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-[120%]"
        style={{
          background:
            "radial-gradient(ellipse at center top, color-mix(in oklab, var(--gold) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
        {/* Testata */}
        <header className="max-w-3xl">
          <p data-field className="text-[11px] tracking-[0.28em] uppercase text-ink/55 mb-6">
            11 — Contatti
          </p>
          <h2
            ref={titleRef}
            id="visit-title"
            className="font-display text-[clamp(2.6rem,7.2vw,5.8rem)] leading-[0.95] tracking-tight"
          >
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block">Vieni&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block">a&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block italic text-terracotta">trovarci.</span>
            </span>
          </h2>
          <p data-field className="mt-6 max-w-xl text-lg text-ink/75 leading-relaxed">
            Nel cuore della Murgia, tra ulivi secolari e l'eco del galoppo dei nostri Murgesi.
            Ti aspettiamo per la tavola, per una festa, per un'esperienza che resta.
          </p>
        </header>

        {/* Split */}
        <div className="mt-16 md:mt-24 grid gap-16 lg:gap-24 lg:grid-cols-[1fr_1.05fr]">
          {/* Colonna sinistra — Dove siamo */}
          <aside data-parallax="-14" className="space-y-12">
            <div>
              <p data-field className="text-[11px] tracking-[0.22em] uppercase text-ink/55 mb-4">
                Dove siamo
              </p>
              <ul className="border-t border-stone/40">
                <ContactRow label="Indirizzo" icon={<MapPin className="h-4 w-4" />}>
                  <a
                    href={MAPS_URL}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-terracotta transition-colors"
                  >
                    {ADDRESS_LINE_1}
                    <span className="block text-base text-ink/70 not-italic font-sans">
                      {ADDRESS_LINE_2}
                    </span>
                  </a>
                </ContactRow>
                <ContactRow label="Telefono" icon={<Phone className="h-4 w-4" />}>
                  <a href={`tel:${PHONE_TEL}`} className="hover:text-terracotta transition-colors">
                    {PHONE}
                  </a>
                </ContactRow>
                <ContactRow label="Email" icon={<Mail className="h-4 w-4" />}>
                  <a href={`mailto:${EMAIL}`} className="hover:text-terracotta transition-colors">
                    {EMAIL}
                  </a>
                </ContactRow>
                <ContactRow label="Sito" icon={<Globe className="h-4 w-4" />}>
                  <a
                    href={SITE_URL}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-terracotta transition-colors"
                  >
                    {SITE}
                  </a>
                </ContactRow>
                <ContactRow label="Instagram" icon={<Instagram className="h-4 w-4" />}>
                  <a
                    href={IG_URL}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-terracotta transition-colors"
                  >
                    {IG_HANDLE}
                  </a>
                </ContactRow>
              </ul>
            </div>

            {/* Mappa stilizzata */}
            <div data-field>
              <p className="text-[11px] tracking-[0.22em] uppercase text-ink/55 mb-4">
                Nella Murgia
              </p>
              <div
                ref={mapRef}
                className="relative overflow-hidden rounded-2xl border border-stone/70 bg-[color:color-mix(in_oklab,var(--ivory)_92%,var(--stone))] p-4"
              >
                <StylizedMap />
                {/* Marker editoriale animato sovrapposto */}
                <div
                  ref={markerRef}
                  aria-hidden
                  className="pointer-events-none absolute left-[53%] top-[52%] -translate-x-1/2 -translate-y-full"
                >
                  <span className="block h-3 w-3 rounded-full bg-[color:var(--murgese)] ring-4 ring-[color:color-mix(in_oklab,var(--murgese)_25%,transparent)]" />
                </div>
                {/* Fallback testuale per screen reader / no-map */}
                <p className="sr-only">
                  Masseria Torre Abbondanza — coordinate {COORDS.lat}, {COORDS.lng}. {ADDRESS_FULL}.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <a
                  href={MAPS_URL}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 tracking-[0.14em] uppercase text-ink hover:text-terracotta transition-colors"
                >
                  Indicazioni · Google Maps
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={APPLE_MAPS_URL}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 tracking-[0.14em] uppercase text-ink/70 hover:text-terracotta transition-colors"
                >
                  Apple Maps
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Nota modello reale */}
            <p
              data-field
              className="font-display italic text-[clamp(1.05rem,1.4vw,1.3rem)] leading-relaxed text-ink/80 border-l-2 border-terracotta pl-5"
            >
              La cucina apre su prenotazione, per le grandi occasioni. Scrivici e
              componiamo insieme la tua.
            </p>
          </aside>

          {/* Colonna destra — Form */}
          <div data-parallax="14">
            <p data-field className="text-[11px] tracking-[0.22em] uppercase text-ink/55 mb-4">
              Richiedi la tua occasione
            </p>
            <h3
              data-field
              className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] leading-tight tracking-tight text-ink mb-10"
            >
              Raccontaci la tua festa, <span className="italic text-terracotta">la costruiamo insieme</span>.
            </h3>
            <OccasionForm />
          </div>
        </div>
      </div>
    </section>
  );
}