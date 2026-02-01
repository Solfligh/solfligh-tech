// app/insights/profitpilot/the-3-numbers-every-sme-should-check-daily/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "The 3 Numbers Every SME Should Check Before Closing for the Day | ProfitPilot | SolFligh Tech",
  description:
    "Daily clarity doesn’t require accounting knowledge. These three checks tell you what happened today—and when profit is unavailable because costs are incomplete.",
  alternates: {
    canonical: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
  },
  openGraph: {
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    description:
      "Three daily checks for SMEs: revenue, operating expenses, and profit status (proven or unavailable). No guessing.",
    url: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
    type: "article",
  },
};

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</p>;
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function NumberCard({
  label,
  value,
  note,
  tone = "neutral",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "warn" | "success";
}) {
  const styles =
    tone === "warn"
      ? "border-amber-200 bg-amber-50"
      : tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : "border-slate-200 bg-white";

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{note}</p>
    </div>
  );
}

export default function ArticlePage() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Solution Awareness",
    readingTime: "4–5 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/three-numbers.jpg",
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    subtitle:
      "If you only do one daily check, do this. It gives clarity without accounting confusion—and it avoids fake profit numbers.",
  };

  // ✅ Navigation
  const prevArticleHref = "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity";

  // ✅ You referenced this as “next” — we’ll create it later.
  const nextArticleHref = "/insights/profitpilot/how-profitpilot-makes-daily-profit-clarity-automatic";

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <Container>
          <div className="py-10">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href={meta.insightsHref} className="font-semibold text-slate-600 hover:text-slate-900">
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link href={meta.hubHref} className="font-semibold text-slate-600 hover:text-slate-900">
                {meta.hubTitle}
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Article</span>
            </div>

            {/* Nav (no waitlist) */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={prevArticleHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                ← Previous article
              </Link>

              <Link
                href={nextArticleHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Next article →
              </Link>

              <Link
                href={meta.hubHref}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Back to hub
              </Link>
            </div>

            {/* Header */}
            <div className="mt-8 max-w-3xl space-y-4">
              <div className="flex flex-wrap gap-2">
                <MetaPill>{meta.tag}</MetaPill>
                <MetaPill>{meta.readingTime}</MetaPill>
                <MetaPill>{meta.dateLabel}</MetaPill>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{meta.title}</h1>

              <p className="text-lg text-slate-600">{meta.subtitle}</p>
            </div>

            {/* Cover */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-[280px] w-full">
                <Image
                  src={meta.coverImage}
                  alt={meta.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent" />
              </div>
            </div>

            {/* Article */}
            <article className="mx-auto mt-12 max-w-3xl space-y-10 text-base leading-relaxed text-slate-700">
              <section>
                <SectionLabel>The daily reality</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Most SMEs close the day without real clarity</h2>
                <p className="mt-4">
                  At the end of the day, many owners feel tired, busy, and unsure. Sales happened. Money moved. But the
                  real question remains unanswered: <strong>did today actually go well?</strong>
                </p>

                <Callout title="The goal">
                  <>
                    At day end, you should be able to say one calm sentence:
                    <br />
                    <span className="font-semibold text-slate-900">
                      “I know what’s true about today — and what’s still missing.”
                    </span>
                  </>
                </Callout>
              </section>

              {/* ✅ Canonical clarification (this article talks about “what we made”, so we must anchor truth) */}
              <ProfitLogicClarification tone="warn" showOneLiner />

              <section>
                <SectionLabel>The fix</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Three daily checks tell the full story</h2>
                <p className="mt-4">
                  You don’t need spreadsheets or accounting language. You need three checks that answer three different
                  questions — and that stay honest even when some costs haven’t been recorded yet.
                </p>

                <ul className="mt-6 space-y-3">
                  <li>
                    <strong>1. Revenue recorded today</strong> — what sales were recorded for the day.
                  </li>
                  <li>
                    <strong>2. Operating expenses recorded</strong> — what overhead costs were recorded/allocated.
                  </li>
                  <li>
                    <strong>3. Profit status</strong> — either a proven profit number, or “— —” with a clear reason.
                  </li>
                </ul>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <NumberCard
                    label="Revenue recorded today"
                    value="₦120,000"
                    note="Sales value recorded for the day (not profit)."
                  />
                  <NumberCard
                    label="Operating expenses (recorded)"
                    value="₦18,500"
                    note="Overhead recorded/allocated (rent, data, utilities, subscriptions)."
                  />
                  <NumberCard
                    label="Profit status"
                    value="— —"
                    note="Profit is unavailable until required sale costs (COGS) are recorded."
                    tone="warn"
                  />
                </div>
              </section>

              <section>
                <SectionLabel>When profit is unavailable</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">You can still get a useful daily signal</h2>
                <p className="mt-4">
                  If your sale-linked costs (like COGS) aren’t complete yet, ProfitPilot won’t guess profit. But it can
                  still show a truthful signal that helps you make calmer decisions:
                </p>

                <Callout title="Operating surplus / deficit (recorded)">
                  <>
                    <p className="m-0">
                      <strong>Operating surplus / deficit (recorded)</strong> = Revenue − Operating Expenses (recorded)
                    </p>
                    <p className="mt-3 mb-0">
                      This is <strong>not profit</strong>. It simply tells you whether recorded revenue is covering
                      recorded overhead — while you finish recording required sale costs.
                    </p>
                  </>
                </Callout>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <NumberCard label="Revenue recorded today" value="₦120,000" note="Recorded sales value." />
                  <NumberCard
                    label="Operating expenses (recorded)"
                    value="₦18,500"
                    note="Recorded overhead for the period/day."
                  />
                  <NumberCard
                    label="Operating surplus/deficit (recorded)"
                    value="₦101,500"
                    note="A signal while profit is unavailable (NOT profit)."
                    tone="success"
                  />
                </div>
              </section>

              <section>
                <SectionLabel>Why this works</SectionLabel>
                <p className="mt-4">
                  These checks separate <strong>movement</strong> from <strong>performance</strong>. They remove
                  guessing and replace it with calm, confident decisions — because you know what is proven, and what is
                  still missing.
                </p>
              </section>

              {/* ✅ NO WAITLIST CTA yet */}
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-semibold text-slate-900">Where ProfitPilot fits (later)</p>
                <p className="mt-2">
                  The point of these articles is to make daily clarity normal first. When we introduce the full
                  solution, you’ll see how ProfitPilot makes this routine automatic — and how it refuses to show profit
                  until costs are complete.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={nextArticleHref}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Continue →
                  </Link>

                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Back to hub
                  </Link>
                </div>
              </section>

              {/* Bottom nav (no waitlist) */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={prevArticleHref}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  ← Previous article
                </Link>

                <Link
                  href={nextArticleHref}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Next article →
                </Link>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
