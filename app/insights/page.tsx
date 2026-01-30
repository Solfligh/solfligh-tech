// app/insights/page.tsx
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/app/components/PageHeader";
import { listHubs } from "@/app/lib/insightsStore";

function InsightHeroArt() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.08),transparent_55%)]" />
      <svg viewBox="0 0 900 420" className="relative h-[220px] w-full sm:h-[260px]" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(56,189,248,0.95)" />
            <stop offset="1" stopColor="rgba(59,130,246,0.85)" />
          </linearGradient>
        </defs>

        <g opacity="0.18">
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={40 + i * 48}
              y1="30"
              x2={40 + i * 48}
              y2="390"
              stroke="rgba(15,23,42,0.45)"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="40"
              y1={60 + i * 42}
              x2="860"
              y2={60 + i * 42}
              stroke="rgba(15,23,42,0.45)"
              strokeWidth="1"
            />
          ))}
        </g>

        <path
          d="M60 300 C 160 210, 240 250, 330 190 C 420 130, 520 170, 610 120 C 700 75, 780 120, 850 85"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {[
          [60, 300],
          [330, 190],
          [610, 120],
          [850, 85],
        ].map(([x, y], idx) => (
          <circle
            key={idx}
            cx={x}
            cy={y}
            r="10"
            fill="white"
            stroke="rgba(59,130,246,0.9)"
            strokeWidth="5"
          />
        ))}

        <g>
          <rect
            x="70"
            y="70"
            rx="14"
            ry="14"
            width="230"
            height="48"
            fill="rgba(255,255,255,0.85)"
            stroke="rgba(148,163,184,0.6)"
          />
          <text x="92" y="100" fontSize="16" fontWeight="700" fill="rgba(15,23,42,0.9)">
            Plain-language clarity
          </text>

          <rect
            x="330"
            y="70"
            rx="14"
            ry="14"
            width="210"
            height="48"
            fill="rgba(255,255,255,0.85)"
            stroke="rgba(148,163,184,0.6)"
          />
          <text x="352" y="100" fontSize="16" fontWeight="700" fill="rgba(15,23,42,0.9)">
            Real-world problems
          </text>

          <rect
            x="560"
            y="70"
            rx="14"
            ry="14"
            width="260"
            height="48"
            fill="rgba(255,255,255,0.85)"
            stroke="rgba(148,163,184,0.6)"
          />
          <text x="582" y="100" fontSize="16" fontWeight="700" fill="rgba(15,23,42,0.9)">
            Built from shipped work
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function InsightsIndexPage() {
  const hubs = listHubs();

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div className="space-y-5">
          <PageHeader
            badge="Library"
            title="Insights"
            subtitle="We write to make complicated business problems feel simple and to explain how we think when building products."
          />

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Problem-aware → Solution-aware
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Zero fluff
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Built for non-technical decision makers
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">What you’ll get here</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span>Clear explanations of messy business problems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span>Frameworks you can apply immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span>Proof that our products are built with intent</span>
              </li>
            </ul>
          </div>
        </div>

        <InsightHeroArt />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Project hubs</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {hubs.map((h) => (
            <Link
              key={h.slug}
              href={h.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              {/* ✅ Cover (image if available, gradient fallback) */}
              <div className="relative h-36 w-full overflow-hidden">
                {h.coverImage ? (
                  <>
                    <Image
                      src={h.coverImage}
                      alt={`${h.title} cover`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${h.accent}`} />
                )}

                {/* Badge */}
                <div className="absolute left-5 top-5">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {h.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950 group-hover:underline">{h.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{h.description}</p>
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                  View articles <span aria-hidden="true">→</span>
                </div>
              </div>

              {/* Subtle hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-sky-200/25 blur-3xl" />
                <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
