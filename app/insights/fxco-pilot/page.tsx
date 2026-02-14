// app/insights/fxco-pilot/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import { getHub, listPostsByHub } from "@/app/lib/insightsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://solfightech.org";
const HUB_SLUG = "fxco-pilot";

// ✅ FIX: use direct external URL so the button never depends on /fxco-pilot route behavior
const FXCO_APP_URL = "https://fxco-pilot.solflightech.org";

export async function generateMetadata(): Promise<Metadata> {
  const hub = getHub(HUB_SLUG);

  if (!hub) {
    return {
      title: "Hub not found – SOLFLIGH TECH",
      description: "This insight hub could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const canonical = `${SITE_URL}${hub.href}`;

  return {
    title: `${hub.title} Insights – SOLFLIGH TECH`,
    description: hub.description,
    alternates: { canonical },
    openGraph: {
      title: `${hub.title} Insights`,
      description: hub.description,
      url: canonical,
      type: "website",
      siteName: "SOLFLIGH TECH",
      images: hub.coverImage
        ? [
            {
              url: `${SITE_URL}${hub.coverImage}`,
              width: 1536,
              height: 599,
              alt: `${hub.title} cover`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.title} Insights`,
      description: hub.description,
      images: hub.coverImage ? [`${SITE_URL}${hub.coverImage}`] : undefined,
    },
  };
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

export default function FxcoPilotHubPage() {
  const hub = getHub(HUB_SLUG);
  if (!hub) {
    return (
      <main className="bg-white text-slate-900">
        <Container>
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">This hub could not be found.</p>
              <div className="mt-4">
                <Link href="/insights" className="text-sm font-semibold text-sky-700 hover:underline">
                  Back to Insights →
                </Link>
              </div>
            </div>
          </section>
        </Container>
      </main>
    );
  }

  const posts = listPostsByHub(HUB_SLUG);

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
      <Container>
        {/* HERO */}
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:pt-16">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>Library</Pill>
            <Pill>{hub.badge}</Pill>
            <Pill>Forex</Pill>
            <Pill>Decision Support</Pill>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{hub.title}</h1>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">{hub.description}</p>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Built for the moment before execution where most preventable losses happen: impulsive
                entries, revenge trading, overconfidence, and risk blind spots.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                 If you’ve ever entered a trade and immediately questioned yourself, this hub is for you.
              </p>


              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* ✅ FIX: external anchor to live app */}
                <a
                  href={`${FXCO_APP_URL}/?source=hub&campaign=fxco_pilot&medium=cta_top`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Validate a Trade with FXCO-Pilo <span className="ml-2 text-slate-300">↗</span>
                </a>

                <Link
                  href="/insights"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Back to Insights
                </Link>
              </div>
            </div>

              <p className="mt-3 text-xs text-slate-500">
                No signals. No predictions. Just structured validation before execution.
              </p>

            
            {/* Cover */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {hub.coverImage ? (
                <Image
                  src={hub.coverImage}
                  alt={`${hub.title} cover`}
                  width={1536}
                  height={599}
                  priority
                  className="h-auto w-full"
                />
              ) : (
                <div className="p-10">
                  <p className="text-sm font-semibold text-slate-700">Cover image placeholder</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Add a cover at{" "}
                    <code className="rounded bg-white px-1 py-0.5">
                      public/insights/fxco-pilot/cover.jpg
                    </code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* POSTS */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Articles</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Problem-aware → solution-aware writing, focused on decision quality.
                </p>
              </div>

              {/* ✅ FIX: external anchor to live app */}
              <a
                href={`${FXCO_APP_URL}/?source=hub&campaign=fxco_pilot&medium=cta_corner`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-sky-700 hover:underline"
              >
                Open app → <span className="text-slate-400">↗</span>
              </a>
            </div>

            {posts.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">No posts published yet.</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {posts.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="group rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {p.tag}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {p.readingTime} • {p.dateLabel}
                      </span>
                    </div>

                    <p className="mt-3 text-lg font-semibold text-slate-900 group-hover:underline">
                      {p.title}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.description}</p>

                    <div className="mt-4 text-sm font-semibold text-sky-700">Read →</div>
                  </Link>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight">
                You don’t need more signals. You need a structured pause before execution.
                FXCO-Pilot helps you validate context, risk, and assumptions so you don’t commit capital impulsively.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                If you’re already trading, you don’t need more signals. You need a repeatable way to
                validate context + risk + assumptions before you commit capital.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {/* ✅ FIX: external anchor to live app */}
                <a
                  href={`${FXCO_APP_URL}/?source=hub&campaign=fxco_pilot&medium=cta_bottom`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Open FXCO-Pilot <span className="ml-2 text-slate-300">↗</span>
                </a>

                <Link
                  href="/insights/fxco-pilot/ai-trade-validator"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Start with the intro article
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
