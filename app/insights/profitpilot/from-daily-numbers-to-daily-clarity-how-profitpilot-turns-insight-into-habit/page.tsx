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

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm">
          {step}
        </span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{desc}</p>
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

  // ✅ Seamless chain (your corrected slug)
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

            {/* Top nav */}
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
                  <SectionLabel>The real enemy</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The day ends whether your records are complete or not
                  </h2>

                  <p>
                    Most SMEs don’t fail because they “don’t understand profit.”
                    They fail because the day is exhausting, the tools are scattered, and the routine is too hard to
                    repeat.
                  </p>

                  <p className="font-semibold text-slate-900">
                    If clarity requires effort every night, it won’t survive real life.
                  </p>
                </section>

                <Callout title="ProfitPilot’s thesis">
                  <>
                    <p className="m-0 font-semibold text-slate-900">
                      ProfitPilot doesn’t ask how complex your business is.
                    </p>
                    <p className="mt-2 mb-0">
                      It asks whether <span className="font-semibold text-slate-900">today moved it forward</span> and
                      it makes that answer repeatable.
                    </p>
                  </>
                </Callout>

                <section className="space-y-4">
                  <SectionLabel>What makes a habit stick</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Habits don’t fail from laziness they fail from friction
                  </h2>

                  <p>
                    If the daily routine has too many steps, you’ll skip it.
                    If it uses confusing terms, you’ll avoid it.
                    If it asks you to “calculate profit” with missing costs, you’ll stop trusting it.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <StepCard
                      step="1"
                      title="Tiny daily close"
                      desc="End the day with one small action: record what happened today in plain language."
                    />
                    <StepCard
                      step="2"
                      title="Clear separation"
                      desc="Keep movement (cash) separate from performance (profit/status), so you don’t mix questions."
                    />
                    <StepCard
                      step="3"
                      title="Honest output"
                      desc="Always show what’s true; never show a confident number that can’t be proven."
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <SectionLabel>The system</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    ProfitPilot turns the routine into a repeatable “daily close”
                  </h2>

                  <p>
                    The goal isn’t to “do accounting every night.”
                    The goal is to make the daily close easy enough that it becomes automatic.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletCard
                      title="It reduces daily effort"
                      items={[
                        "Record revenue and operating expenses in one place.",
                        "Use consistent categories so your data doesn’t drift.",
                        "Make the daily close feel like checking a dashboard, not doing admin.",
                      ]}
                    />
                    <BulletCard
                      title="It protects trust"
                      items={[
                        "If required sale-linked costs are missing, it refuses to guess profit.",
                        "It can show profit status clearly (proven vs unknown).",
                        "It tells you what to fix to unlock a proven profit number.",
                      ]}
                    />
                  </div>
                </section>

                <Callout title="The habit you’re actually building">
                  <>
                    Instead of hoping the month-end report tells you what happened, you build a daily rhythm:
                    <span className="font-semibold text-slate-900"> close the day with truth</span> then let accuracy
                    arrive when the required costs are complete.
                  </>
                </Callout>

                <section className="space-y-4">
                  <SectionLabel>Why this compounds</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    When “today” becomes trustworthy, decisions get calmer
                  </h2>

                  <p>
                    When owners can trust what “today” meant, pricing improves, waste becomes visible, and growth
                    decisions become calmer.
                  </p>

                  <p>
                    That’s the compounding effect: fewer surprises, healthier margins, and more control not from more
                    effort, but from clearer feedback.
                  </p>
                </section>

                {/* Product CTA (keep Join waitlist here ✅) */}
                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-slate-900">Want to follow ProfitPilot as we build it?</p>
                  <p className="text-sm text-slate-700">
                    Join the waitlist for updates and early access. ProfitPilot is built around a simple standard:
                    daily clarity first, profit only when proven.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={waitlistHref}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                      Join the waitlist
                    </Link>

                    <Link
                      href={projectHref}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                    >
                      View project
                    </Link>

                    <Link
                      href={meta.hubHref}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                    >
                      Back to hub
                    </Link>
                  </div>
                </section>

                {/* ✅ Profit clarification moved to the bottom (per your rule) */}
                <section className="space-y-4">
                  <SectionLabel>Quick reminder</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Profit is shown only when it’s provable
                  </h2>
                  <p>
                    This is the trust boundary ProfitPilot won’t cross. If the required costs aren’t recorded, profit
                    stays unknown and the UI tells you what’s missing instead of guessing.
                  </p>

                  <ProfitLogicClarification tone="neutral" showOneLiner />
                </section>

                {/* Bottom nav */}
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
