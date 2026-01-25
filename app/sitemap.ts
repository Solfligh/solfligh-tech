import type { MetadataRoute } from "next";
import { listProjects, type ProjectPayload } from "@/app/lib/projectStore";

const SITE_URL = "https://solflightech.org";

function isValidExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const u = url.trim();
  return u.startsWith("https://") || u.startsWith("http://");
}

function safeDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
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
    const all = (await listProjects()) as ProjectPayload[];

    projectRoutes = (Array.isArray(all) ? all : [])
      // only published
      .filter((p) => p?.published)
      // must have a valid slug
      .filter((p) => typeof p.slug === "string" && p.slug.trim().length > 0)
      // exclude external redirect projects (your [slug] page redirects away)
      .filter((p) => !isValidExternalUrl(p.externalUrl))
      .map((p) => {
        const lastMod = safeDate(p.updatedAt);

        return {
          url: `${SITE_URL}/projects/${p.slug.trim()}`,
          priority: 0.7,
          ...(lastMod ? { lastModified: lastMod } : {}),
        };
      });
  } catch {
    projectRoutes = [];
  }

  return [...staticRoutes, ...projectRoutes];
}
