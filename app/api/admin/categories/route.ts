import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategories } from '../../../lib/posts';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error('GET /api/admin/categories failed:', err);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const categories = await request.json();
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Expected an array of categories' }, { status: 400 });
    }
    await saveCategories(categories);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/admin/categories failed:', err);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
