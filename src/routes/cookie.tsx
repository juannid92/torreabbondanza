import { createFileRoute, Link } from "@tanstack/react-router";
import { HeadContent } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BUSINESS, SITE_URL } from "@/lib/site";

/** Ultimo aggiornamento dell'informativa (formato IT gg/mm/aaaa). */
const LAST_UPDATED = "16 ottobre 2026";

/**
 * Cookie Policy — il sito non installa cookie opzionali.
 * Solo cookie tecnici del provider di hosting (Cloudflare) per i quali non è
 * richiesto consenso ai sensi del Provv. Garante 10 giugno 2021.
 */
export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: `Cookie Policy — ${BUSINESS.name}` },
      {
        name: "description",
        content: `Informativa sull'uso dei cookie su ${BUSINESS.name}: solo cookie tecnici, nessun cookie di profilazione o tracciamento.`,
      },
      // Pagine legali: noindex per non sprecare crawl budget su contenuti
      // che non portano traffico organico di valore.
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cookie` }],
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <>
      <HeadContent />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla home
          </Link>

          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Ultimo aggiornamento: {LAST_UPDATED}</p>

          <Section title="Cosa sono i cookie">
            <p>
              I cookie sono piccoli file di testo che i siti visitati inviano al terminale
              dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla
              successiva visita. Possono essere installati dal sito che si sta visitando (cookie di
              prima parte) o da siti diversi (cookie di terze parti).
            </p>
          </Section>

          <Section title="Cookie utilizzati da questo sito">
            <p>
              Questo sito{" "}
              <strong>non utilizza cookie di profilazione, tracciamento o marketing</strong>. Non
              sono presenti strumenti di analisi delle visite (Google Analytics o equivalenti), né
              embed di terze parti (YouTube, Facebook, Instagram widget) né pixel di tracciamento. I
              caratteri tipografici sono serviti direttamente dal sito (self-hosted) e non generano
              cookie né trasferimenti verso terzi.
            </p>
          </Section>

          <Section title="Cookie tecnici del provider">
            <p>
              Il sito è distribuito tramite Cloudflare, che può impostare cookie strettamente
              tecnici necessari al funzionamento della rete di distribuzione dei contenuti (es.{" "}
              <code>__cf_bm</code> per il bot management, <code>__cflb</code> per il bilanciamento).
              Tali cookie sono installati dal provider e non dal Titolare del sito: non richiedono
              consenso preventivo ai sensi del Provvedimento del Garante per la protezione dei dati
              personali del 10 giugno 2021. Per i dettagli si rimanda alla{" "}
              <a
                className="underline"
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy di Cloudflare
              </a>
              .
            </p>
          </Section>

          <Section title="Come gestire i cookie">
            <p>
              Puoi configurare il tuo browser per rifiutare tutti i cookie o per avvisarti quando ne
              viene inviato uno. Le istruzioni si trovano nella sezione di aiuto del browser
              utilizzato. La disabilitazione dei cookie tecnici può compromettere il corretto
              funzionamento del sito.
            </p>
          </Section>

          <Section title="Per saperne di più">
            <p>
              Per la disciplina italiana ed europea sui cookie consulta il{" "}
              <a
                className="underline"
                href="https://www.garanteprivacy.it/cookie"
                target="_blank"
                rel="noopener noreferrer"
              >
                provvedimento del Garante per la protezione dei dati personali
              </a>{" "}
              e il Reg. UE 2016/679 (GDPR).
            </p>
          </Section>

          <p className="mt-12 text-sm text-muted-foreground">
            Per ogni richiesta relativa ai tuoi dati personali consulta la{" "}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}
