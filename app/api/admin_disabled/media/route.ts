// app/api/admin/media/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";
import { requireAdmin } from "../_auth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

/**
 * POST body:
 * {
 *   "bucket": "public" | "...",
 *   "path": "projects/my-image.png",
 *   "base64": "<base64-encoded-bytes>",
 *   "contentType": "image/png"
 * }
 */
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    const body = (await req.json().catch(() => ({}))) as {
      bucket?: string;
      path?: string;
      base64?: string;
      contentType?: string;
    };

    const bucket = (body.bucket || "").trim();
    const path = (body.path || "").trim();
    const base64 = (body.base64 || "").trim();
    const contentType = (body.contentType || "").trim();

    if (!bucket || !path || !base64) {
      return NextResponse.json(
        { error: "Missing bucket, path, or base64" },
        { status: 400 }
      );
    }

    // base64 -> Uint8Array
    const bytes = Uint8Array.from(Buffer.from(base64, "base64"));

    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, bytes, {
      contentType: contentType || "application/octet-stream",
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
