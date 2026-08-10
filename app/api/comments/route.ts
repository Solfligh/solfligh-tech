import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getApprovedComments, addComment } from '@/app/lib/commentsStore';

export const runtime = 'nodejs';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://solflightech.org').replace(/\/$/, '');

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Tell the admin a comment is waiting.
 *
 * Approve-first means a comment is invisible until someone acts on it, so
 * without this the moderation queue depends on remembering to check.
 *
 * Best effort: a failure here must never fail the visitor's submission — the
 * comment is already stored by the time this runs.
 */
async function notifyAdminOfComment(input: {
  postSlug: string;
  authorName: string;
  content: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  const adminTo = process.env.RESEND_TO;

  if (!resendKey || !resendFrom || !adminTo) return;

  try {
    const resend = new Resend(resendKey);
    const excerpt =
      input.content.length > 600 ? `${input.content.slice(0, 600)}…` : input.content;

    // The Resend SDK reports API-level failures on the returned `error` field
    // rather than throwing, so a try/catch alone would let a failed send pass
    // silently.
    const { data, error } = await resend.emails.send({
      from: resendFrom,
      to: adminTo,
      subject: `New comment awaiting review — ${input.postSlug}`,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
          <h2 style="margin:0 0 12px;">A comment is waiting for review</h2>
          <p style="margin:0 0 4px;"><b>From:</b> ${escapeHtml(input.authorName)}</p>
          <p style="margin:0 0 12px;"><b>On post:</b> ${escapeHtml(input.postSlug)}</p>
          <blockquote style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #cbd5e1;background:#f8fafc;white-space:pre-wrap;">${escapeHtml(
            excerpt
          )}</blockquote>
          <p style="margin:0 0 16px;">It is <b>not visible on the site</b> until you approve it.</p>
          <p style="margin:0;">
            <a href="${SITE_URL}/admin/blog"
               style="display:inline-block;background:#0284c7;color:#fff;padding:10px 16px;border-radius:9999px;text-decoration:none;font-weight:600;">
              Review it in admin
            </a>
          </p>
          <p style="margin:16px 0 0;color:#64748b;font-size:12px;">
            Also visible at ${SITE_URL}/blog/${escapeHtml(input.postSlug)} once approved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Comment notification email rejected by Resend:', error);
    } else {
      console.log('Comment notification email sent, id:', data?.id);
    }
  } catch (err) {
    // Swallow: the comment is stored, and the admin queue still shows it.
    console.error('Comment notification email failed:', err);
  }
}

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

    // Best effort, and deliberately awaited so it still runs on serverless,
    // where the function can be frozen the moment the response is returned.
    await notifyAdminOfComment({ postSlug, authorName, content });

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
