// app/waitlist/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/app/components/Container";

type ApiResponse =
  | { ok: true; stored?: boolean; message: string }
  | { ok: false; error: string };

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

export default function WaitlistPage() {
  const sp = useSearchParams();

  const product = useMemo(() => {
    const p = (sp.get("product") || "profitpilot").trim().toLowerCase();
    return p || "profitpilot";
  }, [sp]);

  const source = useMemo(() => {
    return (sp.get("source") || "waitlist_page").trim();
  }, [sp]);

  const productLabel = useMemo(() => {
    if (product === "profitpilot") return "ProfitPilot";
    return product
      .split("-")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  }, [product]);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          source,
          email,
          fullName,
          phone,
          company,
          note,
        }),
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(!data.ok ? data.error : "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "You’re in. We’ll notify you when early access opens.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-sky-200/25 blur-3xl" />
          <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/60 blur-3xl" />
        </div>

        <Container>
          <div className="relative py-12 sm:py-16">
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>Early access</Pill>
                <Pill>{productLabel}</Pill>
                <Pill>Waitlist</Pill>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Join the {productLabel} waitlist
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Get notified when early access opens. No spam — just product updates and your invite.
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {status === "success" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-950">You’re on the list ✅</p>
                    <p className="text-sm text-slate-700">{message}</p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        href="/insights/profitpilot"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                      >
                        Back to ProfitPilot hub
                      </Link>
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        Go home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Full name (optional)</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600">Company (optional)</label>
                        <input
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                          placeholder="Business name"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">Email *</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          required
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                          placeholder="you@company.com"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600">Phone (optional)</label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                          placeholder="+234…"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600">Anything you want ProfitPilot to help with? (optional)</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                        placeholder="Daily profit, cashflow, expenses, reporting…"
                      />
                    </div>

                    {status === "error" && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {message}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {status === "loading" ? "Joining..." : "Join the waitlist"}
                      </button>

                      <Link
                        href="/insights/profitpilot"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                      >
                        Back to ProfitPilot hub
                      </Link>
                    </div>

                    <p className="text-xs text-slate-500">
                      By joining, you agree to receive early-access updates for {productLabel}. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>

              <div className="mt-6 text-sm text-slate-600">
                Already joined?{" "}
                <Link href="/insights/profitpilot" className="font-semibold text-sky-700 hover:text-sky-800">
                  Read more insights
                </Link>
                .
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
