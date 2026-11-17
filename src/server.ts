import "./lib/error-capture";

import llmsFullTxt from "../public/llms-full.txt?raw";
import llmsTxt from "../public/llms.txt?raw";
import robotsTxt from "../public/robots.txt?raw";
import sitemapXml from "../public/sitemap.xml?raw";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type StaticSeoEntry = {
  body: string;
  contentType: string;
};

const STATIC_SEO_FILES: Record<string, StaticSeoEntry> = {
  "/sitemap.xml": {
    body: sitemapXml,
    contentType: "application/xml; charset=utf-8",
  },
  "/sitemap_index.xml": {
    body: sitemapXml,
    contentType: "application/xml; charset=utf-8",
  },
  "/robots.txt": {
    body: robotsTxt,
    contentType: "text/plain; charset=utf-8",
  },
  "/llms.txt": {
    body: llmsTxt,
    contentType: "text/plain; charset=utf-8",
  },
  "/llms-full.txt": {
    body: llmsFullTxt,
    contentType: "text/plain; charset=utf-8",
  },
};

function matchStaticSeoResponse(request: Request): Response | undefined {
  if (request.method !== "GET" && request.method !== "HEAD") return undefined;
  let pathname: string;
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    return undefined;
  }
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  if (!Object.hasOwn(STATIC_SEO_FILES, pathname)) return undefined;
  const entry = STATIC_SEO_FILES[pathname];
  return new Response(request.method === "HEAD" ? null : entry.body, {
    status: 200,
    headers: {
      "content-type": entry.contentType,
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const seoResponse = matchStaticSeoResponse(request);
    if (seoResponse) return seoResponse;

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
