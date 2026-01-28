// app/insights/profitpilot/page.tsx
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";
import { getHub, getHubPosts } from "@/app/lib/insightsStore";

function MiniHero({ missionLabel, missionLine }: { missionLabel?: string; missionLine?: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_50%)]" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {missionLabel || "Project mission"}
          </p>
          <p className="text-base font-semibold text-slate-900">
            {missionLine ? (
              <>
                {missionLine.split("today").length > 1 ? (
                  <>
                    {missionLine.split("today")[0]}
                    <span className="text-sky-700">today</span>
                    {missionLine.split("today").slice(1).join("today")}
                  </>
                ) : (
                  missionLine
                )}
              </>
            ) : (
              "Clear writing for people who want clarity without confusion."
            )}
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

export default function ProfitPilotInsightsHubPage() {
  const hub = getHub("profitpilot");
  const posts = getHubPosts("profitpilot");

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
          Insights
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">{hub?.title || "Hub"}</span>
      </div>

      <PageHeader
        badge={hub?.badge || "Project Hub"}
        title={`${hub?.title || "Hub"} Insights`}
        subtitle={
          hub?.description ||
          "Clear writing for business owners who want to understand performance — without confusion."
        }
        actions={
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
          >
            View projects
          </Link>
        }
      />

      <MiniHero missionLabel={hub?.missionLabel} missionLine={hub?.missionLine} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Featured</h2>
          <Link href="/insights" className="text-sm font-semibold text-sky-700 hover:underline">
            All hubs →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.id}
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

              <h3 className="mt-4 text-xl font-bold text-slate-950">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.description}</p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                Read <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom “next step” bar */}
      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Want the product version?</p>
            <p className="mt-1 text-sm text-slate-600">
              {hub?.title || "This project"} turns these ideas into a dashboard business owners can understand instantly.
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
