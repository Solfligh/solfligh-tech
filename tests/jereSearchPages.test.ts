import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { proxy } from "@/proxy";
import { JERE_DOMAIN_ORIGIN } from "@/app/lib/jereDomain";
import { SITE_URL } from "@/app/lib/site";
import { jereSearchPages, jereSearchSlugs, getJereSearchUrl } from "@/app/lib/jereSearchPages";
vi.mock("@/app/lib/projectStore", () => ({ listProjects: vi.fn() }));
import { listProjects } from "@/app/lib/projectStore";
import JereLearnPage, { generateMetadata } from "@/app/products/profitpilot/learn/[slug]/page";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_JERE_DOMAIN_ENABLED", "true");
  vi.stubEnv("MAINTENANCE_MODE", "false");
  vi.mocked(listProjects).mockResolvedValue([{ slug: "profitpilot", name: "Jèrè", published: true }] as Awaited<ReturnType<typeof listProjects>>);
});
afterEach(() => vi.unstubAllEnvs());
const request = (path: string, origin = JERE_DOMAIN_ORIGIN) => new NextRequest(`${origin}${path}`);

describe("Jèrè short search pages", () => {
  it("serves each page on the Jèrè site and sends the old company-site address there", () => {
    for (const slug of jereSearchSlugs) {
      expect(proxy(request(`/learn/${slug}`)).headers.get("x-middleware-rewrite")).toBe(`${JERE_DOMAIN_ORIGIN}/products/profitpilot/learn/${slug}`);
      for (const origin of [SITE_URL, JERE_DOMAIN_ORIGIN]) {
        expect(proxy(request(`/products/profitpilot/learn/${slug}`, origin)).headers.get("location")).toBe(`${JERE_DOMAIN_ORIGIN}/learn/${slug}`);
      }
    }
    // An unknown page is not invented: it goes to the company site like any other path.
    expect(proxy(request("/learn/not-a-page")).headers.get("location")).toBe(`${SITE_URL}/learn/not-a-page`);
  });

  it("lists every page in the Jèrè sitemap, once, with a date", async () => {
    const xml = await proxy(request("/sitemap.xml")).text();
    for (const slug of jereSearchSlugs) expect(xml.split(`<loc>${JERE_DOMAIN_ORIGIN}/learn/${slug}</loc>`)).toHaveLength(2);
    expect(xml).toContain(`<loc>${JERE_DOMAIN_ORIGIN}/</loc>`);
    expect(xml).toContain(`<loc>${JERE_DOMAIN_ORIGIN}/guide</loc>`);
  });

  it("gives each page its own title, description and canonical address", async () => {
    const seen = new Set<string>();
    for (const page of jereSearchPages) {
      const meta = await generateMetadata({ params: { slug: page.slug } });
      expect(meta.title).toEqual({ absolute: page.title });
      expect(meta.alternates?.canonical).toBe(getJereSearchUrl(page.slug));
      expect(page.title.length).toBeLessThanOrEqual(75);
      expect(page.description.length).toBeLessThanOrEqual(175);
      for (const text of [page.title, page.description]) { expect(seen.has(text)).toBe(false); seen.add(text); }
    }
  });

  it("renders one heading, the steps, honest limits and structured data, with no unfinished wording", async () => {
    for (const page of jereSearchPages) {
      const element = await JereLearnPage({ params: { slug: page.slug } });
      const html = renderToStaticMarkup(createElement(() => element));
      expect(html.match(/<h1[ >]/g)).toHaveLength(1);
      expect(html).toContain("Create your account");
      expect(html).toContain("Good to know");
      const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
      expect(ld[0]).toMatchObject({ "@type": "WebPage" });
      expect(ld[1]).toMatchObject({ "@type": "FAQPage" });
      expect(ld[1].mainEntity).toHaveLength(page.faqs.length);
      expect(html).not.toMatch(/guarantee|100%|best app|#1/i);
      for (const slug of page.related) expect(jereSearchSlugs).toContain(slug);
    }
  });

  it("does not expose the pages while the product is unpublished or for an unknown address", async () => {
    vi.mocked(listProjects).mockResolvedValue([]);
    await expect(JereLearnPage({ params: { slug: jereSearchSlugs[0] } })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    vi.mocked(listProjects).mockResolvedValue([{ slug: "profitpilot", name: "Jèrè", published: true }] as Awaited<ReturnType<typeof listProjects>>);
    await expect(JereLearnPage({ params: { slug: "nope" } })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
