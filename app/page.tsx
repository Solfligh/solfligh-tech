// app/page.tsx
import Link from "next/link";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

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
    desc: "We design interfaces that look modern, load fast, and convert  without sacrificing clarity.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M7 7h10M7 12h10M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Web apps built for scale",
    desc: "Next.js + modern tooling, structured codebases, and production-ready performance from day one.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M7 16V8m5 10V6m5 12v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automation that saves real time",
    desc: "From internal ops to customer workflows  we remove repetitive work and reduce human error.",
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

const testimonials = [
  {
    quote:
      "You can feel the difference  everything is clean, premium, and structured. It’s not just a website; it’s a foundation.",
    name: "Founder",
    title: "Digital Product",
  },
  {
    quote:
      "The UI looks expensive, but it’s still simple. And the workflows are actually practical  no fluff.",
    name: "Operator",
    title: "SME Team",
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function Card({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-200/30 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-sky-200/30 blur-2xl" />
      </div>

      <div className="relative">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-900 shadow-sm">
          {icon}
        </div>
        <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-blue-200/35 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-sky-200/35 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/60 blur-3xl" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
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
                  <Chip>Technology</Chip>
                  <Chip>Innovation</Chip>
                  <Chip>Getting you back your time</Chip>
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                  Build modern products that{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    save time
                  </span>{" "}
                  and scale.
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                  SOLFLIGH TECH designs and builds premium websites, web apps, and automation systems that make
                  businesses faster, clearer, and more profitable.
                </p>

                {/* Only PRIMARY Contact CTA here */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  >
                    Contact us
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
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300/40"
                  >
                    View projects
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

              {/* Right-side mock dashboard card */}
              <div className="lg:max-w-md">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg backdrop-blur">
                  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/35 blur-2xl" />
                  <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-sky-200/35 blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-slate-500">LIVE OVERVIEW</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">Operations snapshot</p>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        Premium
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3">
                        <p className="text-xs text-slate-500">Revenue</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">$42.8k</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                          <div className="h-1.5 w-2/3 rounded-full bg-emerald-500/70" />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3">
                        <p className="text-xs text-slate-500">Costs</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">$18.4k</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                          <div className="h-1.5 w-1/3 rounded-full bg-rose-500/70" />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3">
                        <p className="text-xs text-slate-500">Net</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">$24.4k</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                          <div className="h-1.5 w-1/2 rounded-full bg-sky-600/70" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">Activity</p>
                        <p className="text-xs text-slate-500">Today</p>
                      </div>
                      <div className="mt-3 space-y-2">
                        {[
                          { t: "Deployment", d: "New release shipped", pill: "OK" },
                          { t: "Automation", d: "Workflow completed", pill: "DONE" },
                          { t: "Support", d: "Response sent", pill: "FAST" },
                        ].map((row) => (
                          <div
                            key={row.t}
                            className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2"
                          >
                            <div>
                              <p className="text-xs font-semibold text-slate-900">{row.t}</p>
                              <p className="text-xs text-slate-500">{row.d}</p>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
                              {row.pill}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Removed extra "Start" (contact) CTA here to avoid duplicates */}
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  Clean visuals, real structure  designed to feel premium while staying simple and readable.
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
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
                  >
                    <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-900">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* One small extra link row (no contact) */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  Explore projects
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  See services →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-18">
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
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  Services
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
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

          <div className="mt-12 grid gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{s.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-14 sm:py-18">
        <Container>
          <PageHeader
            level={2}
            badge="Process"
            title="Simple, structured delivery"
            subtitle="We keep it clean: clarify the goal, design the system, build fast, ship confidently."
            actions={
              <Link
                href="/partner"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
              >
                Partner
              </Link>
            }
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div
                key={p.step}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
              >
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/25 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <p className="text-xs font-bold tracking-wider text-slate-500">STEP {p.step}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No contact button here */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              See services
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              View projects
            </Link>
          </div>
        </Container>
      </section>

      {/* Proof / Testimonials */}
      <section className="py-14 sm:py-18">
        <Container>
          <PageHeader
            level={2}
            badge="Proof"
            title="Built with clarity"
            subtitle="We keep things simple: strong visuals, strong engineering, and clean delivery."
            actions={
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
              >
                View projects
              </Link>
            }
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-7 shadow-sm backdrop-blur transition hover:shadow-lg"
              >
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="relative">
                  <p className="text-sm leading-relaxed text-slate-700">“{t.quote}”</p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No contact button here */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:flex-row">
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-900">Want your product to feel premium?</p>
              <p className="mt-1 text-sm text-slate-600">See the work then reach out when you’re ready.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/partner"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
              >
                Partner
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
              >
                Projects
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA (Keep ONE contact button here) */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50 p-8 shadow-sm sm:p-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
              <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Ready to build something clean, fast, and scalable?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Explore our services, see the projects we’re building, or reach out and let’s plan your next release.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  Services
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
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
