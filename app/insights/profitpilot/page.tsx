import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

const POSTS = [
  {
    title: "Why Most Business Owners Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens and why it isn’t your fault.",
    href: "/insights/profitpilot/why-most-business-owners-dont-know-how-much-they-made-today",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    accent: "from-sky-500/20 to-blue-500/10",
  },
];

function MiniHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_50%)]" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            ProfitPilot mission
          </p>
          <p className="text-base font-semibold text-slate-900">
            Help business owners know what happened{" "}
            <span className="text-sky-700">today</span> without accounting confusion.
          </p>
          <p className="text-sm text-slate-600">
            We start by naming the problem. Then we show the approach.
          </p>
        </div>

        <div className="flex gap-2">
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

export default function ProfitPilotInsightsHubPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        contextLabel="Insights"
        contextHref="/insights"
        title="ProfitPilot Insights"
        subtitle="Clear writing for business owners who want to understand daily performance without accounting confusion."
      />

      <MiniHero />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Featured</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {POSTS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${p.accent}`} />

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {p.tag}
                </span>
                <span className="text-xs font-semibold text-slate-600">{p.readingTime}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">{p.dateLabel}</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{p.description}</p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                Read <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
