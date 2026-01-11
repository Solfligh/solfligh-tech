import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import LeadForm from "@/app/components/LeadForm";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "Investor Relations for SOLFLIGH TECH — building scalable software products, automation, and intelligent systems.",
  alternates: { canonical: "/investors" },
};

const highlights = [
  {
    title: "Scalable product vision",
    desc: "We build reusable systems and product lines that can expand into multiple markets and verticals.",
  },
  {
    title: "Execution-focused engineering",
    desc: "Fast iteration, clean architecture, and delivery discipline  designed for real production.",
  },
  {
    title: "AI + automation advantage",
    desc: "We integrate automation and intelligent agents to reduce cost, increase speed, and improve operational output.",
  },
  {
    title: "Long-term partnerships",
    desc: "We collaborate with founders and organizations as a long-term technology partner, not a short-term vendor.",
  },
];

const focusAreas = [
  "Enterprise software & platforms",
  "AI automation and intelligent agents",
  "Fintech and business operations tooling",
  "Workflow optimization for SMEs and teams",
  "Digital infrastructure and product co-development",
];

export default function InvestorsPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Investors • Growth"
        title="Investor Relations"
        subtitle="SOLFLIGH TECH is building modern software, automation systems, and scalable digital products. We welcome investor conversations aligned with long-term growth and responsible execution."
        actions={
          <>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Contact Us
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              Partner With Us
            </Link>
          </>
        }
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {highlights.map((h) => (
          <div key={h.title} className="card-premium p-6">
            <div className="text-base font-bold text-slate-950">{h.title}</div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{h.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Focus areas</div>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Current areas where we’re building and expanding.
          </p>

          <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-800">
            {focusAreas.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-sky-300 bg-sky-50 p-4">
            <div className="text-sm font-bold text-sky-900">Request materials</div>
            <div className="mt-1 text-xs font-semibold text-slate-800">
              We can share a brief investor overview and product roadmap on request.
            </div>
          </div>
        </div>

        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Investor inquiry</div>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Send a note with your firm, investment focus, and what you’d like to review.
          </p>

          <LeadForm kind="investor" includeFirm buttonText="Send Investor Inquiry" />
        </div>
      </div>
    </Container>
  );
}
