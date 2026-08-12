/**
 * The canonical origin of the site.
 *
 * www is what actually serves: the apex 308-redirects to it. Every canonical
 * URL, sitemap entry, and JSON-LD @id previously pointed at the apex, so the
 * site was telling search engines that the redirecting form was the canonical
 * one.
 *
 * This exists as one constant because it was previously redeclared in fifteen
 * files, which is exactly how they came to disagree with reality. Import it;
 * do not retype the origin.
 *
 * NEXT_PUBLIC_SITE_URL overrides it, which is useful for a preview deployment
 * that should reference itself rather than production.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.solflightech.org")
  .trim()
  .replace(/\/+$/, "");

export const ORG_NAME = "SOLFLIGH TECH";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${p}`;
}
