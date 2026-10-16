import { createFileRoute, Link } from "@tanstack/react-router";
import { HeadContent } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BUSINESS } from "@/lib/site";

// [K2] Pagina Cookie Policy — il sito non usa cookie di tracciamento.
// Le voci in [DA CONFERMARE: ...] vanno aggiornate se si aggiungono strumenti
// di analisi o embed di terze parti (YouTube, Maps widget, ecc.).
export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: `Cookie Policy — ${BUSINESS.name}` },
      {
        name: "description",
        content: `Informativa sull'uso dei cookie su ${BUSINESS.name}.`,
      },
      { name: "robots", content: "index, follow" },
    ],
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
          <p className="mt-2 text-sm text-muted-foreground">
            Ultimo aggiornamento: [DA CONFERMARE: data ultima revisione]
          </p>

          <Section title="Cosa sono i cookie">
            <p>
              I cookie sono piccoli file di testo che i siti visitati inviano al terminale
              dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla
              successiva visita.
            </p>
          </Section>

          <Section title="Cookie utilizzati da questo sito">
            <p>
              Questo sito{" "}
              <strong>non utilizza cookie di profilazione, tracciamento o marketing</strong>. I
              caratteri tipografici sono serviti direttamente dal sito (self-hosted) e non generano
              cookie. Non sono presenti embed di terze parti che richiedano consenso.
            </p>
            <p>
              <strong>[DA CONFERMARE]</strong>: se in futuro verranno aggiunti strumenti come Google
              Analytics, YouTube embed o widget social, sarà necessario aggiornare questa pagina con
              il relativo elenco e implementare un banner di consenso (Cookiebot / Iubenda /
              custom).
            </p>
          </Section>

          <Section title="Cookie tecnici del provider">
            <p>
              Il sito è distribuito tramite Cloudflare, che può impostare cookie strettamente
              tecnici necessari al funzionamento della rete di distribuzione (es.{" "}
              <code>__cf_bm</code> per il bot management). Tali cookie non sono controllati dal
              Titolare e sono descritti nella documentazione del provider.
            </p>
          </Section>

          <Section title="Come gestire i cookie">
            <p>
              Puoi configurare il tuo browser per rifiutare tutti i cookie o per avvisarti quando ne
              viene inviato uno. La disabilitazione dei cookie tecnici può compromettere il corretto
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
