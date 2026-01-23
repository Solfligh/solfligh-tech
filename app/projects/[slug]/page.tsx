// app/projects/[slug]/page.tsx
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import ProjectMediaCarousel from "@/app/components/ProjectMediaCarousel";
import { listProjects } from "@/app/lib/projectsStore";
import { notFound, redirect } from "next/navigation";

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
  updatedAt?: string;
};

function normalizeMedia(projectName: string, media: any[]) {
  const safe = Array.isArray(media) ? media : [];

  const out = safe
    .filter(
      (m) =>
        m &&
        typeof m.src === "string" &&
        (m.type === "image" || m.type === "video")
    )
    .map((m) => {
      if (m.type === "video") {
        return {
          type: "video" as const,
          src: String(m.src),
          // supports your projects.json "thumbnail"
          thumbnail: m.thumbnail ? String(m.thumbnail) : undefined,
          alt: m.alt ? String(m.alt) : `${projectName} demo video`,
        };
      }

      return {
        type: "image" as const,
        src: String(m.src),
        alt: m.alt ? String(m.alt) : `${projectName} image`,
        thumbnail: m.thumbnail ? String(m.thumbnail) : undefined,
      };
    });

  // fallback if no media exists
  if (out.length === 0) {
    return [
      {
        type: "image" as const,
        src: "/projects/video-poster.jpg",
        alt: "Media coming soon",
      },
    ];
  }

  return out;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug;

  // Special case: FXCO-PILOT is external
  if (slug === "fxco-pilot") {
    redirect("https://fxco-pilot.solflightech.org");
  }

  let projects: AnyProject[] = [];
  try {
    const all = await listProjects();
    projects = (all as AnyProject[]) || [];
  } catch {
    projects = [];
  }

  const project = projects.find((p) => p?.published && p?.slug === slug);
  if (!project) notFound();

  const name = project.name || "Untitled project";
  const status = project.status || "Upcoming";
  const statusColor =
    project.statusColor || "bg-slate-100 text-slate-700 border-slate-200";

  const description = project.description || "";
  const highlights = Array.isArray(project.highlights) ? project.highlights : [];

  const problem = project.problem || "";
  const solution = project.solution || "";
  const keyFeatures = Array.isArray(project.keyFeatures) ? project.keyFeatures : [];
  const roadmap = Array.isArray(project.roadmap) ? project.roadmap : [];
  const techStack = Array.isArray(project.techStack) ? project.techStack : [];

  const mediaItems = normalizeMedia(name, project.media || []);

  return (
    <main className="bg-white text-slate-900">
      <section className="py-16 sm:py-20">
        <Container>
          <PageHeader
            level={1}
            badge="Project"
            title={name}
            subtitle={description}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_.7fr]">
            {/* Media */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
              <ProjectMediaCarousel
                items={mediaItems}
                ariaLabel={`${name} media`}
                className="h-[280px] sm:h-[420px]"
                roundedClassName="rounded-none"
                autoPlay={false}
              />
            </div>

            {/* Summary card */}
            <aside className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">Overview</h2>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
                >
                  {status}
                </span>
              </div>

              {highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 grid gap-4">
                {problem ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">Problem</p>
                    <p className="mt-1 text-sm text-slate-700">{problem}</p>
                  </div>
                ) : null}

                {solution ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">Solution</p>
                    <p className="mt-1 text-sm text-slate-700">{solution}</p>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

          {/* Details */}
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-900">Key Features</h3>
              {keyFeatures.length ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {keyFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600">Coming soon.</p>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-900">Roadmap</h3>
              {roadmap.length ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {roadmap.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600">Coming soon.</p>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-900">Tech Stack</h3>
              {techStack.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">Coming soon.</p>
              )}
            </section>
          </div>
        </Container>
      </section>
    </main>
  );
}
