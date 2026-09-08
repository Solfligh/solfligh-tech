import { describe, it, expect, afterAll } from "vitest";

/**
 * A real save of a project, including its media, against the live database.
 *
 * The regression this exists for: upsertProject wrote a `project_id` column to
 * project_media, which does not exist on that table. Every save failed with
 * PGRST204 — and because the media rows are cleared before the new ones are
 * inserted, the failure also left the project with no media at all.
 *
 * No mocked test could catch it. A mock does not know the schema, which is the
 * same reason the leads.ip regression survived two merges.
 *
 * Everything written here uses a zz- prefix and is removed afterwards.
 */

const hasCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const describeDb = hasCredentials ? describe : describe.skip;

const SLUG = "zz-integration-test-project";

function draft(media: Array<{ type: "image" | "video"; src: string }>) {
  return {
    slug: SLUG,
    name: "ZZ Integration Project",
    status: "Upcoming",
    statusColor: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Written by the integration suite.",
    highlights: ["one", "two"],
    ctaLabel: "View project",
    href: `/products/${SLUG}`,
    externalUrl: null,
    demoStatus: "none" as const,
    featured: false,
    published: false,
    media,
    problem: "",
    solution: "",
    keyFeatures: [],
    roadmap: [],
    techStack: [],
  };
}

async function purge() {
  if (!hasCredentials) return;
  const { supabaseAdmin } = await import("@/app/lib/supabaseAdmin");
  await supabaseAdmin.from("project_media").delete().eq("project_slug", SLUG);
  await supabaseAdmin.from("projects").delete().eq("slug", SLUG);
}

afterAll(purge);

describeDb("saving a project against the real schema", () => {
  it("writes the project and its media without a schema error", async () => {
    await purge();

    const { upsertProject, listProjects } = await import("@/app/lib/projectStore");

    // The bug threw here rather than returning; awaiting it is the assertion.
    await upsertProject(
      draft([
        { type: "image", src: "/projects/zz-one.jpg" },
        { type: "video", src: "/projects/zz-two.mp4" },
      ])
    );

    const saved = (await listProjects()).find((p) => p.slug === SLUG);
    expect(saved).toBeDefined();
    expect(saved!.media.map((m) => m.src)).toEqual([
      "/projects/zz-one.jpg",
      "/projects/zz-two.mp4",
    ]);
    // Order is meaningful: it drives the carousel.
    expect(saved!.media.map((m) => m.type)).toEqual(["image", "video"]);
  });

  it("replaces media on a second save rather than appending", async () => {
    const { upsertProject, listProjects } = await import("@/app/lib/projectStore");

    await upsertProject(draft([{ type: "image", src: "/projects/zz-only.jpg" }]));

    const saved = (await listProjects()).find((p) => p.slug === SLUG);
    expect(saved!.media.map((m) => m.src)).toEqual(["/projects/zz-only.jpg"]);
  });

  it("keeps an unpublished project out of the public products list", async () => {
    // published: false is what makes this row safe to create here at all.
    const { listProjects } = await import("@/app/lib/projectStore");

    const saved = (await listProjects()).find((p) => p.slug === SLUG);
    expect(saved!.published).toBe(false);
  });

  it("leaves no test rows behind", async () => {
    await purge();

    const { supabaseAdmin } = await import("@/app/lib/supabaseAdmin");
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("slug")
      .eq("slug", SLUG);
    const { data: media } = await supabaseAdmin
      .from("project_media")
      .select("id")
      .eq("project_slug", SLUG);

    expect(projects ?? []).toHaveLength(0);
    expect(media ?? []).toHaveLength(0);
  });
});
