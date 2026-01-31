// app/insights/profitpilot/from-daily-numbers-to-daily-clarity-how-profitpilot-turns-insight-into-habit/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

export const metadata: Metadata = {
  title:
    "From Daily Numbers to Daily Clarity: How ProfitPilot Turns Insight Into Habit | SolFligh Tech",
  description:
    "Knowing what to track is one thing. Doing it consistently is another. Here’s how ProfitPilot turns daily profit clarity into a reliable habit for SMEs.",
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

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}

export default function ProfitPilotSolutionArticlePage() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Product Solution",
    readingTime: "5–7 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/daily-clarity-system.jpg",
    title: "From Daily Numbers to Daily Clarity",
    subtitle:
      "Knowing what to track is easy. Doing it consistently is the real challenge. This is where ProfitPilot fits.",
  };

  const waitlistHref =
    "/waitlist?product=profitpilot&source=profitpilot_solution_article";

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <Container>
          <div className="relative py-10 sm:py-12">
            {/* Breadcrumb */}
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
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              </div>
            </div>

            {/* Article body */}
            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-slate-700">
                <section className="space-y-4">
                  <SectionLabel>The real challenge</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The problem isn’t knowing what to track
                  </h2>

                  <p>
                    By now, the numbers are clear. Income today. Expenses today.
                    What we made today. None of that is complicated.
                  </p>

                  <p>
                    What breaks down for most SMEs isn’t understanding — it’s
                    consistency. After long days, scattered tools, and daily
                    pressure, even simple routines start to slip.
                  </p>
                </section>

                <section className="space-y-4">
                  <SectionLabel>What already works</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    The method is simple, but habits need support
                  </h2>

                  <p>
                    The three-number approach works because it separates movement
                    from performance. It removes guessing and replaces it with
                    clarity.
                  </p>

                  <p>
                    But doing this manually every single day takes discipline —
                    and discipline fades when systems don’t help.
                  </p>
                </section>

                <section className="space-y-4">
                  <SectionLabel>Where ProfitPilot fits</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    ProfitPilot exists to make clarity automatic
                  </h2>

                  <p>
                    ProfitPilot isn’t accounting software and it isn’t built to
                    overwhelm. It’s designed to quietly run the daily routine in
                    the background.
                  </p>

                  <p>
                    Income and expenses are captured in one place. Cash movement
                    is separated from performance. At the end of the day, the
                    question “Did we make money today?” has a clear answer.
                  </p>
                </section>

                <Callout title="The shift">
                  <>
                    Instead of relying on memory, guesswork, or end-of-month
                    reports, ProfitPilot turns daily clarity into a habit you
                    don’t have to fight for.
                  </>
                </Callout>

                <section className="space-y-4">
                  <SectionLabel>Why this compounds</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Daily clarity leads to better decisions
                  </h2>

                  <p>
                    When business owners know how today actually went, pricing
                    improves, waste becomes visible, and growth decisions become
                    calmer.
                  </p>

                  <p>
                    Over time, this compounds into healthier margins and fewer
                    surprises — not because the business worked harder, but
                    because it saw clearly.
                  </p>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Ready to stop guessing?
                  </p>
                  <p className="text-sm text-slate-700">
                    If daily profit clarity is what you want, ProfitPilot is
                    built for you.
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
                      Back to ProfitPilot hub
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
