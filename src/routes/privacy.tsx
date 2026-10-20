import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BUSINESS, SITE_URL } from "@/lib/site";

/** Ultimo aggiornamento dell'informativa (formato IT gg/mm/aaaa). */
const LAST_UPDATED = "20 ottobre 2026";

/**
 * Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14
 * del Reg. UE 2016/679 (GDPR).
 */
export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${BUSINESS.name}` },
      {
        name: "description",
        content: `Informativa sul trattamento dei dati personali raccolti tramite ${BUSINESS.name}.`,
      },
      // Pagine legali: noindex per non sprecare crawl budget su contenuti
      // che non portano traffico organico di valore.
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
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
            <strong>06351980724</strong>, REA <strong>BA - 479911</strong>, recapito telefonico e
            WhatsApp{" "}
            <a className="underline" href="tel:+393384834318">
              +39 338 483 4318
            </a>
            .
          </p>
        </Section>

        <Section title="2. Tipologie di dati raccolti">
          <p>
            Tramite il modulo di richiesta del sito raccogliamo i dati che l'utente inserisce
            direttamente per preparare il messaggio WhatsApp o essere ricontattato telefonicamente:
            nome e cognome, numero di telefono, tipo di occasione, data indicativa dell'evento,
            numero di ospiti e un messaggio libero. L'indirizzo IP e l'user agent del browser sono
            raccolti automaticamente dal provider di hosting (Cloudflare) per finalità di sicurezza
            e prevenzione abusi.
          </p>
        </Section>

        <Section title="3. Finalità e basi giuridiche del trattamento">
          <p>I dati personali sono trattati per le seguenti finalità:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Risposta alle richieste</strong> inviate tramite WhatsApp, contatto telefonico
              o modulo del sito, composizione del menù e organizzazione dell'occasione. Base
              giuridica: art. 6, par. 1, lett. b) GDPR — esecuzione di misure precontrattuali su
              richiesta dell'interessato.
            </li>
            <li>
              <strong>Conservazione per finalità amministrative e contabili</strong> e tutela dei
              diritti in sede giudiziaria. Base giuridica: art. 6, par. 1, lett. f) GDPR — legittimo
              interesse del Titolare.
            </li>
            <li>
              <strong>Adempimento di obblighi di legge</strong> (es. fiscali, antiriciclaggio). Base
              giuridica: art. 6, par. 1, lett. c) GDPR — obbligo legale.
            </li>
          </ul>
        </Section>

        <Section title="4. Conservazione dei dati">
          <p>
            I dati del modulo di contatto sono conservati per il tempo necessario a evadere la
            richiesta e, successivamente, per un periodo massimo di <strong>24 mesi</strong> ai fini
            di reportistica interna e di eventuale tutela in sede giudiziaria. I dati necessari per
            adempiere ad obblighi contabili e fiscali sono conservati per 10 anni dalla cessazione
            del rapporto, come previsto dalla normativa italiana. Trascorsi tali termini i dati sono
            cancellati o resi anonimi in modo permanente.
          </p>
        </Section>

        <Section title="5. Modalità del trattamento">
          <p>
            I dati sono trattati con strumenti elettronici e cartacei, da personale autorizzato del
            Titolare, con logiche strettamente correlate alle finalità indicate e adottando misure
            tecniche e organizzative adeguate a garantirne la sicurezza e la riservatezza (art. 32
            GDPR). Il sito è distribuito su Cloudflare con connessione HTTPS; l'accesso al database
            è limitato al personale autorizzato.
          </p>
        </Section>

        <Section title="6. Destinatari dei dati">
          <p>
            I dati possono essere comunicati ai seguenti soggetti esterni, in qualità di
            Responsabili del trattamento (art. 28 GDPR) o titolari autonomi per i servizi di
            messaggistica prescelti dall'utente:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Cloudflare Inc.</strong> — provider di hosting e CDN (sede: Stati Uniti,
              trasferimento basato su decisione di adeguatezza EU-US Data Privacy Framework).
            </li>
            <li>
              <strong>Supabase Inc.</strong> — gestione database delle richieste (sede: Stati Uniti,
              trasferimento basato su decisione di adeguatezza EU-US Data Privacy Framework).
            </li>
            <li>
              <strong>WhatsApp Ireland Limited</strong> — qualora l'utente scelga di inviare la
              propria richiesta tramite l'applicazione WhatsApp.
            </li>
          </ul>
          <p>
            L'elenco aggiornato dei Responsabili del trattamento è disponibile su richiesta presso
            la sede legale del Titolare o contattando il numero{" "}
            <a className="underline" href="tel:+393384834318">
              +39 338 483 4318
            </a>
            .
          </p>
        </Section>

        <Section title="7. Trasferimenti verso paesi terzi">
          <p>
            Alcuni dei fornitori tecnologici sopra indicati hanno sede negli Stati Uniti d'America.
            I trasferimenti avvengono sulla base delle decisioni di adeguatezza rilasciate dalla
            Commissione europea (EU-US Data Privacy Framework) ovvero, in subordine, tramite
            Clausole Contrattuali Standard e misure tecniche supplementari.
          </p>
        </Section>

        <Section title="8. Diritti dell'interessato">
          <p>
            In qualità di interessato, hai il diritto di accedere ai tuoi dati personali (art. 15
            GDPR), chiederne la rettifica (art. 16) o la cancellazione (art. 17), opporti al loro
            trattamento (art. 21), richiederne la limitazione (art. 18) o la portabilità (art. 20).
            Per esercitare questi diritti puoi contattare il Titolare presso la sede legale in Zona
            E n. 49, 70015 Noci (BA) oppure telefonicamente / via WhatsApp al numero{" "}
            <a className="underline" href="tel:+393384834318">
              +39 338 483 4318
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
