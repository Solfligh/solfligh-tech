import { NextRequest, NextResponse } from 'next/server';
import { getPosts, savePost, deletePost } from '../../../lib/posts';

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error('GET /api/admin/posts failed:', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const post = await request.json();
    await savePost(post);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/admin/posts failed:', err);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/posts failed:', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
