// app/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

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
    "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.",
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-bold tracking-wide text-slate-600 shadow-sm backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-sky-500" />
      {children}
    </div>
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-sky-50 p-5 shadow-sm">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M12 3l7 4v6c0 5-3 8-7 8s-7-3-7-8V7l7-4z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 12l1.8 1.8L14.8 10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-950">{title}</p>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-blue-200/25 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/70 blur-3xl" />
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

            {/* Hero */}
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{meta.tag}</Pill>
                  <Pill>{meta.readingTime}</Pill>
                  <Pill>{meta.dateLabel}</Pill>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                  {meta.title}
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {meta.subtitle}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Talk to us
                  </Link>
                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    Back to hub
                  </Link>
                </div>
              </div>

              {/* Right hero mini-card (kept, but simple) */}
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In one sentence</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Most SMEs can’t answer “how much did we make today?” because the tools they use were built for reporting —
                  not daily decisions.
                </p>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <p className="text-xs font-semibold text-slate-500">What SMEs actually need</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">A daily performance answer</p>
                    <p className="mt-1 text-xs text-slate-600">Simple. Reliable. Decision-ready.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <p className="text-xs font-semibold text-slate-500">What they usually get</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Bank balance + sales</p>
                    <p className="mt-1 text-xs text-slate-600">Accurate-ish… but not the answer.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover image */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
              <div className="relative h-[220px] w-full sm:h-[320px] md:h-[360px]">
                <Image
                  src={meta.coverImage}
                  alt={meta.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
              </div>
            </div>

            {/* ✅ Simplified: single readable column, NO sidebar */}
            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12">
                <section id="hook" className="space-y-4 scroll-mt-24">
                  <SectionLabel>Start here</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    If you run an SME, this question is harder than it should be
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold text-slate-900">
                      If someone asked you: <span className="text-sky-700">“How much profit did you make today?”</span>
                    </p>

                    <p className="mt-3 text-sm text-slate-600">There’s a good chance your answer sounds like:</p>

                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      {[
                        "“I’ll know at the end of the month.”",
                        "“I can check my bank balance.”",
                        "“We made sales today… so probably good?”",
                        "“My accountant handles that.”",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 text-sm font-semibold text-slate-900">And if that’s you, here’s the important part:</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">
                      You’re not bad at business. The system around you just isn’t built for SMEs.
                    </p>
                  </div>
                </section>

                <section id="why-today" className="space-y-4 scroll-mt-24">
                  <SectionLabel>Why this matters</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    For SMEs, “today” is not optional
                  </h2>

                  <p className="text-base leading-relaxed text-slate-700">
                    Large companies have finance teams, buffers, forecasts, and time. SMEs don’t. That’s why daily clarity matters.
                  </p>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-bold text-slate-900">SMEs need answers like:</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {[
                        "Did today help or hurt cash?",
                        "Did we price correctly?",
                        "Are we growing — or just working harder?",
                        "Can I confidently make tomorrow’s decisions?",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <p className="text-xs font-semibold text-slate-500">The real issue</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Profit visibility is broken at the SME level.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="trap-1" className="space-y-4 scroll-mt-24">
                  <SectionLabel>The traps</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Trap #1: “We made sales today, so we’re profitable”
                  </h2>

                  <Callout title="Sales only tell you money came in">
                    They don’t tell you:
                    <ul className="mt-3 space-y-2">
                      {[
                        "What it cost to deliver",
                        "What expenses were triggered",
                        "What still hasn’t been paid",
                        "What belongs to suppliers, staff, or tax authorities",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3">
                      You can have a great sales day and still lose money. That’s not rare — it’s common.
                    </p>
                  </Callout>
                </section>

                <section id="trap-2" className="space-y-4 scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Trap #2: “I’ll check my bank balance”
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold text-slate-900">
                      Your bank balance is <span className="text-sky-700">cash position</span>, not performance.
                    </p>

                    <p className="mt-3 text-sm text-slate-700">
                      It can be affected by things that have nothing to do with today:
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        "Old invoices finally paid",
                        "Expenses from previous weeks",
                        "Owner transfers",
                        "Loans, credit lines, and delays",
                      ].map((t) => (
                        <div key={t} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                          <p className="text-sm font-semibold text-slate-900">{t}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            This shifts cash without telling you how today performed.
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-slate-700">
                      It tells you how much cash you have — not how well the business performed today.
                    </p>
                  </div>
                </section>

                <section id="why-accounting" className="space-y-4 scroll-mt-24">
                  <SectionLabel>Root cause</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Traditional accounting wasn’t designed for daily SME decisions
                  </h2>

                  <p className="text-base leading-relaxed text-slate-700">
                    Traditional accounting is great for reporting and compliance. But it’s not built for day-by-day steering.
                  </p>

                  <Callout title="The daily question that matters">
                    <p className="font-semibold text-slate-900">
                      “Did we make money today — yes or no — and why?”
                    </p>
                    <p className="mt-2">
                      That’s a decision question. It needs a simple daily view of income minus expenses tied to today.
                    </p>
                  </Callout>
                </section>

                <section id="what-good-looks-like" className="space-y-4 scroll-mt-24">
                  <SectionLabel>What good looks like</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The 1% answer SMEs deserve
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold text-slate-900">
                      At the end of the day, an SME should see one decision-ready result.
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      Here’s a simple example (illustrative numbers — not your real data):
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">Income today</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">₦120,000</p>
                        <p className="mt-1 text-xs text-slate-600">Total sales confirmed today.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">Expenses today</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">₦81,500</p>
                        <p className="mt-1 text-xs text-slate-600">Stock used + delivery + ops.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">You made today</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">₦38,500</p>
                        <p className="mt-1 text-xs text-slate-600">Income − expenses (today).</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-slate-700">
                      Not jargon. Not a maze of dashboards. Just:{" "}
                      <span className="font-semibold text-slate-900">“You made ₦38,500 today.”</span>
                    </p>
                  </div>
                </section>

                <section id="closing" className="space-y-4 scroll-mt-24">
                  <SectionLabel>Wrap up</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    You’re not confused — you’re underserved
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-base leading-relaxed text-slate-700">
                      Most SMEs aren’t failing because they don’t work hard. They’re failing because they’re making decisions
                      without daily visibility.
                    </p>

                    <p className="mt-3 text-base leading-relaxed text-slate-700">
                      ProfitPilot exists to make “today” clear — so SME owners can stop guessing and start steering.
                    </p>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
                      <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
                    </div>

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold tracking-tight text-slate-900">
                          Want “today” to be clear in your business?
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          We build SME dashboards that answer the daily question — without accounting confusion.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                        >
                          Talk to us
                        </Link>
                        <Link
                          href={meta.hubHref}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                        >
                          Back to hub
                        </Link>
                      </div>
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
