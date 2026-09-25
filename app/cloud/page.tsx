import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Solfligh Cloud",
  description:
    "Solfligh Cloud is SOLFLIGH TECH's platform and infrastructure layer: identity, API keys, usage metering, and quotas. It runs in production today. Access is by invitation, and public developer access is not open yet.",
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
  "The platform is deployed and running in production.",
  "Identity, organizations, API keys, usage metering, and quotas are live on it.",
  "Access is by invitation. There is no public sign-up yet.",
];

const planned = [
  "Our own products moving onto the platform. None of them run on it today.",
  "Public developer access to Solfligh Cloud (self-serve API keys, dashboard, docs) not yet available.",
  "Marketplace for third-party APIs, models, and data curated launch planned, not yet started.",
  "Standalone Identity, AI, and Data Cloud services future unbundling of Core Platform capabilities.",
];

export default function CloudPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Solfligh Cloud • Platform"
        title="Our shared platform and infrastructure layer"
        subtitle="Solfligh Cloud is identity, API keys, usage metering, and quotas, built once so that everything we ship can reuse it instead of rebuilding it. It is not a fourth product. It runs in production today, and our own products have not moved onto it yet."
        actions={
          <>
            <Link
              href="/cloud/access"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Register for early access
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              Talk to us
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
              Solfligh Cloud runs in production, but access is by invitation. Our own products have
              not moved onto it yet, and self-serve API keys, SDKs, and docs are still being built.
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
