import { NextRequest, NextResponse } from 'next/server';
import { getPosts, savePost, deletePost } from '../../../lib/posts';
import { requireAdmin } from '../_auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error('GET /api/admin/posts failed:', err);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

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
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await request.json();
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/posts failed:', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
