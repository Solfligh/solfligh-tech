import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/app/components/PageHeader";
import { getHub, listPostsByHub, type InsightPost } from "@/app/lib/insightsStore";

function MiniHero({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_50%)]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title} mission</p>
          <p className="text-base font-semibold text-slate-900">
            Help SMEs know what happened <span className="text-sky-700">today</span> without accounting confusion.
          </p>
          <p className="text-sm text-slate-600">We start by naming the problem. Then we show the approach.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Problem-aware
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Solution-aware
          </span>
        </div>
      </div>
    </div>
  );
}

function dedupeByHref(items: InsightPost[]) {
  const seen = new Set<string>();
  const out: InsightPost[] = [];
  for (const p of items) {
    if (!p?.href) continue;
    if (seen.has(p.href)) continue;
    seen.add(p.href);
    out.push(p);
  }
  return out;
}

export default function ProfitPilotInsightsHubPage() {
  const hub = getHub("profitpilot");
  const storePosts = listPostsByHub("profitpilot") as InsightPost[];

  const localPosts: InsightPost[] = [
    {
      href: "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today",
      title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
      description:
        "Most SMEs see activity but can’t confidently prove daily performance without complete costs.",
      tag: "Problem Awareness",
      readingTime: "4–6 min",
      dateLabel: "Jan 2026",
      coverImage: "/insights/profitpilot/posts/why-made-today.jpg",
      accent: "from-sky-200 to-blue-200",
    } as any,

    {
      href: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
      title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
      description:
        "Cashflow and profit answer different questions—and mixing them up is why daily clarity breaks.",
      tag: "Solution Awareness",
      readingTime: "4–6 min",
      dateLabel: "Jan 2026",
      coverImage: "/insights/profitpilot/posts/cashflow-vs-profit.jpg",
      accent: "from-sky-200 to-blue-200",
    } as any,

    {
      href: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
      title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
      description:
        "Three daily checks: revenue recorded, operating expenses recorded, and profit status.",
      tag: "Daily Routine",
      readingTime: "4–5 min",
      dateLabel: "Jan 2026",
      coverImage: "/insights/profitpilot/posts/three-numbers.jpg",
      accent: "from-sky-200 to-blue-200",
    } as any,

    {
      href: "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
      title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit",
      description:
        "Daily clarity is easy to understand but hard to maintain. ProfitPilot turns it into a habit.",
      tag: "Product Solution",
      readingTime: "5–7 min",
      dateLabel: "Jan 2026",
      coverImage: "/insights/profitpilot/posts/daily-clarity-system.jpg",
      accent: "from-sky-200 to-blue-200",
    } as any,

    {
      href: "/insights/profitpilot/when-profit-is-unknown-thats-still-an-answer",
      title: "When Profit Is Unknown, That’s Still an Answer",
      description:
        "ProfitPilot’s philosophy: a missing number is better than a misleading one.",
      tag: "Profit Philosophy",
      readingTime: "4–6 min",
      dateLabel: "Jan 2026",
      coverImage: "/insights/profitpilot/posts/profit-unknown.jpg",
      accent: "from-sky-200 to-blue-200",
    } as any,
  ];

  const posts = dedupeByHref([...(storePosts || []), ...localPosts]);

  const hubTitle = hub?.title || "ProfitPilot";
  const hubDescription =
    hub?.description ||
    "Clear writing for SMEs who want to understand daily performance without accounting confusion.";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
          Insights
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">{hubTitle}</span>
      </div>

      <PageHeader
        badge={hub?.badge || "Project Hub"}
        title={`${hubTitle} Insights`}
        subtitle={hubDescription}
      />

      <MiniHero title={hubTitle} />

      <section className="grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <div className="relative h-36 w-full overflow-hidden">
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 520px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                  {p.tag}
                </span>
                <span>{p.readingTime}</span>
                <span>•</span>
                <span>{p.dateLabel}</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-950 group-hover:underline">
                {p.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600">{p.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
