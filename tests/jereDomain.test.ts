import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { getJereUrl, isJereHost, JERE_DOMAIN_ORIGIN } from "@/app/lib/jereDomain";
import { SITE_URL } from "@/app/lib/site";

vi.mock("@/app/lib/projectStore", () => ({ listProjects: vi.fn() }));
vi.mock("@/app/lib/posts", () => ({ getPosts: vi.fn(async () => []) }));
vi.mock("@/app/lib/booksStore", () => ({ getBooks: vi.fn(async () => []), getChapters: vi.fn(async () => []) }));
import { listProjects } from "@/app/lib/projectStore";
import sitemap from "@/app/sitemap";
import { generateMetadata } from "@/app/products/profitpilot/page";

afterEach(() => vi.unstubAllEnvs());
const request = (path: string, origin = JERE_DOMAIN_ORIGIN) => new NextRequest(`${origin}${path}`);

function setMode(enabled: boolean) {
  vi.stubEnv("NEXT_PUBLIC_JERE_DOMAIN_ENABLED", String(enabled));
  vi.stubEnv("MAINTENANCE_MODE", "false");
}

describe("Jèrè custom domain", () => {
  it("keeps the current URL and visitors working until DNS/HTTPS are ready", () => {
    setMode(false);
    expect(getJereUrl()).toBe(`${SITE_URL}/products/profitpilot`);
    expect(proxy(request("/products/profitpilot", SITE_URL)).headers.get("location")).toBeNull();
  });

  it("serves the existing landing page at the branded root without changing the address", () => {
    setMode(false);
    const response = proxy(request("/?utm_source=launch"));
    expect(response.headers.get("x-middleware-rewrite")).toBe(`${JERE_DOMAIN_ORIGIN}/products/profitpilot?utm_source=launch`);
    expect(response.headers.get("location")).toBeNull();
  });

  it("uses the incoming Host header when the server URL has an internal hostname", () => {
    setMode(false);
    const internalRequest = new NextRequest("http://localhost:3214/", { headers: { host: "www.xn--jr-7iab.com" } });
    expect(proxy(internalRequest).headers.get("x-middleware-rewrite")).toContain("/products/profitpilot");
  });

  it("permanently redirects the old URL and carries campaign parameters after activation", () => {
    setMode(true);
    const response = proxy(request("/products/profitpilot?utm_source=launch", SITE_URL));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`${JERE_DOMAIN_ORIGIN}/?utm_source=launch`);
    expect(getJereUrl()).toBe(`${JERE_DOMAIN_ORIGIN}/`);
  });

  it("consolidates the apex and duplicate product paths without redirect loops", () => {
    setMode(true);
    expect(proxy(request("/?ref=launch", "https://xn--jr-7iab.com")).headers.get("location")).toBe(`${JERE_DOMAIN_ORIGIN}/?ref=launch`);
    expect(proxy(request("/products/profitpilot")).headers.get("location")).toBe(`${JERE_DOMAIN_ORIGIN}/`);
    expect(proxy(request("/")).headers.get("x-middleware-rewrite")).toContain("/products/profitpilot");
  });

  it("keeps company pages and product assets accessible", () => {
    setMode(true);
    expect(proxy(request("/contact?source=jere")).headers.get("location")).toBe(`${SITE_URL}/contact?source=jere`);
    expect(proxy(request("/projects/profitpilot/today.jpg")).headers.get("x-middleware-next")).toBe("1");
    expect(proxy(request("/_next/image?url=x")).headers.get("x-middleware-next")).toBe("1");
    expect(isJereHost("www.xn--jr-7iab.com.evil.example")).toBe(false);
  });

  it("retains the temporary maintenance response on the branded root", () => {
    setMode(true);
    vi.stubEnv("MAINTENANCE_MODE", "true");
    expect(proxy(request("/")).status).toBe(503);
  });

  it("publishes the branded domain's own crawl files", async () => {
    setMode(true);
    const robots = proxy(request("/robots.txt"));
    expect(robots.headers.get("content-type")).toContain("text/plain");
    expect(await robots.text()).toContain(`${JERE_DOMAIN_ORIGIN}/sitemap.xml`);
    const xml = proxy(request("/sitemap.xml"));
    expect(xml.headers.get("content-type")).toContain("application/xml");
    expect(await xml.text()).toContain(`<loc>${JERE_DOMAIN_ORIGIN}/</loc>`);
  });

  it("moves the canonical/social URL and removes the legacy URL from the company sitemap", async () => {
    setMode(true);
    vi.mocked(listProjects).mockResolvedValue([
      { slug: "profitpilot", name: "Jèrè", published: true },
      { slug: "rebirthagro", name: "RebirthAgro", published: true },
    ] as Awaited<ReturnType<typeof listProjects>>);
    const metadata = await generateMetadata();
    expect(metadata.alternates?.canonical).toBe(`${JERE_DOMAIN_ORIGIN}/`);
    expect(metadata.openGraph).toMatchObject({ url: `${JERE_DOMAIN_ORIGIN}/` });
    const urls = (await sitemap()).map(entry => entry.url);
    expect(urls).not.toContain(`${SITE_URL}/products/profitpilot`);
    expect(urls).toContain(`${SITE_URL}/products/rebirthagro`);
    setMode(false);
    expect((await sitemap()).map(entry => entry.url)).toContain(`${SITE_URL}/products/profitpilot`);
  });
});
