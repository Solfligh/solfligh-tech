import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBooks, getChapters, type Book, type Chapter } from '@/app/lib/booksStore';
import ChapterView from './ChapterView';
import { SITE_URL } from "@/app/lib/site";

/**
 * Server wrapper for a chapter page.
 *
 * All nine chapters of a book previously shared the layout's default title and
 * had no description, canonical, Open Graph tags, or structured data — so a
 * serialised book was invisible as individual chapters in search.
 */

const ORG_NAME = 'SOLFLIGH TECH';

export const dynamic = 'force-dynamic';

type Loaded = {
  book: Book | null;
  chapter: Chapter | null;
  prev: Chapter | null;
  next: Chapter | null;
};

async function loadChapter(slug: string, chapterNum: string): Promise<Loaded> {
  const empty: Loaded = { book: null, chapter: null, prev: null, next: null };
  const n = Number.parseInt(chapterNum, 10);
  if (!Number.isFinite(n)) return empty;

  try {
    const [books, allChapters] = await Promise.all([getBooks(), getChapters()]);
    const book = books.find((b) => b.slug === slug) || null;
    if (!book) return empty;

    const chapters = allChapters
      .filter((c) => c.bookSlug === slug)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    const index = chapters.findIndex((c) => c.chapterNumber === n);
    if (index === -1) return { book, chapter: null, prev: null, next: null };

    return {
      book,
      chapter: chapters[index],
      prev: index > 0 ? chapters[index - 1] : null,
      next: index < chapters.length - 1 ? chapters[index + 1] : null,
    };
  } catch {
    return empty;
  }
}

function toPlainText(html: string): string {
  return (html || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function describe(text: string, max = 300): string {
  const s = toPlainText(text);
  return s.length > max ? `${s.slice(0, max - 3)}…` : s;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapterNum: string }>;
}): Promise<Metadata> {
  const { slug, chapterNum } = await params;
  const { book, chapter } = await loadChapter(slug, chapterNum);

  if (!book || !chapter) {
    return { title: 'Chapter not found', robots: { index: false, follow: true } };
  }

  const title = `Chapter ${chapter.chapterNumber}: ${chapter.title} — ${book.title}`;
  const description = describe(chapter.content);
  const url = `${SITE_URL}/books/${book.slug}/chapters/${chapter.chapterNumber}`;

  return {
    title,
    description,
    alternates: { canonical: `/books/${book.slug}/chapters/${chapter.chapterNumber}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      publishedTime: chapter.publishedAt || undefined,
      authors: book.author ? [book.author] : undefined,
    },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapterNum: string }>;
}) {
  const { slug, chapterNum } = await params;
  const { book, chapter, prev, next } = await loadChapter(slug, chapterNum);

  if (!book || !chapter) notFound();

  const url = `${SITE_URL}/books/${book.slug}/chapters/${chapter.chapterNumber}`;

  const chapterJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: chapter.title,
    position: chapter.chapterNumber,
    url,
    description: describe(chapter.content, 500),
    ...(chapter.publishedAt ? { datePublished: chapter.publishedAt } : {}),
    ...(book.author ? { author: { '@type': 'Person', name: book.author } } : {}),
    isPartOf: {
      '@type': 'Book',
      name: book.title,
      url: `${SITE_URL}/books/${book.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
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
      {
        '@type': 'ListItem',
        position: 4,
        name: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd) }}
        key="chapter-jsonld"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        key="chapter-breadcrumb-jsonld"
      />
      <ChapterView
        initialBook={book}
        initialChapter={chapter}
        initialPrev={prev}
        initialNext={next}
      />
    </>
  );
}
