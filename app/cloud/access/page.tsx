import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import LeadForm from "@/app/components/LeadForm";

/**
 * Solfligh Cloud early access.
 *
 * Website Architecture 10 routes homepage and Cloud visitors to a developer
 * signup. That signup did not exist, so the highest-intent visitors on the site
 * were being sent to a generic contact form.
 *
 * Two constraints shape this page:
 *
 *  - Solfligh Cloud is the platform layer, not a product (Blueprint 11.1), so
 *    this must not be routed through /waitlist, which is for products.
 *  - Public developer access is not open yet. The page says so plainly rather
 *    than implying a console someone can log into today.
 */

export const metadata: Metadata = {
  title: "Solfligh Cloud early access",
  description:
    "Register for early access to Solfligh Cloud. Public developer access is not open yet — join the list and we will get in touch when it is.",
  alternates: { canonical: "/cloud/access" },
  openGraph: {
    type: "website",
    title: "Solfligh Cloud early access | SOLFLIGH TECH",
    description:
      "Register for early access to Solfligh Cloud. Public developer access is not open yet — join the list and we will get in touch when it is.",
    url: "https://solflightech.org/cloud/access",
  },
};

export default function CloudAccessPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Solfligh Cloud • Early access"
        title="Register for early access"
        subtitle="Public developer access to Solfligh Cloud is not open yet. Tell us what you would build on it and we will get in touch when access opens."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">What this list is</div>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            Solfligh Cloud is the platform layer underneath our products, not a product
            itself. It powers ProfitPilot, FXCopilot, and RebirthAgro today.
          </p>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            Public developer access is still being built. Registering here does not create
            an account and there is nothing to log into yet — it puts you on the list we
            contact first, and tells us which capabilities to prioritise.
          </p>

          <div className="mt-6 rounded-xl border border-sky-300 bg-sky-50 p-4">
            <div className="text-sm font-bold text-sky-900">What we will not do</div>
            <div className="mt-1 text-xs font-semibold text-slate-800">
              We will not pretend a date we do not have. If you would rather be told
              nothing until it is genuinely usable, say so in the form and we will respect
              that.
            </div>
          </div>

          <div className="mt-6 text-sm font-semibold text-slate-800">
            Want to see what is live right now instead?{" "}
            <Link href="/roadmap" className="text-sky-700 hover:underline">
              The roadmap
            </Link>{" "}
            lists only what you can use today, and{" "}
            <Link href="/cloud" className="text-sky-700 hover:underline">
              the Cloud page
            </Link>{" "}
            explains the platform.
          </div>
        </div>

        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Join the early access list</div>
          <div className="mt-2 text-sm font-semibold text-slate-800">
            The more concrete you are about what you are building, the more useful this is
            to both of us.
          </div>

          <div className="mt-6">
            <LeadForm
              kind="developer"
              includeFirm
              firmLabel="Company / team"
              firmPlaceholder="Where you work (optional)"
              messageLabel="What are you building?"
              messagePlaceholder="What you want to build, which capabilities matter most, and roughly when you would need them."
              buttonText="Request early access"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 card-premium p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              Looking for something you can use today?
            </div>
            <div className="mt-2 max-w-2xl text-sm font-semibold text-slate-800">
              Our products are live now, and the services team takes on client work
              directly.
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              See products
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              See services
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
