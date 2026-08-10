import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "SOLFLIGH TECH is not hiring for any specific role at the moment. If you build software, automation, or infrastructure and want to work with us, get in touch.",
  alternates: { canonical: "/careers" },
};

/**
 * There are deliberately no job listings on this page.
 *
 * Confirmed with the founder: no openings exist yet. Inventing roles, team
 * sizes, benefits, or culture claims would be fabricated content
 * (Brand Guidelines §3), so this page says plainly that nothing is open and
 * offers a real way to get in touch instead.
 */
export default function CareersPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Careers • Company"
        title="Careers at SOLFLIGH TECH"
        subtitle="We are not hiring for a specific role right now. When that changes, open roles will be listed on this page."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">No open roles right now</div>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            There are no vacancies to apply for today. We would rather say that plainly than
            keep a list of roles we are not actually recruiting for.
          </p>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            This page is the place to check. If a role opens, it will appear here with what
            the work involves and how to apply.
          </p>
        </div>

        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">What we work on</div>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            So you can judge whether your work overlaps with ours:
          </p>

          <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-800">
            <li>
              • Products we are building, including{" "}
              <Link href="/products" className="text-sky-700 hover:underline">
                ProfitPilot, FXCopilot, and RebirthAgro
              </Link>
            </li>
            <li>
              • Client work across{" "}
              <Link href="/services" className="text-sky-700 hover:underline">
                build, AI and automation, infrastructure, design and strategy, and run
              </Link>
            </li>
            <li>
              • The platform layer underneath it,{" "}
              <Link href="/cloud" className="text-sky-700 hover:underline">
                Solfligh Cloud
              </Link>
            </li>
            <li>• Software built for African businesses first</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              Want to work with us anyway?
            </div>
            <div className="mt-2 max-w-2xl text-sm font-semibold text-slate-800">
              We read speculative messages. Tell us what you build, point us at something you
              have shipped, and say how you would want to work together. We will be honest
              about whether there is anything to talk about right now.
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
