// app/api/admin/leads/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  const expected = process.env.ADMIN_TOKEN || "";

  if (!expected) {
    return { ok: false as const, error: "ADMIN_TOKEN is not set on the server." };
  }

  if (!token || token !== expected) {
    return { ok: false as const, error: "Invalid admin token." };
  }

  return { ok: true as const };
}

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const project = (url.searchParams.get("project") || "").trim().toLowerCase();
  const page = Math.max(1, toInt(url.searchParams.get("page"), 1));
  const pageSize = Math.min(50, Math.max(5, toInt(url.searchParams.get("pageSize"), 15)));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("leads")
    .select(
      "id,project_slug,name,email,company,message,source,ip,user_agent,created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (project) query = query.eq("project_slug", project);

  if (q) {
    // match name OR email OR company OR message OR project_slug
    // Supabase uses PostgREST filter syntax:
    // or=(col.ilike.*x*,col2.ilike.*x*)
    const needle = q.replace(/,/g, " "); // avoid breaking the filter
    query = query.or(
      [
        `name.ilike.%${needle}%`,
        `email.ilike.%${needle}%`,
        `company.ilike.%${needle}%`,
        `message.ilike.%${needle}%`,
        `project_slug.ilike.%${needle}%`,
      ].join(",")
    );
  }

  const { data, error, count } = await query.range(from, to);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    page,
    pageSize,
    total: count || 0,
    leads: data || [],
  });
}
