import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectGallery from "@/app/components/ProjectGallery";
import { type MediaItem } from "@/app/components/ProjectMediaCarousel";

const media: MediaItem[] = [
  {
    type: "video",
    src: "/projects/profitfx/demo.mp4",
    poster: "/projects/profitfx/demo-poster.jpg",
  },
  { type: "image", src: "/projects/profitfx/1.png", alt: "ProfitFX preview" },
  { type: "image", src: "/projects/profitfx/2.png", alt: "ProfitFX workflow" },
];

export default function ProfitFXPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              ← Back to projects
            </Link>
          </div>

          <PageHeader
            level={1}
            badge="Project"
            title="ProfitFX"
            subtitle="FX decision support and workflow automation — designed for clarity and speed."
            actions={
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                In Development
              </span>
            }
          />

          <div className="mt-10">
            <ProjectGallery title="ProfitFX" items={media} />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900">Problem</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Traders and teams often juggle multiple tools for analysis, notes, and execution workflows,
                making decisions slower and inconsistent.
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Solution</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                ProfitFX is being built to unify workflow: a clean interface, decision-support structure,
                and automation-friendly tooling that keeps focus on what matters.
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Key features</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "Workflow-first interface (fast navigation)",
                  "Decision support structure and journaling",
                  "Automation-ready modules",
                  "Team-friendly organization",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-900">Status</h3>
              <p className="mt-2 text-sm text-slate-600">
                In active development — UI and flows are being refined toward a demo-ready build.
              </p>

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Roadmap</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {["Finalize core flows", "Add automation features", "Release public demo"].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Tech stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Next.js", "Tailwind", "APIs", "Analytics"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Get updates
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  View all projects
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
