// app/insights/profitpilot/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import {
  getHub,
  getPostBySlug,
  listPostsByHub,
  type InsightPost,
} from "@/app/lib/insightsStore";

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
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

function NumberCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{note}</p>
    </div>
  );
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

type PageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ProfitPilotArticlePage({ params, searchParams }: PageProps) {
  const hub = getHub("profitpilot");

  // ✅ Always read from params.slug (Next.js App Router standard)
  const requestedSlug = safeDecode((params?.slug ?? "").trim());

  const availablePosts = listPostsByHub("profitpilot");
  const availableSlugs = availablePosts.map((p) => p.slug);

  // ✅ Pass decoded slug to the store lookup
  const post = requestedSlug ? getPostBySlug("profitpilot", requestedSlug) : null;

  const debug =
    (typeof searchParams?.debug === "string" && searchParams.debug === "1") ||
    (Array.isArray(searchParams?.debug) && searchParams?.debug?.[0] === "1");

  if (!post) {
    return (
      <Container>
        <div className="py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold text-slate-900">Article not found</p>
            <p className="mt-2 text-sm text-slate-600">
              This article isn’t published (or the link is wrong).
            </p>

            {debug ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Debug (only when ?debug=1)
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  Requested slug:{" "}
                  <span className="font-semibold text-slate-900">
                    {requestedSlug || "(empty)"}
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  Available slugs:{" "}
                  <span className="font-semibold text-slate-900">
                    {availableSlugs.join(", ") || "(none)"}
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  Match status:{" "}
                  <span className={`font-semibold ${post ? "text-emerald-600" : "text-rose-600"}`}>
                    {post ? "FOUND ✅" : "NOT FOUND ❌"}
                  </span>
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/insights/profitpilot"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
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
  const content = getProfitPilotArticleContent(post);

  return (
    <main className="bg-white text-slate-900">
      <Container>
        <div className="py-10 sm:py-12">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
              Insights
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href="/insights/profitpilot"
              className="font-semibold text-slate-600 hover:text-slate-900"
            >
              {hubTitle}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-slate-900">Article</span>
          </div>

          {/* Hero */}
          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <MetaPill>{post.tag}</MetaPill>
              <MetaPill>{post.readingTime}</MetaPill>
              <MetaPill>{post.dateLabel}</MetaPill>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {post.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Talk to us
              </Link>
              <Link
                href="/insights/profitpilot"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Back to hub
              </Link>
            </div>
          </div>

          {/* Cover */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="relative h-[220px] w-full sm:h-[320px] md:h-[380px]">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${post.accent}`} />
              )}
            </div>
          </div>

          {/* Body */}
          <div className="mt-10">
            <article className="mx-auto max-w-3xl space-y-12">
              {content.sections.map((s) => (
                <section key={s.id} id={s.id} className="space-y-4">
                  <SectionLabel>{s.label}</SectionLabel>

                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    {s.title}
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-slate-700">
                    {s.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {s.bullets?.length ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
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

                  {s.callout ? (
                    <Callout title={s.callout.title}>{s.callout.body}</Callout>
                  ) : null}

                  {s.numbers ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <p className="text-sm font-semibold text-slate-900">
                        Example (simple, decision-ready):
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <NumberCard
                          label="Income today"
                          value={s.numbers.income}
                          note="What came in today."
                        />
                        <NumberCard
                          label="Expenses today"
                          value={s.numbers.expenses}
                          note="What today triggered."
                        />
                        <NumberCard
                          label="You made (today)"
                          value={s.numbers.made}
                          note="The result you can act on."
                        />
                      </div>
                      <p className="mt-4 text-sm text-slate-700">
                        This is the sentence we want to confidently say every day:{" "}
                        <span className="font-semibold text-slate-900">
                          “We made {s.numbers.made} today.”
                        </span>
                      </p>
                    </div>
                  ) : null}

                  {s.cta ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm font-semibold text-slate-900">{s.cta.title}</p>
                      <p className="mt-2 text-sm text-slate-700">{s.cta.body}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                        >
                          Book a quick chat
                        </Link>
                        <Link
                          href="/insights/profitpilot"
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                        >
                          Explore ProfitPilot →
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </section>
              ))}
            </article>
          </div>
        </div>
      </Container>
    </main>
  );
}

function getProfitPilotArticleContent(post: InsightPost) {
  if (post.slug === "why-most-smes-dont-actually-know-how-much-they-made-today") {
    return {
      sections: [
        {
          id: "hook",
          label: "Start here",
          title: "If you’re a small business owner, you’ve felt this before",
          paragraphs: [
            "You close for the day. You’re tired. Sales happened. Money moved. People worked. Then the real question shows up:",
            "“Did we actually make money today… or did we just stay busy?”",
            "If your honest answer is “I’m not sure”, you’re not alone — and you’re not doing anything wrong. Most small businesses are using tools that were never designed to explain profit clearly day-by-day.",
          ],
          callout: {
            title: "The goal",
            body: (
              <>
                At the end of each day, you should be able to say one simple sentence with confidence:{" "}
                <span className="font-semibold text-slate-900">“We made ₦___ today.”</span>
              </>
            ),
          },
        },
        {
          id: "what-we-check",
          label: "What we usually do",
          title: "The checks that feel helpful… but don’t answer profit",
          paragraphs: [
            "Most of us end the day checking bank balance, sales notifications, transfers, and maybe a notebook of expenses.",
            "Those things matter — but they’re not profit. They’re activity.",
            "The problem is simple: the data is scattered, and the daily question needs one clean answer.",
          ],
          bullets: [
            "A bank balance can go up even when you’re losing money (loans, transfers, delayed expenses).",
            "Sales can be high while profit is low (discounts, wrong pricing, high costs).",
            "Monthly statements are too late when decisions are daily.",
            "Expenses are often remembered later (and that’s where surprises come from).",
          ],
        },
        {
          id: "why-its-hard",
          label: "Why it’s hard",
          title: "Why daily profit feels impossible to know",
          paragraphs: [
            "Daily profit is not difficult because you’re “bad at accounting.” It’s difficult because the inputs are messy.",
            "Small businesses don’t run like big companies. Things happen fast: part-payments, supplier credit, cash purchases, staff spending, inventory restocks, delivery costs, refunds.",
            "When your system can’t capture those costs daily, your profit becomes a guess — and guesses are expensive.",
          ],
          callout: {
            title: "A simple truth",
            body: (
              <>
                Profit is not “money in the account.” Profit is:{" "}
                <span className="font-semibold text-slate-900">
                  what you earned today minus what today truly cost you.
                </span>
              </>
            ),
          },
        },
        {
          id: "hidden-cost",
          label: "What it causes",
          title: "What guessing your profit does to your business",
          paragraphs: [
            "When we can’t see profit clearly, we start making decisions based on feelings and cash movement.",
            "That leads to patterns like: stocking the wrong items, underpricing, paying expenses too early, hiring too fast, or feeling “busy” but not growing.",
            "Clarity doesn’t just help reporting — it helps confidence.",
          ],
          bullets: [
            "You can’t tell which product or service is actually working.",
            "You can’t tell if a “good sales day” was actually a good day.",
            "You don’t know what to fix first: price, costs, operations, or marketing.",
            "You lose time explaining numbers to yourself (and sometimes to partners).",
          ],
        },
        {
          id: "what-clarity-looks-like",
          label: "What good looks like",
          title: "What a clean day-end view should show you",
          paragraphs: [
            "A good system doesn’t make you feel like you’re doing accounting. It feels like checking the score after a match.",
            "We want something simple enough to understand in 10 seconds — but accurate enough to trust.",
            "That means your daily view should clearly show income, expenses, and the final result — without jargon.",
          ],
          numbers: {
            income: "₦120,000",
            expenses: "₦81,500",
            made: "₦38,500",
          },
        },
        {
          id: "how-to-fix",
          label: "How to fix it",
          title: "A practical way to get daily profit clarity",
          paragraphs: [
            "To get a reliable daily profit number, we need three things:",
            "1) Capture income as it happens. 2) Capture costs as they happen. 3) Put them together in one daily view.",
            "If your business sells on credit or buys inventory, it helps to separate performance (profit) from cash movement (cashflow) so you don’t confuse “money moved” with “we made money.”",
          ],
          bullets: [
            "Record sales daily (even if payment is later).",
            "Record costs daily (delivery, supplies, staff spending, refunds).",
            "Group costs in a simple way (so it’s readable, not complicated).",
            "Show the day’s result as one sentence: “We made ₦___ today.”",
          ],
        },
        {
          id: "profitpilot",
          label: "Where ProfitPilot fits",
          title: "How ProfitPilot is designed to help",
          paragraphs: [
            "ProfitPilot is built around the daily question: “Did we make money today — and why?”",
            "Instead of giving you confusing accounting reports, it focuses on a simple, decision-ready daily view.",
            "That way, when you’re making choices — pricing, restocking, marketing, staffing — you’re not guessing.",
          ],
          callout: {
            title: "The goal is not “more dashboards”",
            body: (
              <>
                The goal is confidence. A daily view that feels obvious — and helps you run the business better.
              </>
            ),
          },
        },
        {
          id: "conclusion",
          label: "Wrap up",
          title: "So… did we make money today?",
          paragraphs: [
            "That question should not feel scary. It should feel normal.",
            "If you’re running a business, you deserve clarity that matches your pace — daily, not “maybe at month end.”",
            "When you can see daily profit clearly, you stop guessing and start improving the right things.",
          ],
          cta: {
            title: "Want this level of clarity for your business?",
            body: "Send us a message. We’ll show you the simplest way to track daily profit clearly — and what ProfitPilot can automate for you.",
          },
        },
      ],
    };
  }

  return {
    sections: [
      {
        id: "coming-soon",
        label: "Coming soon",
        title: "This article is being prepared",
        paragraphs: [
          "This piece isn’t published yet.",
          "Check back soon — or explore other articles in the ProfitPilot hub.",
        ],
      },
    ],
  };
}
