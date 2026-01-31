import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

export const metadata: Metadata = {
  title: "Why Most SMEs Don’t Actually Know How Much They Made Today | ProfitPilot | SolFligh Tech",
  description:
    "Many small business owners end the day with activity, sales alerts, and a bank balance — but still can’t confidently answer one question: did we actually make money today?",
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
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    subtitle:
      "Many small business owners end the day with activity, sales alerts, and a bank balance — but still can’t confidently answer one question: did we actually make money today?",
  };

  // ✅ Article 2 (solution awareness) – next step
  const nextArticleHref =
    "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity";

  return (
    <main className="bg-white text-slate-900">
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

                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {meta.subtitle}
                </p>

                {/* ✅ Problem-aware CTA: go to next article (no waitlist) */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={nextArticleHref}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Next: Cashflow vs Profit <span className="ml-2" aria-hidden="true">→</span>
                  </Link>

                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Back to hub
                  </Link>
                </div>
              </div>

              {/* “In one sentence” – still problem-aware */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In one sentence</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Most SMEs can’t confidently say what they made today because{" "}
                  <span className="font-semibold text-slate-900">activity</span> is visible, but{" "}
                  <span className="font-semibold text-slate-900">true performance</span> is not.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">What we see</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Sales + bank alerts</p>
                    <p className="mt-1 text-xs text-slate-600">Movement looks like success.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">What we can’t answer</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Did we really win today?</p>
                    <p className="mt-1 text-xs text-slate-600">Profit is not obvious.</p>
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
                    title="Busy doesn’t always mean profitable"
                    desc="A day can feel successful and still quietly lose money once real costs show up."
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
                    title="You’re not failing — you’re missing visibility"
                    desc="Most tools show movement (sales/cash), not the truth of daily performance."
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
                    The day ends, and the real question shows up
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      We close for the day. We’re tired. Sales happened. Money moved. People worked.
                      Then one question appears:
                    </p>
                    <p className="font-semibold text-slate-900">
                      Did we actually make money today… or did we just stay busy?
                    </p>
                    <p>
                      If the honest answer is “I’m not sure,” it doesn’t mean we’re careless.
                      It usually means we don’t have a simple way to see daily performance clearly.
                    </p>
                  </div>

                  <Callout title="What makes this painful">
                    <>
                      The uncertainty doesn’t just hurt “finance.” It affects pricing, restocking, hiring, and peace of
                      mind — because we’re making decisions without a clear daily score.
                    </>
                  </Callout>
                </section>

                <section id="signals" className="space-y-4">
                  <SectionLabel>What we use instead</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    We rely on signals that feel like answers
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      Most SMEs check things like bank balance, POS totals, transfer alerts, and cash on the table.
                      Those are useful signals — but they aren’t the same as “we made money today.”
                    </p>
                    <p>
                      That’s why two people can have the same sales day and feel totally different:
                      one is calm, one is anxious — because neither is sure what today truly meant.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "Sales notifications look like profit, but they’re not profit.",
                      "Bank balance looks like performance, but it includes timing and transfers.",
                      "Cash on hand looks like success, but it can hide silent costs.",
                      "Being busy looks like growth, but it can hide bad pricing or wastage.",
                    ]}
                  />
                </section>

                <Divider />

                <section id="why-its-hard" className="space-y-4">
                  <SectionLabel>Why it happens</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The problem isn’t discipline — it’s visibility
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      Most SMEs don’t lack effort. They lack a simple daily system that shows what happened today in a
                      way humans can trust.
                    </p>
                    <p>
                      Income is tracked sometimes. Expenses are scattered. Costs show up later. And daily decisions are
                      made from memory, vibes, or incomplete numbers.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "Sales records live in different places (POS, bank alerts, WhatsApp, notebooks).",
                      "Expenses happen in small, frequent chunks (fuel, data, deliveries, supplies).",
                      "Some costs don’t feel like “today’s costs” but they were triggered by today’s activity.",
                      "Month-end summaries come too late — daily businesses need daily truth.",
                    ]}
                  />
                </section>

                <section id="consequences" className="space-y-4">
                  <SectionLabel>What it causes</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Confusion creates expensive decisions
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      When we don’t know our real daily performance, we can’t confidently improve it.
                      We may keep prices too low, restock the wrong items, overhire, or assume “it’s fine.”
                    </p>
                    <p>
                      And the worst part: we may think we’re doing well — until the month ends and reality hits.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "We celebrate sales days that were actually loss days.",
                      "We confuse cash movement with winning.",
                      "We keep repeating pricing mistakes because we can’t see the daily truth.",
                      "We get end-of-month surprises that should never be surprises.",
                    ]}
                  />
                </section>

                {/* ✅ Bridge to Article 2 (clean handoff) */}
                <section id="next" className="space-y-4">
                  <SectionLabel>Next</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The next confusion is the biggest one
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      If this article felt familiar, the next step is understanding the exact trap most SMEs fall into:
                      mixing up <span className="font-semibold text-slate-900">cashflow</span> and{" "}
                      <span className="font-semibold text-slate-900">profit</span>.
                    </p>
                    <p>
                      That mix-up is why “bank balance” and “sales alerts” feel like answers — even when they aren’t.
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
                        Read Article 2 <span className="ml-2" aria-hidden="true">→</span>
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
