import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

const SECTIONS = [
  {
    title: "ProfitPilot",
    description:
      "Daily profit clarity for business owners — no accounting jargon, just clean decisions.",
    href: "/insights/profitpilot",
    badge: "Project Hub",
  },
];

export default function InsightsIndexPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Insights"
        subtitle="We write to make complicated business problems feel simple — and to explain how we think when building products."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-neutral-200 p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="text-sm text-neutral-600">{s.description}</p>
              </div>

              <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700">
                {s.badge}
              </span>
            </div>

            <div className="mt-4 text-sm font-medium text-neutral-900">
              <span className="underline decoration-neutral-300 underline-offset-4 group-hover:decoration-neutral-500">
                View articles
              </span>{" "}
              →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
