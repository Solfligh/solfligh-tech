// app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import ProjectMediaCarousel from "@/app/components/ProjectMediaCarousel";
import { listProjects } from "@/app/lib/projectStore";
import { notFound, redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://solflightech.org";

function ogUrl(params: { title?: string; subtitle?: string; badge?: string }) {
  const u = new URL("/og", SITE_URL);
  if (params.title) u.searchParams.set("title", params.title);
  if (params.subtitle) u.searchParams.set("subtitle", params.subtitle);
  if (params.badge) u.searchParams.set("badge", params.badge);
  return u.toString();
}

type DemoInfo =
  | { status?: "none" }
  | { status?: "coming_soon"; thumbnail?: string }
  | { status?: "live"; videoSrc?: string; thumbnail?: string };

type AnyProject = {
  slug?: string;
  name?: string;
  status?: string;
  statusColor?: string;
  description?: string;
  highlights?: string[];
  published?: boolean;
  media?: any[];

  externalUrl?: string | null;

  demo?: DemoInfo | null;

  problem?: string;
  solution?: string;
  keyFeatures?: string[];
  roadmap?: string[];
  techStack?: string[];
};

function isValidExternalUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const u = url.trim();
  return u.startsWith("https://") || u.startsWith("http://");
}

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

function isLikelyVideoSrc(src: unknown): boolean {
  if (typeof src !== "string") return false;
  const s = src.trim();
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(s);
}

function withDemoInjected(
  projectName: string,
  baseMedia: ReturnType<typeof normalizeMedia>,
  demo?: DemoInfo | null
) {
  const items = Array.isArray(baseMedia) ? [...baseMedia] : [];
  const d = demo || null;

  const alreadyHasRealVideo = items.some((m) => m?.type === "video" && isLikelyVideoSrc(m?.src));
  const demoStatus = (d as any)?.status;

  if (demoStatus === "live") {
    const videoSrc = typeof (d as any)?.videoSrc === "string" ? (d as any).videoSrc.trim() : "";
    if (videoSrc && !alreadyHasRealVideo) {
      items.unshift({
        type: "video" as const,
        src: videoSrc,
        thumbnail: typeof (d as any)?.thumbnail === "string" ? (d as any).thumbnail : undefined,
        alt: `${projectName} demo video`,
      });
    }
  }

  if (demoStatus === "coming_soon") {
    if (!alreadyHasRealVideo) {
      items.unshift({
        type: "video" as const,
        src: "",
        thumbnail:
          typeof (d as any)?.thumbnail === "string" ? (d as any).thumbnail : "/projects/video-poster.jpg",
        alt: `${projectName} demo coming soon`,
      });
    }
  }

  return items;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params?.slug || "";

  let projects: AnyProject[] = [];
  try {
    projects = ((await listProjects()) as AnyProject[]) || [];
  } catch {
    projects = [];
  }

  const project = projects.find((p) => p?.published && p?.slug === slug);

  if (!project) {
    return {
      title: "Project not found — SOLFLIGH TECH",
      description: "This project could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const name = project.name || "SOLFLIGH TECH Project";
  const description = (project.description || "").trim();
  const safeDescription =
    description.length > 0
      ? description
      : "Explore SOLFLIGH TECH projects focused on automation, clarity, and real business impact.";

  const internalUrl = `${SITE_URL}/projects/${slug}`;

  const externalUrl = isValidExternalUrl(project.externalUrl) ? project.externalUrl.trim() : "";
  const canonical = externalUrl || internalUrl;

  // If this project redirects externally, we keep it "follow" but "noindex" to avoid duplicate indexing.
  const robots = externalUrl
    ? ({ index: false, follow: true } as const)
    : ({ index: true, follow: true } as const);

  const ogImage = ogUrl({
    title: name,
    subtitle: safeDescription,
    badge: "Project",
  });

  return {
    title: `${name} — SOLFLIGH TECH`,
    description: safeDescription,
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title: name,
      description: safeDescription,
      url: canonical,
      type: "website",
      siteName: "SOLFLIGH TECH",
      images: [{ url: ogImage, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: safeDescription,
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug;

  let projects: AnyProject[] = [];
  try {
    const all = await listProjects();
    projects = (all as AnyProject[]) || [];
  } catch {
    projects = [];
  }

  const project = projects.find((p) => p?.published && p?.slug === slug);
  if (!project) notFound();

  const externalUrl = isValidExternalUrl(project.externalUrl) ? project.externalUrl.trim() : "";
  if (externalUrl) redirect(externalUrl);

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

  const baseMedia = normalizeMedia(name, project.media || []);
  const mediaItems = withDemoInjected(name, baseMedia, project.demo || null);

  return (
    <main className="bg-white text-slate-900">
      <section className="py-16 sm:py-20">
        <Container>
          <PageHeader level={1} badge="Project" title={name} subtitle={description} />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_.7fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
              <ProjectMediaCarousel
                items={mediaItems}
                ariaLabel={`${name} media`}
                className="h-[280px] sm:h-[420px]"
                roundedClassName="rounded-none"
                autoPlay={false}
              />
            </div>

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
