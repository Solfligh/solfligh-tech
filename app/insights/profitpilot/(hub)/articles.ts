// app/insights/profitpilot/(hub)/articles.ts

export type ProfitPilotArticle = {
  slug: string;
  title: string;
  description: string;
  href: string;
  tag: "Problem Awareness" | "Solution Awareness";
  date: string;
  readTime: string;
  cover?: string;
  featured?: boolean;
};

export const profitpilotArticles: ProfitPilotArticle[] = [
  {
    slug: "why-most-business-owners-dont-know-how-much-they-made-today",
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.",
    href: "/insights/profitpilot/why-most-business-owners-dont-know-how-much-they-made-today",
    tag: "Problem Awareness",
    date: "Jan 2026",
    readTime: "4–6 min",
    cover: "/insights/profitpilot/cover.jpg",
    featured: true,
  },
  {
    slug: "cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "Cashflow and profit answer different questions. Mixing them up is why many business owners feel unsure at the end of the day.",
    href: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    tag: "Solution Awareness",
    date: "Jan 2026",
    readTime: "4–6 min",
    cover: "/insights/profitpilot/cover.jpg",
    featured: false,
  },
];
