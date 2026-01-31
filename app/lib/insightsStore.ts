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

  // ✅ Stable slug for dynamic routes
  slug: string; // folder name

  title: string;
  description: string;

  // ✅ Canonical href used for links everywhere
  href: string; // MUST match folder route

  tag: string; // "Problem Awareness" | "Solution Awareness" | "Product Solution"
  readingTime: string; // "4–6 min"
  dateLabel: string; // "Jan 2026"
  dateISO: string; // "2026-01-10" (used for sorting)

  accent: string; // tailwind gradient class (fallback)
  coverImage?: string; // "/insights/profitpilot/posts/..."
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
  // ✅ Article 1 (Problem Aware)
  {
    hubSlug: "profitpilot",
    slug: "why-most-smes-dont-actually-know-how-much-they-made-today",
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens and why it isn’t your fault.",
    href: "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    dateISO: "2026-01-10",
    accent: "from-sky-500/20 to-blue-500/10",
    coverImage: "/insights/profitpilot/posts/why-made-today.jpg",
  },

  // ✅ Article 2 (Solution Aware)
  {
    hubSlug: "profitpilot",
    slug: "cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "Cashflow and profit answer different questions. Mixing them up is why many business owners feel unsure at the end of the day.",
    href: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    tag: "Solution Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    dateISO: "2026-01-12",
    accent: "from-sky-500/20 to-blue-500/10",
    // ✅ MUST be the real public path
    coverImage: "/insights/profitpilot/posts/cashflow-vs-profit.jpg",
  },

  // ✅ Article 3 (Solution Aware)
  {
    hubSlug: "profitpilot",
    slug: "the-3-numbers-every-sme-should-check-daily",
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    description:
      "Daily clarity doesn’t require accounting knowledge. These three numbers tell you exactly how your business performed today.",
    href: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
    tag: "Solution Awareness",
    readingTime: "4–5 min",
    dateLabel: "Jan 2026",
    dateISO: "2026-01-14",
    accent: "from-sky-500/20 to-blue-500/10",
    coverImage: "/insights/profitpilot/posts/three-numbers.jpg",
  },

  // ✅ Product Solution Article (the one giving the “ProfitPilot solution”)
  {
    hubSlug: "profitpilot",
    // ✅ THIS MUST MATCH YOUR FOLDER NAME EXACTLY
    slug: "from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
    title: "From Daily Numbers to Daily Clarity",
    description:
      "Knowing what to track is easy. Doing it consistently is the real challenge. Here’s how ProfitPilot turns daily clarity into a reliable habit.",
    // ✅ THIS MUST MATCH YOUR FOLDER ROUTE EXACTLY
    href: "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
    tag: "Product Solution",
    readingTime: "5–7 min",
    dateLabel: "Jan 2026",
    dateISO: "2026-01-16",
    accent: "from-sky-500/20 to-blue-500/10",
    // Optional: add when you upload a cover
    // coverImage: "/insights/profitpilot/posts/from-daily-to-clarity.jpg",
  },
];

/** -----------------------------
 *  Public API (single source of truth)
 *  ----------------------------- */

export function listHubs(): InsightHub[] {
  return [...HUBS];
}

export function getHub(hubSlug: string): InsightHub | null {
  return HUBS.find((h) => h.slug === hubSlug) || null;
}

export function listAllPosts(): InsightPost[] {
  return [...POSTS].sort((a, b) => safeDate(b.dateISO) - safeDate(a.dateISO));
}

export function listPostsByHub(hubSlug: string): InsightPost[] {
  return POSTS.filter((p) => p.hubSlug === hubSlug).sort(
    (a, b) => safeDate(b.dateISO) - safeDate(a.dateISO)
  );
}

export function getPostBySlug(hubSlug: string, slug: string): InsightPost | null {
  const s = (slug || "").trim();
  return POSTS.find((p) => p.hubSlug === hubSlug && p.slug === s) || null;
}

export function getPostByHref(href: string): InsightPost | null {
  const h = (href || "").trim();
  return POSTS.find((p) => p.href === h) || null;
}

/**
 * Picks the newest post based on dateISO.
 * Falls back safely if date parsing fails.
 */
export function getLatestPost(): InsightPost | null {
  const sorted = [...POSTS].sort((a, b) => safeDate(b.dateISO) - safeDate(a.dateISO));
  return sorted[0] || null;
}

function safeDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

/** -----------------------------
 *  Backward-compatible aliases
 *  ----------------------------- */

export function getHubs(): InsightHub[] {
  return listHubs();
}

export function getPostsByHub(hubSlug: string): InsightPost[] {
  return listPostsByHub(hubSlug);
}
