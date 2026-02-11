import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import ReadingSlider from "./ReadingSlider";

export const metadata: Metadata = {
  title: "FXCO-Pilot AI Trade Validator: Decision Support Before You Enter a Forex Trade | SolFligh Tech",
  description:
    "FXCO-Pilot is an AI trade validator for forex traders built to reduce emotional entries and rule-breaking losses. Validate trade context, risk, and assumptions before execution.",
  alternates: { canonical: "/insights/fxco-pilot/ai-trade-validator" },
  openGraph: {
    title: "FXCO-Pilot AI Trade Validator (Forex Decision Support)",
    description:
      "Validate a trade before you click Buy/Sell. FXCO-Pilot focuses on context, risk, and discipline not signals or predictions.",
    url: "/insights/fxco-pilot/ai-trade-validator",
    type: "article",
    images: [
      {
        url: "/insights/fxco-pilot/cover.jpg",
        width: 1536,
        height: 599,
        alt: "FXCO-Pilot | AI Trade Validator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FXCO-Pilot AI Trade Validator",
    description:
      "A second brain before execution context, risk, and discipline. Not signals. Not predictions.",
    images: ["/insights/fxco-pilot/cover.jpg"],
  },
  keywords: [
    "forex trade validator",
    "AI trade validation",
    "forex risk management",
    "trading discipline",
    "revenge trading",
    "trade decision support",
    "forex trading psychology",
    "risk to reward",
    "market structure",
    "position sizing",
  ],
};

const APP_URL = "https://fxco-pilot.solflightech.org";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function ExtButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition";
  const primary = "bg-slate-900 text-white hover:bg-slate-800";
  const secondary = "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variant === "primary" ? primary : secondary}`}
    >
      {children} <span className="ml-2 text-slate-300">↗</span>
    </a>
  );
}

export default function FxcoPilotAiTradeValidatorArticlePage() {
  const publishedISO = "2026-02-11T00:00:00.000Z";
  const canonical = "https://solfightech.org/insights/fxco-pilot/ai-trade-validator";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "FXCO-Pilot AI Trade Validator: Decision Support Before You Enter a Forex Trade",
    description:
      "FXCO-Pilot is an AI trade validator for forex traders built to reduce emotional entries and rule-breaking losses. Validate trade context, risk, and assumptions before execution.",
    datePublished: publishedISO,
    dateModified: publishedISO,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "SolFligh Tech" },
    publisher: { "@type": "Organization", name: "SolFligh Tech" },
    image: "https://solfightech.org/insights/fxco-pilot/cover.jpg",
  };

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        {/* HERO */}
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:pt-14">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>Insights</Pill>
            <Pill>FXCO-Pilot</Pill>
            <Pill>Forex</Pill>
            <Pill>Decision Quality</Pill>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Validate the trade <span className="text-slate-600">before</span> you enter.
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                Most forex losses don’t come from not knowing how to trade. They come from{" "}
                <strong>breaking your own rules</strong>. FXCO-Pilot is built for the one moment that
                matters most: right before you click <em>Buy</em> or <em>Sell</em>.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ExtButton
                  href={`${APP_URL}/?utm_source=solflightech&utm_medium=insights&utm_campaign=ai_trade_validator&utm_content=cta_top`}
                >
                  Open FXCO-Pilot
                </ExtButton>

                <Link
                  href="/insights/fxco-pilot"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  FXCO-Pilot hub →
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold text-slate-500">Focus</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Discipline</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold text-slate-500">Output</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Explainable</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold text-slate-500">Not</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Signals</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/insights/fxco-pilot/cover.jpg"
                alt="FXCO-Pilot | AI Trade Validator"
                width={1536}
                height={599}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        {/* ✅ Lively slider replaces the “basic” long text */}
        <ReadingSlider />

        {/* Bottom CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">Decision checkpoint</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Validate your next trade before you pay for it.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200">
                  Use FXCO-Pilot right before execution to check context, risk, and assumptions so you
                  stop paying for emotional entries.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:min-w-[260px]">
                <ExtButton
                  href={`${APP_URL}/?utm_source=solflightech&utm_medium=insights&utm_campaign=ai_trade_validator&utm_content=cta_bottom`}
                >
                  Open FXCO-Pilot
                </ExtButton>

                <Link
                  href="/insights"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Back to Insights
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-sm">
            <Link href="/insights" className="font-semibold text-slate-700 hover:text-slate-900">
              ← Back to Insights
            </Link>
            <span className="text-slate-500">SolFligh Tech</span>
          </div>
        </section>
      </Container>
    </main>
  );
}
