import { getProduct } from '@/app/lib/products';

/**
 * Contextual header CTA (Website Architecture §10).
 *
 * The header CTA routes by page context rather than always pointing at
 * /contact:
 *
 *   Homepage / Solfligh Cloud  ->  developer signup (does not exist yet, so
 *                                  /contact, per the spec's own note)
 *   Product page               ->  that product's demo/signup
 *   Services page              ->  contact / consultation form
 *   Company pages              ->  general contact form
 *
 * The label moves with the destination. A button reading "Contact" that opens
 * a waitlist would be a bug, not contextual routing.
 */

export type HeaderCta = {
  href: string;
  label: string;
  external?: boolean;
};

const GENERAL_CONTACT: HeaderCta = { href: '/contact', label: 'Contact' };

export function getHeaderCta(pathname: string): HeaderCta {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';

  // Product detail: use that product's own demo/signup destination.
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (product) {
      return {
        href: product.ctaHref,
        label: product.ctaLabel,
        external: product.ctaExternal,
      };
    }
  }

  // Products index: no single product in context, so invite a conversation
  // rather than guessing which product the visitor wants.
  if (path === '/products') {
    return { href: '/contact', label: 'Talk to us' };
  }

  // Services: contact / consultation.
  if (path === '/services' || path.startsWith('/services/')) {
    return { href: '/contact', label: 'Talk to us' };
  }

  // Homepage and Solfligh Cloud route to the developer signup, per Website
  // Architecture §10. That signup did not exist when this table was first
  // implemented, which is why these previously fell back to /contact.
  // /cloud/access is itself the destination, so it keeps a plain contact CTA
  // rather than linking to the page you are already on.
  if (path === '/cloud/access') {
    return { href: '/contact', label: 'Contact' };
  }
  if (path === '/' || path === '/cloud' || path.startsWith('/cloud/')) {
    return { href: '/cloud/access', label: 'Get early access' };
  }

  // Company pages and everything else: general contact form.
  return GENERAL_CONTACT;
}
