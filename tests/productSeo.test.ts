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
    expect(metadata.description).toBe(project.description);
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
    expect(html).toContain("Jèrè (Jere), formerly ProfitPilot");
    expect(html).toContain("Live / Near Launch");
    expect(html).toContain("https://app.solflightech.org/sign-up");
  });
});
