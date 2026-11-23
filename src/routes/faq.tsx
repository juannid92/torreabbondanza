import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useLenis } from "@/hooks/use-lenis";
import { SITE_URL, BUSINESS, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/site";
import { buildHreflangLinks } from "@/lib/hreflang";
import heroMasseria from "@/assets/hero-masseria.jpg";

const FAQ_ITEMS = [
  {
    q: "Come funziona la prenotazione del ristorante?",
    a: "La cucina apre su prenotazione per gruppi di almeno 20 persone con almeno due giorni di anticipo. Il menù viene composto insieme, su misura della tradizione pugliese, a partire da 50 euro a persona.",
  },
  {
    q: "È possibile organizzare matrimoni o cerimonie in masseria?",
    a: "Sì. La masseria del Settecento ospita matrimoni, cerimonie civili e simboliche, battesimi, compleanni, feste private e cene aziendali sia nella sala storica con volte in pietra sia nella corte esterna tra gli ulivi secolari.",
  },
  {
    q: "Sono disponibili menù vegetariani, vegani o senza glutine?",
    a: "Sì, su richiesta vengono preparate proposte dedicate vegetariane, vegane, gluten-free e menù per bambini in linea con le esigenze degli ospiti.",
  },
  {
    q: "La masseria alleva e vende cavalli Murgesi?",
    a: "Sì. La famiglia Giunta alleva cavalli Murgesi iscritti al Registro Anagrafico (suffisso T.A.), organizza esperienze equestri, Sfilate di Attacchi d'Epoca ed effettua vendita con spedizione internazionale in Europa, Russia e Cina.",
  },
  {
    q: "È possibile arrivare in carrozza d'epoca durante una cerimonia?",
    a: "Sì, su richiesta l'ingresso della cerimonia può aprirsi con una carrozza d'epoca trainata dai cavalli Murgesi dell'allevamento della masseria.",
  },
  {
    q: "Dove si trova esattamente la masseria?",
    a: `Si trova in ${BUSINESS.address.line1}, ${BUSINESS.address.line2}, nel cuore della Murgia dei Trulli e della Valle d'Itria, a circa 12 minuti da Putignano e Alberobello.`,
  },
  {
    q: "C'è parcheggio disponibile?",
    a: "Sì, ampio parcheggio gratuito all'interno della proprietà, accessibile direttamente dalla strada vicinale. Spazi riservati per ospiti con mobilità ridotta.",
  },
  {
    q: "Qual è la capacità massima per eventi?",
    a: "La masseria può ospitare fino a 250 persone tra sala storica e corte esterna, con allestimenti personalizzabili in base al tipo di evento.",
  },
  {
    q: "Come posso richiedere un preventivo?",
    a: `Contattaci tramite WhatsApp al numero ${BUSINESS.phone} oppure compila il modulo di contatto nella pagina Eventi. Rispondiamo entro 24 ore.`,
  },
  {
    q: "I cavalli Murgesi possono essere esportati all'estero?",
    a: "Sì. Gestiamo tutta la documentazione per l'export: passaporto UE, certificati sanitari, CITES per paesi extra-UE, trasporto terrestre e aereo. Serviamo Europa, Russia/CIS e Cina/Asia.",
  },
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/faq#faqpage`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Domande Frequenti", path: "/faq" },
    ]),
  ],
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Domande Frequenti — Masseria Torre Abbondanza | FAQ" },
      {
        name: "description",
        content:
          "Risposte alle domande più frequenti su prenotazioni, eventi, matrimoni, cucina, cavalli Murgesi e come raggiungere la Masseria Torre Abbondanza a Noci (BA).",
      },
      {
        name: "keywords",
        content:
          "faq masseria torre abbondanza, domande frequenti masseria noci, prenotazione ristorante masseria, capienza matrimoni masseria puglia, export cavalli murgesi info",
      },
      { property: "og:title", content: "Domande Frequenti — Masseria Torre Abbondanza" },
      {
        property: "og:description",
        content:
          "Tutto quello che devi sapere su prenotazioni, eventi, cavalli Murgesi e come raggiungerci.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/faq` },
      { property: "og:image", content: absoluteUrl(heroMasseria) },
      { property: "og:image:alt", content: "Masseria Torre Abbondanza a Noci — Domande Frequenti" },
      { name: "twitter:title", content: "Domande Frequenti — Masseria Torre Abbondanza" },
      {
        name: "twitter:description",
        content:
          "Tutto quello che devi sapere su prenotazioni, eventi, cavalli Murgesi e come raggiungerci.",
      },
      { name: "twitter:image", content: absoluteUrl(heroMasseria) },
    ],
    links: buildHreflangLinks("/faq"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema) }],
  }),
  component: Faq,
});

function Faq() {
  useLenis();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 py-20 md:px-12 md:py-28">
        <span className="text-eyebrow text-terracotta">Informazioni utili</span>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
          Domande frequenti
        </h1>
        <p className="mt-6 font-display text-lg leading-relaxed text-ink/70 md:text-xl">
          Tutto quello che devi sapere sulla Masseria Torre Abbondanza: prenotazioni, eventi,
          cucina, cavalli e come raggiungerci.
        </p>

        <div className="mt-12 space-y-0 divide-y divide-ink/10">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 flex-shrink-0 text-terracotta transition-transform duration-300 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-4 font-display text-base leading-relaxed text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-stone-100 p-8 text-center">
          <h2 className="font-display text-xl font-medium text-ink">
            Non hai trovato la risposta?
          </h2>
          <p className="mt-3 font-display text-ink/70">
            Scrivici direttamente: rispondiamo entro 24 ore.
          </p>
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-terracotta"
          >
            Contattaci su WhatsApp
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
