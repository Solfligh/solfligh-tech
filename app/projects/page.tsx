// app/projects/page.tsx
import type { Metadata } from "next";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectMediaCarousel, { type MediaItem } from "@/app/components/ProjectMediaCarousel";
import { listProjects } from "@/app/lib/projectStore";
import ProjectLeadButton from "@/app/components/ProjectLeadButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const OG_PROJECTS = `/og?title=${encodeURIComponent(
  "Projects"
)}&subtitle=${encodeURIComponent(
  "Products we are building"
)}&badge=${encodeURIComponent("Projects")}`;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of platforms designed to solve real operational and business problems — built by SOLFLIGH TECH.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects — SOLFLIGH TECH",
    description:
      "A selection of platforms designed to solve real operational and business problems.",
    url: "/projects",
    type: "website",
    images: [
      {
        url: OG_PROJECTS,
        width: 1200,
        height: 630,
        alt: "SOLFLIGH TECH — Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — SOLFLIGH TECH",
    description:
      "A selection of platforms designed to solve real operational and business problems.",
    images: [OG_PROJECTS],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

type AnyProject = {
  slug?: string;
  name?: string;
  status?: string;
  statusColor?: string;
  description?: string;
  highlights?: string[];
  ctaLabel?: string;
  href?: string;

  // ✅ first-class external destination
  externalUrl?: string;

  published?: boolean;
  media?: unknown[];
};

type RawMedia = {
  type?: unknown;
  src?: unknown;
  thumbnail?: unknown;
  alt?: unknown;
};

function isValidExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const u = url.trim();
  return u.startsWith("https://") || u.startsWith("http://");
}

function normalizeMedia(projectName: string, media: unknown[]): MediaItem[] {
  const safe = Array.isArray(media) ? media : [];

  const out: MediaItem[] = safe
    .filter((m): m is RawMedia => !!m && typeof m === "object")
    .filter((m) => typeof m.src === "string" && (m.type === "image" || m.type === "video"))
    .map((m) => {
      if (m.type === "video") {
        return {
          type: "video",
          src: String(m.src),
          thumbnail: typeof m.thumbnail === "string" ? m.thumbnail : undefined,
          alt: typeof m.alt === "string" ? m.alt : `${projectName} demo video`,
        };
      }

      return {
        type: "image",
        src: String(m.src),
        alt: typeof m.alt === "string" ? m.alt : `${projectName} image`,
        thumbnail: typeof m.thumbnail === "string" ? m.thumbnail : undefined,
      };
    });

  if (out.length === 0) {
    return [
      {
        type: "image",
        src: "/projects/video-poster.jpg",
        alt: "Media coming soon",
      },
    ];
  }

  return out;
}

function getProjectLink(project: AnyProject) {
  const slug = project.slug || "project";

  const externalUrl = isValidExternalUrl(project.externalUrl) ? project.externalUrl.trim() : "";
  const isExternal = !!externalUrl;

  const href = isExternal ? externalUrl : project.href || `/projects/${slug}`;
  const linkProps = isExternal
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : ({} as const);

  return { href, isExternal, linkProps };
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
            </div>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {projects.map((project, projectIndex) => {
                const slug = project.slug || `project-${projectIndex}`;
                const name = project.name || "Untitled project";
                const description = project.description || "";
                const highlights = Array.isArray(project.highlights) ? project.highlights : [];

                const { href, isExternal, linkProps } = getProjectLink(project);

                const status = project.status || "Upcoming";
                const statusColor =
                  project.statusColor || "bg-slate-100 text-slate-700 border-slate-200";

                const ctaLabel = project.ctaLabel || (isExternal ? "Open project" : "View project");

                const mediaItems = normalizeMedia(name, project.media || []);

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
                            {isExternal && <span className="text-slate-400">↗</span>}
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
                            {highlights.map((item, i) => (
                              <li key={`${slug}-hl-${i}`} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </Link>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          href={href}
                          {...linkProps}
                          className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                        >
                          {ctaLabel}
                          {isExternal && <span className="ml-2 text-slate-400">↗</span>}
                        </Link>

                        {/* ✅ waitlist button (does NOT navigate away) */}
                        <ProjectLeadButton
                          projectSlug={slug}
                          projectName={name}
                          source="projects_page"
                          buttonLabel="Join waitlist"
                        />
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
