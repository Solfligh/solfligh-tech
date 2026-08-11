// /app/api/admin/chapters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_auth';
import {
  getChapters,
  saveChapter,
  deleteChapter,
  chapterNumberExists,
  type Chapter,
} from '../../../lib/booksStore';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId') || undefined;
    const chapters = await getChapters(bookId);
    return NextResponse.json(chapters);
  } catch (err) {
    console.error('GET /api/admin/chapters failed:', err);
    return NextResponse.json({ error: 'Failed to load chapters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const chapter = await request.json();

    if (!chapter || !chapter.title || !chapter.content) {
      return NextResponse.json(
        { error: 'Chapter title and content are required' },
        { status: 400 }
      );
    }

    if (!chapter.bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    let next: Chapter;

    if (chapter.id) {
      const existing = (await getChapters()).find((c) => c.id === chapter.id);
      if (!existing) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }
      next = { ...existing, ...chapter, updatedAt: now };
    } else {
      const taken = await chapterNumberExists(chapter.bookId, chapter.chapterNumber);
      if (taken) {
        return NextResponse.json(
          { error: 'Chapter number already exists for this book' },
          { status: 400 }
        );
      }

      next = {
        id: Date.now().toString(),
        bookId: chapter.bookId,
        bookSlug: chapter.bookSlug || '',
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        content: chapter.content,
        publishedAt: chapter.publishedAt || now,
        createdAt: now,
        updatedAt: now,
      };
    }

    await saveChapter(next);
    return NextResponse.json({ success: true, chapters: await getChapters() });
  } catch (err) {
    console.error('POST /api/admin/chapters failed:', err);
    return NextResponse.json({ error: 'Failed to save chapter' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 });
    }

    const chapters = await getChapters();
    if (!chapters.some((c) => c.id === id)) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    await deleteChapter(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/chapters failed:', err);
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 });
  }
}
