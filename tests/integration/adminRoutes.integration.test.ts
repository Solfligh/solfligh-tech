import { describe, it, expect } from "vitest";

/**
 * Every admin read endpoint, invoked for real against the live database.
 *
 * The regression this exists for: GET /api/admin/leads returned
 * 500 "column leads.ip does not exist" and stayed broken across two merges,
 * because the tests that covered it mocked the database away.
 *
 * A 500 here means a route's query no longer matches the schema.
 */

const token = (process.env.ADMIN_TOKEN || "").trim();
const hasCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!token;

const describeDb = hasCredentials ? describe : describe.skip;

function authed(url: string) {
  return new Request(url, { headers: { "x-admin-token": token } });
}

describeDb("admin read endpoints answer against the real schema", () => {
  // Imported statically rather than by building the path at runtime: a
  // template-literal import cannot be analysed by the bundler, and a typo in
  // the path would silently skip a route instead of failing.
  //
  // Typed as unknown and narrowed at the call site: the handlers take
  // NextRequest, which is not assignable to a `(req: Request) => ...` slot.
  type RouteModule = { GET: (req: never) => Promise<Response> };
  const cases: Array<[string, string, () => Promise<unknown>]> = [
    ["posts", "http://localhost/api/admin/posts", () => import("@/app/api/admin/posts/route")],
    ["categories", "http://localhost/api/admin/categories", () => import("@/app/api/admin/categories/route")],
    ["books", "http://localhost/api/admin/books", () => import("@/app/api/admin/books/route")],
    ["chapters", "http://localhost/api/admin/chapters", () => import("@/app/api/admin/chapters/route")],
    ["comments", "http://localhost/api/admin/comments", () => import("@/app/api/admin/comments/route")],
    ["leads", "http://localhost/api/admin/leads?page=1&pageSize=5", () => import("@/app/api/admin/leads/route")],
  ];

  for (const [name, url, load] of cases) {
    it(`GET /api/admin/${name} does not 500`, async () => {
      const mod = (await load()) as RouteModule;
      const res = await mod.GET(authed(url) as never);

      // 500 is the signature of schema drift; that is the whole point here.
      expect(res.status, `${name} returned ${res.status}`).toBe(200);

      const body = await res.json();
      expect(body).toBeTruthy();
    });
  }

  it("the leads CSV export also survives, since it has its own column list", async () => {
    const mod = await import("@/app/api/admin/leads/route");
    const res = await mod.GET(authed("http://localhost/api/admin/leads?format=csv") as never);
    expect(res.status).toBe(200);

    const text = await res.text();
    // The header row is built from a hardcoded list that must stay in step
    // with what the query selects.
    expect(text.split("\n")[0]).toContain("email");
    expect(text.split("\n")[0]).not.toContain(",ip,");
  });
});

describeDb("public read endpoints answer against the real schema", () => {
  it("GET /api/posts", async () => {
    const { GET } = await import("@/app/api/posts/route");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  it("GET /api/categories", async () => {
    const { GET } = await import("@/app/api/categories/route");
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it("GET /api/books", async () => {
    const { GET } = await import("@/app/api/books/route");
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it("GET /api/chapters", async () => {
    const { GET } = await import("@/app/api/chapters/route");
    const res = await GET(new Request("http://localhost/api/chapters") as never);
    expect(res.status).toBe(200);
  });

  it("GET /api/comments returns only approved ones", async () => {
    const { GET } = await import("@/app/api/comments/route");
    const res = await GET(
      new Request("http://localhost/api/comments?postSlug=any") as never
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    // Whatever is returned publicly must be approved. This is the guarantee
    // that matters most on this endpoint.
    for (const c of body) expect(c.approved).toBe(true);
  });
});

describeDb("auth is enforced against the real token store", () => {
  it("rejects a request with no token", async () => {
    const { GET } = await import("@/app/api/admin/posts/route");
    const res = await GET(new Request("http://localhost/api/admin/posts") as never);
    expect(res.status).toBe(401);
  });

  it("rejects a token that is not in admin_tokens", async () => {
    const { GET } = await import("@/app/api/admin/posts/route");
    const res = await GET(
      new Request("http://localhost/api/admin/posts", {
        headers: { "x-admin-token": "slf_definitely-not-a-real-token" },
      }) as never
    );
    expect(res.status).toBe(401);
  });
});

describeDb("the sitemap only lists URLs that resolve", () => {
  it("builds from live data without error", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = await sitemap();

    expect(entries.length).toBeGreaterThan(10);

    // Every entry must be absolute and de-duplicated; a sitemap full of
    // duplicates or relative paths is worse than a short one.
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url.startsWith("https://")).toBe(true);
  });

  it("includes content, not just static routes", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const urls = (await sitemap()).map((e) => e.url);

    // Guards the regression where only static pages and products were listed.
    expect(urls.some((u) => u.includes("/blog/"))).toBe(true);
    expect(urls.some((u) => u.includes("/books/"))).toBe(true);
    expect(urls.some((u) => u.includes("/insights/"))).toBe(true);
  });
});
