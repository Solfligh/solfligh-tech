import { NextResponse } from 'next/server';
import { getCategories } from '@/app/lib/posts';

// Public read endpoint. Blog data lives in Supabase behind RLS with no policies,
// so the anon key cannot read it directly — this route reads via service_role.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error('GET /api/categories failed:', err);
    return NextResponse.json([], { status: 200 });
  }
}
