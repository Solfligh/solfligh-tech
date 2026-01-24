// app/lib/projectStore.ts
import "server-only";

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
      /**
       * Can be "" when demo is "coming soon".
       * Your ProjectMediaCarousel treats non-video src as "coming soon".
       */
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

  /**
   * Internal destination. Example: /projects/profitpilot
   * (Used when externalUrl is empty.)
   */
  href: string;

  /**
   * First-class external destination.
   * If set, /projects card opens externalUrl and /projects/[slug] redirects there.
   */
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

type DbRow = {
  slug: string;
  name: string;
  status: string;
  status_color: string;
  description: string;
  highlights: string[];
  cta_label: string;
  href: string;
  external_url: string | null;
  published: boolean;
  media: any; // jsonb

  problem: string;
  solution: string;
  key_features: string[];
  roadmap: string[];
  tech_stack: string[];

  updated_at: string;
};

function isValidExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const u = url.trim();
  return u.startsWith("https://") || u.startsWith("http://");
}

function normalizeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? "").trim()).filter(Boolean);
}

function normalizeMedia(v: unknown): MediaItem[] {
  if (!Array.isArray(v)) return [];
  const out: MediaItem[] = [];

  for (const m of v) {
    if (!m || typeof m !== "object") continue;
    const type = (m as any).type;

    if (type === "image") {
      const src = String((m as any).src ?? "").trim();
      if (!src) continue;
      out.push({
        type: "image",
        src,
        alt: (m as any).alt ? String((m as any).alt) : undefined,
        thumb: (m as any).thumb ? String((m as any).thumb) : undefined,
        thumbnail: (m as any).thumbnail ? String((m as any).thumbnail) : undefined,
      });
      continue;
    }

    if (type === "video") {
      // ✅ allow src to be "" (demo coming soon)
      const src = String((m as any).src ?? "").trim();
      out.push({
        type: "video",
        src,
        alt: (m as any).alt ? String((m as any).alt) : undefined,
        poster: (m as any).poster ? String((m as any).poster) : undefined,
        thumb: (m as any).thumb ? String((m as any).thumb) : undefined,
        thumbnail: (m as any).thumbnail ? String((m as any).thumbnail) : undefined,
      });
      continue;
    }
  }

  return out;
}

function toPayload(row: DbRow): ProjectPayload {
  return {
    slug: row.slug,
    name: row.name,
    status: row.status,
    statusColor: row.status_color,
    description: row.description,
    highlights: normalizeStringArray(row.highlights),
    ctaLabel: row.cta_label,
    href: row.href,
    externalUrl: isValidExternalUrl(row.external_url) ? row.external_url.trim() : null,
    published: !!row.published,
    media: normalizeMedia(row.media),

    problem: row.problem || "",
    solution: row.solution || "",
    keyFeatures: normalizeStringArray(row.key_features),
    roadmap: normalizeStringArray(row.roadmap),
    techStack: normalizeStringArray(row.tech_stack),

    updatedAt: row.updated_at,
  };
}

export async function listProjects(): Promise<ProjectPayload[]> {
  // ensures Next doesn't cache this request
  noStore();

  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    // Fail safely for UI
    return [];
  }

  const rows = (data || []) as DbRow[];
  return rows.map(toPayload);
}

export async function getProjectBySlug(slug: string): Promise<ProjectPayload | null> {
  noStore();

  const clean = String(slug || "").trim().toLowerCase();
  if (!clean) return null;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", clean)
    .maybeSingle();

  if (error || !data) return null;
  return toPayload(data as DbRow);
}

export async function upsertProject(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  noStore();

  const slug = String(input.slug || "").trim().toLowerCase();
  const name = String(input.name || "").trim();

  if (!slug) throw new Error("slug is required");
  if (!name) throw new Error("name is required");

  const externalUrl = isValidExternalUrl(input.externalUrl) ? input.externalUrl.trim() : null;

  const row = {
    slug,
    name,
    status: String(input.status || "Upcoming"),
    status_color: String(
      input.statusColor || "bg-slate-100 text-slate-700 border-slate-200"
    ),
    description: String(input.description || ""),
    highlights: normalizeStringArray(input.highlights),
    cta_label: String(input.ctaLabel || "View project"),
    href: String(input.href || `/projects/${slug}`),
    external_url: externalUrl,
    published: !!input.published,
    media: Array.isArray(input.media) ? input.media : [],

    problem: String(input.problem || ""),
    solution: String(input.solution || ""),
    key_features: normalizeStringArray(input.keyFeatures),
    roadmap: normalizeStringArray(input.roadmap),
    tech_stack: normalizeStringArray(input.techStack),
  };

  const { data, error } = await supabaseAdmin
    .from("projects")
    .upsert(row, { onConflict: "slug" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to save project");
  }

  return toPayload(data as DbRow);
}
