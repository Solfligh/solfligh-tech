// app/maintenance/page.tsx
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Maintenance Mode
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          We’ll be right back.
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600">
          SOLFLIGH TECH is currently undergoing updates to improve performance and stability.
          Please check back shortly.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-slate-900">Estimated downtime</p>
          <p className="mt-1 text-sm text-slate-600">We’re applying fixes now.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:support@solflightech.com"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Contact support
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              Try again
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          © 2019 SOLFLIGH TECH. All rights reserved.
        </p>
      </div>
    </main>
  );
}
