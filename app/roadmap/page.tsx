import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What's live today at SOLFLIGH TECH, and what's actively in development. Nothing here is aspirational — if it's listed as live, you can use it today.",
  alternates: { canonical: "/roadmap" },
};

const liveToday = [
  { name: "ProfitPilot", note: "Live / near launch — payroll & business automation." },
  { name: "FXCopilot", note: "Live — FX decision support." },
  {
    name: "Services (all lines)",
    note: "Live — build, AI & automation, infrastructure, design, and run.",
  },
];

const inDevelopment = [
  {
    name: "RebirthAgro",
    note: "In development — agriculture technology platform, not yet released.",
  },
  {
    name: "Solfligh Cloud — public developer access",
    note: "In development — powers our own products today; external API access, SDKs, and docs are not yet available.",
  },
  {
    name: "Payroll, Compliance, Business & Document APIs",
    note: "In development — the first Cloud module set planned for public access.",
  },
  {
    name: "Identity Cloud, AI Cloud, Data Cloud",
    note: "Not yet started — planned unbundling of Core Platform services.",
  },
  { name: "Marketplace", note: "Not yet started — gated on Cloud public access." },
];

export default function RoadmapPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Roadmap • Status"
        title="What's live, and what's next"
        subtitle="This page is a trust instrument, not a marketing page — nothing appears under Live Today unless you can use it right now."
        actions={
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
          >
            Talk to us
          </Link>
        }
      />

      <div className="mt-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Live today
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {liveToday.map((item) => (
            <div key={item.name} className="card-premium p-6">
              <div className="text-base font-bold text-slate-950">{item.name}</div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          In development
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {inDevelopment.map((item) => (
            <div key={item.name} className="card-premium p-6">
              <div className="text-base font-bold text-slate-950">{item.name}</div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">Want the full picture?</div>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              See what Solfligh Cloud is and where it&apos;s headed.
            </p>
          </div>
          <Link
            href="/cloud"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
          >
            Solfligh Cloud
          </Link>
        </div>
      </div>
    </Container>
  );
}
