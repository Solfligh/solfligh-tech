import { promises as fs } from "fs";
import path from "path";

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

const STORE_PATH = path.join(process.cwd(), "data", "projects.json");

async function readStore(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as any).projects)) {
      return { projects: [] };
    }

    return parsed as StoreShape;
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
