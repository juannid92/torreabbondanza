import { SITE_URL } from "@/lib/site";
import { SUPPORTED_LANGUAGES, HREFLANG_MAP, type Language } from "@/lib/i18n";

/**
 * Generate hreflang link tags for a given route path.
 * Uses query-param based routing: /path?lang=en
 * Italian (it) is the default with no query param.
 */
export function buildHreflangLinks(path: string) {
  const links: { rel: string; hrefLang?: string; href: string }[] = [];

  // Canonical (always the IT/default version)
  links.push({ rel: "canonical", href: `${SITE_URL}${path}` });

  // One alternate per supported language
  for (const lng of SUPPORTED_LANGUAGES) {
    const hrefLang = HREFLANG_MAP[lng as Language];
    const href = lng === "it" ? `${SITE_URL}${path}` : `${SITE_URL}${path}?lang=${lng}`;
    links.push({ rel: "alternate", hrefLang, href });
  }

  // x-default points to Italian
  links.push({ rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${path}` });

  return links;
}
