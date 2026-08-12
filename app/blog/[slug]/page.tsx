import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, type BlogPost } from '@/app/lib/posts';
import ArticleView from './ArticleView';
import { SITE_URL } from "@/app/lib/site";

/**
 * Server wrapper for a blog article.
 *
 * The page used to be entirely client-rendered with no metadata export at all,
 * so every article shared the layout's default title and description, had no
 * canonical URL, no Open Graph tags, and no structured data. In search results
 * and social shares all seven articles looked identical.
 *
 * This component owns metadata and JSON-LD, and hands the post to the client
 * view so the article body is server-rendered too.
 */

const ORG_NAME = 'SOLFLIGH TECH';

export const dynamic = 'force-dynamic';

async function findPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getPosts();
    return posts.find((p) => p.slug === slug) || null;
  } catch {
    return null;
  }
}

/** Strip HTML and collapse whitespace, for meta descriptions. */
function toPlainText(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function describe(post: BlogPost): string {
  const raw = post.excerpt?.trim() || toPlainText(post.content);
  return raw.length > 300 ? `${raw.slice(0, 297)}…` : raw;
}

function absoluteImage(coverImage?: string): string | undefined {
  if (!coverImage) return undefined;
  const s = coverImage.trim();
  if (!s) return undefined;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  return `${SITE_URL}${s.startsWith('/') ? '' : '/'}${s}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);

  if (!post) {
    return {
      title: 'Article not found',
      robots: { index: false, follow: true },
    };
  }

  const description = describe(post);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteImage(post.coverImage);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      publishedTime: post.publishedAt || undefined,
      authors: post.author ? [post.author] : undefined,
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findPost(slug);

  // Previously an unknown slug rendered an "Article not found" body with a 200
  // status, which is a soft 404. This returns a real one.
  if (!post) notFound();

  const image = absoluteImage(post.coverImage);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: describe(post),
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    ...(image ? { image: [image] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt, dateModified: post.publishedAt } : {}),
    ...(post.author ? { author: { '@type': 'Person', name: post.author } } : {}),
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    ...(Array.isArray(post.tags) && post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    ...(post.readTime ? { timeRequired: `PT${post.readTime}M` } : {}),
    inLanguage: 'en',
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        key="article-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        key="breadcrumb-jsonld"
      />
      <ArticleView initialPost={post} />
    </>
  );
}
