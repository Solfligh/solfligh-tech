// app/insights/profitpilot/the-3-numbers-every-sme-should-check-daily/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "The 3 Numbers Every SME Should Check Before Closing for the Day | ProfitPilot | SolFligh Tech",
  description:
    "Daily clarity doesn’t require accounting knowledge. These three checks help you end each day knowing what’s true, what’s missing, and whether today likely helped or hurt your business without guessing profit.",
  alternates: {
    canonical: "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily",
  },
  openGraph: {
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    description:
      "Three daily checks for SMEs: revenue recorded, operating expenses recorded, and profit status (proven or unavailable). Direction first, accuracy when data supports it.",
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
    tag: "Teaching",
    readingTime: "4–5 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/three-numbers.jpg",
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    subtitle:
      "A simple end-of-day routine: know what moved, what was recorded, and whether profit is proven or still unknown. No guessing.",
  };

  // ✅ Navigation
  const prevArticleHref =
    "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity";

  // ✅ Use the corrected slug (redirect covers the old one too)
  const nextArticleHref = "/insights/profitpilot/from-daily-numbers-to-daily-clarity";

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
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent" />
              </div>
            </div>

            {/* Article */}
            <article className="mx-auto mt-12 max-w-3xl space-y-10 text-base leading-relaxed text-slate-700">
              <section>
                <SectionLabel>The daily goal</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Close the day with a verdict, not a vibe
                </h2>

                <p className="mt-4">
                  Most SMEs end the day with activity sales alerts, transfers, and a bank balance but still can’t
                  answer the only question that matters for momentum:
                </p>

                <p className="mt-3 font-semibold text-slate-900">
                  Did today help the business or hurt it?
                </p>

                <Callout title="The calm sentence">
                  <>
                    At day end, you should be able to say:
                    <br />
                    <span className="font-semibold text-slate-900">
                      “I know what’s true about today and what’s still missing.”
                    </span>
                  </>
                </Callout>
              </section>

              {/* ✅ Anchor honesty (no fake certainty) */}
              <ProfitLogicClarification tone="warn" showOneLiner />

              <section>
                <SectionLabel>The routine</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Three daily checks tell the story without confusion
                </h2>

                <p className="mt-4">
                  You don’t need spreadsheets or accounting language. You need three checks that answer three different
                  questions and stay honest even when some costs haven’t been recorded yet.
                </p>

                <ul className="mt-6 space-y-3">
                  <li>
                    <strong>1) Revenue recorded today</strong> what sales were recorded for the day.
                  </li>
                  <li>
                    <strong>2) Operating expenses recorded</strong> what overhead costs were recorded today (or allocated
                    to today).
                  </li>
                  <li>
                    <strong>3) Profit status</strong> either a proven profit number, or “— —” with a clear reason.
                  </li>
                </ul>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <NumberCard
                    label="Revenue recorded today"
                    value="₦120,000"
                    note="Recorded sales value for the day (not profit)."
                  />
                  <NumberCard
                    label="Operating expenses (recorded)"
                    value="₦18,500"
                    note="Recorded overhead (rent, data, utilities, subscriptions, etc.)."
                  />
                  <NumberCard
                    label="Profit status"
                    value="— —"
                    note="Profit is unknown until required sale-linked costs (COGS) are recorded."
                    tone="warn"
                  />
                </div>
              </section>

              <section>
                <SectionLabel>The meaning</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  What these three numbers actually give you
                </h2>

                <p className="mt-4">
                  They separate what most SMEs accidentally mix:
                  <strong> movement</strong> (money moving) vs <strong>performance</strong> (value created after costs).
                </p>

                <p className="mt-3">
                  When the profit status says “unknown,” that’s not a failure. It’s a signal:
                  the day happened, revenue is recorded, overhead is recorded but the sale-linked costs aren’t complete
                  yet.
                </p>

                <Callout title="Trust rule (locked)">
                  <>
                    <p className="m-0">
                      <span className="font-semibold text-slate-900">
                        We won’t tell you profit unless the data supports it
                      </span>{" "}
                      but we can still tell you what today likely meant based on what’s recorded.
                    </p>
                  </>
                </Callout>
              </section>

              <section>
                <SectionLabel>When profit is unknown</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  You can still get a useful daily signal
                </h2>

                <p className="mt-4">
                  Decisions don’t wait for perfect books. And that’s the honest tension:
                  <br />
                  <span className="font-semibold text-slate-900">
                    Daily verdict never waits for COGS. Profit numbers always do.
                  </span>
                </p>

                <p className="mt-3">
                  So when sale-linked costs aren’t complete yet, the best “today” signal is not profit it’s a clearly
                  labeled indicator based on recorded overhead:
                </p>

                <Callout title="Operating surplus / deficit (recorded)">
                  <>
                    <p className="m-0">
                      <strong>Operating surplus / deficit (recorded)</strong> = Revenue − Operating Expenses (recorded)
                    </p>
                    <p className="mt-3 mb-0">
                      This is <strong>not profit</strong>. It simply tells you whether recorded revenue is covering
                      recorded overhead while you finish recording required sale-linked costs.
                    </p>
                  </>
                </Callout>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <NumberCard
                    label="Revenue recorded today"
                    value="₦120,000"
                    note="Recorded sales value."
                  />
                  <NumberCard
                    label="Operating expenses (recorded)"
                    value="₦18,500"
                    note="Recorded overhead for the day/period."
                  />
                  <NumberCard
                    label="Operating surplus/deficit (recorded)"
                    value="₦101,500"
                    note="A direction signal while profit is unknown (NOT profit)."
                    tone="success"
                  />
                </div>
              </section>

              <section>
                <SectionLabel>Why this becomes a habit</SectionLabel>
                <p className="mt-4">
                  This routine is small enough to do daily, and honest enough to trust.
                  It gives you a daily close:
                  you know what moved, what was recorded, what’s missing, and what today likely did to the business.
                </p>
              </section>

              {/* ✅ NO waitlist; keep teaching */}
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-semibold text-slate-900">Keep going</p>
                <p className="mt-2">
                  Next, we’ll connect these daily checks to a simple habit:
                  turning daily numbers into daily clarity without pretending profit exists when costs are incomplete.
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
