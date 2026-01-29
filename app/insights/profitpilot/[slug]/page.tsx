// app/insights/profitpilot/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import {
  getHub,
  getPostBySlug,
  type InsightPost,
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

function Card({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="relative flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
      </div>
    </div>
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

function Divider() {
  return (
    <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
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
}: {
  params: { slug: string };
}) {
  const hub = getHub("profitpilot");
  const post = getPostBySlug("profitpilot", params.slug);

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
      {/* Subtle page background */}
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
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div className="space-y-5">
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

              {/* Right hero mini-card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-200/30 blur-2xl" />
                  <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-blue-200/20 blur-2xl" />
                </div>

                <div className="relative space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    In one sentence
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    SMEs struggle to answer “how much did we make today?” because
                    most tools show sales and balances — not daily performance.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        What you actually need
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        A daily “You made ₦X” answer
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Simple. Reliable. Decision-ready.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        What most people use
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        Bank balance + sales
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Useful… but not the answer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover image */}
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

            {/* Article (NO SIDEBAR, NO “On this page”) */}
            <article className="mx-auto mt-10 max-w-3xl space-y-10">
              {/* Quick takeaways */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card
                  title="Today is the real decision unit"
                  desc="SMEs don’t manage quarterly. They manage what happened today — so they can choose what to do tomorrow."
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path
                        d="M8 7h8M8 12h8M8 17h8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 7h.01M5 12h.01M5 17h.01"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
                <Card
                  title="Sales ≠ profit"
                  desc="You can have a strong sales day and still lose money once delivery, expenses, and leakage show up."
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path
                        d="M7 16V8m5 10V6m5 12v-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
              </div>

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
                  The 1% answer SMEs deserve (with real numbers)
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

                  <p className="mt-4 text-sm text-slate-700">
                    That’s the entire point:{" "}
                    <span className="font-semibold text-slate-900">
                      “You made ₦38,500 today.”
                    </span>
                  </p>
                </div>
              </section>

              <Divider />

              <section className="space-y-4">
                <SectionLabel>Wrap up</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  You’re not confused — you’re underserved
                </h2>

                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                  <p className="text-sm leading-relaxed text-slate-700">
                    SMEs don’t fail because they don’t work hard. They fail
                    because they make decisions without clear daily visibility.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    ProfitPilot exists to make “today” clear — so you stop
                    guessing and start steering.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/insights/profitpilot"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    More ProfitPilot articles
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    Contact us
                  </Link>
                </div>
              </section>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
