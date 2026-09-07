// app/api/admin/_auth.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

/**
 * Admin authentication.
 *
 * Replaces a single shared ADMIN_TOKEN with per-person tokens stored as hashes
 * in public.admin_tokens, so access can be attributed to a person and revoked
 * individually without a redeploy.
 *
 * Four different copies of this check previously existed across the admin
 * routes, with two different return shapes. That is how the guard drifts, so
 * this is now the only implementation and every route uses the same shape.
 *
 * Tokens are accepted via either header, unchanged from before:
 *   Authorization: Bearer <token>
 *   x-admin-token: <token>
 *
 * The shared ADMIN_TOKEN that this replaced is gone. It is deliberately not
 * read here at all: leaving the fallback in place meant a single secret, known
 * to everyone who ever had it, still opened every admin route, and revoking it
 * required a redeploy. Per-person tokens in admin_tokens are now the only way
 * in, so setting ADMIN_TOKEN in the environment again has no effect.
 */

export type AdminIdentity = {
  /** Who the token belongs to. */
  name: string;
};

export type AdminAuth =
  | { ok: true; identity: AdminIdentity }
  | { ok: false; response: NextResponse };

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function unauthorized(message = "Unauthorized"): AdminAuth {
  return {
    ok: false,
    response: NextResponse.json({ ok: false, error: message }, { status: 401 }),
  };
}

/** Name of the httpOnly session cookie set by /api/admin/session. */
export const ADMIN_COOKIE = "admin_session";

function cookieToken(req: Request): string {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === ADMIN_COOKIE) return decodeURIComponent(rest.join("=")).trim();
  }
  return "";
}

function extractToken(req: Request): string {
  const auth = (req.headers.get("authorization") || "").trim();
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const header = (req.headers.get("x-admin-token") || "").trim();
  // Headers still win, so scripts, curl, and any API client keep working
  // exactly as before. The cookie is what makes the browser UIs stop asking
  // for the token on every reload.
  return (bearer || header || cookieToken(req)).trim();
}

/**
 * Verify the request carries a valid admin token.
 *
 * Fails closed: if the token store cannot be reached, the request is rejected
 * rather than allowed.
 */
export async function requireAdmin(req: Request): Promise<AdminAuth> {
  return verifyAdminToken(extractToken(req));
}

/**
 * Verify a bare token string.
 *
 * Exported so the session login route validates credentials through exactly
 * this path rather than reimplementing it — a second copy of the check is how
 * this guard drifted last time.
 */
export async function verifyAdminToken(token: string): Promise<AdminAuth> {
  const provided = (token || "").trim();
  if (!provided) return unauthorized();

  // Only the hash is ever compared, and only against admin_tokens. There is no
  // environment-variable path in or out of this function.
  const hash = sha256(provided);

  try {
    const { data, error } = await supabaseAdmin
      .from("admin_tokens")
      .select("id,name,revoked_at")
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .maybeSingle();

    if (error) throw error;
    if (!data) return unauthorized();

    // Best effort: a failure to record usage must not deny a valid request.
    void supabaseAdmin
      .from("admin_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", data.id)
      .then(({ error: touchErr }) => {
        if (touchErr) console.error("Could not update admin token last_used_at:", touchErr);
      });

    return { ok: true, identity: { name: data.name as string } };
  } catch (err) {
    // A lookup failure must not become an open door.
    console.error("Admin token lookup failed:", err);
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Could not verify admin credentials." },
        { status: 503 }
      ),
    };
  }
}

/** Hash helper, exported so the issuing script cannot drift from the check. */
export function hashAdminToken(token: string): string {
  return sha256(token);
}
