// app/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

export const metadata: Metadata = {
  title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity | ProfitPilot | SolFligh Tech",
  description:
    "Cashflow and profit answer different questions. Mixing them up is why many business owners feel unsure at the end of the day and how to separate them for clarity.",
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

export default function ProfitPilotArticle2Page() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Solution Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    // ✅ This must match the file you uploaded in /public/insights/profitpilot/posts/
    coverImage: "/insights/profitpilot/posts/cashflow-vs-profit.jpg",
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    subtitle:
      "Cashflow and profit answer different questions. Mixing them up is why many business owners feel unsure at the end of the day.",
  };

  const waitlistHref = "/waitlist?product=profitpilot&source=profitpilot_article_cashflow_vs_profit";

  // ✅ Previous article (problem-aware)
  const prevArticleHref =
    "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today";

  // ✅ Next article placeholder (we’ll create Article 3 next)
  const nextArticleHref =
    "/insights/profitpilot/the-3-numbers-to-close-every-business-day"; // create later

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

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={prevArticleHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                ← Previous article
              </Link>

              {/* Optional: we’ll activate when Article 3 exists */}
              <Link
                href={nextArticleHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Next article →
              </Link>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              {/* Left hero */}
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

              {/* Right “In one sentence” card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In one sentence</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  <span className="font-semibold text-slate-900">Cashflow</span> tells you what moved, while{" "}
                  <span className="font-semibold text-slate-900">profit</span> tells you what you truly earned — mixing
                  them is why “Did we make money today?” feels impossible to answer.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">Cashflow answers</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Can we pay bills?</p>
                    <p className="mt-1 text-xs text-slate-600">Timing and survival.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">Profit answers</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Are we winning?</p>
                    <p className="mt-1 text-xs text-slate-600">Performance and health.</p>
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

            {/* Body */}
            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card
                    title="A bank alert isn’t a profit report"
                    desc="Money moving is not the same as money earned. The timing can trick you."
                    icon={
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <path
                          d="M4 10h16M7 10V7a5 5 0 0 1 10 0v3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 10l1 11h10l1-11"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                  <Card
                    title="Separating the two brings clarity"
                    desc="Once cashflow and profit stop fighting each other, decisions get calmer."
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

                <section className="space-y-4">
                  <SectionLabel>Start here</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The mistake almost everyone makes
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>
                      Most people look at their <span className="font-semibold text-slate-900">bank balance</span> or{" "}
                      <span className="font-semibold text-slate-900">sales notifications</span> and assume that tells
                      the full story.
                    </p>
                    <p>It doesn’t.</p>
                    <p>
                      Cashflow and profit are not the same thing — even though they often feel like they should be.
                      They answer two different questions, and mixing them is why clarity disappears.
                    </p>
                  </div>

                  <Callout title="Quick definition">
                    <>
                      <span className="font-semibold text-slate-900">Cashflow</span> is what moved.{" "}
                      <span className="font-semibold text-slate-900">Profit</span> is what you earned after real costs.
                    </>
                  </Callout>
                </section>

                <section className="space-y-4">
                  <SectionLabel>Cashflow</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Cashflow is what’s moving
                  </h2>

                  <BulletList
                    items={[
                      "Money coming into your business.",
                      "Money going out of your business.",
                      "And when that movement happens.",
                      "Cashflow tells you if you can pay rent, salaries, suppliers, and bills.",
                    ]}
                  />
                </section>

                <section className="space-y-4">
                  <SectionLabel>Profit</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Profit is what you actually earned
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    <p>Profit answers a different question:</p>
                    <Callout title="Profit question">
                      <>After everything it truly cost to run the business, what did we really earn?</>
                    </Callout>
                    <p>
                      You can have money in the bank and still be losing money as a business — because timing can hide
                      real costs.
                    </p>
                  </div>
                </section>

                <Divider />

                <section className="space-y-4">
                  <SectionLabel>Why it confuses people</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    This is why “today’s profit” feels hard to answer
                  </h2>

                  <BulletList
                    items={[
                      "Sales alerts don’t equal profit.",
                      "Bank balances don’t equal performance.",
                      "Being busy doesn’t mean being profitable.",
                      "Costs can show up later even when the sales happened today.",
                    ]}
                  />
                </section>

                <section className="space-y-4">
                  <SectionLabel>Wrap up</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Both matter — but for different reasons
                  </h2>

                  <Callout title="The mindset shift">
                    <>
                      <span className="font-semibold text-slate-900">Cashflow keeps you alive.</span>{" "}
                      <span className="font-semibold text-slate-900">Profit tells you if you’re winning.</span>
                    </>
                  </Callout>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Want early access to ProfitPilot?</p>
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

                  {/* ✅ Keep navigation at the bottom too */}
                  <div className="flex flex-wrap gap-3 pt-2">
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
