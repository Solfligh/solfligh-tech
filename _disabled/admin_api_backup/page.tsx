"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState<string>("");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Admin</h1>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
          >
            ← Back to site
          </Link>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          This is the admin area. Next step we’ll add “Projects manager” + uploads.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <label className="text-sm font-semibold text-slate-900">
            Admin Token (we will use this to protect uploads)
          </label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your ADMIN_TOKEN here (later)"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none ring-sky-200 focus:ring-2"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMsg(token ? "✅ Token saved locally (for this session)." : "Enter a token first.")}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Save token
            </button>

            <button
              type="button"
              onClick={() => {
                setToken("");
                setMsg("Cleared.");
              }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              Clear
            </button>
          </div>

          {msg ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
              {msg}
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-bold text-slate-900">Next step</h2>
          <p className="mt-2 text-sm text-slate-700">
            We will add:
            <span className="block mt-1">
              • Create project (name, slug, status, description)
            </span>
            <span className="block">
              • Upload demo video + images
            </span>
            <span className="block">
              • Auto-show them on /projects and the project details page
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
