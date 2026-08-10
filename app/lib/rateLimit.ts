import crypto from 'crypto';
import { unstable_noStore as noStore } from 'next/cache';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

/**
 * Shared, database-backed rate limiting for public write endpoints.
 *
 * Deliberately not in-memory: serverless instances are short-lived and plural,
 * so an in-process counter resets on every cold start and is bypassed by
 * spreading requests across instances.
 *
 * Every helper here fails open. Blocking a real lead, signup, or comment
 * because a counting query hiccuped is worse than letting one extra through.
 */

/** Client IP as seen through Vercel's proxy. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for') || '';
  const first = forwarded.split(',')[0]?.trim();
  if (first) return first;
  return headers.get('x-real-ip')?.trim() || '';
}

/**
 * Salted SHA-256 of an IP, for tables that should not store the raw value.
 * Rate limiting only needs a key that is stable per submitter, not a
 * reversible one.
 */
export function hashIp(ip: string): string {
  const salt =
    process.env.COMMENT_IP_SALT ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'solfligh-local-dev-salt';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function hasSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function windowStartIso(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

/**
 * Count rows in `table` where `column` = `value` and created_at >= sinceIso.
 * Returns 0 on any failure, so callers fail open.
 */
export async function countRecent(opts: {
  table: string;
  column: string;
  value: string;
  sinceIso: string;
}): Promise<number> {
  if (!opts.value || !hasSupabase()) return 0;

  try {
    noStore();
    const { count, error } = await supabaseAdmin
      .from(opts.table)
      .select('id', { count: 'exact', head: true })
      .eq(opts.column, opts.value)
      .gte('created_at', opts.sinceIso);
    if (error) throw error;
    return count ?? 0;
  } catch (err) {
    console.error(`Rate limit lookup failed for ${opts.table}, allowing:`, err);
    return 0;
  }
}

export type RateLimitResult = { limited: boolean; retryAfterSeconds: number };

/**
 * Convenience wrapper: is this key over `max` within the last `windowMinutes`?
 */
export async function checkRateLimit(opts: {
  table: string;
  column: string;
  value: string;
  max: number;
  windowMinutes: number;
}): Promise<RateLimitResult> {
  const retryAfterSeconds = opts.windowMinutes * 60;
  if (!opts.value) return { limited: false, retryAfterSeconds };

  const recent = await countRecent({
    table: opts.table,
    column: opts.column,
    value: opts.value,
    sinceIso: windowStartIso(opts.windowMinutes),
  });

  return { limited: recent >= opts.max, retryAfterSeconds };
}
