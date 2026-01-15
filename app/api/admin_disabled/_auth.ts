// app/api/admin/_auth.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Simple admin guard using ADMIN_TOKEN.
 * Accepts token via:
 *  - Authorization: Bearer <token>
 *  - x-admin-token: <token>
 *
 * Returns:
 *  - NextResponse (error) if unauthorized
 *  - null if authorized
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const expected = (process.env.ADMIN_TOKEN || "").trim();

  // Safety: if token isn't configured, do NOT allow admin endpoints
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN is not configured" },
      { status: 500 }
    );
  }

  const auth = (req.headers.get("authorization") || "").trim();
  const bearer =
    auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";

  const headerToken = (req.headers.get("x-admin-token") || "").trim();
  const provided = (bearer || headerToken).trim();

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
