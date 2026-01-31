// app/insights/profitpilot/the-3-numbers-every-sme-should-check-daily/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

export const metadata: Metadata = {
  title:
    "The 3 Numbers Every SME Should Check Before Closing for the Day | ProfitPilot | SolFligh Tech",
  description:
    "Daily clarity doesn’t require accounting knowledge. These three numbers tell you exactly how your business performed today.",
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

export default function ArticlePage() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Solution Awareness",
    readingTime: "4–5 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/three-numbers.jpg",
    title: "The 3 Numbers Every SME Should Check Before Closing for the Day",
    subtitle:
      "If you only check one thing before locking up, make it these three numbers. They tell the truth — fast.",
  };

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <Container>
          <div className="py-10">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href={meta.insightsHref} className="font-semibold text-slate-600 hover:text-slate-900">
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link href={meta.hubHref} className="font-semibold text-slate-600 hover:text-slate-900">
                {meta.hubTitle}
              </Link>
            </div>

            {/* Header */}
            <div className="mt-6 max-w-3xl space-y-4">
              <div className="flex flex-wrap gap-2">
                <MetaPill>{meta.tag}</MetaPill>
                <MetaPill>{meta.readingTime}</MetaPill>
                <MetaPill>{meta.dateLabel}</MetaPill>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {meta.title}
              </h1>

              <p className="text-lg text-slate-600">{meta.subtitle}</p>
            </div>

            {/* Cover */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
              <div className="relative h-[280px] w-full">
                <Image
                  src={meta.coverImage}
                  alt={meta.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Article */}
            <article className="mx-auto mt-12 max-w-3xl space-y-10 text-base leading-relaxed text-slate-700">
              <section>
                <SectionLabel>The daily reality</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Most SMEs close the day without real clarity
                </h2>
                <p className="mt-4">
                  At the end of the day, many business owners feel tired, busy, and unsure.
                  Sales happened. Money moved. But the real question remains unanswered:
                  <strong> did today actually go well?</strong>
                </p>
              </section>

              <section>
                <SectionLabel>The fix</SectionLabel>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Three numbers tell the full story
                </h2>
                <p className="mt-4">
                  You don’t need spreadsheets or accounting language. You need three numbers
                  that answer three different questions.
                </p>

                <ul className="mt-6 space-y-3">
                  <li><strong>1. Income today</strong> — what came in.</li>
                  <li><strong>2. Expenses today</strong> — what today triggered.</li>
                  <li><strong>3. We made today</strong> — the result you can act on.</li>
                </ul>
              </section>

              <section>
                <SectionLabel>Why this works</SectionLabel>
                <p className="mt-4">
                  These numbers separate movement from performance.
                  They remove guessing and replace it with calm, confident decisions.
                </p>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-semibold text-slate-900">
                  This is exactly how ProfitPilot works
                </p>
                <p className="mt-2">
                  ProfitPilot turns these three numbers into a daily habit — automatically —
                  so SMEs stop guessing and start steering.
                </p>

                <div className="mt-4 flex gap-3">
                  <Link
                    href="/waitlist?product=profitpilot"
                    className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    Join the waitlist
                  </Link>
                  <Link
                    href={meta.hubHref}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                  >
                    Back to hub
                  </Link>
                </div>
              </section>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
