// app/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity/page.tsx
import type { Metadata } from "next";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://solflightech.org";

export const metadata: Metadata = {
  title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
  description:
    "Many business owners confuse cashflow with profit, leading to daily uncertainty. Here’s a plain-language explanation of the difference and why it matters.",
  alternates: {
    canonical: `${SITE_URL}/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity`,
  },
  openGraph: {
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "A clear, non-technical explanation of cashflow vs profit — and why confusing them makes it hard to know how your business is really performing.",
    url: `${SITE_URL}/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity`,
    type: "article",
    siteName: "SOLFLIGH TECH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "Cashflow and profit answer different questions. Mixing them up is why many business owners feel unsure at the end of the day.",
  },
};

export default function ArticlePage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="py-16 sm:py-20">
        <Container>
          <PageHeader
            level={1}
            badge="ProfitPilot Insights"
            title="Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity"
            subtitle="A plain-language explanation of the difference — and why confusing them makes daily decisions harder than they need to be."
          />

          <article className="prose prose-slate mt-12 max-w-none">
            <p>
              If you’re running a business, chances are you’ve had days like this:
            </p>

            <p>
              Money came in.<br />
              Customers paid.<br />
              Your phone showed bank alerts.
            </p>

            <p>
              Yet somehow, when the day ended, you still couldn’t confidently
              answer one simple question:
            </p>

            <p>
              <strong>Did my business actually make money today?</strong>
            </p>

            <p>
              If that sounds familiar, you’re not bad at business — you’re just
              mixing up <strong>cashflow</strong> and <strong>profit</strong>.
            </p>

            <h2>The mistake almost everyone makes</h2>

            <p>
              Most people look at their <strong>bank balance</strong> or
              <strong> sales notifications</strong> and assume that tells the
              full story.
            </p>

            <p>
              It doesn’t.
            </p>

            <p>
              That’s because cashflow and profit are not the same thing, even
              though they often feel like they should be.
            </p>

            <h2>Cashflow: what’s moving</h2>

            <ul>
              <li>Money coming into your business</li>
              <li>Money going out of your business</li>
              <li>And <em>when</em> that movement happens</li>
            </ul>

            <p>
              Cashflow tells you whether you can survive day to day — pay rent,
              salaries, suppliers, and bills.
            </p>

            <h2>Profit: what you actually earned</h2>

            <p>
              Profit answers a different question:
            </p>

            <blockquote>
              After everything it truly cost to run the business, what did we
              really earn?
            </blockquote>

            <p>
              You can have money in the bank and still be losing money as a
              business.
            </p>

            <h2>Why this creates daily confusion</h2>

            <p>
              When cashflow and profit are blended together, business owners end
              each day with activity — not understanding.
            </p>

            <ul>
              <li>Sales alerts don’t equal profit</li>
              <li>Bank balances don’t equal performance</li>
              <li>Being busy doesn’t mean being profitable</li>
            </ul>

            <h2>Both matter — but for different reasons</h2>

            <p>
              <strong>Cashflow keeps you alive.</strong><br />
              <strong>Profit tells you if you’re winning.</strong>
            </p>

            <h2>What’s coming next</h2>

            <p>
              Once you clearly separate cashflow from profit, a new question
              becomes possible:
            </p>

            <blockquote>
              How much did my business actually make today — in plain language?
            </blockquote>

            <p>
              That’s what the next article will tackle.
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
