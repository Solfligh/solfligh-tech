// app/lib/supabaseAdmin.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase Admin client (SERVICE ROLE).
 * IMPORTANT: Never import this into client components.
 *
 * Initialisation is lazy, and deliberately so.
 *
 * This module used to read the environment and throw at module scope. Because
 * `next build` evaluates every server module while collecting page data, a
 * single missing env var did not degrade one route it aborted the entire
 * build with:
 *
 *   Error: Missing SUPABASE_SERVICE_ROLE_KEY
 *   Build error occurred: Failed to collect page data for /api/admin/leads
 *
 * That is exactly how every Vercel Preview deployment failed while the key was
 * scoped to Production only, and the failure named an unrelated route, which
 * made it hard to diagnose.
 *
 * The client is now created on first use. A misconfigured environment still
 * fails loudly, but only in the request that actually needs Supabase, so the
 * build succeeds and routes that do not touch the database keep working.
 */

let cached: SupabaseClient | null = null;

/** True when both env vars are present. Cheap, and never throws. */
export function hasSupabaseEnv(): boolean {
  return (
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim() &&
    !!(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()
  );
}

/**
 * Returns the admin client, creating it on first call.
 * Throws only when actually invoked without configuration.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  cached = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cached;
}

/**
 * Drop-in replacement for the old eager export, so existing call sites such as
 * `supabaseAdmin.from(...)` and `supabaseAdmin.storage.from(...)` are unchanged.
 * The underlying client is constructed on first property access.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client as unknown as object, prop);
    // Bind methods so `this` remains the real client, not the proxy.
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, prop) {
    return Reflect.has(getSupabaseAdmin() as unknown as object, prop);
  },
});
