import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Why Most Business Owners Don’t Actually Know How Much They Made Today | ProfitPilot Insights",
  description:
    "Many business owners end the day unsure if they actually made money. This article explains why — in plain language — without accounting jargon.",
};

export default function BlogPostPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/insights"
            className="text-sm text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
          >
            Insights
          </Link>
          <span className="text-sm text-neutral-400">/</span>
          <Link
            href="/insights/profitpilot"
            className="text-sm text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
          >
            ProfitPilot
          </Link>
          <span className="text-sm text-neutral-400">/</span>
          <span className="text-sm text-neutral-800">Article</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
            Problem Awareness
          </span>
          <span className="text-xs text-neutral-500">4–6 min read</span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs text-neutral-500">Jan 2026</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Why Most Business Owners Don’t Actually Know How Much They Made Today
        </h1>
        <p className="text-base text-neutral-600">
          A plain-language explanation of why “today’s profit” feels so hard to
          pin down — and why it isn’t your fault.
        </p>
      </header>

      <div className="prose prose-neutral max-w-none">
        <p>
          At the end of most days, we all ask ourselves the same quiet question:
        </p>
        <p>
          <strong>“Did today actually go well?”</strong>
        </p>
        <p>
          Sales happened. Money moved. Work got done. But when we try to answer
          that question clearly, it suddenly gets… fuzzy.
        </p>
        <p>
          We might check our bank balance. We might look at sales numbers. We
          might even open our accounting dashboard.
        </p>
        <p>And yet, the answer still doesn’t feel solid.</p>
        <p>If that sounds familiar, you’re not alone.</p>

        <h2>The question we’re really trying to answer</h2>
        <p>
          Most business owners aren’t trying to do complex financial analysis at
          the end of the day. We’re just trying to understand one simple thing:
        </p>
        <p>
          <strong>“Did my business make money today?”</strong>
        </p>
        <p>Not this month. Not last quarter. Not after an accountant closes the books.</p>
        <p>
          <strong>Today.</strong>
        </p>
        <p>That question matters because tomorrow’s decisions depend on it.</p>

        <h2>Why checking your bank balance feels like the answer</h2>
        <p>When we don’t have a clear number, we default to what’s easiest to see.</p>
        <p>The bank balance.</p>
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
          So while the number looks clear, what it represents isn’t.
        </p>
        <p>
          A bank balance tells us <strong>where money is</strong>, not{" "}
          <strong>what we earned</strong>.
        </p>

        <h2>Sales are not the same as profit</h2>
        <p>
          Another common shortcut is sales. We think: “We had a strong sales day,
          so we must have done well.”
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
        <p>That’s not a mistake on your part. It’s just how businesses work.</p>

        <h2>Why accounting reports don’t give daily clarity</h2>
        <p>
          At some point, most of us turn to accounting software for answers. And
          then we hit another wall.
        </p>
        <p>The reports are detailed, technical, and focused on periods, not days.</p>
        <p>
          Accounting tools are incredibly important — but they’re designed for
          accuracy and compliance, not daily decision-making.
        </p>
        <p>
          Accountants think in weeks, months, and quarters. Business owners think
          in <strong>today and tomorrow</strong>.
        </p>
        <p>That mismatch creates frustration.</p>

        <h2>The real issue isn’t you</h2>
        <p>
          Here’s the part that matters most:{" "}
          <strong>This confusion is not because you’re bad with numbers.</strong>
        </p>
        <p>
          It’s because the tools you’re using were not designed around how
          business owners actually think.
        </p>
        <p>
          We don’t wake up wanting spreadsheets. We wake up wanting clarity.
        </p>
        <p>We want to know:</p>
        <ul>
          <li>Are we moving forward?</li>
          <li>Are our decisions working?</li>
          <li>Are we okay?</li>
        </ul>
        <p>
          When the systems don’t answer those questions clearly, doubt creeps in.
        </p>

        <h2>Why daily profit feels so hard to pin down</h2>
        <p>Most systems calculate profit after the fact.</p>
        <p>By the time the numbers are clear:</p>
        <ul>
          <li>The day is long gone</li>
          <li>The decisions have already been made</li>
          <li>The opportunity to adjust has passed</li>
        </ul>
        <p>That delay is the real problem.</p>
        <p>
          Daily profit isn’t impossible to know — it’s just rarely designed for
          the people who need it most.
        </p>

        <h2>You’re asking the right question</h2>
        <p>
          If you’ve ever ended a day unsure whether your business actually made
          money, that’s not a failure.
        </p>
        <p>It’s a signal.</p>
        <p>
          A signal that the way performance is being presented doesn’t match the
          way you run your business.
        </p>
        <p>
          There are better ways to think about daily performance — starting with
          separating cash movement from profit.
        </p>
        <p>We’ll explore that next.</p>
      </div>

      <footer className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <h3 className="text-sm font-semibold text-neutral-900">Next up</h3>
        <p className="mt-1 text-sm text-neutral-700">
          Blog 2 will explain <strong>cashflow vs profit</strong> in plain
          language, and why mixing them up leads to confusing decisions.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/insights/profitpilot"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
          >
            Back to ProfitPilot hub
          </Link>
          <Link
            href="/insights"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
          >
            All Insights
          </Link>
        </div>
      </footer>
    </article>
  );
}
