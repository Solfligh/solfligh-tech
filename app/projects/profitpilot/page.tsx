import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectGallery from "@/app/components/ProjectGallery";
import { type MediaItem } from "@/app/components/ProjectMediaCarousel";

const media: MediaItem[] = [
  { type: "image", src: "/projects/profitpilot/1.jpg", alt: "ProfitPilot dashboard" },
  { type: "image", src: "/projects/profitpilot/2.jpg", alt: "ProfitPilot transactions" },
];

export default function ProfitPilotPage() {
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
            title="ProfitPilot"
            subtitle="A modern business management platform for SMEs — dashboards, transactions, inventory, roles, and insights."
            actions={
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live / Near Launch
              </span>
            }
          />

          <div className="mt-10">
            <ProjectGallery title="ProfitPilot" items={media} />
          </div>

          {/* Case Study */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900">Problem</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Many SMEs track finances across notebooks, spreadsheets, and multiple apps — creating
                errors, missed insights, and weak decision-making. Owners need a clear view of cash flow,
                performance, and operations in one place.
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Solution</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                ProfitPilot centralizes income, expenses, and business activity into a clean dashboard,
                making it easy to record transactions, monitor trends, manage inventory, and restrict access
                using roles and permissions.
              </p>

              <h2 className="mt-6 text-lg font-semibold text-slate-900">Key features</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "Dashboard: income/expense/net with trends",
                  "Transactions management (filters, export)",
                  "Inventory module (Enterprise)",
                  "Roles & permissions (Enterprise)",
                  "Smart insights and operational alerts",
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
                Stable core modules with premium UX. Preparing for deployment and onboarding polish.
              </p>

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Roadmap</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {[
                  "Finalize onboarding + pricing messaging",
                  "Improve insights and reports",
                  "Add more integrations",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold text-slate-900">Tech stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Next.js", "Tailwind", "Supabase", "Postgres", "RLS"].map((t) => (
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
