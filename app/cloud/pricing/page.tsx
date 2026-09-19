import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

/**
 * Solfligh Cloud pricing.
 *
 * Public developer access is not built yet, so there are no prices to show and
 * this page must not invent any (Brand Guidelines 3). What it states instead is
 * only what the docs already commit to about how Cloud will be charged for:
 *
 *  - a free tier for startups (Blueprint 8.4, citing Cloud PRD 17)
 *  - usage-based platform fees (Blueprint 7.4)
 *  - enterprise contracts with dedicated SLAs and support (Blueprint 8.3)
 *
 * When real tiers exist, replace `model` with them rather than adding numbers
 * alongside the "not set yet" copy.
 */

export const metadata: Metadata = {
  title: "Solfligh Cloud pricing",
  description:
    "Solfligh Cloud pricing is not set yet because public developer access is not open. Here is how it is planned to work, and how to hear first when it is.",
  alternates: { canonical: "/cloud/pricing" },
  openGraph: {
    type: "website",
    title: "Solfligh Cloud pricing | SOLFLIGH TECH",
    description:
      "Solfligh Cloud pricing is not set yet because public developer access is not open. Here is how it is planned to work, and how to hear first when it is.",
    url: "https://www.solflightech.org/cloud/pricing",
  },
};

const model = [
  {
    name: "Free tier",
    who: "Startups",
    desc: "A free way for startups to start building on Solfligh Cloud.",
  },
  {
    name: "Usage-based",
    who: "Teams running in production",
    desc: "Pay for what you use, measured by the platform's own usage metering, not a fixed seat count.",
  },
  {
    name: "Enterprise",
    who: "Larger organisations",
    desc: "A contract with dedicated SLAs and support, agreed directly with our team.",
  },
];

export default function CloudPricingPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Solfligh Cloud • Pricing"
        title="Pricing isn't set yet"
        subtitle="Public developer access to Solfligh Cloud is still being built, so there are no prices to publish. This is how pricing is planned to work. Actual prices will be published when access opens."
        actions={
          <>
            <Link
              href="/cloud/access"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
            >
              Register for early access
            </Link>
            <Link
              href="/cloud"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 no-underline"
            >
              About Solfligh Cloud
            </Link>
          </>
        }
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {model.map((m) => (
          <div key={m.name} className="card-premium p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Planned
            </div>
            <div className="mt-4 text-base font-bold text-slate-950">{m.name}</div>
            <div className="mt-1 text-xs font-bold text-slate-600">{m.who}</div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card-premium p-6">
          <div className="text-base font-bold text-slate-950">What you can buy today</div>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Nothing on Solfligh Cloud directly. There is no account to sign up for and no bill to
            receive yet. ProfitPilot and FXCopilot already run on it in production.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm font-bold text-sky-700 hover:underline"
          >
            See products
          </Link>
        </div>

        <div className="card-premium p-6">
          <div className="text-base font-bold text-slate-950">Hearing first</div>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            The early access list is who we contact first when access opens and prices are set.
            Tell us what you plan to build and your expected usage. That helps us set pricing that fits.
          </p>
          <Link
            href="/cloud/access"
            className="mt-4 inline-block text-sm font-bold text-sky-700 hover:underline"
          >
            Join the early access list
          </Link>
        </div>
      </div>
    </Container>
  );
}
