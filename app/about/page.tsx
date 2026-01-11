import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SOLFLIGH TECH  an innovation-driven technology partner building scalable software and AI automation systems.",
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    title: "Intelligence",
    desc: "We build systems that think  automation, agents, and decision support that reduce workload and increase speed.",
  },
  {
    title: "Engineering",
    desc: "Clean architecture, performance first builds, and scalable foundations designed for real production.",
  },
  {
    title: "Creativity",
    desc: "We turn ideas into real products with strong execution, thoughtful UI/UX, and practical problem-solving.",
  },
  {
    title: "Scale",
    desc: "From MVPs to mature platforms  we build software that grows with your users, your data, and your ambition.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="About • SOLFLIGH TECH"
        title="Innovation driven technology partner."
        subtitle="SOLFLIGH TECH is a general technology and innovation company offering software development, AI automation, intelligent agents, web and app development, and scalable digital solutions."
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
        {pillars.map((p) => (
          <div key={p.title} className="card-premium p-6">
            <div className="text-base font-bold text-slate-950">{p.title}</div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">Our approach</div>
            <div className="mt-2 text-sm font-semibold text-slate-800">
              Strategy → architecture → build → ship → iterate. We deliver like a product team, not
              a temporary vendor.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              View Services
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
