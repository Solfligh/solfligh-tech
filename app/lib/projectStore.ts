// app/lib/projectStore.ts
import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

export type MediaItem =
  | { type: "image"; src: string; alt?: string; thumbnail?: string }
  | { type: "video"; src: string; alt?: string; thumbnail?: string };

export type DemoInfo =
  | { status: "none" }
  | { status: "coming_soon"; thumbnail?: string }
  | { status: "live"; videoSrc: string; thumbnail?: string };

export type ProjectPayload = {
  slug: string;
  name: string;

  status: string;
  statusColor: string;

  description: string;
  highlights: string[];

  ctaLabel: string;

  /** Internal route (still useful for slug-based URLs) */
  href: string;

  /** If set, project is external and should open/redirect there */
  externalUrl?: string | null;

  /** Demo metadata (coming soon vs live) */
  demo?: DemoInfo;

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

const STORE_PATH = path.join(process.cwd(), "data", "projects.json");

function normalizeStoreShape(parsed: unknown): StoreShape {
  if (!parsed || typeof parsed !== "object") return { projects: [] };
  const projects = (parsed as any).projects;
  if (!Array.isArray(projects)) return { projects: [] };
  return { projects: projects as ProjectPayload[] };
}

async function readStore(): Promise<StoreShape> {
  noStore();

  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return normalizeStoreShape(parsed);
  } catch {
    return { projects: [] };
  }
}

async function writeStore(store: StoreShape) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function listProjects(): Promise<ProjectPayload[]> {
  const store = await readStore();
  return store.projects;
}

export async function upsertProject(
  input: Omit<ProjectPayload, "updatedAt">
): Promise<ProjectPayload> {
  const store = await readStore();

  const now = new Date().toISOString();
  const next: ProjectPayload = { ...input, updatedAt: now };

  const idx = store.projects.findIndex((p) => p.slug === input.slug);
  if (idx >= 0) store.projects[idx] = next;
  else store.projects.unshift(next);

  await writeStore(store);
  return next;
}
