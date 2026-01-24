import { NextResponse } from "next/server";
import { upsertProject } from "@/app/lib/projectStore";

export const runtime = "nodejs";

function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  const expected = process.env.ADMIN_TOKEN || "";
  if (!expected) return { ok: false as const, error: "ADMIN_TOKEN is not set on the server." };
  if (!token || token !== expected) return { ok: false as const, error: "Invalid admin token." };
  return { ok: true as const };
}

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return bad("Invalid JSON body");

  const slug = String(body.slug || "").trim().toLowerCase();
  const name = String(body.name || "").trim();

  if (!slug) return bad("slug is required");
  if (!name) return bad("name is required");
  if (!Array.isArray(body.media) || body.media.length === 0) return bad("media must be a non-empty array");

  const href = `/projects/${slug}`;

  const saved = await upsertProject({
    slug,
    name,
    status: String(body.status || "Upcoming"),
    statusColor: String(body.statusColor || "bg-slate-100 text-slate-700 border-slate-200"),
    description: String(body.description || ""),
    highlights: Array.isArray(body.highlights) ? body.highlights.map(String) : [],
    ctaLabel: String(body.ctaLabel || "View project"),
    href,
    published: Boolean(body.published),
    media: body.media,

    problem: String(body.problem || ""),
    solution: String(body.solution || ""),
    keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures.map(String) : [],
    roadmap: Array.isArray(body.roadmap) ? body.roadmap.map(String) : [],
    techStack: Array.isArray(body.techStack) ? body.techStack.map(String) : [],
  });

  return NextResponse.json({ ok: true, project: saved });
}
