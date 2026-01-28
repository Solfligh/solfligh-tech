import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title:
    "Why Most Business Owners Don’t Actually Know How Much They Made Today | ProfitPilot Insights",
  description:
    "Many business owners end the day unsure if they actually made money. This article explains why in plain language without accounting jargon.",
};

const toc = [
  { id: "the-real-question", label: "The question we’re really trying to answer" },
  { id: "bank-balance", label: "Why checking your bank balance feels like the answer" },
  { id: "sales-vs-profit", label: "Sales are not the same as profit" },
  { id: "reports-not-daily", label: "Why accounting reports don’t give daily clarity" },
  { id: "not-you", label: "The real issue isn’t you" },
  { id: "why-hard", label: "Why daily profit feels so hard to pin down" },
  { id: "right-question", label: "You’re asking the right question" },
];

function ArticleHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(59,130,246,0.16),transparent_52%)]" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
          Problem Awareness
        </span>
        <span className="text-xs font-semibold text-slate-600">4–6 min read</span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs font-semibold text-slate-600">Jan 2026</span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/70 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">The core idea</p>
        <p className="mt-2 text-base font-bold text-slate-900">
          Bank balance tells you <span className="text-sky-700">where money is</span> — not{" "}
          <span className="text-sky-700">what you earned</span>.
        </p>
      </div>
    </div>
  );
}

function OnThisPage() {
  return (
    <aside className="sticky top-24 hidden h-fit rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur lg:block">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">On this page</p>
      <nav className="mt-4 space-y-2">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mt-5 space-y-2">
        <Link
          href="/insights/profitpilot"
          className="block rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back to ProfitPilot hub
        </Link>
        <Link
          href="/insights"
          className="block rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          All Insights
        </Link>
      </div>
    </aside>
  );
}

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.12),transparent_55%)]" />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="mt-3 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl"
    >
      {children}
    </h2>
  );
}

export default function BlogPostPage() {
  return (
    <main className="space-y-10">
      {/* Breadcrumb (simple + premium) */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
          Insights
        </Link>
        <span className="text-slate-400">/</span>
        <Link
          href="/insights/profitpilot"
          className="font-semibold text-slate-600 hover:text-slate-900"
        >
          ProfitPilot
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">Article</span>
      </div>

      <div className="space-y-4">
        <PageHeader
          badge="Article"
          title="Why Most Business Owners Don’t Actually Know How Much They Made Today"
          subtitle="A plain-language explanation of why “today’s profit” feels so hard to pin down and why it isn’t your fault."
        />
        <ArticleHero />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_.38fr] lg:items-start">
        {/* Main content */}
        <article className="space-y-8">
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed">
              <p>
                At the end of most days, we all ask ourselves the same quiet question:
              </p>
              <p>
                <strong>“Did today actually go well?”</strong>
              </p>
              <p>
                Sales happened. Money moved. Work got done. But when we try to answer that question clearly,
                it suddenly gets… fuzzy.
              </p>

              <hr />

              <SectionTitle id="the-real-question">
                The question we’re really trying to answer
              </SectionTitle>
              <p>
                Most business owners aren’t trying to do complex financial analysis at the end of the day.
                We’re just trying to understand one simple thing:
              </p>
              <p>
                <strong>“Did my business make money today?”</strong>
              </p>
              <p>
                Not this month. Not last quarter. Not after an accountant closes the books.
              </p>
              <p>
                <strong>Today.</strong>
              </p>
              <p>That question matters because tomorrow’s decisions depend on it.</p>

              <SectionTitle id="bank-balance">
                Why checking your bank balance feels like the answer
              </SectionTitle>
              <p>
                When we don’t have a clear number, we default to what’s easiest to see: the bank balance.
              </p>
              <p>It feels logical:</p>
              <ul>
                <li>More money than yesterday? Good day.</li>
                <li>Less money? Bad day.</li>
              </ul>
              <p>The problem is… a bank balance doesn’t tell the full story.</p>
              <p>It mixes together:</p>
              <ul>
                <li>Money from previous days</li>
                <li>Today’s sales</li>
                <li>Bills that haven’t cleared yet</li>
                <li>Expenses that are coming later</li>
              </ul>
              <p>
                So while the number looks clear, what it represents isn’t. A bank balance tells us{" "}
                <strong>where money is</strong>, not <strong>what we earned</strong>.
              </p>
            </div>
          </div>

          {/* ✅ NEW: Premium callout */}
          <Callout title="Quick clarity (no jargon)">
            <p className="m-0">
              If your balance went up today, it doesn’t automatically mean you profited today.
              It could be older money arriving late, a customer payment for past work, or bills that haven’t hit yet.
            </p>
          </Callout>

          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed">
              <SectionTitle id="sales-vs-profit">
                Sales are not the same as profit
              </SectionTitle>
              <p>
                Another common shortcut is sales. We think: “We had a strong sales day, so we must have done well.”
              </p>
              <p>But sales are only part of the picture.</p>
              <p>From those sales, we still have to account for:</p>
              <ul>
                <li>Costs of goods</li>
                <li>Staff time</li>
                <li>Operating expenses</li>
                <li>Fees, refunds, and overhead</li>
              </ul>
              <p>It’s very possible to have a busy day and still not make money.</p>

              <SectionTitle id="reports-not-daily">
                Why accounting reports don’t give daily clarity
              </SectionTitle>
              <p>
                At some point, most of us turn to accounting software for answers. And then we hit another wall.
              </p>
              <p>
                The reports are detailed, technical, and focused on periods not days.
              </p>
              <p>
                Accounting tools are incredibly important but they’re designed for accuracy and compliance,
                not daily decision-making.
              </p>

              <SectionTitle id="not-you">
                The real issue isn’t you
              </SectionTitle>
              <p>
                Here’s the part that matters most:{" "}
                <strong>This confusion is not because you’re bad with numbers.</strong>
              </p>
              <p>
                It’s because the tools you’re using were not designed around how business owners actually think.
              </p>
              <p>We don’t wake up wanting spreadsheets. We wake up wanting clarity.</p>

              <SectionTitle id="why-hard">
                Why daily profit feels so hard to pin down
              </SectionTitle>
              <p>Most systems calculate profit after the fact.</p>
              <p>By the time the numbers are clear:</p>
              <ul>
                <li>The day is long gone</li>
                <li>The decisions have already been made</li>
                <li>The opportunity to adjust has passed</li>
              </ul>
              <p>That delay is the real problem.</p>

              <SectionTitle id="right-question">
                You’re asking the right question
              </SectionTitle>
              <p>
                If you’ve ever ended a day unsure whether your business actually made money, that’s not a failure.
              </p>
              <p>It’s a signal.</p>
              <p>
                A signal that the way performance is being presented doesn’t match the way you run your business.
              </p>
              <p>
                There are better ways to think about daily performance starting with separating cash movement from profit.
              </p>
              <p>We’ll explore that next.</p>
            </div>
          </div>

          {/* ✅ NEW: Related / Next up */}
          <footer className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.12),transparent_52%)]" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Next up</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  Cashflow vs Profit — why mixing them creates confusion
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  The next article will explain the difference in plain language, and how to show “today’s performance”
                  without confusing business owners.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/insights/profitpilot"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Back to hub
                </Link>
                <Link
                  href="/insights"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  All Insights
                </Link>
              </div>
            </div>
          </footer>
        </article>

        {/* Sticky TOC */}
        <OnThisPage />
      </div>
    </main>
  );
}
