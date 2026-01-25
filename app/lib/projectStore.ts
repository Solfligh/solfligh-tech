// app/lib/projectStore.ts
import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export type MediaItem =
  | { type: "image"; src: string; alt?: string; thumbnail?: string }
  | { type: "video"; src: string; alt?: string; thumbnail?: string };

export type DemoStatus = "none" | "demo" | "live";

export type ProjectPayload = {
  slug: string;
  name: string;
  status: string;
  statusColor: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;

  // ✅ external destination
  externalUrl?: string | null;

  // ✅ new flags
  demoStatus: DemoStatus;
  featured: boolean;

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
  highlights: any;
  cta_label: string | null;
  href: string | null;
  external_url: string | null;

  // ✅ new db columns
  demo_status: string | null;
  featured: boolean | null;

  published: boolean | null;
  problem: string | null;
  solution: string | null;
  key_features: any;
  roadmap: any;
  tech_stack: any;
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

function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [];
}

function asDemoStatus(v: any): ProjectPayload["demoStatus"] {
  const s = String(v || "").toLowerCase();
  if (s === "demo" || s === "live") return s;
  return "none";
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

    demoStatus: asDemoStatus(p.demo_status),
    featured: Boolean(p.featured),

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
      "id,slug,name,status,status_color,description,highlights,cta_label,href,external_url,demo_status,featured,published,problem,solution,key_features,roadmap,tech_stack,updated_at"
    )
    // featured first, then newest
    .order("featured", { ascending: false })
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
    if (!m.src) continue;

    const item: MediaItem =
      m.type === "video"
        ? { type: "video", src: m.src, thumbnail: m.thumbnail || undefined, alt: m.alt || undefined }
        : { type: "image", src: m.src, thumbnail: m.thumbnail || undefined, alt: m.alt || undefined };

    const arr = bySlug.get(s) || [];
    arr.push(item);
    bySlug.set(s, arr);
  }

  return rows.map((p) => toPayload(p, bySlug.get(p.slug) || []));
}

async function upsertProjectToSupabase(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  noStore();

  const now = new Date().toISOString();

  const { data: upserted, error } = await supabaseAdmin
    .from("projects")
    .upsert(
      {
        slug: input.slug,
        name: input.name,
        status: input.status,
        status_color: input.statusColor,
        description: input.description,
        highlights: input.highlights,
        cta_label: input.ctaLabel,
        href: input.href,
        external_url: input.externalUrl ?? null,

        // ✅ new columns
        demo_status: input.demoStatus ?? "none",
        featured: Boolean(input.featured),

        published: input.published,
        problem: input.problem,
        solution: input.solution,
        key_features: input.keyFeatures,
        roadmap: input.roadmap,
        tech_stack: input.techStack,
        updated_at: now,
      },
      { onConflict: "slug" }
    )
    .select(
      "id,slug,name,status,status_color,description,highlights,cta_label,href,external_url,demo_status,featured,published,problem,solution,key_features,roadmap,tech_stack,updated_at"
    )
    .single();

  if (error) throw error;
  const proj = upserted as DbProjectRow;

  // Replace media
  await supabaseAdmin.from("project_media").delete().eq("project_slug", input.slug);

  if (Array.isArray(input.media) && input.media.length > 0) {
    const payload = input.media
      .filter((m) => m && typeof m.src === "string" && (m.type === "image" || m.type === "video"))
      .map((m, idx) => ({
        project_id: proj.id,
        project_slug: input.slug,
        type: m.type,
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
 * Public API
 */
export async function listProjects(): Promise<ProjectPayload[]> {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (hasSupabase) {
    try {
      return await listProjectsFromSupabase();
    } catch {
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
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (hasSupabase) {
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
