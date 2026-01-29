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

export const dynamicParams = false;

export function generateStaticParams() {
  return listPostsByHub("profitpilot").map((p) => ({ slug: p.slug }));
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
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

function cleanSlug(value: string) {
  return safeDecode(value).replace(/\s+/g, " ").trim();
}

export default function ProfitPilotArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const hub = getHub("profitpilot");
  const hubTitle = hub?.title || "ProfitPilot";

  const requestedSlug = cleanSlug(params?.slug ?? "");
  const availableSlugs = listPostsByHub("profitpilot").map((p) => p.slug);

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

            {/* ✅ Only shows when you add ?debug=1 */}
            {debug ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">Debug (only when ?debug=1)</p>
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

                  {s.callout ? <Callout title={s.callout.title}>{s.callout.body}</Callout> : null}

                  {s.numbers ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <p className="text-sm font-semibold text-slate-900">
                        Proof with real numbers (simple example):
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <NumberCard label="Income today" value={s.numbers.income} note="Money earned today." />
                        <NumberCard label="Expenses today" value={s.numbers.expenses} note="Costs triggered today." />
                        <NumberCard label="You made (today)" value={s.numbers.made} note="Decision-ready result." />
                      </div>
                      <p className="mt-4 text-sm text-slate-700">
                        The point is one sentence:{" "}
                        <span className="font-semibold text-slate-900">
                          “You made {s.numbers.made} today.”
                        </span>
                      </p>
                    </div>
                  ) : null}
                </section>
              ))}

              {/* End CTA */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-base font-semibold text-slate-900">
                  Want “today” to be clear in your business?
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  We build simple SME dashboards that show what you made — without accounting confusion.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/insights/profitpilot"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Back to ProfitPilot hub
                  </Link>
                </div>
              </div>
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
          title: "The question every SME gets — and too few can answer",
          paragraphs: [
            "If someone asked you, “How much profit did you make today?”, there’s a good chance your answer would be: “I’ll know at month end,” “Let me check my bank balance,” or “We made sales, so probably good.”",
            "That’s not because you’re doing anything wrong — it’s because most tools were built for reporting, not daily decisions.",
          ],
          callout: {
            title: "The real problem",
            body: (
              <>
                SMEs don’t need more reports. They need one daily decision answer:{" "}
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
            "A good daily dashboard is boring in the best way: it gives a clear answer you can act on immediately.",
            "Here’s what that looks like when you remove jargon and keep only decision information:",
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
