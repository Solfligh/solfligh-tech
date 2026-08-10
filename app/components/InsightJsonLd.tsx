import { getPostByHref, getHub } from "@/app/lib/insightsStore";

/**
 * Structured data for an insights article.
 *
 * The article pages are hand-written server components, so rather than paste a
 * JSON-LD block into each one, this looks the article up in insightsStore by
 * its canonical href — the same record that drives the hub listings and the
 * sitemap. One source, so the schema cannot drift from the visible copy.
 *
 * Renders nothing if the href is not a known article, which keeps a typo from
 * emitting half-populated schema.
 */

const SITE_URL = "https://solflightech.org";
const ORG_NAME = "SOLFLIGH TECH";

export default function InsightJsonLd({
  href,
  /**
   * Emit only the breadcrumb. For pages that already hand-write their own
   * article schema, so the page does not end up declaring two article types.
   */
  breadcrumbOnly = false,
}: {
  href: string;
  breadcrumbOnly?: boolean;
}) {
  const post = getPostByHref(href);
  if (!post) return null;

  const hub = getHub(post.hubSlug);
  const url = `${SITE_URL}${post.href}`;
  const image = post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image ? { image: [image] } : {}),
    ...(post.dateISO ? { datePublished: post.dateISO, dateModified: post.dateISO } : {}),
    author: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    ...(post.tag ? { articleSection: post.tag } : {}),
    inLanguage: "en",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
      ...(hub
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: hub.title,
              item: `${SITE_URL}${hub.href}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: hub ? 4 : 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      {!breadcrumbOnly && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          key="insight-article-jsonld"
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        key="insight-breadcrumb-jsonld"
      />
    </>
  );
}
