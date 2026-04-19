import { NextRequest, NextResponse } from 'next/server';
import { savePost, deletePost, getPosts } from '@/lib/posts';

export async function POST(request: NextRequest) {
  const post = await request.json();
  savePost(post);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  deletePost(id);
  return NextResponse.json({ success: true });
}

export async function GET() {
  const posts = getPosts();
  return NextResponse.json(posts);
}
