// app/projects/page.tsx
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectMediaCarousel from "@/app/components/ProjectMediaCarousel";
import { listProjects } from "@/app/lib/projectsStore";

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
          thumbnail: m.thumbnail ? String(m.thumbnail) : undefined,
        };
      }
      return {
        type: "image" as const,
        src: String(m.src),
        alt: m.alt ? String(m.alt) : `${projectName} image`,
        thumbnail: m.thumbnail ? String(m.thumbnail) : undefined,
      };
    });

  // Fallback placeholder if empty
  if (out.length === 0) {
    return [{ type: "image" as const, src: "/images/placeholder.png", alt: "Placeholder" }];
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
            title="Products we are building"
            subtitle="A selection of platforms designed to solve real operational and business problems."
          />

          {projects.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">No projects published yet.</p>
              <p className="mt-2 text-xs text-slate-500">
                Go to <span className="font-semibold">/admin</span> and publish a project.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {projects.map((project) => {
                const slug = project.slug || "project";
                const href = project.href || `/projects/${slug}`;
                const name = project.name || "Untitled project";
                const status = project.status || "Upcoming";
                const statusColor =
                  project.statusColor || "bg-slate-100 text-slate-700 border-slate-200";
                const description = project.description || "";
                const highlights = Array.isArray(project.highlights) ? project.highlights : [];
                const ctaLabel = project.ctaLabel || "View project";

                const mediaItems = normalizeMedia(name, project.media || []);

                return (
                  <article
                    key={slug}
                    className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >
                    {/* Media clickable */}
                    <Link href={href} className="block" aria-label={`Open ${name}`}>
                      <ProjectMediaCarousel
                        items={mediaItems}
                        ariaLabel={`${name} media`}
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
                          className="text-lg font-semibold tracking-tight text-slate-900 hover:underline"
                        >
                          {name}
                        </Link>

                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* Description + highlights clickable */}
                      <Link href={href} className="block">
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>

                        {highlights.length > 0 ? (
                          <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            {highlights.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </Link>

                      <div className="mt-6">
                        <Link
                          href={href}
                          className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                        >
                          {ctaLabel}
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
