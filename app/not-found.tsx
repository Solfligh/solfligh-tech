import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

/**
 * Custom 404.
 *
 * Four routes call notFound() — blog posts, products, books, and chapters — so
 * a mistyped or retired URL lands here. Without this file those hit Next's
 * stock "This page could not be found": no navigation, no branding, no way
 * back. Rendering inside the root layout means the header and footer come with
 * it, so a visitor is never stranded.
 *
 * The links below point at the sections those 404s actually come from, rather
 * than only offering the homepage.
 */

export const metadata: Metadata = {
  title: "Page not found",
  // The 404 status already tells crawlers not to index this; the header is
  // belt and braces for anything that renders the body without the status.
  robots: { index: false, follow: true },
};

const DESTINATIONS = [
  { href: "/products", label: "Products", desc: "ProfitPilot, FXCopilot, and RebirthAgro." },
  { href: "/services", label: "Services", desc: "What we build for clients." },
  { href: "/blog", label: "Blog", desc: "Essays and analysis." },
  { href: "/insights", label: "Insights", desc: "Deeper writing on our products." },
  { href: "/books", label: "eBooks", desc: "Long-form work, released by chapter." },
  { href: "/contact", label: "Contact", desc: "Talk to a person." },
];

export default function NotFound() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="404"
        title="That page isn’t here"
        subtitle="The link may be out of date, or the address may have a typo. Nothing is broken on your end."
        actions={
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 no-underline"
          >
            Back to home
          </Link>
        }
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <Link key={d.href} href={d.href} className="card-premium block p-6 no-underline transition hover:bg-slate-50">
            <div className="text-base font-bold text-slate-950">{d.label}</div>
            <p className="mt-2 text-sm font-semibold text-slate-700">{d.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm font-semibold text-slate-700">
        If you followed a link from somewhere on this site and expected something here,{" "}
        <Link href="/contact" className="text-sky-700 hover:underline">
          tell us
        </Link>{" "}
        — a broken internal link is our problem to fix, not yours to work around.
      </p>
    </Container>
  );
}
