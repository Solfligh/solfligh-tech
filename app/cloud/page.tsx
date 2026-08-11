import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Solfligh Cloud",
  description:
    "Solfligh Cloud is the shared infrastructure layer SOLFLIGH TECH's products are built on auth, billing, data, and AI, available to our own products today and to external developers as it matures.",
  alternates: { canonical: "/cloud" },
};

const coreServices = [
  {
    name: "Core Platform",
    desc: "Authentication, identity, authorization, multi-tenancy, API gateway, billing, and usage metering the shared foundation every product and future API sits on.",
  },
  {
    name: "Data Infrastructure",
    desc: "A managed pipeline for reference and compliance-grade data, versioned and effective-dated so it stays queryable and correct over time.",
  },
  {
    name: "AI",
    desc: "Multi-provider AI routing and orchestration, used both inside our own products and, in time, as a directly consumable capability.",
  },
  {
    name: "Developer Platform / API Gateway",
    desc: "Documentation, SDKs, and a developer dashboard the entry point for anyone building on Solfligh Cloud directly.",
  },
  {
    name: "Marketplace",
    desc: "A future home for third-party APIs, models, and data curated and invite-only at launch, opening up as trust and tooling mature.",
  },
];

const availableToday = [
  "Core Platform services power ProfitPilot and FXCopilot in production today.",
  "Data infrastructure is live internally, feeding the products already shipping on it.",
];

const planned = [
  "Public developer access to Solfligh Cloud (API keys, dashboard, docs) not yet available.",
  "Marketplace for third-party APIs, models, and data curated launch planned, not yet started.",
  "Standalone Identity, AI, and Data Cloud services future unbundling of Core Platform capabilities.",
];

export default function CloudPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Solfligh Cloud • Platform"
        title="The infrastructure layer our products are built on"
        subtitle="Solfligh Cloud is shared infrastructure identity, billing, data, and AI built once and reused across every product we ship. It isn't a fourth product; it's the foundation the others stand on."
        actions={
          <>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              See it in production
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Talk to us about early access
            </Link>
          </>
        }
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {coreServices.map((s) => (
          <div key={s.name} className="card-premium p-6">
            <div className="text-base font-bold text-slate-950">{s.name}</div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Available today vs. planned honest status split */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card-premium p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Available today
          </div>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-800">
            {availableToday.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-premium p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Planned
          </div>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-800">
            {planned.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              Public developer access isn&apos;t open yet
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              Today, Solfligh Cloud powers our own products. External API access, SDKs, and docs are
              on the roadmap see current status for specifics.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
          >
            View Roadmap
          </Link>
        </div>
      </div>
    </Container>
  );
}
