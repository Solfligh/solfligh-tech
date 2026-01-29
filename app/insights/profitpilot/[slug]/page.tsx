// app/insights/profitpilot/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import {
  getHub,
  getPostByHref,
  getPostBySlug,
  listPostsByHub,
  type InsightPost,
} from "@/app/lib/insightsStore";

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
      </div>

      <div className="relative space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="text-sm leading-relaxed text-slate-700">{children}</div>
      </div>
    </div>
  );
}

function normalizeSlugParam(value: unknown): string {
  if (Array.isArray(value)) return value.join("/").trim();
  if (typeof value === "string") return value.trim();
  return "";
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Some deployments end up with a param key name that isn't "slug"
 * (e.g. folder renamed to [postSlug]). This makes the page resilient:
 * - uses params.slug if present
 * - otherwise uses the first param value
 */
function getSlugFromParams(params: Record<string, unknown>): string {
  const direct =
    (params as any).slug ??
    (params as any).postSlug ??
    (params as any).articleSlug ??
    (params as any).id;

  const fallback = direct ?? Object.values(params)[0];
  return safeDecodeURIComponent(normalizeSlugParam(fallback));
}

/**
 * Fallback post for the known ProfitPilot article slug.
 * This guarantees your page renders even if the store lookup fails for any reason.
 */
function fallbackPostForSlug(slug: string): InsightPost | null {
  if (slug !== "why-most-smes-dont-actually-know-how-much-they-made-today") return null;

  return {
    hubSlug: "profitpilot",
    slug,
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.",
    href: `/insights/profitpilot/${slug}`,
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    dateISO: "2026-01-10",
    accent: "from-sky-500/20 to-blue-500/10",
    coverImage: "/insights/profitpilot/posts/why-made-today.jpg",
  };
}

export default function ProfitPilotArticlePage({
  params,
}: {
  params: Record<string, unknown>;
}) {
  const hub = getHub("profitpilot");

  const slug = getSlugFromParams(params);

  // 1) primary lookup by stable slug
  let post = slug ? getPostBySlug("profitpilot", slug) : null;

  // 2) fallback: lookup by href
  if (!post && slug) {
    post = getPostByHref(`/insights/profitpilot/${slug}`);
  }

  // 3) fallback: scan hub posts
  if (!post && slug) {
    const posts = listPostsByHub("profitpilot");
    post =
      posts.find(
        (p) =>
          p.slug === slug ||
          p.href === `/insights/profitpilot/${slug}` ||
          p.href.endsWith(`/${slug}`)
      ) || null;
  }

  // 4) final fallback: known article self-heal
  if (!post && slug) {
    post = fallbackPostForSlug(slug);
  }

  if (!post) {
    const available = listPostsByHub("profitpilot").map((p) => p.slug);

    return (
      <Container>
        <div className="py-16">
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-8 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">Article not found</p>
            <p className="mt-2 text-sm text-slate-600">This article slug doesn’t exist yet.</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs font-semibold text-slate-500">Debug (temporary)</p>
              <p className="mt-1 text-sm text-slate-700">
                Requested slug: <span className="font-semibold text-slate-900">{slug || "(empty)"}</span>
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Available slugs:{" "}
                <span className="font-semibold text-slate-900">{available.join(", ") || "(none)"}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Params keys:{" "}
                <span className="font-semibold text-slate-700">
                  {Object.keys(params || {}).join(", ") || "(none)"}
                </span>
              </p>
            </div>

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

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <MetaPill>{post.tag}</MetaPill>
                  <MetaPill>{post.readingTime}</MetaPill>
                  <MetaPill>{post.dateLabel}</MetaPill>
                </div>

                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Talk to us
                  </Link>
                  <Link
                    href="/insights/profitpilot"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    Back to hub
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">The idea</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  SMEs don’t need more accounting. They need a daily answer they can steer with:
                  <span className="font-semibold text-slate-900"> “Did we make money today — yes or no — and why?”</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  This article explains why the current tools fail that question — and what “good” looks like.
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/25 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.accent}`} />
                )}
              </div>
            </div>

            <div className="mt-10">
              <article className="mx-auto max-w-3xl space-y-12">
                {content.sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-24 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      {s.title}
                    </h2>

                    <div className="space-y-4 text-base leading-relaxed text-slate-700">
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

                    {s.callout ? <Callout title={s.callout.title}>{s.callout.body}</Callout> : null}
                  </section>
                ))}
              </article>
            </div>
          </div>
        </Container>
      </section>
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
          title: "The question every SME gets and too few can answer",
          paragraphs: [
            "If someone asked you, “How much profit did you make today?”, there’s a good chance your answer would sound like: “I’ll know at month end,” “Let me check my bank balance,” “We made sales, so probably good,” or “My accountant handles that.”",
            "If that’s you, you’re not bad at business. You’re running an SME with tools that weren’t built for how SMEs actually operate.",
          ],
          callout: {
            title: "The real problem",
            body: (
              <>
                SMEs don’t need more reports. They need a daily decision answer:
                <span className="font-semibold text-slate-900"> “Did we make money today — yes or no — and why?”</span>
              </>
            ),
          },
        },
        {
          id: "why-today",
          label: "Why this matters",
          title: "For SMEs, “today” is the real decision unit",
          paragraphs: [
            "Big companies can wait for month-end. They have buffers, forecasts, and teams. SMEs don’t have that luxury.",
            "Your pricing, restock, staffing, delivery capacity, and tomorrow’s plan depend on what happened today.",
            "Yet many SMEs finish the day with a feeling, not an answer — because profit visibility is broken at the SME level.",
          ],
          bullets: [
            "Did today help or hurt cash?",
            "Did we price correctly?",
            "Are we growing — or just working harder?",
            "Can I confidently make tomorrow’s decision?",
          ],
        },
        {
          id: "trap-1",
          label: "The trap",
          title: "Trap #1: “We made sales today, so we’re profitable”",
          paragraphs: [
            "Sales only tell you money came in. They don’t tell you what it cost to deliver, what expenses were triggered, what still hasn’t been paid, or what belongs to suppliers, staff, and tax authorities.",
            "That’s why you can have a great sales day and still lose money — and you won’t even notice until later.",
          ],
        },
        {
          id: "trap-2",
          label: "The trap",
          title: "Trap #2: “I’ll check my bank balance”",
          paragraphs: [
            "Your bank balance is cash position, not performance.",
            "It can move because of old invoices getting paid, expenses from previous weeks, owner transfers, or loans and credit lines.",
            "So it tells you how much cash you have — not how well the business performed today.",
          ],
          bullets: ["Old invoices finally paid", "Expenses from previous weeks", "Owner transfers", "Loans, credit lines, and delays"],
        },
        {
          id: "why-accounting",
          label: "Root cause",
          title: "Traditional accounting wasn’t designed for daily SME decisions",
          paragraphs: [
            "Accounting is built for compliance and reporting: month-end closes, tax reporting, and official profitability.",
            "Those are important — but they don’t help you steer the business day-by-day.",
            "SMEs need a simple daily view of income minus expenses tied to today, so decisions stop being guesswork.",
          ],
          callout: {
            title: "A clean definition",
            body: (
              <>
                <span className="font-semibold text-slate-900">Daily performance</span> = income created today − expenses triggered today.
                <br />
                (Not “bank balance.” Not “sales.”)
              </>
            ),
          },
        },
        {
          id: "what-good-looks-like",
          label: "The standard",
          title: "What the 1% answer looks like",
          paragraphs: [
            "At the end of the day, an SME should see one decision-ready result.",
            "Example (illustrative): Income today ₦120,000. Expenses today ₦81,500. Result: “You made ₦38,500 today.”",
            "Not jargon. Not a maze of dashboards. Just clarity you can act on immediately.",
          ],
        },
        {
          id: "closing",
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
