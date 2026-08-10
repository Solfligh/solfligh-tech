import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

/**
 * Blog comments.
 *
 * Mirrors app/lib/posts.ts and app/lib/booksStore.ts: Supabase is the source of
 * truth, the JSON file is a local/dev fallback only.
 *
 * Moderation is approve-first. A submitted comment is stored with
 * approved = false and is not visible to the public until someone approves it
 * in /admin/blog. getApprovedComments is the only reader the public site uses.
 */

const commentsPath = path.join(process.cwd(), 'public', 'data', 'comments.json');

export interface Comment {
  id: string;
  postSlug: string;
  authorName: string;
  content: string;
  approved: boolean;
  createdAt: string;
  approvedAt?: string | null;
}

function hasSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/* -------------------------------------------------------------------------- */
/* JSON fallback (dev/local only)                                             */
/* -------------------------------------------------------------------------- */

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(commentsPath)) fs.writeFileSync(commentsPath, JSON.stringify([], null, 2));
}

function readJson(): Comment[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeJson(comments: Comment[]): void {
  ensureDataDir();
  fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));
}

/* -------------------------------------------------------------------------- */
/* Supabase mapping                                                           */
/* -------------------------------------------------------------------------- */

type DbCommentRow = {
  id: string;
  post_slug: string;
  author_name: string;
  content: string;
  approved: boolean | null;
  created_at: string | null;
  approved_at: string | null;
};

const COLUMNS = 'id,post_slug,author_name,content,approved,created_at,approved_at';

function toComment(r: DbCommentRow): Comment {
  return {
    id: r.id,
    postSlug: r.post_slug,
    authorName: r.author_name,
    content: r.content,
    approved: Boolean(r.approved),
    createdAt: r.created_at || '',
    approvedAt: r.approved_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Public reads — approved only                                               */
/* -------------------------------------------------------------------------- */

export async function getApprovedComments(postSlug: string): Promise<Comment[]> {
  const slug = (postSlug || '').trim();
  if (!slug) return [];

  if (hasSupabase()) {
    try {
      noStore();
      const { data, error } = await supabaseAdmin
        .from('comments')
        .select(COLUMNS)
        .eq('post_slug', slug)
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data || []) as DbCommentRow[]).map(toComment);
    } catch {
      return readJson().filter((c) => c.postSlug === slug && c.approved);
    }
  }

  return readJson().filter((c) => c.postSlug === slug && c.approved);
}

/* -------------------------------------------------------------------------- */
/* Admin reads — everything, pending first                                    */
/* -------------------------------------------------------------------------- */

export async function getAllComments(): Promise<Comment[]> {
  if (hasSupabase()) {
    try {
      noStore();
      const { data, error } = await supabaseAdmin
        .from('comments')
        .select(COLUMNS)
        .order('approved', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data || []) as DbCommentRow[]).map(toComment);
    } catch {
      return readJson();
    }
  }
  return readJson();
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

/** Always stored unapproved. Approval is a separate, admin-only action. */
export async function addComment(input: {
  postSlug: string;
  authorName: string;
  content: string;
}): Promise<Comment> {
  const now = new Date().toISOString();
  const comment: Comment = {
    id: Date.now().toString(),
    postSlug: input.postSlug.trim(),
    authorName: input.authorName.trim(),
    content: input.content.trim(),
    approved: false,
    createdAt: now,
    approvedAt: null,
  };

  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('comments').insert({
      id: comment.id,
      post_slug: comment.postSlug,
      author_name: comment.authorName,
      content: comment.content,
      approved: false,
      created_at: comment.createdAt,
      approved_at: null,
    });
    if (error) throw error;
    return comment;
  }

  const all = readJson();
  all.unshift(comment);
  writeJson(all);
  return comment;
}

export async function setCommentApproval(id: string, approved: boolean): Promise<void> {
  const approvedAt = approved ? new Date().toISOString() : null;

  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin
      .from('comments')
      .update({ approved, approved_at: approvedAt })
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const all = readJson();
  const idx = all.findIndex((c) => c.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], approved, approvedAt };
    writeJson(all);
  }
}

export async function deleteComment(id: string): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('comments').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  writeJson(readJson().filter((c) => c.id !== id));
}

export async function commentExists(id: string): Promise<boolean> {
  return (await getAllComments()).some((c) => c.id === id);
}
