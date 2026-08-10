// app/lib/products.ts

/**
 * Canonical product registry.
 *
 * Single source of truth for product display names so that copy driven by a
 * `product` slug (the waitlist page, the waitlist confirmation email) cannot
 * drift from the names in CLAUDE.md. Title-casing a slug is NOT good enough:
 * "rebirthagro" becomes "Rebirthagro" and "fxco-pilot" becomes "Fxco Pilot",
 * both of which break the canonical naming rule.
 *
 * Products are ProfitPilot, RebirthAgro, FXCopilot.
 * Solfligh Cloud is deliberately absent — it is the platform/infrastructure
 * layer, not a product (Blueprint 11.1), and must never be routed through a
 * product waitlist.
 */

export type ProductInfo = {
  slug: string;
  /** Canonical display name. Never derive this from the slug. */
  label: string;
  /** Where the post-signup "back" link goes. */
  backHref: string;
  backLabel: string;
};

const PRODUCTS: Record<string, ProductInfo> = {
  profitpilot: {
    slug: 'profitpilot',
    label: 'ProfitPilot',
    backHref: '/insights/profitpilot',
    backLabel: 'Back to ProfitPilot hub',
  },
  rebirthagro: {
    slug: 'rebirthagro',
    // No insights hub exists for RebirthAgro, so this points at the product page.
    label: 'RebirthAgro',
    backHref: '/projects/rebirthagro',
    backLabel: 'Back to RebirthAgro',
  },
  'fxco-pilot': {
    slug: 'fxco-pilot',
    label: 'FXCopilot',
    backHref: '/insights/fxco-pilot',
    backLabel: 'Back to FXCopilot hub',
  },
};

/** Tolerated inbound spellings, mapped to the canonical slug. */
const ALIASES: Record<string, string> = {
  fxcopilot: 'fxco-pilot',
  'fxco-pilot': 'fxco-pilot',
  fxcp: 'fxco-pilot',
  // Retired name kept only so old inbound links still resolve.
  profitfx: 'fxco-pilot',
  'rebirth-agro': 'rebirthagro',
  'profit-pilot': 'profitpilot',
};

/**
 * Solfligh Cloud is not a product. Requests naming it are recognised so the
 * waitlist can refuse them rather than silently framing Cloud as a product.
 */
const CLOUD_SLUGS = new Set([
  'cloud',
  'solfligh-cloud',
  'solflighcloud',
  'solfligh_cloud',
  'solflighcloud',
]);

export const DEFAULT_PRODUCT_SLUG = 'profitpilot';

export function normalizeProductSlug(raw?: string | null): string {
  const s = (raw || '').trim().toLowerCase();
  if (!s) return DEFAULT_PRODUCT_SLUG;
  return ALIASES[s] || s;
}

export function isCloudSlug(raw?: string | null): boolean {
  const s = (raw || '').trim().toLowerCase();
  return CLOUD_SLUGS.has(s);
}

/** Returns the product, or null if the slug is not a known product. */
export function getProduct(raw?: string | null): ProductInfo | null {
  return PRODUCTS[normalizeProductSlug(raw)] || null;
}

/**
 * Display name for a slug. Falls back to the raw slug rather than inventing a
 * prettified name, so an unknown product is never shown under a made-up label.
 */
export function productLabel(raw?: string | null): string {
  return getProduct(raw)?.label || normalizeProductSlug(raw);
}
