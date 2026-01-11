import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { requireAdmin } from "@/app/api/admin/_auth";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, type, src, thumbnail, alt } = await req.json();

  if (!slug || !type || !src) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: proj, error: pErr } = await supabaseAdmin
    .from("projects")
    .select("id")
    .eq("slug", String(slug).trim().toLowerCase())
    .single();

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const { data: last } = await supabaseAdmin
    .from("project_media")
    .select("sort_order")
    .eq("project_id", proj.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("project_media")
    .insert({
      project_id: proj.id,
      type,
      src,
      thumbnail: thumbnail ?? null,
      alt: alt ?? null,
      sort_order: nextOrder,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
