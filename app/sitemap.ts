import type { MetadataRoute } from "next";
import { listProjects, type ProjectPayload } from "@/app/lib/projectStore";
import { getPosts } from "@/app/lib/posts";
import { getBooks, getChapters } from "@/app/lib/booksStore";
import { listHubs, listAllPosts } from "@/app/lib/insightsStore";

const SITE_URL = "https://solflightech.org";

/**
 * The sitemap covers published content, not just landing pages.
 *
 * It previously listed static routes and products only, which left the blog,
 * the books and their chapters, and every insights article discoverable purely
 * by crawling inbound links.
 *
 * Each section is wrapped separately: a failure in one source degrades that
 * section to empty rather than emptying the whole sitemap, which would be worse
 * than a stale one.
 */

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

function withLastModified(
  entry: MetadataRoute.Sitemap[number],
  value: unknown
): MetadataRoute.Sitemap[number] {
  const d = safeDate(value);
  return d ? { ...entry, lastModified: d } : entry;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, priority: 1.0 },
    { url: `${SITE_URL}/cloud`, priority: 0.9 },
    { url: `${SITE_URL}/cloud/access`, priority: 0.7 },
    { url: `${SITE_URL}/products`, priority: 0.9 },
    { url: `${SITE_URL}/services`, priority: 0.8 },
    { url: `${SITE_URL}/ai`, priority: 0.7 },
    { url: `${SITE_URL}/roadmap`, priority: 0.7 },
    { url: `${SITE_URL}/about`, priority: 0.7 },
    { url: `${SITE_URL}/blog`, priority: 0.7 },
    { url: `${SITE_URL}/insights`, priority: 0.7 },
    { url: `${SITE_URL}/books`, priority: 0.6 },
    { url: `${SITE_URL}/contact`, priority: 0.6 },
    { url: `${SITE_URL}/partner`, priority: 0.6 },
    { url: `${SITE_URL}/investors`, priority: 0.6 },
    { url: `${SITE_URL}/careers`, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, priority: 0.3 },
    { url: `${SITE_URL}/terms`, priority: 0.3 },
  ];

  // Products
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
      .map((p) =>
        withLastModified(
          { url: `${SITE_URL}/products/${p.slug.trim()}`, priority: 0.7 },
          p.updatedAt
        )
      );
  } catch {
    projectRoutes = [];
  }

  // Blog articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts();
    blogRoutes = (Array.isArray(posts) ? posts : [])
      .filter((p) => typeof p?.slug === "string" && p.slug.trim().length > 0)
      .map((p) =>
        withLastModified(
          { url: `${SITE_URL}/blog/${p.slug.trim()}`, priority: 0.6 },
          p.publishedAt
        )
      );
  } catch {
    blogRoutes = [];
  }

  // Books, and every chapter of them
  let bookRoutes: MetadataRoute.Sitemap = [];
  try {
    const [books, chapters] = await Promise.all([getBooks(), getChapters()]);

    const bookList = Array.isArray(books) ? books : [];

    const bookEntries = bookList
      .filter((b) => typeof b?.slug === "string" && b.slug.trim().length > 0)
      .map((b) =>
        withLastModified({ url: `${SITE_URL}/books/${b.slug.trim()}`, priority: 0.6 }, b.updatedAt)
      );

    // Chapters are real, individually linkable pages, so they belong here too.
    const knownBookSlugs = new Set(
      bookList.map((b) => (b.slug || "").trim()).filter(Boolean)
    );

    const chapterEntries = (Array.isArray(chapters) ? chapters : [])
      .filter((c) => knownBookSlugs.has((c.bookSlug || "").trim()))
      .filter((c) => Number.isFinite(c.chapterNumber) && c.chapterNumber > 0)
      .map((c) =>
        withLastModified(
          {
            url: `${SITE_URL}/books/${c.bookSlug.trim()}/chapters/${c.chapterNumber}`,
            priority: 0.5,
          },
          c.updatedAt
        )
      );

    bookRoutes = [...bookEntries, ...chapterEntries];
  } catch {
    bookRoutes = [];
  }

  // Insights hubs and articles. These come from a static content module rather
  // than a database read.
  let insightRoutes: MetadataRoute.Sitemap = [];
  try {
    const hubEntries = listHubs()
      .filter((h) => typeof h?.href === "string" && h.href.startsWith("/"))
      .map((h) => ({ url: `${SITE_URL}${h.href}`, priority: 0.6 }));

    const articleEntries = listAllPosts()
      .filter((p) => typeof p?.href === "string" && p.href.startsWith("/"))
      .map((p) => withLastModified({ url: `${SITE_URL}${p.href}`, priority: 0.6 }, p.dateISO));

    insightRoutes = [...hubEntries, ...articleEntries];
  } catch {
    insightRoutes = [];
  }

  const all = [
    ...staticRoutes,
    ...projectRoutes,
    ...blogRoutes,
    ...bookRoutes,
    ...insightRoutes,
  ];

  // Guard against a duplicate slipping in from two sources.
  const seen = new Set<string>();
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
