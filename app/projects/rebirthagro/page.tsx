import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectGallery from "@/app/components/ProjectGallery";
import { type MediaItem } from "@/app/components/ProjectMediaCarousel";

const media: MediaItem[] = [
  { type: "image", src: "/projects/rebirthagro/1.jpg", alt: "RebirthAgro marketplace" },
  { type: "image", src: "/projects/rebirthagro/2.jpg", alt: "RebirthAgro listing" },
];

export default function RebirthAgroPage() {
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
            title="RebirthAgro"
            subtitle="A digital agriculture platform connecting farmers, buyers, and logistics."
            actions={
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Upcoming
              </span>
            }
          />

          <div className="mt-10">
            <ProjectGallery title="RebirthAgro" items={media} />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900">Problem</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Farmers struggle with access to buyers and fair pricing, while buyers struggle to find
                consistent supply. Logistics coordination is often manual and inefficient.
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Solution</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                RebirthAgro connects farmers to buyers with produce listings and discovery, while supporting
                logistics coordination — improving transparency and efficiency across the chain.
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Key features</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "Farmer listings and inventory of produce",
                  "Buyer discovery and supply matching",
                  "Logistics coordination support",
                  "Mobile-first experience",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <h3 className="text-sm font-semibold text-slate-900">Status</h3>
              <p className="mt-2 text-sm text-slate-600">
                Upcoming — concept and product direction are defined, building toward a first release.
              </p>

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Roadmap</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {["Finalize MVP scope", "Build mobile flows", "Launch pilot rollout"].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Tech stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Mobile-first", "Marketplace", "Logistics", "Payments-ready"].map((t) => (
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
                  href="/partner"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Partner with us
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
