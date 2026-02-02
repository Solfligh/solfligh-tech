import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "From Daily Numbers to Daily Clarity: The Logic Behind ProfitPilot | SolFligh Tech",
  description:
    "Daily decisions can’t wait for perfect accounting. ProfitPilot won’t show profit unless the data supports it but it will still help you close each day knowing whether today helped or hurt your business, and what’s missing when profit is unknown.",
  alternates: {
    canonical: "/insights/profitpilot/from-daily-numbers-to-daily-clarity",
  },
  openGraph: {
    title: "From Daily Numbers to Daily Clarity: The Logic Behind ProfitPilot",
    description:
      "ProfitPilot refuses to guess profit. When costs are missing, it shows what’s missing and still helps you judge the day with honest signals.",
    url: "/insights/profitpilot/from-daily-numbers-to-daily-clarity",
    type: "article",
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function Callout({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "warn" | "success";
}) {
  const styles =
    tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-2xl border p-5 ${styles}`}>
      <p className="text-sm font-bold">{title}</p>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </div>
  );
}

function FormulaRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-semibold text-slate-900">{left}</div>
      <div className="text-sm text-slate-700">{right}</div>
    </div>
  );
}

export default function Page() {
  const hubHref = "/insights/profitpilot";

  // ✅ Seamless chain
  const prevArticleHref = "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily";
  const nextArticleHref =
    "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit";

  // ✅ Cover (make sure this file exists in /public/insights/profitpilot/posts/)
  const coverImage = "/insights/profitpilot/posts/daily-number-to-clarity.jpg";

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <Container>
          <article className="mx-auto max-w-3xl space-y-10 py-10">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link href={hubHref} className="font-semibold text-slate-600 hover:text-slate-900">
                ProfitPilot
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Article</span>
            </div>

            {/* Top nav */}
            <div className="flex flex-wrap gap-3">
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
                href={hubHref}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Back to hub
              </Link>
            </div>

            {/* Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>Teaching</Pill>
                <Pill>5–7 min</Pill>
                <Pill>Jan 2026</Pill>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                From daily numbers to daily clarity
              </h1>

              <p className="text-base leading-7 text-slate-700">
                Most business owners end the day with sales alerts, transfers, and a bank balance and still can’t
                close the day with confidence.
                <br />
                The real question isn’t “did money move?”
                <br />
                It’s:{" "}
                <span className="font-semibold text-slate-900">did today help the business or hurt it?</span>
              </p>

              {/* Cover */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-[240px] w-full sm:h-[320px]">
                  <Image
                    src={coverImage}
                    alt="From daily numbers to daily clarity cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                </div>
              </div>

              {/* Canonical clarification block */}
              <ProfitLogicClarification tone="success" showOneLiner showHint />

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
                <p className="m-0 font-semibold text-slate-900">
                  ProfitPilot doesn’t ask how complex your business is.
                </p>
                <p className="mt-2 mb-0">
                  It asks whether <span className="font-semibold text-slate-900">today moved it forward</span>.
                </p>
              </div>
            </header>

            {/* Body */}
            <section className="space-y-8">
              <h2 className="text-xl font-bold text-slate-900">
                Why “a number” can be more dangerous than “no number”
              </h2>
              <p className="leading-7 text-slate-700">
                The fastest way to lose trust is fake certainty.
                Many tools always show “profit” even when key costs are missing. It feels helpful, but it can be a
                guess dressed up as truth. The result is worse than confusion: owners make decisions using a number that
                isn’t real.
              </p>

              <Callout title="What ProfitPilot refuses to do" tone="warn">
                <ul className="m-0 list-disc pl-5">
                  <li>No estimates</li>
                  <li>No averages</li>
                  <li>No “close enough” profit</li>
                </ul>
              </Callout>

              <Callout title="The trust boundary (locked)" tone="neutral">
                <p className="m-0">
                  <span className="font-semibold text-slate-900">
                    We won’t tell you profit unless the data supports it
                  </span>{" "}
                  but we’ll still tell you what’s true about today, and what’s missing.
                </p>
              </Callout>

              <h2 className="text-xl font-bold text-slate-900">
                Profit is a chain and costs are the missing link
              </h2>
              <p className="leading-7 text-slate-700">
                Revenue alone doesn’t tell you profit. To know whether the day truly created value, you need the costs
                tied to those sales. If required sale-linked costs aren’t recorded, the profit number cannot be proven
                so ProfitPilot won’t show it.
              </p>

              <div className="space-y-3">
                <FormulaRow left="Revenue" right="Total value of sales recorded for the period" />
                <FormulaRow
                  left="Sale-linked costs (often called COGS)"
                  right="Costs directly tied to each sale (inventory or direct costs)"
                />
                <FormulaRow
                  left="Gross Profit"
                  right={
                    <>
                      Revenue − sale-linked costs{" "}
                      <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        only when costs are recorded
                      </span>
                    </>
                  }
                />
                <FormulaRow
                  left="Operating Expenses"
                  right="Overhead costs allocated to the period (rent, utilities, subscriptions, etc.)"
                />
                <FormulaRow
                  left="Operating Profit"
                  right={
                    <>
                      Gross Profit − Operating Expenses{" "}
                      <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        only when gross profit is known
                      </span>
                    </>
                  }
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                What happens when required costs are missing?
              </h2>
              <p className="leading-7 text-slate-700">
                If any required cost is missing, ProfitPilot does not “fill in the blanks.”
                Instead, it shows <strong>“— —”</strong> and explains why profit is unavailable clearly and in plain
                language.
              </p>

              <Callout title="Example: when sale-linked costs are incomplete" tone="neutral">
                <p className="m-0">
                  You may see profit displayed as <strong>“— —”</strong>.
                  <br />
                  The UI tells you what’s missing (for example: “3 sales are missing item costs”).
                </p>
              </Callout>

              <h2 className="text-xl font-bold text-slate-900">
                You can still get daily clarity without guessing profit
              </h2>
              <p className="leading-7 text-slate-700">
                Here’s the honest tension of small business:
                <br />
                <span className="font-semibold text-slate-900">
                  Daily verdict never waits for COGS. Profit numbers always do.
                </span>
              </p>
              <p className="leading-7 text-slate-700">
                So when sale-linked costs are incomplete but operating expenses are recorded, ProfitPilot can show a
                separate metric:
                <strong> Operating surplus / deficit (recorded)</strong>.
                It’s not profit and it is labeled explicitly.
              </p>

              <div className="space-y-3">
                <FormulaRow
                  left={
                    <>
                      Operating surplus / deficit{" "}
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                        recorded (NOT profit)
                      </span>
                    </>
                  }
                  right="Revenue − Operating Expenses (recorded)"
                />
              </div>

              <Callout title="Why this matters" tone="success">
                <p className="m-0">
                  A proven number builds trust.
                  <br />
                  A guessed number builds confusion.
                  <br />
                  ProfitPilot chooses trust even if that means showing “— —” until the data is complete.
                </p>
              </Callout>

              <h2 className="text-xl font-bold text-slate-900">
                Daily clarity is a habit, not a report
              </h2>
              <p className="leading-7 text-slate-700">
                The point isn’t to impress you with dashboards. It’s to help you close the day with a truthful summary:
                what you know, what you don’t, and what to fix next.
                <br />
                When profit is available, you see it. When it’s not, you see exactly what’s missing and you still get
                a clear daily signal where possible.
              </p>

              {/* Bottom nav */}
              <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
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
                  href={hubHref}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Back to hub
                </Link>

                <div className="flex-1" />

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Talk to us about ProfitPilot
                </Link>
              </div>
            </section>
          </article>
        </Container>
      </section>
    </main>
  );
}
