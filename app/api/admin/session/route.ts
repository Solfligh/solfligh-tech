import { NextResponse } from "next/server";
import { verifyAdminToken, requireAdmin, ADMIN_COOKIE } from "../_auth";

/**
 * Admin session.
 *
 * The admin UIs held the token in React state, so it was re-entered on every
 * reload. Persisting it in localStorage would make an admin credential
 * readable by any script on the page, so instead this exchanges the token for
 * an httpOnly cookie the browser sends automatically and JavaScript cannot
 * read.
 *
 *   POST    exchange a token for a session cookie
 *   GET     report whether the current request is already signed in
 *   DELETE  sign out
 *
 * Header auth is untouched, so scripts and API clients keep working.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Long enough not to be an irritation, short enough that a forgotten session
// on a shared machine expires on its own.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function cookieOptions() {
  return {
    httpOnly: true,
    // SameSite=strict means the cookie is not sent on cross-site requests, so
    // another site cannot ride the session to hit admin endpoints.
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function POST(req: Request) {
  let token = "";
  try {
    const body = await req.json();
    token = String(body?.token || "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "Enter your admin token." }, { status: 400 });
  }

  // Validated through the same code path as every admin request.
  const auth = await verifyAdminToken(token);
  if (!auth.ok) return auth.response;

  const res = NextResponse.json({
    ok: true,
    name: auth.identity.name,
  });
  res.cookies.set(ADMIN_COOKIE, token, cookieOptions());
  return res;
}

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    // Not an error state for the UI: it simply means "show the login form".
    return NextResponse.json({ ok: false }, { status: 200 });
  }
  return NextResponse.json({
    ok: true,
    name: auth.identity.name,
  });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}
