// app/waitlist/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/app/components/Container";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistPage() {
  const product = "profitpilot";

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const disabled = useMemo(() => status === "loading", [status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          fullName,
          email,
          company,
          phone,
          source: "waitlist_page",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setStatus("error");
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setSuccessMsg(
        data?.message || "You’re in. We’ll notify you when early access opens."
      );
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(59,130,246,0.10),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
        </div>

        <Container>
          <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/insights" className="font-semibold text-slate-600 hover:text-slate-900">
                Insights
              </Link>
              <span className="text-slate-400">/</span>
              <Link href="/insights/profitpilot" className="font-semibold text-slate-600 hover:text-slate-900">
                ProfitPilot
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">Waitlist</span>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Early access
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Join the ProfitPilot waitlist
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Be first to get early access when we open. No spam — just launch updates and invites.
                  </p>
                </div>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  30 seconds
                </span>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Full name (optional)</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-sky-300"
                      placeholder="e.g. Morenikeji"
                      disabled={disabled}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Email *</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-sky-300"
                      placeholder="you@company.com"
                      type="email"
                      required
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Business name (optional)</label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-sky-300"
                      placeholder="e.g. Amina Foods"
                      disabled={disabled}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Phone (optional)</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-sky-300"
                      placeholder="+234..."
                      disabled={disabled}
                    />
                  </div>
                </div>

                {status === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {status === "success" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {successMsg}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={disabled}
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
                  >
                    {status === "loading" ? "Adding you..." : "Join the waitlist"}
                  </button>

                  <Link
                    href="/insights/profitpilot"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Back to ProfitPilot hub
                  </Link>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  By joining, you agree to receive product updates. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
