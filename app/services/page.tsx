import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SOLFLIGH TECH services: web/software development, mobile apps, AI automation, intelligent agents, and workflow optimization.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    title: "Software & Web Development",
    desc: "Modern websites and platforms built with clean architecture, performance first delivery, and scalable foundations.",
  },
  {
    title: "Mobile & Application Development",
    desc: "Mobile and cross platform applications designed for reliability, speed, and long-term growth.",
  },
  {
    title: "AI Automation & Intelligent Agents",
    desc: "Automation pipelines and intelligent agents that reduce workload, accelerate operations, and improve decision making.",
  },
  {
    title: "Digital Systems & Workflow Optimization",
    desc: "Operational systems, dashboards, integrations, and internal tools that keep teams efficient and measurable.",
  },
  {
    title: "Technology Consulting & Partnerships",
    desc: "Product strategy, system design, audits, and long-term technical partnerships to help you ship with confidence.",
  },
];

export default function ServicesPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Services • Delivery"
        title="What we deliver"
        subtitle="SOLFLIGH TECH delivers modern software, automation, and scalable digital systems  built with clean architecture and product-grade execution."
        actions={
          <>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Contact Us
            </Link>
          </>
        }
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.title} className="card-premium p-6">
            <div className="text-base font-bold text-slate-950">{s.title}</div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{s.desc}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Strategy", "Build", "Launch", "Iterate"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              Want SOLFLIGH TECH to build with you?
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-800">
              We’re open to projects, contracts, and long-term partnerships.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/partner"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              Partner With Us
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
