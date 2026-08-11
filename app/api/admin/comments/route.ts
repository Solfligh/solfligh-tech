import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_auth';
import {
  getAllComments,
  setCommentApproval,
  deleteComment,
  commentExists,
} from '@/app/lib/commentsStore';

/**
 * Admin moderation for blog comments. Approving is the only way a comment
 * becomes publicly visible, so every handler here is behind requireAdmin.
 */

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const comments = await getAllComments();
    return NextResponse.json(comments);
  } catch (err) {
    console.error('GET /api/admin/comments failed:', err);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }
}

/** Approve or un-approve a comment. */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id, approved } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }
    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'approved must be a boolean' }, { status: 400 });
    }
    if (!(await commentExists(id))) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    await setCommentApproval(id, approved);
    return NextResponse.json({ success: true, comments: await getAllComments() });
  } catch (err) {
    console.error('POST /api/admin/comments failed:', err);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }
    if (!(await commentExists(id))) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    await deleteComment(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/comments failed:', err);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
