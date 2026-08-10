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

  // Homepage and Solfligh Cloud: developer signup does not exist yet, so the
  // spec directs these to /contact.
  if (path === '/' || path === '/cloud' || path.startsWith('/cloud/')) {
    return { href: '/contact', label: 'Get in touch' };
  }

  // Company pages and everything else: general contact form.
  return GENERAL_CONTACT;
}
