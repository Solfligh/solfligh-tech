import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { proxy } from "@/proxy";
import { JERE_DOMAIN_ORIGIN, getJereGuideUrl } from "@/app/lib/jereDomain";
import { jereFeatures, jereQuestions } from "@/app/lib/jereKnowledge";
import { SITE_URL } from "@/app/lib/site";
vi.mock("@/app/lib/projectStore", () => ({ listProjects: vi.fn() }));
import { listProjects } from "@/app/lib/projectStore";
import JereGuide, { generateMetadata } from "@/app/products/profitpilot/guide/page";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_JERE_DOMAIN_ENABLED", "true");
  vi.stubEnv("MAINTENANCE_MODE", "false");
  vi.mocked(listProjects).mockResolvedValue([{ slug: "profitpilot", name: "Jèrè", published: true }] as Awaited<ReturnType<typeof listProjects>>);
});
afterEach(() => vi.unstubAllEnvs());
const request = (path: string, origin = JERE_DOMAIN_ORIGIN) => new NextRequest(`${origin}${path}`);

describe("Jèrè public discovery resources", () => {
  it("serves the canonical guide and consolidates duplicate URLs with query parameters", async () => {
    expect(proxy(request("/guide?ref=search")).headers.get("x-middleware-rewrite")).toBe(`${JERE_DOMAIN_ORIGIN}/products/profitpilot/guide?ref=search`);
    for (const origin of [SITE_URL, JERE_DOMAIN_ORIGIN]) {
      expect(proxy(request("/products/profitpilot/guide?ref=search", origin)).headers.get("location")).toBe(`${JERE_DOMAIN_ORIGIN}/guide?ref=search`);
    }
    expect(await proxy(request("/sitemap.xml")).text()).toContain(`<loc>${getJereGuideUrl()}</loc>`);
    expect((await generateMetadata()).alternates?.canonical).toBe(getJereGuideUrl());
    vi.stubEnv("MAINTENANCE_MODE", "true");
    expect(proxy(request("/guide")).status).toBe(503);
  });

  it("keeps machine-readable facts consistent with the human guide and preserves corporate routes", async () => {
    const page = await JereGuide();
    const guide = renderToStaticMarkup(createElement(() => page));
    const response = proxy(request("/llms-full.txt"));
    expect(response.headers.get("content-type")).toContain("text/plain");
    const facts = await response.text();
    for (const item of jereFeatures) {
      expect(facts).toContain(item.text);
      // React escapes punctuation in HTML; compare decoded text through a round trip.
      expect(guide).toContain(renderToStaticMarkup(createElement("p", null, item.text)).slice(3, -4));
    }
    for (const q of jereQuestions) expect(facts).toContain(q.answer);
    expect(facts).toContain("Basic needs an internet connection");
    expect(facts).toContain("clearing browser storage can remove them");
    expect(facts).toContain("Live / Near Launch");
    expect(guide.match(/<h1[ >]/g)).toHaveLength(1);
    expect(await proxy(request("/llms.txt")).text()).toContain(getJereGuideUrl());
    expect(proxy(request("/llms.txt", SITE_URL)).headers.get("x-middleware-next")).toBe("1");
    const schema = JSON.parse(guide.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
    expect(schema).toMatchObject({ "@type": "WebPage", about: { "@id": `${JERE_DOMAIN_ORIGIN}/#application` } });
  });

  it("does not expose an unpublished product guide and retains the pre-migration canonical", async () => {
    vi.stubEnv("NEXT_PUBLIC_JERE_DOMAIN_ENABLED", "false");
    expect(getJereGuideUrl()).toBe(`${SITE_URL}/products/profitpilot/guide`);
    vi.mocked(listProjects).mockResolvedValue([]);
    expect((await generateMetadata()).robots).toEqual({ index: false, follow: true });
    await expect(JereGuide()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
