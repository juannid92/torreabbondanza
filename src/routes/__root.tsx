import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

// Side-effect: inizializza i18n all'avvio dell'app
import "@/lib/i18n";

import appCss from "../styles.css?url";
import ogImage from "../assets/hero-masseria.jpg";
import { BUSINESS, GOOGLE_TAG_ID, SITE_URL, absoluteUrl } from "../lib/site";
import { CookieBanner } from "../components/CookieBanner";
import { GoogleTag } from "../components/GoogleTag";

const PAGE_TITLE = `${BUSINESS.name} — Noci, Puglia`;
const OG_IMAGE = absoluteUrl(ogImage);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  // Errore di rendering lato root: log in console, lasciamo che l'utente ricarichi.
  console.error("[root-error]", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Questa pagina non si è caricata
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Si è verificato un problema. Puoi riprovare o tornare alla home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Riprova
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Torna alla home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: PAGE_TITLE },
      { name: "description", content: BUSINESS.description },
      { name: "author", content: BUSINESS.name },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "geo.region", content: "IT-BA" },
      { name: "geo.placename", content: "Noci (BA), Puglia" },
      { name: "geo.position", content: `${BUSINESS.geo.lat};${BUSINESS.geo.lon}` },
      { name: "ICBM", content: `${BUSINESS.geo.lat}, ${BUSINESS.geo.lon}` },
      { name: "theme-color", content: "#15110F" },

      { property: "og:type", content: "website" },
      { property: "og:site_name", content: BUSINESS.name },
      { property: "og:locale", content: "it_IT" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: BUSINESS.description },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: `${BUSINESS.name}, Noci (BA)` },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: BUSINESS.description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    // I font sono self-hosted e importati in styles.css: nessuna richiesta
    // verso fonts.googleapis.com, quindi nessun trasferimento di IP a Google.
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "LLMs.txt" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const GTM_INIT_SCRIPT = `(function(){window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{var raw=localStorage.getItem('torreabbondanza.cookieConsent');if(raw){var parsed=JSON.parse(raw);if(parsed&&parsed.version===1&&parsed.categories){gtag('consent','update',{analytics_storage:parsed.categories.analytics?'granted':'denied',ad_storage:parsed.categories.marketing?'granted':'denied',ad_user_data:parsed.categories.marketing?'granted':'denied',ad_personalization:parsed.categories.marketing?'granted':'denied'});}}}catch(e){}gtag('js',new Date());window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});})();`;

function RootShell({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || "it";

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: GTM_INIT_SCRIPT }} />
        <script
          async
          src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GOOGLE_TAG_ID)}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion:reduce)").matches&&sessionStorage.getItem("torreabbondanza.introSeen")!=="1"){document.documentElement.classList.add("intro-pending");setTimeout(function(){document.documentElement.classList.remove("intro-pending")},3500);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(GOOGLE_TAG_ID)}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
        >
          Vai al contenuto principale
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <GoogleTag />
      <CookieBanner />
    </QueryClientProvider>
  );
}
