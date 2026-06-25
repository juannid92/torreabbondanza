import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Instagram, Facebook, Phone, Mail, MapPin, Check, ArrowRight } from "lucide-react";
import { StylizedMap } from "@/components/StylizedMap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ADDRESS = "Strada Vicinale per Massafra / SP 211, Zona E n. 49, 70015 Noci (BA)";
const PHONE = "+39 338 483 4318";
const PHONE_TEL = "+393384834318";
const EMAIL = "info@torreabbondanza.com";
const COORDS = { lat: 40.728664, lng: 17.132612 };
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`;

type FormStatus = "idle" | "loading" | "success" | "error";
type TabKey = "table" | "event";

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  min?: string;
  pattern?: string;
  autoComplete?: string;
  error?: string;
  children?: ReactNode;
  value: string;
  onChange: (v: string) => void;
}

function Field({
  label, name, type = "text", required, textarea, rows = 3, min, pattern,
  autoComplete, error, children, value, onChange,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const id = `f-${name}`;
  const errId = `${id}-err`;
  const filled = value.length > 0;
  const float = focused || filled;

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
          id={id}
          name={name}
          rows={rows}
          required={required}
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
          id={id}
          name={name}
          type={type}
          required={required}
          min={min}
          pattern={pattern}
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
      {error && (
        <p id={errId} className="mt-2 text-xs text-[color:var(--destructive)]">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ status, label }: { status: FormStatus; label: string }) {
  const reduced = useReducedMotion();
  return (
    <button
      type="submit"
      disabled={status === "loading"}
      className={cn(
        "group relative inline-flex items-center gap-3 self-start",
        "rounded-full bg-ink text-ivory px-7 py-3.5 text-sm tracking-[0.16em] uppercase",
        "shadow-[var(--shadow-cta)] transition-transform duration-300",
        "hover:bg-terracotta focus-visible:bg-terracotta focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
        !reduced && "hover:-translate-y-0.5",
        status === "loading" && "opacity-70 cursor-wait",
      )}
    >
      <span>{status === "loading" ? "Invio…" : label}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

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

/* ---------------- Form: Tavolo ---------------- */
function BookingForm() {
  const [v, setV] = useState({
    name: "", phone: "", email: "", date: "", time: "", people: "2", notes: "", website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));

  function validate() {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Inserisci il tuo nome.";
    if (!/^[\d +().\-/]{6,}$/.test(v.phone)) e.phone = "Numero non valido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email non valida.";
    if (!v.date) e.date = "Scegli una data.";
    if (!v.time) e.time = "Scegli un orario.";
    if (!v.people || Number(v.people) < 1) e.people = "Almeno 1 persona.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (v.website) return; // honeypot
    if (!validate()) return;
    setStatus("loading");
    try {
      /* INTEGRARE backend/email/TheFork */
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setMsg("Richiesta inviata. Ti contattiamo a breve per confermare.");
    } catch {
      setStatus("error");
      setMsg("Qualcosa è andato storto. Riprova o chiamaci direttamente.");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off"
        value={v.website} onChange={(e) => set("website")(e.target.value)}
        className="hidden" aria-hidden
      />
      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Nome e cognome" name="name" required autoComplete="name"
          value={v.name} onChange={set("name")} error={errors.name} />
        <Field label="Telefono" name="phone" type="tel" required autoComplete="tel"
          value={v.phone} onChange={set("phone")} error={errors.phone} />
      </div>
      <Field label="Email" name="email" type="email" required autoComplete="email"
        value={v.email} onChange={set("email")} error={errors.email} />
      <div className="grid gap-7 md:grid-cols-3">
        <Field label="Data" name="date" type="date" required min={today}
          value={v.date} onChange={set("date")} error={errors.date} />
        <Field label="Orario" name="time" type="time" required
          value={v.time} onChange={set("time")} error={errors.time} />
        <Field label="Persone" name="people" type="number" required min="1"
          value={v.people} onChange={set("people")} error={errors.people} />
      </div>
      <Field label="Note (allergie, veg/vegan/GF, bambini…)" name="notes" textarea rows={3}
        value={v.notes} onChange={set("notes")} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton status={status} label="Invia richiesta" />
        <a
          href="#"
          /* DA CONFERMARE link TheFork */
          className="text-sm tracking-[0.14em] uppercase text-ink/70 underline-offset-4 hover:text-terracotta hover:underline transition-colors"
        >
          oppure prenota via TheFork →
        </a>
      </div>
      <Feedback status={status} message={msg} />
    </form>
  );
}

/* ---------------- Form: Evento ---------------- */
function EventRequestForm() {
  const [v, setV] = useState({
    name: "", phone: "", email: "", kind: "", date: "", guests: "", message: "",
    consent: "", website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof v) => (val: string) => setV((p) => ({ ...p, [k]: val }));

  function validate() {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Inserisci il tuo nome.";
    if (!/^[\d +().\-/]{6,}$/.test(v.phone)) e.phone = "Numero non valido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email non valida.";
    if (!v.kind) e.kind = "Seleziona il tipo di evento.";
    if (!v.guests || Number(v.guests) < 2) e.guests = "Indica un numero di invitati.";
    if (!v.message.trim()) e.message = "Raccontaci qualcosa del tuo evento.";
    if (v.consent !== "yes") e.consent = "È necessario il consenso privacy.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (v.website) return;
    if (!validate()) return;
    setStatus("loading");
    try {
      /* INTEGRARE backend/email/CRM */
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setMsg("Grazie. Ti rispondiamo entro 48 ore per costruire insieme la tua festa.");
    } catch {
      setStatus("error");
      setMsg("Qualcosa è andato storto. Riprova o scrivici a info@torreabbondanza.com.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off"
        value={v.website} onChange={(e) => set("website")(e.target.value)}
        className="hidden" aria-hidden
      />
      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Nome e cognome" name="ev-name" required autoComplete="name"
          value={v.name} onChange={set("name")} error={errors.name} />
        <Field label="Telefono" name="ev-phone" type="tel" required autoComplete="tel"
          value={v.phone} onChange={set("phone")} error={errors.phone} />
      </div>
      <Field label="Email" name="ev-email" type="email" required autoComplete="email"
        value={v.email} onChange={set("email")} error={errors.email} />
      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Tipo di evento" name="ev-kind" required value={v.kind}
          onChange={set("kind")} error={errors.kind}>
          <select
            id="f-ev-kind"
            value={v.kind}
            onChange={(e) => set("kind")(e.target.value)}
            className="w-full bg-transparent outline-none text-base text-ink"
          >
            <option value="" />
            <option value="matrimonio">Matrimonio</option>
            <option value="ricevimento">Ricevimento</option>
            <option value="privato">Evento privato</option>
            <option value="aziendale">Aziendale</option>
          </select>
        </Field>
        <Field label="Data indicativa" name="ev-date" type="date"
          value={v.date} onChange={set("date")} />
      </div>
      <Field label="N. invitati" name="ev-guests" type="number" required min="2"
        value={v.guests} onChange={set("guests")} error={errors.guests} />
      <Field label="Raccontaci la tua festa" name="ev-message" textarea rows={4} required
        value={v.message} onChange={set("message")} error={errors.message} />

      <label className="flex items-start gap-3 text-sm text-ink/75 cursor-pointer">
        <input
          type="checkbox"
          checked={v.consent === "yes"}
          onChange={(e) => set("consent")(e.target.checked ? "yes" : "")}
          aria-invalid={!!errors.consent}
          className="mt-1 h-4 w-4 accent-[color:var(--terracotta)]"
        />
        <span>
          Acconsento al trattamento dei dati personali secondo la{" "}
          <a href="#" className="underline underline-offset-4 hover:text-terracotta">
            privacy policy
          </a>
          .{errors.consent && (
            <span className="block mt-1 text-xs text-[color:var(--destructive)]">{errors.consent}</span>
          )}
        </span>
      </label>

      <SubmitButton status={status} label="Invia richiesta evento" />
      <Feedback status={status} message={msg} />
    </form>
  );
}

/* ---------------- Tabs ---------------- */
function BookingTabs() {
  const [tab, setTab] = useState<TabKey>("table");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "table", label: "Prenota un tavolo" },
    { key: "event", label: "Richiedi un evento" },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Modalità di contatto"
        className="relative grid grid-cols-2 gap-2 rounded-full border border-stone/70 bg-ivory p-1.5">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={active}
              aria-controls={`panel-${t.key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative z-10 rounded-full px-4 py-3 text-xs sm:text-sm tracking-[0.16em] uppercase transition-colors duration-300",
                active ? "text-ivory" : "text-ink/70 hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "table" ? <BookingForm /> : <EventRequestForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- Contact / Hours ---------------- */
function ContactCard() {
  return (
    <ul className="grid gap-5 text-ink">
      <li className="flex items-start gap-4">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone/70">
          <Phone className="h-4 w-4 text-terracotta" />
        </span>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-ink/55">Telefono</p>
          <a href={`tel:${PHONE_TEL}`} className="text-lg hover:text-terracotta transition-colors">
            {PHONE}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-4">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone/70">
          <Mail className="h-4 w-4 text-terracotta" />
        </span>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-ink/55">Email</p>
          <a href={`mailto:${EMAIL}`} className="text-lg hover:text-terracotta transition-colors">
            {EMAIL}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-4">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone/70">
          <MapPin className="h-4 w-4 text-terracotta" />
        </span>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-ink/55">Indirizzo</p>
          <p className="text-base leading-relaxed">{ADDRESS}</p>
        </div>
      </li>
      <li className="flex items-center gap-3 pt-2">
        <a
          href="https://www.instagram.com/masseria_torre_abbondanza/"
          target="_blank" rel="noopener noreferrer"
          aria-label="Instagram Masseria Torre Abbondanza"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone/70 text-ink hover:bg-ink hover:text-ivory transition-colors"
        >
          <Instagram className="h-4 w-4" />
        </a>
        <a
          href="https://www.facebook.com/MasseriaTorreAbbondanza"
          target="_blank" rel="noopener noreferrer"
          aria-label="Facebook Masseria Torre Abbondanza"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone/70 text-ink hover:bg-ink hover:text-ivory transition-colors"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </li>
    </ul>
  );
}

function HoursTable() {
  /* orari esatti DA CONFERMARE col cliente */
  const rows = [
    { day: "Lun – Gio", value: "Eventi su prenotazione" },
    { day: "Venerdì", value: "Pranzo 12:30 – 14:30 · Cena 19:30 – 22:30" },
    { day: "Sabato", value: "Pranzo 12:30 – 14:30 · Cena 19:30 – 22:30" },
    { day: "Domenica", value: "Pranzo 12:30 – 15:00" },
  ];
  return (
    <div className="rounded-2xl border border-stone/70 bg-ivory/60 p-6">
      <p className="text-[11px] tracking-[0.18em] uppercase text-ink/55 mb-4">
        Servizio à la carte {/* DA CONFERMARE */}
      </p>
      <dl className="divide-y divide-stone/60">
        {rows.map((r) => (
          <div key={r.day} className="grid grid-cols-[7rem_1fr] gap-4 py-2.5 text-sm">
            <dt className="text-ink/70">{r.day}</dt>
            <dd className="text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-ink/55">
        Eventi e ricevimenti su prenotazione tutti i giorni.
      </p>
    </div>
  );
}

/* ---------------- Section ---------------- */
export function VisitSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const archRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (archRef.current) {
        gsap.fromTo(
          archRef.current,
          { clipPath: "inset(100% 0% 0% 0% round 50% 50% 0 0 / 38% 38% 0 0)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 50% 50% 0 0 / 38% 38% 0 0)",
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          },
        );
      }

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll<HTMLElement>("[data-word]");
        gsap.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visita"
      aria-labelledby="visit-title"
      className="relative w-full bg-ivory text-ink py-24 md:py-32 overflow-hidden"
    >
      {/* Arco-cornice decorativo */}
      <div
        ref={archRef}
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[min(720px,90vw)] aspect-[3/4] border border-stone/60"
        style={{
          borderRadius: "50% 50% 0 0 / 38% 38% 0 0",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.8), transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.8), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
        {/* Testata */}
        <header className="max-w-3xl">
          <p data-reveal className="text-[11px] tracking-[0.28em] uppercase text-ink/55 mb-6">
            10 — Visita
          </p>
          <h2
            ref={titleRef}
            id="visit-title"
            className="font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.95] tracking-tight"
          >
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block">Varca&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block">la&nbsp;</span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block italic text-terracotta">soglia.</span>
            </span>
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lg text-ink/75 leading-relaxed">
            Prenota un tavolo o raccontaci il tuo evento: ti aspettiamo nel cuore della Murgia.
          </p>
        </header>

        {/* Split */}
        <div className="mt-16 md:mt-20 grid gap-14 lg:gap-20 lg:grid-cols-[1.15fr_1fr]">
          {/* Colonna sinistra — Form */}
          <div data-reveal>
            <BookingTabs />
          </div>

          {/* Colonna destra — Contatti */}
          <aside className="lg:sticky lg:top-24 self-start space-y-10">
            <div data-reveal>
              <p className="text-[11px] tracking-[0.18em] uppercase text-ink/55 mb-5">
                Contatti
              </p>
              <ContactCard />
            </div>

            <div data-reveal>
              <HoursTable />
            </div>

            <div data-reveal className="space-y-4">
              <p className="text-[11px] tracking-[0.18em] uppercase text-ink/55">
                Come arrivare
              </p>
              <div className="relative rounded-2xl border border-stone/70 bg-ivory overflow-hidden">
                <StylizedMap />
              </div>
              <a
                href={MAPS_URL}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm tracking-[0.14em] uppercase text-ink hover:text-terracotta transition-colors"
              >
                Apri in Google Maps
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>

        {/* Chiusura */}
        <div data-reveal className="mt-24 md:mt-32 text-center">
          <p className="font-display italic text-[clamp(1.8rem,3.6vw,2.8rem)] text-ink">
            Vi aspettiamo.
          </p>
          <p className="mt-3 text-[11px] tracking-[0.28em] uppercase text-ink/55">
            — Masseria Torre Abbondanza
          </p>
        </div>
      </div>
    </section>
  );
}
