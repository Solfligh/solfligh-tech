"use client";

import { useState } from "react";

type Kind = "contact" | "partner" | "investor";

export default function LeadForm({
  kind,
  includeFirm = false,
  buttonText,
}: {
  kind: Kind;
  includeFirm?: boolean;
  buttonText: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setOk(false);

    if (name.trim().length < 2) return setErr("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setErr("Please enter a valid email.");
    if (message.trim().length < 10) return setErr("Message must be at least 10 characters.");

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          email,
          firm: includeFirm ? firm : undefined,
          message,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send. Please try again.");
      }

      setOk(true);
      setName("");
      setEmail("");
      setFirm("");
      setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) submit();
      }}
    >
      <div>
        <label className="text-sm font-bold text-slate-950">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Your name"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-950">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
        />
      </div>

      {includeFirm && (
        <div>
          <label className="text-sm font-bold text-slate-950">Firm / Organization</label>
          <input
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            type="text"
            placeholder="Firm name (optional)"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-slate-950">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Describe the request, goals, and timeline..."
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-60"
      >
        {loading ? "Sending..." : buttonText}
      </button>

      {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
      {ok && (
        <p className="text-sm font-semibold text-emerald-700">
          Sent successfully — we’ll get back to you.
        </p>
      )}
    </form>
  );
}
