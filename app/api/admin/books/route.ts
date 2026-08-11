// /app/api/admin/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_auth';
import { getBooks, saveBook, deleteBook, deleteChaptersForBook, type Book } from '../../../lib/booksStore';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch (err) {
    console.error('GET /api/admin/books failed:', err);
    return NextResponse.json({ error: 'Failed to load books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const book = await request.json();

    if (!book || !book.title) {
      return NextResponse.json({ error: 'Book title is required' }, { status: 400 });
    }

    const books = await getBooks();
    const now = new Date().toISOString();

    let next: Book;

    if (book.id) {
      const existing = books.find((b) => b.id === book.id);
      if (!existing) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
      next = { ...existing, ...book, updatedAt: now };
    } else {
      next = {
        id: Date.now().toString(),
        title: book.title,
        slug: book.slug || book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: book.author || '',
        originalPubDate: book.originalPubDate || '',
        coverImage: book.coverImage || '',
        description: book.description || '',
        status: book.status || 'ongoing',
        createdAt: now,
        updatedAt: now,
      };
    }

    await saveBook(next);
    return NextResponse.json({ success: true, books: await getBooks() });
  } catch (err) {
    console.error('POST /api/admin/books failed:', err);
    return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const books = await getBooks();
    if (!books.some((b) => b.id === id)) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Remove the book's chapters too, so they are not orphaned.
    await deleteChaptersForBook(id);
    await deleteBook(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/books failed:', err);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
