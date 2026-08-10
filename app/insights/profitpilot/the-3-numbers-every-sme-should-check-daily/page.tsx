import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import InsightJsonLd from "@/app/components/InsightJsonLd";

export const metadata: Metadata = {
  title: "The 3 Numbers Every SME Should Check Before Closing for the Day | ProfitPilot | SolFligh Tech",
  description:
    "A simple end-of-day routine for SMEs. Three numbers to check before closing so you know what moved, what was recorded, and whether today likely helped or hurt your business.",
  alternates: {
    canonical: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
  },
  openGraph: {
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    description:
      "A practical daily routine: three numbers to check before closing so you end the day with clarity, not guesses.",
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
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
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
    tag: "Daily Routine",
    readingTime: "4–5 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/three-numbers.jpg",
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    subtitle:
      "A simple end-of-day routine. No accounting language. Just three checks that tell you what happened today.",
  };

  const prevArticleHref =
    "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity";
  const nextArticleHref =
    "/insights/profitpilot/from-daily-numbers-to-daily-clarity";

  return (
    <main className="bg-white text-slate-900">
      <InsightJsonLd href="/insights/profitpilot/the-3-numbers-every-sme-should-check-daily" />
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

            {/* Header */}
            <div className="mt-8 max-w-3xl space-y-4">
              <div className="flex flex-wrap gap-2">
                <MetaPill>{meta.tag}</MetaPill>
                <MetaPill>{meta.readingTime}</MetaPill>
                <MetaPill>{meta.dateLabel}</MetaPill>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {meta.title}
              </h1>

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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent" />
              </div>
            </div>

            {/* Article */}
            <article className="mx-auto mt-12 max-w-3xl space-y-10 text-base leading-relaxed text-slate-700">
              <section>
                <SectionLabel>The goal</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  End the day with a verdict, not a vibe
                </h2>

                <p className="mt-4">
                  Before you close for the day, you should be able to answer one question calmly:
                </p>

                <p className="mt-3 font-semibold text-slate-900">
                  Did today likely help the business or hurt it?
                </p>

                <Callout title="Important">
                  <>
                    This routine does not require perfect books.  
                    It only requires honesty about what is recorded and what is not.
                  </>
                </Callout>
              </section>

              <section>
                <SectionLabel>The routine</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Check these three numbers before closing
                </h2>

                <ul className="mt-6 space-y-3">
                  <li>
                    <strong>1) Revenue recorded today</strong> — what sales were recorded for the day.
                  </li>
                  <li>
                    <strong>2) Operating expenses recorded</strong> — what overhead costs were recorded for today.
                  </li>
                  <li>
                    <strong>3) Profit status</strong> — known or unknown (no guessing).
                  </li>
                </ul>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <NumberCard
                    label="Revenue recorded today"
                    value="₦120,000"
                    note="Sales value recorded for the day."
                  />
                  <NumberCard
                    label="Operating expenses (recorded)"
                    value="₦18,500"
                    note="Overhead recorded for the day."
                  />
                  <NumberCard
                    label="Profit status"
                    value="Unknown"
                    note="Profit depends on costs that may be recorded later."
                  />
                </div>
              </section>

              <section>
                <SectionLabel>How to use it</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  This is about direction, not perfection
                </h2>

                <p className="mt-4">
                  These three numbers separate movement from performance.
                  They tell you what you know today and what you don’t.
                </p>

                <Callout title="The calm close">
                  <>
                    At the end of the day, you should be able to say:
                    <br />
                    <span className="font-semibold text-slate-900">
                      “This is what happened today, based on what’s recorded.”
                    </span>
                  </>
                </Callout>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-semibold text-slate-900">Next</p>
                <p className="mt-2">
                  Now that the routine is clear, the next step is understanding *why* profit sometimes stays unknown
                  and why that’s not a failure.
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
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
