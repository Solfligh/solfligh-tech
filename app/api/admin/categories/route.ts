import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategories } from '../../../lib/posts';

export async function GET() {
  const categories = getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const categories = await request.json();
  saveCategories(categories);
  return NextResponse.json({ success: true });
}