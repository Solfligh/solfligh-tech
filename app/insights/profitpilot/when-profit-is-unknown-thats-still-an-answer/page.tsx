import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ProfitLogicClarification from "@/app/components/ProfitLogicClarification";

export const metadata: Metadata = {
  title: "When Profit Is Unknown, That’s Still an Answer | ProfitPilot | SolFligh Tech",
  description:
    "ProfitPilot treats profit as a proven number—not a guess. When required costs are missing, it shows “— —” and explains what’s needed.",
  alternates: {
    canonical: "/insights/profitpilot/when-profit-is-unknown-thats-still-an-answer",
  },
  openGraph: {
    title: "When Profit Is Unknown, That’s Still an Answer",
    description:
      "ProfitPilot refuses to guess profit. If costs are incomplete, it shows “— —” and explains why.",
    url: "/insights/profitpilot/when-profit-is-unknown-thats-still-an-answer",
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

export default function ProfitUnknownArticlePage() {
  const meta = {
    hubTitle: "ProfitPilot",
    hubHref: "/insights/profitpilot",
    insightsHref: "/insights",
    tag: "Profit Philosophy",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/profit-unknown.jpg",
    title: "When Profit Is Unknown, That’s Still an Answer",
    subtitle:
      "Sometimes the most honest number is: “we don’t know yet.” ProfitPilot treats profit as a proven number—not a guess.",
  };

  // Optional nav (keep simple)
  const prevArticleHref = "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily";

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

            {/* Nav */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={prevArticleHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                ← Previous article
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
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              </div>
            </div>

            {/* Article */}
            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-slate-700">
                <section className="space-y-4">
                  <SectionLabel>The uncomfortable truth</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Most “profit today” numbers are guesses
                  </h2>
                  <p>
                    A lot of businesses can tell you what they sold today. Some can tell you what they spent today.
                    But profit is different: profit depends on whether the costs tied to those sales are fully recorded.
                  </p>
                  <p>
                    If costs are missing (especially costs directly tied to each sale), any profit number is not a
                    measurement — it’s a story.
                  </p>
                </section>

                <ProfitLogicClarification tone="warn" showOneLiner />

                <section className="space-y-4">
                  <SectionLabel>Why “unknown” is useful</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    “— —” protects you from confident mistakes
                  </h2>
                  <p>
                    When ProfitPilot shows <strong>“— —”</strong>, it’s not failing to calculate. It’s refusing to
                    mislead you.
                  </p>
                  <Callout title="What ProfitPilot is really saying">
                    <>
                      <p className="m-0">
                        “You have recorded revenue, but profit can’t be proven yet because required costs are missing.
                        Record the missing cost(s), and the profit number becomes real.”
                      </p>
                    </>
                  </Callout>
                </section>

                <section className="space-y-4">
                  <SectionLabel>What you can still see</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    A truthful fallback: operating surplus/deficit (recorded)
                  </h2>
                  <p>
                    Even when profit is unknown, you can still get a useful daily signal that helps you manage overhead
                    and pricing decisions—without pretending it’s profit.
                  </p>
                  <Callout title="Operating surplus / deficit (recorded)">
                    <>
                      <p className="m-0">
                        <strong>Operating surplus / deficit (recorded)</strong> = Revenue − Operating Expenses (recorded)
                      </p>
                      <p className="mt-3 mb-0">
                        This is <strong>not profit</strong>. It’s a signal while you complete the required sale costs.
                      </p>
                    </>
                  </Callout>
                </section>

                <section className="space-y-4">
                  <SectionLabel>The standard we keep</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    If it can’t be proven, ProfitPilot won’t show it
                  </h2>
                  <p>
                    ProfitPilot treats profit as a conditional number. When costs are complete, profit is shown. When
                    they aren’t, the UI explains exactly what’s missing.
                  </p>
                  <p>
                    That single design choice changes behavior: people stop relying on vibes and start recording what’s
                    needed to unlock real clarity.
                  </p>
                </section>

                {/* Bottom nav */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={meta.hubHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Back to ProfitPilot hub
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
