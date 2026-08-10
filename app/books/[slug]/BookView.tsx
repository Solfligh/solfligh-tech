// /app/books/[slug]/BookView.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// Use the store's types rather than a second, slightly different definition.
// The local copy narrowed `status` to 'ongoing' | 'completed', which no longer
// matched what the server actually passes down.
import type { Book, Chapter } from '@/app/lib/booksStore';

/**
 * Interactive part of a book page. `initialBook` and `initialChapters` are
 * fetched on the server by page.tsx, which also owns metadata and JSON-LD, so
 * the content is server-rendered rather than appearing after a client fetch.
 */
export default function BookView({
  initialBook,
  initialChapters,
}: {
  initialBook?: Book | null;
  initialChapters?: Chapter[];
}) {
  const params = useParams();
  const slug = params?.slug as string;

  const [book, setBook] = useState<Book | null>(initialBook ?? null);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters ?? []);
  const [loading, setLoading] = useState(!initialBook);

  useEffect(() => {
    // Already supplied by the server component, so nothing to fetch.
    if (initialBook) {
      setLoading(false);
      return;
    }

    async function fetchBookAndChapters() {
      if (!slug) return;

      try {
        // Fetch books
        const booksRes = await fetch('/api/books');
        const books: Book[] = await booksRes.json();
        const foundBook = books.find(b => b.slug === slug);
        setBook(foundBook || null);

        // Fetch chapters
        const chaptersRes = await fetch('/api/chapters');
        const allChapters: Chapter[] = await chaptersRes.json();
        const bookChapters = allChapters.filter(c => c.bookSlug === slug).sort((a, b) => a.chapterNumber - b.chapterNumber);
        setChapters(bookChapters);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookAndChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, initialBook]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold">Book Not Found</h1>
        <p className="mb-8 text-slate-600">The book you're looking for doesn't exist.</p>
        <Link href="/books" className="text-sky-600 hover:underline">
          ← Back to all eBooks
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Back link */}
      <Link href="/books" className="mb-6 inline-block text-sky-600 hover:underline">
        ← Back to all books
      </Link>
      
      {/* Book header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white md:flex">
        {book.coverImage && (
          <div className="md:w-1/3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-6 md:w-2/3">
          <h1 className="mb-3 text-3xl font-bold text-slate-900">{book.title}</h1>
          <p className="mb-2 text-lg text-slate-600">by {book.author}</p>
          <p className="mb-3 text-sm text-slate-500">Originally published: {book.originalPubDate}</p>
          <div className="mb-4">
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              book.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {book.status === 'completed' ? '✓ Completed' : '🔄 Ongoing'}
            </span>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-wrap text-slate-700">{book.description}</p>
          </div>
        </div>
      </div>
      
      {/* Chapters section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">📖 Chapters ({chapters.length})</h2>
        
        {chapters.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No chapters published yet. Check back soon!
          </p>
        ) : (
          <div className="divide-y divide-slate-200">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/books/${book.slug}/chapters/${chapter.chapterNumber}`}
                className="block py-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm text-slate-500">Chapter {chapter.chapterNumber}</span>
                    <h3 className="text-lg font-semibold text-slate-900">{chapter.title}</h3>
                  </div>
                  <span className="text-sky-600">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}