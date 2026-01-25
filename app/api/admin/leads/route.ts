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

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  // wrap in quotes if it contains commas/newlines/quotes
  if (/[",\n\r]/.test(s)) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}

function buildCsv(rows: any[]) {
  const headers = [
    "created_at",
    "status",
    "contacted_at",
    "project_slug",
    "name",
    "email",
    "company",
    "source",
    "message",
    "ip",
    "user_agent",
    "id",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => csvEscape((r as any)[h]))
        .join(",")
    ),
  ];

  return lines.join("\n");
}

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const project = (url.searchParams.get("project") || "").trim().toLowerCase();
  const status = (url.searchParams.get("status") || "").trim().toLowerCase(); // optional
  const format = (url.searchParams.get("format") || "").trim().toLowerCase(); // "csv"

  const page = Math.max(1, toInt(url.searchParams.get("page"), 1));
  const pageSize = Math.min(50, Math.max(5, toInt(url.searchParams.get("pageSize"), 15)));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("leads")
    .select(
      "id,project_slug,name,email,company,message,source,ip,user_agent,created_at,status,contacted_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (project) query = query.eq("project_slug", project);
  if (status) query = query.eq("status", status);

  if (q) {
    const needle = q.replace(/,/g, " ");
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

  // CSV export: export ALL matching rows (no pagination)
  if (format === "csv") {
    const { data, error } = await query;
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    const csv = buildCsv(data || []);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="leads.csv"`,
      },
    });
  }

  // JSON paginated
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

export async function PATCH(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });

  const id = String(body.id || "").trim();
  const nextStatus = String(body.status || "").trim().toLowerCase();

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  if (!["new", "contacted"].includes(nextStatus)) {
    return NextResponse.json({ ok: false, error: "status must be 'new' or 'contacted'" }, { status: 400 });
  }

  const patch: Record<string, any> = { status: nextStatus };
  patch.contacted_at = nextStatus === "contacted" ? new Date().toISOString() : null;

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select("id,status,contacted_at")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, lead: data });
}
