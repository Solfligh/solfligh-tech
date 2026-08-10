import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import InsightJsonLd from "@/app/components/InsightJsonLd";

export const metadata: Metadata = {
  title: "Why Most SMEs Don’t Actually Know If Today Helped or Hurt Their Business | ProfitPilot | SolFligh Tech",
  description:
    "Many small business owners end the day with activity, sales alerts, and a bank balance but still can’t confidently answer one question: did today move the business forward or backward?",
  alternates: {
    canonical: "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today",
  },
  openGraph: {
    title: "Why Most SMEs Don’t Actually Know If Today Helped or Hurt Their Business",
    description:
      "Most SMEs see activity (sales and bank alerts) but still can’t prove daily performance because key information often lives in scattered places and arrives at different times.",
    url: "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today",
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

function Divider() {
  return <div className="my-10 h-px w-full bg-slate-200/70" />;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfitPilotArticlePage() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/why-made-today.jpg",
    title: "Why Most SMEs Don’t Actually Know If Today Helped or Hurt Their Business",
    subtitle:
      "Many small business owners end the day with activity, sales alerts, and a bank balance but still can’t confidently answer one question: did today move the business forward or backward?",
  };

  // ✅ Article 2 (solution awareness) – next step
  const nextArticleHref = "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity";

  return (
    <main className="bg-white text-slate-900">
      <InsightJsonLd href="/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today" />
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-sky-200/25 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/60 blur-3xl" />
        </div>

        <Container>
          <div className="relative py-10 sm:py-12">
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
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <MetaPill>{meta.tag}</MetaPill>
                  <MetaPill>{meta.readingTime}</MetaPill>
                  <MetaPill>{meta.dateLabel}</MetaPill>
                </div>

                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                  {meta.title}
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{meta.subtitle}</p>

                {/* ✅ Problem-aware CTA: go to next article */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={nextArticleHref}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Next: Cashflow vs Profit{" "}
                    <span className="ml-2" aria-hidden="true">
                      →
                    </span>
                  </Link>

                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Back to hub
                  </Link>
                </div>
              </div>

              {/* “In one sentence” – purely problem-aware */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In one sentence</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Most SMEs can’t end the day with a clear verdict because{" "}
                  <span className="font-semibold text-slate-900">activity is visible</span>, but{" "}
                  <span className="font-semibold text-slate-900">outcome isn’t summarized</span>.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">What we get instantly</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Noise + movement</p>
                    <p className="mt-1 text-xs text-slate-600">Sales alerts. Transfers. Messages. Busyness.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">What we don’t get</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">A daily verdict</p>
                    <p className="mt-1 text-xs text-slate-600">Did today help… or quietly hurt?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-[220px] w-full sm:h-[320px] md:h-[380px]">
                <Image
                  src={meta.coverImage}
                  alt={meta.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/15 to-transparent" />
              </div>
            </div>

            {/* Article body */}
            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card
                    title="Busy can be a trap"
                    desc="A day can feel successful simply because it was loud, active, and exhausting."
                    icon={
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <path
                          d="M7 16V8m5 10V6m5 12v-7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                  <Card
                    title="You’re not failing you’re missing feedback"
                    desc="Most small businesses run daily, but the feedback arrives late, scattered, or unclear."
                    icon={
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <path
                          d="M8 7h8M8 12h8M8 17h8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M5 7h.01M5 12h.01M5 17h.01"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                </div>

                <section id="hook" className="space-y-4">
                  <SectionLabel>Start here</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The shop closes but your brain stays open
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      You close for the day and everything looks like movement: customers came, messages flew, money
                      entered, money left, people worked.
                    </p>
                    <p className="font-semibold text-slate-900">
                      Then the real question shows up quietly:
                      <br />
                      Did today help the business… or hurt it?
                    </p>
                    <p>
                      If your honest answer is “I’m not sure,” that’s not incompetence.
                      It’s what happens when a daily business runs without a daily scoreboard.
                    </p>
                    <p>
                      The day ends on schedule.
                      But clarity doesn’t.
                    </p>
                  </div>

                  <Callout title="What makes this so tiring">
                    <>
                      You’re forced to make tomorrow’s decisions with yesterday’s uncertainty pricing, restocking,
                      hiring, even peace of mind without a clear verdict on what just happened.
                    </>
                  </Callout>
                </section>

                <section id="signals" className="space-y-4">
                  <SectionLabel>What we mistake for answers</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    We rely on signals that feel like truth
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      Most SMEs look at bank balance, POS totals, transfer alerts, and cash in hand.
                      Those signals are real but they can’t carry the full meaning of a day.
                    </p>
                    <p>
                      That’s why two people can have the same “sales day” and feel totally different:
                      one is calm, one is anxious because neither has a reliable daily verdict.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "Sales alerts can feel like success, even when the day created new obligations you haven’t felt yet.",
                      "A rising bank balance can mask timing effects (late payments, delayed expenses, transfers).",
                      "Cash in hand can feel like winning while hidden drains accumulate quietly.",
                      "Busyness can look like growth when it may just be chaos repeating itself.",
                    ]}
                  />
                </section>

                <Divider />

                <section id="why-its-hard" className="space-y-4">
                  <SectionLabel>Why this keeps happening</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Small business data is naturally scattered
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      Most SMEs don’t run on one clean system. They run on reality.
                    </p>
                    <p>
                      Sales might live in a POS or messages. Expenses happen in tiny, frequent decisions.
                      Inventory and supplier payments have their own timing. Some details show up late.
                    </p>
                    <p>
                      So even when you try your best, your “day” ends up spread across places and the verdict gets
                      postponed.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "Sales records live in different places (POS, bank alerts, WhatsApp, notebooks).",
                      "Expenses happen in small, frequent chunks (fuel, data, deliveries, supplies).",
                      "Some parts of the day show up later (confirmations, receipts, reconciliations).",
                      "Month-end summaries arrive after the damage (or success) has already repeated for weeks.",
                    ]}
                  />
                </section>

                <section id="consequences" className="space-y-4">
                  <SectionLabel>What it causes</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Unclear days create expensive confidence
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      When the business doesn’t get daily feedback, it starts operating on stories:
                      “We’re doing fine.” “We’re growing.” “Sales were good.”
                    </p>
                    <p>
                      Sometimes those stories are true.
                      But when they’re wrong, they become expensive because you repeat decisions with no daily signal
                      telling you to stop.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "You keep pricing the same way because nothing is clearly telling you it’s failing.",
                      "You restock what moves, not what actually strengthens the business.",
                      "You assume the business is okay until a deadline forces a painful reality check.",
                      "You work harder, not smarter because you can’t see what’s really happening daily.",
                    ]}
                  />
                </section>

                {/* ✅ Bridge to Article 2 (clean handoff) */}
                <section id="next" className="space-y-4">
                  <SectionLabel>Next</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The most common trap is a simple one
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      The next article covers one confusion that keeps SMEs stuck in uncertainty:
                      mixing up <span className="font-semibold text-slate-900">cashflow</span> and{" "}
                      <span className="font-semibold text-slate-900">profit</span>.
                    </p>
                    <p>
                      It’s the reason bank balance and sales alerts feel like answers even when they can’t give you a
                      daily verdict.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Continue to Article 2</p>
                    <p className="mt-2 text-sm text-slate-700">
                      Cashflow vs Profit: why mixing them up is costing you clarity.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={nextArticleHref}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                      >
                        Read Article 2{" "}
                        <span className="ml-2" aria-hidden="true">
                          →
                        </span>
                      </Link>

                      <Link
                        href={meta.hubHref}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                      >
                        Back to ProfitPilot hub
                      </Link>
                    </div>
                  </div>
                </section>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
