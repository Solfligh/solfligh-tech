// app/lib/insightsStore.ts
export type InsightHub = {
  slug: string;
  title: string; // display name, e.g. "ProfitPilot"
  description: string;
  href: string; // "/insights/profitpilot"
  badge: string; // "Project Hub"
  accent: string; // tailwind gradient class
  coverImage?: string; // "/insights/profitpilot/cover.jpg"
};

export type InsightPost = {
  hubSlug: string;

  title: string;
  description: string;
  href: string;

  tag: string; // "Problem Awareness"
  readingTime: string; // "4–6 min"
  dateLabel: string; // "Jan 2026"
  dateISO: string; // "2026-01-10" (used for NEW logic)

  accent: string; // tailwind gradient class (fallback)
  coverImage?: string; // "/insights/profitpilot/posts/why-made-today.jpg"
};

const HUBS: InsightHub[] = [
  {
    slug: "profitpilot",
    title: "ProfitPilot",
    description: "Daily profit clarity for SMEs — no accounting jargon, just clean decisions.",
    href: "/insights/profitpilot",
    badge: "Project Hub",
    accent: "from-sky-500/20 to-blue-500/10",
    coverImage: "/insights/profitpilot/cover.jpg",
  },
];

const POSTS: InsightPost[] = [
  {
    hubSlug: "profitpilot",
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.",
    href: "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    dateISO: "2026-01-10",
    accent: "from-sky-500/20 to-blue-500/10",
    coverImage: "/insights/profitpilot/posts/why-made-today.jpg",
  },
];

export function listHubs(): InsightHub[] {
  return [...HUBS];
}

export function listPostsByHub(hubSlug: string): InsightPost[] {
  return POSTS.filter((p) => p.hubSlug === hubSlug);
}

export function getHub(hubSlug: string): InsightHub | null {
  return HUBS.find((h) => h.slug === hubSlug) || null;
}

export function getPostByHref(href: string): InsightPost | null {
  return POSTS.find((p) => p.href === href) || null;
}

/**
 * Picks the newest post based on dateISO.
 * Falls back safely if date parsing fails.
 */
export function getLatestPost(): InsightPost | null {
  const safeDate = (iso: string) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const sorted = [...POSTS].sort((a, b) => safeDate(b.dateISO) - safeDate(a.dateISO));
  return sorted[0] || null;
}
