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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="relative flex items-start gap-3">
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

function Divider() {
  return <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />;
}

function TocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      {/* Subtle page background */}
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
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{meta.tag}</Pill>
                  <Pill>{meta.readingTime}</Pill>
                  <Pill>{meta.dateLabel}</Pill>
                  <Pill>SME clarity</Pill>
                  <Pill>Daily profit</Pill>
                  <Pill>Zero jargon</Pill>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                  {meta.title}
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {meta.subtitle}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    ProfitPilot hub
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Contact us
                  </Link>
                </div>
              </div>

              {/* Right hero mini-card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-200/30 blur-2xl" />
                  <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-blue-200/20 blur-2xl" />
                </div>

                <div className="relative space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In one sentence</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Most SMEs can’t answer “how much did we make today?” because the tools they use were built for
                    reporting — not daily decisions.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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

            {/* Content layout */}
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
              {/* Article */}
              <article className="space-y-10">
                {/* Quick takeaways */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card
                    title="Today is the real decision unit"
                    desc="SMEs don’t manage quarterly. They manage what happened today — so they can choose what to do tomorrow."
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
                  <Card
                    title="Sales ≠ profit"
                    desc="You can have a great sales day and still lose money once delivery, expenses, and leakage show up."
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
                </div>

                <div id="hook" className="space-y-4">
                  <SectionLabel>Start here</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
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
                </div>

                <div id="why-today" className="space-y-4">
                  <SectionLabel>Why this matters</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    For SMEs, “today” is not optional
                  </h2>

                  <p className="text-sm leading-relaxed text-slate-700">
                    Large companies don’t wake up asking what happened today. They have finance teams, buffers, forecasts, and time.
                    SMEs don’t. And that’s why daily clarity matters.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                    </div>

                    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                      <p className="text-sm font-bold text-slate-900">But most finish the day with:</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        A bank balance, some sales notifications, and a feeling. Not an answer.
                      </p>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">The real issue</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Profit visibility is broken at the SME level.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                <div id="trap-1" className="space-y-4">
                  <SectionLabel>The two traps</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
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
                </div>

                <div id="trap-2" className="space-y-4">
                  <SectionLabel>The two traps</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Trap #2: “I’ll check my bank balance”
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold text-slate-900">
                      Your bank balance is <span className="text-sky-700">cash position</span>, not performance.
                    </p>

                    <p className="mt-3 text-sm text-slate-700">It can be affected by things that have nothing to do with today:</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        "Old invoices finally paid",
                        "Expenses from previous weeks",
                        "Owner transfers",
                        "Loans, credit lines, and delays",
                      ].map((t) => (
                        <div key={t} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                          <p className="text-sm font-semibold text-slate-900">{t}</p>
                          <p className="mt-1 text-xs text-slate-600">This shifts cash without telling you how today performed.</p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-slate-700">
                      It tells you how much cash you have — not how well the business performed today.
                    </p>
                  </div>
                </div>

                <Divider />

                <div id="why-accounting" className="space-y-4">
                  <SectionLabel>Root cause</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Traditional accounting wasn’t designed for daily SME decisions
                  </h2>

                  <p className="text-sm leading-relaxed text-slate-700">
                    Traditional accounting answers questions like:
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      "“What happened last quarter?”",
                      "“What do we report for tax?”",
                      "“What’s the official net profit?”",
                    ].map((t) => (
                      <div key={t} className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                        <p className="text-sm font-semibold text-slate-900">{t}</p>
                        <p className="mt-2 text-xs text-slate-600">Important — but not a daily decision answer.</p>
                      </div>
                    ))}
                  </div>

                  <Callout title="SMEs need a different question answered">
                    <p className="font-semibold text-slate-900">
                      “Did we make money today — yes or no — and why?”
                    </p>
                    <p className="mt-2">
                      That’s a decision question. It needs a simple daily view of income minus expenses tied to today.
                    </p>
                  </Callout>
                </div>

                <div id="what-good-looks-like" className="space-y-4">
                  <SectionLabel>What good looks like</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    The 1% answer SMEs deserve
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold text-slate-900">At the end of the day, an SME should see:</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">Income today</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">$ —</p>
                        <p className="mt-1 text-xs text-slate-600">What was earned today.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">Expenses today</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">$ —</p>
                        <p className="mt-1 text-xs text-slate-600">What today triggered.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-xs font-semibold text-slate-500">You made (today)</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">$ —</p>
                        <p className="mt-1 text-xs text-slate-600">The decision-ready result.</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-slate-700">
                      Not accounting jargon. Not confusing dashboards. Just: <span className="font-semibold">“You made $X today.”</span>
                    </p>
                  </div>
                </div>

                <Divider />

                <div id="closing" className="space-y-4">
                  <SectionLabel>Wrap up</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    You’re not confused — you’re underserved
                  </h2>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm leading-relaxed text-slate-700">
                      Most SMEs aren’t failing because they don’t work hard. They’re failing because they’re making decisions with
                      incomplete daily visibility.
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      ProfitPilot exists to make “today” clear — so SME owners can stop guessing and start steering.
                    </p>
                  </div>

                  {/* Final CTA */}
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
                      <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
                    </div>

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold tracking-tight text-slate-900">
                          Want this as a dashboard, not an idea?
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          We can build ProfitPilot-style daily clarity into your workflow.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={meta.hubHref}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                        >
                          More articles
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                        >
                          Contact us
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24 space-y-4">
                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">On this page</p>
                  <div className="mt-3 space-y-1">
                    <TocLink href="#hook">The daily question</TocLink>
                    <TocLink href="#why-today">Why “today” matters</TocLink>
                    <TocLink href="#trap-1">Trap #1: Sales ≠ profit</TocLink>
                    <TocLink href="#trap-2">Trap #2: Bank balance</TocLink>
                    <TocLink href="#why-accounting">Why accounting fails SMEs daily</TocLink>
                    <TocLink href="#what-good-looks-like">What good looks like</TocLink>
                    <TocLink href="#closing">Wrap up</TocLink>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm font-bold text-slate-900">Quick next steps</p>
                  <div className="mt-3 space-y-3">
                    <Link
                      href={meta.hubHref}
                      className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
                    >
                      View ProfitPilot hub →
                      <p className="mt-1 text-xs font-normal text-slate-600">More SME-focused clarity articles.</p>
                    </Link>

                    <Link
                      href="/projects"
                      className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
                    >
                      See our projects →
                      <p className="mt-1 text-xs font-normal text-slate-600">What we ship in real life.</p>
                    </Link>

                    <Link
                      href="/contact"
                      className="block rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                    >
                      Contact us
                      <p className="mt-1 text-xs font-normal text-white/90">
                        Tell us what you want to build.
                      </p>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
