import { NextResponse } from 'next/server';
import { getBooks } from '@/app/lib/booksStore';

// Public read endpoint. Book data lives in Supabase behind RLS with no policies,
// so the anon key cannot read it directly — this route reads via service_role.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch (err) {
    console.error('GET /api/books failed:', err);
    return NextResponse.json([], { status: 200 });
  }
}
