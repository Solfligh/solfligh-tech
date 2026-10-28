import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "AI",
  description:
    "Where SOLFLIGH TECH uses AI today, and what is planned: AI inside FXCopilot now, and a shared multi-provider AI layer planned for Solfligh Cloud but not built yet.",
  alternates: { canonical: "/ai" },
};

const productAI = [
  {
    name: "jèrè",
    desc: "Works out your estimated profit from the sales, costs and expenses you record, and builds its Business check-up from fixed rules, so it never guesses a number.",
  },
  {
    name: "FXCopilot",
    desc: "AI-assisted decision support that validates trade context, risk, and assumptions before execution not signals or predictions.",
  },
  {
    name: "RebirthAgro",
    desc: "In development AI-driven agricultural insight is planned as part of the initial release, not yet live.",
  },
];

export default function AIPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="AI • Capability"
        title="AI as infrastructure, not a feature flag"
        subtitle="Today, AI runs inside FXCopilot. A shared AI layer inside Solfligh Cloud is planned but not built yet, so for now any product that uses AI calls its provider directly."
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-base font-bold text-slate-950">AI as a platform capability</div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Planned, not built yet
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-800">
          The plan for Solfligh Cloud is a routing and orchestration layer rather than a single
          foundation model bolted on: no single point of AI-provider failure, and each job routed
          to whichever model fits it on cost, quality, or latency, callable by autonomous agents as
          well as people. None of this exists yet: Solfligh Cloud has no AI endpoint today.
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
