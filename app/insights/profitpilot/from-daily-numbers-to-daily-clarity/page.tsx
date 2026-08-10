import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import InsightJsonLd from "@/app/components/InsightJsonLd";

export const metadata: Metadata = {
  title: "From Daily Number to Daily Clarity: ProfitPilot’s Conditional Profit Logic | SolFligh Tech",
  description:
    "ProfitPilot treats profit as a conditional number: if required costs are incomplete, it refuses to guess. Learn how Revenue, COGS, Gross Profit, and Operating Profit work and what you see instead when data is missing.",
  alternates: {
    canonical: "/insights/profitpilot/from-daily-number-to-daily-clarity",
  },
  openGraph: {
    title: "From Daily Number to Daily Clarity: ProfitPilot’s Conditional Profit Logic",
    description:
      "ProfitPilot refuses to guess profit. If required costs aren’t recorded, it shows “— —” and explains what’s missing.",
    url: "/insights/profitpilot/from-daily-number-to-daily-clarity",
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

function SmallLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</p>;
}

function StateCard({
  title,
  tone = "neutral",
  children,
}: {
  title: string;
  tone?: "neutral" | "warn" | "success";
  children: React.ReactNode;
}) {
  const styles =
    tone === "warn"
      ? "border-amber-200 bg-amber-50"
      : tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : "border-slate-200 bg-white";

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}

export default function Page() {
  const hubHref = "/insights/profitpilot";

  // ✅ Chain
  const prevArticleHref = "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily";
  const nextArticleHref =
    "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit";

  const coverImage = "/insights/profitpilot/posts/daily-number-to-clarity.jpg";

  return (
    <main className="bg-white text-slate-900">
      <InsightJsonLd href="/insights/profitpilot/from-daily-numbers-to-daily-clarity" />
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
                <Pill>Profit Logic</Pill>
                <Pill>5–7 min</Pill>
                <Pill>Jan 2026</Pill>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                From daily number to daily clarity
              </h1>

              <p className="text-base leading-7 text-slate-700">
                This article explains one thing clearly:{" "}
                <span className="font-semibold text-slate-900">when is “profit” actually a proven number?</span>
                <br />
                Not when money moved. Not when sales happened.
                <br />
                Profit is only real when the required costs are included.
              </p>

              {/* Cover */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-[240px] w-full sm:h-[320px]">
                  <Image
                    src={coverImage}
                    alt="From daily number to daily clarity cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                </div>
              </div>
            </header>

            {/* Body */}
            <section className="space-y-8">
              <section className="space-y-3">
                <SmallLabel>The trap</SmallLabel>
                <h2 className="text-xl font-bold text-slate-900">
                  The mistake isn’t “not knowing profit” it’s showing profit too early
                </h2>
                <p className="leading-7 text-slate-700">
                  Many tools always show a profit number even when key costs are missing. That feels helpful, but it
                  creates a dangerous habit: trusting numbers that can’t be defended.
                </p>

                <Callout title="Rule of proof" tone="warn">
                  <p className="m-0">
                    Profit is only real when the costs required to produce the revenue are included.
                    <br />
                    If required costs are missing, the honest answer is: <strong>profit is not known yet.</strong>
                  </p>
                </Callout>
              </section>

              <section className="space-y-3">
                <SmallLabel>Definitions</SmallLabel>
                <h2 className="text-xl font-bold text-slate-900">Profit is a chain</h2>
                <p className="leading-7 text-slate-700">
                  Think of profit like a chain of proof. If any link is missing, the final number cannot be trusted.
                </p>

                <div className="space-y-3">
                  <FormulaRow left="Revenue" right="Total value of sales recorded for the period" />
                  <FormulaRow
                    left="COGS (Cost of Goods Sold)"
                    right="Costs directly tied to each sale (inventory or direct costs)"
                  />
                  <FormulaRow
                    left="Gross Profit"
                    right={
                      <>
                        Revenue − COGS{" "}
                        <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          only when sale costs are complete
                        </span>
                      </>
                    }
                  />
                  <FormulaRow
                    left="Operating Expenses"
                    right="Overhead costs for the period (rent, utilities, data, subscriptions, etc.)"
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
              </section>

              <section className="space-y-3">
                <SmallLabel>What counts as required</SmallLabel>
                <h2 className="text-xl font-bold text-slate-900">“Required costs” are not optional</h2>
                <p className="leading-7 text-slate-700">
                  The most common missing link is sale-linked cost (COGS). If you sold something today but the cost of
                  that thing is not recorded, the profit number is incomplete.
                </p>

                <Callout title="A simple test" tone="neutral">
                  <p className="m-0">
                    If you remove a cost and your “profit” changes that cost is required.
                    <br />
                    If it’s missing, profit cannot be proven.
                  </p>
                </Callout>
              </section>

              <section className="space-y-3">
                <SmallLabel>What ProfitPilot shows</SmallLabel>
                <h2 className="text-xl font-bold text-slate-900">3 states: proven, unknown, and “here’s what’s missing”</h2>
                <p className="leading-7 text-slate-700">
                  ProfitPilot doesn’t fill blanks. Instead, it makes the state of the number explicit.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <StateCard title="Proven profit" tone="success">
                    Profit can be shown because required costs are complete.
                    <br />
                    The chain holds.
                  </StateCard>

                  <StateCard title="Profit unknown" tone="warn">
                    Profit displays as <strong>“— —”</strong> because required costs are missing.
                    <br />
                    No guessing.
                  </StateCard>

                  <StateCard title="Actionable gap" tone="neutral">
                    You see what’s missing (example: “3 sales missing item costs”) so you know exactly what to fix.
                  </StateCard>
                </div>

                <Callout title="Example: when COGS is incomplete" tone="neutral">
                  <p className="m-0">
                    You may see profit displayed as <strong>“— —”</strong>.
                    <br />
                    The UI can tell you what’s missing and which records need costs added.
                  </p>
                </Callout>
              </section>

              <section className="space-y-3">
                <SmallLabel>Useful while you complete costs</SmallLabel>
                <h2 className="text-xl font-bold text-slate-900">
                  A separate signal while the profit chain completes
                </h2>
                <p className="leading-7 text-slate-700">
                  When sale-linked costs are incomplete but operating expenses are recorded, you can still track a
                  clearly labeled direction signal:
                  <strong> operating surplus / deficit (recorded).</strong> It is not profit.
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
                    This article’s point is simple:
                    <br />
                    <span className="font-semibold">a proven number builds trust</span>, and a guessed number builds
                    confusion.
                  </p>
                </Callout>
              </section>

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
