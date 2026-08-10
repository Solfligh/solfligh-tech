import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBooks, getChapters, type Book, type Chapter } from '@/app/lib/booksStore';
import BookView from './BookView';

/**
 * Server wrapper for a book page.
 *
 * Every book and chapter URL previously shared the layout's default title, with
 * no description, canonical, Open Graph tags, or structured data — a nine
 * chapter book was indistinguishable from the homepage in search results.
 */

const SITE_URL = 'https://solflightech.org';
const ORG_NAME = 'SOLFLIGH TECH';

export const dynamic = 'force-dynamic';

async function loadBook(slug: string): Promise<{ book: Book | null; chapters: Chapter[] }> {
  try {
    const [books, allChapters] = await Promise.all([getBooks(), getChapters()]);
    const book = books.find((b) => b.slug === slug) || null;
    const chapters = book
      ? allChapters
          .filter((c) => c.bookSlug === slug)
          .sort((a, b) => a.chapterNumber - b.chapterNumber)
      : [];
    return { book, chapters };
  } catch {
    return { book: null, chapters: [] };
  }
}

function toPlainText(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function describe(text: string, max = 300): string {
  const s = toPlainText(text);
  return s.length > max ? `${s.slice(0, max - 3)}…` : s;
}

function absoluteImage(src?: string): string | undefined {
  const s = (src || '').trim();
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
  const { book } = await loadBook(slug);

  if (!book) {
    return { title: 'Book not found', robots: { index: false, follow: true } };
  }

  const description = describe(book.description);
  const image = absoluteImage(book.coverImage);

  return {
    title: book.title,
    description,
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: {
      type: 'book',
      title: book.title,
      description,
      url: `${SITE_URL}/books/${book.slug}`,
      authors: book.author ? [book.author] : undefined,
      ...(image ? { images: [{ url: image, alt: book.title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: book.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { book, chapters } = await loadBook(slug);

  if (!book) notFound();

  const image = absoluteImage(book.coverImage);

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    url: `${SITE_URL}/books/${book.slug}`,
    description: describe(book.description, 500),
    ...(image ? { image } : {}),
    ...(book.author ? { author: { '@type': 'Person', name: book.author } } : {}),
    ...(book.originalPubDate ? { datePublished: book.originalPubDate } : {}),
    inLanguage: 'en',
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    // Chapters are individually addressable pages, so they are declared as parts.
    ...(chapters.length
      ? {
          numberOfPages: chapters.length,
          hasPart: chapters.map((c) => ({
            '@type': 'Chapter',
            name: c.title,
            position: c.chapterNumber,
            url: `${SITE_URL}/books/${book.slug}/chapters/${c.chapterNumber}`,
          })),
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'eBooks', item: `${SITE_URL}/books` },
      {
        '@type': 'ListItem',
        position: 3,
        name: book.title,
        item: `${SITE_URL}/books/${book.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
        key="book-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        key="book-breadcrumb-jsonld"
      />
      <BookView initialBook={book} initialChapters={chapters} />
    </>
  );
}
