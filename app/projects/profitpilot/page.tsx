// app/projects/profitpilot/page.tsx
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectGallery from "@/app/components/ProjectGallery";
import { listProjects } from "@/app/lib/projectStore";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type AnyProject = {
  slug?: string;
  name?: string;
  status?: string;
  statusColor?: string;
  description?: string;
  highlights?: string[];
  ctaLabel?: string;
  href?: string;
  published?: boolean;
  media?: any[];

  problem?: string;
  solution?: string;
  keyFeatures?: string[];
  roadmap?: string[];
  techStack?: string[];
};

function asString(x: any, fallback = ""): string {
  return typeof x === "string" ? x : fallback;
}
function asStringArray(x: any): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)) : [];
}

export default async function ProfitPilotPage() {
  const slug = "profitpilot";

  const projects = (await listProjects()) as AnyProject[];
  const project = projects.find((p) => p?.published && p?.slug === slug);

  if (!project) notFound();

  const name = asString(project.name, "ProfitPilot");
  const status = asString(project.status, "Upcoming");
  const statusColor = asString(
    project.statusColor,
    "bg-slate-100 text-slate-700 border-slate-200"
  );
  const description = asString(project.description, "");
  const highlights = asStringArray(project.highlights);

  const problem = asString(project.problem, "");
  const solution = asString(project.solution, "");
  const keyFeatures = asStringArray(project.keyFeatures);
  const roadmap = asStringArray(project.roadmap);
  const techStack = asStringArray(project.techStack);

  const media = (Array.isArray(project.media) ? project.media : []) as any[];

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
            title={name}
            subtitle={description}
            actions={
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
              >
                {status}
              </span>
            }
          />

          <div className="mt-10">
            <ProjectGallery title={name} items={media as any} />
          </div>

          {/* Case Study */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900">Problem</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {problem || "Coming soon."}
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Solution</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {solution || "Coming soon."}
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Key features</h2>
              {keyFeatures.length ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {keyFeatures.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600">Coming soon.</p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-900">Highlights</h3>
              {highlights.length ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {highlights.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Coming soon.</p>
              )}

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Roadmap</h3>
              {roadmap.length ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {roadmap.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Coming soon.</p>
              )}

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Tech stack</h3>
              {techStack.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Coming soon.</p>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Request a demo
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
