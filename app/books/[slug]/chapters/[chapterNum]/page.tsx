// /app/books/[slug]/chapters/[chapterNum]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
}

interface Chapter {
  id: string;
  bookId: string;
  bookSlug: string;
  chapterNumber: number;
  title: string;
  content: string;
  publishedAt: string;
}

export default function ChapterPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const chapterNum = params?.chapterNum as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapter() {
      if (!slug || !chapterNum) return;
      
      try {
        const booksRes = await fetch('/data/books.json');
        const books: Book[] = await booksRes.json();
        const foundBook = books.find(b => b.slug === slug);
        setBook(foundBook || null);
        
        const chaptersRes = await fetch('/data/chapters.json');
        const allChapters: Chapter[] = await chaptersRes.json();
        const bookChapters = allChapters.filter(c => c.bookSlug === slug).sort((a, b) => a.chapterNumber - b.chapterNumber);
        
        const currentChapter = bookChapters.find(c => c.chapterNumber === parseInt(chapterNum));
        setChapter(currentChapter || null);
        
        const currentIndex = bookChapters.findIndex(c => c.chapterNumber === parseInt(chapterNum));
        if (currentIndex > 0) setPrevChapter(bookChapters[currentIndex - 1]);
        if (currentIndex < bookChapters.length - 1) setNextChapter(bookChapters[currentIndex + 1]);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchChapter();
  }, [slug, chapterNum]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!book || !chapter) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold">Chapter Not Found</h1>
        <p className="mb-8 text-slate-600">The chapter you're looking for doesn't exist.</p>
        <Link href="/books" className="text-sky-600 hover:underline">
          ← Back to all books
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href={`/books/${book.slug}`} 
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
            >
              ← Back to {book.title}
            </Link>
            <Link 
              href="/books" 
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
            >
              All Books
            </Link>
          </div>
        </div>
      </div>

      {/* Chapter Content - Directly render the HTML which already has chapter-container class */}
      <div className="py-12">
        <div 
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />
      </div>
      
      {/* Chapter Navigation */}
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-8">
          {prevChapter ? (
            <Link
              href={`/books/${book.slug}/chapters/${prevChapter.chapterNumber}`}
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
            >
              ← Chapter {prevChapter.chapterNumber}: {prevChapter.title}
            </Link>
          ) : (
            <div />
          )}
          
          {nextChapter ? (
            <Link
              href={`/books/${book.slug}/chapters/${nextChapter.chapterNumber}`}
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
            >
              Chapter {nextChapter.chapterNumber}: {nextChapter.title} →
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
}