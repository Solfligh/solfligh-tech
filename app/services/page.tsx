import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SOLFLIGH TECH services across Build, AI & Automation, Infrastructure, Design & Strategy, and Run: custom software, web and mobile development, AI automation, cloud infrastructure, DevOps, integration, consulting, support, and maintenance.",
  alternates: { canonical: "/services" },
};

type Service = { title: string; desc: string };
type ServiceGroup = { category: string; blurb: string; services: Service[] };

/**
 * Service lines per Blueprint §10 and Website Architecture §5.
 * Architecture §5 specifies these as collapsible sections on a single page,
 * not separate thin pages per service.
 */
const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "Build",
    blurb: "Designing and shipping the software itself.",
    services: [
      {
        title: "Custom Software Development",
        desc: "Software built around how your business actually works, instead of bending your process to fit off-the-shelf tooling.",
      },
      {
        title: "Web Development",
        desc: "Marketing sites, portals, and web platforms built for performance, accessibility, and search visibility.",
      },
      {
        title: "Mobile App Development",
        desc: "Android and iOS applications, including cross-platform builds where a shared codebase is the practical choice.",
      },
      {
        title: "API Development",
        desc: "Documented, versioned APIs that other systems and teams can build against without guesswork.",
      },
      {
        title: "SaaS Development",
        desc: "Multi-tenant products with the billing, permissions, and onboarding a subscription business needs from day one.",
      },
      {
        title: "Startup MVP Development",
        desc: "A focused first version that tests the core assumption, scoped so you can learn from real users before committing to a full build.",
      },
      {
        title: "Enterprise Software Development",
        desc: "Larger systems with the access control, audit trails, and integration requirements that established organisations carry.",
      },
      {
        title: "ERP / Business Systems",
        desc: "Finance, inventory, HR, and operations brought into one connected system rather than a set of separate spreadsheets.",
      },
    ],
  },
  {
    category: "AI & Automation",
    blurb: "Removing repetitive work and adding decision support.",
    services: [
      {
        title: "AI Automation",
        desc: "Automating repetitive, rules-based work so your team spends its time on judgement rather than data entry.",
      },
      {
        title: "AI Agent Development",
        desc: "Agents that carry out multi-step tasks against your own tools and data, with their boundaries and permissions defined up front.",
      },
      {
        title: "Business Process Automation",
        desc: "Mapping a manual workflow end to end, then removing the handoffs and re-keying that slow it down.",
      },
    ],
  },
  {
    category: "Infrastructure",
    blurb: "The platform layer your software runs on.",
    services: [
      {
        title: "Cloud Infrastructure",
        desc: "Environments provisioned as code, with cost and scaling behaviour understood before launch rather than discovered after it.",
      },
      {
        title: "DevOps",
        desc: "Build, test, and deploy pipelines that make releases routine instead of events.",
      },
      {
        title: "Database Architecture",
        desc: "Schema design, indexing, and migration strategy for data that has to stay correct as it grows.",
      },
      {
        title: "System Integration",
        desc: "Connecting systems that were never designed to talk to each other, without a fragile chain of manual exports.",
      },
      {
        title: "API Integration",
        desc: "Bringing third-party services such as payments, messaging, and logistics into your product with sensible failure handling.",
      },
    ],
  },
  {
    category: "Design & Strategy",
    blurb: "Deciding what to build, and how it should feel to use.",
    services: [
      {
        title: "UI/UX Design",
        desc: "Interface and flow design grounded in how people actually work, including on mid-range devices and unreliable connections.",
      },
      {
        title: "Product Consulting",
        desc: "Working out what to build, what to leave out, and in what order.",
      },
      {
        title: "Technology Consulting",
        desc: "Architecture reviews, technology choices, and second opinions before a decision becomes expensive to reverse.",
      },
      {
        title: "Digital Transformation",
        desc: "Moving operations off paper and disconnected spreadsheets in stages, so the business keeps running throughout.",
      },
    ],
  },
  {
    category: "Run",
    blurb: "Keeping it working after launch.",
    services: [
      {
        title: "Technical Support",
        desc: "A route to someone who knows your system when something breaks.",
      },
      {
        title: "Maintenance",
        desc: "Dependency updates, security patches, and the unglamorous upkeep that keeps software from decaying.",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Services • Delivery"
        title="What we deliver"
        subtitle="SOLFLIGH TECH builds software, automation, and the infrastructure underneath it, for businesses across Africa and beyond. Every line below is work we take on directly."
        actions={
          <>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              See our products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Talk to us
            </Link>
          </>
        }
      />

      {/* Collapsible sections per Website Architecture §5. Native <details> so
          the page stays a Server Component and the content is still present
          for search engines and users without JavaScript. */}
      <div className="mt-10 space-y-4">
        {SERVICE_GROUPS.map((group, groupIndex) => (
          <details
            key={group.category}
            open={groupIndex === 0}
            className="card-premium group overflow-hidden p-0 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
              <div>
                <div className="text-base font-bold text-slate-950">{group.category}</div>
                <div className="mt-1 text-sm font-semibold text-slate-700">{group.blurb}</div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  {group.services.length}
                </span>
                <span
                  aria-hidden="true"
                  className="text-slate-500 transition-transform duration-200 group-open:rotate-180"
                >
                  ▾
                </span>
              </div>
            </summary>

            <div className="border-t border-slate-200 px-6 pb-6 pt-5">
              <ul className="grid gap-4 md:grid-cols-2">
                {group.services.map((service) => (
                  <li
                    key={service.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <h3 className="text-sm font-bold text-slate-950">{service.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                      {service.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      {/* Services CTA, deliberately distinct from the Products page CTA
          (which points readers at Insights). */}
      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              Talk to us about your project
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-800">
              Tell us what you are trying to build or fix, and we will tell you honestly whether we
              are the right team for it.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/partner"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              Partner With Us
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
