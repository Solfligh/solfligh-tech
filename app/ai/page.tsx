import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "AI",
  description:
    "AI at SOLFLIGH TECH is infrastructure, not a feature flag — used inside Solfligh Cloud and inside every product we build, built to be usable by people and by autonomous agents.",
  alternates: { canonical: "/ai" },
};

const productAI = [
  {
    name: "ProfitPilot",
    desc: "Automation that turns daily transaction data into clear, same-day profit clarity — no manual reconciliation.",
  },
  {
    name: "FXCopilot",
    desc: "AI-assisted decision support that validates trade context, risk, and assumptions before execution — not signals or predictions.",
  },
  {
    name: "RebirthAgro",
    desc: "In development — AI-driven agricultural insight is planned as part of the initial release, not yet live.",
  },
];

export default function AIPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="AI • Capability"
        title="AI as infrastructure, not a feature flag"
        subtitle="We use AI in two places: as a platform capability inside Solfligh Cloud, and inside each product's own automation. Both are built multi-provider by design — no single foundation-model dependency."
        actions={
          <>
            <Link
              href="/cloud"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              Solfligh Cloud
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              See it in our products
            </Link>
          </>
        }
      />

      <div className="mt-10 card-premium p-8">
        <div className="text-base font-bold text-slate-950">AI as a platform capability</div>
        <p className="mt-3 text-sm font-semibold text-slate-800">
          Inside Solfligh Cloud, AI is a routing and orchestration layer — not a single foundation
          model bolted on. That means resilience (no single point of AI-provider failure) and the
          ability to route to whichever model fits a given job on cost, quality, or latency. This
          layer is also being built to be callable by autonomous agents, not just people through a
          UI.
        </p>
      </div>

      <div className="mt-10">
        <div className="text-base font-bold text-slate-950">AI inside each product</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {productAI.map((p) => (
            <div key={p.name} className="card-premium p-6">
              <div className="text-base font-bold text-slate-950">{p.name}</div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              Have an AI automation need we haven&apos;t built yet?
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              Our Services team builds AI automation and intelligent agents for teams directly.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
          >
            See Services
          </Link>
        </div>
      </div>
    </Container>
  );
}
