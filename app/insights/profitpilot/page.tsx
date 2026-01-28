import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

const POSTS = [
  {
    title: "Why Most Business Owners Don’t Actually Know How Much They Made Today",
    description:
      "If you’ve ever ended the day unsure whether you really made money, you’re not alone. Here’s why it happens — and why it isn’t your fault.",
    href: "/insights/profitpilot/why-most-business-owners-dont-know-how-much-they-made-today",
    tag: "Problem Awareness",
    readingTime: "4–6 min",
    dateLabel: "Jan 2026",
  },
];

export default function ProfitPilotInsightsHubPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        contextLabel="Insights"
        contextHref="/insights"
        title="ProfitPilot Insights"
        subtitle="Clear writing for business owners who want to understand daily performance — without accounting confusion."
      />

      <section className="space-y-4">
        {POSTS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group block rounded-2xl border border-neutral-200 p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                {p.tag}
              </span>
              <span className="text-xs text-neutral-500">{p.readingTime}</span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-500">{p.dateLabel}</span>
            </div>

            <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{p.description}</p>

            <div className="mt-4 text-sm font-medium text-neutral-900">
              <span className="underline decoration-neutral-300 underline-offset-4 group-hover:decoration-neutral-500">
                Read
              </span>{" "}
              →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
