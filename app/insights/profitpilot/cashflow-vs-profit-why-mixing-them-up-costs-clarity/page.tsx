import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import InsightJsonLd from "@/app/components/InsightJsonLd";

export const metadata: Metadata = {
  title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity | ProfitPilot | SolFligh Tech",
  description:
    "Cashflow answers “did money move?” Profit answers “did we create value after costs?” Mixing them creates false confidence and late surprises even when sales look strong.",
  alternates: {
    canonical: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
  },
  openGraph: {
    title: "Cashflow vs Profit: Why Mixing Them Up Is Costing You Clarity",
    description:
      "Cashflow shows movement. Profit shows value after costs. Mixing them creates false confidence and late surprises.",
    url: "/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity",
    type: "article",
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-slate-900">{children}</h2>;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="mt-4 text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-slate-200/70" />;
}

function TwoCol({
  leftTitle,
  leftBody,
  rightTitle,
  rightBody,
}: {
  leftTitle: string;
  leftBody: React.ReactNode;
  rightTitle: string;
  rightBody: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title={leftTitle}>{leftBody}</Card>
      <Card title={rightTitle}>{rightBody}</Card>
    </div>
  );
}

export default function Page() {
  const hubHref = "/insights/profitpilot";

  // ✅ Seamless chain
  const prevArticleHref =
    "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today";
  const nextArticleHref = "/insights/profitpilot/the-3-numbers-every-sme-should-check-daily";

  // ✅ Cover
  const coverImage = "/insights/profitpilot/posts/cashflow-vs-profit.jpg";

  return (
    <main className="bg-white text-slate-900">
      <InsightJsonLd href="/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity" />
      <section className="relative overflow-hidden">
        <Container>
          <article className="mx-auto max-w-3xl space-y-10 py-10">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link href={hubHref} className="font-semibold text-slate-600 hover:text-slate-900">
                ProfitPilot
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Cashflow vs Profit</span>
            </div>

            {/* Top nav */}
            <div className="flex flex-wrap gap-3">
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
                href={hubHref}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Back to hub
              </Link>
            </div>

            {/* Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>Solution Awareness</Pill>
                <Pill>4–6 min</Pill>
                <Pill>Jan 2026</Pill>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Cashflow vs Profit: why mixing them up is costing you clarity
              </h1>

              <p className="text-base leading-7 text-slate-700">
                Many business owners end the day feeling good because money came in then feel confused later when
                bills hit and nothing is left.
                <br />
                That confusion usually has one root cause: treating <strong>cashflow</strong> and{" "}
                <strong>profit</strong> as the same thing.
              </p>

              {/* Cover */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-[240px] w-full sm:h-[320px]">
                  <Image
                    src={coverImage}
                    alt="Cashflow vs Profit cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                </div>
              </div>

              {/* Outcome box (no formulas, no “— —” talk keep it unique to Q separation) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">
                <p className="m-0 font-semibold text-slate-900">The clarity shift</p>
                <p className="mt-2 mb-0">
                  Stop forcing one number to answer two different questions.
                  <br />
                  <span className="font-semibold text-slate-900">Cashflow</span> tells you if money moved.
                  <br />
                  <span className="font-semibold text-slate-900">Profit</span> tells you if value was created after costs.
                </p>
              </div>
            </header>

            {/* Body */}
            <section className="space-y-8">
              <SectionTitle>Two numbers. Two different questions.</SectionTitle>

              <TwoCol
                leftTitle="Cashflow asks: “Did money move?”"
                leftBody={
                  <>
                    <p className="m-0">
                      Cashflow is movement: what came in and what went out.
                      <br />
                      It’s essential for survival paying bills, restocking, avoiding “no cash” moments.
                    </p>
                    <ul className="mt-4 m-0 list-disc pl-5">
                      <li>It tells you <strong>liquidity</strong>.</li>
                      <li>It helps you manage <strong>timing</strong>.</li>
                      <li>It answers: <strong>“Can we operate tomorrow?”</strong></li>
                    </ul>
                  </>
                }
                rightTitle="Profit asks: “Did we create value after costs?”"
                rightBody={
                  <>
                    <p className="m-0">
                      Profit is outcome: after the work of the day, did the business actually keep value or burn it?
                    </p>
                    <ul className="mt-4 m-0 list-disc pl-5">
                      <li>It tells you <strong>performance</strong>.</li>
                      <li>It reveals <strong>pricing</strong> and <strong>margin reality</strong>.</li>
                      <li>It answers: <strong>“Was today actually worth it?”</strong></li>
                    </ul>
                  </>
                }
              />

              <Divider />

              <SectionTitle>Why mixing them hurts</SectionTitle>
              <p className="text-sm leading-7 text-slate-700">
                When you treat cashflow like profit, you give yourself “wins” that may not be real.
                <br />
                When you treat profit like cashflow, you panic even when the business is fine just temporarily tight
                on cash.
              </p>

              <TwoCol
                leftTitle="The false win"
                leftBody={
                  <>
                    <p className="m-0">
                      Money came in, so it feels like a good day.
                      <br />
                      But inflow can happen for reasons that don’t reflect performance.
                    </p>
                    <ul className="mt-4 m-0 list-disc pl-5">
                      <li>A customer paid an old balance.</li>
                      <li>You borrowed money or got an advance.</li>
                      <li>You injected personal money.</li>
                      <li>You delayed paying something important.</li>
                    </ul>
                  </>
                }
                rightTitle="The false panic"
                rightBody={
                  <>
                    <p className="m-0">
                      Money went out, so it feels like a bad day.
                      <br />
                      But outflow can be healthy even strategic.
                    </p>
                    <ul className="mt-4 m-0 list-disc pl-5">
                      <li>You bought inventory for future sales.</li>
                      <li>You paid rent upfront.</li>
                      <li>You invested in equipment.</li>
                      <li>You cleared past obligations.</li>
                    </ul>
                  </>
                }
              />

              <Card title="The pattern behind “end-of-month surprises”" subtitle="The business runs daily but clarity arrives late.">
                <p className="m-0">
                  If daily decisions are made using the wrong question (“Did money move?”), you can repeat the same
                  mistake for weeks before reality shows up.
                </p>
                <p className="mt-3 mb-0">
                  The surprise isn’t magic it’s delayed feedback caused by measuring the wrong thing.
                </p>
              </Card>

              <Divider />

              <SectionTitle>So what should you do daily?</SectionTitle>
              <p className="text-sm leading-7 text-slate-700">
                Don’t try to collapse everything into one number.
                <br />
                Use a simple daily check that keeps <strong>movement</strong> separate from <strong>performance</strong>.
              </p>

              <Card title="Next: the simple daily check" subtitle="Three numbers that remove confusion.">
                <p className="m-0">
                  In the next article, we’ll break it down into a daily routine: three checks that give clarity without
                  accounting jargon.
                </p>
                <p className="mt-3 mb-0">
                  Once you stop mixing questions, daily decisions get calmer and mistakes get visible faster.
                </p>
              </Card>

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
                  href={hubHref}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Back to hub
                </Link>

                <div className="flex-1" />

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Talk to us
                </Link>
              </div>
            </section>
          </article>
        </Container>
      </section>
    </main>
  );
}
