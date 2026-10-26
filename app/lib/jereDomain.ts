import { SITE_URL } from "@/app/lib/site";

// DNS form of jèrè.com; browsers may display either this or the accented name.
export const JERE_DOMAIN_HOST = "www.xn--jr-7iab.com";
export const JERE_APEX_HOST = "xn--jr-7iab.com";
export const JERE_DOMAIN_ORIGIN = `https://${JERE_DOMAIN_HOST}`;
export const JERE_LEGACY_PATH = "/products/profitpilot";
export const JERE_ICON_PATH = "/projects/profitpilot/logo.png";

/** Enable only after DNS and HTTPS have been verified, then rebuild/redeploy. */
export function jereDomainEnabled(): boolean {
  return process.env.NEXT_PUBLIC_JERE_DOMAIN_ENABLED === "true";
}

export function getJereUrl(): string {
  return jereDomainEnabled() ? `${JERE_DOMAIN_ORIGIN}/` : `${SITE_URL}${JERE_LEGACY_PATH}`;
}

export function isJereHost(hostname: string): boolean {
  return hostname === JERE_DOMAIN_HOST || hostname === JERE_APEX_HOST;
}
