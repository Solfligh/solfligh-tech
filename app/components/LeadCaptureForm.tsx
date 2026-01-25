"use client";

import { useMemo, useState } from "react";

type Props = {
  projectSlug: string;
  projectName?: string;
  source?: string; // "projects_page" | "project_detail" etc
  onSuccess?: () => void;
  compact?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

export default function LeadCaptureForm({
  projectSlug,
  projectName,
  source = "projects_page",
  onSuccess,
  compact = false,
}: Props) {
  const slug = useMemo(() => String(projectSlug || "").trim().toLowerCase(), [projectSlug]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  // honeypot (hidden)
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit() {
    setErrMsg("");
    setStatus("saving");

    try {
      const safeName = name.trim();
      const safeEmail = email.trim().toLowerCase();
      const safeCompany = company.trim();
      const safeMsg = message.trim();

      if (!slug) throw new Error("Missing project slug.");
      if (!safeName) throw new Error("Please enter your name.");
      if (!isValidEmail(safeEmail)) throw new Error("Please enter a valid email.");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: slug,
          name: safeName,
          email: safeEmail,
          company: safeCompany,
          message: safeMsg,
          source,
          website, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to submit.");

      setStatus("ok");
      onSuccess?.();
    } catch (e: any) {
      setStatus("err");
      setErrMsg(e?.message || "Failed to submit.");
    }
  }

  return (
    <div className="w-full">
      {status === "ok" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="font-semibold">You’re on the list ✅</div>
          <div className="mt-1">
            We’ll reach out when <span className="font-semibold">{projectName || slug}</span> is ready.
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Request demo / Join waitlist
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Leave your email — we’ll contact you when it’s ready.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700">
              {projectName || slug}
            </div>
          </div>

          {errMsg ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errMsg}
            </div>
          ) : null}

          <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700">Name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>

            {!compact ? (
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Company (optional)</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company"
                />
              </div>
            ) : null}

            <div className={`${compact ? "" : "sm:col-span-2"}`}>
              <label className="text-xs font-semibold text-slate-700">Message (optional)</label>
              <textarea
                className="mt-2 w-full min-h-[90px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What do you want to see in the demo?"
              />
            </div>

            {/* Honeypot: hidden field for bots */}
            <div className="hidden">
              <label>Website</label>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={status === "saving"}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
            >
              {status === "saving" ? "Submitting…" : "Join waitlist"}
            </button>

            <p className="text-xs text-slate-500">
              No spam. Just updates about this project.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
