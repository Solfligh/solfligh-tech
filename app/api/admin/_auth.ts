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
 * The legacy ADMIN_TOKEN still works during migration and is reported as such,
 * so its use can be spotted in logs and eventually removed.
 */

export type AdminIdentity = {
  /** Who the token belongs to, or "legacy shared token". */
  name: string;
  /** True when the deprecated single ADMIN_TOKEN was used. */
  legacy: boolean;
};

export type AdminAuth =
  | { ok: true; identity: AdminIdentity }
  | { ok: false; response: NextResponse };

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Constant-time compare, so a wrong token cannot be found byte by byte. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function unauthorized(message = "Unauthorized"): AdminAuth {
  return {
    ok: false,
    response: NextResponse.json({ ok: false, error: message }, { status: 401 }),
  };
}

function extractToken(req: Request): string {
  const auth = (req.headers.get("authorization") || "").trim();
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const header = (req.headers.get("x-admin-token") || "").trim();
  return (bearer || header).trim();
}

/**
 * Verify the request carries a valid admin token.
 *
 * Fails closed: if neither per-person tokens nor a legacy token can be checked,
 * the request is rejected rather than allowed.
 */
export async function requireAdmin(req: Request): Promise<AdminAuth> {
  const provided = extractToken(req);
  if (!provided) return unauthorized();

  // Legacy shared token, kept working during migration.
  const legacy = (process.env.ADMIN_TOKEN || "").trim();
  if (legacy && safeEqual(provided, legacy)) {
    console.warn(
      "Admin access used the legacy shared ADMIN_TOKEN. Issue per-person tokens and remove it."
    );
    return { ok: true, identity: { name: "legacy shared token", legacy: true } };
  }

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

    return { ok: true, identity: { name: data.name as string, legacy: false } };
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
