import { NextRequest, NextResponse } from 'next/server';
import { saveCategories, getCategories } from '@/lib/posts';

export async function POST(request: NextRequest) {
  const categories = await request.json();
  saveCategories(categories);
  return NextResponse.json({ success: true });
}

export async function GET() {
  const categories = getCategories();
  return NextResponse.json(categories);
}
