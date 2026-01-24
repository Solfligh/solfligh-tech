// app/lib/projectStore.ts
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export type MediaItem =
  | {
      type: "image";
      src: string;
      alt?: string;
      thumb?: string;
      thumbnail?: string;
    }
  | {
      type: "video";
      /** Can be empty when demo is "coming soon" */
      src: string;
      poster?: string;
      thumb?: string;
      thumbnail?: string;
      alt?: string;
    };

export type ProjectPayload = {
  slug: string;
  name: string;
  status: string;
  statusColor: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;

  // ✅ first-class external destination
  externalUrl?: string | null;

  published: boolean;
  media: MediaItem[];

  problem: string;
  solution: string;
  keyFeatures: string[];
  roadmap: string[];
  techStack: string[];

  updatedAt: string;
};

// -------------------------
// Helpers (safe normalizers)
// -------------------------

function s(x: unknown, fallback = ""): string {
  if (typeof x === "string") return x;
  if (x == null) return fallback;
  return String(x);
}

function b(x: unknown, fallback = false): boolean {
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  if (typeof x === "string") return x.toLowerCase() === "true";
  return fallback;
}

function arrStr(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.map((v) => s(v).trim()).filter(Boolean);
}

function isValidExternalUrl(x: unknown): string | null {
  if (typeof x !== "string") return null;
  const u = x.trim();
  if (!u) return null;
  if (u.startsWith("https://") || u.startsWith("http://")) return u;
  return null;
}

function normalizeMedia(rows: any[]): MediaItem[] {
  const safe = Array.isArray(rows) ? rows : [];
  const sorted = safe
    .slice()
    .sort((a, b) => (Number(a?.sort_order ?? 0) || 0) - (Number(b?.sort_order ?? 0) || 0));

  const out: MediaItem[] = [];

  for (const r of sorted) {
    const t = s(r?.type).toLowerCase();
    if (t !== "image" && t !== "video") continue;

    if (t === "video") {
      out.push({
        type: "video",
        src: s(r?.src, ""), // can be ""
        alt: r?.alt ? s(r.alt) : undefined,
        poster: r?.poster ? s(r.poster) : undefined,
        thumb: r?.thumb ? s(r.thumb) : undefined,
        thumbnail: r?.thumbnail ? s(r.thumbnail) : undefined,
      });
    } else {
      out.push({
        type: "image",
        src: s(r?.src, ""),
        alt: r?.alt ? s(r.alt) : undefined,
        thumb: r?.thumb ? s(r.thumb) : undefined,
        thumbnail: r?.thumbnail ? s(r.thumbnail) : undefined,
      });
    }
  }

  return out;
}

function normalizeProject(projectRow: any, mediaRows: any[]): ProjectPayload {
  const slug = s(projectRow?.slug).trim();
  const name = s(projectRow?.name).trim();

  return {
    slug,
    name,
    status: s(projectRow?.status, "Upcoming"),
    statusColor: s(
      projectRow?.status_color,
      "bg-slate-100 text-slate-700 border-slate-200"
    ),
    description: s(projectRow?.description, ""),
    highlights: arrStr(projectRow?.highlights),
    ctaLabel: s(projectRow?.cta_label, "View project"),
    href: s(projectRow?.href, `/projects/${slug}`),

    externalUrl: isValidExternalUrl(projectRow?.external_url),

    published: b(projectRow?.published, false),
    media: normalizeMedia(mediaRows),

    problem: s(projectRow?.problem, ""),
    solution: s(projectRow?.solution, ""),
    keyFeatures: arrStr(projectRow?.key_features),
    roadmap: arrStr(projectRow?.roadmap),
    techStack: arrStr(projectRow?.tech_stack),

    updatedAt: s(projectRow?.updated_at, new Date().toISOString()),
  };
}

// -------------------------
// Public API
// -------------------------

export async function listProjects(): Promise<ProjectPayload[]> {
  noStore();

  // 1) Read projects
  const { data: projects, error: pErr } = await supabaseAdmin
    .from("projects")
    .select(
      [
        "slug",
        "name",
        "status",
        "status_color",
        "description",
        "highlights",
        "cta_label",
        "href",
        "external_url",
        "published",
        "problem",
        "solution",
        "key_features",
        "roadmap",
        "tech_stack",
        "updated_at",
      ].join(",")
    )
    .order("updated_at", { ascending: false });

  if (pErr) throw new Error(pErr.message);

  const safeProjects = Array.isArray(projects) ? projects : [];
  if (safeProjects.length === 0) return [];

  // 2) Read media for those slugs
  const slugs = safeProjects.map((p: any) => s(p?.slug)).filter(Boolean);

  const { data: mediaRows, error: mErr } = await supabaseAdmin
    .from("project_media")
    .select("project_slug, sort_order, type, src, alt, poster, thumb, thumbnail")
    .in("project_slug", slugs);

  if (mErr) throw new Error(mErr.message);

  const bySlug = new Map<string, any[]>();
  for (const m of Array.isArray(mediaRows) ? mediaRows : []) {
    const key = s(m?.project_slug);
    if (!key) continue;
    const arr = bySlug.get(key) || [];
    arr.push(m);
    bySlug.set(key, arr);
  }

  return safeProjects.map((p: any) => normalizeProject(p, bySlug.get(s(p?.slug)) || []));
}

export async function upsertProject(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  noStore();

  const now = new Date().toISOString();

  // Upsert project (Supabase returns loosely typed data; normalize later)
  const projectUpsert = {
    slug: input.slug,
    name: input.name,
    status: input.status,
    status_color: input.statusColor,
    description: input.description,
    highlights: input.highlights,
    cta_label: input.ctaLabel,
    href: input.href,
    external_url: isValidExternalUrl(input.externalUrl) ?? null,
    published: input.published,

    problem: input.problem,
    solution: input.solution,
    key_features: input.keyFeatures,
    roadmap: input.roadmap,
    tech_stack: input.techStack,

    updated_at: now,
  };

  const { data: savedProject, error: upErr } = await supabaseAdmin
    .from("projects")
    .upsert(projectUpsert, { onConflict: "slug" })
    .select(
      [
        "slug",
        "name",
        "status",
        "status_color",
        "description",
        "highlights",
        "cta_label",
        "href",
        "external_url",
        "published",
        "problem",
        "solution",
        "key_features",
        "roadmap",
        "tech_stack",
        "updated_at",
      ].join(",")
    )
    .single();

  if (upErr) throw new Error(upErr.message);

  // Replace media for that slug (simple + reliable)
  const { error: delErr } = await supabaseAdmin
    .from("project_media")
    .delete()
    .eq("project_slug", input.slug);

  if (delErr) throw new Error(delErr.message);

  const mediaInsert = (Array.isArray(input.media) ? input.media : []).map((m, idx) => {
    if (m.type === "video") {
      return {
        project_slug: input.slug,
        sort_order: idx,
        type: "video",
        src: s((m as any).src, ""), // can be ""
        alt: (m as any).alt ?? null,
        poster: (m as any).poster ?? null,
        thumb: (m as any).thumb ?? null,
        thumbnail: (m as any).thumbnail ?? null,
      };
    }

    return {
      project_slug: input.slug,
      sort_order: idx,
      type: "image",
      src: s((m as any).src, ""),
      alt: (m as any).alt ?? null,
      poster: null,
      thumb: (m as any).thumb ?? null,
      thumbnail: (m as any).thumbnail ?? null,
    };
  });

  if (mediaInsert.length > 0) {
    const { error: insErr } = await supabaseAdmin.from("project_media").insert(mediaInsert);
    if (insErr) throw new Error(insErr.message);
  }

  // Re-read media to return a clean normalized payload
  const { data: finalMedia, error: fmErr } = await supabaseAdmin
    .from("project_media")
    .select("project_slug, sort_order, type, src, alt, poster, thumb, thumbnail")
    .eq("project_slug", input.slug);

  if (fmErr) throw new Error(fmErr.message);

  return normalizeProject(savedProject, Array.isArray(finalMedia) ? finalMedia : []);
}
