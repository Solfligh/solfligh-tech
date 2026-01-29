// app/insights/profitpilot/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import {
  getHub,
  getPostBySlug,
  listPostsByHub,
} from "@/app/lib/insightsStore";

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
  return (
    <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-sky-50 p-5 shadow-sm">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      </div>
      <div className="relative">
        <p className="text-sm font-bold text-slate-950">{title}</p>
        <div className="mt-2 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{note}</p>
    </div>
  );
}

export default function ProfitPilotArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const hub = getHub("profitpilot");

  const requestedSlug = (params?.slug ?? "").trim();
  const post = requestedSlug ? getPostBySlug("profitpilot", requestedSlug) : null;

  const debugEnabled = searchParams?.debug === "1";
  const availableSlugs = listPostsByHub("profitpilot").map((p) => p.slug);

  // ✅ PINPOINT PANEL
  // If this panel shows requestedSlug correctly, routing is fine.
  // If postFound=false, the store lookup is the problem.
  const DebugPanel = debugEnabled ? (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Debug (only when ?debug=1)
      </p>

      <div className="mt-3 grid gap-2 text-sm text-slate-700">
        <div>
          <span className="font-semibold text-slate-900">requestedSlug:</span>{" "}
          <span className="font-mono">{requestedSlug || "(empty)"}</span>
        </div>

        <div>
          <span className="font-semibold text-slate-900">postFound:</span>{" "}
          {post ? "true ✅" : "false ❌"}
        </div>

        <div>
          <span className="font-semibold text-slate-900">availableSlugs:</span>{" "}
          <span className="font-mono">
            {availableSlugs.length ? availableSlugs.join(", ") : "(none)"}
          </span>
        </div>
      </div>
    </div>
  ) : null;

  if (!post) {
    return (
      <Container>
        <div className="py-16">
          {DebugPanel}

          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold text-slate-900">
              Article not found
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This article isn’t published (or the link is wrong).
            </p>

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
            {DebugPanel}

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

            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>{post.tag}</Pill>
                <Pill>{post.readingTime}</Pill>
                <Pill>{post.dateLabel}</Pill>
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
                  Back to hub
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Contact us
                </Link>
              </div>
            </div>

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

            <article className="mx-auto mt-10 max-w-3xl space-y-10">
              <section className="space-y-4">
                <SectionLabel>Start here</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  If you run an SME, this question is harder than it should be
                </h2>

                <Callout title="The daily question">
                  If someone asked you:{" "}
                  <span className="font-semibold text-slate-900">
                    “How much profit did you make today?”
                  </span>{" "}
                  many SME owners can’t answer confidently — not because they’re
                  careless, but because their tools don’t show daily performance.
                </Callout>
              </section>

              <Divider />

              <section className="space-y-4">
                <SectionLabel>What good looks like</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  The answer SMEs deserve
                </h2>

                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                  <p className="text-sm font-semibold text-slate-900">
                    At end of day, an SME should see:
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <NumberCard
                      label="Income today"
                      value="₦120,000"
                      note="What was earned today."
                    />
                    <NumberCard
                      label="Expenses today"
                      value="₦81,500"
                      note="What today triggered."
                    />
                    <NumberCard
                      label="You made (today)"
                      value="₦38,500"
                      note="The decision-ready result."
                    />
                  </div>
                </div>
              </section>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
