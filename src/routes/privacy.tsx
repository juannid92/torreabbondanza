import { createFileRoute, Link } from "@tanstack/react-router";
import { HeadContent } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BUSINESS } from "@/lib/site";

// [K2] Pagina Privacy Policy — placeholder GDPR-ready.
// Le voci in [DA CONFERMARE: ...] vanno compilate con i dati reali del titolare
// (ragione sociale, P.IVA, sede legale, contatto DPO se presente, finalità di
// trattamento specifiche del form contatti).
export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${BUSINESS.name}` },
      {
        name: "description",
        content: `Informativa sul trattamento dei dati personali raccolti tramite ${BUSINESS.name}.`,
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ultimo aggiornamento: [DA CONFERMARE: data ultima revisione]
          </p>

          <Section title="1. Titolare del trattamento">
            <p>
              Il Titolare del trattamento dei dati personali è{" "}
              <strong>[DA CONFERMARE: ragione sociale completa]</strong>, con sede
              legale in <strong>[DA CONFERMARE: indirizzo sede legale]</strong>, P.IVA{" "}
              <strong>[DA CONFERMARE: P.IVA]</strong>, contatto e-mail{" "}
              <a className="underline" href="mailto:info@torreabbondanza.com">
                info@torreabbondanza.com
              </a>
              .
            </p>
          </Section>

          <Section title="2. Tipologie di dati raccolti">
            <p>
              Tramite il modulo di contatto del sito raccogliamo: nome, indirizzo
              e-mail, numero di telefono, tipo di occasione, data indicativa
              dell'evento, numero di ospiti e messaggio libero. Altre categorie di
              dati (es. log di accesso) sono raccolte automaticamente dai sistemi
              del provider di hosting.
            </p>
          </Section>

          <Section title="3. Finalità del trattamento">
            <p>
              I dati sono trattati per rispondere alle richieste inviate tramite il
              modulo di contatto, gestire la prenotazione dell'occasione e inviare
              una risposta automatica di conferma via e-mail.{" "}
              <strong>[DA CONFERMARE: eventuali altre finalità, es. newsletter, profilazione]</strong>
            </p>
          </Section>

          <Section title="4. Base giuridica">
            <p>
              Il trattamento si fonda sull'art. 6, par. 1, lett. b) del Reg. UE
              2016/679 (esecuzione di misure precontrattuali su richiesta
              dell'interessato) e, per la sola e-mail di conferma automatica,
              sull'art. 6, par. 1, lett. f) (legittimo interesse del Titolare a
              dare riscontro).
            </p>
          </Section>

          <Section title="5. Conservazione dei dati">
            <p>
              I dati del modulo di contatto sono conservati per il tempo necessario
              a evadere la richiesta e, successivamente, per{" "}
              <strong>[DA CONFERMARE: periodo di conservazione, es. 24 mesi]</strong>{" "}
              ai fini di reportistica interna e obblighi contabili.
            </p>
          </Section>

          <Section title="6. Destinatari dei dati">
            <p>
              I dati sono trattati dal Titolare e dai fornitori di servizi
              strettamente necessari: provider di hosting (Cloudflare), servizio
              di invio e-mail transazionali (Resend) e database gestito (Supabase).
              L'elenco aggiornato dei responsabili del trattamento è disponibile
              su richiesta.
            </p>
          </Section>

          <Section title="7. Trasferimenti extra-UE">
            <p>
              Alcuni dei fornitori sopra indicati (es. Resend) possono effettuare
              trasferimenti di dati verso paesi terzi. Tali trasferimenti avvengono
              sulla base di decisioni di adeguatezza, clausole contrattuali
              standard o altre basi legittime previste dal Capo V del GDPR.{" "}
              <strong>[DA CONFERMARE: elenco paesi terzi e basi giuridiche specifiche]</strong>
            </p>
          </Section>

          <Section title="8. Diritti dell'interessato">
            <p>
              In qualità di interessato, hai il diritto di accedere ai tuoi dati,
              chiederne la rettifica o la cancellazione, opporti al loro
              trattamento, richiederne la portabilità e proporre reclamo
              all'Autorità di controllo (Garante per la Protezione dei Dati
              Personali, www.garanteprivacy.it). Per esercitare questi diritti
              scrivi a{" "}
              <a className="underline" href="mailto:info@torreabbondanza.com">
                info@torreabbondanza.com
              </a>
              .
            </p>
          </Section>

          <Section title="9. Cookie">
            <p>
              Questo sito non utilizza cookie di profilazione né di tracciamento.
              Per i dettagli tecnici consulta la{" "}
              <Link to="/cookie" className="underline">
                Cookie Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="10. Modifiche">
            <p>
              Eventuali aggiornamenti di questa informativa saranno pubblicati in
              questa pagina. Si invita a consultarla periodicamente.
            </p>
          </Section>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/85">
        {children}
      </div>
    </section>
  );
}
