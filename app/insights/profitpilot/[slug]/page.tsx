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

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return listPostsByHub("profitpilot").map((post) => ({
    slug: post.slug,
  }));
}

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

export default function ProfitPilotArticlePage({
  params,
  searchParams,
}: {
  params: { slug?: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const hub = getHub("profitpilot");

  const debug =
    (typeof searchParams?.debug === "string" && searchParams.debug === "1") ||
    (Array.isArray(searchParams?.debug) && searchParams?.debug?.[0] === "1");

  const requestedSlug = safeDecode((params?.slug ?? "").trim());

  const availablePosts = listPostsByHub("profitpilot");
  const availableSlugs = availablePosts.map((p) => p.slug);

  const post = requestedSlug
    ? getPostBySlug("profitpilot", requestedSlug)
    : null;

  if (!post) {
    return (
      <Container>
        <div className="py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold text-slate-900">
              Article not found
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This article isn’t published (or the link is wrong).
            </p>

            {debug ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  Debug (?debug=1)
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  params.slug:{" "}
                  <span className="font-semibold text-slate-900">
                    {params?.slug ? params.slug : "(missing)"}
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  requestedSlug (decoded):{" "}
                  <span className="font-semibold text-slate-900">
                    {requestedSlug || "(empty)"}
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  availableSlugs:{" "}
                  <span className="font-semibold text-slate-900">
                    {availableSlugs.join(", ") || "(none)"}
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  match:{" "}
                  <span
                    className={`font-semibold ${
                      post ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {post ? "FOUND ✅" : "NOT FOUND ❌"}
                  </span>
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/insights/profitpilot"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Back to ProfitPilot hub
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
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
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Talk to us
              </Link>
              <Link
                href="/insights/profitpilot"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Back to hub
              </Link>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="relative h-[220px] w-full sm:h-[320px] md:h-[380px]">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1100px"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${post.accent}`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
            </div>
          </div>

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
                        The point is:{" "}
                        <span className="font-semibold text-slate-900">
                          “We made {s.numbers.made} today.”
                        </span>
                      </p>
                    </div>
                  ) : null}

                  {s.cta ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm font-semibold text-slate-900">
                        {s.cta.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">{s.cta.body}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                        >
                          Book a quick chat
                        </Link>
                        <Link
                          href="/insights/profitpilot"
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
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
            "You close for the day. Sales happened. Money moved. Then the real question shows up:",
            "“Did we actually make money today… or did we just stay busy?”",
            "If your honest answer is “I’m not sure”, you’re not alone — and you’re not doing anything wrong.",
          ],
          callout: {
            title: "The goal",
            body: (
              <>
                At the end of each day, we should be able to say:{" "}
                <span className="font-semibold text-slate-900">
                  “We made ₦___ today.”
                </span>
              </>
            ),
          },
        },
        {
          id: "why-its-hard",
          label: "Why it happens",
          title: "Why today’s profit feels impossible to know",
          paragraphs: [
            "Most business owners end the day with data — but not clarity.",
            "Sales alerts and bank balance don’t equal profit.",
            "Profit is what you earned today minus what today truly cost you.",
          ],
          bullets: [
            "Sales is not profit (you can sell and still lose money).",
            "Bank balance is not performance (cash moves for many reasons).",
            "Monthly reports are too late for daily decisions.",
            "Expenses are often scattered (WhatsApp, notes, memory).",
          ],
        },
        {
          id: "what-clarity-looks-like",
          label: "What good looks like",
          title: "What a clear day-end view should show you",
          paragraphs: [
            "A good system feels like checking the score after a match.",
            "Simple enough to understand fast — accurate enough to trust.",
          ],
          numbers: {
            income: "₦120,000",
            expenses: "₦81,500",
            made: "₦38,500",
          },
        },
        {
          id: "conclusion",
          label: "Wrap up",
          title: "So… did we make money today?",
          paragraphs: [
            "That question should not feel scary. It should feel normal.",
            "You deserve clarity that matches your pace — daily, not “maybe at month end.”",
          ],
          cta: {
            title: "Want this level of clarity for your business?",
            body: "Send us a message — we’ll show you the simplest way to track daily profit clearly, and what ProfitPilot can automate for you.",
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
