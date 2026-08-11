import { NextResponse } from "next/server";
import { upsertProject, asDemoStatus } from "../../../lib/projectStore";
import { requireAdmin } from "../_auth";

export const runtime = "nodejs";


function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

function isValidExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const u = url.trim();
  return u.startsWith("https://") || u.startsWith("http://");
}

export async function POST(req: Request) {
  // 🔐 Auth
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  // 📦 Body
  const body = await req.json().catch(() => null);
  if (!body) return bad("Invalid JSON body");

  const slug = String(body.slug || "").trim().toLowerCase();
  const name = String(body.name || "").trim();

  if (!slug) return bad("slug is required");
  if (!name) return bad("name is required");

  // ✅ media: allow video with empty src (demo coming soon), but require at least 1 item
  const media = Array.isArray(body.media) ? body.media : [];
  if (media.length === 0) return bad("media must be a non-empty array");

  // internal default
  const href = String(body.href || `/products/${slug}`);

  // ✅ externalUrl first-class
  const externalUrl = isValidExternalUrl(body.externalUrl) ? String(body.externalUrl).trim() : null;

  // 💾 Save (Supabase)
  const saved = await upsertProject({
    slug,
    name,
    status: String(body.status || "Upcoming"),
    statusColor: String(
      body.statusColor || "bg-slate-100 text-slate-700 border-slate-200"
    ),
    description: String(body.description || ""),
    highlights: Array.isArray(body.highlights) ? body.highlights.map(String) : [],
    ctaLabel: String(body.ctaLabel || (externalUrl ? "Open project" : "View project")),
    href,
    externalUrl,
    published: Boolean(body.published),
    demoStatus: asDemoStatus(body.demoStatus),
    featured: Boolean(body.featured),
    media,

    problem: String(body.problem || ""),
    solution: String(body.solution || ""),
    keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures.map(String) : [],
    roadmap: Array.isArray(body.roadmap) ? body.roadmap.map(String) : [],
    techStack: Array.isArray(body.techStack) ? body.techStack.map(String) : [],
  });

  return NextResponse.json({ ok: true, project: saved });
}
