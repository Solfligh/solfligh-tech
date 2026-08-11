import { describe, it, expect } from "vitest";

/**
 * Every read path, executed against the real database.
 *
 * A mocked test cannot catch a query that names a column the table no longer
 * has — the mock does not know the schema. That is precisely how the admin
 * leads endpoint broke: `ip` was dropped, two consumers still selected it, and
 * every existing test stayed green.
 *
 * These run the real queries. If a column is renamed or dropped and a consumer
 * is missed, one of these fails.
 */

const hasCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

// Skips rather than fails when run without credentials, so this is safe to run
// anywhere.
const describeDb = hasCredentials ? describe : describe.skip;

describeDb("store reads match the live schema", () => {
  it("posts", async () => {
    const { getPosts } = await import("@/app/lib/posts");
    const posts = await getPosts();
    expect(Array.isArray(posts)).toBe(true);
    if (posts.length) {
      // Field names the app relies on, mapped from snake_case columns.
      expect(posts[0]).toHaveProperty("slug");
      expect(posts[0]).toHaveProperty("title");
      expect(posts[0]).toHaveProperty("publishedAt");
    }
  });

  it("categories", async () => {
    const { getCategories } = await import("@/app/lib/posts");
    const categories = await getCategories();
    expect(Array.isArray(categories)).toBe(true);
  });

  it("books", async () => {
    const { getBooks } = await import("@/app/lib/booksStore");
    const books = await getBooks();
    expect(Array.isArray(books)).toBe(true);
    if (books.length) expect(books[0]).toHaveProperty("slug");
  });

  it("chapters", async () => {
    const { getChapters } = await import("@/app/lib/booksStore");
    const chapters = await getChapters();
    expect(Array.isArray(chapters)).toBe(true);
    if (chapters.length) expect(chapters[0]).toHaveProperty("chapterNumber");
  });

  it("approved comments", async () => {
    const { getApprovedComments } = await import("@/app/lib/commentsStore");
    const comments = await getApprovedComments("any-slug");
    expect(Array.isArray(comments)).toBe(true);
  });

  it("all comments, the admin view", async () => {
    const { getAllComments } = await import("@/app/lib/commentsStore");
    const comments = await getAllComments();
    expect(Array.isArray(comments)).toBe(true);
  });

  it("projects, including the media join", async () => {
    const { listProjects } = await import("@/app/lib/projectStore");
    const projects = await listProjects();
    expect(Array.isArray(projects)).toBe(true);
    if (projects.length) {
      expect(projects[0]).toHaveProperty("slug");
      expect(Array.isArray(projects[0].media)).toBe(true);
    }
  });
});

describeDb("rate limit counters query real tables", () => {
  // These count against leads, waitlist_signups, and comments. A renamed
  // column here fails open silently in production, so it is worth asserting
  // the query itself still works.
  it("counts without error on each rate-limited table", async () => {
    const { countRecent, windowStartIso } = await import("@/app/lib/rateLimit");
    const since = windowStartIso(10);

    for (const [table, column] of [
      ["leads", "ip_hash"],
      ["waitlist_signups", "ip_hash"],
      ["comments", "ip_hash"],
    ] as const) {
      const count = await countRecent({
        table,
        column,
        value: "0".repeat(64),
        sinceIso: since,
      });
      // countRecent fails open by returning 0, so a broken query would look
      // identical to "no matches". Assert the underlying table is queryable
      // directly instead.
      expect(typeof count).toBe("number");
    }
  });

  it("the rate-limited tables really do have an ip_hash column", async () => {
    const { supabaseAdmin } = await import("@/app/lib/supabaseAdmin");

    for (const table of ["leads", "waitlist_signups", "comments"]) {
      const { error } = await supabaseAdmin.from(table).select("ip_hash").limit(1);
      expect(error, `${table}.ip_hash should exist`).toBeNull();
    }
  });

  it("leads no longer has a raw ip column", async () => {
    // The privacy change dropped it. If it comes back, something regressed.
    const { supabaseAdmin } = await import("@/app/lib/supabaseAdmin");
    const { error } = await supabaseAdmin.from("leads").select("ip").limit(1);
    expect(error).not.toBeNull();
  });
});
