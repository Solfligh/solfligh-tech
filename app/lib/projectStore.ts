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

/**
 * IMPORTANT:
 * This store is now SUPABASE-FIRST (service role).
 * No JSON writes — because Vercel filesystem is not persistent.
 *
 * Assumes these tables:
 * - public.projects (primary key: slug)
 * - public.project_media (project_slug fk to projects.slug OR store project_slug text)
 *
 * If your project_media uses project_id instead, tell me and I’ll adjust in one shot.
 */

type ProjectRow = {
  slug: string;
  name: string;
  status: string | null;
  status_color: string | null;
  description: string | null;
  highlights: string[] | null;
  cta_label: string | null;
  href: string | null;
  external_url: string | null;
  published: boolean | null;

  problem: string | null;
  solution: string | null;
  key_features: string[] | null;
  roadmap: string[] | null;
  tech_stack: string[] | null;

  updated_at: string | null;
};

type MediaRow = {
  id?: string;
  project_slug: string;
  sort_order: number | null;

  type: "image" | "video";
  src: string | null;
  alt: string | null;
  poster: string | null;
  thumb: string | null;
  thumbnail: string | null;
};

function asStringArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.map(String).map((s) => s.trim()).filter(Boolean);
}

function normalizeProject(row: ProjectRow, media: MediaRow[]): ProjectPayload {
  return {
    slug: row.slug,
    name: row.name,
    status: row.status ?? "Upcoming",
    statusColor: row.status_color ?? "bg-slate-100 text-slate-700 border-slate-200",
    description: row.description ?? "",
    highlights: asStringArray(row.highlights),
    ctaLabel: row.cta_label ?? "View project",
    href: row.href ?? `/projects/${row.slug}`,
    externalUrl: row.external_url ?? null,
    published: Boolean(row.published),

    media: (media || [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((m) => {
        if (m.type === "video") {
          return {
            type: "video" as const,
            src: m.src ?? "",
            alt: m.alt ?? undefined,
            poster: m.poster ?? undefined,
            thumb: m.thumb ?? undefined,
            thumbnail: m.thumbnail ?? undefined,
          };
        }
        return {
          type: "image" as const,
          src: m.src ?? "",
          alt: m.alt ?? undefined,
          thumb: m.thumb ?? undefined,
          thumbnail: m.thumbnail ?? undefined,
        };
      }),

    problem: row.problem ?? "",
    solution: row.solution ?? "",
    keyFeatures: asStringArray(row.key_features),
    roadmap: asStringArray(row.roadmap),
    techStack: asStringArray(row.tech_stack),

    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

export async function listProjects(): Promise<ProjectPayload[]> {
  noStore();

  // 1) read all projects
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
  const safeProjects = (projects || []) as ProjectRow[];

  if (safeProjects.length === 0) return [];

  // 2) read media for those slugs
  const slugs = safeProjects.map((p) => p.slug);
  const { data: mediaRows, error: mErr } = await supabaseAdmin
    .from("project_media")
    .select("project_slug, sort_order, type, src, alt, poster, thumb, thumbnail")
    .in("project_slug", slugs);

  if (mErr) throw new Error(mErr.message);

  const mediaBySlug = new Map<string, MediaRow[]>();
  for (const m of (mediaRows || []) as MediaRow[]) {
    const arr = mediaBySlug.get(m.project_slug) || [];
    arr.push(m);
    mediaBySlug.set(m.project_slug, arr);
  }

  return safeProjects.map((p) => normalizeProject(p, mediaBySlug.get(p.slug) || []));
}

export async function upsertProject(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  noStore();

  const now = new Date().toISOString();

  // Upsert project
  const projectUpsert: Partial<ProjectRow> & { slug: string; name: string } = {
    slug: input.slug,
    name: input.name,
    status: input.status,
    status_color: input.statusColor,
    description: input.description,
    highlights: input.highlights,
    cta_label: input.ctaLabel,
    href: input.href,
    external_url: input.externalUrl ?? null,
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

  // Replace media rows (simple + reliable)
  const { error: delErr } = await supabaseAdmin.from("project_media").delete().eq("project_slug", input.slug);
  if (delErr) throw new Error(delErr.message);

  const mediaInsert: MediaRow[] = (input.media || []).map((m, idx) => {
    if (m.type === "video") {
      return {
        project_slug: input.slug,
        sort_order: idx,
        type: "video",
        src: m.src ?? "",
        alt: m.alt ?? null,
        poster: (m as any).poster ?? null,
        thumb: (m as any).thumb ?? null,
        thumbnail: (m as any).thumbnail ?? null,
      };
    }
    return {
      project_slug: input.slug,
      sort_order: idx,
      type: "image",
      src: m.src ?? "",
      alt: m.alt ?? null,
      poster: null,
      thumb: (m as any).thumb ?? null,
      thumbnail: (m as any).thumbnail ?? null,
    };
  });

  if (mediaInsert.length > 0) {
    const { error: insErr } = await supabaseAdmin.from("project_media").insert(mediaInsert);
    if (insErr) throw new Error(insErr.message);
  }

  // Re-read media to return normalized payload
  const { data: finalMedia, error: fmErr } = await supabaseAdmin
    .from("project_media")
    .select("project_slug, sort_order, type, src, alt, poster, thumb, thumbnail")
    .eq("project_slug", input.slug);

  if (fmErr) throw new Error(fmErr.message);

  return normalizeProject(savedProject as ProjectRow, (finalMedia || []) as MediaRow[]);
}
