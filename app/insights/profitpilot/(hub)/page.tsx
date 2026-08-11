// app/insights/profitpilot/(hub)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/app/components/PageHeader";
import { getHub, listPostsByHub, type InsightPost } from "@/app/lib/insightsStore";

/**
 * Without this the hub inherited app/insights/layout.tsx's metadata, so it
 * shared the exact title of the /insights index two different pages
 * competing under one name.
 */
export const metadata: Metadata = {
  title: "ProfitPilot Insights",
  description:
    "Articles on daily profit clarity for SMEs: what to track, why profit is conditional on complete costs, and how ProfitPilot turns the routine into a habit.",
  alternates: { canonical: "/insights/profitpilot" },
  openGraph: {
    type: "website",
    title: "ProfitPilot Insights | SOLFLIGH TECH",
    description:
      "Articles on daily profit clarity for SMEs: what to track, why profit is conditional on complete costs, and how ProfitPilot turns the routine into a habit.",
    url: "https://solflightech.org/insights/profitpilot",
  },
};

function MiniHero({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_50%)]" />

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title} mission</p>

          <p className="text-base font-semibold text-slate-900">
            Help SMEs know what happened <span className="text-sky-700">today</span> without accounting confusion.
          </p>

          <p className="text-sm text-slate-600">
            ProfitPilot doesn’t ask how complex your business is it asks whether{" "}
            <span className="font-semibold text-slate-900">today moved it forward</span>.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">The rule</p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">
                We will not tell you profit unless the data supports it
              </span>{" "}
              but we’ll still tell you if today helped or hurt your business.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">The reality</p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Daily verdict</span> never waits for COGS.
              <br />
              <span className="font-semibold text-slate-900">Profit numbers</span> always do.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Problem-aware
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Teaching
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Solution-aware
          </span>
        </div>
      </div>
    </div>
  );
}

function StartHere({ firstHref, total }: { firstHref: string; total: number }) {
  const waitlistHref = "/waitlist?product=profitpilot&source=profitpilot_hub";
  const projectHref = "/products/profitpilot";

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Start here</p>
          <p className="mt-1 text-sm text-slate-600">
            Read the series in order. It’s designed to move from daily confusion → daily clarity → the ProfitPilot habit.
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-500">{total} articles • ~25 minutes total</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={firstHref}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Read Article 1 →
          </Link>

          <Link
            href={waitlistHref}
            className="inline-flex items-center justify-center rounded-xl border border-sky-600 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
          >
            Join waitlist
          </Link>

          <Link
            href={projectHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            View project
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProfitPilotInsightsHubPage() {
  const hub = getHub("profitpilot");
  const posts = listPostsByHub("profitpilot");

  const hubTitle = hub?.title || "ProfitPilot";
  const hubDescription =
    hub?.description ||
    "Clear writing for SMEs who want to understand daily performance without accounting confusion.";

  const firstPostHref =
    posts.length > 0
      ? posts[0].href
      : "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today";

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
            href="/products/profitpilot"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
          >
            View project
          </Link>
        }
      />

      <MiniHero title={hubTitle} />

      <StartHere firstHref={firstPostHref} total={posts.length || 6} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">All articles</h2>
          <Link href="/insights" className="text-sm font-semibold text-sky-700 hover:underline">
            All hubs →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p: InsightPost, idx: number) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              {/* Cover */}
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

                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {idx + 1} / {posts.length}
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

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur">
            No posts yet. Add your first ProfitPilot article and it will show here automatically.
          </div>
        ) : null}
      </section>

      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Want the product version?</p>
            <p className="mt-1 text-sm text-slate-600">
              ProfitPilot turns these ideas into a daily verdict workflow SMEs can use without guessing profit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products/profitpilot"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              ProfitPilot project
            </Link>
            <Link
              href="/waitlist?product=profitpilot&source=profitpilot_hub_footer"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Join waitlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
