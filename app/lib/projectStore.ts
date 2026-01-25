// app/lib/projectStore.ts
import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export type MediaItem =
  | { type: "image"; src: string; alt?: string; thumbnail?: string }
  | { type: "video"; src: string; alt?: string; thumbnail?: string };

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

type StoreShape = { projects: ProjectPayload[] };

// JSON fallback (dev/local)
const STORE_PATH = path.join(process.cwd(), "data", "projects.json");
const READ_CANDIDATES = [
  STORE_PATH,
  path.join(process.cwd(), "app", "data", "projects.json"),
  path.join(process.cwd(), "public", "data", "projects.json"),
  path.join(process.cwd(), "projects.json"),
];

function normalizeStoreShape(parsed: unknown): StoreShape {
  if (!parsed || typeof parsed !== "object") return { projects: [] };
  const projects = (parsed as any).projects;
  if (!Array.isArray(projects)) return { projects: [] };
  return { projects: projects as ProjectPayload[] };
}

async function readStoreFrom(filePath: string): Promise<StoreShape> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return normalizeStoreShape(parsed);
}

async function readJsonStore(): Promise<StoreShape> {
  noStore();

  let lastErr: unknown = null;
  for (const filePath of READ_CANDIDATES) {
    try {
      return await readStoreFrom(filePath);
    } catch (err) {
      lastErr = err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ignore = lastErr;
  return { projects: [] };
}

async function writeJsonStore(store: StoreShape) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

/**
 * Supabase helpers
 * Tables:
 *  - public.projects
 *  - public.project_media
 */
type DbProjectRow = {
  id: string;
  slug: string;
  name: string;
  status: string | null;
  status_color: string | null;
  description: string | null;

  // text[] in Postgres (Supabase JS returns string[] usually)
  highlights: unknown;

  cta_label: string | null;
  href: string | null;
  external_url: string | null;
  published: boolean | null;

  problem: string | null;
  solution: string | null;

  // text[] in Postgres
  key_features: unknown;
  roadmap: unknown;
  tech_stack: unknown;

  updated_at: string | null;
};

type DbMediaRow = {
  project_slug: string | null;
  type: "image" | "video" | string;
  src: string | null;
  thumbnail: string | null;
  alt: string | null;
  sort_order: number | null;
};

function isSupabaseEnabled() {
  // Must match your supabaseAdmin.ts env usage
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return !!url && !!key;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [];
}

function toPayload(p: DbProjectRow, media: MediaItem[]): ProjectPayload {
  const slug = p.slug;
  const name = p.name;

  return {
    slug,
    name,
    status: p.status || "Upcoming",
    statusColor: p.status_color || "bg-slate-100 text-slate-700 border-slate-200",
    description: p.description || "",
    highlights: asStringArray(p.highlights),
    ctaLabel: p.cta_label || "View project",
    href: p.href || `/projects/${slug}`,
    externalUrl: p.external_url,
    published: Boolean(p.published),
    media,

    problem: p.problem || "",
    solution: p.solution || "",
    keyFeatures: asStringArray(p.key_features),
    roadmap: asStringArray(p.roadmap),
    techStack: asStringArray(p.tech_stack),

    updatedAt: p.updated_at || new Date().toISOString(),
  };
}

async function listProjectsFromSupabase(): Promise<ProjectPayload[]> {
  noStore();

  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select(
      "id,slug,name,status,status_color,description,highlights,cta_label,href,external_url,published,problem,solution,key_features,roadmap,tech_stack,updated_at"
    )
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const rows = (projects || []) as DbProjectRow[];
  if (rows.length === 0) return [];

  const slugs = rows.map((r) => r.slug);

  const { data: mediaRows, error: mediaErr } = await supabaseAdmin
    .from("project_media")
    .select("project_slug,type,src,thumbnail,alt,sort_order")
    .in("project_slug", slugs)
    .order("sort_order", { ascending: true });

  if (mediaErr) throw mediaErr;

  const bySlug = new Map<string, MediaItem[]>();

  for (const m of (mediaRows || []) as DbMediaRow[]) {
    const s = (m.project_slug || "").trim();
    if (!s) continue;

    const type = String(m.type || "").toLowerCase();

    // ✅ IMPORTANT:
    // - Images MUST have src
    // - Videos may have empty src ("demo coming soon")
    if (type === "image") {
      const src = (m.src || "").trim();
      if (!src) continue;

      const item: MediaItem = {
        type: "image",
        src,
        thumbnail: m.thumbnail || undefined,
        alt: m.alt || undefined,
      };

      const arr = bySlug.get(s) || [];
      arr.push(item);
      bySlug.set(s, arr);
      continue;
    }

    if (type === "video") {
      // allow empty string
      const src = (m.src ?? "").toString();

      const item: MediaItem = {
        type: "video",
        src,
        thumbnail: m.thumbnail || undefined,
        alt: m.alt || undefined,
      };

      const arr = bySlug.get(s) || [];
      arr.push(item);
      bySlug.set(s, arr);
      continue;
    }

    // ignore unknown types
  }

  return rows.map((p) => toPayload(p, bySlug.get(p.slug) || []));
}

async function upsertProjectToSupabase(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  noStore();

  const now = new Date().toISOString();

  // 1) Upsert project by slug
  const { data: upserted, error } = await supabaseAdmin
    .from("projects")
    .upsert(
      {
        slug: input.slug,
        name: input.name,
        status: input.status,
        status_color: input.statusColor,
        description: input.description,
        highlights: input.highlights, // text[]
        cta_label: input.ctaLabel,
        href: input.href,
        external_url: input.externalUrl ?? null,
        published: input.published,
        problem: input.problem,
        solution: input.solution,
        key_features: input.keyFeatures, // text[]
        roadmap: input.roadmap, // text[]
        tech_stack: input.techStack, // text[]
        updated_at: now,
      },
      { onConflict: "slug" }
    )
    .select(
      "id,slug,name,status,status_color,description,highlights,cta_label,href,external_url,published,problem,solution,key_features,roadmap,tech_stack,updated_at"
    )
    .single();

  if (error) throw error;
  const proj = upserted as DbProjectRow;

  // 2) Replace media rows for this project
  await supabaseAdmin.from("project_media").delete().eq("project_slug", input.slug);

  if (Array.isArray(input.media) && input.media.length > 0) {
    const payload = input.media
      .filter((m) => m && typeof m.src === "string" && (m.type === "image" || m.type === "video"))
      .map((m, idx) => ({
        project_id: proj.id,
        project_slug: input.slug,
        type: m.type,
        // allow "" for "video coming soon"
        src: m.src,
        thumbnail: (m as any).thumbnail ?? null,
        alt: (m as any).alt ?? null,
        sort_order: idx,
      }));

    const { error: mediaInsertErr } = await supabaseAdmin.from("project_media").insert(payload);
    if (mediaInsertErr) throw mediaInsertErr;
  }

  return toPayload(proj, input.media || []);
}

/**
 * ✅ Health check helper (Step 2)
 * Useful when "projects not showing" on Vercel.
 */
export async function getProjectsHealth(): Promise<{
  ok: boolean;
  source: "supabase" | "json";
  supabaseEnabled: boolean;
  counts?: {
    totalProjects: number;
    publishedProjects: number;
    mediaRows: number;
  };
  error?: string;
}> {
  noStore();

  const supabaseEnabled = isSupabaseEnabled();

  if (!supabaseEnabled) {
    // JSON only
    const store = await readJsonStore();
    const totalProjects = store.projects.length;
    const publishedProjects = store.projects.filter((p) => p.published).length;

    return {
      ok: true,
      source: "json",
      supabaseEnabled,
      counts: { totalProjects, publishedProjects, mediaRows: 0 },
    };
  }

  try {
    const { count: totalProjects, error: pErr } = await supabaseAdmin
      .from("projects")
      .select("id", { count: "exact", head: true });

    if (pErr) throw pErr;

    const { count: publishedProjects, error: pubErr } = await supabaseAdmin
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", true);

    if (pubErr) throw pubErr;

    const { count: mediaRows, error: mErr } = await supabaseAdmin
      .from("project_media")
      .select("id", { count: "exact", head: true });

    if (mErr) throw mErr;

    return {
      ok: true,
      source: "supabase",
      supabaseEnabled,
      counts: {
        totalProjects: totalProjects ?? 0,
        publishedProjects: publishedProjects ?? 0,
        mediaRows: mediaRows ?? 0,
      },
    };
  } catch (e: any) {
    return {
      ok: false,
      source: "supabase",
      supabaseEnabled,
      error: e?.message || String(e),
    };
  }
}

/**
 * Public API
 */
export async function listProjects(): Promise<ProjectPayload[]> {
  if (isSupabaseEnabled()) {
    try {
      return await listProjectsFromSupabase();
    } catch {
      // fallback to JSON if Supabase fails
      const store = await readJsonStore();
      return store.projects;
    }
  }

  const store = await readJsonStore();
  return store.projects;
}

export async function upsertProject(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  if (isSupabaseEnabled()) {
    return await upsertProjectToSupabase(input);
  }

  // JSON fallback
  const store = await readJsonStore();
  const now = new Date().toISOString();
  const next: ProjectPayload = { ...input, updatedAt: now };

  const idx = store.projects.findIndex((p) => p.slug === input.slug);
  if (idx >= 0) store.projects[idx] = next;
  else store.projects.unshift(next);

  await writeJsonStore(store);
  return next;
}
