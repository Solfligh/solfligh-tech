// app/insights/profitpilot/(hub)/articles.ts

export type ProfitPilotArticleTag =
  | "Problem Awareness"
  | "Solution Awareness"
  | "Teaching"
  | "Profit Logic"
  | "Habit System"
  | "Profit Philosophy";

export type ProfitPilotArticle = {
  slug: string;
  title: string;
  description: string;
  href: string;
  tag: ProfitPilotArticleTag;
  date: string;
  readTime: string;
  cover?: string;
  featured?: boolean;
};

export const profitpilotArticles: ProfitPilotArticle[] = [
  {
    slug: "why-most-smes-dont-actually-know-how-much-they-made-today",
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    description:
      "Sales happened and money moved, but the day ends with the same question: did we actually make money today — or just stay busy?",
    href: "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today",
    tag: "Problem Awareness",
    date: "Jan 2026",
    readTime: "4–6 min",
    cover: "/insights/profitpilot/posts/why-made-today.jpg",
    featured: true,
  },
  {
    slug: "cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "Cashflow answers “did money move?” Profit answers “did we create value after costs?” Mixing them up is why daily decisions feel uncertain.",
    href: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    tag: "Solution Awareness",
    date: "Jan 2026",
    readTime: "4–6 min",
    cover: "/insights/profitpilot/posts/cashflow-vs-profit.jpg",
    featured: false,
  },
  {
    slug: "the-3-numbers-every-sme-should-check-daily",
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    description:
      "A daily routine for clarity without accounting confusion: revenue, operating expenses, and profit status (proven or unavailable).",
    href: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
    tag: "Teaching",
    date: "Jan 2026",
    readTime: "4–5 min",
    cover: "/insights/profitpilot/posts/three-numbers.jpg",
    featured: true,
  },
  {
    slug: "from-daily-numbers-to-daily-clarity",
    title: "From Daily Number to Daily Clarity: ProfitPilot’s Conditional Profit Logic",
    description:
      "Profit is conditional: if costs are incomplete, profit cannot be proven. Here’s how Revenue, COGS, Gross Profit, and Operating Profit really work.",
    href: "/insights/profitpilot/from-daily-numbers-to-daily-clarity",
    tag: "Profit Logic",
    date: "Jan 2026",
    readTime: "5–7 min",
    cover: "/insights/profitpilot/posts/daily-number-to-clarity.jpg",
    featured: false,
  },
  {
    slug: "from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
    title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit",
    description:
      "Knowing what to track is easy. Doing it daily is hard. Here’s how ProfitPilot makes the daily verdict routine automatic — without guessing profit.",
    href: "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
    tag: "Habit System",
    date: "Jan 2026",
    readTime: "5–7 min",
    cover: "/insights/profitpilot/posts/daily-clarity-system.jpg",
    featured: false,
  },
  {
    slug: "when-profit-is-unknown-thats-still-an-answer",
    title: "When Profit Is Unknown, That’s Still an Answer",
    description:
      "If profit can’t be proven because required costs are missing, “unknown” is still a truthful answer — and you can still close the day with clarity.",
    href: "/insights/profitpilot/when-profit-is-unknown-thats-still-an-answer",
    tag: "Solution Awareness",
    date: "Jan 2026",
    readTime: "4–6 min",
    cover: "/insights/profitpilot/posts/profit-unknown.jpg",
    featured: true,
  },
];
