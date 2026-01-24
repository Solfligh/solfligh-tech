// app/lib/projectStore.ts
import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

export type MediaItem =
  | { type: "image"; src: string; alt?: string; thumbnail?: string }
  | { type: "video"; src: string; thumbnail?: string };

export type ProjectPayload = {
  slug: string;
  name: string;
  status: string;
  statusColor: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
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

// ✅ Preferred store location (same as your current code)
const STORE_PATH = path.join(process.cwd(), "data", "projects.json");

// ✅ Also try common alternate locations in case the JSON lives elsewhere
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

async function readStore(): Promise<StoreShape> {
  // ✅ Critical: disables Next/Vercel caching for this request
  // So updates to projects.json reflect immediately.
  noStore();

  let lastErr: unknown = null;

  for (const filePath of READ_CANDIDATES) {
    try {
      return await readStoreFrom(filePath);
    } catch (err) {
      lastErr = err;
    }
  }

  // If none found / all fail, return empty safely
  // (In dev, you can log lastErr if needed.)
  return { projects: [] };
}

async function writeStore(store: StoreShape) {
  // NOTE:
  // Writing to the filesystem on Vercel serverless is not persistent across deploys/instances.
  // This is fine for local/dev, but for production you should store this in a DB or CMS.
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
