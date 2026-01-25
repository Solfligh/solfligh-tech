// app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import ProjectMediaCarousel, { type MediaItem } from "@/app/components/ProjectMediaCarousel";
import { listProjects } from "@/app/lib/projectStore";
import { notFound, redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://solflightech.org";

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
  media?: unknown[];

  // ✅ first-class external destination
  externalUrl?: string | null;

  demo?: DemoInfo | null;

  problem?: string;
  solution?: string;
  keyFeatures?: string[];
  roadmap?: string[];
  techStack?: string[];
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

function isLikelyVideoSrc(src: unknown): boolean {
  if (typeof src !== "string") return false;
  const s = src.trim();
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(s);
}

function withDemoInjected(
  projectName: string,
  baseMedia: MediaItem[],
  demo?: DemoInfo | null
): MediaItem[] {
  const items = Array.isArray(baseMedia) ? [...baseMedia] : [];
  const d = demo || null;

  const alreadyHasRealVideo = items.some((m) => m?.type === "video" && isLikelyVideoSrc(m?.src));
  const demoStatus = (d as any)?.status;

  if (demoStatus === "live") {
    const videoSrc = typeof (d as any)?.videoSrc === "string" ? (d as any).videoSrc.trim() : "";
    if (videoSrc && !alreadyHasRealVideo) {
      items.unshift({
        type: "video",
        src: videoSrc,
        thumbnail: typeof (d as any)?.thumbnail === "string" ? (d as any).thumbnail : undefined,
        alt: `${projectName} demo video`,
      });
    }
  }

  if (demoStatus === "coming_soon") {
    if (!alreadyHasRealVideo) {
      items.unshift({
        type: "video",
        src: "",
        thumbnail:
          typeof (d as any)?.thumbnail === "string"
            ? (d as any).thumbnail
            : "/projects/video-poster.jpg",
        alt: `${projectName} demo coming soon`,
      });
    }
  }

  return items;
}

async function getPublishedProjectBySlug(slug: string): Promise<AnyProject | null> {
  try {
    const all = await listProjects();
    const projects = (all as AnyProject[]) || [];
    const project = projects.find((p) => p?.published && p?.slug === slug);
    return project || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const name = project.name ?? "SOLFLIGH TECH Project";
  const description =
    project.description ??
    "A SOLFLIGH TECH project designed to solve real operational and business problems.";

  const resolvedSlug = project.slug ?? slug;

  // If external, canonical points to that. Otherwise internal page.
  const externalUrl = isValidExternalUrl(project.externalUrl) ? project.externalUrl.trim() : "";
  const canonical = externalUrl ? externalUrl : `${SITE_URL}/projects/${resolvedSlug}`;

  // ✅ Dynamic OG image
  const og = `/og?title=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(
    description
  )}&badge=${encodeURIComponent("Project")}`;

  return {
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} — SOLFLIGH TECH`,
      description,
      url: canonical,
      type: "article",
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: `${name} — SOLFLIGH TECH`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — SOLFLIGH TECH`,
      description,
      images: [og],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  // ✅ externalUrl is first-class: if present, we redirect to it.
  const externalUrl = isValidExternalUrl(project.externalUrl) ? project.externalUrl.trim() : "";
  if (externalUrl) redirect(externalUrl);

  const name = project.name ?? "Untitled project";
  const status = project.status ?? "Upcoming";
  const statusColor = project.statusColor ?? "bg-slate-100 text-slate-700 border-slate-200";

  const description = project.description ?? "";
  const highlights = Array.isArray(project.highlights) ? project.highlights : [];

  const problem = project.problem ?? "";
  const solution = project.solution ?? "";
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
                  {highlights.map((item, i) => (
                    <li key={`${slug}-hl-${i}`} className="flex items-start gap-2">
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
                  {keyFeatures.map((f, i) => (
                    <li key={`${slug}-kf-${i}`} className="flex items-start gap-2">
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
                  {roadmap.map((r, i) => (
                    <li key={`${slug}-rm-${i}`} className="flex items-start gap-2">
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
                  {techStack.map((t, i) => (
                    <span
                      key={`${slug}-ts-${i}`}
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
