import { createFileRoute, Link } from "@tanstack/react-router";
import { HeadContent } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BUSINESS } from "@/lib/site";

/** Ultimo aggiornamento dell'informativa (formato IT gg/mm/aaaa). */
const LAST_UPDATED = "16 ottobre 2026";

/**
 * Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14
 * del Reg. UE 2016/679 (GDPR). Le voci "[DA CONFERMARE: ...]" relative a
 * ragione sociale, sede legale e P.IVA vanno compilate con i dati reali del
 * Titolare prima della pubblicazione definitiva.
 */
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
          <p className="mt-2 text-sm text-muted-foreground">Ultimo aggiornamento: {LAST_UPDATED}</p>

          <Section title="1. Titolare del trattamento">
            <p>
              Il Titolare del trattamento dei dati personali è{" "}
              <strong>
                Masseria Torre Abbondanza - Società Agricola Semplice dei Fratelli Giunta
              </strong>
              , con sede legale in <strong>Zona E n. 49, 70015 Noci (BA)</strong>, P.IVA / C.F.{" "}
              <strong>06351980724</strong>, REA <strong>BA - 479911</strong>, contatto e-mail{" "}
              <a className="underline" href="mailto:info@torreabbondanza.com">
                info@torreabbondanza.com
              </a>
              , telefono <a className="underline" href="tel:+393384834318">+39 338 483 4318</a>.
            </p>
          </Section>

          <Section title="2. Tipologie di dati raccolti">
            <p>
              Tramite il modulo di contatto del sito raccogliamo i dati che l'utente inserisce
              direttamente: nome e cognome, indirizzo e-mail, numero di telefono, tipo di occasione,
              data indicativa dell'evento, numero di ospiti e un messaggio libero. L'indirizzo IP e
              l'user agent del browser sono raccolti automaticamente dal provider di hosting
              (Cloudflare) per finalità di sicurezza e prevenzione abusi.
            </p>
          </Section>

          <Section title="3. Finalità e basi giuridiche del trattamento">
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Risposta alle richieste</strong> inviate tramite il modulo di contatto,
                composizione del menù, organizzazione dell'occasione. Base giuridica: art. 6, par.
                1, lett. b) GDPR — esecuzione di misure precontrattuali su richiesta
                dell'interessato.
              </li>
              <li>
                <strong>Invio di un'e-mail automatica di conferma</strong> al mittente, a riscontro
                dell'avvenuta ricezione. Base giuridica: art. 6, par. 1, lett. f) GDPR — legittimo
                interesse del Titolare a dare riscontro alle richieste.
              </li>
              <li>
                <strong>Conservazione per finalità amministrative e contabili</strong> e tutela dei
                diritti in sede giudiziaria. Base giuridica: art. 6, par. 1, lett. f) GDPR —
                legittimo interesse del Titolare.
              </li>
              <li>
                <strong>Adempimento di obblighi di legge</strong> (es. fiscali, antiriciclaggio).
                Base giuridica: art. 6, par. 1, lett. c) GDPR — obbligo legale.
              </li>
            </ul>
          </Section>

          <Section title="4. Conservazione dei dati">
            <p>
              I dati del modulo di contatto sono conservati per il tempo necessario a evadere la
              richiesta e, successivamente, per un periodo massimo di <strong>24 mesi</strong> ai
              fini di reportistica interna e di eventuale tutela in sede giudiziaria. I dati
              necessari per adempiere ad obblighi contabili e fiscali sono conservati per 10 anni
              dalla cessazione del rapporto, come previsto dalla normativa italiana. Trascorsi tali
              termini i dati sono cancellati o resi anonimi in modo permanente.
            </p>
          </Section>

          <Section title="5. Modalità del trattamento">
            <p>
              I dati sono trattati con strumenti elettronici e cartacei, da personale autorizzato
              del Titolare, con logiche strettamente correlate alle finalità indicate e adottando
              misure tecniche e organizzative adeguate a garantirne la sicurezza e la riservatezza
              (art. 32 GDPR). Il sito è distribuito su Cloudflare con connessione HTTPS; l'accesso
              al database è limitato al personale autorizzato.
            </p>
          </Section>

          <Section title="6. Destinatari dei dati">
            <p>
              I dati possono essere comunicati ai seguenti soggetti esterni, in qualità di
              Responsabili del trattamento (art. 28 GDPR):
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Cloudflare Inc.</strong> — provider di hosting e CDN (sede: Stati Uniti,
                trasferimento basato su decisione di adeguatezza EU-US Data Privacy Framework).
              </li>
              <li>
                <strong>Supabase Inc.</strong> — gestione database (sede: Stati Uniti, trasferimento
                basato su decisione di adeguatezza EU-US Data Privacy Framework).
              </li>
              <li>
                <strong>Resend Inc.</strong> — servizio di invio e-mail transazionali (sede: Stati
                Uniti, trasferimento basato su Clausole Contrattuali Standard).
              </li>
            </ul>
            <p>
              L'elenco aggiornato dei Responsabili del trattamento è disponibile su richiesta
              scrivendo a{" "}
              <a className="underline" href="mailto:info@torreabbondanza.com">
                info@torreabbondanza.com
              </a>
              .
            </p>
          </Section>

          <Section title="7. Trasferimenti verso paesi terzi">
            <p>
              Alcuni dei fornitori sopra indicati hanno sede negli Stati Uniti d'America. I
              trasferimenti avvengono sulla base delle decisioni di adeguatezza rilasciate dalla
              Commissione europea (EU-US Data Privacy Framework) ovvero, in subordine, tramite
              Clausole Contrattuali Standard e misure tecniche supplementari. Per ottenere copia
              delle garanzie applicabili scrivi a{" "}
              <a className="underline" href="mailto:info@torreabbondanza.com">
                info@torreabbondanza.com
              </a>
              .
            </p>
          </Section>

          <Section title="8. Diritti dell'interessato">
            <p>
              In qualità di interessato, hai il diritto di accedere ai tuoi dati personali (art. 15
              GDPR), chiederne la rettifica (art. 16) o la cancellazione (art. 17), opporti al loro
              trattamento (art. 21), richiederne la limitazione (art. 18) o la portabilità (art.
              20). Per esercitare questi diritti scrivi a{" "}
              <a className="underline" href="mailto:info@torreabbondanza.com">
                info@torreabbondanza.com
              </a>
              . Hai inoltre il diritto di proporre reclamo all'Autorità di controllo (Garante per la
              Protezione dei Dati Personali,{" "}
              <a
                className="underline"
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.garanteprivacy.it
              </a>
              ).
            </p>
          </Section>

          <Section title="9. Cookie">
            <p>
              Questo sito non utilizza cookie di profilazione né di tracciamento. Per i dettagli
              tecnici sui cookie impiegati consulta la{" "}
              <Link to="/cookie" className="underline">
                Cookie Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="10. Modifiche">
            <p>
              Eventuali aggiornamenti di questa informativa saranno pubblicati in questa pagina con
              l'indicazione della data di ultimo aggiornamento. Si invita a consultarla
              periodicamente, in particolare prima di conferire nuovi dati personali.
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
      <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}
