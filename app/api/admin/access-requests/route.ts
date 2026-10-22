// app/api/admin/access-requests/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { requireAdmin } from "../_auth";
import { parseAccessRequestNote } from "@/app/lib/accessRequests";

export const runtime = "nodejs";

// jèrè is live by access code; its waitlist_signups rows are requests
// for a code. Codes are sent by hand, and `code_sent_at` records that.
const PRODUCT = "profitpilot";

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const status = (url.searchParams.get("status") || "").trim().toLowerCase(); // pending | sent
  const page = Math.max(1, toInt(url.searchParams.get("page"), 1));
  const pageSize = Math.min(50, Math.max(5, toInt(url.searchParams.get("pageSize"), 15)));
  const from = (page - 1) * pageSize;

  let query = supabaseAdmin
    .from("waitlist_signups")
    .select("id,full_name,email,phone,note,source,created_at,code_sent_at", { count: "exact" })
    .eq("product", PRODUCT)
    .order("created_at", { ascending: false });

  if (status === "pending") query = query.is("code_sent_at", null);
  if (status === "sent") query = query.not("code_sent_at", "is", null);

  if (q) {
    const needle = q.replace(/[,()]/g, " ");
    query = query.or(
      [`full_name.ilike.%${needle}%`, `email.ilike.%${needle}%`, `phone.ilike.%${needle}%`].join(",")
    );
  }

  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const requests = (data || []).map((r) => {
    const { businessType, challenge, consent } = parseAccessRequestNote(r.note);
    return {
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      businessType,
      challenge,
      consent,
      source: r.source,
      createdAt: r.created_at,
      codeSentAt: r.code_sent_at,
    };
  });

  return NextResponse.json({ ok: true, page, pageSize, total: count || 0, requests });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });

  const id = String(body.id || "").trim();
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  if (typeof body.sent !== "boolean") {
    return NextResponse.json({ ok: false, error: "sent must be true or false" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("waitlist_signups")
    .update({ code_sent_at: body.sent ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("product", PRODUCT)
    .select("id,code_sent_at")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, request: data });
}
