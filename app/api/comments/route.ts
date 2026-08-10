import { NextRequest, NextResponse } from 'next/server';
import { getApprovedComments, addComment } from '@/app/lib/commentsStore';

/**
 * Public comments endpoint.
 *
 * GET  returns only approved comments for a post. Comment data lives in
 *      Supabase behind RLS with no policies, so the anon key cannot read it
 *      directly and unapproved comments are never exposed here.
 * POST accepts a submission. It is always stored unapproved — this endpoint
 *      cannot publish anything.
 */
export const dynamic = 'force-dynamic';

const MAX_NAME = 80;
const MAX_CONTENT = 4000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug') || '';
    if (!postSlug.trim()) {
      return NextResponse.json([], { status: 200 });
    }
    const comments = await getApprovedComments(postSlug);
    return NextResponse.json(comments);
  } catch (err) {
    console.error('GET /api/comments failed:', err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot, same convention as LeadForm: real users never fill this.
    // Answer as if accepted so bots get no signal.
    if (typeof body?.website === 'string' && body.website.trim()) {
      return NextResponse.json({
        ok: true,
        pending: true,
        message: 'Thanks — your comment has been submitted for review.',
      });
    }

    const postSlug = String(body?.postSlug || '').trim();
    const authorName = String(body?.authorName || '').trim();
    const content = String(body?.content || '').trim();

    if (!postSlug) {
      return NextResponse.json({ ok: false, error: 'Missing post.' }, { status: 400 });
    }
    if (!authorName) {
      return NextResponse.json({ ok: false, error: 'Please add your name.' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ ok: false, error: 'Please write a comment.' }, { status: 400 });
    }
    if (authorName.length > MAX_NAME) {
      return NextResponse.json({ ok: false, error: 'That name is too long.' }, { status: 400 });
    }
    if (content.length > MAX_CONTENT) {
      return NextResponse.json({ ok: false, error: 'That comment is too long.' }, { status: 400 });
    }

    await addComment({ postSlug, authorName, content });

    return NextResponse.json({
      ok: true,
      pending: true,
      message: 'Thanks — your comment has been submitted for review.',
    });
  } catch (err) {
    console.error('POST /api/comments failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not submit your comment. Please try again.' },
      { status: 500 }
    );
  }
}
