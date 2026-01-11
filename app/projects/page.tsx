// app/projects/page.tsx
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectGallery from "@/app/components/ProjectGallery";
import { type MediaItem } from "@/app/components/ProjectMediaCarousel";

type Project = {
  name: string;
  slug: string;
  status: string;
  statusColor: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  media: MediaItem[];
};

const projects: Project[] = [
  {
    name: "ProfitPilot",
    slug: "profitpilot",
    status: "Live / Near Launch",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    description:
      "A modern business management platform for SMEs. Track income & expenses, manage inventory, control access with roles, and view insights — all in one clean dashboard.",
    highlights: [
      "Multi-tenant SaaS architecture",
      "Roles & permissions (Enterprise)",
      "Inventory & transactions",
      "Smart insights & dashboards",
    ],
    ctaLabel: "View ProfitPilot",
    href: "/projects/profitpilot",
    media: [
      {
        type: "video",
        src: "/projects/profitpilot/demo.mp4",
        poster: "/projects/profitpilot/demo-poster.jpg",
      },
      { type: "image", src: "/projects/profitpilot/1.png", alt: "ProfitPilot dashboard" },
      { type: "image", src: "/projects/profitpilot/2.png", alt: "ProfitPilot transactions" },
    ],
  },
  {
    name: "ProfitFX",
    slug: "profitfx",
    status: "In Development",
    statusColor: "bg-sky-100 text-sky-700 border-sky-200",
    description:
      "An FX-focused platform designed for clarity, decision support, and workflow automation for traders and teams.",
    highlights: ["Trading workflow automation", "Decision-support tooling", "Clean, focused UX"],
    ctaLabel: "View ProfitFX",
    href: "/projects/profitfx",
    media: [
      {
        type: "video",
        src: "/projects/profitfx/demo.mp4",
        poster: "/projects/profitfx/demo-poster.jpg",
      },
      { type: "image", src: "/projects/profitfx/1.png", alt: "ProfitFX screen" },
      { type: "image", src: "/projects/profitfx/2.png", alt: "ProfitFX workflow" },
    ],
  },
  {
    name: "RebirthAgro",
    slug: "rebirthagro",
    status: "Upcoming",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200",
    description:
      "A digital agriculture platform connecting farmers, buyers, and logistics — improving transparency, access, and efficiency in the agri-value chain.",
    highlights: ["Farmer-to-market access", "Produce listings & logistics", "Mobile-first experience"],
    ctaLabel: "View RebirthAgro",
    href: "/projects/rebirthagro",
    media: [
      {
        type: "video",
        src: "/projects/rebirthagro/demo.mp4",
        poster: "/projects/rebirthagro/demo-poster.jpg",
      },
      { type: "image", src: "/projects/rebirthagro/1.png", alt: "RebirthAgro marketplace" },
      { type: "image", src: "/projects/rebirthagro/2.png", alt: "RebirthAgro listing" },
    ],
  },
];

export default function ProjectsPage() {
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

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                {/* ✅ Full gallery (modal + thumbnails) */}
                <div className="rounded-t-3xl overflow-hidden">
                  <ProjectGallery title={project.name} items={project.media} />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={project.href}
                      className="text-lg font-semibold tracking-tight text-slate-900 hover:underline"
                    >
                      {project.name}
                    </Link>

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${project.statusColor}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <Link href={project.href} className="block">
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {project.description}
                    </p>

                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {project.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Link>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Link
                      href={project.href}
                      className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                    >
                      {project.ctaLabel}
                    </Link>

                    <Link
                      href={project.href}
                      className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
