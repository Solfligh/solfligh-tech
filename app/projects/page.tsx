// app/projects/page.tsx
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectMediaCarousel from "@/app/components/ProjectMediaCarousel";
import { listProjects } from "@/app/lib/projectStore";

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
};

function normalizeMedia(projectName: string, media: any[]) {
  const safe = Array.isArray(media) ? media : [];

  const out = safe
    .filter((m) => m && typeof m.src === "string" && (m.type === "image" || m.type === "video"))
    .map((m) => {
      if (m.type === "video") {
        return {
          type: "video" as const,
          src: String(m.src),
          // ✅ supports your projects.json "thumbnail"
          thumbnail: m.thumbnail ? String(m.thumbnail) : undefined,
          alt: m.alt ? String(m.alt) : `${projectName} demo video`,
        };
      }

      return {
        type: "image" as const,
        src: String(m.src),
        alt: m.alt ? String(m.alt) : `${projectName} image`,
        // ✅ supports optional "thumbnail" for images too
        thumbnail: m.thumbnail ? String(m.thumbnail) : undefined,
      };
    });

  // ✅ Better fallback: use the same global poster image standard
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

export default async function ProjectsPage() {
  let projects: AnyProject[] = [];

  try {
    const all = await listProjects();
    projects = (all as AnyProject[]).filter((p) => p?.published);
  } catch {
    projects = [];
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="py-16 sm:py-20">
        <Container>
          <PageHeader
            level={1}
            badge="Projects"
            title="Products By Us"
            subtitle="A selection of platforms designed to solve real operational and business problems."
          />

          {projects.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">No projects published yet.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {projects.map((project) => {
                const slug = project.slug || "project";
                const name = project.name || "Untitled project";
                const description = project.description || "";
                const highlights = Array.isArray(project.highlights) ? project.highlights : [];

                const isFxcoPilot = slug === "fxco-pilot";
                const externalFxcoUrl = "https://fxco-pilot.solflightech.org";

                const href = isFxcoPilot ? externalFxcoUrl : project.href || `/projects/${slug}`;

                const status = isFxcoPilot ? "Live" : project.status || "Upcoming";
                const statusColor = isFxcoPilot
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : project.statusColor || "bg-slate-100 text-slate-700 border-slate-200";

                const ctaLabel = isFxcoPilot ? "Open FXCO-PILOT" : project.ctaLabel || "View project";

                const mediaItems = normalizeMedia(name, project.media || []);

                const linkProps = isFxcoPilot
                  ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
                  : ({} as const);

                return (
                  <article
                    key={slug}
                    className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >
                    <Link href={href} {...linkProps} className="block">
                      <ProjectMediaCarousel
                        items={mediaItems}
                        autoPlay
                        intervalMs={3500}
                        className="h-48"
                        roundedClassName="rounded-t-3xl"
                      />
                    </Link>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={href}
                          {...linkProps}
                          className="text-lg font-semibold tracking-tight text-slate-900 hover:underline"
                        >
                          <span className="inline-flex items-center gap-2">
                            {name}
                            {isFxcoPilot && <span className="text-slate-400">↗</span>}
                          </span>
                        </Link>

                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
                        >
                          {status}
                        </span>
                      </div>

                      <Link href={href} {...linkProps} className="block">
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>

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
                      </Link>

                      {/* ✅ DISCLAIMER (FXCO-PILOT ONLY) */}
                      {isFxcoPilot && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                          <strong>Disclaimer:</strong> FXCO-PILOT provides AI-assisted analysis for
                          educational purposes only. It is not financial or investment advice.
                          Trading involves risk.
                        </div>
                      )}

                      <div className="mt-6">
                        <Link
                          href={href}
                          {...linkProps}
                          className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                        >
                          {ctaLabel}
                          {isFxcoPilot && <span className="ml-2 text-slate-400">↗</span>}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
