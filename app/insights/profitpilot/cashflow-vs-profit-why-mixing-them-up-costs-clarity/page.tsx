import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity | ProfitPilot | SolFligh Tech",
  description:
    "Cashflow and profit answer different questions. ProfitPilot treats profit as conditional and refuses to guess when costs are incomplete—so you always know what’s true.",
  alternates: {
    canonical: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
  },
  openGraph: {
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "Cashflow and profit answer different questions. ProfitPilot treats profit as conditional and refuses to guess when costs are incomplete.",
    url: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-slate-900">{children}</h2>;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="mt-4 text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}

export default function Page() {
  const hubHref = "/insights/profitpilot";

  // ✅ Seamless chain
  const prevArticleHref =
    "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today";
  const nextArticleHref =
    "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily";

  // ✅ Cover (match your hub + header images)
  const coverImage = "/insights/profitpilot/posts/cashflow-vs-profit.jpg";

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
              <span className="font-semibold text-slate-900">Cashflow vs Profit</span>
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
                <Pill>Solution Awareness</Pill>
                <Pill>4–6 min</Pill>
                <Pill>Jan 2026</Pill>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Cashflow vs Profit: why mixing them up is costing you clarity
              </h1>

              <p className="text-base leading-7 text-slate-700">
                Many business owners end the day with a “good feeling” because money came in — then feel confused a week
                later when bills hit and nothing is left.
                <br />
                That confusion usually has one root cause: treating <strong>cashflow</strong> and <strong>profit</strong>{" "}
                as the same thing.
              </p>

              {/* Cover */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-[240px] w-full sm:h-[320px]">
                  <Image
                    src={coverImage}
                    alt="Cashflow vs Profit cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                </div>
              </div>

              {/* Clarification block (canonical) */}
              <ProfitLogicClarification tone="warn" showOneLiner showHint />
            </header>

            {/* Body */}
            <section className="space-y-8">
              <SectionTitle>Cashflow answers “did money move?”</SectionTitle>
              <p className="text-sm leading-7 text-slate-700">
                Cashflow is about movement of cash — what came in and what went out.
                <br />
                It’s useful for day-to-day survival: paying salaries, restocking, and avoiding “no cash” emergencies.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <Card title="Cash inflow examples" subtitle="Cash increased, but this doesn’t automatically mean profit.">
                  <ul className="m-0 list-disc pl-5">
                    <li>Customer paid today (even if sale costs aren’t fully recorded)</li>
                    <li>Owner added money to the business</li>
                    <li>A loan or advance landed</li>
                    <li>Old debts finally got paid</li>
                  </ul>
                </Card>

                <Card title="Cash outflow examples" subtitle="Cash decreased, but you might still be profitable overall.">
                  <ul className="m-0 list-disc pl-5">
                    <li>Buying inventory for future sales</li>
                    <li>Paying rent for the month upfront</li>
                    <li>Repaying a loan</li>
                    <li>Purchasing equipment</li>
                  </ul>
                </Card>
              </div>

              <SectionTitle>Profit answers “did we create value after costs?”</SectionTitle>
              <p className="text-sm leading-7 text-slate-700">
                Profit is what remains after the costs required to generate revenue are accounted for.
                <br />
                The key phrase is <strong>accounted for</strong>. If some required costs are missing, then profit isn’t
                known — and a guess can be more harmful than silence.
              </p>

              <Card title="Why ProfitPilot treats profit as conditional" subtitle="If a number cannot be proven, it is not shown.">
                <p className="m-0">
                  Profit is a chain:
                  <br />
                  <strong>Revenue</strong> → subtract <strong>COGS</strong> → you get <strong>Gross Profit</strong>.
                  <br />
                  Then subtract <strong>Operating Expenses</strong> → you get <strong>Operating Profit</strong>.
                </p>

                <p className="mt-3 mb-0">
                  If any required cost is missing (especially COGS tied to specific sales), ProfitPilot refuses to
                  estimate. You’ll see <strong>“— —”</strong> and a clear explanation of what’s missing.
                </p>
              </Card>

              <SectionTitle>“But I still want a daily signal”</SectionTitle>
              <p className="text-sm leading-7 text-slate-700">
                That’s reasonable. When COGS is incomplete but operating expenses are recorded, ProfitPilot can show a
                separate metric:
                <br />
                <strong>Operating surplus / deficit (recorded)</strong> = Revenue − Operating Expenses (recorded)
              </p>

              <Card title="Important: this is not profit" subtitle="It’s labeled explicitly so you don’t confuse the two.">
                <p className="m-0">
                  Operating surplus / deficit (recorded) helps you understand whether your overhead is being covered by
                  recorded revenue — even when COGS is missing.
                </p>
                <p className="mt-3 mb-0">
                  But it is not profit. Profit requires sale-linked costs to be complete. ProfitPilot won’t pretend
                  otherwise.
                </p>
              </Card>

              <SectionTitle>The practical takeaway</SectionTitle>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card title="Use cashflow for survival" subtitle="Can I pay? Can I restock? Will I run out of cash?">
                  <ul className="m-0 list-disc pl-5">
                    <li>Cash on hand</li>
                    <li>Upcoming bills</li>
                    <li>Timing of payments</li>
                    <li>Short-term runway</li>
                  </ul>
                </Card>

                <Card title="Use profit for truth" subtitle="Did the business create value after real costs?">
                  <ul className="m-0 list-disc pl-5">
                    <li>Gross profit (only when COGS is complete)</li>
                    <li>Operating profit (only when gross profit is known)</li>
                    <li>Confidence in decisions</li>
                    <li>Pricing and margin reality</li>
                  </ul>
                </Card>
              </div>

              <Card title="ProfitPilot’s stance" subtitle="Trust over comfort.">
                <p className="m-0">Many tools always show a number. ProfitPilot shows a number only when it’s defensible.</p>
                <p className="mt-3 mb-0">
                  If your costs are incomplete, you won’t get a fake profit figure — you’ll get clarity on what’s
                  missing, and a truthful signal where possible.
                </p>
              </Card>

              {/* Bottom nav */}
              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
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
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Talk to us
                </Link>
              </div>
            </section>
          </article>
        </Container>
      </section>
    </main>
  );
}
