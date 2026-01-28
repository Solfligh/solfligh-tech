// app/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import { getPostByHref, getHub } from "@/app/lib/insightsStore";

const HREF =
  "/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today";

export default function ProfitPilotArticlePage() {
  const hub = getHub("profitpilot");
  const post = getPostByHref(HREF);

  const title =
    post?.title ?? "Why Most SMEs Don’t Actually Know How Much They Made Today";
  const description =
    post?.description ??
    "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.";
  const coverImage = post?.coverImage;

  return (
    <main className="bg-white text-slate-900">
      <Container>
        <div className="py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
              Insights
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href={hub?.href ?? "/insights/profitpilot"}
              className="font-semibold text-slate-600 hover:text-slate-900"
            >
              {hub?.title ?? "ProfitPilot"}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-slate-900">Article</span>
          </div>

          <PageHeader
            badge="Problem Awareness"
            title={title}
            subtitle={description}
            actions={
              <div className="flex flex-wrap gap-2">
                <Link
                  href={hub?.href ?? "/insights/profitpilot"}
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
            }
          />

          {/* Cover */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
            <div className="relative h-56 w-full sm:h-72">
              {coverImage ? (
                <>
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/15 via-white to-blue-500/10" />
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 p-5 text-xs">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                SME clarity
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                Daily profit
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                Zero jargon
              </span>

              <span className="mx-1 text-slate-300">•</span>

              <span className="font-semibold text-slate-600">{post?.readingTime ?? "4–6 min"}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-600">{post?.dateLabel ?? "Jan 2026"}</span>
            </div>
          </div>

          {/* Article body */}
          <article className="mt-10">
            <div className="mx-auto max-w-3xl">
              <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-a:text-sky-700">
                <h1>Why Most SMEs Don’t Actually Know How Much They Made Today</h1>

                <p>
                  If you run an SME and someone asked you <strong>“How much profit did you make today?”</strong>,
                  there’s a good chance your answer would sound like one of these:
                </p>

                <ul>
                  <li>“I’ll know at the end of the month.”</li>
                  <li>“I can check my bank balance.”</li>
                  <li>“We made sales today, so… probably good?”</li>
                  <li>“My accountant handles that.”</li>
                </ul>

                <p>
                  And if that’s you, here’s the important part:
                  <br />
                  <strong>You’re not bad at business.</strong>
                  <br />
                  The system around you just isn’t built for how SMEs actually operate.
                </p>

                <h2>The daily question SMEs can’t answer (but should)</h2>
                <p>
                  Large companies don’t wake up asking what happened <em>today</em>. They have finance teams,
                  buffers, forecasts, and time.
                </p>
                <p>SMEs don’t.</p>
                <p>
                  For SMEs, <strong>today matters</strong>:
                </p>
                <ul>
                  <li>Did today help or hurt cash?</li>
                  <li>Did we price correctly?</li>
                  <li>Are we growing, or just working harder?</li>
                  <li>Can I confidently make tomorrow’s decision?</li>
                </ul>
                <p>
                  Yet most SMEs finish the day without a clear answer. Not because they’re careless — but because
                  <strong> profit visibility is broken at the SME level.</strong>
                </p>

                <h2>Sales ≠ profit (and your bank balance isn’t the answer either)</h2>
                <p>Let’s clear up two common traps.</p>

                <h3>Trap #1: “We made sales today, so we’re profitable”</h3>
                <p>Sales only tell you money <em>came in</em>.</p>
                <p>They don’t tell you:</p>
                <ul>
                  <li>What it cost to deliver</li>
                  <li>What expenses were triggered</li>
                  <li>What still hasn’t been paid</li>
                  <li>What belongs to suppliers, staff, or tax authorities</li>
                </ul>
                <p>You can have a great sales day and still lose money.</p>

                <h3>Trap #2: “I’ll check my bank balance”</h3>
                <p>
                  Your bank balance is <strong>cash position</strong>, not performance.
                </p>
                <p>It’s affected by:</p>
                <ul>
                  <li>Old invoices finally paid</li>
                  <li>Expenses from previous weeks</li>
                  <li>Owner transfers</li>
                  <li>Loans, credit lines, and delays</li>
                </ul>
                <p>
                  It tells you <em>how much cash you have</em>, not <strong>how well the business performed today</strong>.
                </p>

                <h2>Accounting wasn’t designed for daily SME decisions</h2>
                <p>Traditional accounting answers questions like:</p>
                <ul>
                  <li>“What happened last quarter?”</li>
                  <li>“What do we report for tax?”</li>
                  <li>“What’s the official net profit?”</li>
                </ul>
                <p>SMEs need different answers:</p>
                <ul>
                  <li>“Was today a good day?”</li>
                  <li>“Is this product actually working?”</li>
                  <li>“Can I afford to hire, spend, or wait?”</li>
                </ul>
                <p>
                  But accounting systems work monthly or quarterly, use terms most operators don’t think in, and focus
                  on compliance — not clarity.
                </p>

                <h2>The real problem: SMEs run daily, but measure monthly</h2>
                <p>Here’s the mismatch:</p>
                <ul>
                  <li><strong>Decisions happen daily</strong></li>
                  <li><strong>Measurements arrive monthly</strong></li>
                  <li><strong>Corrections happen too late</strong></li>
                </ul>
                <p>
                  By the time a monthly report says “this wasn’t working,” you’ve already repeated the same mistake
                  for weeks.
                </p>
                <p>This is not a discipline problem. It’s a tooling problem.</p>

                <h2>What SMEs actually need (and rarely get)</h2>
                <p>SMEs don’t need more spreadsheets.</p>
                <p>They need one clear daily answer:</p>
                <blockquote>
                  <p>
                    “After everything that happened today — did the business move forward or backward?”
                  </p>
                </blockquote>
                <p>That answer should be:</p>
                <ul>
                  <li>Simple</li>
                  <li>Timely</li>
                  <li>Free of jargon</li>
                  <li>Grounded in real operations</li>
                  <li>Built for decisions</li>
                </ul>
                <p>
                  Not 20 reports. Not 50 metrics. Not an accountant’s explanation. Just clarity.
                </p>

                <h2>Why this gap exists (and why it’s not your fault)</h2>
                <p>Most tools are built for:</p>
                <ul>
                  <li>Enterprises</li>
                  <li>Finance professionals</li>
                  <li>Historical reporting</li>
                  <li>Compliance first</li>
                </ul>
                <p>
                  SMEs sit in the middle — too complex for basic tools, too small for enterprise systems, and too busy
                  to translate financial language every day.
                </p>

                <h2>Where ProfitPilot fits in (without the sales pitch)</h2>
                <p>
                  ProfitPilot exists because this gap keeps showing up — not to replace accountants, and not to teach
                  SMEs accounting.
                </p>
                <p>
                  It’s built to answer the daily question accounting doesn’t:
                  <br />
                  <strong>“What actually happened today?”</strong>
                </p>
                <p>
                  Clear. Immediate. Decision-ready.
                </p>

                <h2>What’s next</h2>
                <p>
                  In the next article, we’ll break down why “net profit” still confuses SMEs, why cashflow alone isn’t
                  enough, and how to think about daily performance without becoming an accountant.
                </p>
                <p>
                  For now, know this:
                  <br />
                  <strong>If you don’t know what you made today, you’re not behind.</strong>
                  <br />
                  You’re just missing the right lens.
                </p>
              </div>

              {/* Bottom nav */}
              <div className="mt-10 flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Back to ProfitPilot hub</p>
                  <p className="mt-1 text-sm text-slate-600">
                    See all ProfitPilot Insights articles in one place.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={hub?.href ?? "/insights/profitpilot"}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    ProfitPilot hub
                  </Link>
                  <Link
                    href="/insights"
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:underline"
                  >
                    All hubs →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </main>
  );
}
