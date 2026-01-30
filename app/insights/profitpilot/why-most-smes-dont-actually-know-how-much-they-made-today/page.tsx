// app/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

export const metadata: Metadata = {
  title:
    "Why Most SMEs Don’t Actually Know How Much They Made Today | ProfitPilot | SolFligh Tech",
  description:
    "Many small business owners end the day with activity, sales alerts, and a bank balance but still can’t confidently answer one question: did we actually make money today? Here’s why, and the simple fix.",
};

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
      {children}
    </p>
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

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </p>
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

function NumberCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{note}</p>
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
      "Many small business owners end the day with activity, sales alerts, and a bank balance but still can’t confidently answer one question: did we actually make money today?",
  };

  // ✅ REAL waitlist page (not contact)
  const waitlistHref = "/waitlist?product=profitpilot&source=profitpilot_article";

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
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href={meta.insightsHref}
                className="font-semibold text-slate-600 hover:text-slate-900"
              >
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                href={meta.hubHref}
                className="font-semibold text-slate-600 hover:text-slate-900"
              >
                {meta.hubTitle}
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Article</span>
            </div>

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

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={waitlistHref}
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Join the waitlist
                  </Link>

                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Back to hub
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  In one sentence
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Most small businesses can’t confidently say what they made today because they track{" "}
                  <span className="font-semibold text-slate-900">sales</span> and{" "}
                  <span className="font-semibold text-slate-900">cash</span>, but not{" "}
                  <span className="font-semibold text-slate-900">daily profit</span>.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">What we need</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      Daily performance clarity
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Simple enough for 10 seconds.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">What we usually get</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      Bank balance + sales alerts
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Useful, but not the answer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

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

            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card
                    title="Busy doesn’t always mean profitable"
                    desc="A day can feel successful and still quietly lose money once costs show up."
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
                    title="Daily clarity beats end-of-month surprises"
                    desc="Small businesses live daily decisions should be guided by daily truth."
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
                    As a small business owner, we’ve all felt this before
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      We close for the day. We’re tired. Sales happened. Money moved. People worked. Then the real
                      question shows up:
                    </p>
                    <p className="font-semibold text-slate-900">
                      Did we actually make money today… or did we just stay busy?
                    </p>
                    <p>
                      If our honest answer is “I’m not sure,” we’re not alone and we’re not doing anything wrong.
                      Most small businesses are running with tools that were never built to give daily profit clarity.
                    </p>
                  </div>

                  <Callout title="The goal">
                    <>
                      At the end of each day, we should be able to say one simple sentence with confidence:{" "}
                      <span className="font-semibold text-slate-900">“We made ₦ ___ today.”</span>
                    </>
                  </Callout>
                </section>

                <section id="profit-vs-cash" className="space-y-4">
                  <SectionLabel>Get the meaning right</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Sales, cash, and profit are not the same thing
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      When we check the business at night, most of us look at sales, bank balance, and cash on hand.
                      Those signals are useful but they don’t answer profit.
                    </p>
                    <p>
                      Profit is what’s left after today’s income covers today’s real costs. And costs don’t only mean
                      the cash we spent today it includes inventory used, delivery costs triggered by today’s sales,
                      fees, staff time, and everyday running expenses.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "A business can have strong sales and still lose money (pricing, wastage, high costs).",
                      "A business can have cash in the bank and still be unprofitable (debt, deposits, unpaid expenses).",
                      "A business can be profitable and still feel “broke” (cash timing, customers owing, restocking).",
                    ]}
                  />
                </section>

                <Divider />

                <section id="why-its-hard" className="space-y-4">
                  <SectionLabel>Why it happens</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The problem isn’t discipline it’s visibility
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      Most SMEs don’t lack effort we lack a simple daily system. Income is tracked (sometimes),
                      expenses are scattered, and decisions are made from memory or vibes.
                    </p>
                    <p>
                      The result is confusion: we feel busy, but we can’t measure daily performance with confidence.
                    </p>
                  </div>

                  <BulletList
                    items={[
                      "Sales records live in different places (POS, bank alerts, WhatsApp, notebooks).",
                      "Expenses happen in small, frequent chunks (fuel, data, deliveries, supplies).",
                      "Some costs don’t feel like “today’s costs” but they were triggered by today’s activity.",
                      "Monthly reports come too late daily decisions need daily truth.",
                    ]}
                  />
                </section>

                <section id="what-clarity-looks-like" className="space-y-4">
                  <SectionLabel>What good looks like</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    A clean day-end view should show three numbers
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      A good system shouldn’t make us feel like we’re doing accounting. It should feel like checking
                      the score after a match simple, quick, and decision-ready.
                    </p>
                    <p>At minimum, we want three numbers that tell the story of today:</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Example (illustrative numbers):</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <NumberCard label="Income today" value="₦120,000" note="What came in today." />
                      <NumberCard label="Expenses today" value="₦81,500" note="What today triggered." />
                      <NumberCard label="We made (today)" value="₦38,500" note="The result we can act on." />
                    </div>

                    <p className="mt-4 text-sm text-slate-700">
                      The goal is one clear sentence we can trust at day end:{" "}
                      <span className="font-semibold text-slate-900">“We made ₦38,500 today.”</span>
                    </p>
                  </div>
                </section>

                <Divider />

                <section id="simple-routine" className="space-y-4">
                  <SectionLabel>Do this first</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    A simple daily routine that works (even without software)
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      We don’t need complex finance to be clear. We need consistency one place, one daily habit.
                    </p>
                    <p>Here’s a simple routine any SME can run:</p>
                  </div>

                  <BulletList
                    items={[
                      "Capture today’s income (sales, transfers, POS receipts) in one place.",
                      "Capture today’s expenses (even small ones). Don’t trust memory.",
                      "Separate “profit” from “cash movement.” Treat them as different questions.",
                      "End the day with one sentence: “We made ₦ ___ today.”",
                    ]}
                  />

                  <Callout title="If we do only one thing">
                    <>
                      Pick one place to record daily numbers (even a simple sheet) and make it non-negotiable for 14
                      days. Clarity improves fast when the habit becomes normal.
                    </>
                  </Callout>
                </section>

                <section id="profitpilot" className="space-y-4">
                  <SectionLabel>Where ProfitPilot fits</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    ProfitPilot is what we use when we want the routine to run itself
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>Once the routine is clear, the next step is reducing manual work and mistakes.</p>
                    <p>
                      That’s where ProfitPilot comes in not as “more reports,” but as a daily clarity tool. It helps
                      us keep income and expenses organized, separates cash movement from performance, and gives a clean
                      day-end result in plain language.
                    </p>
                    <p>The point is simple: we stop guessing, and we start steering.</p>
                  </div>

                  <BulletList
                    items={[
                      "Daily “We made today” view (profit clarity, not confusion).",
                      "Clean separation between profit and cash movement.",
                      "Simple categories that match how SMEs actually operate.",
                      "A clear record you can trust when you want to scale later.",
                    ]}
                  />
                </section>

                <section id="closing" className="space-y-4">
                  <SectionLabel>Wrap up</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    We deserve daily clarity not end of month surprises
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>That question “did we make money today?” should not feel scary. It should feel normal.</p>
                    <p>When we can measure today clearly, we stop arguing with numbers and we make calmer decisions.</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      Want early access to ProfitPilot?
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      Join the waitlist. You’ll get early access updates, and we’ll notify you when it’s ready.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={waitlistHref}
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Join the waitlist
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
