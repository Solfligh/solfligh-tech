import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * data/projects.json must match the Supabase projects table.
 *
 * It is the fallback the site serves when Supabase is unreachable, so drift
 * only shows up during an outage — the worst possible moment to discover the
 * fallback is wrong. Keeping them in step by hand already failed once: the file
 * carried a `demo` object the app no longer reads and had lost `featured`
 * entirely.
 *
 * When this fails, run `npm run sync:projects`.
 */

const hasCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const describeDb = hasCredentials ? describe : describe.skip;

function readFallback(): { projects: Array<Record<string, unknown>> } {
  const file = path.resolve(process.cwd(), "data", "projects.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

describeDb("data/projects.json fallback", () => {
  it("contains the same projects as Supabase", async () => {
    const { listProjects } = await import("@/app/lib/projectStore");
    const live = await listProjects();
    const fallback = readFallback().projects;

    expect(fallback.map((p) => p.slug).sort()).toEqual(live.map((p) => p.slug).sort());
  });

  it("matches Supabase field for field", async () => {
    const { listProjects } = await import("@/app/lib/projectStore");
    const live = await listProjects();
    const fallback = readFallback().projects;

    const bySlug = new Map(fallback.map((p) => [p.slug as string, p]));

    for (const project of live) {
      const stored = bySlug.get(project.slug);
      expect(stored, `${project.slug} missing from data/projects.json`).toBeTruthy();
      // Compared whole rather than field by field, so a new column added to the
      // table is caught too, not just the fields someone thought to list.
      expect(stored, `${project.slug} differs — run npm run sync:projects`).toEqual(project);
    }
  });

  it("carries the fields the app actually reads", async () => {
    // The drift that prompted this: `demo` instead of `demoStatus`, and no
    // `featured` at all. Both would have been silently wrong in a fallback.
    const fallback = readFallback().projects;

    for (const p of fallback) {
      expect(p, `${p.slug} should not carry the retired "demo" field`).not.toHaveProperty("demo");
      expect(p).toHaveProperty("demoStatus");
      expect(p).toHaveProperty("featured");
      expect(typeof p.featured).toBe("boolean");
      expect(["none", "demo", "live"]).toContain(p.demoStatus);
    }
  });

  it("is never empty, since an empty fallback is worse than a stale one", () => {
    expect(readFallback().projects.length).toBeGreaterThan(0);
  });
});
