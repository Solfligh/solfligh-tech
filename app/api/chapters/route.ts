import { NextRequest, NextResponse } from 'next/server';
import { getChapters } from '@/app/lib/booksStore';

// Public read endpoint. Chapter data lives in Supabase behind RLS with no
// policies, so the anon key cannot read it directly — this reads via
// service_role. Supports ?bookId= to scope to a single book.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId') || undefined;
    const chapters = await getChapters(bookId);
    return NextResponse.json(chapters);
  } catch (err) {
    console.error('GET /api/chapters failed:', err);
    return NextResponse.json([], { status: 200 });
  }
}
