import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

/**
 * Books + chapters storage.
 *
 * Mirrors app/lib/posts.ts: Supabase is the source of truth, the JSON files
 * under public/data are a local/dev fallback. Writing to those files does not
 * work on a read-only serverless filesystem, which is why admin saves were
 * silently lost before this module existed.
 */

const booksPath = path.join(process.cwd(), 'public', 'data', 'books.json');
const chaptersPath = path.join(process.cwd(), 'public', 'data', 'chapters.json');

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  originalPubDate: string;
  coverImage: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  bookSlug: string;
  chapterNumber: number;
  title: string;
  content: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

function hasSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/* -------------------------------------------------------------------------- */
/* JSON fallback (dev/local only)                                             */
/* -------------------------------------------------------------------------- */

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(booksPath)) fs.writeFileSync(booksPath, JSON.stringify([], null, 2));
  if (!fs.existsSync(chaptersPath)) fs.writeFileSync(chaptersPath, JSON.stringify([], null, 2));
}

function readBooksJson(): Book[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(booksPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeBooksJson(books: Book[]): void {
  ensureDataDir();
  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
}

function readChaptersJson(): Chapter[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(chaptersPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeChaptersJson(chapters: Chapter[]): void {
  ensureDataDir();
  fs.writeFileSync(chaptersPath, JSON.stringify(chapters, null, 2));
}

/* -------------------------------------------------------------------------- */
/* Supabase mapping                                                           */
/* -------------------------------------------------------------------------- */

type DbBookRow = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  original_pub_date: string | null;
  cover_image: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type DbChapterRow = {
  id: string;
  book_id: string | null;
  book_slug: string | null;
  chapter_number: number | null;
  title: string | null;
  content: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const BOOK_COLUMNS =
  'id,title,slug,author,original_pub_date,cover_image,description,status,created_at,updated_at';
const CHAPTER_COLUMNS =
  'id,book_id,book_slug,chapter_number,title,content,published_at,created_at,updated_at';

function toBook(r: DbBookRow): Book {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    author: r.author || '',
    originalPubDate: r.original_pub_date || '',
    coverImage: r.cover_image || '',
    description: r.description || '',
    status: r.status || 'ongoing',
    createdAt: r.created_at || '',
    updatedAt: r.updated_at || '',
  };
}

function toChapter(r: DbChapterRow): Chapter {
  return {
    id: r.id,
    bookId: r.book_id || '',
    bookSlug: r.book_slug || '',
    chapterNumber: r.chapter_number ?? 0,
    title: r.title || '',
    content: r.content || '',
    publishedAt: r.published_at || '',
    createdAt: r.created_at || '',
    updatedAt: r.updated_at || '',
  };
}

/* -------------------------------------------------------------------------- */
/* Books                                                                      */
/* -------------------------------------------------------------------------- */

export async function getBooks(): Promise<Book[]> {
  if (hasSupabase()) {
    try {
      noStore();
      const { data, error } = await supabaseAdmin
        .from('books')
        .select(BOOK_COLUMNS)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return ((data || []) as DbBookRow[]).map(toBook);
    } catch {
      return readBooksJson();
    }
  }
  return readBooksJson();
}

export async function saveBook(book: Book): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('books').upsert(
      {
        id: book.id,
        title: book.title,
        slug: book.slug,
        author: book.author,
        original_pub_date: book.originalPubDate,
        cover_image: book.coverImage,
        description: book.description,
        status: book.status,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
      },
      { onConflict: 'id' }
    );
    if (error) throw error;
    return;
  }

  const books = readBooksJson();
  const index = books.findIndex((b) => b.id === book.id);
  if (index >= 0) books[index] = book;
  else books.push(book);
  writeBooksJson(books);
}

export async function deleteBook(id: string): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('books').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const books = readBooksJson();
  writeBooksJson(books.filter((b) => b.id !== id));
}

/* -------------------------------------------------------------------------- */
/* Chapters                                                                   */
/* -------------------------------------------------------------------------- */

export async function getChapters(bookId?: string): Promise<Chapter[]> {
  if (hasSupabase()) {
    try {
      noStore();
      let query = supabaseAdmin.from('chapters').select(CHAPTER_COLUMNS);
      if (bookId) query = query.eq('book_id', bookId);
      const { data, error } = await query.order('chapter_number', { ascending: true });
      if (error) throw error;
      return ((data || []) as DbChapterRow[]).map(toChapter);
    } catch {
      const all = readChaptersJson();
      return bookId ? all.filter((c) => c.bookId === bookId) : all;
    }
  }

  const all = readChaptersJson();
  return bookId ? all.filter((c) => c.bookId === bookId) : all;
}

export async function saveChapter(chapter: Chapter): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('chapters').upsert(
      {
        id: chapter.id,
        book_id: chapter.bookId,
        book_slug: chapter.bookSlug,
        chapter_number: chapter.chapterNumber,
        title: chapter.title,
        content: chapter.content,
        published_at: chapter.publishedAt,
        created_at: chapter.createdAt,
        updated_at: chapter.updatedAt,
      },
      { onConflict: 'id' }
    );
    if (error) throw error;
    return;
  }

  const chapters = readChaptersJson();
  const index = chapters.findIndex((c) => c.id === chapter.id);
  if (index >= 0) chapters[index] = chapter;
  else chapters.push(chapter);
  chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
  writeChaptersJson(chapters);
}

export async function deleteChapter(id: string): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('chapters').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const chapters = readChaptersJson();
  writeChaptersJson(chapters.filter((c) => c.id !== id));
}

/** Used when a book is deleted, so its chapters do not linger. */
export async function deleteChaptersForBook(bookId: string): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('chapters').delete().eq('book_id', bookId);
    if (error) throw error;
    return;
  }

  const chapters = readChaptersJson();
  writeChaptersJson(chapters.filter((c) => c.bookId !== bookId));
}

/** Chapter numbers must be unique within a book. */
export async function chapterNumberExists(
  bookId: string,
  chapterNumber: number
): Promise<boolean> {
  const chapters = await getChapters(bookId);
  return chapters.some((c) => c.chapterNumber === chapterNumber);
}
