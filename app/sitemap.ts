import type { MetadataRoute } from "next";
import { listProjects } from "@/app/lib/projectStore";

const SITE_URL = "https://solflightech.org";

type AnyProject = {
  slug?: string;
  published?: boolean;
  externalUrl?: string | null;
};

function isValidExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const u = url.trim();
  return u.startsWith("https://") || u.startsWith("http://");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, priority: 1.0 },
    { url: `${SITE_URL}/projects`, priority: 0.9 },
    { url: `${SITE_URL}/services`, priority: 0.8 },
    { url: `${SITE_URL}/about`, priority: 0.7 },
    { url: `${SITE_URL}/contact`, priority: 0.6 },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const all = (await listProjects()) as AnyProject[];

    projectRoutes = (Array.isArray(all) ? all : [])
      .filter((p) => p?.published && typeof p.slug === "string" && p.slug.trim().length > 0)
      // If a project has an externalUrl, your detail page redirects away,
      // so it’s better NOT to include it in your sitemap.
      .filter((p) => !isValidExternalUrl(p.externalUrl))
      .map((p) => ({
        url: `${SITE_URL}/projects/${p.slug!.trim()}`,
        priority: 0.7,
      }));
  } catch {
    projectRoutes = [];
  }

  return [...staticRoutes, ...projectRoutes];
}
