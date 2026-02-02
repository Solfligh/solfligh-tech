// app/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit | SolFligh Tech",
  description:
    "Knowing what to track is one thing. Doing it consistently is another. ProfitPilot turns daily clarity into a habit without guessing profit when costs are incomplete.",
  alternates: {
    canonical:
      "/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit",
  },
  openGraph: {
    title: "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit",
    description:
      "ProfitPilot replaces discipline with a system that makes daily clarity automatic. Daily verdict first. Profit only when proven.",
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
      "Knowing what to track is easy. Doing it consistently is the real challenge. Here’s how daily clarity becomes automatic without forcing fake profit.",
  };

  const prevArticleHref = "/insights/profitpilot/from-daily-number-to-daily-clarity";
  const nextArticleHref = "/insights/profitpilot/when-profit-is-unknown-thats-still-an-answer";

  const waitlistHref = "/waitlist?product=profitpilot&source=profitpilot_article_5";
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

              <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {meta.subtitle}
              </p>
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
                    Habits don’t collapse from ignorance they collapse from friction
                  </h2>

                  <p>
                    Most SMEs already know what they should track. The failure happens later:
                    the day gets busy, records are scattered, and the routine becomes too hard to repeat.
                  </p>

                  <p className="font-semibold text-slate-900">
                    If clarity requires heavy effort every night, it won’t survive real life.
                  </p>
                </section>

                <Callout title="What ProfitPilot is actually solving">
                  <>
                    <p className="m-0">
                      Not “teach accounting.”  
                      <br />
                      Not “show more charts.”  
                      <br />
                      <span className="font-semibold text-slate-900">
                        Replace discipline with a system that carries the habit.
                      </span>
                    </p>
                  </>
                </Callout>

                {/* 🔑 DISCIPLINE → SYSTEM BRIDGE */}
                <section className="space-y-4">
                  <SectionLabel>The bridge</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    This is where ProfitPilot replaces willpower with design
                  </h2>

                  <p>
                    ProfitPilot exists because discipline breaks under real business conditions.
                    Long days. Split tools. Missing costs. Mental fatigue.
                  </p>

                  <p className="font-semibold text-slate-900">
                    Instead of asking you to try harder, ProfitPilot carries the habit for you.
                  </p>

                  <p>
                    The daily close works not because you’re disciplined,
                    but because the system makes the next truthful step small, obvious, and repeatable.
                  </p>
                </section>

                <section className="space-y-4">
                  <SectionLabel>What makes it repeatable</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    A habit survives when the steps are tiny and the output is calm
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <StepCard
                      step="1"
                      title="Tiny daily close"
                      desc="Record what happened today in plain language, not accounting jargon."
                    />
                    <StepCard
                      step="2"
                      title="Separate questions"
                      desc="Keep movement (cash) separate from performance (profit/status)."
                    />
                    <StepCard
                      step="3"
                      title="Trust boundary"
                      desc="Never show a confident profit number when required costs are missing."
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <SectionLabel>The system</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    ProfitPilot turns this into a repeatable daily close
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletCard
                      title="It reduces effort"
                      items={[
                        "Record revenue and expenses in one place.",
                        "Keep categories consistent over time.",
                        "Turn clarity into a 60-second habit.",
                      ]}
                    />
                    <BulletCard
                      title="It protects truth"
                      items={[
                        "Profit only appears when costs are complete.",
                        "Missing data is explained, not guessed.",
                        "Trust compounds instead of eroding.",
                      ]}
                    />
                  </div>
                </section>

                {/* CTA */}
                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Want to follow ProfitPilot as we build it?
                  </p>
                  <p className="text-sm text-slate-700">
                    Join the waitlist for updates and early access.  
                    Daily clarity first. Profit only when proven.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={waitlistHref}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                      Join the waitlist
                    </Link>

                    <Link
                      href={projectHref}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                      View project
                    </Link>
                  </div>
                </section>

                {/* Profit clarification at bottom */}
                <section className="space-y-4 border-t border-slate-200 pt-8">
                  <SectionLabel>Quick reminder</SectionLabel>
                  <ProfitLogicClarification tone="neutral" showOneLiner />
                </section>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
