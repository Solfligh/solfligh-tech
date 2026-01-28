// app/lib/insightsStore.ts

export type InsightHub = {
  slug: string; // e.g. "profitpilot"
  title: string; // e.g. "ProfitPilot"
  description: string;
  href: string; // e.g. "/insights/profitpilot"
  badge: string; // e.g. "Project Hub"
  accent: string; // tailwind gradient classes
  missionLabel?: string; // optional small label for hub hero
  missionLine?: string; // optional hub mission sentence
};

export type InsightPost = {
  id: string; // unique
  hubSlug: string; // "profitpilot"
  title: string;
  description: string;
  href: string;
  tag: string; // e.g. "Problem Awareness"
  readingTime: string; // e.g. "4–6 min"
  dateISO: string; // e.g. "2026-01-26"
  dateLabel: string; // e.g. "Jan 2026"
  accent: string; // tailwind gradient classes
};

const HUBS: InsightHub[] = [
  {
    slug: "profitpilot",
    title: "ProfitPilot",
    description: "Daily profit clarity for business owners — no accounting jargon, just clean decisions.",
    href: "/insights/profitpilot",
    badge: "Project Hub",
    accent: "from-sky-500/20 to-blue-500/10",
    missionLabel: "ProfitPilot mission",
    missionLine: "Help business owners know what happened today — without accounting confusion.",
  },
];

const POSTS: InsightPost[] = [
  {
    id: "pp-001",
    hubSlug: "profitpilot",
    title: "Why Most Business Owners Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.",
    href: "/insights/profitpilot/why-most-business-owners-dont-know-how-much-they-made-today",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateISO: "2026-01-26",
    dateLabel: "Jan 2026",
    accent: "from-sky-500/20 to-blue-500/10",
  },
];

export function getHubs(): InsightHub[] {
  return [...HUBS];
}

export function getHub(slug: string): InsightHub | undefined {
  const s = (slug || "").trim().toLowerCase();
  return HUBS.find((h) => h.slug === s);
}

export function getAllPosts(): InsightPost[] {
  return [...POSTS];
}

export function getHubPosts(hubSlug: string): InsightPost[] {
  const s = (hubSlug || "").trim().toLowerCase();
  return POSTS.filter((p) => p.hubSlug === s).sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

export function getLatestPost(): InsightPost | null {
  if (!POSTS.length) return null;
  const sorted = [...POSTS].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  return sorted[0] || null;
}
