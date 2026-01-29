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

// ✅ BUILD STAMP (to confirm you’re seeing the latest deployment)
const BUILD_STAMP = "profitpilot-article-build-2026-01-29-v1";

// ✅ Helps Next prebuild known slugs and stabilize params behavior on Vercel
export const dynamicParams = true;

export function generateStaticParams() {
  const posts = listPostsByHub("profitpilot");
  return posts.map((p) => ({ slug: p.slug }));
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

function readSlug(
  params: Record<string, string | string[] | undefined> | undefined
) {
  if (!params) return "";

  const direct = params["slug"];
  if (typeof direct === "string") return safeDecode(direct.trim());
  if (Array.isArray(direct)) return safeDecode((direct[0] ?? "").trim());

  // Fallback: first param key (just in case)
  const keys = Object.keys(params);
  if (!keys.length) return "";
  const first = params[keys[0]];
  if (typeof first === "string") return safeDecode(first.trim());
  if (Array.isArray(first)) return safeDecode((first[0] ?? "").trim());

  return "";
}

export default function ProfitPilotArticlePage({
  params,
}: {
  params?: Record<string, string | string[] | undefined>;
}) {
  const hub = getHub("profitpilot");
  const hubTitle = hub?.title || "ProfitPilot";

  const requestedSlug = readSlug(params);

  const availablePosts = listPostsByHub("profitpilot");
  const availableSlugs = availablePosts.map((p) => p.slug);

  const post = requestedSlug
    ? getPostBySlug("profitpilot", requestedSlug)
    : null;

  // ✅ If NOT FOUND, ALWAYS show debug (no query string needed)
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

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">Debug</p>

              <p className="mt-2 text-sm text-slate-700">
                Build stamp:{" "}
                <span className="font-semibold text-slate-900">
                  {BUILD_STAMP}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-700">
                Params keys:{" "}
                <span className="font-semibold text-slate-900">
                  {params ? Object.keys(params).join(", ") || "(none)" : "(none)"}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-700">
                params.slug raw:{" "}
                <span className="font-semibold text-slate-900">
                  {params && "slug" in params ? String(params.slug) : "(missing)"}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-700">
                Requested slug (decoded):{" "}
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
                <span className="font-semibold text-rose-600">
                  NOT FOUND ❌
                </span>
              </p>
            </div>

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

          <div className="mt-2 text-xs text-slate-400">
            Build: {BUILD_STAMP}
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
          title: "As a small business owner, you’ve felt this before",
          paragraphs: [
            "We close for the day. We’re tired. Sales happened. Money moved. People worked.",
            "Then the real question shows up:",
            "“Did we actually make money today… or did we just stay busy?”",
            "If the honest answer is “I’m not sure,” you’re not alone — and you’re not doing anything wrong. Most businesses are running with tools that were never built to answer daily profit clearly.",
          ],
          callout: {
            title: "The daily goal",
            body: (
              <>
                At the end of each day, we should be able to say one simple sentence with confidence:{" "}
                <span className="font-semibold text-slate-900">“We made ₦___ today.”</span>
              </>
            ),
          },
        },
        {
          id: "why-its-hard",
          label: "Why it happens",
          title: "Why today’s profit feels hard to know",
          paragraphs: [
            "Most of us end the day with data — but not clarity.",
            "We check bank balance, sales alerts, and customer payments. Helpful… but those don’t answer profit.",
            "Profit is the difference between what we earned today and what today truly cost us. If our tools don’t show both clearly, we keep guessing.",
          ],
          bullets: [
            "Sales is not profit (we can sell and still lose money).",
            "Bank balance is not performance (cash moves for many reasons).",
            "Monthly reports are too late for daily decisions.",
            "Expenses are often scattered (notes, WhatsApp, memory).",
          ],
        },
        {
          id: "what-clarity-looks-like",
          label: "What good looks like",
          title: "What a clear day-end view should show us",
          paragraphs: [
            "A good system doesn’t make us feel like we’re doing accounting. It feels like checking the score after a match.",
            "We want something simple enough to understand fast — but accurate enough to trust.",
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
