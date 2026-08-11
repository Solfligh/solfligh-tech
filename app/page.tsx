// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import { getHub, getLatestPost } from "@/app/lib/insightsStore";
import { listProjects, type ProjectPayload } from "@/app/lib/projectStore";

const pillars = [
  { emoji: "☁️", title: "Solfligh Cloud", desc: "The infrastructure layer our software is built on", href: "/cloud" },
  { emoji: "🚀", title: "Products", desc: "Software solving real business problems today", href: "/products" },
  { emoji: "💼", title: "Services", desc: "Expert teams building custom technology for your business", href: "/services" },
  { emoji: "🤖", title: "AI", desc: "AI built for people and autonomous agents alike", href: "/ai" },
];

const capabilities = [
  {
    title: "Web Apps",
    desc: "Next.js builds, dashboards, portals",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automation",
    desc: "Workflows, integrations, ops systems",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M7 7h10M7 12h10M7 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 7h.01M5 12h.01M5 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "UI/UX",
    desc: "Premium design systems + polish",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M7 8h10M7 12h7M7 16h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Security",
    desc: "Auth, permissions, best practices",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M12 3l7 4v6c0 5-3 8-7 8s-7-3-7-8V7l7-4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12l1.8 1.8L14.8 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Cloud",
    desc: "Deployments, hosting, scaling",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M8 18h9a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.7A3.5 3.5 0 0 0 8 18z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const features = [
  {
    title: "Product design that feels premium",
    desc: "We design interfaces that look modern, load fast, and convert without sacrificing clarity.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M7 7h10M7 12h10M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Web apps built for scale",
    desc: "Next.js + modern tooling, structured codebases, and production ready performance from day one.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M7 16V8m5 10V6m5 12v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automation that saves real time",
    desc: "From internal ops to customer workflows we remove repetitive work and reduce human error.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M8 7h8M8 12h8M8 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 7h.01M5 12h.01M5 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Security-first engineering",
    desc: "Best practices around auth, permissions, data access, and auditing baked into the foundation.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 3l7 4v6c0 5-3 8-7 8s-7-3-7-8V7l7-4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12l1.8 1.8L14.8 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Clear delivery & communication",
    desc: "No confusion, no guessing. You’ll always know what’s done, what’s next, and why it matters.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M7 9h10M7 13h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H8l-4 3V6a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Build fast, maintain forever",
    desc: "Clean architecture, typed APIs, and reusable components that are easy to expand later.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 4v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const stats = [
  { label: "Weeks to MVP", value: "2 – 6" },
  { label: "Performance mindset", value: "Fast" },
  { label: "Delivery style", value: "Clear" },
  { label: "Build quality", value: "Production" },
];

const process = [
  { step: "01", title: "Discover", desc: "We clarify goals, users, and the fastest path to results." },
  { step: "02", title: "Design", desc: "We craft a premium UI/UX that stays clean and readable." },
  { step: "03", title: "Build", desc: "We implement the system with scalable architecture and performance in mind." },
  { step: "04", title: "Launch", desc: "We deploy, test, and make sure you’re ready to ship with confidence." },
];

function isNewPost(dateISO: string) {
  if (typeof dateISO !== "string" || !dateISO.trim()) return false;
  const d = new Date(`${dateISO.trim()}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 30;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm sm:backdrop-blur">
      {children}
    </span>
  );
}

function Card({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:backdrop-blur">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-20 -top-20 hidden h-56 w-56 rounded-full bg-blue-200/30 blur-2xl md:block" />
        <div className="absolute -bottom-24 -right-24 hidden h-56 w-56 rounded-full bg-sky-200/30 blur-2xl md:block" />
      </div>

      <div className="relative">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/90 text-slate-900 shadow-sm">
          {icon}
        </div>
        <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const latest = getLatestPost();
  const latestHub = latest ? getHub(latest.hubSlug) : null;
  const showNew = latest ? isNewPost(latest.dateISO) : false;

  const latestCover = latest?.coverImage || latestHub?.coverImage || "";

  let products: ProjectPayload[] = [];
  try {
    const all = (await listProjects()) as ProjectPayload[];
    products = (Array.isArray(all) ? all : []).filter((p) => p?.published);
  } catch {
    products = [];
  }

  // Used to defer below-the-fold rendering in browsers that support it
  const deferBelowFold = {
    contentVisibility: "auto" as const,
    containIntrinsicSize: "900px" as const,
  };

  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* ✅ Heavy blur blobs are expensive on mobile; only render from md+ */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 hidden h-96 w-96 rounded-full bg-blue-200/35 blur-3xl md:block" />
          <div className="absolute -right-24 top-10 hidden h-[28rem] w-[28rem] rounded-full bg-sky-200/35 blur-3xl md:block" />
          <div className="absolute left-1/2 top-1/2 hidden h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/60 blur-3xl md:block" />
        </div>

        {/* ✅ Grid overlay paint cost; hide on xs, show from sm+ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-[0.07] sm:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.25) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <Container>
          <div className="relative py-16 sm:py-20 md:py-24">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>Cloud</Chip>
                  <Chip>Products</Chip>
                  <Chip>Services</Chip>
                  <Chip>AI</Chip>
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                  Building{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Africa&apos;s next
                  </span>{" "}
                  technology infrastructure.
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                  We build cloud infrastructure, AI platforms, enterprise software, and digital
                  products powering the future of African businesses.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/cloud"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  >
                    Explore Solfligh Cloud
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300/40 sm:backdrop-blur"
                  >
                    See our Products
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center rounded-xl px-2 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                  >
                    See services
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                    Fast delivery
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500/80" />
                    Premium UI/UX
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500/80" />
                    Clean architecture
                  </div>
                </div>
              </div>

              {/* Right-side platform status card */}
              <div className="lg:max-w-md">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg sm:backdrop-blur">
                  <div className="absolute -right-16 -top-16 hidden h-56 w-56 rounded-full bg-blue-200/35 blur-2xl md:block" />
                  <div className="absolute -bottom-20 -left-20 hidden h-56 w-56 rounded-full bg-sky-200/35 blur-2xl md:block" />

                  <div className="relative">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-slate-500">PLATFORM STATUS</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">What&apos;s live right now</p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {[
                        { label: "Solfligh Cloud", value: "In development", tone: "amber" as const },
                        { label: "Products", value: "2 live, 1 in development", tone: "emerald" as const },
                        { label: "Services", value: "Live", tone: "emerald" as const },
                        { label: "AI", value: "In products & platform", tone: "sky" as const },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2.5 sm:backdrop-blur"
                        >
                          <p className="text-sm font-semibold text-slate-900">{row.label}</p>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                              row.tone === "emerald"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : row.tone === "amber"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-sky-200 bg-sky-50 text-sky-700"
                            }`}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  This reflects our actual status today {" "}
                  <Link href="/roadmap" className="underline hover:text-slate-700">
                    see the full roadmap →
                  </Link>
                </p>
              </div>
            </div>

            {/* Capabilities row */}
            <div className="mt-14">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {capabilities.map((c) => (
                  <div
                    key={c.title}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition hover:bg-white hover:shadow-md sm:backdrop-blur"
                  >
                    <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white/90 text-slate-900">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2 font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
                >
                  Explore products
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  See services →
                </Link>
              </div>
            </div>

            {/* ✅ Latest from Insights (premium cover) */}
            {latest ? (
              <div className="mt-12">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm sm:p-8 sm:backdrop-blur">
                  {/* ✅ heavy blur blobs only on md+ */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-28 hidden h-80 w-80 rounded-full bg-sky-200/30 blur-3xl md:block" />
                    <div className="absolute -right-24 -bottom-28 hidden h-80 w-80 rounded-full bg-blue-200/30 blur-3xl md:block" />
                  </div>

                  <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold tracking-wider text-slate-500">LATEST FROM INSIGHTS</p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        We don’t just build. We explain the thinking.
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        Our Insights are where we break down real business problems in plain language so clients can
                        trust the approach before they buy.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {latest.tag}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {latest.readingTime}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {latest.dateLabel}
                        </span>

                        {showNew ? (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            NEW
                          </span>
                        ) : null}

                        {latestHub ? (
                          <Link
                            href={latestHub.href}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            {latestHub.title} →
                          </Link>
                        ) : null}

                        <Link
                          href="/insights"
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          All Insights →
                        </Link>
                      </div>
                    </div>

                    <Link
                      href={latest.href}
                      className="group relative w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md lg:max-w-md"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        {latestCover ? (
                          <>
                            <Image
                              src={latestCover}
                              alt={latest.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              sizes="(max-width: 1024px) 100vw, 420px"
                              priority
                              fetchPriority="high"
                              quality={75}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/25 to-transparent" />
                          </>
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${latest.accent}`} />
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-semibold text-slate-600">
                          Insights{latestHub ? ` / ${latestHub.title}` : ""}
                        </p>

                        <p className="mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:underline">
                          {latest.title}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">{latest.description}</p>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                          Read now <span aria-hidden="true">→</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Four Pillars immediately below hero, equal weight (Website Architecture §3.2) */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:backdrop-blur no-underline"
              >
                <span className="text-3xl" aria-hidden="true">{p.emoji}</span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-slate-950">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{p.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Products Preview only after the pillars (§3.3) */}
      {products.length > 0 ? (
        <section className="bg-gradient-to-b from-slate-50 to-white py-14 sm:py-18">
          <Container>
            <PageHeader
              level={2}
              badge="Products"
              title="Software solving real problems today"
              subtitle="Finished, usable products not prototypes."
              actions={
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
                >
                  View all Products
                </Link>
              }
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const isExternal =
                  typeof p.externalUrl === "string" && p.externalUrl.startsWith("http");
                const href = isExternal ? (p.externalUrl as string) : p.href || `/products/${p.slug}`;
                return (
                  <Link
                    key={p.slug}
                    href={href}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:backdrop-blur no-underline"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold tracking-tight text-slate-950">{p.name}</h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${p.statusColor}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{p.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Features (defer) */}
      <section className="py-14 sm:py-18" style={deferBelowFold}>
        <Container>
          <PageHeader
            level={2}
            badge="What we do"
            title="Premium build, clean delivery"
            subtitle="Websites, modern web apps, and automation systems that reduce friction and increase speed."
            actions={
              <>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
                >
                  Services
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
                >
                  Projects
                </Link>
              </>
            }
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} title={f.title} desc={f.desc} icon={f.icon} />
            ))}
          </div>

          <div className="mt-12 grid gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4 sm:backdrop-blur">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 sm:backdrop-blur">
                <p className="text-xs font-semibold tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{s.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process (defer) */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-14 sm:py-18" style={deferBelowFold}>
        <Container>
          <PageHeader
            level={2}
            badge="Process"
            title="Simple, structured delivery"
            subtitle="We keep it clean: clarify the goal, design the system, build fast, ship confidently."
            actions={
              <Link
                href="/partner"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
              >
                Partner
              </Link>
            }
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div
                key={p.step}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:backdrop-blur"
              >
                <div className="absolute -right-16 -top-16 hidden h-56 w-56 rounded-full bg-blue-200/25 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block" />
                <div className="relative">
                  <p className="text-xs font-bold tracking-wider text-slate-500">STEP {p.step}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2 font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
            >
              See services
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2 font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
            >
              View projects
            </Link>
          </div>
        </Container>
      </section>

      {/* Proof / Trust honest "what's live now" (Website Architecture §3.4) */}
      <section className="py-14 sm:py-18" style={deferBelowFold}>
        <Container>
          <PageHeader
            level={2}
            badge="Proof"
            title="What's live now"
            subtitle="No invented numbers, no anonymous quotes just what's actually shipped today."
            actions={
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
              >
                View Roadmap
              </Link>
            }
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "ProfitPilot", desc: "Payroll & business automation live / near launch." },
              { title: "FXCopilot", desc: "FX decision support live today." },
              { title: "RebirthAgro", desc: "Agriculture technology in active development." },
              { title: "Services", desc: "Build, AI & automation, infrastructure, design, and run live today." },
            ].map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition hover:shadow-lg sm:backdrop-blur"
              >
                <p className="text-sm font-bold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Company Close (§3.5) */}
      <section className="py-14 sm:py-18" style={deferBelowFold}>
        <Container>
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm sm:p-10 sm:backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold tracking-wider text-slate-500">SOLFLIGH TECH</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  A platform-plus-products company, built for African conditions first
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  We build for unreliable connectivity, volatile currency exposure, and fragmented
                  regulatory information not just the best-case enterprise customer. Solfligh
                  Cloud is the shared infrastructure our products stand on; every product we ship
                  makes that infrastructure stronger for the next one.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
              >
                About Solfligh Tech
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA (defer) */}
      <section className="py-14 sm:py-18" style={deferBelowFold}>
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50 p-8 shadow-sm sm:p-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-24 hidden h-72 w-72 rounded-full bg-blue-200/30 blur-3xl md:block" />
              <div className="absolute -right-24 -bottom-28 hidden h-80 w-80 rounded-full bg-sky-200/30 blur-3xl md:block" />
            </div>

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Ready to build something clean, fast, and scalable?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Explore our services, see the projects we're building, or reach out and let’s plan your next release.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
                >
                  Services
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white sm:backdrop-blur"
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
