// app/insights/profitpilot/why-most-smes-dont-actually-know-how-much-they-made-today/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{children}</p>;
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function NumberCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{note}</p>
    </div>
  );
}

type ArticleSection = {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: { title: string; body: React.ReactNode };
  numbers?: { income: string; expenses: string; made: string };
  cta?: { title: string; body: string };
};

export default function ProfitPilotArticleStaticPage() {
  const post = {
    title: "Why Most SMEs Don’t Actually Know How Much They Made Today",
    description:
      "Many small business owners end the day with activity, sales alerts, and a bank balance — but still can’t confidently answer one question: did we actually make money today?",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
    coverImage: "/insights/profitpilot/posts/why-made-today.jpg",
    accent: "from-sky-500/20 to-blue-500/10",
  };

  const sections: ArticleSection[] = [
    {
      id: "hook",
      label: "Start here",
      title: "As a small business owner, we’ve all felt this before",
      paragraphs: [
        "We close for the day. We’re tired. Sales happened. Money moved. People worked. Then the real question shows up:",
        "Did we actually make money today… or did we just stay busy?",
        "If our honest answer is “I’m not sure,” we’re not alone — and we’re not doing anything wrong. Most small businesses are running with tools that were never built to give daily profit clarity.",
      ],
      callout: {
        title: "The goal",
        body: (
          <>
            At the end of each day, we should be able to say one simple sentence with confidence:{" "}
            <span className="font-semibold text-slate-900">“We made ₦___ today.”</span>
          </>
        ),
      },
    },
    {
      id: "profit-vs-cash",
      label: "Get the meaning right",
      title: "Why “money came in” still doesn’t mean “we made profit”",
      paragraphs: [
        "When we check the business at night, most of us look at three things: sales, bank balance, and customer messages.",
        "Those signals are useful — but they don’t answer profit.",
        "Profit is what’s left after today’s income covers today’s real costs. And costs don’t only mean the cash we spent today — it includes things like inventory used, delivery costs triggered by today’s sales, card charges, staff time, and everyday operating expenses.",
      ],
      bullets: [
        "A business can have strong sales and still lose money (pricing, wastage, high costs).",
        "A business can have cash in the bank and still be unprofitable (debt, deposits, unpaid expenses).",
        "A business can be profitable and still feel “broke” (customers owe, stock was purchased, cash timing).",
      ],
    },
    {
      id: "why-its-hard",
      label: "Why it happens",
      title: "Why daily profit is hard to see in real life",
      paragraphs: [
        "Most SMEs don’t lack effort — we lack a simple daily system.",
        "Here’s what usually happens: income is tracked (sometimes). Expenses are scattered. And decisions are made from memory or vibes.",
        "The result is confusion. We feel busy, but we can’t measure performance daily.",
      ],
      bullets: [
        "Sales records live in different places (POS, bank alerts, WhatsApp, notebooks).",
        "Expenses happen in small, frequent chunks (fuel, data, staff lunch, deliveries, supplies).",
        "Some costs don’t feel like “today’s costs” but they were triggered by today’s activity.",
        "Monthly reports come too late — daily decisions need daily clarity.",
      ],
    },
    {
      id: "what-clarity-looks-like",
      label: "What good looks like",
      title: "What a clean day-end view should show (in 10 seconds)",
      paragraphs: [
        "A good system shouldn’t make us feel like we’re doing accounting.",
        "It should feel like checking the score after a match — simple, quick, and decision-ready.",
        "At minimum, we need three numbers that tell the story of today:",
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
      title: "A practical daily routine any small business can run",
      paragraphs: [
        "We don’t need complex finance to be clear. We need consistency.",
        "Here’s a simple routine that works even if we’re starting from scratch:",
      ],
      bullets: [
        "Capture today’s income (sales, transfers, POS receipts) in one place.",
        "Capture today’s expenses (even the small ones). Don’t trust memory.",
        "Separate “profit” from “cash movement.” Treat them as different questions.",
        "End the day with one sentence: “We made ₦___ today.”",
      ],
      callout: {
        title: "If we do only one thing",
        body: (
          <>
            Pick one place to record daily numbers (even a simple sheet) and make it non-negotiable for 14 days.
            Clarity improves fast when the habit becomes normal.
          </>
        ),
      },
    },
    {
      id: "where-profitpilot-fits",
      label: "For solution-aware readers",
      title: "Where ProfitPilot fits (without changing how we run the business)",
      paragraphs: [
        "Once the routine is clear, the next step is reducing manual work and mistakes.",
        "That’s where ProfitPilot helps: it keeps daily income and expenses organized, calculates the day-end result automatically, and gives a clean daily view without accounting jargon.",
        "The goal isn’t more “reports.” The goal is clarity that supports better pricing, better spending decisions, and better peace of mind.",
      ],
      bullets: [
        "Daily “You made today” view (profit, not confusion).",
        "Clean separation between profit and cash movement.",
        "Simple categories that match real SME behavior.",
        "A clear record we can trust when we want to grow or get funding later.",
      ],
    },
    {
      id: "conclusion",
      label: "Wrap up",
      title: "We deserve daily clarity — not end-of-month surprises",
      paragraphs: [
        "That question — “did we make money today?” — should not feel scary.",
        "It should feel normal.",
        "When we can measure today clearly, we stop guessing, we stop arguing with numbers, and we start making calmer decisions.",
      ],
      cta: {
        title: "Want help setting this up the simple way?",
        body: "Send us a message. We’ll show a clean daily profit setup that fits your business — and what ProfitPilot will automate for you.",
      },
    },
  ];

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
            <Link href="/insights/profitpilot" className="font-semibold text-slate-600 hover:text-slate-900">
              ProfitPilot
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

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{post.description}</p>

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
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="space-y-4">
                  <SectionLabel>{s.label}</SectionLabel>

                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{s.title}</h2>

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

                  {s.callout ? <Callout title={s.callout.title}>{s.callout.body}</Callout> : null}

                  {s.numbers ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <p className="text-sm font-semibold text-slate-900">Example (simple, decision-ready):</p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <NumberCard label="Income today" value={s.numbers.income} note="What came in today." />
                        <NumberCard label="Expenses today" value={s.numbers.expenses} note="What today triggered." />
                        <NumberCard label="We made (today)" value={s.numbers.made} note="The result we can act on." />
                      </div>
                      <p className="mt-4 text-sm text-slate-700">
                        This is the sentence we want to confidently say every day:{" "}
                        <span className="font-semibold text-slate-900">“We made {s.numbers.made} today.”</span>
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
