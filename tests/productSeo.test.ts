import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

vi.mock("@/app/lib/projectStore", () => ({ listProjects: vi.fn() }));
vi.mock("@/app/components/ProjectMediaCarousel", () => ({ default: () => null }));

import { listProjects } from "@/app/lib/projectStore";
import { generateMetadata } from "@/app/products/profitpilot/page";
import ProjectDetailPage, { generateMetadata as productMetadata } from "@/app/products/[slug]/page";
import { SITE_URL } from "@/app/lib/site";

const project = {
  slug: "profitpilot", name: "Jèrè", published: true,
  status: "Live / Near Launch", description: "Record sales, stock, expenses and customer debts in Nigeria.",
};

beforeEach(() => {
  vi.mocked(listProjects).mockResolvedValue([project] as Awaited<ReturnType<typeof listProjects>>);
});

describe("Jèrè search visibility", () => {
  it("exports product metadata from the actual static route instead of inheriting the company title", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toEqual({ absolute: expect.stringContaining("Jèrè (Jere)") });
    expect(metadata.description).toContain("small businesses in Nigeria");
    expect(metadata.description).toContain("offline entry");
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/products/profitpilot`);
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ title: expect.stringContaining("Jèrè (Jere)"), url: `${SITE_URL}/products/profitpilot` });
    expect(metadata.twitter).toMatchObject({ title: expect.stringContaining("Jèrè (Jere)") });
  });

  it("does not advertise an unpublished product for indexing", async () => {
    vi.mocked(listProjects).mockResolvedValue([]);
    expect((await generateMetadata()).robots).toEqual({ index: false, follow: true });
  });

  it("resolves Next.js async route parameters for metadata and public content", async () => {
    const metadata = await productMetadata({ params: Promise.resolve({ slug: "profitpilot" }) });
    expect(metadata.description).toBe(project.description);
    const page = await ProjectDetailPage({ params: Promise.resolve({ slug: "profitpilot" }) });
    const html = renderToStaticMarkup(createElement(() => page));
    expect(html).toContain("Jèrè (Jere) is business management software for small businesses in Nigeria");
    expect(html).not.toContain("ProfitPilot");
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const schema = schemas.find(item => item["@type"] === "SoftwareApplication");
    expect(schemas.find(item => item["@type"] === "WebSite")).toMatchObject({ name: "Jèrè", alternateName: "Jere" });
    expect(schema).toMatchObject({
      "@type": "SoftwareApplication",
      name: "Jèrè", alternateName: "Jere",
      url: `${SITE_URL}/products/profitpilot`,
    });
    expect(html).toContain("Live / Near Launch");
    expect(html).toContain("https://app.xn--jr-7iab.com/sign-up");
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html).toContain("Practice business with made-up figures");
    expect(html).toContain("Credit sales can count towards profit before customers have paid you");
    expect(html).toContain("Does Jèrè work without internet?");
    expect(html).not.toContain("Tech Stack");
    expect(html).not.toContain("why-most-business-owners-dont-know-how-much-they-made-today");
  });

  it("keeps other products on their existing project detail layout", async () => {
    vi.mocked(listProjects).mockResolvedValue([
      { ...project, slug: "rebirthagro", name: "RebirthAgro", status: "In Development" },
    ] as Awaited<ReturnType<typeof listProjects>>);
    const page = await ProjectDetailPage({ params: Promise.resolve({ slug: "rebirthagro" }) });
    const html = renderToStaticMarkup(createElement(() => page));
    expect(html).toContain("RebirthAgro");
    expect(html).toContain("In Development");
    expect(html).toContain("Tech Stack");
    expect(html).not.toContain("Know what you sold.");
  });

});
