// app/insights/profitpilot/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import { getHub, getPostBySlug, type InsightPost } from "@/app/lib/insightsStore";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-bold tracking-wide text-slate-600 shadow-sm backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-sky-500" />
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />;
}

function TocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </a>
  );
}

/**
 * ✅ 1% Article Renderer
 * - pulls title/meta from insightsStore
 * - renders premium layout (hero, cover, sidebar TOC)
 * - content comes from a local map (so it’s still fast + simple)
 */
export default function ProfitPilotArticlePage({ params }: { params: { slug: string } }) {
  const hub = getHub("profitpilot");
  const post = getPostBySlug("profitpilot", params.slug);

  if (!post) {
    return (
      <Container>
        <div className="py-16">
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">Article not found</p>
            <p className="mt-2 text-sm text-slate-600">
              This article slug doesn’t exist yet.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/insights/profitpilot"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
              >
                Back to ProfitPilot hub
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
              >
                All Insights →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const hubTitle = hub?.title || "ProfitPilot";

  // ✅ Content source (for now)
  // If you want later: store content in MDX files instead. This is the simplest “ship now” setup.
  const content = getProfitPilotArticleContent(post);

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-blue-200/25 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/70 blur-3xl" />
        </div>

        <Container>
          <div className="relative py-10 sm:py-12">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link href="/insights/profitpilot" className="font-semibold text-slate-600 hover:text-slate-900">
                {hubTitle}
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Article</span>
            </div>

            {/* Hero */}
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{post.tag}</Pill>
                  <Pill>{post.readingTime}</Pill>
                  <Pill>{post.dateLabel}</Pill>
                  <Pill>SME clarity</Pill>
                  <Pill>Daily profit</Pill>
                  <Pill>Zero jargon</Pill>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/insights/profitpilot"
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
              </div>

              {/* Right-side mini summary */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-200/30 blur-2xl" />
                  <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-blue-200/20 blur-2xl" />
                </div>

                <div className="relative space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In one sentence</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Most SMEs can’t answer “how much did we make today?” because the tools they use were built for
                    reporting — not daily decisions.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <p className="text-xs font-semibold text-slate-500">What SMEs need</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">A daily performance answer</p>
                      <p className="mt-1 text-xs text-slate-600">Simple. Reliable. Decision-ready.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <p className="text-xs font-semibold text-slate-500">What they usually get</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">Sales + bank balance</p>
                      <p className="mt-1 text-xs text-slate-600">Helpful… but not the answer.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
              <div className="relative h-[220px] w-full sm:h-[320px] md:h-[360px]">
                {post.coverImage ? (
                  <>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 1100px"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.accent}`} />
                )}
              </div>
            </div>

            {/* Body + Sidebar */}
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
              <article className="space-y-10">
                {/* Render sections */}
                {content.sections.map((s) => (
                  <section key={s.id} id={s.id} className="space-y-4">
                    <SectionLabel>{s.label}</SectionLabel>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{s.title}</h2>
                    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                      {s.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>

                    {s.bullets?.length ? (
                      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                        <ul className="space-y-2 text-sm text-slate-700">
                          {s.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {s.divider ? <Divider /> : null}
                  </section>
                ))}

                {/* Final CTA */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
                    <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
                  </div>

                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold tracking-tight text-slate-900">
                        Want this as a dashboard, not an idea?
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        We can build ProfitPilot-style daily clarity into your workflow.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href="/insights/profitpilot"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                      >
                        More articles
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
                </div>
              </article>

              <aside className="lg:sticky lg:top-24 space-y-4">
                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">On this page</p>
                  <div className="mt-3 space-y-1">
                    {content.sections.map((s) => (
                      <TocLink key={s.id} href={`#${s.id}`}>
                        {s.toc}
                      </TocLink>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm font-bold text-slate-900">Quick next steps</p>
                  <div className="mt-3 space-y-3">
                    <Link
                      href="/insights/profitpilot"
                      className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
                    >
                      View ProfitPilot hub →
                      <p className="mt-1 text-xs font-normal text-slate-600">More SME-focused clarity articles.</p>
                    </Link>
                    <Link
                      href="/projects"
                      className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
                    >
                      See our projects →
                      <p className="mt-1 text-xs font-normal text-slate-600">What we ship in real life.</p>
                    </Link>
                    <Link
                      href="/contact"
                      className="block rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                    >
                      Contact us
                      <p className="mt-1 text-xs font-normal text-white/90">Tell us what you want to build.</p>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/**
 * Content map for ProfitPilot articles
 * (simple now; later we can switch to MDX files without changing the layout)
 */
function getProfitPilotArticleContent(post: InsightPost) {
  // Match by href or slug if you add more later
  if (post.slug === "why-most-smes-dont-actually-know-how-much-they-made-today") {
    return {
      sections: [
        {
          id: "hook",
          toc: "The daily question",
          label: "Start here",
          title: "If you run an SME, this question is harder than it should be",
          paragraphs: [
            "If someone asked you “How much profit did you make today?”, there’s a good chance your answer sounds like one of these: “I’ll know at the end of the month”, “I’ll check my bank balance”, “We made sales today… so probably good”, or “My accountant handles that.”",
            "If that’s you, here’s the important part: you’re not bad at business. The system around you just isn’t built for SMEs.",
          ],
        },
        {
          id: "why-today",
          toc: "Why “today” matters",
          label: "Why this matters",
          title: "For SMEs, “today” is not optional",
          paragraphs: [
            "Large companies don’t wake up asking what happened today. They have finance teams, buffers, forecasts, and time. SMEs don’t.",
            "For SMEs, today determines what happens next: pricing, restock decisions, staffing, deliveries, and whether tomorrow is a push or a pause.",
            "Yet most SMEs finish the day without a clear answer — not because they’re careless, but because profit visibility is broken at the SME level.",
          ],
          bullets: [
            "Did today help or hurt cash?",
            "Did we price correctly?",
            "Are we growing — or just working harder?",
            "Can I confidently make tomorrow’s decision?",
          ],
          divider: true,
        },
        {
          id: "trap-1",
          toc: "Trap #1: Sales ≠ profit",
          label: "The two traps",
          title: "Trap #1: “We made sales today, so we’re profitable”",
          paragraphs: [
            "Sales only tell you money came in. They don’t tell you what it cost to deliver, what expenses were triggered, what still hasn’t been paid, or what belongs to suppliers, staff, and tax authorities.",
            "You can have a great sales day and still lose money. That’s not rare — it’s common.",
          ],
        },
        {
          id: "trap-2",
          toc: "Trap #2: Bank balance",
          label: "The two traps",
          title: "Trap #2: “I’ll check my bank balance”",
          paragraphs: [
            "Your bank balance is cash position, not performance. It can move because of old invoices getting paid, expenses from previous weeks, owner transfers, and loans/credit lines.",
            "It tells you how much cash you have — not how well the business performed today.",
          ],
          bullets: [
            "Old invoices finally paid",
            "Expenses from previous weeks",
            "Owner transfers",
            "Loans, credit lines, and delays",
          ],
          divider: true,
        },
        {
          id: "why-accounting",
          toc: "Why accounting fails daily",
          label: "Root cause",
          title: "Traditional accounting wasn’t designed for daily SME decisions",
          paragraphs: [
            "Traditional accounting is built for reporting and compliance: monthly closes, quarterly reviews, tax reporting, and “official” profitability.",
            "SMEs need a different answer: “Did we make money today — yes or no — and why?” That’s a decision question.",
          ],
        },
        {
          id: "what-good-looks-like",
          toc: "What good looks like",
          label: "What good looks like",
          title: "The 1% answer SMEs deserve",
          paragraphs: [
            "At the end of the day, an SME should see a simple, decision-ready result:",
            "Income today. Expenses today. And a plain-language number: “You made $X today.”",
            "Not jargon. Not confusion. Just clarity you can act on.",
          ],
        },
        {
          id: "closing",
          toc: "Wrap up",
          label: "Wrap up",
          title: "You’re not confused — you’re underserved",
          paragraphs: [
            "Most SMEs aren’t struggling because they don’t work hard. They struggle because they’re forced to make decisions without daily visibility.",
            "ProfitPilot exists to make “today” clear — so SME owners stop guessing and start steering.",
          ],
        },
      ],
    };
  }

  // fallback for future posts you add
  return {
    sections: [
      {
        id: "start",
        toc: "Start",
        label: "Draft",
        title: "This post exists but content isn’t mapped yet",
        paragraphs: [
          "You added this post to insightsStore, but the page content hasn’t been added to the content map yet.",
          "Tell me the title + key points and I’ll generate the full 1% article layout content instantly.",
        ],
      },
    ],
  };
}
