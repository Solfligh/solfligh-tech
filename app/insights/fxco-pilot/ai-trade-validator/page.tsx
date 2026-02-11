import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

export const metadata: Metadata = {
  title: "FXCO-Pilot AI Trade Validator: Decision Support Before You Enter a Forex Trade | SolFligh Tech",
  description:
    "FXCO-Pilot is an AI trade validator for forex traders built to reduce emotional entries and rule-breaking losses. Validate trade context, risk, and assumptions before execution.",
  alternates: { canonical: "/insights/fxco-pilot/ai-trade-validator" },
  openGraph: {
    title: "FXCO-Pilot AI Trade Validator (Forex Decision Support)",
    description:
      "Validate a trade before you click Buy/Sell. FXCO-Pilot focuses on context, risk, and discipline not signals or predictions.",
    url: "/insights/fxco-pilot/ai-trade-validator",
    type: "article",
    images: [
      {
        url: "/insights/fxco-pilot/cover.jpg",
        width: 1536,
        height: 599,
        alt: "FXCO-Pilot | AI Trade Validator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FXCO-Pilot AI Trade Validator",
    description:
      "A second brain before execution context, risk, and discipline. Not signals. Not predictions.",
    images: ["/insights/fxco-pilot/cover.jpg"],
  },
  keywords: [
    "forex trade validator",
    "AI trade validation",
    "forex risk management",
    "trading discipline",
    "revenge trading",
    "trade decision support",
    "forex trading psychology",
    "risk to reward",
    "market structure",
    "position sizing",
  ],
};

const APP_URL = "https://fxco-pilot.solflightech.org";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

function ExtButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition";
  const primary =
    "bg-slate-900 text-white hover:bg-slate-800";
  const secondary =
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variant === "primary" ? primary : secondary}`}
    >
      {children} <span className="ml-2 text-slate-300">↗</span>
    </a>
  );
}

export default function FxcoPilotAiTradeValidatorArticlePage() {
  const publishedISO = "2026-02-11T00:00:00.000Z";
  const canonical = "https://solfightech.org/insights/fxco-pilot/ai-trade-validator";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "FXCO-Pilot AI Trade Validator: Decision Support Before You Enter a Forex Trade",
    description:
      "FXCO-Pilot is an AI trade validator for forex traders built to reduce emotional entries and rule-breaking losses. Validate trade context, risk, and assumptions before execution.",
    datePublished: publishedISO,
    dateModified: publishedISO,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "SolFligh Tech" },
    publisher: { "@type": "Organization", name: "SolFligh Tech" },
    image: "https://solfightech.org/insights/fxco-pilot/cover.jpg",
  };

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        {/* HERO */}
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:pt-14">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>Insights</Pill>
            <Pill>FXCO-Pilot</Pill>
            <Pill>Forex</Pill>
            <Pill>Decision Quality</Pill>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Validate the trade{" "}
                <span className="text-slate-600">before</span> you enter.
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                Most forex losses don’t come from not knowing how to trade.
                They come from <strong>breaking your own rules</strong>.
                FXCO-Pilot is built for the one moment that matters most:
                right before you click <em>Buy</em> or <em>Sell</em>.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* ✅ Direct to live app so it never “goes nowhere” */}
                <ExtButton
                  href={`${APP_URL}/?utm_source=solflightech&utm_medium=insights&utm_campaign=ai_trade_validator&utm_content=cta_top`}
                >
                  Open FXCO-Pilot
                </ExtButton>

                <Link
                  href="/insights/fxco-pilot"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  FXCO-Pilot hub →
                </Link>
              </div>

              {/* Quick value props */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold text-slate-500">Focus</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Discipline</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold text-slate-500">Output</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Explainable</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold text-slate-500">Not</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Signals</p>
                </div>
              </div>
            </div>

            {/* Cover */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/insights/fxco-pilot/cover.jpg"
                alt="FXCO-Pilot | AI Trade Validator"
                width={1536}
                height={599}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        {/* “Problem snapshot” cards */}
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="What causes most losses?">
              Not a lack of strategy. It’s the <strong>moment you break rules</strong> under pressure.
            </Card>
            <Card title="What most tools miss">
              Charts give info. Journals explain after. Signals give entries.
              Few tools force a <strong>pre-trade checkpoint</strong>.
            </Card>
            <Card title="What FXCO-Pilot is">
              A second brain before execution: <strong>context + risk + assumptions</strong>, explained.
            </Card>
          </div>
        </section>

        {/* ARTICLE BODY */}
        <article className="mx-auto max-w-3xl px-4 pb-16">
          {/* Featured callout */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-500/10 via-white to-sky-500/10 p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">The uncomfortable truth</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700">
              Most losses don’t come from not knowing how to trade.
              They come from <strong>breaking your own rules</strong>.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                Over-leveraging after a loss
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                Entering without confirmation
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                Ignoring news / volatility
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                Revenge trading / bias
              </div>
            </div>
          </div>

          <div className="prose prose-slate mt-10 max-w-none prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-semibold prose-h3:mt-7 prose-h3:text-xl prose-h3:font-semibold prose-p:leading-relaxed">
            <h2>The real problem with most trading tools</h2>

            <p>Let’s be honest about what’s out there today:</p>

            <ul>
              <li>Charting platforms give you information, not discipline</li>
              <li>Signal groups give you entries, not understanding</li>
              <li>Trading journals help you after the damage is done</li>
              <li>Indicators tell you what price did, not whether you should act</li>
            </ul>

            <p>
              What none of them do consistently is force you to slow down and validate your decision
              <strong> before you place the trade</strong>.
            </p>

            {/* Pull quote */}
            <blockquote>
              The biggest edge isn’t another indicator. It’s a repeatable decision process you trust on bad days.
            </blockquote>

            <h2>Why “near-live” data is a feature, not a flaw</h2>

            <p>
              Many traders obsess over real-time data. But real-time data doesn’t prevent bad decisions context does.
            </p>

            <p>
              FXCO-Pilot uses near-live market data intentionally because it isn’t trying to be a broker or a signal service.
              It’s built to answer a more important question:
            </p>

            <p>
              <strong>“Does this trade make sense right now given market conditions, risk, and your input?”</strong>
            </p>

            <h2>What FXCO-Pilot actually does (in plain English)</h2>

            <p>
              FXCO-Pilot is an AI trade validation and decision-support tool. It doesn’t place trades for you.
              It doesn’t promise guaranteed profits. It doesn’t replace your strategy.
            </p>

            <h3>1) You input the trade you’re about to take</h3>
            <p>Pair, direction, timeframe, and intent. This forces clarity: you must be clear about why you’re entering.</p>

            <h3>2) FXCO-Pilot analyzes context</h3>
            <p>Not signals. Not predictions. Context:</p>
            <ul>
              <li>Market direction &amp; structure</li>
              <li>Momentum vs consolidation</li>
              <li>Volatility conditions</li>
              <li>Risk-to-reward logic</li>
              <li>Alignment (or conflict) with your bias</li>
            </ul>

            <h3>3) You get a clear, explainable insight</h3>
            <p>Instead of “Buy” or “Sell,” you get what matters:</p>
            <ul>
              <li>Is this aligned with current conditions?</li>
              <li>Is the risk justified?</li>
              <li>What assumptions are you making?</li>
              <li>What would invalidate the setup?</li>
            </ul>

            <h2>The psychology angle most apps ignore</h2>
            <p>
              Most traders already know what they should do. They just don’t do it consistently.
              FXCO-Pilot is designed to interrupt impulsive entries, emotional overconfidence, and confirmation bias.
            </p>

            <h2>This isn’t about winning every trade</h2>
            <p>It’s about fewer stupid losses, better decision consistency, and discipline you can repeat.</p>

            <h2>Who FXCO-Pilot is for</h2>
            <ul>
              <li>You already trade and want fewer rule-breaking losses</li>
              <li>You struggle with discipline more than strategy</li>
              <li>You want confirmation, not signals</li>
              <li>You’re serious about consistency</li>
            </ul>
          </div>

          {/* Bottom CTA (lively) */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">Decision checkpoint</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Open FXCO-Pilot and validate your next trade.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200">
                  Use it right before execution to check context, risk, and assumptions so you stop paying for emotional entries.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:min-w-[240px]">
                <ExtButton
                  href={`${APP_URL}/?utm_source=solflightech&utm_medium=insights&utm_campaign=ai_trade_validator&utm_content=cta_bottom`}
                  variant="primary"
                >
                  Open FXCO-Pilot
                </ExtButton>

                <a
                  href={`${APP_URL}/?utm_source=solflightech&utm_medium=insights&utm_campaign=ai_trade_validator&utm_content=cta_secondary`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Go to app homepage <span className="ml-2 opacity-80">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer nav */}
          <div className="mt-10 flex items-center justify-between text-sm">
            <Link href="/insights" className="font-semibold text-slate-700 hover:text-slate-900">
              ← Back to Insights
            </Link>
            <span className="text-slate-500">SolFligh Tech</span>
          </div>
        </article>
      </Container>
    </main>
  );
}
