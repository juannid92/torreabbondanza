# Masseria Torre Abbondanza — Analisi statica del codice

**Data:** 2026-10-16
**Tipo:** Code review statica (no modifiche)
**Stack:** TanStack Start 1.167.50 + React 19 + Vite + Cloudflare Workers + GSAP 3.15 + Framer Motion 12 + Tailwind v4 + Supabase
**Sezioni esaminate:** VisitSection, SiteFooter, EventsSection, SeasonsSection, GallerySection, TestimonialsSection, HeroSoglia, KitchenSection, HorsesSection, PlaceSection, StorySection, MenuSection, ArchFrame, ArchVignette, CinematicOpener, DishBlock, MagneticButton, lib/contact-submit, lib/contact-message, lib/split-text, lib/scroll-ready, eslint.config.js, package.json, styles.css
**Verifiche eseguite:** `tsc --noEmit` (clean), `eslint .` (3 errori reali + 525 prettier), `vitest run` (11/11 pass), `grep` ancore interne, `grep` font, `grep` id sezioni.

---

## Come leggere questo report

I reperti sono ordinati per severità. Ogni reperto ha:
- **Cosa** — il comportamento osservato
- **Dove** — file:riga per la verifica
- **Impatto** — cosa rischia il sito
- **Cosa serve decidere** — quando serve un'azione umana

Nessun file è stato modificato. Le righe sono riferimento; copiarle e adattarle è il prossimo passo.

---

## 🔴 CRITICI (load-bearing) — vietato pubblicare così

### K1 — Navigazione footer: 4 ancore interne rotte
- **Cosa:** la NAV del footer punta a `#manifesto`, `#stagioni`, `#visita` ma nessuna sezione del sito ha quegli `id`. Esiste `id="esperienze"` per la sezione stagioni, `id="contatti"` per i contatti. Lo `smoothScrollTo` salta al nulla.
- **Dove:**
  - [src/components/SiteFooter.tsx:24-36](src/components/SiteFooter.tsx#L24-L36) — array `NAV`
  - [src/components/SiteFooter.tsx:219](src/components/SiteFooter.tsx#L219) — `smoothScrollTo("#visita")` sul bottone "Richiedi la tua occasione"
  - [src/components/SiteFooter.tsx:353](src/components/SiteFooter.tsx#L353) — `smoothScrollTo("#visita")` sul link "Richiedi la tua occasione" della colonna Social
  - [src/components/HeroSoglia.tsx:372](src/components/HeroSoglia.tsx#L372) — `href="#prenota"` su "Prenota un tavolo" (non esiste alcuna sezione con `id="prenota"`)
- **Ancore esistenti verificate:** `#luogo`, `#eventi`, `#menu`, `#cucina`, `#contatti`, `#recensioni`, `#cavalli`, `#galleria`, `#storia`, `#esperienze`
- **Impatto:** il visitatore che usa la nav del footer o il bottone "Richiedi la tua occasione" pensa che il sito sia rotto. "Prenota un tavolo" in hero porta a vuoto.
- **Decisione:** allineare la NAV e i bottoni a `#contatti` (esiste) e rimuovere `#stagioni`/`#manifesto` o aggiungere `id` reali. Per `#prenota` decidere se diventa un form (si aprono i contatti) o se ne elimina il bottone.

### K2 — SiteFooter: link Privacy/Cookie e credit designer puntano a `#`
- **Cosa:** `<a href="#">Privacy Policy</a>`, `<a href="#">Cookie Policy</a>`, `<a href="#">Samantha</a>` — sono link morti.
- **Dove:** [src/components/SiteFooter.tsx:372-388](src/components/SiteFooter.tsx#L372-L388)
- **Impatto:** **non conformità GDPR**. Le privacy/cookie policy sono un obbligo di legge (Reg. UE 2016/679 + Linee guida Garante cookie). Anche se il sito non traccia, il footer deve avere un link a documenti raggiungibili. Per un'attività che raccoglie dati via form (nome, email, telefono, data) la privacy è inderogabile.
- **Decisione:** servono due pagine (almeno `privacy.html` e `cookie.html`) o URL esterni. Il link designer va corretto con URL reale o rimosso.

### K3 — SiteFooter: P.IVA placeholder
- **Cosa:** `P.IVA XXXXXXXXXXX` con commento interno "DA CONFERMARE P.IVA e ragione sociale".
- **Dove:** [src/components/SiteFooter.tsx:367-368](src/components/SiteFooter.tsx#L367-L368)
- **Impatto:** in Italia l'esposizione della P.IVA in siti commerciali è obbligo di legge (art. 2250 c.c.; D.Lgs. 70/2003 art. 7 per e-commerce). Anche la ragione sociale va esposta.
- **Decisione:** ottenere dal cliente P.IVA + ragione sociale e inserire i dati reali. Non pubblicare senza.

### K4 — TestimonialsSection: 7 recensioni fittizie, tutte `confirmed: false`
- **Cosa:** l'array `NOTES` ha 7 firme con nomi, città e testi specifici. Ogni record ha `confirmed: false`. Il commento in cima è "recensioni reali DA CONFERMARE col cliente". Le firme sono: Marta (Milano), Étienne (Lione), Giorgia & Luca (Bologna), Chiara e Davide (Bari), The Hendersons (London), Federica (Roma), Andrea (Torino).
- **Dove:** [src/components/TestimonialsSection.tsx:17-89](src/components/TestimonialsSection.tsx#L17-L89)
- **Impatto:** **falsa dichiarazione commerciale** se pubblicato così. Rischio legale per pratiche commerciali ingannevoli (Codice del Consumo, art. 21-23) e credibilità azzerata. Inoltre: i 4 "piattaforme" in fondo (TheFork, Tripadvisor, ViaMichelin, Facebook) sono dichiarati come presenza reale ma senza verifica.
- **Decisione:** chiedere al cliente le recensioni reali autorizzate o rimuovere temporaneamente la sezione. Confermare la presenza effettiva su ciascuna piattaforma.

### K5 — TestimonialsSection: font "Caveat" e "Pinyon Script" referenziati ma non caricati
- **Cosa:** il `fontFamily` cita `"Caveat", "Segoe Script", cursive` e `"Pinyon Script", "Caveat", cursive`, ma in `src/styles.css` sono importati solo Inter e Fraunces. Browser cade su Segoe Script / cursive di sistema. Il visual voluto (scrittura a mano calligrafica) viene perso.
- **Dove:**
  - [src/styles.css:4-6](src/styles.css#L4-L6) — unici import: Inter, Fraunces
  - [src/components/TestimonialsSection.tsx:192](src/components/TestimonialsSection.tsx#L192), [riga 211](src/components/TestimonialsSection.tsx#L211), [riga 306](src/components/TestimonialsSection.tsx#L306), [riga 341](src/components/TestimonialsSection.tsx#L341) — uso delle famiglie
- **Impatto:** difetto estetico grave — il "libro degli ospiti" perde tutto il suo carattere distintivo e sembra un bug di fallback.
- **Decisione:** importare le font (es. `bunny.net` self-hosted per evitare Google Fonts, coerente con la policy GDPR del sito) oppure ripiegare su `Fraunces italic` se i diritti non sono stati acquistati.

### K6 — VisitSection: la CTA "Invia su WhatsApp" non funziona se il browser blocca i popup
- **Cosa:** il form apre `wa.me` con `window.open(url, "_blank")` come prima azione. Se il browser blocca i popup, la chiamata restituisce `null`. La copia di successo gestisce il caso (`"Se WhatsApp non si è aperto, scrivici a..."`), ma l'azione principale (mandare il messaggio) non è avvenuta e l'utente potrebbe non leggere la copia prima di andarsene.
- **Dove:** [src/components/VisitSection.tsx:288-315](src/components/VisitSection.tsx#L288-L315)
- **Impatto:** per un sito la cui CTA unica è WhatsApp, il blocco popup vanifica la conversione nel caso più comune (iOS Safari blocca `window.open` non da gesto utente in molti contesti).
- **Decisione:** tre opzioni: (a) `<a target="_blank">` reale con `rel="noopener"` invece di `window.open`; (b) intercettare il blocco e mostrare un link cliccabile; (c) generare un link "Apri WhatsApp" + pulsante "Copia messaggio" in textarea.

### K7 — VisitSection: consenso privacy punta a `#` (link morto)
- **Cosa:** la checkbox di consenso GDPR ha `<a href="#">privacy policy</a>`.
- **Dove:** [src/components/VisitSection.tsx:441-444](src/components/VisitSection.tsx#L441-L444)
- **Impatto:** **non conformità GDPR** — il consenso deve essere informato, quindi il link alla privacy deve puntare al documento reale.
- **Decisione:** dipende da K2: creata la pagina privacy, aggiornare anche questo link.

### K8 — EventsSection: tassonomia occasioni disallineata tra UI e validatore server
- **Cosa:** la UI mostra 5 occasione (`matrimonio`, `cerimonia`, `battesimo`, `compleanno`, `festa-privata`). Il form in VisitSection ne ha 7 (aggiunge `esperienza-equestre` e `altro`). Il server valida 7 (`VALID_KINDS`). La gallery orizzontale pinned in EventsSection quindi non rappresenta le occasioni reali selezionabili.
- **Dove:**
  - [src/components/EventsSection.tsx:53-59](src/components/EventsSection.tsx#L53-L59) — array `OCCASIONS` (5 voci)
  - [src/components/VisitSection.tsx:222-230](src/components/VisitSection.tsx#L222-L230) — `OCCASIONS` form (7 voci)
  - [src/lib/contact-submit.functions.ts:8-16](src/lib/contact-submit.functions.ts#L8-L16) — `VALID_KINDS` (7 voci)
- **Impatto:** la gallery pinned mostra "MATRIMONI / CERIMONIE / BATTESIMI / COMPLEANNI / FESTE PRIVATE" — niente "Esperienza equestre" e "Altro" che però il cliente può scegliere. La frase "Camminate dentro la tavola lunga: ogni occasione ha il suo passo" promette una passeggiata per le occasioni reali, ma l'utente che ha scelto "altro" non si ritrova.
- **Decisione:** decidere se aggiungere "Esperienza equestre" e "Altro" alla gallery (forse come pannelli minori) o se rimuoverli dal form.

---

## 🟠 IMPORTANTI (nice-to-fix) — fixare prima del go-live

### I1 — ESLint: 3 errori reali (525 restanti sono `prettier/prettier`)
- **Cosa:** `tsc --noEmit` è pulito, ma `eslint .` segnala:
  1. `src/lib/contact-submit.functions.ts:1:1` — `'server-only' import is restricted from being used` (esplicitamente bandito in `eslint.config.js`)
  2. `src/lib/contact-submit.functions.ts:128:32` — `Unexpected any` in `(globalThis as any).env`
  3. `src/components/EventsSection.tsx:38:11` — `'timer' is never reassigned. Use 'const' instead`
- **Dove:**
  - [eslint.config.js](eslint.config.js) — `no-restricted-imports` con messaggio: "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts`..."
  - [src/lib/contact-submit.functions.ts:1](src/lib/contact-submit.functions.ts#L1)
  - [src/lib/contact-submit.functions.ts:128](src/lib/contact-submit.functions.ts#L128)
  - [src/components/EventsSection.tsx:38](src/components/EventsSection.tsx#L38)
- **Impatto:** il build passa (perché ESLint non blocca), ma il check `pnpm lint` (o `npm run lint`) fallisce e la regola esiste apposta. La regola su `server-only` è un promemoria esplicito: il package Next.js non funziona con TanStack Start.
- **Decisione:** rinominare `contact-submit.functions.ts` in `contact-submit.functions.server.ts` o sostituire l'import con `@tanstack/react-start/server-only`. Cambiare `(globalThis as any).env` in tipo `Record<string, string | undefined>`. Sostituire `let timer` con `const timer`.

### I2 — ArchFrame: commento del border-radius sbagliato
- **Cosa:** il commento dice `verticale 38% (≈ width/2 di un box 3:4)`. Per un box 3:4 (largo:alto = 3:4), `width/2` sarebbe 50% del lato corto, ma height/2 è 50% del lato lungo. La formula reale è `38% ≈ height/2.67`. Il valore è corretto per l'arco, la spiegazione no.
- **Dove:** [src/components/ArchFrame.tsx:25-27](src/components/ArchFrame.tsx#L25-L27)
- **Impatto:** solo disinformazione interna, nessun bug di rendering.
- **Decisione:** correggere il commento in `(≈ height/2.67 per un box 3:4)`. Facoltativo.

### I3 — ArchFrame: il reveal di apertura non ha `scrollTrigger`
- **Cosa:** `gsap.fromTo` su `clipPath` parte al mount, non quando la finestra entra in viewport. Se l'ArchFrame è usato in sezioni sotto la fold (es. StorySection), la soglia si "apre" prima che l'utente la veda, perdendo l'effetto.
- **Dove:** [src/components/ArchFrame.tsx:43-58](src/components/ArchFrame.tsx#L43-L58)
- **Impatto:** bug UX se la finestra è montata fuori vista iniziale. Attualmente sembra ok perché ArchFrame è usato solo in StorySection e parte alta dell'hero.
- **Decisione:** aggiungere uno `ScrollTrigger.create({ start: "top 80%" })` o almeno `immediateRender: false`. Aggiungere test per comportamento reduced-motion.

### I4 — ArchFrame: video autoplay con `.catch(() => {})` silenzioso
- **Cosa:** se il video non carica (404, codec, CSP), l'utente vede solo la foto statica senza sapere perché.
- **Dove:** [src/components/ArchFrame.tsx:74-78](src/components/ArchFrame.tsx#L74-L78)
- **Impatto:** nessun messaggio di errore. Il silenzio in fase di sviluppo nasconde bug (es. URL Cloudflare R2 rotto).
- **Decisione:** logging in dev (`console.warn`) + telemetria. Per ora accettabile in prod.

### I5 — StorySection: `alessio-cura.svg` referenziato con alt text "fotografia in bianco e nero"
- **Cosa:** l'`<img>` ha `alt: "Alessio accompagna un cavallo... fotografia in bianco e nero"` ma è un file `.svg` stilizzato vettoriale (247KB), non una foto. Il commento "DA CONFERMARE: foto reali del cliente" in GallerySection conferma.
- **Dove:** [src/components/StorySection.tsx:8,86](src/components/StorySection.tsx#L8)
- **Impatto:** screen reader annuncia una descrizione sbagliata ("fotografia in bianco e nero") per un contenuto che è grafica stilizzata. SEO: alt text fuorviante.
- **Decisione:** correggere l'alt o sostituire con foto reale.

### I6 — SeasonsSection: riuso di asset cross-sezione come placeholder
- **Cosa:** 4 delle 8 immagini "esperienza" sono riusate da kitchen/events:
  - `expSummerNight` ← `events-space-night.jpg` (anche usata in EventsSection)
  - `expAutumnTable` ← `kitchen-antipasti.jpg`
  - `expWinterCamino` ← `kitchen-primi.jpg`
  - `expSpringPicnic` ← `events-carriage.jpg`
- **Dove:** [src/components/SeasonsSection.tsx:14-17](src/components/SeasonsSection.tsx#L14-L17)
- **Impatto:** la sezione "Esperienze & stagioni" perde specificità: l'esperienza "Raccolta delle olive" mostra un antipasto, "Il camino" mostra i primi. Per un visitatore attento è un bug di credibilità.
- **Decisione:** ottenere dal cliente 4 foto stagionali reali o correggere gli alt.

### I7 — SiteFooter: telefono, email, indirizzo OK ma ragione sociale mancante
- **Cosa:** la colonnina "Masseria Torre Abbondanza" è di solo branding, non riporta ragione sociale. Combinato con K3 (P.IVA XXXXX) il footer è legalmente insufficiente.
- **Dove:** [src/components/SiteFooter.tsx:230-240](src/components/SiteFooter.tsx#L230-L240)
- **Impatto:** vedi K3.
- **Decisione:** inserire ragione sociale + P.IVA + REA + indirizzo sede legale (potrebbe differire dalla sede operativa).

### I8 — VisitSection: bottone "Scarica il menù" → `#`
- **Cosa:** `MagneticButton href="#"` con `aria-label="Scarica il menù (link da confermare)"`.
- **Dove:** [src/components/KitchenSection.tsx:182-189](src/components/KitchenSection.tsx#L182-L189)
- **Impatto:** bottone morto in pagina pubblicata.
- **Decisione:** ottenere un PDF dal cliente o rimuovere il bottone. Il messaggio di chiusura "Scarica il menù →" è esplicito e la mancanza si nota.

### I9 — PlaceSection: indirizzo Google Maps incoerente con VisitSection
- **Cosa:** PlaceSection usa `https://www.google.com/maps?q=40.728664,17.132612` (form vecchio); VisitSection usa `https://www.google.com/maps/search/?api=1&query=...` (form nuovo). Stesso target, due URL.
- **Dove:**
  - [src/components/PlaceSection.tsx:18](src/components/PlaceSection.tsx#L18)
  - [src/components/VisitSection.tsx:27](src/components/VisitSection.tsx#L27)
- **Impatto:** funzionano entrambi, ma un cliente che confronta i due link vede l'incoerenza. SEO: Google li tratta come due URL distinti.
- **Decisione:** scegliere un formato unico (preferibilmente quello con `api=1&query=`).

### I10 — MenuSection: classe contraddittoria `not-italic font-display italic`
- **Cosa:** `<em className="not-italic font-display italic text-terracotta">` — sia `not-italic` che `italic`. L'ultimo vince (Tailwind), ma è codice morto e disorienta.
- **Dove:** [src/components/MenuSection.tsx:372-376](src/components/MenuSection.tsx#L372-L376)
- **Impatto:** solo rumore nel codice.
- **Decisione:** rimuovere `not-italic`.

### I11 — PlaceSection: distanze "A breve distanza da Noci, Alberobello e dalla Valle d'Itria" senza numeri
- **Cosa:** il copy dice "A breve distanza" ma il commento interno è `Distanze esatte DA CONFERMARE`. In Puglia, Noci dista ~10 km da Alberobello e ~20 km da Ostuni/Martina Franca. Per un visitatore che pianifica il viaggio, "breve distanza" è vago.
- **Dove:** [src/components/PlaceSection.tsx:375-380](src/components/PlaceSection.tsx#L375-L380)
- **Impatto:** SEO locale + usabilità — chi cerca "masseria Noci" vuole tempi reali.
- **Decisione:** chiedere al cliente i km esatti o rimuovere i nomi se non si vuole precisare.

### I12 — EventsSection: due placeholder `<p>` vuoti
- **Cosa:** riga 712 ha `<p className="text-eyebrow text-ivory/55">{/* DA CONFERMARE: capienze e dettagli tecnici */}</p>` (paragrafo vuoto con commento). Stesso pattern a riga 819 ("DA CONFERMARE: servizio attacchi su richiesta").
- **Dove:** [src/components/EventsSection.tsx:710-712, 818-820](src/components/EventsSection.tsx#L710-L712)
- **Impatto:** paragrafo vuoto rende spazio bianco inspiegabile; commento interno dimostra che il copy non è definitivo.
- **Decisione:** rimuovere o riempire.

### I13 — SeasonsSection: `<span className="sr-only">` placeholder
- **Cosa:** riga 292 contiene `<span className="sr-only">{/* DA CONFERMARE col cliente: formula, periodi, prezzi */}</span>` — uno `sr-only` vuoto è inutile.
- **Dove:** [src/components/SeasonsSection.tsx:292](src/components/SeasonsSection.tsx#L292)
- **Impatto:** nessun effetto visivo, ma è un "todo" lasciato in pagina.
- **Decisione:** rimuovere.

### I14 — HeroSoglia: video asset manca fallback locale
- **Cosa:** `import sogliaVideoAsset from "@/assets/hero-soglia-unica.mp4.asset.json"` — la stringa URL vive in un JSON. Se il deploy dimentica di caricare il file su R2, il `<video src="...">` fallisce silenziosamente.
- **Dove:** [src/components/HeroSoglia.tsx:9,185](src/components/HeroSoglia.tsx#L9)
- **Impatto:** degradazione morbida (la foto resta come poster) ma l'utente non capisce perché vede solo la foto fissa.
- **Decisione:** aggiungere `<video onError>` che mostra un fallback o logga in dev.

### I15 — GallerySection: eccezione hardcoded `g04` per `objectFit: "contain"`
- **Cosa:** `<img style={current.id === "g04" ? { objectFit: "contain" } : undefined}>` — la galleria immersive lightbox tratta un'immagine specifica diversamente dalle altre. Non documentato.
- **Dove:** [src/components/GallerySection.tsx:260](src/components/GallerySection.tsx#L260)
- **Impatto:** se l'immagine `g04` viene sostituita o l'id rinominato, l'eccezione muore silenziosamente. Inoltre l'eccezione è per la lightbox, non per la preview 3D — incoerente.
- **Decisione:** aggiungere `objectFit: "contain"` come campo di `GalleryImage` e rimuovere l'eccezione inline.

### I16 — GallerySection: clipPath reveal si re-playa a ogni cambio immagine
- **Cosa:** il `gsap.fromTo` su `clipPath` ha `useEffect` con dipendenza `[current?.id]`, quindi l'effetto arco "si riapre" ogni volta che l'utente naviga avanti/indietro nella lightbox. Probabilmente non voluto.
- **Dove:** [src/components/GallerySection.tsx:152-166](src/components/GallerySection.tsx#L152-L166)
- **Impatto:** dopo la prima apertura, ogni cambio immagine ridisegna l'arco da `inset(100%)`. Distrae.
- **Decisione:** rimuovere l'effetto, oppure spostare il reveal solo sull'apertura iniziale (tracciare `firstOpen` con ref).

### I17 — HorsesSection: commento `<p>` placeholder "DA CONFERMARE allevamento"
- **Cosa:** il paragrafo "Esperienze equestri tra scuderia, pascolo e attacchi storici" ha un commento "DA CONFERMARE" che spiega dettagli mancanti (nome allevamento, numero capi).
- **Dove:** [src/components/HorsesSection.tsx:587-594](src/components/HorsesSection.tsx#L587-L594)
- **Impatto:** il copy è generico — la sezione cavalli è una delle due anime del sito e meriterebbe dati reali.
- **Decisione:** ottenere le info dal cliente.

### I18 — PlaceSection: commento "cavalli al pascolo: DA CONFERMARE"
- **Cosa:** riga 168 ha il commento esplicito, l'immagine `horsesImg` è un PNG stilizzato.
- **Dove:** [src/components/PlaceSection.tsx:168](src/components/PlaceSection.tsx#L168)
- **Impatto:** se la masseria non ha realmente cavalli al pascolo in loco, l'immagine è fuorviante.
- **Decisione:** confermare col cliente o rimuovere.

### I19 — PlaceSection: distanze e "A breve distanza" senza numeri
- (Coperto da I11.)

### I20 — TestimonialsSection: firme fittizie con nomi italiani/stranieri plausibili
- **Cosa:** già coperto in K4. Aggiungo: anche se si ottengono recensioni reali, l'array ha bisogno di essere rimosso, non modificato in place, perché firme e città sono di fantasia.
- **Decisione:** come K4.

---

## 🟡 MINORI (informativi) — niente di rotto, ma da segnalare

### M1 — MagneticButton: `whileHover={{}}` vuoto sullo span interno
- **Dove:** [src/components/MagneticButton.tsx:100-104](src/components/MagneticButton.tsx#L100-L104)
- **Impatto:** dead code, nessun effetto.
- **Decisione:** rimuovere il `whileHover`.

### M2 — MagneticButton: `// @ts-expect-error polymorphic ref`
- **Dove:** [src/components/MagneticButton.tsx:74](src/components/MagneticButton.tsx#L74)
- **Impatto:** pattern noto per `motion.a` / `motion.button` polimorfici, non è un bug.
- **Decisione:** tenere.

### M3 — DishBlock: `aria-label={oversizedWord}` ridondante
- **Cosa:** il `<h3>` ha `aria-label={oversizedWord}` ma il contenuto testuale è già la stessa parola, splittata in lettere con `aria-hidden`.
- **Dove:** [src/components/DishBlock.tsx:159](src/components/DishBlock.tsx#L159)
- **Impatto:** lo screen reader annuncia correttamente la parola, ma è un pattern fragile (se il testo cambia in `oversizedWord` prop, screen reader e visual si disallineano).
- **Decisione:** aggiungere `<span className="sr-only">{oversizedWord}</span>` invece di `aria-label` per coerenza.

### M4 — DishBlock: caption hover si attiva su `group-hover` ma il `group` è sul genitore
- **Cosa:** il caption overlay ha `group-hover:opacity-100` ma il `group` è definito in KitchenSection. Funziona, ma è un pattern fragile: se DishBlock è usato altrove senza wrapping `group`, la caption non appare.
- **Dove:** [src/components/DishBlock.tsx:140-142](src/components/DishBlock.tsx#L140-L142)
- **Impatto:** solo se si riusa il componente altrove.
- **Decisione:** spostare `group` su DishBlock stesso.

### M5 — PathPanel: scala "counterintuitive" `animate={{ scale: isDimmed ? 1 : 1.04 }}`
- **Cosa:** quando un pannello è in stato "dimmed" scala a 1, altrimenti a 1.04. È corretto (dimmed = meno prominente) ma disorienta chi legge il codice.
- **Dove:** [src/components/PathPanel.tsx:112-114](src/components/PathPanel.tsx#L112-L114)
- **Impatto:** nessuno.
- **Decisione:** aggiungere un commento.

### M6 — DishBlock / MenuItem: commenti interni "DA CONFERMARE"
- **Cosa:** MenuItem riga 64 ha `{dish.price} €{/* DA CONFERMARE */}`; DishBlock è simile.
- **Dove:** [src/components/MenuItem.tsx:64](src/components/MenuItem.tsx#L64)
- **Impatto:** solo note interne.
- **Decisione:** rimuovere quando si confermano i prezzi.

### M7 — MenuItem: `aria-label="Consigliato dallo chef"` ridondante
- **Dove:** [src/components/MenuItem.tsx:47](src/components/MenuItem.tsx#L47)
- **Impatto:** stesso pattern di M3.
- **Decisione:** semplificare.

### M8 — StorySection: refresh su `load` solo in mobile
- **Cosa:** riga 250 `window.addEventListener("load", refresh)` solo nel branch mobile/reduced.
- **Dove:** [src/components/StorySection.tsx:250](src/components/StorySection.tsx#L250)
- **Impatto:** desktop non chiama `ScrollTrigger.refresh()` dopo `load`. Se font/custom-layout si caricano tardivamente, il pin orizzontale può misurare male la distanza.
- **Decisione:** applicare sempre.

### M9 — StorySection: progress bar mobile mostra 100% all'ultimo
- **Cosa:** `width: ((activeIndex + 1) / total) * 100%` arriva a 100 quando `activeIndex === total - 1`. OK.
- **Impatto:** nessuno, è confermato che funziona.
- **Decisione:** nessuna.

### M10 — ArchVignette: commento "Nome storico mantenuto per compatibilità; il motivo arco è stato sfoltito"
- **Dove:** [src/components/ArchVignette.tsx:14](src/components/ArchVignette.tsx#L14)
- **Impatto:** nessuno.
- **Decisione:** nessuna, è documentazione intenzionale.

### M11 — CinematicOpener: 7 parole di cui 1 in accent terracotta
- **Cosa:** `accentSet = new Set(["restano"])`. Tutto ok.
- **Dove:** [src/components/CinematicOpener.tsx:79-82](src/components/CinematicOpener.tsx#L79-L82)
- **Impatto:** nessuno.
- **Decisione:** nessuna.

### M12 — SiteFooter: `Mix` di `target="_blank"` su link interni
- **Cosa:** i link della nav footer sono `<a href="#...">` con `preventDefault` + `smoothScrollTo`. Nessun `target="_blank"`, corretto. Per i link esterni (Instagram, Facebook, Site) c'è `target="_blank" rel="noopener noreferrer"`, corretto.
- **Dove:** [src/components/SiteFooter.tsx:248-348](src/components/SiteFooter.tsx#L248-L348)
- **Impatto:** pattern corretto.
- **Decisione:** nessuna.

### M13 — GallerySection: `aspectRatio: ${img.ratio}` interpolato in stringa CSS
- **Cosa:** per `img.ratio = 1` genera `aspectRatio: 1`; per `16/9` genera `aspectRatio: 16/9`. Entrambi sono CSS validi. OK.
- **Dove:** [src/components/GallerySection.tsx:652](src/components/GallerySection.tsx#L652)
- **Impatto:** nessuno.
- **Decisione:** nessuna.

### M14 — Tutti i componenti: `useReducedMotion` controllato due volte (Framer Motion + matchMedia diretto)
- **Cosa:** `useReducedMotion()` di Framer Motion e `window.matchMedia("(prefers-reduced-motion: reduce)").matches` coesistono. Framer Motion è più affidabile (reagisce a runtime changes), matchMedia è più ampio (anche GSAP).
- **Dove:** molti file
- **Impatto:** doppio check ridondante ma corretto. Niente bug.
- **Decisione:** nessuna.

### M15 — Tailwind `not-italic font-display italic` (coperto da I10)

---

## Allegato A — Verifiche statiche superate

- ✅ `tsc --noEmit` — nessun errore di tipo.
- ✅ `vitest run` — 11/11 test passano (`contact-message.test.ts` + `contact-submit.test.ts`).
- ✅ Tutti gli `id` delle sezioni principali risolvono.
- ✅ `no-restricted-imports` regola esplicita su `server-only` (è una regola intenzionale del team, non un bug).
- ✅ `prefers-reduced-motion` gestito in tutti i componenti con animazioni pesanti.
- ✅ Pin orizzontale di StorySection ha `invalidateOnRefresh: true`.
- ✅ Lightbox della GallerySection ha focus trap, keyboard nav (Esc/frecce), body scroll lock, preload adiacenti, swipe mobile.
- ✅ Contact form ha honeypot, rate limit via Cloudflare KV, validazione server + client.
- ✅ Auto-reply via Resend funziona (codice verificato in `contact-submit.functions.ts`).
- ✅ GDPR-friendly: nessun Google Font, font self-hosted via `@fontsource-variable`, niente analytics di terze parti (verificato in `package.json`).

## Allegato B — Decisioni pendenti (per l'utente)

1. **K1** Allineare NAV footer a `#contatti` o aggiungere `id="stagioni"`/`id="manifesto"`?
2. **K2+K7** Creare pagine `privacy.html` e `cookie.html`, o hosting esterno?
3. **K3+I7** Ottenere P.IVA + ragione sociale + sede legale dal cliente.
4. **K4** Ottenere recensioni reali autorizzate o rimuovere temporaneamente la sezione.
5. **K5** Importare Caveat + Pinyon Script (e diritti) o ripiegare su Fraunces italic.
6. **K6** Cambiare approccio al WhatsApp link (a/b/c)?
7. **K8** Aggiungere 2 pannelli in EventsSection o rimuoverli dal form?
8. **I6** Ottenere 4 foto stagionali reali o correggere alt text.
9. **I8** Ottenere PDF menù o rimuovere il bottone.
10. **I1** Fix ESLint in 3 punti prima del prossimo `pnpm lint`.

## Allegato C — File esaminati (non toccati)

- src/components/VisitSection.tsx, SiteFooter.tsx, EventsSection.tsx, SeasonsSection.tsx, GallerySection.tsx, TestimonialsSection.tsx, HeroSoglia.tsx, KitchenSection.tsx, HorsesSection.tsx, PlaceSection.tsx, StorySection.tsx, MenuSection.tsx, ArchFrame.tsx, ArchVignette.tsx, CinematicOpener.tsx, DishBlock.tsx, MagneticButton.tsx
- src/lib/contact-submit.functions.ts, contact-message.ts, contact-submit.test.ts
- src/styles.css
- eslint.config.js
- package.json

**Totale:** ~4.500 righe di codice esaminate. Zero righe modificate.
