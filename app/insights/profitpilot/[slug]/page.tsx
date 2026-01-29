"use client";

// app/insights/profitpilot/[slug]/page.tsx
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
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

function normalizeSlug(raw: unknown): string {
  if (!raw) return "";
  if (Array.isArray(raw)) return safeDecode(String(raw[0] ?? "")).trim();
  return safeDecode(String(raw)).trim();
}

export default function ProfitPilotArticlePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") === "1";

  // ✅ Guaranteed way to read dynamic route segment in production
  const requestedSlug = useMemo(() => normalizeSlug((params as any)?.slug), [params]);

  const hub = getHub("profitpilot");
  const hubTitle = hub?.title || "ProfitPilot";

  const availablePosts = listPostsByHub("profitpilot");
  const availableSlugs = availablePosts.map((p) => p.slug);

  const post = requestedSlug
    ? getPostBySlug("profitpilot", requestedSlug)
    : null;

  const content = post ? getProfitPilotArticleContent(post) : null;

  // Cover image fallback (in case you deleted the file in /public)
  const [coverOk, setCoverOk] = useState(true);

  if (!post || !content) {
    return (
      <Container>
        <div className="py-16">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold text-slate-900">
              Article not found
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This article isn’t published (or the link is wrong).
            </p>

            {debug ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Debug (temporary)
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

  return (
    <main className="bg-white text-slate-900">
      <Container>
        <div className="py-10 sm:py-12">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/insights"
              className="font-semibold text-slate-600 hover:text-slate-900"
            >
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

          {/* Cover (safe fallback if image is missing) */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="relative h-[220px] w-full sm:h-[320px] md:h-[380px]">
              {post.coverImage && coverOk ? (
                <>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => setCoverOk(false)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${post.accent}`} />
              )}
            </div>
          </div>

          {/* Body (NO sidebar / NO “On this page”) */}
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
                        What “good” looks like (real example numbers):
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <NumberCard
                          label="Income today"
                          value={s.numbers.income}
                          note="Money earned today."
                        />
                        <NumberCard
                          label="Expenses today"
                          value={s.numbers.expenses}
                          note="Costs triggered today."
                        />
                        <NumberCard
                          label="You made (today)"
                          value={s.numbers.made}
                          note="The decision-ready result."
                        />
                      </div>

                      <p className="mt-4 text-sm text-slate-700">
                        The whole point is the sentence:{" "}
                        <span className="font-semibold text-slate-900">
                          “You made {s.numbers.made} today.”
                        </span>
                      </p>
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
  // ✅ Your main article (filled “What good looks like” with real numbers)
  if (post.slug === "why-most-smes-dont-actually-know-how-much-they-made-today") {
    return {
      sections: [
        {
          id: "hook",
          label: "Start here",
          title: "Why this simple question breaks most SME tools",
          paragraphs: [
            "At the end of the day, SME owners need one thing: clarity.",
            "But most tools show bank balance, sales alerts, and long reports — none of those answer the real question: “Did we actually make money today?”",
          ],
          bullets: [
            "Sales is not profit (you can sell and still lose money).",
            "Bank balance is not performance (cash moves for many reasons).",
            "Monthly reports are too late for daily decisions.",
          ],
          callout: {
            title: "The real daily question",
            body: (
              <>
                SMEs don’t need more accounting screens. They need a daily decision
                answer:{" "}
                <span className="font-semibold text-slate-900">
                  “Did we make money today — yes or no — and why?”
                </span>
              </>
            ),
          },
        },
        {
          id: "what-good-looks-like",
          label: "What good looks like",
          title: "The 1% answer SMEs deserve",
          paragraphs: [
            "A clean daily view should feel obvious and usable.",
            "No jargon. No long dashboards. Just a simple daily result you can act on.",
          ],
          numbers: {
            income: "₦120,000",
            expenses: "₦81,500",
            made: "₦38,500",
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
