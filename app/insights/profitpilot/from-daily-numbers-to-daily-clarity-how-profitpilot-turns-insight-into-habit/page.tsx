// app/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit | SolFligh Tech",
  description:
    "Knowing what to track is one thing. Doing it consistently is another. ProfitPilot turns daily clarity into a habit without guessing profit when costs are incomplete. It answers the one daily question SMEs actually need: did today help or hurt?",
  alternates: {
    canonical:
      "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
  },
  openGraph: {
    title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit",
    description:
      "ProfitPilot turns daily clarity into a habit and refuses to guess profit when costs are incomplete. Daily verdict first. Profit only when proven.",
    url: "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
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

function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProfitPilotSolutionArticlePage() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Habit System",
    readingTime: "5–7 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/daily-clarity-system.jpg",
    title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit",
    subtitle:
      "Knowing what to track is easy. Doing it consistently is the real challenge. Here’s how daily verdict becomes automatic without guessing profit.",
  };

  // ✅ Seamless chain (use corrected slug)
  const prevArticleHref = "/insights/profitpilot/from-daily-numbers-to-daily-clarity";
  const nextArticleHref = "/insights/profitpilot/when-profit-is-unknown-thats-still-an-answer";

  const waitlistHref = "/waitlist?product=profitpilot&source=profitpilot_solution_article";
  const projectHref = "/projects/profitpilot";

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
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

            {/* ✅ Top nav */}
            <div className="mt-6 flex flex-wrap gap-3">
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

              <Link
                href={meta.hubHref}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Back to hub
              </Link>
            </div>

            {/* Header */}
            <div className="mt-8 max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <MetaPill>{meta.tag}</MetaPill>
                <MetaPill>{meta.readingTime}</MetaPill>
                <MetaPill>{meta.dateLabel}</MetaPill>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                {meta.title}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{meta.subtitle}</p>
            </div>

            {/* Cover */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-[240px] w-full sm:h-[340px] md:h-[400px]">
                <Image
                  src={meta.coverImage}
                  alt={meta.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1100px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              </div>
            </div>

            {/* Article body */}
            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-slate-700">
                <section className="space-y-4">
                  <SectionLabel>The unavoidable truth</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Daily decisions don’t wait for perfect accounting
                  </h2>

                  <p>
                    You can teach the right concepts all day revenue, expenses, margin, profit and still watch the
                    same thing happen:
                    <br />
                    the day ends, fatigue wins, and nothing gets recorded consistently.
                  </p>

                  <p className="font-semibold text-slate-900">
                    The real problem isn’t knowing what to track. It’s closing the day with a verdict you can trust.
                  </p>
                </section>

                {/* ✅ Clarification block (this article references profit) */}
                <ProfitLogicClarification tone="neutral" showOneLiner />

                <Callout title="ProfitPilot’s thesis">
                  <>
                    <p className="m-0 font-semibold text-slate-900">
                      ProfitPilot doesn’t ask how complex your business is.
                    </p>
                    <p className="mt-2 mb-0">
                      It asks whether <span className="font-semibold text-slate-900">today moved it forward</span>.
                    </p>
                  </>
                </Callout>

                <section className="space-y-4">
                  <SectionLabel>The habit</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The habit is simple: close the day with what’s true
                  </h2>

                  <p>
                    The routine we’ve been building through the previous articles is intentionally small:
                    record what you can, separate movement from performance, and never confuse “a number” with “the
                    truth.”
                  </p>

                  <p>
                    But here’s the tension every SME faces:
                    <br />
                    <span className="font-semibold text-slate-900">
                      Daily verdict never waits for COGS. Profit numbers always do.
                    </span>
                  </p>

                  <p>
                    So the habit has to support both realities:
                    <strong> direction today</strong>, and <strong>accuracy when costs are complete</strong>.
                  </p>
                </section>

                <section className="space-y-4">
                  <SectionLabel>The trust boundary</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    “We will not tell you profit unless the data supports it.”
                  </h2>

                  <p>
                    This is where ProfitPilot draws a hard line because trust compounds.
                    If sale-linked costs are missing, ProfitPilot refuses to guess. No estimates. No averages. No “close
                    enough.”
                  </p>

                  <Callout title="But you still get a daily answer">
                    <>
                      <p className="m-0">
                        <span className="font-semibold text-slate-900">
                          We will not tell you profit unless the data supports it
                        </span>{" "}
                        but we’ll still tell you if today helped or hurt your business.
                      </p>
                      <p className="mt-3 mb-0">
                        When profit is unknown, you see what’s missing and you get a truthful signal where possible
                        clearly labeled.
                      </p>
                    </>
                  </Callout>
                </section>

                <section className="space-y-4">
                  <SectionLabel>How it becomes automatic</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    ProfitPilot exists to remove friction, not add complexity
                  </h2>

                  <p>
                    ProfitPilot isn’t trying to be everything. It’s not built to overwhelm you with dashboards.
                    It’s built to make one routine easy enough to do daily even when you’re tired.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletCard
                      title="It reduces daily effort"
                      items={[
                        "Record revenue and operating expenses in one place.",
                        "Keep cash movement separate from performance so you don’t confuse the two.",
                        "Keep categories consistent so reports don’t drift over time.",
                      ]}
                    />
                    <BulletCard
                      title="It protects truth"
                      items={[
                        "Profit is shown only when sale-linked costs are complete.",
                        "If something required is missing, profit shows “— —” with a reason.",
                        "You see exactly what to fix to unlock a proven profit number.",
                      ]}
                    />
                  </div>
                </section>

                <Callout title="The shift">
                  <>
                    Instead of relying on memory, guesswork, or end-of-month reports, ProfitPilot turns daily clarity
                    into a habit you don’t have to fight for and protects you from decisions based on numbers that
                    can’t be proven.
                  </>
                </Callout>

                <section className="space-y-4">
                  <SectionLabel>Why this compounds</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    When you can trust “today,” decisions get calmer
                  </h2>

                  <p>
                    When business owners can trust what today actually meant, pricing improves, waste becomes visible,
                    and growth decisions become calmer.
                  </p>

                  <p>
                    This compounds into healthier margins and fewer surprises not because the business worked harder,
                    but because it saw clearly, daily.
                  </p>
                </section>

                {/* Final CTA */}
                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-slate-900">If you want to see the product context</p>
                  <p className="text-sm text-slate-700">
                    Explore the ProfitPilot project page to see what it does, who it’s for, and how the daily verdict
                    logic shows up in the product.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={projectHref}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                      Go to ProfitPilot project
                    </Link>

                    <Link
                      href={waitlistHref}
                      className="inline-flex items-center justify-center rounded-xl border border-sky-600 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
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
                </section>

                {/* ✅ Bottom nav (seamless continue) */}
                <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
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

                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Back to hub
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
