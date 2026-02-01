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

  // ✅ TEMP: ensure articles show even if not yet added to insightsStore.
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

    // ✅ The “habit” article (this is the one you said is showing)
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

    // ✅ The older “from-daily-number-to-daily-clarity” (add it back)
    {
      href: "/insights/profitpilot/from-daily-number-to-daily-clarity",
      title: "From Daily Number to Daily Clarity",
      description:
        "A practical shift: stop chasing vibes. Build a daily routine that turns insight into action.",
      tag: "Daily Clarity",
      readingTime: "5–7 min",
      dateLabel: "Jan 2026",
      coverImage: "/insights/profitpilot/posts/daily-number-to-clarity.jpg",
      accent: "from-sky-200 to-blue-200",
    } as any,

    // ✅ The new “profit philosophy” article
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
      {/* Breadcrumb */}
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
        actions={
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
          >
            View projects
          </Link>
        }
      />

      <MiniHero title={hubTitle} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">All articles</h2>
          <Link href="/insights" className="text-sm font-semibold text-sky-700 hover:underline">
            All hubs →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p: InsightPost) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              {/* Cover (safe) */}
              <div className="relative h-36 w-full overflow-hidden">
                {p.coverImage ? (
                  <>
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.accent || "from-sky-200 to-blue-200"}`} />
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {p.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{p.readingTime}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">{p.dateLabel}</span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-950 group-hover:underline">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.description}</p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                  Read <span aria-hidden="true">→</span>
                </div>
              </div>

              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
                <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Want the product version?</p>
            <p className="mt-1 text-sm text-slate-600">
              ProfitPilot turns these ideas into a dashboard SMEs can understand instantly.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
