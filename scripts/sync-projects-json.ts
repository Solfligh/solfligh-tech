/**
 * Regenerate data/projects.json from Supabase.
 *
 *   npx tsx scripts/sync-projects-json.ts          write the file
 *   npx tsx scripts/sync-projects-json.ts --check  report drift, write nothing
 *
 * Supabase is the source of truth; the JSON is the fallback the site serves if
 * Supabase is unreachable (CLAUDE.md). Keeping them in step by hand has already
 * failed once — the file drifted to a `demo` field the app no longer reads and
 * lost `featured` entirely, which would only have surfaced during an outage.
 *
 * This deliberately goes through listProjects(), the same function the site
 * uses, so the file is exactly what the app would have produced from the
 * database rather than a second hand-maintained mapping.
 */
import fs from "fs";
import path from "path";

// Load .env.local before anything imports the Supabase client.
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const TARGET = path.resolve(process.cwd(), "data", "projects.json");
const checkOnly = process.argv.includes("--check");

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("  Supabase credentials missing. Run from the project root with .env.local present.");
    process.exit(1);
  }

  const { listProjects } = await import("../app/lib/projectStore");
  const projects = await listProjects();

  if (!projects.length) {
    // Refuse to overwrite a good fallback with nothing.
    console.error("  Supabase returned no projects. Refusing to write an empty fallback.");
    process.exit(1);
  }

  const next = JSON.stringify({ projects }, null, 2) + "\n";
  const current = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, "utf8") : "";

  if (current === next) {
    console.log(`  data/projects.json is in sync (${projects.length} projects).`);
    return;
  }

  if (checkOnly) {
    console.error("  data/projects.json is OUT OF SYNC with Supabase.");
    console.error("  Run: npm run sync:projects");

    // Show which slugs and top-level fields differ, rather than a raw diff.
    try {
      const currentProjects = JSON.parse(current || "{}").projects ?? [];
      const bySlug = new Map(currentProjects.map((p: { slug: string }) => [p.slug, p]));

      for (const p of projects) {
        const old = bySlug.get(p.slug) as Record<string, unknown> | undefined;
        if (!old) {
          console.error(`    + ${p.slug} is missing from the file`);
          continue;
        }
        const fields = new Set([...Object.keys(old), ...Object.keys(p)]);
        const differing = [...fields].filter(
          (f) => JSON.stringify(old[f]) !== JSON.stringify((p as Record<string, unknown>)[f])
        );
        if (differing.length) console.error(`    ~ ${p.slug}: ${differing.join(", ")}`);
      }
      for (const slug of bySlug.keys()) {
        if (!projects.some((p) => p.slug === slug)) {
          console.error(`    - ${slug} is in the file but not in Supabase`);
        }
      }
    } catch {
      console.error("    (could not parse the existing file to compare)");
    }

    process.exit(1);
  }

  fs.mkdirSync(path.dirname(TARGET), { recursive: true });
  fs.writeFileSync(TARGET, next);
  console.log(`  data/projects.json rewritten from Supabase (${projects.length} projects).`);
}

main().catch((err) => {
  console.error("  Sync failed:", err);
  process.exit(1);
});
